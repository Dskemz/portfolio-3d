'use client';

import React from 'react';

interface BandeauScrollProps {
  /**
   * Classes du dégradé Tailwind (ex. "from-[#cbb894] to-[#e8dcc4]").
   * Chaque projet décline sa propre couleur.
   */
  degrade: string;
  /** Couleur du label "Scroll" et de la flèche (ex. "text-white/80" ou "text-stone-700"). */
  couleurTexte?: string;
}

/**
 * Bandeau scroll réutilisable, reprend le design du Cartoon : bande colorée
 * placée entre le hero et la première section, avec "SCROLL" centré et flèche
 * animée. Chaque projet le décline dans une couleur qui lui est propre.
 */
export default function BandeauScroll({
  degrade,
  couleurTexte = 'text-white/80',
}: BandeauScrollProps) {
  return (
    <div className={`w-full py-10 px-6 md:px-12 lg:px-20 bg-gradient-to-r ${degrade}`}>
      <div className="flex flex-col items-center gap-2">
        <p className={`text-xs font-light ${couleurTexte} uppercase tracking-wider`}>
          Scroll
        </p>
        <div className="animate-bounce">
          <svg
            className={`w-4 h-6 ${couleurTexte}`}
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
