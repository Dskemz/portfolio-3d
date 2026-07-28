/**
 * TEMPLATE — Configuration layout pour un nouveau projet
 * 
 * À utiliser :
 * 1. Copie ce fichier en `mon-projet-layout-config.ts`
 * 2. Remplis tes données
 * 3. Importe et utilise dans [slug]/page.tsx
 * 
 * Voilà. C'est tout. Zéro code.
 */

import type { SectionGrid } from "@/content/withings-layout-config";

/**
 * Section 1 — Hero ou intro
 */
export const SECTION_1: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Visuel maître",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

/**
 * Section 2 — Exemple de grille 3 colonnes
 */
export const SECTION_2: SectionGrid = {
  colonnes: 3, // ← Change à 2, 4, 5 si besoin
  gap: "gap-4",
  images: [
    {
      name: "02-banner",
      label: "Vue d'ensemble",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 3,
    },
    {
      name: "03-detail-1",
      label: "Détail 1",
      ratio: "4/3",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "04-detail-2",
      label: "Détail 2",
      ratio: "4/3",
      teinte: "#1b1e23",
      colSpan: 1,
    },
    {
      name: "05-detail-3",
      label: "Détail 3",
      ratio: "4/3",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};

/**
 * Section 3 — Exemple de grille asymétrique
 */
export const SECTION_3: SectionGrid = {
  colonnes: 4,
  gap: "gap-4",
  images: [
    {
      name: "06-large",
      label: "Image large",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 2, // Prend 2 colonnes
    },
    {
      name: "07-small-1",
      label: "Petit 1",
      ratio: "1/1",
      teinte: "#252930",
      colSpan: 1,
    },
    {
      name: "08-small-2",
      label: "Petit 2",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "09-small-3",
      label: "Petit 3",
      ratio: "1/1",
      teinte: "#252930",
      colSpan: 1,
    },
    {
      name: "10-small-4",
      label: "Petit 4",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
  ],
};

// À exporter pour utiliser dans [slug]/page.tsx
export const SECTIONS_MON_PROJET = [SECTION_1, SECTION_2, SECTION_3];
