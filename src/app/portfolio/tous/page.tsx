import type { Metadata } from "next";
import GrilleProjets from "@/components/portfolio/GrilleProjets";
import LienSobre from "@/components/portfolio/LienSobre";

export const metadata: Metadata = {
  title: "Tous les projets",
  description:
    "L'ensemble des projets en mosaïque : visites virtuelles 3D, modélisation et direction artistique.",
  alternates: { canonical: "/portfolio/tous" },
  openGraph: {
    title: "Tous les projets",
    description:
      "Visites virtuelles 3D, modélisation et direction artistique.",
    url: "/portfolio/tous",
    type: "website",
  },
};

export default function TousLesProjetsPage() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* La colonne de gauche porte le titre : pas d'en-tête au-dessus. */}
      <main className="flex-grow pt-24 lg:pt-0">
        <GrilleProjets />
      </main>

      {/* CTA final */}
      <section className="border-t border-mine py-24 md:py-32">
        <div className="flex w-full flex-col gap-10 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-16 xl:px-24">
          <h2 className="max-w-xl font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-papier">
            Votre bien mérite mieux qu'une galerie photo
          </h2>

          <LienSobre href="/contact" className="self-start">
            Demander un devis
          </LienSobre>
        </div>
      </section>
    </div>
  );
}
