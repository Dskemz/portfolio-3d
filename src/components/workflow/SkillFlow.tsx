"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  INTRO,
  ORIGIN_ID,
  WORKFLOW_NODES,
  getNodeAnchorId,
  getNodeCardId,
  getNodeExitId,
} from "@/content/workflowData";
import WorkflowCard from "./WorkflowCard";
import SkillFlowMobile from "./SkillFlowMobile";
import {
  HOME_JUMP_EVENT,
  INTRO_GRAB_VH,
  LINE_VH,
  STEP_COOLDOWN_MS,
  SWIPE_MIN_DELTA,
  WHEEL_MIN_DELTA,
  animateScrollTo,
} from "./stepping";

const BREAKPOINT = 1024;
/** Descente maximale avant le coude à 90°. Réduite au besoin par segment (voir build). */
const DROP = 88;
/** Descente minimale : garantit que le tracé ne remonte jamais sur lui-même. */
const MIN_DROP = 2;
/** Rayon des coudes du circuit, en px. Clampé par segment dans emitPolyline. */
const CORNER_R = 11;

/**
 * Fiches secondaires décalées à GAUCHE de l'axe (les autres restent à droite).
 * Alternance voulue : 01 centre · 02 droite · 03 centre · 04 gauche ·
 * 05 centre · 06 droite · 07 centre.
 * Le circuit est reconstruit à partir des pastilles mesurées dans le DOM :
 * le fil orange suit donc automatiquement le nouveau côté, à angles droits.
 */
const LEFT_SIDE_IDS = new Set<string>(["uv-pbr"]);

/**
 * Largeur des fiches. Sur un viewport court (1080p, portable), on ÉLARGIT :
 * une colonne de texte plus large = moins de retours à la ligne = fiche moins
 * haute, donc plus d'air autour d'elle une fois centrée. Sur un grand écran,
 * les valeurs d'origine sont conservées telles quelles.
 *
 * Ces chaînes doivent rester littérales : Tailwind scanne le source brut.
 */
const W_PRINCIPALE =
  "mx-auto w-[54%] [@media(max-height:900px)]:w-[61%] [@media(max-height:760px)]:w-[68%]";
const W_SECONDAIRE =
  "w-[32%] [@media(max-height:900px)]:w-[35%] [@media(max-height:760px)]:w-[39%]";

/* ─────────── Mode cranté (« QTE ») ─────────── */

/** Marge de franchissement d'un seuil (le front doit dépasser l'ancre, pas l'effleurer). */
const THRESHOLD_EPS = 0.0005;
/** Tolérance (px) pour considérer qu'on est encore posé sur la fiche courante. */
const PARK_TOL = 6;

type Mode = "desktop" | "mobile";
interface Point { x: number; y: number }
interface Geometry { entry: Point; exit: Point }

interface Built {
  d: string;
  length: number;
  /** Progression (0–1) à laquelle le front touche l'ancre de chaque fiche */
  thresholds: Record<string, number>;
}

const EMPTY: Built = { d: "", length: 0, thresholds: {} };

/* ─────────── Polyligne orthogonale avec arrondis légers et synchro millimétrique ─────────── */

