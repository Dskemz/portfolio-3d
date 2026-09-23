"use client";

import { motion } from "framer-motion";
import type { WorkflowNode, WorkflowPoint } from "@/content/workflowData";
import { Corners, Grid } from "./PanelChrome";

/**
 * État 1 : croquis vectoriel plein cadre, avec ses points d'intérêt annotés
 * qui apparaissent séquentiellement. Vit seul (pleine largeur de la fiche)
 * avant le dédoublement piloté par WorkflowCard — pas de logique de
 * baked/GLB ici, ça vit dans StepVisual une fois les 2 colonnes en place.
 */
export default function CroquisReveal({ node, active }: { node: WorkflowNode; active: boolean }) {
  return (
    <div className="relative h-full min-h-[clamp(9rem,22svh,18rem)] w-full overflow-hidden bg-[#0b0b0b]">
      <Grid />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 70% 30%, rgba(255,127,80,0.10), rgba(0,0,0,0) 70%)",
        }}
      />

      <Sketch variant={node.blueprint ?? 0} points={node.points} active={active} />
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.34em] text-white/30">
        Blueprint
      </span>

      <Corners />
    </div>
  );
}

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
