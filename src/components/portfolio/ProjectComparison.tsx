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
 * comme au doigt, ainsi qu'au pavé numérique (scroll).
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

  const deplacerClavier = useCallback((deltaX: number) => {
    setPosition((p) => Math.max(0, Math.min(100, p + deltaX)));
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      // Bloquer COMPLÈTEMENT le scroll de la page pendant qu'on contrôle le carrousel
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      // Déplacer le curseur de comparaison avec une sensibilité légère
      const delta = e.deltaY > 0 ? 2 : -2;
      deplacerClavier(delta);
    },
    [deplacerClavier]
  );

  return (
    <section className="border-t border-mine pt-16">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
          Du wireframe au rendu final
        </p>
        <p className="mt-2 text-sm text-papier/70 font-light">
          Déplacez le curseur pour comparer le wireframe et le rendu final
        </p>
      </div>

      <div
        ref={conteneur}
        className="group relative mt-8 aspect-video cursor-ew-resize touch-none select-none overflow-hidden bg-graphite-800"
        onMouseMove={(e) => deplacer(e.clientX)}
        onTouchMove={(e) => deplacer(e.touches[0].clientX)}
        onWheel={onWheel}
        style={{ touchAction: "none" }}
      >
        {/* Rendu final, plan de fond avec légère surbrillance */}
        <div className="absolute inset-0">
          <Image
            src={finalUrl}
            alt={finalLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover brightness-105"
          />
          {/* Overlay subtil pour plus de contraste avec le wireframe */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Wireframe, révélé par clip-path, plus visible */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={wireframeUrl}
            alt={wireframeLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover opacity-95"
          />
        </div>

        {/* Trait de séparation, filet lumineux avec double flèche */}
        <div
          className="absolute inset-y-0 w-px bg-orange-500"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-[1px] w-[3px] bg-orange-500/40 blur-[3px]"
          />
          {/* Poignée + double flèches, plus visible */}
          <span className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center gap-0.5 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange-500/80 bg-black/75 backdrop-blur-sm transition-transform duration-300 group-hover:scale-125 group-hover:border-orange-500">
            {/* Double flèche gauche */}
            <span className="text-orange-500 text-sm font-bold leading-none">«</span>
            {/* Double flèche droite */}
            <span className="text-orange-500 text-sm font-bold leading-none">»</span>
          </span>
        </div>

        {/* Libellés */}
        <span className="pointer-events-none absolute left-4 top-4 border border-mine bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-papier/80 backdrop-blur-sm">
          {wireframeLabel}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 border border-mine bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-papier/80 backdrop-blur-sm">
          {finalLabel}
        </span>
      </div>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-trait/80">
        💡 Utilisez la souris, le doigt ou la molette pour explorer
      </p>
    </section>
  );
}