function emitPolyline(points: Point[], cornerRadius = CORNER_R) {
  const pts: Point[] = [];
  /**
   * mapIdx[i] = index, dans `pts`, du point issu de points[i]. Sans cette table,
   * une seule déduplication décalait toutes les estimations de longueur d'un cran
   * et faisait chercher les seuils au mauvais endroit du tracé.
   */
  const mapIdx: number[] = [];
  for (const p of points) {
    const last = pts[pts.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.5 || Math.abs(last.y - p.y) > 0.5) pts.push(p);
    mapIdx.push(pts.length - 1);
  }
  if (pts.length < 2) return { d: "", length: 0, at: [0] };

  const out: string[] = [`M ${pts[0].x} ${pts[0].y}`];
  const nodeLengths: number[] = [0];
  let currentLengthEstimate = 0;

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];

    if (i === pts.length - 1) {
      out.push(`L ${cur.x} ${cur.y}`);
      currentLengthEstimate += Math.hypot(cur.x - prev.x, cur.y - prev.y);
      nodeLengths.push(currentLengthEstimate);
      break;
    }

    const next = pts[i + 1];
    const isHorizontal = Math.abs(cur.y - prev.y) < 0.5;
    const nextIsHorizontal = Math.abs(next.y - cur.y) < 0.5;

    let segmentLen = 0;
    if (isHorizontal !== nextIsHorizontal) {
      // Le rayon ne peut jamais dépasser la moitié du plus court des deux
      // segments adjacents, sinon les coudes se chevauchent sur les jogs courts.
      const lenPrev = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      const lenNext = Math.hypot(next.x - cur.x, next.y - cur.y);
      const r = Math.min(cornerRadius, lenPrev / 2, lenNext / 2);
      const x1 = cur.x + (prev.x > cur.x ? r : prev.x < cur.x ? -r : 0);
      const y1 = cur.y + (prev.y > cur.y ? r : prev.y < cur.y ? -r : 0);
      const x2 = cur.x + (next.x > cur.x ? r : next.x < cur.x ? -r : 0);
      const y2 = cur.y + (next.y > cur.y ? r : next.y < cur.y ? -r : 0);

      out.push(`L ${x1} ${y1}`);
      segmentLen += Math.hypot(x1 - prev.x, y1 - prev.y);

      out.push(`Q ${cur.x} ${cur.y} ${x2} ${y2}`);
      segmentLen += Math.hypot(x2 - x1, y2 - y1);
    } else {
      out.push(`L ${cur.x} ${cur.y}`);
      segmentLen += Math.hypot(cur.x - prev.x, cur.y - prev.y);
    }

    currentLengthEstimate += segmentLen;
    nodeLengths.push(currentLengthEstimate);
  }

  const d = out.join(" ");
  let length = 0;
  const at: number[] = [0];

  if (typeof document !== "undefined") {
    const svgTemp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const pathTemp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathTemp.setAttribute("d", d);
    svgTemp.appendChild(pathTemp);
    document.body.appendChild(svgTemp);

    try {
      length = pathTemp.getTotalLength();

      for (let k = 0; k < points.length; k++) {
        const pt = points[k];
        let bestL = 0;
        let minD = Infinity;
        const est = nodeLengths[mapIdx[k]] || 0;
        const startSearch = Math.max(0, est - 20);
        const endSearch = Math.min(length, est + 20);

        for (let l = startSearch; l <= endSearch; l += 1) {
          const p = pathTemp.getPointAtLength(l);
          const dXY = Math.hypot(p.x - pt.x, p.y - pt.y);
          if (dXY < minD) {
            minD = dXY;
            bestL = l;
          }
        }
        at[k] = bestL;
      }
    } catch {
      length = 1;
    }
    document.body.removeChild(svgTemp);
  }

  return { d, length, at };
}

/* ─────────── Construction du circuit unique ─────────── */

