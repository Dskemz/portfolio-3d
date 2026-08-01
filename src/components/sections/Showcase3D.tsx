import { Parallax, Reveal } from "@/components/ui/Reveal";
import Viewer3D from "@/components/ui/Viewer3D";

interface Showcase3DProps {
  modelUrl: string;
  modelAlt?: string;
}

/**
 * Section démonstration.
 *
 * Ne contient que trois choses : un titre de section, un paragraphe court et
 * le viewer. Nom, métier, description, boutons et repères techniques vivent
 * exclusivement dans HeroIntro, en haut de page, rien n'est répété ici.
 */
export default function Showcase3D({
  modelUrl,
  modelAlt = "Visite virtuelle 3D interactive d'un bien immobilier",
}: Showcase3DProps) {
  return (
    <section
      id="visite-3d"
      aria-labelledby="visite-3d-titre"
      className="scroll-mt-24 border-t border-mine py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="visite-3d-titre"
            className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-tight text-papier"
          >
            Une visite virtuelle 3D, dans le navigateur, sans installation
          </h2>
          <p className="mt-5 text-base leading-relaxed text-papier/75">
            Le rendu est calculé en temps réel : mêmes matériaux, même éclairage
            et mêmes cotations que sur les visites livrées aux agences.
          </p>
        </Reveal>

        <Reveal delai={120} className="mt-14">
          <Parallax intensite={0.07}>
            <Viewer3D src={modelUrl} alt={modelAlt} ratio="16 / 9" />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
