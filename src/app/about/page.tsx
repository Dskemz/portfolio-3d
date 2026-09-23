import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FluxCompetences from "@/components/about/FluxCompetences";

export const metadata: Metadata = {
  title: "M3D Studio — Studio création solutions 3D",
  description:
    "M3D Studio : studio de création spécialisé dans les solutions 3D universelles. PRISM, N3D Studio, N3D Générateur. Retail, immobilier, musées, industrie.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "M3D Studio — Studio création solutions 3D",
    description:
      "M3D Studio crée des solutions 3D universelles : PRISM (visite automatisée), N3D (moteur graphique), N3D Studio (capture/export).",
    url: "/about",
    type: "website",
  },
};

export default function APropos() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* ------------------------------------------------------------------ */}
      {/*  Studio Vision — Product-centric positioning                      */}
      {/* ------------------------------------------------------------------ */}
      <Container as="section" className="pb-16 pt-36 md:pt-40">
        <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
            M3D Studio
          </p>

          <h1 className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier lg:mt-0">
            Créateur de{" "}
            <span className="text-orange-500">
              solutions 3D universelles
            </span>
            . Nous transformons la manière dont les marques présentent leurs produits et services à travers le moteur graphique N3D et l'écosystème PRISM.
          </h1>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/*  Trois solutions                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-16 lg:py-24">
          <p className="mb-12 font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:mb-16">
            Nos solutions
          </p>

          <FluxCompetences />
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Studio Bio et Approche                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-2">
              Notre vision
            </p>

            <div className="mt-8 lg:mt-0">
              <div className="max-w-3xl space-y-6 text-base font-light leading-relaxed text-papier/70">
                <p>
                  M3D Studio est un studio de création spécialisé dans les solutions 3D universelles. Fondé sur l&apos;expertise en modélisation 3D haute-fidélité et rendu Babylon.js, nous conçoivent des expériences interactives clef-en-main pour le retail, l&apos;immobilier, les musées, et l&apos;industrie.
                </p>
                <p>
                  Nous ne faisons pas du freelance sur mesure. Nous bâtissons des produits. C&apos;est pourquoi nous avons créé N3D, notre moteur graphique universel, et PRISM, notre écosystème de visite 3D automatisée.
                </p>
                <p>
                  Nous croyons en la qualité plutôt que la quantité. Chaque solution est testée en production avant déploiement. Notre approche avec Withings, Mesplaques, Cartoon prouve la fiabilité de nos produits. L&apos;automatisation est au cœur de notre vision : moins d&apos;intervention manuelle signifie meilleure scalabilité client et plus de rentabilité.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  CTA — Déployer une solution N3D                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <Container as="section" className="py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
              Commencer
            </p>

            <div className="mt-8 lg:mt-0">
              <p className="max-w-2xl text-base font-light leading-relaxed text-papier/70">
                Prêt à déployer une solution N3D pour votre cas d&apos;usage ? Consultez nos études de cas ou contactez-nous pour explorer comment PRISM, N3D Studio ou N3D Générateur peuvent transformer votre approche.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/portfolio"
                  className="inline-block border border-mine px-8 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-papier transition-colors duration-300 ease-sobre hover:border-orange-500 hover:text-orange-500"
                >
                  Voir nos projets
                </Link>

                <Link
                  href="/contact"
                  className="inline-block border border-mine px-8 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-papier transition-colors duration-300 ease-sobre hover:border-orange-500 hover:text-orange-500"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
