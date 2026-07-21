import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — graphiste 3D généraliste",
  description:
    "Denis Masquet, graphiste 3D généraliste : visites virtuelles parcourues dans le navigateur, modélisation 3D et temps réel web.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "À propos — graphiste 3D généraliste",
    description:
      "Visites virtuelles dans le navigateur, modélisation 3D et temps réel web.",
    url: "/about",
    type: "profile",
  },
};

interface Domaine {
  numero: string;
  titre: string;
  description: string;
  lien: string;
  libelleLien: string;
}

/**
 * Quatre domaines, un par ligne. Le tableau est la source : ajouter une
 * entrée suffit, la numérotation et les filets suivent.
 */
const DOMAINES: readonly Domaine[] = [
  {
    numero: "01",
    titre: "Visite\nVirtuelle",
    description:
      "Des espaces que l'on parcourt dans le navigateur, sans installation ni plugin. Navigation libre, temps réel, et un éditeur propriétaire pour garder la main sur le contenu.",
    lien: "/visite-virtuelle",
    libelleLien: "Voir la solution",
  },
  {
    numero: "02",
    titre: "Modélisation\n3D",
    description:
      "Modèles haute fidélité optimisés pour le web. Le travail se joue autant sur la justesse du volume que sur le poids du fichier : un .glb qui charge vite reste un .glb que l'on regarde.",
    lien: "/portfolio",
    libelleLien: "Voir les projets",
  },
  {
    numero: "03",
    titre: "Temps réel\nWeb",
    description:
      "Babylon.js, WebGL, intégration sur mesure. La technique n'a d'intérêt que si elle disparaît : ce qui doit rester, c'est la fluidité de la visite sur n'importe quel appareil.",
    lien: "/visite-virtuelle",
    libelleLien: "Voir la démonstration",
  },
  {
    numero: "04",
    titre: "Direction\nartistique",
    description:
      "Recherche de matières, d'éclairage et de cadrage. Une intention architecturale se lit d'abord dans la lumière — c'est elle qui décide si le projet convainc ou reste un plan.",
    lien: "/portfolio",
    libelleLien: "Voir les projets",
  },
] as const;

export default function APropos() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* ------------------------------------------------------------------ */}
      {/*  Déclaration d'intention                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-36 md:pt-40 lg:px-16 xl:px-24">
        <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
            Ce que je fais
          </p>

          <h1 className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier lg:mt-0">
            Graphiste 3D généraliste, je conçois des visites virtuelles que
            l&apos;on parcourt{" "}
            <span className="text-graphite-500">
              directement dans le navigateur
            </span>
            . Ma démarche allie la maîtrise du rendu 3D à la fluidité des
            technologies web.
          </h1>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Domaines                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-6 lg:px-16 xl:px-24">
        {DOMAINES.map((domaine) => (
          <article
            key={domaine.numero}
            className="grid grid-cols-1 gap-6 border-t border-mine py-10 md:grid-cols-[4rem_1fr] md:gap-8 lg:grid-cols-[4rem_1fr_18rem] lg:gap-12 lg:py-12"
          >
            <p className="font-mono text-sm italic text-graphite-600">
              /{domaine.numero}
            </p>

            <h2 className="whitespace-pre-line font-display text-[clamp(1.75rem,2.8vw,2.5rem)] font-light leading-[1.05] tracking-tight text-papier">
              {domaine.titre}
            </h2>

            <div className="flex flex-col justify-between gap-5 md:col-start-2 lg:col-start-3">
              <p className="max-w-sm text-sm font-light leading-relaxed text-papier/60">
                {domaine.description}
              </p>

              <Link
                href={domaine.lien}
                className="group inline-flex items-center gap-4 self-start font-mono text-[10px] uppercase tracking-[0.24em] text-trait transition-colors duration-300 ease-sobre hover:text-bleu-encre"
              >
                {domaine.libelleLien}
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-mine transition-[width,background-color] duration-300 ease-sobre group-hover:w-14 group-hover:bg-bleu-encre"
                />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Parcours                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl border-t border-mine px-6 py-14 lg:px-16 lg:py-20 xl:px-24">
        <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-2">
            En deux mots
          </p>

          <div className="mt-8 max-w-xl space-y-5 text-base font-light leading-relaxed text-papier/70 lg:mt-0">
            <p>
              Chaque projet est une occasion de transformer des intentions
              architecturales en expériences tangibles. Plus qu&apos;une image,
              une solution technique qui simplifie la lecture de vos projets.
            </p>
            <p>
              Je travaille seul, du modèle au déploiement : c&apos;est ce qui
              permet de tenir les délais courts et de reprendre la main sur un
              détail sans passer par trois intermédiaires.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Appel                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl border-t border-mine px-6 py-14 lg:px-16 lg:py-20 xl:px-24">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="inline-block border border-mine px-8 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-papier transition-colors duration-300 ease-sobre hover:border-bleu-encre hover:text-bleu-encre"
          >
            Discuter de votre projet
          </Link>

          <a
            href="/DenisMASQUET_CV_2026.pdf"
            download="DenisMASQUET_CV_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-mine px-8 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-papier transition-colors duration-300 ease-sobre hover:border-bleu-encre hover:text-bleu-encre"
          >
            Télécharger mon CV
          </a>
        </div>
      </section>
    </div>
  );
}
