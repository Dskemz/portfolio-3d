/**
 * Configuration layout, creation-originales
 * 
 * Modifie colonnes/gap/ratio pour ajuster la mise en page.
 */

import type { SectionGrid } from "@/content/withings-layout-config";

/**
 * NOTE : le hero (01-hero) est déjà affiché en haut de page via le ProjectViewer.
 * Cette section n'est PAS incluse dans l'export final (voir en bas) pour éviter le doublon.
 * Elle reste ici si tu veux l'utiliser autrement.
 */
export const SECTION_HERO: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Design produit",
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
      name: "02-produit",
      label: "Produit",
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

export const SECTIONS_CREATION_ORIGINALES = [SECTION_BANNER, SECTION_DETAILS];
