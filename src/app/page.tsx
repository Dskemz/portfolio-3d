import type { Metadata } from "next";
import SkillFlow from "@/components/workflow/SkillFlow";

export const metadata: Metadata = {
  title: "Denis Masquet — Graphiste 3D généraliste | Graphite 3D",
  description:
    "Deux voies de production 3D : le pipeline précalculé (modélisation, rendu) et le temps réel web (Babylon.js, visite virtuelle). Découvrez le flux complet.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Denis Masquet — Graphiste 3D généraliste",
    description:
      "Du pipeline précalculé au temps réel web : modélisation 3D, Babylon.js et visites virtuelles immersives.",
    url: "/",
    type: "website",
  },
};

export default function Accueil() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <SkillFlow />
    </div>
  );
}
