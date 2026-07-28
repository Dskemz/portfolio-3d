/**
 * Configuration centralisée du projet Withings.
 * 
 * Modification d'un ratio ici affecte UNIQUEMENT cette image.
 * Les grilles et mise en page s'adaptent automatiquement.
 */

export interface ImageWithings {
  name: string;
  label: string;
  ratio: "21/9" | "16/9" | "4/3" | "1/1";
  teinte: string;
  className?: string;
}

export const IMAGES_WITHINGS = {
  // Header
  hero: {
    name: "01-hero",
    label: "Visuel maître — gamme ScanWatch 2",
    ratio: "21/9" as const,
    teinte: "#14161a",
  } as ImageWithings,

  // Chapitre 1
  face: {
    name: "02-face",
    label: "Gamme complète ScanWatch 2",
    ratio: "21/9" as const,
    teinte: "#14161a",
  } as ImageWithings,
  face38: {
    name: "02b-face-38",
    label: "38mm",
    ratio: "4/3" as const,
    teinte: "#20242a",
  } as ImageWithings,
  face42: {
    name: "02c-face-42",
    label: "42mm",
    ratio: "4/3" as const,
    teinte: "#1b1e23",
  } as ImageWithings,
  face43: {
    name: "02d-face-43",
    label: "43mm",
    ratio: "4/3" as const,
    teinte: "#20242a",
  } as ImageWithings,

  // Chapitre 2 — Matières
  boucle: {
    name: "05-boucle",
    label: "Boucle déployante",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
    className: "lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  } as ImageWithings,
  couture: {
    name: "06-couture",
    label: "Couture cuir",
    ratio: "1/1" as const,
    teinte: "#252930",
  } as ImageWithings,
  tissage: {
    name: "07-tissage",
    label: "Tissage",
    ratio: "1/1" as const,
    teinte: "#20242a",
  } as ImageWithings,
  sablage: {
    name: "08-sablage",
    label: "Sablage métal",
    ratio: "1/1" as const,
    teinte: "#252930",
  } as ImageWithings,
  silicone: {
    name: "09-silicone",
    label: "Silicone",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
  } as ImageWithings,

  // Chapitre 3 — Lumière
  studio: {
    name: "10-studio",
    label: "Mise en scène studio — reflets spéculaires sur verre et biseaux",
    ratio: "16/9" as const,
    teinte: "#0e1013",
  } as ImageWithings,

  // Chapitre 4 — Teintes
  eclate: {
    name: "11-eclate",
    label: "Vue éclatée — tous les éléments",
    ratio: "21/9" as const,
    teinte: "#14161a",
  } as ImageWithings,

  // Chapitre 5 — Couleurs
  cadranVert: {
    name: "12-cadran-vert",
    label: "Cadran vert",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
  } as ImageWithings,
  cadranNoir: {
    name: "13-cadran-noir",
    label: "Cadran noir",
    ratio: "1/1" as const,
    teinte: "#14161a",
  } as ImageWithings,
  braceletNoir: {
    name: "14-bracelet-noir",
    label: "Bracelet noir",
    ratio: "1/1" as const,
    teinte: "#20242a",
  } as ImageWithings,
  braceletMetal: {
    name: "15-bracelet-metal",
    label: "Bracelet metal",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
  } as ImageWithings,

  // Chapitre 6 — Détails
  detailCadran1: {
    name: "16-detail-cadran-1",
    label: "Cadran détail 1",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
  } as ImageWithings,
  detailBracelet1: {
    name: "17-detail-bracelet-1",
    label: "Bracelet 1",
    ratio: "1/1" as const,
    teinte: "#20242a",
  } as ImageWithings,
  detailBoitier1: {
    name: "18-detail-boitier-1",
    label: "Boîtier 1",
    ratio: "1/1" as const,
    teinte: "#252930",
  } as ImageWithings,
  detailCadran2: {
    name: "19-detail-cadran-2",
    label: "Cadran détail 2",
    ratio: "1/1" as const,
    teinte: "#1b1e23",
  } as ImageWithings,
  detailBracelet2: {
    name: "20-detail-bracelet-2",
    label: "Bracelet 2",
    ratio: "1/1" as const,
    teinte: "#20242a",
  } as ImageWithings,
};
