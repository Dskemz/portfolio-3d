interface ProjectHeaderProps {
  client: string;
  titre: string;
  role: string;
  outils: string[];
  annee: number;
}

/**
 * En-tête minimaliste de la page projet. Reprend la trame éditoriale du site :
 * surtitre mono, titre display léger, puis métadonnées techniques en grille,
 * séparées par un filet `border-mine`.
 */
export function ProjectHeader({
  client,
  titre,
  role,
  outils,
  annee,
}: ProjectHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-6xl px-6 pb-16 pt-36 md:pt-40 lg:px-16 xl:px-24">
      <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-500 lg:pt-4">
          {client}
        </p>

        <div className="mt-8 lg:mt-0">
          <h1 className="max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] tracking-tight text-papier">
            {titre}
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-papier/60 md:text-base">
            {role}
          </p>
        </div>
      </div>

      {/* Métadonnées techniques */}
      <dl className="mt-16 grid gap-10 border-t border-mine pt-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
            Année
          </dt>
          <dd className="mt-3 font-display text-2xl font-light text-papier">
            {annee}
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
            Client
          </dt>
          <dd className="mt-3 font-display text-2xl font-light text-papier">
            {client}
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
            Outils
          </dt>
          <dd className="mt-3 flex flex-wrap gap-2">
            {outils.map((outil) => (
              <span
                key={outil}
                className="inline-block border border-mine px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-trait transition-colors duration-300 hover:border-orange-500/40 hover:text-papier"
              >
                {outil}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </header>
  );
}
