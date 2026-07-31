import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Alquyme/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import PackagingSection from "@/components/projects/Alquyme/PackagingSection";
import DetailsGravureSection from "@/components/projects/Alquyme/DetailsGravureSection";
import VariantesTeintesSection from "@/components/projects/Alquyme/VariantesTeintesSection";
import ProjectFooter from "@/components/projects/Alquyme/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasAlquymeProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure — ALQUYME · Flacon d'exception.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "alquyme".
 * Compose les sections dédiées (hero, packaging & écrin, détails & gravure,
 * variantes de teintes) puis la navigation inter-projets standard du site.
 */
export function EtudeCasAlquyme({
  precedent,
  suivant,
}: EtudeCasAlquymeProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <PackagingSection />
      <PhraseSection>
        Aussi puissante qu&apos;une odeur — la lumière qui glisse sur l&apos;or raconte une histoire.
      </PhraseSection>
      <DetailsGravureSection />
      <VariantesTeintesSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
