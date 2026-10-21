import type { Metadata } from "next";
import ExperiencesNexus from "@/components/portfolio/ExperiencesNexus";

export const metadata: Metadata = {
  title: "Expériences 3D | M3D Studio",
  description:
    "Sélection de réalisations 3D : visites virtuelles interactives dans le navigateur, expériences temps réel web et modélisation produit haute définition.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Expériences 3D — M3D Studio",
    description:
      "Visites virtuelles interactives, temps réel web et modélisation 3D.",
    url: "/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[#04060a] text-white">
      <ExperiencesNexus />
    </main>
  );
}
