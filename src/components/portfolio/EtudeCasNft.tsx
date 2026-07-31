import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/Nft/HeroSection";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import ShibasSection from "@/components/projects/Nft/ShibasSection";
import CompositionsSection from "@/components/projects/Nft/CompositionsSection";
import RaresSection from "@/components/projects/Nft/RaresSection";
import LegendairesSection from "@/components/projects/Nft/LegendairesSection";
import ProjectFooter from "@/components/projects/Nft/ProjectFooter";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface EtudeCasNftProps {
  projet: ProjetData;
  precedent: ProjetLien;
  suivant: ProjetLien;
}

/**
 * Étude de cas éditoriale sur-mesure — FLOOFIES · Collection NFT 3D.
 *
 * Rendue via la route dynamique /portfolio/[slug] pour le slug "nft-floofies".
 * Compose les sections dédiées (hero, shibas de base, compositions modulaires,
 * rares cyberpunk, légendaires uniques) puis la navigation inter-projets standard.
 */
export function EtudeCasNft({
  precedent,
  suivant,
}: EtudeCasNftProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <ShibasSection />
      <PhraseSection>
        Une base commune, mille personnages — la modularité au service de l&apos;imaginaire.
      </PhraseSection>
      <CompositionsSection />
      <RaresSection />
      <LegendairesSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
