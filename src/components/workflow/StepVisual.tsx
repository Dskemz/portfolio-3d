"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { WorkflowNode } from "@/content/workflowData";
import { Corners, Grid } from "./PanelChrome";
import GlbViewer from "./GlbViewer";

/** Durée du morph baked ⇄ GLB. */
const MORPH_S = 0.8;

/** Pas de dispositif de pointage à survol (tactile) : lu sans effet via useSyncExternalStore. */
function subscribeHover(callback: () => void) {
  const mql = window.matchMedia("(hover: none)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
const getIsTouch = () => window.matchMedia("(hover: none)").matches;
const getIsTouchServer = () => false;

/**
 * Colonne droite une fois le dédoublement terminé : rendu baked figé →
 * modèle GLB interactif au survol (desktop) ou au tap (mobile). Ne monte
 * qu'une fois les 2 colonnes en place (voir WorkflowCard) : pas d'état
 * croquis ici, ça vit dans CroquisReveal pendant l'état 1.
 */
export default function StepVisual({ node }: { node: WorkflowNode }) {
  const [spatial, setSpatial] = useState(false);
  const [glbReady, setGlbReady] = useState(false);
  const isTouch = useSyncExternalStore(subscribeHover, getIsTouch, getIsTouchServer);

  // Sortie de l'état 3 (survol/tap relâché) : reset ajusté pendant le rendu.
  const [trackedSpatial, setTrackedSpatial] = useState(spatial);
  if (spatial !== trackedSpatial) {
    setTrackedSpatial(spatial);
    if (!spatial) setGlbReady(false);
  }

  const engage = () => {
    if (!isTouch) setSpatial(true);
  };
  const disengage = () => {
    if (!isTouch) setSpatial(false);
  };
  const handleClick = () => {
    if (isTouch) setSpatial((v) => !v);
  };

  return (
    <div
      className="blueprint-stage group/blueprint relative h-full min-h-[clamp(9rem,22svh,18rem)] w-full overflow-hidden bg-[#0b0b0b]"
      onMouseEnter={engage}
      onMouseLeave={disengage}
      onClick={handleClick}
    >
      <Grid />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 70% 30%, rgba(255,127,80,0.10), rgba(0,0,0,0) 70%)",
        }}
      />

      <AnimatePresence initial={false}>
        {!spatial ? (
          <motion.div
            key="baked"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MORPH_S }}
          >
            <BakedRender node={node} showHint={!isTouch} />
          </motion.div>
        ) : (
          <motion.div
            key="glb"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MORPH_S }}
          >
            <GlbViewer glbUrl={node.glbUrl} active={spatial} onReady={() => setGlbReady(true)} />
            <motion.p
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.28em] text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: glbReady ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              Explorez en temps réel
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <Corners />
    </div>
  );
}

/* ─── Rendu baked figé + citation + CTA discret ─── */

function BakedRender({ node, showHint }: { node: WorkflowNode; showHint: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden">
      {node.bakedImage ? (
        <Image src={node.bakedImage} alt={node.title} fill className="object-cover" />
      ) : (
        <BakedPlaceholder variant={node.blueprint ?? 0} />
      )}

      {/* Scrim pour la lisibilité du texte */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 85%)",
        }}
      />

      <div className="relative z-10 p-[clamp(1rem,3svh,1.75rem)]">
        {node.quote && (
          <p className="font-body text-[clamp(0.68rem,1.05svh,0.78rem)] italic leading-relaxed text-zinc-300">
            «&nbsp;{node.quote.text}&nbsp;»
            <br />
            <span className="not-italic text-zinc-500">— {node.quote.author}</span>
          </p>
        )}
        <p className="mt-[clamp(0.5rem,1.5svh,0.9rem)] text-[clamp(0.7rem,1.15svh,0.82rem)] leading-relaxed text-zinc-400">
          {node.description}
        </p>
      </div>

      {showHint && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1.5 opacity-35 transition-opacity duration-300 group-hover/blueprint:opacity-70"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 animate-spin [animation-duration:3s]" fill="none">
            <path
              d="M8 1.5a6.5 6.5 0 1 1-4.6 1.9"
              stroke="white"
              strokeWidth={1.3}
              strokeLinecap="round"
            />
            <path d="M8 1.5 L8 4.5 M3.4 3.4 L5.5 5.5" stroke="white" strokeWidth={1.3} strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white">Animer</span>
        </div>
      )}
    </div>
  );
}

/** Placeholder de rendu baked, en attendant les vraies images précalculées. */
function BakedPlaceholder({ variant }: { variant: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 20%, rgba(255,150,100,0.22), rgba(10,10,10,0.95) 65%)",
      }}
    >
      <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="baked-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>
        <g filter="url(#baked-soft)">
          {variant === 0 && (
            <path d="M110 190 L110 118 L118 96 L196 96 L204 118 L204 190 Z" fill="rgba(255,140,90,0.28)" />
          )}
          {variant === 1 && <circle cx="160" cy="126" r="52" fill="rgba(255,140,90,0.28)" />}
          {variant === 2 && <path d="M100 150 L160 118 L220 150 L160 182 Z" fill="rgba(255,140,90,0.28)" />}
          {variant === 3 && <rect x="86" y="78" width="148" height="96" fill="rgba(255,140,90,0.24)" />}
        </g>
      </svg>
    </div>
  );
}
