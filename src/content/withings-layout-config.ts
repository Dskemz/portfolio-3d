/**
 * Configuration COMPLÈTE du projet Withings — mise en page + images.
 * 
 * Tu peux modifier :
 * - colonnes : nombre de colonnes de la grille (1, 2, 3, 4...)
 * - gap : espacement entre les images
 * - Les ratios individuels de chaque image
 * 
 * Tout s'adapte automatiquement. Zéro code à toucher ailleurs.
 */

export interface ImageConfig {
  name: string;
  label: string;
  ratio: "21/9" | "16/9" | "9/16" | "4/3" | "3/4" | "1/1";
  teinte: string;
  colSpan?: 1 | 2 | 3 | 4; // Sur combien de colonnes l'image s'étend
}

export interface SectionGrid {
  colonnes: 1 | 2 | 3 | 4 | 5 | 6; // Nombre de colonnes
  gap: "gap-2" | "gap-3" | "gap-4" | "gap-6" | "gap-8"; // Espacement
  images: ImageConfig[];
}

/**
 * HEADER — Hero
 */
export const SECTION_HERO: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "01-hero",
      label: "Visuel maître — gamme ScanWatch 2",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 1 — Éléments 3D
 */
export const SECTION_CHAPITRE_1: SectionGrid = {
  colonnes: 3, // ← CHANGE ICI pour passer à 2 ou 4 colonnes
  gap: "gap-4",
  images: [
    {
      name: "02-face",
      label: "Gamme complète ScanWatch 2",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 3, // Prend les 3 colonnes
    },
    {
      name: "02b-face-38",
      label: "38mm",
      ratio: "4/3",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "02c-face-42",
      label: "42mm",
      ratio: "4/3",
      teinte: "#1b1e23",
      colSpan: 1,
    },
    {
      name: "02d-face-43",
      label: "43mm",
      ratio: "4/3",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 2 — Matières et teintes (grille asymétrique)
 */
export const SECTION_CHAPITRE_2: SectionGrid = {
  colonnes: 4, // ← 4 colonnes pour asymétrie 2x2
  gap: "gap-4",
  images: [
    {
      name: "05-boucle",
      label: "Boucle déployante",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 2, // Occupe 2 colonnes (donc 2x2 de hauteur)
    },
    {
      name: "06-couture",
      label: "Couture cuir",
      ratio: "1/1",
      teinte: "#252930",
      colSpan: 1,
    },
    {
      name: "07-tissage",
      label: "Tissage",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "08-sablage",
      label: "Sablage métal",
      ratio: "1/1",
      teinte: "#252930",
      colSpan: 1,
    },
    {
      name: "09-silicone",
      label: "Silicone",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 3 — Lumière et reflets
 */
export const SECTION_CHAPITRE_3: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "10-studio",
      label: "Mise en scène studio — reflets spéculaires sur verre et biseaux",
      ratio: "16/9",
      teinte: "#0e1013",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 4 — Teintes et finitions
 */
export const SECTION_CHAPITRE_4: SectionGrid = {
  colonnes: 1,
  gap: "gap-4",
  images: [
    {
      name: "11-eclate",
      label: "Vue éclatée — tous les éléments",
      ratio: "21/9",
      teinte: "#14161a",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 5 — Couleurs (petite grille carrée)
 */
export const SECTION_CHAPITRE_5: SectionGrid = {
  colonnes: 4, // ← Change à 2 ou 3 si besoin
  gap: "gap-4",
  images: [
    {
      name: "12-cadran-vert",
      label: "Cadran vert",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
    {
      name: "13-cadran-noir",
      label: "Cadran noir",
      ratio: "1/1",
      teinte: "#14161a",
      colSpan: 1,
    },
    {
      name: "14-bracelet-noir",
      label: "Bracelet noir",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "15-bracelet-metal",
      label: "Bracelet metal",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
  ],
};

/**
 * CHAPITRE 6 — Détails macro
 */
export const SECTION_CHAPITRE_6: SectionGrid = {
  colonnes: 5, // ← Change à 3 ou 2 si besoin
  gap: "gap-4",
  images: [
    {
      name: "16-detail-cadran-1",
      label: "Cadran détail 1",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
    {
      name: "17-detail-bracelet-1",
      label: "Bracelet 1",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
    {
      name: "18-detail-boitier-1",
      label: "Boîtier 1",
      ratio: "1/1",
      teinte: "#252930",
      colSpan: 1,
    },
    {
      name: "19-detail-cadran-2",
      label: "Cadran détail 2",
      ratio: "1/1",
      teinte: "#1b1e23",
      colSpan: 1,
    },
    {
      name: "20-detail-bracelet-2",
      label: "Bracelet 2",
      ratio: "1/1",
      teinte: "#20242a",
      colSpan: 1,
    },
  ],
};
