/**
 * Configuration layout — decotec
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
      label: "Architecture d'intérieur",
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
      name: "02-showroom",
      label: "Showroom virtuel",
      ratio: "16/9",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};

export const SECTION_DETAILS: SectionGrid = {
  colonnes: 3,
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
    {
      name: "05-detail-3",
      label: "Détail 3",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
  ],
};

export const SECTIONS_DECOTEC = [SECTION_HERO, SECTION_BANNER, SECTION_DETAILS];
