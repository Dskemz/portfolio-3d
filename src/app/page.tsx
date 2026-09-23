import type { Metadata } from "next";
import HomeIntro from "@/components/home/HomeIntro";
import SkillFlow from "@/components/workflow/SkillFlow";

export const metadata: Metadata = {
  title: "M3D Studio — Moteur graphique N3D",
  description:
    "Deux voies de production 3D : le pipeline précalculé (modélisation, rendu) et le temps réel web (Babylon.js, visite virtuelle). Découvrez le flux complet.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "M3D Studio — Moteur graphique N3D",
    description: "M3D Studio. Création de solutions 3D avec moteur graphique N3D",
    url: "/",
    type: "website",
  },
};

export default function Accueil() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <HomeIntro>
        <SkillFlow />
      </HomeIntro>
    </div>
  );
}
