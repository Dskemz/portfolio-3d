import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Cartoon/HeroSection";
import IntroSection from "@/components/projects/Cartoon/IntroSection";
import ScenesSection from "@/components/projects/Cartoon/ScenesSection";
import ProjectFooter from "@/components/projects/Cartoon/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasCartoonProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas sur-mesure, LE CARTOON MIS EN SCÈNE (slug creation-originales).
 *
 * Rendue via la route dynamique /portfolio/[slug]. Rupture assumée avec le thème
 * sombre des autres études de cas : fond clair et fonds pastel/pop pour coller à
 * l'univers coloré et ludique des créations, tout en gardant l'ossature
 * technique commune (hero plein écran, parallax GSAP, sections
 * py-16 px-6 md:px-12 lg:px-20, images .jpg dans
 * /public/images/projets/creation-originales/).
 */
export function EtudeCasCartoon({
  precedent,
  suivant,
}: EtudeCasCartoonProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <IntroSection />
      <ScenesSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
