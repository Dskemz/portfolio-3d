import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Withings/HeroSection";
import BandeauScroll from "@/components/projects/shared/BandeauScroll";
import BandeauProjet from "@/components/projects/shared/BandeauProjet";
import Elements3DSection from "@/components/projects/Withings/Elements3DSection";
import MatieresSection from "@/components/projects/Withings/MatieresSection";
import LumiereSection from "@/components/projects/Withings/LumiereSection";
import ProjectFooter from "@/components/projects/Withings/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasWithingsProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas sur-mesure — WITHINGS ScanWatch 2, Light et Nova.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug
 * "withings-scanwatch". Compose les sections dédiées (hero immersif, éléments
 * 3D, matières et teintes, lumière et reflets) puis la navigation inter-projets
 * standard du site et le footer projet.
 *
 * Suit la charte des études de cas sur-mesure (fond noir, hero plein écran avec
 * parallax GSAP, typographie légère blanc/gris, images .jpg dans
 * /public/images/projets/withings/) tout en gardant un agencement propre à
 * l'identité horlogère de Withings.
 */
export function EtudeCasWithings({
  precedent,
  suivant,
}: EtudeCasWithingsProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <BandeauScroll degrade="from-sky-500 via-cyan-500 to-blue-500" couleurTexte="text-white/85" />
      <Elements3DSection />
      <BandeauProjet degrade="from-sky-500 via-cyan-500 to-blue-500">
        De la structure à la matière : chaque surface révèle la précision
        horlogère.
      </BandeauProjet>
      <MatieresSection />
      <LumiereSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
