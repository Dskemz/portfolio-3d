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

const BREAKPOINT = 1024;
const LINE_VH = 0.62; // ligne de front du flux dans le viewport
const DROP = 88; // descente avant le coude à 90°

/**
 * Fiches secondaires décalées à GAUCHE de l'axe (les autres restent à droite).
 * Alternance voulue : 01 centre · 02 droite · 03 centre · 04 gauche ·
 * 05 centre · 06 droite · 07 centre.
 * Le circuit est reconstruit à partir des pastilles mesurées dans le DOM :
 * le fil orange suit donc automatiquement le nouveau côté, à angles droits.
 */
const LEFT_SIDE_IDS = new Set<string>(["uv-pbr"]);

/* ─────────── Mode cranté (« QTE ») ─────────── */

/** Durée de l'avancée d'une fiche à la suivante, en ms. C'est LE réglage de vitesse. */
const STEP_MS = 1000;
/** Petit silence après l'animation avant d'accepter un nouveau cran (anti-rafale trackpad). */
const STEP_COOLDOWN_MS = 140;
/** Molette : en dessous de ce delta, l'événement est ignoré (micro-inertie trackpad). */
const WHEEL_MIN_DELTA = 2;
/**
 * Hauteur (en fraction de viewport) à laquelle l'ancre de la 1re fiche déclenche
 * la visite guidée. Au-dessus : molette libre, tu peux empiler ce que tu veux dans l'accueil.
 */
const INTRO_GRAB_VH = 0.95;
/**
 * Marge (px) conservée sous l'ancre de la fiche suivante quand on centre la fiche
 * courante : garantit qu'aucune fiche ne s'allume en avance.
 */
const NEXT_SAFE_GAP = 24;

/**
 * Courbe du cran, en coordonnées cubic-bézier [x1, y1, x2, y2] — même convention
 * que le CSS. Départ franc, freinage long : monte y1 et rapproche x1 de 0 pour
 * partir plus vite, tire x2 vers 0 pour freiner plus longtemps.
 */
const STEP_BEZIER: [number, number, number, number] = [0.3, 0.72, 0.24, 1];

/** Solveur cubic-bézier (Newton-Raphson, repli par dichotomie). */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;

  const calc = (t: number, a: number, b: number) =>
    ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) =>
    3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= (calc(t, x1, x2) - x) / d;
    }

    if (t < 0 || t > 1) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        const v = calc(t, x1, x2);
        if (Math.abs(v - x) < 1e-5) break;
        if (v > x) hi = t;
        else lo = t;
        t = (lo + hi) / 2;
      }
    }

    return calc(t, y1, y2);
  };
}

const STEP_EASE = cubicBezier(...STEP_BEZIER);

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

