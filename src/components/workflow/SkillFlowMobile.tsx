"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { INTRO, ORIGIN_ID, WORKFLOW_NODES } from "@/content/workflowData";
import WorkflowCard from "./WorkflowCard";

/** Ligne de front du flux dans le viewport (62 % de la hauteur). */
const LINE_VH = 0.62;
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

    setStartY(start);
    setEndY(last);
    setAnchors(next);
  };

  useLayoutEffect(() => {
    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);

    return () => {
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

  const litSet = new Set(litIds);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* ═══ Accueil ═══ */}
      <header className="px-6 pb-10 pt-24">
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
            />
          </div>
        ))}
      </section>
    </div>
  );
}