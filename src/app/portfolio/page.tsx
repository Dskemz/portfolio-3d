import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import CarrouselProjets from "@/components/portfolio/CarrouselProjets";
import BandeauConfiance from "@/components/portfolio/BandeauConfiance";
import LienSobre from "@/components/portfolio/LienSobre";
import { CtaSignature } from "@/components/portfolio/CtaSignature";

export const metadata: Metadata = {
  title: "Mes Projets, visites virtuelles, temps réel et modélisation 3D",
  description:
    "Sélection de réalisations 3D : visites virtuelles interactives dans le navigateur, expériences temps réel web et modélisation produit haute définition.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Mes Projets, graphiste 3D généraliste",
    description:
      "Visites virtuelles interactives, temps réel web et modélisation 3D.",
    url: "/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* ------------------------------------------------------------------ */}
      {/*  Intro + carrousel des projets phares                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="pb-16 pt-36 md:pt-40">
        <Container>
          <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
              Mes projets
            </p>

            <h1 className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier lg:mt-0">
              Une sélection de réalisations où le rendu 3D rencontre la fluidité
              du web :{" "}
              <span className="text-orange-500">
                visites virtuelles interactives
              </span>
              , expériences temps réel et modélisation produit haute définition.
            </h1>
          </div>

          {/* Carrousel principal, 8 projets phares (lazy-load interne) */}
          <div className="mt-16 lg:mt-20">
            <CarrouselProjets />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Bandeau défilant, logos clients (marquee infini)                 */}
      {/*  Le composant rend son propre libellé + section.                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-mine">
        <BandeauConfiance />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Accès à la grille complète, page dédiée /portfolio/tous          */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-mine py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
                Tout le travail
              </p>
              <h2 className="mt-8 font-display text-[clamp(1.4rem,2.1vw,2rem)] font-light leading-[1.35] tracking-tight text-papier">
                Au-delà des projets phares, retrouvez l&apos;intégralité des
                réalisations, filtrables par typologie.
              </h2>
            </div>

            <LienSobre href="/portfolio/tous" className="self-start lg:self-auto">
              Voir tous les projets
            </LienSobre>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  CTA signature, filet lumineux + lien contact (partagé)           */}
      {/* ------------------------------------------------------------------ */}
      <CtaSignature />
    </div>
  );
}
