"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getNodeAnchorId,
  getNodeCardId,
  getNodeExitId,
  type WorkflowNode,
} from "@/content/workflowData";
import StepVisual from "./StepVisual";

interface WorkflowCardProps {
  node: WorkflowNode;
  /** Le front du flux a physiquement touché l'ancre de cette fiche */
  lit: boolean;
  /** Fiche la plus avancée sous tension */
  isHead: boolean;
  /** Le scroll remonte : extinction immédiate */
  receding: boolean;
  /** Mode mobile : rendu natif, statique */
  plain?: boolean;
  /** Mode cranté : le retour en arrière est une animation délibérée, pas un scrub */
  stepped?: boolean;
}

const PERIMETER_S = 0.6;

function WorkflowCard({
  node,
  lit,
  isHead,
  receding,
  plain = false,
  stepped = false,
}: WorkflowCardProps) {
  const isTerminal = node.kind === "terminal";
  
  // Pour la carte terminale, on s'assure qu'elle ne s'active que si 'lit' est explicitement vrai
  const visible = plain || lit;

  const frameRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (plain) return;
    const el = frameRef.current;
    if (!el) return;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, [plain]);

  const instant = receding && !stepped;
  const shell = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
  const edge = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: PERIMETER_S, ease: [0.4, 0, 0.2, 1] as const };
  const inner = instant
    ? { duration: 0.05, delay: 0, ease: "linear" as const }
    : { duration: 0.4, delay: PERIMETER_S * 0.78, ease: [0.22, 1, 0.36, 1] as const };
  const titleTransition = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const };
  const detailTransition = instant
    ? { duration: 0.05, delay: 0, ease: "linear" as const }
    : { duration: 0.56, delay: 0.42, ease: [0.22, 1, 0.36, 1] as const };
  const dotTiming = instant ? { duration: 0.05 } : { duration: 0.22 };

  /* Pastilles d'ancrage du flux */
  const dot = (id: string, position: string, bright: boolean) => (
    <div
      id={id}
      aria-hidden
      className={`pointer-events-none absolute z-30 h-2.5 w-2.5 ${position}`}
    >
      <motion.span
        className="block h-full w-full rounded-full bg-[#FF7F50]"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.4,
          boxShadow: bright
            ? "0 0 16px 4px rgba(255,127,80,0.85)"
            : "0 0 8px 2px rgba(255,127,80,0.5)",
        }}
        transition={dotTiming}
      />
    </div>
  );

  const editorial = (
    <div className="flex flex-col justify-center px-[clamp(1.25rem,3.6svh,2.5rem)] py-[clamp(1.35rem,4.4svh,3rem)]">

      <motion.h2
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
        transition={titleTransition}
        className={`mt-[clamp(0.5rem,1.5svh,1rem)] font-display font-light leading-tight text-white ${
          isTerminal
            ? "text-[clamp(1.4rem,3.4svh,2.6rem)]"
            : "flex flex-wrap items-baseline gap-x-5 text-[clamp(2.6rem,5.2vw,5.8rem)] tracking-[-0.06em]"
        }`}
      >
        {isTerminal ? (
          node.title
        ) : (
          <>
            <span className="font-medium">{node.title}</span>
            <span className="font-mono text-[clamp(9px,0.9vw,12px)] uppercase tracking-[0.28em] text-[#FF7F50]">
              Étape {node.step}
            </span>
          </>
        )}
      </motion.h2>

      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
        transition={detailTransition}
      >
        {node.quote && (
          <p className="mt-[clamp(0.5rem,1.5svh,1rem)] font-body text-[clamp(0.68rem,1.05svh,0.72rem)] italic leading-relaxed text-zinc-500">
            «&nbsp;{node.quote.text}&nbsp;»
            <br />
            <span className="not-italic">— {node.quote.author}</span>
          </p>
        )}

        <div className="my-[clamp(0.7rem,2.2svh,1.5rem)] h-px w-16 bg-white/[0.18]" />

        <p className="max-w-md text-[clamp(0.8rem,1.35svh,0.95rem)] leading-relaxed text-zinc-400">
          {node.description}
        </p>

        {node.href && isTerminal && (
          <Link
            href={node.href}
            className={
              isTerminal
                ? "mt-[clamp(0.9rem,2.9svh,2rem)] inline-block self-start bg-[#FF7F50] px-[clamp(1.1rem,2.6svh,1.75rem)] py-[clamp(0.6rem,1.5svh,0.875rem)] font-display text-[clamp(0.8rem,1.4svh,0.875rem)] font-semibold tracking-wide text-black transition-colors hover:bg-[#E67E22]"
                : "mt-[clamp(0.9rem,2.9svh,2rem)] inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF7F50] transition-colors hover:text-[#E67E22]"
            }
            style={isTerminal ? { touchAction: "manipulation" } : undefined}
          >
            {node.hrefLabel ?? "Voir"}
            {!isTerminal && <span aria-hidden>—→</span>}
          </Link>
        )}
      </motion.div>
    </div>
  );

  const body = isTerminal ? (
    <div className="px-[clamp(1.25rem,3.6svh,3.5rem)] py-[clamp(1.5rem,4.4svh,4rem)] text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500">
        Fin de parcours
      </p>
      <div className="mx-auto mt-[clamp(0.9rem,2.9svh,2rem)] max-w-2xl">{editorial}</div>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
      {editorial}
      <motion.div
        className="relative min-h-[clamp(18rem,42svh,32rem)] md:min-h-[clamp(20rem,48svh,38rem)]"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
        transition={detailTransition}
      >
        <StepVisual node={node} active={visible} />
      </motion.div>
    </div>
  );

  if (plain) {
    return (
      <article
        id={getNodeCardId(node.id)}
        className="relative h-auto overflow-visible"
        style={{
          background: "transparent",
        }}
      >
        {isTerminal ? (
          editorial
        ) : (
          <>
            {editorial}
            <div className="mt-8">
              <StepVisual node={node} active={visible} />
            </div>
          </>
        )}
      </article>
    );
  }

  return (
    <div className="relative h-auto">
      {/* Le courant traverse la fiche hors champ : il entre et ressort, sans
          créer une ligne parasite au milieu du contenu. */}
      {!isTerminal && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-5 -translate-x-1/2 bg-black"
        />
      )}
      {/* Ancre supérieure : déclenche l'allumage au contact exact du flux */}
      {dot(getNodeAnchorId(node.id), "left-0 top-0 -translate-x-1/2 -translate-y-1/2", isHead)}
      {/* Le flux réapparaît ici avant de poursuivre vers l'étape suivante. */}
      {!isTerminal &&
        dot(getNodeExitId(node.id), "left-0 bottom-0 -translate-x-1/2 translate-y-1/2", false)}

      <motion.article
        ref={frameRef}
        id={getNodeCardId(node.id)}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: 1,
          boxShadow: "none",
        }}
        transition={instant ? shell : { duration: 0.01 }}
        style={{ background: "transparent", pointerEvents: visible ? "auto" : "none" }}
        className="relative h-auto overflow-visible"
      >
        <div className="relative z-10">
          {body}
        </div>
      </motion.article>
    </div>
  );
}
/**
 * Le parent (SkillFlow / SkillFlowMobile) se re-rend à chaque frame de scroll.
 * Sans mémoïsation, les 7 fiches et leurs sous-arbres framer-motion étaient
 * reconstruits 60 fois par seconde pour rien : seuls `lit`, `isHead` et
 * `receding` changent réellement, et rarement.
 */
export default memo(WorkflowCard);
