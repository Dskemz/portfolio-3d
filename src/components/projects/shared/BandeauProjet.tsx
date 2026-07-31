import React from 'react';

interface BandeauProjetProps {
  /**
   * Classes du dégradé Tailwind (ex. "from-teal-300 via-cyan-300 to-sky-300").
   * Chaque projet décline sa propre teinte tout en gardant la même structure.
   */
  degrade: string;
  /** Texte affiché dans le bandeau. */
  children: React.ReactNode;
  /**
   * Fond de la section entourant le bandeau. Par défaut noir pour rester
   * homogène avec le dark mode des études de cas (Commanderie / Summum).
   */
  fondSection?: string;
}

/**
 * Bandeau de couleur commun à toutes les études de cas — repris tel quel du
 * projet Cartoon (rounded-3xl, dégradé horizontal, texte blanc centré). Sert de
 * séparateur entre la première et la deuxième partie de chaque projet, décliné
 * avec une teinte propre à chaque univers.
 */
export default function BandeauProjet({
  degrade,
  children,
  fondSection = 'bg-black',
}: BandeauProjetProps) {
  return (
    <section className={`w-full px-6 md:px-12 lg:px-20 py-12 md:py-16 ${fondSection}`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`rounded-3xl bg-gradient-to-r ${degrade} px-8 py-14 md:px-16 md:py-20 text-center`}
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight drop-shadow-sm max-w-3xl mx-auto">
            {children}
          </h3>
        </div>
      </div>
    </section>
  );
}
