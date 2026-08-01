import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Horlogerie/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import VilleretSection from "@/components/projects/Horlogerie/VilleretSection";
import PolarisSection from "@/components/projects/Horlogerie/PolarisSection";
import GalerieSection from "@/components/projects/Horlogerie/GalerieSection";
import ProjectFooter from "@/components/projects/Horlogerie/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasHorlogerieProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure, HORLOGERIE · Mise en scène de montres.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "horlogerie-suisse".
 * Compose les sections dédiées (hero, Villeret Chinese Calendar, Polaris Memovox,
 * galerie horlogère évolutive) puis la navigation inter-projets standard du site.
 */
export function EtudeCasHorlogerie({
  precedent,
  suivant,
}: EtudeCasHorlogerieProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <VilleretSection />
      <PhraseSection>
        Précision du geste, patience de la matière, l&apos;horlogerie comme discipline du regard.
      </PhraseSection>
      <PolarisSection />
      <GalerieSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
