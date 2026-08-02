import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FluxCompetences from "@/components/about/FluxCompetences";

export const metadata: Metadata = {
  title: "À propos, graphiste 3D généraliste",
  description:
    "Denis Masquet, graphiste 3D généraliste : visites virtuelles parcourues dans le navigateur, modélisation 3D et temps réel web.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "À propos, graphiste 3D généraliste",
    description:
      "Visites virtuelles dans le navigateur, modélisation 3D et temps réel web.",
    url: "/about",
    type: "profile",
  },
};

export default function APropos() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* ------------------------------------------------------------------ */}
      {/*  Déclaration d'intention, inchangée                                */}
      {/* ------------------------------------------------------------------ */}
      <Container as="section" className="pb-16 pt-36 md:pt-40">
        <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
            Ce que je fais
          </p>

          <h1 className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier lg:mt-0">
            Graphiste 3D généraliste, je conçois des visites virtuelles que
            l&apos;on parcourt{" "}
            <span className="text-orange-500">
              directement dans le navigateur
            </span>
            . Ma démarche allie la maîtrise du rendu 3D à la fluidité des
            technologies web.
          </h1>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/*  Quatre domaines traversés par le fil                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-16 lg:py-24">
          <p className="mb-12 font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:mb-16">
            Quatre domaines
          </p>

          <FluxCompetences />
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Parcours, avec photo cerclée responsive                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-2">
              En deux mots
            </p>

            <div className="mt-8 lg:mt-0">
              {/* Layout responsive: flexbox col sur mobile, grid row sur desktop */}
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
                {/* Photo cerclée */}
                <div className="flex justify-center lg:justify-start">
                  <div className="aspect-square w-56 flex-shrink-0 overflow-hidden rounded-full border border-mine/30 lg:w-72">
                    <img
                      src="/images/denis-about.jpg"
                      alt="Denis Masquet"
                      className="h-full w-full object-cover object-[center_35%] scale-110 lg:object-[center_30%] lg:scale-125"
                    />
                  </div>
                </div>

                {/* Texte */}
                <div className="max-w-2xl space-y-5 text-base font-light leading-relaxed text-papier/70">
                  <p>
                    Passionné par les détails, la lumière et l&apos;ingénierie, je
                    mets depuis plus de 10 ans mon expertise en graphisme 3D au
                    service de projets exigeants où précision et esthétique se
                    rencontrent.
                  </p>
                  <p>
                    Mon parcours m&apos;a conduit à collaborer avec les secteurs de
                    l&apos;horlogerie de luxe, du médical et de la conservation
                    numérique d&apos;œuvres d&apos;art d&apos;envergure mondiale. Ces
                    expériences m&apos;ont permis de développer une approche alliant
                    rigueur technique, sens artistique et maîtrise des technologies
                    de visualisation.
                  </p>
                  <p>
                    Qu&apos;il s&apos;agisse de concevoir des rendus photoréalistes,
                    de valoriser un produit d&apos;exception ou de préserver
                    numériquement un patrimoine unique, je m&apos;attache à créer des
                    images qui racontent une histoire, révèlent chaque détail et
                    donnent vie aux projets les plus ambitieux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Appel, conservé, habillage aligné sur l'orange                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-14 lg:py-20">
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
        </Container>
      </div>
    </div>
  );
}
