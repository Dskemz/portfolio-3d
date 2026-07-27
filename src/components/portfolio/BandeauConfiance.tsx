/**
 * BandeauConfiance — « Ils m'ont fait confiance ».
 *
 * Plus de nappe floue derrière les logos (retirée à la demande de D) : il ne
 * reste que le libellé et la piste qui défile, resserrés l'un contre l'autre.
 * Le fil orange qui passe juste au-dessus (tracé dans page.tsx) tient lieu de
 * séparation — inutile d'ajouter un fond.
 *
 * Défilement : piste dupliquée deux fois, translatée de -50 % en boucle ; la
 * couture est invisible car la seconde moitié copie la première.
 *
 * Wordmarks (noms typographiés) plutôt qu'images : aucun asset requis. Pour de
 * vrais logos, remplacer le contenu de la boucle par une balise <img> vers
 * /public/images/logos/ — piste et animation inchangées.
 *
 * Animation neutralisée sous `prefers-reduced-motion`.
 */

const CLIENTS: readonly string[] = [
  "Withings",
  "Nexity",
  "Bouygues Immobilier",
  "Vinci",
  "Sofitel",
  "Decathlon",
  "BNP Paribas",
  "Orange",
];

export default function BandeauConfiance() {
  // Deux copies bout à bout pour une boucle sans couture.
  const piste = [...CLIENTS, ...CLIENTS];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-16 xl:px-24">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
          Ils m&apos;ont fait confiance
        </p>
      </div>

      <div className="bandeau-confiance relative flex w-full items-center overflow-hidden">
        {/* Fondus latéraux pour que les logos naissent et meurent en douceur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-24 lg:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-24 lg:w-32"
        />

        <ul className="bandeau-piste flex w-max shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 lg:gap-24 lg:pr-24">
          {piste.map((nom, index) => (
            <li
              key={`${nom}-${index}`}
              aria-hidden={index >= CLIENTS.length}
              className="shrink-0 font-display text-lg font-light tracking-tight text-papier/40 transition-colors duration-300 hover:text-papier/80 lg:text-xl"
            >
              {nom}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .bandeau-piste {
          animation: bandeau-defilement 38s linear infinite;
          min-width: max-content;
        }
        .bandeau-confiance:hover .bandeau-piste {
          animation-play-state: paused;
        }
        @keyframes bandeau-defilement {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bandeau-piste { animation: none; }
        }
      `}</style>
    </section>
  );
}
