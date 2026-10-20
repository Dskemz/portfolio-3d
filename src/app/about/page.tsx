import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "À propos de M3D Studio — Solutions 3D interactives",
  description:
    "Découvrez M3D Studio, studio français spécialisé dans les expériences 3D interactives, la modélisation haute fidélité et les solutions web temps réel.",
  keywords: [
    "studio 3D",
    "solutions 3D interactives",
    "expérience 3D web",
    "modélisation 3D",
    "Babylon.js",
    "viewer 3D",
    "M3D Studio",
  ],
  authors: [{ name: "M3D Studio" }],
  creator: "M3D Studio",
  publisher: "M3D Studio",
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/about",
    siteName: "M3D Studio",
    title: "À propos de M3D Studio — Solutions 3D interactives",
    description:
      "Studio français spécialisé dans les expériences 3D interactives et les solutions web temps réel.",
  },
  twitter: {
    card: "summary",
    title: "À propos de M3D Studio — Solutions 3D interactives",
    description:
      "Studio français spécialisé dans les expériences 3D interactives et les solutions web temps réel.",
  },
};

export default function APropos() {
  return <AboutExperience />;
}
