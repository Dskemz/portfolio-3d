import type { Metadata } from "next";
import CarrouselProjets from "@/components/portfolio/CarrouselProjets";
import BandeauConfiance from "@/components/portfolio/BandeauConfiance";
import FilPortfolio from "@/components/portfolio/FilPortfolio";
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
        Intro + carrousel + bandeau réunis dans UNE section (relative) : le fil,
        tracé par FilPortfolio en un seul path SVG, court du « j » du titre
        jusqu'au couloir carrousel/logos sans coupure. `overflow-x-clip` borne
        le fil au bord de l'écran.
      */}
      <main className="relative flex-grow overflow-x-clip">
        <FilPortfolio />

        {/* Titre */}
        <div className="relative z-10 w-full px-6 pt-36 md:pt-44 lg:px-16 xl:px-24">
          <h1 className="font-display text-[clamp(2.1rem,5.6vw,4rem)] font-light leading-[1.05] tracking-tight text-papier">
            Mes Pro
            {/* Ancre du fil : le path démarre au bas de cette lettre */}
            <span id="fil-depart-j" className="relative inline-block">
              j
            </span>
            ets
          </h1>
        </div>

        {/* Carrousel (le lien « Voir la grille » vit désormais dans sa colonne) */}
        <div className="relative z-10 w-full px-6 pb-16 pt-14 lg:px-16 lg:pb-20 lg:pt-16 xl:px-24">
          <CarrouselProjets />
        </div>

        {/*
          Couloir : bande vide entre le carrousel et les logos. Son centre donne
          la hauteur à laquelle le fil repart horizontalement vers la droite.
        */}
        <div id="fil-couloir" aria-hidden className="h-12 lg:h-14" />

        {/* Bandeau logos — le fil passe juste au-dessus */}
        <div className="relative z-10">
          <BandeauConfiance />
        </div>
      </main>

      {/* CTA final — remonté */}
      <section className="pb-24 pt-12 md:pb-28 md:pt-16">
        <div className="flex w-full flex-col gap-10 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-16 xl:px-24">
          <h2 className="max-w-xl font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-light leading-tight text-papier">
            Un projet de visite virtuelle 3D&nbsp;?
          </h2>

          <LienSobre href="/contact" className="self-start">
            Parler de vos besoins
          </LienSobre>
        </div>
      </section>
    </div>
  );
}
