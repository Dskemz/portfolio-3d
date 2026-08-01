import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/ChateauLaCommanderie/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import GammeSection from "@/components/projects/ChateauLaCommanderie/GammeSection";
import TexturesSection from "@/components/projects/ChateauLaCommanderie/TexturesSection";
import TechBreakdownSection from "@/components/projects/ChateauLaCommanderie/TechBreakdownSection";
import PackshotsSection from "@/components/projects/ChateauLaCommanderie/PackshotsSection";
import ProjectFooter from "@/components/projects/ChateauLaCommanderie/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasChateauLaCommanderieProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure, CHÂTEAU LA COMMANDERIE (Agences Georges).
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "agences-georges".
 * Compose les 5 sections dédiées (hero, gamme, textures, breakdown technique,
 * packshots) puis la navigation inter-projets standard du site.
 */
export function EtudeCasChateauLaCommanderie({
  precedent,
  suivant,
}: EtudeCasChateauLaCommanderieProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <GammeSection />
      <PhraseSection>
        De la bouteille à la matière : une identité qui se déguste des yeux.
      </PhraseSection>
      <TexturesSection />
      <TechBreakdownSection />
      <PackshotsSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
