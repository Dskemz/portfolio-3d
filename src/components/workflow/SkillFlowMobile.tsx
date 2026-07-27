"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { INTRO, ORIGIN_ID, WORKFLOW_NODES } from "@/content/workflowData";
import WorkflowCard from "./WorkflowCard";
import {
  HOME_JUMP_EVENT,
  LINE_VH,
  STEP_COOLDOWN_MS,
  SWIPE_MIN_DELTA,
  animateScrollTo,
} from "./stepping";

/**
 * ⚙️ INTERRUPTEUR — scroll cranté au doigt sur smartphone.
 *
 *   true  : un flick = une fiche, comme sur desktop (essai en cours).
 *   false : scroll natif avec inertie, comportement d'origine.
 *
 * Repasser cette seule ligne à `false` suffit à faire marche arrière :
 * tout le reste du composant est inchangé et le bloc ci-dessous se
 * désactive intégralement (aucun listener posé).
 */
const MOBILE_STEPPED = true;

/** Épaisseur du trait, en pixels. */
const TRAIT = 2;

export default function SkillFlowMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /** Position Y de l'amorce, relative au conteneur. */
  const [startY, setStartY] = useState(0);
  /** Position Y de fin du trait (dernière fiche), relative au conteneur. */
  const [endY, setEndY] = useState(0);
  /** Y du centre de chaque fiche, relative au conteneur. */
  const [anchors, setAnchors] = useState<Record<string, number>>({});

  /** Hauteur courante du trait, en pixels depuis startY. */
  const [flow, setFlow] = useState(0);
  const [armed, setArmed] = useState(false);
  const [litIds, setLitIds] = useState<string[]>([]);
  const [headId, setHeadId] = useState<string | null>(null);
  const [receding, setReceding] = useState(false);

  const previous = useRef(0);
  /**
   * Flag : au moins une fiche a été mesurée dans measure(). Élimine le
   * problème du premier swipe qui échouerait si les refs ne sont pas encore
   * remplies. Une fois true, on ne revient pas en arrière.
   */
  const cardsReadyRef = useRef(false);

  /* ── Mesure : position de l'amorce et de chaque fiche ── */
  const measure = () => {
    const container = containerRef.current;
    const origin = originRef.current;
    if (!container || !origin) return;

    const box = container.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    const start = o.top - box.top + o.height / 2;

    const next: Record<string, number> = {};
    let last = start;

    for (const node of WORKFLOW_NODES) {
      const el = cardRefs.current.get(node.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      // Le courant « touche » la fiche quand il atteint son bord haut
      next[node.id] = r.top - box.top;
      last = r.bottom - box.top;
    }

    // ✓ Marque que les cartes sont prêtes dès qu'on en a au moins une
    if (Object.keys(next).length > 0) {
      cardsReadyRef.current = true;
    }

    setStartY(start);
    setEndY(last);
    setAnchors(next);
  };

  useLayoutEffect(() => {
    measure();

    // Mesure supplémentaire rapide après le layout pour capturer les bonnes positions
    // avant que l'utilisateur n'interagisse
    const timeoutId = setTimeout(measure, 16);

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Moteur de scroll : 1:1, aucune inertie, réversible ── */
  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const container = containerRef.current;
      if (!container) return;

      // Reset absolu en haut de page
      if (window.scrollY < 10) {
        setFlow(0);
        setArmed(false);
        setLitIds([]);
        setHeadId(null);
        setReceding(false);
        previous.current = 0;
        return;
      }

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Position du front, en coordonnées du conteneur
      const front = vh * LINE_VH - rect.top;

      const height = Math.max(0, Math.min(front - startY, endY - startY));
      setFlow(height);
      setArmed(height > 1);

      const nextLit: string[] = [];
      for (const node of WORKFLOW_NODES) {
        const a = anchors[node.id];
        if (a !== undefined && front >= a) nextLit.push(node.id);
      }

      const goingBack = height < previous.current - 0.5;
      previous.current = height;

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
  }, [startY, endY, anchors]);

  /* ── Scroll cranté au doigt (désactivable par MOBILE_STEPPED) ── */

  /** Fiche courante : -1 = accueil, 0…n = index dans WORKFLOW_NODES */
  const stepRef = useRef(-1);
  /** Une animation de cran est en cours : toute nouvelle entrée est ignorée */
  const lockRef = useRef(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  /** Un cran a déjà été émis pour le geste tactile en cours (un seul par swipe). */
  const firedRef = useRef(false);
  /**
   * Flag stable : une fois qu'on a VRAIMENT entré en mode stepped (premier swipe
   * vers le bas détecté et capturé), on y reste. Élimine le problème du premier
   * swipe qui passe libre quand il devrait déclencher la visite.
   */
  const enteredSteppedRef = useRef(false);

  useEffect(() => {
    if (!MOBILE_STEPPED) return;

    const LAST = WORKFLOW_NODES.length - 1;

    /** Position de scroll qui pose la fiche `index` dans le viewport. */
    const targetFor = (index: number): number | null => {
      if (index < 0) return 0;
      const node = WORKFLOW_NODES[index];
      const el = node && cardRefs.current.get(node.id);
      if (!el) return null;

      const vh = window.innerHeight || 1;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;

      // Une fiche plus haute que l'écran ne peut pas être centrée : on cale son
      // haut sous la navbar, sinon on n'en verrait jamais le début.
      const wanted =
        rect.height > vh * 0.9
          ? top - vh * 0.14
          : top + rect.height / 2 - vh / 2;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - vh
      );
      return Math.round(Math.min(maxScroll, Math.max(0, wanted)));
    };

    /**
     * Vérifie si la première fiche approche du viewport. Utilisé seulement
     * lors de la détection du premier swipe vers le bas.
     *
     * Engage dès le TOUT PREMIER swipe vers le bas tant que la première fiche
     * n'a pas encore été dépassée (son bord haut est toujours sous le haut du
     * viewport). Sur mobile l'accueil fait 100svh : la fiche est un plein écran
     * plus bas (top ≈ vh), donc l'ancien seuil 0.68·vh la ratait au premier
     * geste — le scroll natif la dépassait et la visite ne s'enclenchait qu'au
     * second swipe. Le seuil `top > 0` supprime ce "premier scroll libre".
     */
    const firstFicheApproaches = () => {
      const first = WORKFLOW_NODES[0];
      const el = first && cardRefs.current.get(first.id);
      if (!el) return true;
      return el.getBoundingClientRect().top > 0;
    };

    const tailReached = () => {
      if (stepRef.current !== LAST) return false;
      const t = targetFor(LAST);
      return t !== null && window.scrollY >= t - 2;
    };

    /** Sous la fiche terminale : la descente vers le footer redevient libre. */
    const belowTail = () => {
      const t = targetFor(LAST);
      return t !== null && window.scrollY > t + 2;
    };

    /**
     * Fiche plus haute que l'écran : on rend la main au défilement natif tant que
     * le bord concerné n'est pas atteint. Sans ça, le cran sauterait par-dessus la
     * fin de la fiche, qui deviendrait tout simplement illisible.
     */
    const overflowFree = (direction: 1 | -1) => {
      const idx = stepRef.current;
      if (idx < 0) return false;
      const node = WORKFLOW_NODES[idx];
      const el = node && cardRefs.current.get(node.id);
      if (!el) return false;

      const vh = window.innerHeight || 1;
      const rect = el.getBoundingClientRect();
      if (rect.height <= vh * 0.92) return false;

      return direction === 1 ? rect.bottom > vh - 8 : rect.top < 8;
    };

    /**
     * La visite guidée prend-elle la main pour ce sens de défilement ?
     * Une fois entré en mode stepped, on capture TOUS les swipes sauf ceux
     * vers la fin du document.
     */
    const guided = (direction: 1 | -1) => {
      // Les cartes doivent être mesurées pour pouvoir calculer les cibles correctement.
      // Si elles ne sont pas prêtes, on laisse le scroll natif passer.
      if (!cardsReadyRef.current) {
        return false;
      }

      if (overflowFree(direction)) return false;

      // Si on est déjà entré en mode stepped, capturer tout sauf tail.
      if (enteredSteppedRef.current) {
        if (direction === 1 && tailReached()) return false;
        if (direction === -1 && belowTail()) return false;
        return true;
      }

      // Avant d'entrer : vérifier seulement un swipe vers le bas ET première fiche approche.
      if (direction === 1) {
        if (firstFicheApproaches()) return true; // Déclencher l'entrée
        return false;
      }

      // Swipe vers le haut sans être en mode stepped = ignoré
      return false;
    };

    const goToStep = (index: number) => {
      const clamped = Math.max(-1, Math.min(LAST, index));
      if (clamped === stepRef.current) return;

      const target = targetFor(clamped);
      if (target === null) return;

      stepRef.current = clamped;

      // ✓ Marque qu'on est VRAIMENT entré en mode stepped (première fiche atteinte).
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
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      // Pincement / multi-touch : on laisse le navigateur faire.
      if (!t || e.touches.length > 1) {
        touchStartRef.current = null;
        return;
      }
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };

    /**
     * Bloque le défilement natif dans la zone guidée ET déclenche le cran DÈS que
     * le seuil de swipe est franchi — sans attendre le relâchement du doigt.
     * Indispensable : sans ça, le doigt fait défiler la page en même temps que le
     * cran l'anime, et les deux mouvements se battent. Hors zone guidée (accueil,
     * bas de page), on ne touche à rien et l'inertie native est intacte.
     *
     * `firedRef` garantit un seul cran par geste : une fois le cran émis, les
     * touchmove suivants du même doigt ne font que bloquer le natif.
     */
    const onTouchMove = (e: TouchEvent) => {
      const start = touchStartRef.current;
      const t = e.touches[0];
      if (!start || !t) return;

      const dy = start.y - t.clientY; // positif = le doigt remonte = la page descend
      if (Math.abs(dy) < SWIPE_MIN_DELTA) return;

      const direction: 1 | -1 = dy > 0 ? 1 : -1;

      // Pendant l'animation d'un cran : on gèle le natif, rien d'autre.
      if (lockRef.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (!guided(direction)) return;

      // Bloquer le scroll natif IMMÉDIATEMENT.
      if (e.cancelable) e.preventDefault();

      // Émettre le cran une seule fois par geste, dès le franchissement du seuil.
      if (!firedRef.current) {
        firedRef.current = true;
        goToStep(stepRef.current + direction);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      const alreadyFired = firedRef.current;
      touchStartRef.current = null;
      firedRef.current = false;
      if (!start || alreadyFired) return;

      const end = e.changedTouches[0];
      if (!end) return;

      const dy = start.y - end.clientY;
      if (Math.abs(dy) < SWIPE_MIN_DELTA) return;

      if (lockRef.current) return;

      const direction: 1 | -1 = dy > 0 ? 1 : -1;
      if (!guided(direction)) return;

      goToStep(stepRef.current + direction);
    };

    /** Retour en haut de page : on relâche la visite guidée. */
    const onScroll = () => {
      if (lockRef.current) return;
      if (window.scrollY < 10) {
        stepRef.current = -1;
        // ✓ Réinitialise aussi l'entrée en mode stepped.
        enteredSteppedRef.current = false;
      }
    };

    /** Clic sur le logo : on abandonne le cran en vol et on oublie l'état de la visite. */
    const onHomeJump = () => {
      cancelRef.current?.();
      cancelRef.current = null;
      lockRef.current = false;
      stepRef.current = -1;
      // ✓ Réinitialise l'entrée en mode stepped, pour recommencer depuis zéro.
      enteredSteppedRef.current = false;
    };

    window.addEventListener(HOME_JUMP_EVENT, onHomeJump);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(HOME_JUMP_EVENT, onHomeJump);
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, []);

  const litSet = new Set(litIds);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* ═══ Accueil ═══ */}
      {/*
        Sur téléphone, le bloc d'accueil occupe toute la hauteur visible et se
        centre verticalement : de l'air entre la navbar et « Denis Masquet »,
        puis titre / rôle / citation / amorce groupés au milieu de l'écran.
        `min-h-[100svh]` suit la hauteur réelle du viewport mobile (barres
        d'URL comprises) ; `pt-24` garantit un dégagement sous la navbar fixe
        même sur les écrans très courts.
      */}
      <header className="flex min-h-[100svh] flex-col justify-center px-6 pb-16 pt-24">
        <div className="flex w-full flex-col items-center text-center">
          <h1 className="font-display text-[clamp(2.2rem,8vw,3rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
            Denis Masquet
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#FF7F50]">
            {INTRO.role}
          </p>
          <p className="mt-8 text-sm leading-relaxed text-zinc-400">
            {INTRO.quote}
          </p>
        </div>

        {/* Amorce */}
        <div className="mt-14 flex flex-col items-center">
          <motion.span
            ref={originRef}
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
              armed
                ? { duration: 0.25 }
                : { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
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

      {/* ═══ LE TRAIT — simple div centrée, aucune SVG ═══ */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-0"
        style={{
          top: startY,
          height: flow,
          width: TRAIT,
          marginLeft: -TRAIT / 2,
          background: "#FF7F50",
          boxShadow: "0 0 8px 1px rgba(255,127,80,0.7), 0 0 18px 4px rgba(255,127,80,0.35)",
          opacity: flow > 0 ? 1 : 0,
        }}
      />

      {/* ═══ Les fiches — centrées, le trait passe au milieu ═══ */}
      <section
        aria-label="Processus de production 3D"
        className="relative z-10 flex w-full flex-col gap-16 px-6 pb-24 pt-10"
      >
        {WORKFLOW_NODES.map((node) => (
          <div
            key={node.id}
            ref={(el) => {
              if (el) cardRefs.current.set(node.id, el);
              else cardRefs.current.delete(node.id);
            }}
          >
            <WorkflowCard
              node={node}
              lit={litSet.has(node.id)}
              isHead={headId === node.id}
              receding={receding}
              stepped={MOBILE_STEPPED}
            />
          </div>
        ))}
      </section>
    </div>
  );
}