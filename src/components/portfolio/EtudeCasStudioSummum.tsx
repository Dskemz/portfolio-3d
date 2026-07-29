import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/StudioSummum3D/HeroSection";
import GammeSection from "@/components/projects/StudioSummum3D/GammeSection";
import TexturesSection from "@/components/projects/StudioSummum3D/TexturesSection";
import TechBreakdownSection from "@/components/projects/StudioSummum3D/TechBreakdownSection";
import PackshotsSection from "@/components/projects/StudioSummum3D/PackshotsSection";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasStudioSummumProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure — STUDIO SUMMUM 3D.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "summum-3d".
 * Compose les 5 sections dédiées (hero, collection, textures, breakdown
 * technique, showroom) puis la navigation inter-projets standard du site.
 */
export function EtudeCasStudioSummum({
  precedent,
  suivant,
}: EtudeCasStudioSummumProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <GammeSection />
      <TexturesSection />
      <TechBreakdownSection />
      <PackshotsSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>
    </div>
  );
}
