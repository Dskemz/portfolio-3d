import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "M3D Studio — À propos",
  description: "Créateur de solutions 3D universelles.",
  alternates: { canonical: "/about" },
};

export default function APropos() {
  return <AboutExperience />;
}
