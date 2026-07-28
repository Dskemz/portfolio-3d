/**
 * Configuration Horlogerie Suisse – Campagne Visuelle 360°
 */

import type { SectionGrid } from "@/content/withings-layout-config";

export const SECTION_HERO: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Horlogerie Suisse – Campagne",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

export const SECTIONS_HORLOGERIE_SUISSE = [SECTION_HERO];
