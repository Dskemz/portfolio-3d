/**
 * BandeauConfiance — « Ils m'ont fait confiance ».
 *
 * Un défilement horizontal continu de logos clients. La piste est dupliquée
 * deux fois et translatée de -50 % en boucle : la couture est invisible car la
 * seconde moitié est la copie exacte de la première.
 *
 * Rendu en wordmarks (noms typographiés) plutôt qu'en images : aucun asset à
 * fournir, et le rendu reste net à toute densité d'écran. Pour passer à de
 * vrais logos, remplacer le contenu de la boucle par une balise <img> pointant
 * vers /public/images/logos/ — le reste (piste, animation) ne change pas.
 *
 * L'animation est neutralisée sous `prefers-reduced-motion` (règle dans le
 * <style> ci-dessous), la bande devient alors simplement statique.
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
    <section className="w-full overflow-hidden py-16 lg:py-20">
      <p className="mb-10 px-6 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-trait lg:px-16">
        Ils m&apos;ont fait confiance
      </p>

      <div className="bandeau-confiance relative flex overflow-hidden">
        {/* Fondu sur les deux bords pour que les logos naissent et meurent en douceur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent"
        />

        <ul className="bandeau-piste flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24">
          {piste.map((nom, index) => (
            <li
              key={`${nom}-${index}`}
              aria-hidden={index >= CLIENTS.length}
              className="shrink-0 font-display text-lg font-light tracking-tight text-papier/35 transition-colors duration-300 hover:text-papier/70 lg:text-xl"
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
