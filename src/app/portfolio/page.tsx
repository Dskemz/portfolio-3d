import type { Metadata } from "next";
import CarrouselProjets from "@/components/portfolio/CarrouselProjets";
import BandeauConfiance from "@/components/portfolio/BandeauConfiance";
import LienSobre from "@/components/portfolio/LienSobre";

export const metadata: Metadata = {
  title: "Projets — visites virtuelles et modélisation 3D",
  description:
    "L'ensemble des projets de visites virtuelles 3D et de modélisation : immobilier, produit et direction artistique.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Projets — visites virtuelles et modélisation 3D",
    description:
      "Visites virtuelles 3D et modélisation : immobilier, produit et direction artistique.",
    url: "/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/*
        Intro + carrousel + bandeau réunis dans UNE section (relative).
        Un trait fin vertical relie visuellement le titre à l'image.
      */}
      <main className="relative flex-grow overflow-x-clip">
        {/* Titre */}
        <div className="relative z-10 w-full px-6 pt-36 md:pt-44 lg:px-16 xl:px-24">
          <h1 className="font-display text-[clamp(2.1rem,5.6vw,4rem)] font-light leading-[1.05] tracking-tight text-papier">
            Mes Pro
            {/* Ancre du trait : le path démarre au bas de cette lettre */}
            <span id="trait-depart-j" className="relative inline-block">
              j
            </span>
            ets
          </h1>
        </div>

        {/* Trait fin vertical reliant titre à image — démarre sous la navbar */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 w-px -translate-x-1/2"
          style={{
            top: "clamp(9rem, 20vh, 12rem)",
            height: "clamp(5rem, 18vh, 14rem)",
            background:
              "linear-gradient(180deg, rgba(255,127,80,0) 0%, rgba(255,127,80,0.3) 50%, rgba(255,127,80,0.1) 100%)",
          }}
        />

        {/* Carrousel (le lien « Voir la grille » vit désormais dans sa colonne) */}
        <div className="relative z-10 w-full px-6 pb-16 pt-14 lg:px-16 lg:pb-20 lg:pt-16 xl:px-24">
          <CarrouselProjets />
        </div>

        {/*
          Couloir : bande entre le carrousel et les logos. Son centre donne la
          hauteur de transition visuelle. Sur TÉLÉPHONE, on peint ici un fil
          horizontal d'un bord à l'autre de la page.
        */}
        <div id="fil-couloir" aria-hidden className="relative h-12 lg:h-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-orange-500/25 blur-[3px] lg:hidden"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-orange-500/80 lg:hidden"
          />
        </div>

        {/* Bandeau logos */}
        <div className="relative z-10">
          <BandeauConfiance />
        </div>
      </main>

      {/* CTA final — remonté */}
      <section className="pb-24 pt-12 md:pb-28 md:pt-16">
        <div className="flex w-full flex-col gap-10 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-16 xl:px-24">
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-light leading-tight text-papier">
            Un <span className="text-orange-500">projet</span> en tête, discutons-en
          </h2>

          <LienSobre href="/contact" className="self-start">
            Parler de vos besoins
          </LienSobre>
        </div>
      </section>
    </div>
  );
}