function emitPolyline(points: Point[], cornerRadius = 6) {
  const pts: Point[] = [];
  for (const p of points) {
    const last = pts[pts.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.5 || Math.abs(last.y - p.y) > 0.5) pts.push(p);
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
      const r = cornerRadius;
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
        const est = nodeLengths[k] || 0;
        const startSearch = Math.max(0, est - 50);
        const endSearch = Math.min(length, est + 50);

        for (let l = startSearch; l <= endSearch; l += 2) {
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

  for (let i = 0; i < WORKFLOW_NODES.length; i++) {
    const node = WORKFLOW_NODES[i];
    const g = geo[node.id];
    if (!g) return EMPTY;

    if (i > 0) {
      const from = points[points.length - 1];
      if (Math.abs(from.x - g.entry.x) > 0.5) {
        points.push({ x: from.x, y: g.entry.y - DROP });
        points.push({ x: g.entry.x, y: g.entry.y - DROP });
      }
      points.push({ x: g.entry.x, y: g.entry.y });
    } else {
      marks[node.id] = points.length - 1;
    }

    if (i > 0) {
      marks[node.id] = points.length - 1;
    } else {
      marks[node.id] = 1;
    }

    if (node.kind === "terminal") {
      marks[node.id] = points.length - 1;
      points.push({ x: g.entry.x, y: g.entry.y });
      points.push({ x: g.entry.x, y: g.entry.y + 400 });
      break;
    }

    points.push({ x: g.exit.x, y: g.exit.y });
    points.push({ x: g.exit.x, y: g.exit.y + DROP });
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
  /** Une animation de cran est en cours : toute nouvelle entrée est ignorée */
  const lockRef = useRef(false);
  const animRef = useRef(0);

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
    const observer = new ResizeObserver(() => {
      if (modeRef.current === "desktop") measure();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(detect).catch(() => {});
    window.addEventListener("resize", detect);

    return () => {
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

    const steps = 720;
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
    return Math.round(
      rect.top + window.scrollY + rect.height / 2 - (window.innerHeight || 1) / 2
    );
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

      const nextAnchor =
        index < WORKFLOW_NODES.length - 1 ? anchorScrollFor(index + 1) : null;
      const ceiling =
        nextAnchor === null ? Infinity : Math.max(floor, nextAnchor - NEXT_SAFE_GAP);

      const centered = centerScrollFor(index);
      const wanted = centered === null ? floor : centered;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      return Math.min(
        maxScroll,
        Math.max(0, Math.min(Math.max(wanted, floor), ceiling))
      );
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

      const start = window.scrollY;
      const delta = target - start;
      if (Math.abs(delta) < 1) return;

      lockRef.current = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const t0 = performance.now();

      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / STEP_MS);
        window.scrollTo(0, start + delta * STEP_EASE(p));
        if (p < 1) {
          animRef.current = requestAnimationFrame(tick);
          return;
        }
        animRef.current = 0;
        window.setTimeout(() => {
          lockRef.current = false;
        }, STEP_COOLDOWN_MS);
      };

      animRef.current = requestAnimationFrame(tick);
    },
    [scrollTargetFor]
  );

  useEffect(() => {
    if (mode !== "desktop") return;

    const LAST_INDEX = WORKFLOW_NODES.length - 1;

    /** Accueil : molette libre tant que la 1re fiche n'est pas en approche. */
    const introStillFree = () => {
      if (stepRef.current !== -1) return false;
      const first = WORKFLOW_NODES[0];
      const anchor = first && document.getElementById(getNodeAnchorId(first.id));
      if (!anchor) return true;
      return anchor.getBoundingClientRect().top > window.innerHeight * INTRO_GRAB_VH;
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

    /** Renvoie true si l'événement est consommé par la visite guidée. */
    const consume = (direction: 1 | -1) => {
      if (!builtRef.current.length) return false;

      if (direction === 1) {
        if (introStillFree()) return false;
        if (tailReached()) return false;
      } else {
        if (stepRef.current === -1) return false;
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

      if (consume(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (animRef.current) cancelAnimationFrame(animRef.current);
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
        if (!lockRef.current) stepRef.current = -1;
        return;
      }

      const vh = window.innerHeight || 1;
      const rect = container.getBoundingClientRect();
      const lineY = vh * LINE_VH - rect.top;
      const total = ruler.current.total;
      const value = total > 0 ? Math.min(1, Math.max(0, lengthAtY(lineY) / total)) : 0;

      progress.set(value);
      setArmed((p) => (p === value > 0.0003 ? p : value > 0.0003));

      const table = builtRef.current.thresholds;
      const nextLit: string[] = [];
      for (const node of WORKFLOW_NODES) {
        const t = table[node.id];
        if (t !== undefined && value >= t) nextLit.push(node.id);
      }

      const goingBack = value < previous.current - 0.0002;
      previous.current = value;

      // Barre de défilement manipulée à la main : on recale le cran courant.
      if (!lockRef.current) {
        const last = nextLit.length ? nextLit[nextLit.length - 1] : null;
        stepRef.current = last
          ? WORKFLOW_NODES.findIndex((n) => n.id === last)
          : -1;
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
        <h1 className="font-display text-[clamp(2.6rem,6.4vw,5rem)] font-light leading-[1.02] tracking-[-0.02em] text-white">
          {INTRO.name}
        </h1>
        <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#FF7F50] md:text-base">
          {INTRO.role}
        </p>
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
          <defs>
            <filter id="sf-emission" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d={built.d}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={4.4}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeDasharray={dash}
            style={{ strokeDashoffset: trailOffset, opacity: trailOpacity }}
            filter="url(#sf-emission)"
            opacity={0.16}
          />
          <motion.path
            d={built.d}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={1.3}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeDasharray={dash}
            style={{ strokeDashoffset: trailOffset, opacity: trailOpacity }}
            filter="url(#sf-emission)"
          />
        </svg>
      )}

      <section
        aria-label="Processus de production 3D"
        className="relative w-full px-10 pb-40"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-[84rem] flex-col">
          {WORKFLOW_NODES.map((node, index) => {
            const isSecondary = node.kind === "secondaire";
            const spacing = index === 0 ? "mt-[16vh]" : isSecondary ? "mt-[34vh]" : "mt-[44vh]";
            const width = isSecondary
              ? LEFT_SIDE_IDS.has(node.id)
                ? "mr-auto w-[32%]"
                : "ml-auto w-[32%]"
              : "mx-auto w-[54%]";

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