function build(origin: Point, geo: Record<string, Geometry>): Built {
  const firstNode = WORKFLOW_NODES[0];
  const firstGeo = firstNode ? geo[firstNode.id] : null;

  const points: Point[] = [origin];

  if (firstGeo) {
    points.push({ x: origin.x, y: firstGeo.entry.y });
  }

  const marks: Record<string, number> = {};

  /** Sortie de la fiche précédente, en attente du raccord vers la suivante. */
  let pendingExit: Point | null = null;

  for (let i = 0; i < WORKFLOW_NODES.length; i++) {
    const node = WORKFLOW_NODES[i];
    const g = geo[node.id];
    if (!g) return EMPTY;

    if (i > 0 && pendingExit) {
      const gap = g.entry.y - pendingExit.y;

      if (Math.abs(pendingExit.x - g.entry.x) > 0.5) {
        /**
         * Le décrochage latéral se fait à mi-chemin, jamais plus bas.
         * Avant, la descente valait DROP des deux côtés : dès que l'écart
         * vertical entre deux fiches passait sous 2 × DROP, le point haut du
         * raccord se retrouvait AU-DESSUS du point bas et le tracé remontait
         * sur lui-même (la « boucle »). Le plafond à gap / 2 rend ce cas
         * impossible quelle que soit la hauteur de viewport.
         */
        const drop = Math.max(MIN_DROP, Math.min(DROP, gap / 2));
        const jogY = pendingExit.y + drop;
        points.push({ x: pendingExit.x, y: jogY });
        points.push({ x: g.entry.x, y: jogY });
      }

      points.push({ x: g.entry.x, y: g.entry.y });
    }

    marks[node.id] = i > 0 ? points.length - 1 : 1;

    if (node.kind === "terminal") {
      points.push({ x: g.entry.x, y: g.entry.y + 400 });
      break;
    }

    points.push({ x: g.exit.x, y: g.exit.y });
    pendingExit = { x: g.exit.x, y: g.exit.y };
  }

  const { d, length, at } = emitPolyline(points);
  if (!length) return EMPTY;

  const thresholds: Record<string, number> = {};
  for (const [id, index] of Object.entries(marks)) {
    thresholds[id] = Math.min(1, (at[index] ?? length) / length);
  }

  return { d, length, thresholds };
}

/* ═══════════════════════════════════════════════════════════ */

