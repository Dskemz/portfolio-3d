"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  getNodeAnchorId,
  getNodeCardId,
  getNodeExitId,
  type WorkflowNode,
} from "@/content/workflowData";
import CroquisReveal from "./CroquisReveal";
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

const METAL =
  "linear-gradient(150deg, #171717 0%, #121212 44%, #0d0d0d 74%, #151515 100%)";
const PERIMETER_S = 0.6;

/** Durée de l'état 1 (croquis seul, plein cadre) avant le dédoublement. */
const STATE1_MS = 3800;
/**
 * Durée de l'état 2 : la colonne droite (croquis → rendu) glisse du centre
 * vers la droite EN MÊME TEMPS que la colonne gauche (texte) arrive du bas,
 * toutes deux en 800ms.
 */
const SPLIT_S = 0.8;

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

  /**
   * Dédoublement en 2 temps :
   *   "sketch" → croquis seul, plein cadre, points qui pop (STATE1_MS)
   *   "split"  → bascule synchronisée (SPLIT_S) : la colonne droite (croquis
   *              → rendu) glisse du centre vers la droite PENDANT que la
   *              colonne gauche (texte) arrive du bas, en parallèle.
   * En mode `plain` (statique), tout est déjà en place, pas de minuterie.
   */
  const [stage, setStage] = useState<"sketch" | "split">(plain ? "split" : "sketch");

  const [trackedVisible, setTrackedVisible] = useState(visible);
  if (!plain && visible !== trackedVisible) {
    setTrackedVisible(visible);
    if (!visible) setStage("sketch");
  }

  useEffect(() => {
    if (plain || !visible) return;
    const t1 = window.setTimeout(() => setStage("split"), STATE1_MS);
    return () => window.clearTimeout(t1);
  }, [plain, visible, node.id]);

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

  const perimeter =
    box.w > 0 && box.h > 0 ? `M ${box.w / 2} 0 H ${box.w} V ${box.h} H 0 V 0 Z` : "";

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

      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#FF7F50]">
        Étape {node.step}
      </p>

      <h2
        className={`mt-[clamp(0.5rem,1.5svh,1rem)] font-display font-light leading-tight text-white ${
          isTerminal
            ? "text-[clamp(1.4rem,3.4svh,2.6rem)]"
            : "text-[clamp(1.25rem,2.7svh,1.875rem)]"
        }`}
      >
        {node.title}
      </h2>

      {node.points && node.points.length > 0 && (
        <p className="mt-[clamp(0.35rem,1svh,0.6rem)] font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
          {node.points.map((point) => point.label).join(" · ")}
        </p>
      )}

      {node.quote && (
        <p className="mt-[clamp(0.5rem,1.5svh,1rem)] font-body text-[clamp(0.68rem,1.05svh,0.72rem)] italic leading-relaxed text-zinc-500">
          «&nbsp;{node.quote.text}&nbsp;»
          <br />
          <span className="not-italic">— {node.quote.author}</span>
        </p>
      )}

      <div className="my-[clamp(0.7rem,2.2svh,1.5rem)] h-px w-full bg-white/[0.09]" />

      <p className="text-[clamp(0.8rem,1.35svh,0.95rem)] leading-relaxed text-zinc-400">
        {node.description}
      </p>

      <div className="mt-[clamp(0.75rem,2.5svh,1.75rem)] flex flex-wrap items-center gap-[clamp(0.35rem,0.9svh,0.625rem)]">
        {node.tags.map((tag) => (
          <span
            key={tag}
            className="border border-white/[0.14] px-[clamp(0.5rem,1.1svh,0.75rem)] py-[clamp(0.25rem,0.6svh,0.375rem)] font-mono text-[clamp(8px,0.85svh,9px)] uppercase tracking-[0.16em] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {node.href && (
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
    <div className="relative grid grid-cols-1 md:grid-cols-2">
      {/* Colonne gauche : n'existe pas encore pendant l'état 1, arrive du bas au dédoublement. */}
      {stage === "split" && (
        <motion.div
          initial={{ opacity: 0, y: 64, x: "-6%" }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: SPLIT_S, ease: "easeInOut" }}
        >
          {editorial}
        </motion.div>
      )}

      {/*
        Colonne droite : LE MÊME panneau tout du long — plein cadre centré en
        état 1 (`md:col-span-2`), puis glisse vers la colonne droite quand
        `stage` bascule. `layout` fait interpoler le changement de largeur
        (FLIP), en même temps que le contenu (croquis → rendu) se croise.
      */}
      <motion.div
        layout
        transition={{ duration: SPLIT_S, ease: [0.22, 1, 0.36, 1] }}
        className={`relative border-t border-white/[0.08] ${
          stage === "sketch" ? "md:col-span-2" : "md:border-l md:border-t-0"
        }`}
      >
        <AnimatePresence initial={false}>
          {stage === "sketch" ? (
            <motion.div key="croquis" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <CroquisReveal node={node} active={visible} />
            </motion.div>
          ) : (
            <motion.div
              key="visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StepVisual node={node} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  if (plain) {
    return (
      <article
        id={getNodeCardId(node.id)}
        className="relative h-auto overflow-hidden border border-[#FF7F50]/25"
        style={{
          background: METAL,
          boxShadow:
            "0 0 16px rgba(255,127,80,0.08), 0 14px 34px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, #FF7F50 50%, transparent)",
          }}
        />
        {isTerminal ? (
          editorial
        ) : (
          <>
            {editorial}
            <div className="border-t border-white/[0.08]">
              <StepVisual node={node} />
            </div>
          </>
        )}
      </article>
    );
  }

  return (
    <div className="relative h-auto">
      {/* Ancre supérieure : déclenche l'allumage au contact exact du flux */}
      {dot(getNodeAnchorId(node.id), "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", isHead)}
      {/* La fiche terminale n'a pas de sortie : la visite s'arrête sur elle. */}
      {!isTerminal &&
        dot(getNodeExitId(node.id), "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2", false)}

      <motion.article
        ref={frameRef}
        id={getNodeCardId(node.id)}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.95,
          boxShadow: visible
            ? isHead
              ? "0 0 48px rgba(255,127,80,0.26), 0 24px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)"
              : "0 0 24px rgba(255,127,80,0.12), 0 20px 42px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={shell}
        style={{ background: METAL, pointerEvents: visible ? "auto" : "none" }}
        className="relative h-auto overflow-hidden border border-white/[0.07]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.03) 100%)",
          }}
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(255,127,80,0.14), rgba(255,127,80,0) 62%)",
          }}
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={edge}
        />

        {perimeter && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            width={box.w}
            height={box.h}
            viewBox={`0 0 ${box.w} ${box.h}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id={`edge-${node.id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="g" />
                <feMerge>
                  <feMergeNode in="g" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={perimeter}
              fill="none"
              stroke="#FF7F50"
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
              transition={edge}
              filter={`url(#edge-${node.id})`}
            />
          </svg>
        )}

        <motion.div
          className="relative z-10"
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={inner}
        >
          {body}
        </motion.div>
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
