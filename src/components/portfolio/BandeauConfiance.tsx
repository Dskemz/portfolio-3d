/**
 * BandeauConfiance — « Ils m'ont fait confiance ».
 *
 * Les logos ne sont plus pris entre deux filets gris : ils reposent sur un
 * BANDEAU FLOU épais. La bande est un conteneur de hauteur fixe (`overflow-hidden`)
 * dans lequel deux panneaux très floutés (un graphite large, un voile orange
 * pour le rappel d'accent) forment une nappe aux bords fondus, sans arête. Les
 * logos défilent par-dessus, centrés dans l'épaisseur.
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
    <section className="w-full py-10 lg:py-12">
      <p className="mb-8 px-6 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-trait lg:px-16">
        Ils m&apos;ont fait confiance
      </p>

      {/*
        Épaisseur du bandeau ≈ triplée : la hauteur du conteneur définit la
        nappe, `overflow-hidden` fond les panneaux dans cette bande.
      */}
      <div className="bandeau-confiance relative flex h-48 items-center overflow-hidden lg:h-56">
        {/* Nappe floue : deux panneaux superposés */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[94%] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-graphite-800/50 blur-[64px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-[72%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-orange-500/10 blur-[60px]"
        />

        {/* Fondus latéraux pour que les logos naissent et meurent en douceur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-black to-transparent"
        />

        <ul className="bandeau-piste relative z-[5] flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24">
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
