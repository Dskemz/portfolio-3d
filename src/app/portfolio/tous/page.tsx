import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import TheVault from "@/components/portfolio/TheVault";
import { CtaSignature } from "@/components/portfolio/CtaSignature";

export const metadata: Metadata = {
  title: "Tous les projets",
  description:
    "L'ensemble des réalisations 3D, filtrables par typologie : visites virtuelles interactives, temps réel web, modélisation produit et architecture.",
  alternates: { canonical: "/portfolio/tous" },
  openGraph: {
    title: "Tous les projets, graphiste 3D généraliste",
    description:
      "Visites virtuelles interactives, temps réel web, modélisation et architecture.",
    url: "/portfolio/tous",
    type: "website",
  },
};

export default function TousLesProjetsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* En-tête */}
      <section className="pb-12 pt-36 md:pt-40">
        <Container>
          <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
              Tous les projets
            </p>

            <h1 className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier lg:mt-0">
              L&apos;intégralité du travail, réuni au même endroit.{" "}
              <span className="text-orange-500">Filtrez par typologie</span> pour
              aller droit à ce qui vous intéresse.
            </h1>
          </div>
        </Container>
      </section>

      {/* Grille filtrable */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <TheVault />
        </Container>
      </section>

      {/* CTA signature partagé */}
      <CtaSignature />
    </div>
  );
}
