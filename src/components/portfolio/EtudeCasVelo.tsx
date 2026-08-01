import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Velo/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import InnovationSection from "@/components/projects/Velo/InnovationSection";
import FlocageSection from "@/components/projects/Velo/FlocageSection";
import VariantesFlotteSection from "@/components/projects/Velo/VariantesFlotteSection";
import ProjectFooter from "@/components/projects/Velo/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasVeloProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure, VÉLYVÉLO · Conception de Vélo Électrique.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "velyv-elo".
 * Compose les sections dédiées (hero, innovation & confort, flocage par enseigne,
 * variantes de flottes) puis la navigation inter-projets standard du site.
 */
export function EtudeCasVelo({
  precedent,
  suivant,
}: EtudeCasVeloProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <InnovationSection />
      <PhraseSection>
        Une architecture technique, mille identités visuelles, la mobilité comme plateforme.
      </PhraseSection>
      <FlocageSection />
      <VariantesFlotteSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