export default function SkillFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<SVGPathElement>(null);

  const [mode, setMode] = useState<Mode>("desktop");
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [built, setBuilt] = useState<Built>(EMPTY);
  const [litIds, setLitIds] = useState<string[]>([]);
  const [headId, setHeadId] = useState<string | null>(null);
  const [receding, setReceding] = useState(false);
  const [armed, setArmed] = useState(false);

  const modeRef = useRef<Mode>("desktop");
  const builtRef = useRef<Built>(EMPTY);
  const previous = useRef(0);
  const ruler = useRef<{ ys: number[]; ls: number[]; total: number }>({
    ys: [],
    ls: [],
    total: 0,
  });

  /** Fiche courante : -1 = accueil, 0…n = index dans WORKFLOW_NODES */
  const stepRef = useRef(-1);
  /**
   * Fiche sur laquelle un cran nous a délibérément posés. Distinct de stepRef,
   * qui est recalculé depuis le scroll : le cap doux se basait sur stepRef, lui-même
   * dérivé de la valeur plafonnée par ce cap — la boucle de rétroaction faisait
   * osciller l'allumage à chaque frame (clignotement + re-render permanent).
   */
  const parkedStepRef = useRef(-1);
  /** Une animation de cran est en cours : toute nouvelle entrée est ignorée */
  const lockRef = useRef(false);
  /** Position de scroll du dernier cran abouti (-1 = jamais crantée) */
  const parkedRef = useRef(-1);
  /** Annulation de l'animation de cran en cours, s'il y en a une. */
  const cancelRef = useRef<(() => void) | null>(null);
  /**
   * Flag stable : une fois qu'on a VRAIMENT entré en mode stepped (première fiche
   * allumée via goToStep), on y reste. Élimine les bascules aléatoires dues aux
   * variations micrométriques de scrollY au démarrage.
   */
  const enteredSteppedRef = useRef(false);
  /** Suivi du swipe sur mobile/tablette : {x, y} de touchstart. */
  const touchStartRef = useRef<{x: number; y: number} | null>(null);

  /* ── Mesure (desktop uniquement) ── */
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || modeRef.current === "mobile") return;

    const box = container.getBoundingClientRect();

    const relCenter = (el: HTMLElement): Point => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
      };
    };

    const originEl = document.getElementById(ORIGIN_ID);
    if (!originEl) return;

    const geo: Record<string, Geometry> = {};
    for (const node of WORKFLOW_NODES) {
      const entry = document.getElementById(getNodeAnchorId(node.id));
      if (!entry) continue;

      if (node.kind === "terminal") {
        const entryPoint = relCenter(entry);
        geo[node.id] = {
          entry: entryPoint,
          exit: { x: entryPoint.x, y: entryPoint.y + 500 },
        };
      } else {
        const exit = document.getElementById(getNodeExitId(node.id));
        geo[node.id] = { entry: relCenter(entry), exit: relCenter(exit!) };
      }
    }

    const next = build(relCenter(originEl), geo);
    builtRef.current = next;
    setSize({ width: container.offsetWidth, height: container.offsetHeight });
    setBuilt(next);
  }, []);

  useLayoutEffect(() => {
    const detect = () => {
      const next: Mode = window.innerWidth < BREAKPOINT ? "mobile" : "desktop";
      modeRef.current = next;
      setMode(next);
      if (next === "desktop") measure();
      else {
        builtRef.current = EMPTY;
        setBuilt(EMPTY);
      }
    };

    detect();

    // Mesure supplémentaire rapide après le layout pour capturer les bonnes positions
    // avant que l'utilisateur n'interagisse
    const timeoutId = setTimeout(() => {
      if (modeRef.current === "desktop") measure();
    }, 16);

    const observer = new ResizeObserver(() => {
      if (modeRef.current === "desktop") measure();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(detect).catch(() => {});
    window.addEventListener("resize", detect);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener("resize", detect);
    };
  }, [measure]);

  /* ── Échantillonnage y → longueur, pour une avancée 1:1 ── */
  useEffect(() => {
    const path = rulerRef.current;
    if (!path || !built.d) {
      ruler.current = { ys: [], ls: [], total: 0 };
      return;
    }
    let total = 0;
    try {
      total = path.getTotalLength();
    } catch {
      total = 0;
    }
    if (!total) {
      ruler.current = { ys: [], ls: [], total: 0 };
      return;
    }

    const steps = 360; // réduit pour perf sur vieux appareils, visuellement imperceptible
    const ys = new Array<number>(steps + 1);
    const ls = new Array<number>(steps + 1);
    let maxY = -Infinity;
    for (let i = 0; i <= steps; i++) {
      const l = (total * i) / steps;
      const p = path.getPointAtLength(l);
      maxY = Math.max(maxY, p.y);
      ys[i] = maxY;
      ls[i] = l;
    }
    ruler.current = { ys, ls, total };
  }, [built.d]);

  /* ── Mode cranté : un cran d'entrée = une fiche ── */

  /** Inverse de lengthAtY : longueur sur le tracé → ordonnée dans le conteneur. */
  const yAtLength = useCallback((target: number) => {
    const { ys, ls, total } = ruler.current;
    if (!total || !ys.length) return 0;
    if (target <= 0) return ys[0];
    if (target >= total) return ys[ys.length - 1];
    let lo = 0;
    let hi = ls.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ls[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const span = ls[i] - ls[i - 1];
    const ratio = span > 0.0001 ? (target - ls[i - 1]) / span : 0;
    return ys[i - 1] + (ys[i] - ys[i - 1]) * ratio;
  }, []);

  /** Position de scroll à laquelle le front touche l'ancre de la fiche `index`. */
  const anchorScrollFor = useCallback(
    (index: number): number | null => {
      const container = containerRef.current;
      const node = WORKFLOW_NODES[index];
      const { total } = ruler.current;
      if (!container || !node || !total) return null;

      const threshold = builtRef.current.thresholds[node.id];
      if (threshold === undefined) return null;

      // +1 px de marge : le seuil doit être franchi, pas seulement atteint.
      const y = yAtLength(Math.min(total, threshold * total + 1));
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight || 1;

      return Math.round(y + containerTop - vh * LINE_VH + 2);
    },
    [yAtLength]
  );

  /** Position de scroll qui met la fiche `index` au centre exact du viewport. */
  const centerScrollFor = useCallback((index: number): number | null => {
    const node = WORKFLOW_NODES[index];
    const card = node && document.getElementById(getNodeCardId(node.id));
    if (!card) return null;
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const top = rect.top + window.scrollY;

    // Une fiche plus haute que l'écran ne peut pas être centrée sans être rognée
    // des deux côtés : on cale son haut, on garde son début lisible.
    if (rect.height > vh * 0.92) return Math.round(top - vh * 0.1);

    return Math.round(top + rect.height / 2 - vh / 2);
  }, []);

  /**
   * Cible retenue pour un cran : la fiche est centrée, mais jamais avant sa
   * position d'allumage (plancher) ni au-delà de l'ancre de la suivante (plafond),
   * sinon la fiche d'après s'allumerait en avance.
   */
  const scrollTargetFor = useCallback(
    (index: number): number | null => {
      if (index < 0) return 0;

      const floor = anchorScrollFor(index);
      if (floor === null) return null;

      // La fiche est centrée, mais jamais avant sa position d'allumage.
      // Le front, lui, est plafonné à son ancre dans compute() : la page peut
      // donc continuer de descendre pour centrer sans que le fil déborde.
      const centered = centerScrollFor(index);
      const wanted = centered === null ? floor : Math.max(centered, floor);

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      return Math.min(maxScroll, Math.max(0, wanted));
    },
    [anchorScrollFor, centerScrollFor]
  );

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(-1, Math.min(WORKFLOW_NODES.length - 1, index));
      if (clamped === stepRef.current) return;

      const target = scrollTargetFor(clamped);
      if (target === null) return;

      stepRef.current = clamped;
      parkedStepRef.current = clamped;
      parkedRef.current = target;

      // ✓ Marque qu'on est VRAIMENT entré en mode stepped (première fiche atteinte).
      // Une fois posé, ce flag ne se réinitialise que via HOME_JUMP_EVENT.
      if (clamped >= 0) {
        enteredSteppedRef.current = true;
      }

      if (Math.abs(target - window.scrollY) < 1) return;

      lockRef.current = true;
      cancelRef.current?.();

      cancelRef.current = animateScrollTo(target, () => {
        cancelRef.current = null;
        window.setTimeout(() => {
          lockRef.current = false;
        }, STEP_COOLDOWN_MS);
      });
    },
    [scrollTargetFor]
  );

  useEffect(() => {
    if (mode !== "desktop") return;

    const LAST_INDEX = WORKFLOW_NODES.length - 1;

    /**
     * Vérifie si la première fiche est assez proche pour qu'on capture le scroll.
     * Utilisé UNIQUEMENT avant d'avoir entré en mode stepped (première vérification).
     *
     * Capture TRÈS agressivement dès que l'utilisateur scroll vers le bas :
     * - Après ~30px de scroll, ou
     * - Si l'ancre est dans le viewport (vérification géométrique)
     *
     * Cela élimine le "premier scroll libre" qui dépasse la première fiche.
     */
    const firstFicheApproaches = () => {
      // Dès 30px de scroll vers le bas, on capture immédiatement
      // Élimine l'inertie du trackpad et les micro-gestes
      if (window.scrollY > 30) return true;

      const first = WORKFLOW_NODES[0];
      const anchor = first && document.getElementById(getNodeAnchorId(first.id));
      if (!anchor) return true;
      return anchor.getBoundingClientRect().top <= window.innerHeight * INTRO_GRAB_VH;
    };

    /** Position d'accroche de la fiche terminale. */
    const tailAnchor = () => scrollTargetFor(LAST_INDEX);

    /** Posé sur la fiche terminale : la descente vers le footer redevient libre. */
    const tailReached = () => {
      if (stepRef.current !== LAST_INDEX) return false;
      const target = tailAnchor();
      return target !== null && window.scrollY >= target - 2;
    };

    /** Sous la fiche terminale : la remontée est libre jusqu'à retrouver l'accroche. */
    const belowTail = () => {
      const target = tailAnchor();
      return target !== null && window.scrollY > target + 2;
    };

    /**
     * Renvoie true si l'événement est consommé par la visite guidée.
     * Une fois qu'on a VRAIMENT entré en mode stepped (première fiche allumée),
     * on capture TOUS les scrolls sauf ceux vers la fin du document.
     * Avant d'y entrer, on vérifie seulement que la première fiche approche.
     */
    const consume = (direction: 1 | -1) => {
      if (!builtRef.current.length) return false;

      // Avant d'être entré en mode stepped : vérifier que la 1re fiche approche.
      if (!enteredSteppedRef.current) {
        // Si on scroll vers le bas ET la première fiche approche, on entre.
        if (direction === 1 && firstFicheApproaches()) {
          goToStep(0); // Cela posera enteredSteppedRef = true
          return true;
        }
        // Sinon, la molette est libre.
        return false;
      }

      // En mode stepped : capturer tous les scrolls sauf ceux qui libèrent explicitement.
      if (direction === 1) {
        if (tailReached()) return false;
      } else {
        if (belowTail()) return false;
      }

      goToStep(stepRef.current + direction);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (!builtRef.current.length) return;
      if (Math.abs(event.deltaY) < WHEEL_MIN_DELTA) return;

      // Pendant une animation de cran, aucune entrée ne doit faire bouger la page.
      if (lockRef.current) {
        event.preventDefault();
        return;
      }

      // Vérifier IMMÉDIATEMENT si ce scroll doit être consommé
      const shouldConsume = consume(event.deltaY > 0 ? 1 : -1);
      if (shouldConsume) {
        event.preventDefault();
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (!builtRef.current.length) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      let direction: 1 | -1 | 0 = 0;
      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          direction = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          direction = -1;
          break;
        case "Home":
          event.preventDefault();
          goToStep(-1);
          return;
        case "End":
          event.preventDefault();
          goToStep(LAST_INDEX);
          return;
        default:
          return;
      }

      if (lockRef.current) {
        event.preventDefault();
        return;
      }
      if (consume(direction)) event.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) touchStartRef.current = {x: touch.clientX, y: touch.clientY};
    };

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      if (!start) return;
      const end = e.changedTouches[0];
      if (!end) return;

      const dy = start.y - end.clientY; // positif = swipe vers le haut
      if (Math.abs(dy) < SWIPE_MIN_DELTA) return;

      if (lockRef.current) {
        e.preventDefault();
        return;
      }

      if (consume(dy > 0 ? 1 : -1)) e.preventDefault();
      touchStartRef.current = null;
    };

    /**
     * Clic sur le logo : on abandonne le cran en vol et on oublie l'état de la
     * visite. `compute()` fait le reste du ménage dès que scrollY repasse sous 10.
     */
    const onHomeJump = () => {
      cancelRef.current?.();
      cancelRef.current = null;
      lockRef.current = false;
      stepRef.current = -1;
      parkedStepRef.current = -1;
      parkedRef.current = -1;
      // ✓ Réinitialise l'entrée en mode stepped, pour recommencer depuis zéro.
      enteredSteppedRef.current = false;
    };

    window.addEventListener(HOME_JUMP_EVENT, onHomeJump);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(HOME_JUMP_EVENT, onHomeJump);
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, [mode, goToStep, scrollTargetFor]);

  /* ── Moteur de scroll : 1:1, aucune inertie, strictement réversible ── */
  const progress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;

    const lengthAtY = (y: number) => {
      const { ys, ls, total } = ruler.current;
      if (!total || !ys.length) return 0;
      if (y <= ys[0]) return 0;
      if (y >= ys[ys.length - 1]) return total;
      let lo = 0;
      let hi = ys.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      const i = Math.max(1, lo);
      const span = ys[i] - ys[i - 1];
      const ratio = span > 0.0001 ? (y - ys[i - 1]) / span : 0;
      return ls[i - 1] + (ls[i] - ls[i - 1]) * ratio;
    };

    const compute = () => {
      frame = 0;
      const container = containerRef.current;
      if (!container) return;

      if (window.scrollY < 10) {
        progress.set(0);
        setArmed(false);
        setLitIds([]);
        setHeadId(null);
        setReceding(false);
        previous.current = 0;
        if (!lockRef.current) {
          stepRef.current = -1;
          parkedStepRef.current = -1;
          parkedRef.current = -1;
          // ✓ Réinitialise aussi l'entrée en mode stepped : la visite recommence.
          enteredSteppedRef.current = false;
        }
        return;
      }

      const vh = window.innerHeight || 1;
      const rect = container.getBoundingClientRect();
      const lineY = vh * LINE_VH - rect.top;
      const total = ruler.current.total;
      let value = total > 0 ? Math.min(1, Math.max(0, lengthAtY(lineY) / total)) : 0;

      const table = builtRef.current.thresholds;

      // Cap dur : le flux s'arrête NET sur la fiche terminale, quoi qu'il arrive
      // en dessous (descente libre vers le footer).
      const lastNode = WORKFLOW_NODES[WORKFLOW_NODES.length - 1];
      const hardCap = lastNode ? table[lastNode.id] : undefined;
      if (hardCap !== undefined) value = Math.min(value, hardCap + THRESHOLD_EPS);

      // Cap doux : posé sur une fiche, le front s'arrête à son ancre. La page peut
      // descendre davantage pour la centrer sans que le fil ressorte par-dessous.
      // Le cap se base sur parkedStepRef (le cran VISÉ), jamais sur stepRef, qui est
      // dérivé de `value` : sinon le cap se resserrerait sur sa propre sortie.
      const parked =
        lockRef.current ||
        (parkedRef.current >= 0 &&
          Math.abs(window.scrollY - parkedRef.current) <= PARK_TOL);

      if (parked && parkedStepRef.current >= 0) {
        const t = table[WORKFLOW_NODES[parkedStepRef.current]?.id ?? ""];
        if (t !== undefined) value = Math.min(value, t + THRESHOLD_EPS);
      }

      progress.set(value);
      const nextArmed = value > 0.0003;
      setArmed((p) => (p === nextArmed ? p : nextArmed));

      const nextLit: string[] = [];
      for (const node of WORKFLOW_NODES) {
        const t = table[node.id];
        if (t !== undefined && value >= t) nextLit.push(node.id);
      }

      const goingBack = value < previous.current - 0.0002;
      previous.current = value;

      // Hors des crans (barre de défilement, sas d'accueil, descente vers le footer),
      // on recale le cran courant sur ce qui est réellement allumé. Tant qu'on est
      // posé, on n'y touche pas : c'est le cran qui fait autorité, pas l'inverse.
      if (!parked) {
        const last = nextLit.length ? nextLit[nextLit.length - 1] : null;
        const derived = last
          ? WORKFLOW_NODES.findIndex((n) => n.id === last)
          : -1;
        stepRef.current = derived;
        parkedStepRef.current = derived;
      }

      setReceding((p) => (p === goingBack ? p : goingBack));
      setHeadId((p) => {
        const n = nextLit.length ? nextLit[nextLit.length - 1] : null;
        return p === n ? p : n;
      });
      setLitIds((p) =>
        p.length === nextLit.length && p.every((id, i) => id === nextLit[i]) ? p : nextLit
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [progress]);

  const trailOffset = useTransform(progress, (v) => built.length * (1 - v));
  const trailOpacity = useTransform(progress, [0, 0.0012], [0, 1]);
  const dash = `${built.length} ${built.length}`;

  const isMobile = mode === "mobile";
  const litSet = useMemo(() => new Set(litIds), [litIds]);

  /* ═══════ MOBILE — composant dédié ═══════ */
  if (isMobile) {
    return <SkillFlowMobile />;
  }

  /* ═══════ Accueil — hors workflow, centré ═══════ */
  const intro = (
    <header className="px-10 pb-12 pt-44">
      <div className="mx-auto flex w-full max-w-[84rem] flex-col items-center text-center">
        {/*
          La ligne de rôle est DANS le <h1>, pas dans un <p> voisin.
          Rendu strictement identique (le span réinitialise taille, graisse,
          interlettrage et interlignage hérités), mais les mots-clés passent du
          corps de texte au seul <h1> de la page — c'est le signal le plus fort
          que Google lit sur un document.
        */}
        <h1 className="font-display text-[clamp(2.6rem,6.4vw,5rem)] font-light leading-[1.02] tracking-[-0.02em] text-white">
          {INTRO.name}
          <span className="mt-5 block text-sm font-normal uppercase leading-normal tracking-[0.2em] text-[#FF7F50] md:text-base">
            {INTRO.role}
          </span>
        </h1>
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-zinc-400">
          {INTRO.quote}
        </p>
      </div>

      {/* Amorce : unique élément lumineux avant le premier scroll */}
      <div className="mt-16 flex flex-col items-center">
        <motion.span
          id={ORIGIN_ID}
          className="block h-3 w-3 rounded-full bg-[#FF7F50]"
          animate={
            armed
              ? { scale: 1, boxShadow: "0 0 20px 5px rgba(255,127,80,0.75)" }
              : {
                  scale: [1, 1.35, 1],
                  boxShadow: [
                    "0 0 10px 2px rgba(255,127,80,0.45)",
                    "0 0 28px 8px rgba(255,127,80,0.8)",
                    "0 0 10px 2px rgba(255,127,80,0.45)",
                  ],
                }
          }
          transition={
            armed ? { duration: 0.25 } : { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.p
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600"
          animate={{ opacity: armed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {INTRO.hint}
        </motion.p>
      </div>
    </header>
  );

  /* ═══════ DESKTOP ═══════ */
  return (
    <div ref={containerRef} className="relative w-full">
      {intro}

      {/* Règle invisible : échantillonnage y → longueur */}
      <svg aria-hidden width={0} height={0} className="absolute" style={{ visibility: "hidden" }}>
        <path ref={rulerRef} d={built.d} fill="none" />
      </svg>

      {size.width > 0 && built.length > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-0"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="xMidYMin meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          {/*
            Halo par traits empilés, PLUS AUCUN filtre SVG.
            L'ancien `sf-emission` empilait deux feGaussianBlur (dont un à 7) sur une
            région de 240 % de la bbox — soit toute la hauteur de page — et le
            navigateur la rastérisait à CHAQUE frame, puisque strokeDashoffset change
            en continu pendant un cran. C'était le poste de coût principal du lag.
            Trois traits concentriques donnent le même rendu pour un trait de 1,3 px,
            à un coût négligeable.
          */}
          {[
            { w: 9, o: 0.07 },
            { w: 4.4, o: 0.14 },
            { w: 1.3, o: 1 },
          ].map((layer) => (
            <motion.path
              key={layer.w}
              d={built.d}
              fill="none"
              stroke="#FF7F50"
              strokeWidth={layer.w}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeDasharray={dash}
              strokeOpacity={layer.o}
              style={{ strokeDashoffset: trailOffset, opacity: trailOpacity }}
            />
          ))}
        </svg>
      )}

      <section
        aria-label="Processus de production 3D"
        className="relative w-full px-10 pb-40"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-[84rem] flex-col">
          {WORKFLOW_NODES.map((node, index) => {
            const isSecondary = node.kind === "secondaire";
            /*
              Tailwind est mobile-first : `md:` = min-width 768px, SANS borne haute.
              Les variantes `md:mt-[20vh] / md:mt-[28vh]` censées viser la tablette
              s'appliquaient donc aussi au desktop et divisaient les espacements par
              ~1,7. Elles étaient de surcroît inutiles ici : sous BREAKPOINT (1024px)
              c'est SkillFlowMobile qui rend, ce composant ne voit jamais 768–1023px.
              Une seule valeur, celle du desktop.
            */
            const spacing = index === 0
              ? "mt-[16vh]"
              : isSecondary
                ? "mt-[34vh]"
                : "mt-[44vh]";
            const width = isSecondary
              ? LEFT_SIDE_IDS.has(node.id)
                ? `mr-auto ${W_SECONDAIRE}`
                : `ml-auto ${W_SECONDAIRE}`
              : W_PRINCIPALE;

            return (
              <div key={node.id} className={spacing}>
                <div className={width}>
                  <WorkflowCard
                    node={node}
                    lit={litSet.has(node.id)}
                    isHead={headId === node.id}
                    receding={receding}
                    stepped
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}