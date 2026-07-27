"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

interface ProjectComparisonProps {
  wireframeUrl: string;
  wireframeLabel: string;
  finalUrl: string;
  finalLabel: string;
}

/**
 * Module signature « Du Wireframe au Rendu Final ».
 *
 * Deux images superposées à taille identique ; le wireframe est révélé par
 * `clip-path` piloté par la position du curseur. Le trait de séparation reprend
 * le filet lumineux du site (net orange + halo flouté). Fonctionne à la souris
 * comme au doigt.
 */
export function ProjectComparison({
  wireframeUrl,
  wireframeLabel,
  finalUrl,
  finalLabel,
}: ProjectComparisonProps) {
  const [position, setPosition] = useState(50);
  const conteneur = useRef<HTMLDivElement>(null);

  const deplacer = useCallback((clientX: number) => {
    const zone = conteneur.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <section className="border-t border-mine pt-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
        Du wireframe au rendu final
      </p>

      <div
        ref={conteneur}
        className="group relative mt-8 aspect-video cursor-ew-resize touch-none select-none overflow-hidden bg-graphite-800"
        onMouseMove={(e) => deplacer(e.clientX)}
        onTouchMove={(e) => deplacer(e.touches[0].clientX)}
      >
        {/* Rendu final — plan de fond */}
        <Image
          src={finalUrl}
          alt={finalLabel}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
        />

        {/* Wireframe — révélé par clip-path */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={wireframeUrl}
            alt={wireframeLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
          />
        </div>

        {/* Trait de séparation — filet lumineux */}
        <div
          className="absolute inset-y-0 w-px bg-orange-500"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-[1px] w-[3px] bg-orange-500/25 blur-[3px]"
          />
          {/* Poignée */}
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/60 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Libellés */}
        <span className="pointer-events-none absolute left-4 top-4 border border-mine bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-papier/80 backdrop-blur-sm">
          {wireframeLabel}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 border border-mine bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-papier/80 backdrop-blur-sm">
          {finalLabel}
        </span>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
        Glissez pour comparer
      </p>
    </section>
  );
}
