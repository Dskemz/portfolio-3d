/**
 * Configuration layout — alquyme
 * 
 * Modifie colonnes/gap/ratio pour ajuster la mise en page.
 */

import type { SectionGrid } from "@/content/withings-layout-config";

export const SECTION_HERO: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Data visualization",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

export const SECTION_BANNER: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "02-dataviz",
      label: "Visualisation",
      ratio: "16/9",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};

export const SECTION_DETAILS: SectionGrid = {
  colonnes: 2,
  gap: "gap-4",
  images: [
    {
      name: "03-detail-1",
      label: "Détail 1",
      ratio: "1/1",
      teinte: "#14161a",
      colSpan: 1,
    },
    {
      name: "04-detail-2",
      label: "Détail 2",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};

export const SECTIONS_ALQUYME = [SECTION_HERO, SECTION_BANNER, SECTION_DETAILS];
