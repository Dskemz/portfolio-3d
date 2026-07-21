"use client";

import Image from "next/image";
import type { WorkflowNode } from "@/content/workflowData";

/**
 * Volet droit d'une fiche : croquis technique sur fond sombre.
 *
 * Structuré pour accueillir plus tard une scène 3D au survol :
 * il suffira de monter un <canvas> dans `.blueprint-stage`, le reste
 * (cadre, grille, cotes) sert de fond statique.
 */
export default function BlueprintPanel({ node }: { node: WorkflowNode }) {
  const variant = node.blueprint ?? 0;

  return (
    <div className="blueprint-stage group/blueprint relative h-full min-h-[18rem] w-full overflow-hidden bg-[#0b0b0b]">
      {/* Grille technique */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Halo corail discret */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 70% 30%, rgba(255,127,80,0.10), rgba(0,0,0,0) 70%)",
        }}
      />

      {node.media ? (
        <Image
          src={node.media}
          alt={node.title}
          fill
          className="object-cover transition-transform duration-700 group-hover/blueprint:scale-105"
        />
      ) : (
        <Sketch variant={variant} />
      )}

      {/* Cotes d'angle */}
      <span aria-hidden className="absolute left-4 top-4 h-3 w-3 border-l border-t border-white/25" />
      <span aria-hidden className="absolute right-4 top-4 h-3 w-3 border-r border-t border-white/25" />
      <span aria-hidden className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/25" />
      <span aria-hidden className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-white/25" />

      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.34em] text-white/30">
        Blueprint
      </span>
    </div>
  );
}

/* ─── Croquis vectoriel générique, une variante par étape ─── */

function Sketch({ variant }: { variant: number }) {
  const stroke = "rgba(255,255,255,0.62)";
  const thin = "rgba(255,255,255,0.24)";

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 240"
      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover/blueprint:scale-[1.04]"
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
    </svg>
  );
}
