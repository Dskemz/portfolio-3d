import React from 'react';

interface BandeauProjetProps {
  /** Classes du dégradé Tailwind (ex. "from-[#cbb894] via-[#ddcbaa] to-[#e8dcc4]"). */
  degrade: string;
  /** Texte affiché dans le bandeau. */
  children: React.ReactNode;
  /** Couleur du texte (ex. "text-white" ou "text-stone-800"). */
  couleurTexte?: string;
  /** Fond de la section entourant le bandeau (dark mode homogène par défaut). */
  fondSection?: string;
}

/**
 * Encart de couleur commun aux études de cas, même structure que le Cartoon
 * (rounded-3xl, dégradé horizontal, texte centré). La teinte reprend celle du
 * bandeau scroll du projet pour une cohérence visuelle sur toute la page.
 */
export default function BandeauProjet({
  degrade,
  children,
  couleurTexte = 'text-white',
  fondSection = 'bg-black',
}: BandeauProjetProps) {
  return (
    <section className={`w-full gouttiere py-12 md:py-16 ${fondSection}`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`rounded-3xl bg-gradient-to-r ${degrade} px-8 py-14 md:px-16 md:py-20 text-center`}
        >
          <h3
            className={`text-2xl md:text-3xl lg:text-4xl font-light ${couleurTexte} leading-tight drop-shadow-sm max-w-3xl mx-auto`}
          >
            {children}
          </h3>
        </div>
      </div>
    </section>
  );
}
