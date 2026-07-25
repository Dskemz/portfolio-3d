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
        Intro + carrousel + bandeau logos réunis dans UNE section sans barre de
        séparation : le fil doit courir du titre jusqu'aux logos sans coupure.
        `overflow-x-clip` borne le fil parti du « j » (dimensionné en w-screen)
        au bord de l'écran.
      */}
      <main className="relative flex-grow overflow-x-clip">
        {/* ============================================================ */}
        {/*  FIL — part du bas du « j » de Projets, repart vers la gauche */}
        {/*  de l'écran, descend le long de la colonne de texte, et       */}
        {/*  finit sa course dans le bandeau logos. Desktop uniquement.    */}
        {/* ============================================================ */}
        {/*
          Construit en bordures peintes, zéro SVG :
          – le départ horizontal est ancré au « j » (span inline, plus bas) ;
          – ce bloc dessine le COUDE gauche + la descente : bordures haut+gauche,
            rayon en haut à gauche. Son bord haut rejoint le trait venu du « j »,
            son bord gauche descend jusqu'au bandeau.
          `left-6 lg:left-8` place la descente dans la gouttière, à gauche du
          texte. `bottom-0` l'amène au pied de la section, contre les logos.
        */}
        <span
          aria-hidden="true"
          style={{ top: "10.5rem" }}
          className="pointer-events-none absolute bottom-6 left-6 z-0 hidden w-[42vw] rounded-tl-[8px] border-l-[3px] border-t-[3px] border-orange-500/20 blur-[3px] lg:left-8 lg:block"
        />
        <span
          aria-hidden="true"
          style={{ top: "10.5rem" }}
          className="pointer-events-none absolute bottom-6 left-6 z-0 hidden w-[42vw] rounded-tl-[8px] border-l border-t border-orange-500/70 lg:left-8 lg:block"
        />

        <div className="relative z-10 w-full px-6 pt-40 md:pt-48 lg:px-16 xl:px-24">
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-tight text-papier">
            Mes Pro
            {/*
              Le fil part de la barre basse du « j » : `inline-block relative`
              ancre le départ, `top: 1.02em` le pose sous la panse de la lettre
              (là où descend sa hampe), `right-full` l'envoie vers la GAUCHE.
            */}
            <span className="relative inline-block">
              j
              <span
                aria-hidden="true"
                style={{ top: "1.02em" }}
                className="absolute right-full mr-1 hidden h-[3px] w-screen -translate-y-1/2 bg-orange-500/25 blur-[3px] lg:block"
              />
              <span
                aria-hidden="true"
                style={{ top: "1.02em" }}
                className="absolute right-full mr-1 hidden h-px w-screen -translate-y-1/2 bg-orange-500 lg:block"
              />
            </span>
            ets
          </h1>
        </div>

        {/* Carrousel */}
        <div className="relative z-10 w-full px-6 pb-24 pt-16 lg:px-16 lg:pb-28 lg:pt-20 xl:px-24">
          <CarrouselProjets />
        </div>

        {/* Lien vers la grille */}
        <div className="relative z-10 flex w-full justify-center px-6 pb-20 lg:px-16">
          <LienSobre href="/portfolio/tous">Voir la grille complète</LienSobre>
        </div>

        {/* Bandeau logos — cible du fil */}
        <div className="relative z-10">
          <BandeauConfiance />
        </div>
      </main>

      {/* CTA final */}
      <section className="py-24 md:py-32">
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
