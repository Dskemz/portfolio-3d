import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/SalleDeBain/HeroSection";
import BandeauScroll from "@/components/projects/shared/BandeauScroll";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import IntroductionSection from "@/components/projects/SalleDeBain/IntroductionSection";
import ScenographieSection from "@/components/projects/SalleDeBain/ScenographieSection";
import EclairageSection from "@/components/projects/SalleDeBain/EclairageSection";
import WorkflowTechniqueSection from "@/components/projects/SalleDeBain/WorkflowTechniqueSection";
import ProjectFooter from "@/components/projects/SalleDeBain/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasSalleDeBainProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure, ARCHITECTURE D'INTÉRIEUR · SALLE DE BAIN.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "decotec".
 * Compose les sections dédiées (hero, introduction, scénographies, éclairage,
 * workflow technique) puis la navigation inter-projets standard du site.
 */
export function EtudeCasSalleDeBain({
  precedent,
  suivant,
}: EtudeCasSalleDeBainProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <BandeauScroll degrade="from-slate-600 to-slate-800" />
      <IntroductionSection />
      <PhraseSection>
        Du matériau au pixel : chaque surface raconte une intention de design.
      </PhraseSection>
      <ScenographieSection />
      <EclairageSection />
      <WorkflowTechniqueSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
