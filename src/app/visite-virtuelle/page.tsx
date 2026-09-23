import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import VisiteEmbed from "@/components/visite/VisiteEmbed";
import FluxServices from "@/components/visite/FluxServices";

export const metadata: Metadata = {
  title: "PRISM — Écosystème de visite 3D automatisée | M3D Studio",
  description:
    "M3D Studio. PRISM : découvrez notre solution complète pour les visites 3D automatisées. Du plan 2D à l'expérience 3D interactive avec hub de gestion centralisé et éditeur intelligent.",
  alternates: { canonical: "/visite-virtuelle" },
  openGraph: {
    title: "PRISM — Écosystème de visite 3D automatisée | M3D Studio",
    description:
      "PRISM : solution complète pour les visites 3D automatisées. Hub de gestion, éditeur intelligent, export HD photo/vidéo. Découvrez M3D Studio.",
    url: "/visite-virtuelle",
    type: "website",
  },
};

export default function VisiteVirtuelle() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* Hero, titre + sous-titre en continuité, aucun trait de coupure */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-papier">
              PRISM{" "}
              <span className="text-[#FF7F50]">
                Écosystème de visite 3D automatisée
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-papier/75">
              Découvrez notre{" "}
              <strong className="font-semibold text-papier">solution complète</strong> :
              du plan 2D à l'expérience 3D interactive.{" "}
              <strong className="font-semibold text-papier">Hub de gestion</strong>{" "}
              centralisé pour vos clients,{" "}
              <strong className="font-semibold text-papier">éditeur intelligent</strong>{" "}
              avec configuration en temps réel, et{" "}
              <strong className="font-semibold text-papier">export HD</strong>{" "}
              photo/vidéo automatisé.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Visite embarquée, pleine largeur en annonce, se ramène aux dimensions
          du viewer quand on ouvre la visite 3D. Aucun fichier distant touché :
          le dimensionnement est géré ici (voir VisiteEmbed). */}
      <VisiteEmbed />

      {/* Points clés, flux électrique traversant les 3 atouts (cf. /about).
          Gouttière fluide (au lieu d'un px-6 plat) pour que le flux ne colle
          pas aux bords sur Full HD / 2K / ultra-wide. */}
      <section className="gouttiere pt-20 pb-24 md:pb-32">
        <FluxServices />
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-papier">
              Découvrir PRISM
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-papier/75">
              Explorez l'écosystème complet de visite 3D automatisée et découvrez comment PRISM peut transformer vos besoins en solutions universelles.
            </p>
            <Link
              href="/services"
              className="mt-9 inline-block bg-[#FF7F50] px-6 py-3 font-display text-sm font-medium tracking-wide text-black transition-colors hover:bg-[#E67E22]"
            >
              Découvrir PRISM
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
