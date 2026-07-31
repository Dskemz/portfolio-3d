import type { ProjetData } from "../../content/projets";
import { ProjectNavigation } from "./ProjectNavigation";
import HeroSection from "@/components/projects/StudioSummum3D/HeroSection";
import BandeauScroll from "@/components/projects/shared/BandeauScroll";
import PhraseSection from "@/components/projects/shared/PhraseSection";
import DefiSection from "@/components/projects/StudioSummum3D/DefiSection";
import ComparatifSection from "@/components/projects/StudioSummum3D/ComparatifSection";
import FocusMatiereSection from "@/components/projects/StudioSummum3D/FocusMatiereSection";
import ShowroomSection from "@/components/projects/StudioSummum3D/ShowroomSection";
import ProjectFooter from "@/components/projects/StudioSummum3D/ProjectFooter";

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

export function EtudeCasStudioSummum({
  precedent,
  suivant,
}: EtudeCasStudioSummumProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black">
      <HeroSection />
      <BandeauScroll degrade="from-[#928674] via-[#a89a83] to-[#c2b59d]" couleurTexte="text-stone-800" />
      <DefiSection />
      <PhraseSection>
        Du défi au rendu final : le produit révélé sous son meilleur jour.
      </PhraseSection>
      <ComparatifSection />
      <FocusMatiereSection />
      <ShowroomSection />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-16 xl:px-24">
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      <ProjectFooter />
    </div>
  );
}
