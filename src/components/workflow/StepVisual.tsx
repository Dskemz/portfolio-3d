"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { WorkflowNode, WorkflowPoint } from "@/content/workflowData";
import GlbViewer from "./GlbViewer";

/** Durée de l'état 1 (croquis + points) avant bascule vers le rendu baked. */
const STATE1_HOLD_MS = 3800;
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
 * Volet droit d'une fiche étape : croquis annoté → rendu baked figé → modèle
 * GLB interactif au survol (desktop) ou au tap (mobile).
 */
export default function StepVisual({ node, active }: { node: WorkflowNode; active: boolean }) {
  const [phase, setPhase] = useState<"sketch" | "baked">("sketch");
  const [spatial, setSpatial] = useState(false);
  const [glbReady, setGlbReady] = useState(false);
  const isTouch = useSyncExternalStore(subscribeHover, getIsTouch, getIsTouchServer);

  // Fiche qui quitte le flux (scroll arrière) : reset immédiat à l'état 1,
  // ajusté pendant le rendu plutôt que dans un effet (pas de setState après coup).
  const [trackedActive, setTrackedActive] = useState(active);
  if (active !== trackedActive) {
    setTrackedActive(active);
    if (!active) {
      setPhase("sketch");
      setSpatial(false);
    }
  }

  // Sortie de l'état 3 (survol/tap relâché) : même logique, ajustée au rendu.
  const [trackedSpatial, setTrackedSpatial] = useState(spatial);
  if (spatial !== trackedSpatial) {
    setTrackedSpatial(spatial);
    if (!spatial) setGlbReady(false);
  }

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setPhase("baked"), STATE1_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [active, node.id]);

  const canSpatialize = phase === "baked";

  const engage = () => {
    if (!isTouch && canSpatialize) setSpatial(true);
  };
  const disengage = () => {
    if (!isTouch) setSpatial(false);
  };
  const handleClick = () => {
    if (isTouch && canSpatialize) setSpatial((v) => !v);
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
        {phase === "sketch" && (
          <motion.div
            key="sketch"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sketch variant={node.blueprint ?? 0} points={node.points} active={active} />
            <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.34em] text-white/30">
              Blueprint
            </span>
          </motion.div>
        )}

        {phase === "baked" && !spatial && (
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
        )}

        {phase === "baked" && spatial && (
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

/* ─── Décor commun (grille technique + cotes d'angle) ─── */

function Grid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.16]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
      }}
    />
  );
}

function Corners() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-white/25" />
      <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-white/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-white/25" />
    </>
  );
}

/* ─── État 1 : croquis vectoriel + points d'intérêt animés ─── */

function Sketch({
  variant,
  points,
  active,
}: {
  variant: number;
  points?: WorkflowPoint[];
  active: boolean;
}) {
  const stroke = "rgba(255,255,255,0.62)";
  const thin = "rgba(255,255,255,0.24)";

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 240"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Axes de construction */}
      <g stroke={thin} strokeWidth={0.6}>
        <line x1="40" y1="200" x2="280" y2="200" />
        <line x1="40" y1="200" x2="40" y2="52" />
        <line x1="40" y1="200" x2="96" y2="228" />
      </g>

      {variant === 0 && (
        <g fill="none" stroke={stroke} strokeWidth={1.1} strokeLinecap="round">
          <path d="M110 190 L110 118 L118 96 L196 96 L204 118 L204 190" />
          <path d="M118 96 L118 60 L196 60 L196 96" />
          <path d="M110 130 L204 130" />
          <path d="M128 190 L128 214 M186 190 L186 214" />
        </g>
      )}

      {variant === 1 && (
        <g fill="none" stroke={stroke} strokeWidth={1.1}>
          <circle cx="160" cy="126" r="52" />
          <ellipse cx="160" cy="126" rx="52" ry="18" />
          <path d="M108 126 A52 52 0 0 0 212 126" />
          <path d="M160 74 L160 178" strokeDasharray="4 5" stroke={thin} />
        </g>
      )}

      {variant === 2 && (
        <g fill="none" stroke={stroke} strokeWidth={1.1} strokeLinejoin="round">
          <path d="M100 150 L160 118 L220 150 L160 182 Z" />
          <path d="M100 150 L100 106 L160 74 L220 106 L220 150" />
          <path d="M160 74 L160 118" />
          <path d="M130 166 L190 134" stroke={thin} strokeDasharray="3 4" />
        </g>
      )}

      {variant === 3 && (
        <g fill="none" stroke={stroke} strokeWidth={1.1}>
          <rect x="86" y="78" width="148" height="96" />
          <path d="M86 100 L234 100" />
          <circle cx="98" cy="89" r="3" />
          <circle cx="110" cy="89" r="3" />
          <path d="M120 138 L150 118 L180 142 L210 112" strokeLinecap="round" />
          <path d="M120 190 L200 190" stroke={thin} />
        </g>
      )}

      {/* Repères de cote */}
      <g stroke="rgba(255,127,80,0.55)" strokeWidth={0.9}>
        <line x1="262" y1="96" x2="272" y2="96" />
        <line x1="267" y1="92" x2="267" y2="100" />
        <line x1="52" y1="176" x2="62" y2="176" />
        <line x1="57" y1="172" x2="57" y2="180" />
      </g>

      {points?.map((point, index) => (
        <Callout key={point.id} point={point} index={index} active={active} />
      ))}
    </svg>
  );
}

/**
 * Une pastille sur le point, un trait droite-coude-droite qui se tire vers
 * elle (délai séquentiel de 200 ms entre chaque point), puis l'annotation.
 */
function Callout({ point, index, active }: { point: WorkflowPoint; index: number; active: boolean }) {
  const isLeft = point.x < 160;
  const stubX = isLeft ? point.x - 26 : point.x + 26;
  const stubY = point.y - 18;
  const runX = isLeft ? stubX - 30 : stubX + 30;
  const path = `M ${point.x} ${point.y} L ${stubX} ${stubY} L ${runX} ${stubY}`;
  const delay = 0.4 + index * 0.2;

  return (
    <g>
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={2.6}
        fill="#FF7F50"
        initial={false}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: 0.2, delay }}
        style={{ transformOrigin: `${point.x}px ${point.y}px` }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#FF7F50"
        strokeWidth={0.8}
        strokeLinecap="round"
        initial={false}
        animate={active ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.9, delay: delay + 0.1, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.text
        x={runX + (isLeft ? -4 : 4)}
        y={stubY + 2.6}
        textAnchor={isLeft ? "end" : "start"}
        className="font-mono uppercase"
        fontSize={7}
        letterSpacing={0.6}
        fill="rgba(255,255,255,0.78)"
        initial={false}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.85 }}
      >
        {point.label}
      </motion.text>
    </g>
  );
}

/* ─── État 2 : rendu baked figé + citation + CTA discret ─── */

function BakedRender({ node, showHint }: { node: WorkflowNode; showHint: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {node.bakedImage ? (
        <Image src={node.bakedImage} alt={node.title} fill className="object-cover" />
      ) : (
        <BakedPlaceholder variant={node.blueprint ?? 0} />
      )}

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
