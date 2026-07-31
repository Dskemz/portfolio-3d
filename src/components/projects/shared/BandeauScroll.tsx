'use client';

import React from 'react';

interface BandeauScrollProps {
  /**
   * Classes du dégradé Tailwind pour le bandeau (ex. "from-amber-300 to-amber-400").
   * Chaque projet décline sa propre couleur.
   */
  degrade: string;
}

/**
 * Bandeau scroll réutilisable — reprend le design du Cartoon :
 * zone colorée avec "SCROLL" centré, flèche animée bounce.
 * Sépare visuellement la première partie (hero) de la deuxième partie (contenu).
 */
export default function BandeauScroll({ degrade }: BandeauScrollProps) {
  return (
    <div className={`w-full py-10 px-6 md:px-12 lg:px-20 bg-gradient-to-r ${degrade}`}>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-light text-white/80 uppercase tracking-wider drop-shadow-sm">
          Scroll
        </p>
        <div className="animate-bounce">
          <svg
            className="w-4 h-6 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
