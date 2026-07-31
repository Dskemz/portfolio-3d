import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/SteamOne/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import EclateSection from "@/components/projects/SteamOne/EclateSection";
import ArchitectureSection from "@/components/projects/SteamOne/ArchitectureSection";
import ExplorationSection from "@/components/projects/SteamOne/ExplorationSection";
import ProjectFooter from "@/components/projects/SteamOne/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasSteamOneProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure — STEAMONE · Défroisseur vapeur.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "steamone".
 * Compose les sections dédiées (hero, éclaté produit, architecture interne,
 * exploration multi-axes) puis la navigation inter-projets standard du site.
 */
export function EtudeCasSteamOne({
  precedent,
  suivant,
}: EtudeCasSteamOneProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <EclateSection />
      <PhraseSection>
        Comprendre un objet, c&apos;est le laisser se raconter — pièce par pièce, geste par geste.
      </PhraseSection>
      <ArchitectureSection />
      <ExplorationSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
