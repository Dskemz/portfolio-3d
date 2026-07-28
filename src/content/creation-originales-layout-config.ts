/**
 * Configuration Création Originales — Design Produit 3D
 */

import type { SectionGrid } from "@/content/withings-layout-config";

export const SECTION_HERO: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Création Originales – Portfolio",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

export const SECTIONS_CREATION_ORIGINALES = [SECTION_HERO];
