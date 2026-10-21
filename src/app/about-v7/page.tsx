import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = { title: "Denis Masquet — Expériences virtuelles", description: "Designer 3D et créateur d’expériences virtuelles interactives pour le web." };

export default function AProposV7() { return <AboutExperience />; }
