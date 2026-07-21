import type { Metadata } from "next";
import IndexProjets from "@/components/portfolio/IndexProjets";
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
      {/* En-tête */}
      <section className="border-b border-mine pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="w-full px-6 lg:px-16 xl:px-24">
          <h1 className="max-w-4xl font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-tight text-papier">
            Des espaces qui se{" "}
            <span className="text-bleu-encre">visitent</span>, pas qui se
            feuillettent
          </h1>

          <p className="mt-10 max-w-xl text-base font-light leading-relaxed text-papier/60">
            Visites virtuelles, modélisation, direction artistique. Tout est
            là, dans l'ordre.
          </p>
        </div>
      </section>

      {/* Index : texte à gauche, visuels à droite */}
      <main className="flex-grow border-b border-mine">
        <IndexProjets />

        <div className="flex w-full justify-center px-6 pb-24 lg:px-16 lg:pb-32">
          <LienSobre href="/portfolio/tous">Voir la grille complète</LienSobre>
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
