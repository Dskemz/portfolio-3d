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
        Intro + carrousel réunis dans UNE section, sans barre de séparation :
        le fil doit pouvoir courir du titre jusqu'au lien sans être coupé.
        `overflow-x-clip` borne le fil qui part du mot « Projets » (dimensionné
        en w-screen) au bord de l'écran, sans barre de défilement.
      */}
      <main className="relative flex-grow overflow-x-clip border-b border-mine">
        <div className="w-full px-6 pt-40 md:pt-48 lg:px-16 xl:px-24">
          {/* ---------------------------------------------------------- */}
          {/*  Titre                                                     */}
          {/* ---------------------------------------------------------- */}
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-tight text-papier">
            Mes{" "}
            {/*
              Le fil part de la barre basse du « t » de « Projets », comme sur
              /contact : `inline-block relative` ancre le départ, `top: 0.93em`
              le cale sur la barre, `left-full` le colle à la fin du mot.
            */}
            <span className="relative inline-block">
              Projets
              <span
                aria-hidden="true"
                style={{ top: "0.93em" }}
                className="absolute left-full ml-6 hidden h-[3px] w-screen -translate-y-1/2 bg-orange-500/25 blur-[3px] lg:block"
              />
              <span
                aria-hidden="true"
                style={{ top: "0.93em" }}
                className="absolute left-full ml-6 hidden h-px w-screen -translate-y-1/2 bg-orange-500 lg:block"
              />
            </span>
          </h1>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Carrousel                                                   */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full px-6 pb-24 pt-16 lg:px-16 lg:pb-28 lg:pt-20 xl:px-24">
          <CarrouselProjets />
        </div>

        {/*
          Contour du fil : depuis le bord droit (où arrive le trait parti du
          « t »), il descend le long de la droite du carrousel puis vient
          buter au centre, sous le carrousel, là où se trouve le lien. Deux
          bordures peintes (droite + bas) et un rayon sur le coin bas-droit —
          zéro SVG. Desktop uniquement : sur mobile le carrousel est empilé.
        */}
        <span
          aria-hidden="true"
          style={{ top: "9.5rem", bottom: "5.5rem" }}
          className="pointer-events-none absolute left-1/2 right-6 z-0 hidden rounded-br-[8px] border-b-[3px] border-r-[3px] border-orange-500/20 blur-[3px] lg:block lg:right-16 xl:right-24"
        />
        <span
          aria-hidden="true"
          style={{ top: "9.5rem", bottom: "5.5rem" }}
          className="pointer-events-none absolute left-1/2 right-6 z-0 hidden rounded-br-[8px] border-b border-r border-orange-500/70 lg:block lg:right-16 xl:right-24"
        />

        {/* ------------------------------------------------------------ */}
        {/*  Lien vers la grille — cible du fil                          */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-10 flex w-full justify-center px-6 pb-24 lg:px-16 lg:pb-28">
          <LienSobre href="/portfolio/tous">Voir la grille complète</LienSobre>
        </div>
      </main>

      {/* Bande de logos, sous la ligne du carrousel */}
      <BandeauConfiance />

      {/* CTA final */}
      <section className="border-t border-mine py-24 md:py-32">
        <div className="flex w-full flex-col gap-10 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-16 xl:px-24">
          <h2 className="max-w-xl font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-papier">
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
