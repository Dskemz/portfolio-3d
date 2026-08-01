/**
 * PROJETS, Catalogue complet avec configurations flexibles
 */

export type TypeProjetId = "modelisation" | "visite-virtuelle" | "temps-reel" | "architecture" | "design" | "video";

export type ProjetTypeId = TypeProjetId;

export const TYPES_PROJETS: Record<ProjetTypeId, { label: string; icon: string }> = {
  modelisation: { label: "Modélisation 3D", icon: "🎨" },
  "visite-virtuelle": { label: "Visite Virtuelle", icon: "🏠" },
  "temps-reel": { label: "Temps réel", icon: "⚡" },
  architecture: { label: "Architecture", icon: "🏗️" },
  design: { label: "Design", icon: "✨" },
  video: { label: "Vidéo", icon: "🎬" },
};

export interface ProjetData {
  //, Champs historiques —
  slug: string;
  titre: string;
  client: string;
  resume: string;
  categorie: string;
  annee: number;
  /** URL de l'image hero. Optionnelle : fallback à un gradient si absente. */
  couverture?: string;

  //, Champs étendus (page projet) —
  role: string;
  outils: string[];
  types: TypeProjetId[];
  /** true si le projet dispose d'une page d'étude de cas éditoriale sur-mesure. */
  etudeCas?: boolean;
  viewer?: string;
  hasIframe?: boolean;
  ratioViewer?: "16/9" | "4/3" | "1/1" | "9/16";
  defi: string;
  solution: string;
  resultats?: string;
  wireframe?: string;
  wireframeLabel?: string;
  final?: string;
  finalLabel?: string;
  galerie?: Array<{ url: string; alt?: string; caption?: string }>;
}

/** Génère un gradient de fallback pseudo-aléatoire pour un projet sans image. */
export function getCouvertureOuFallback(
  projet: ProjetData,
): string | "gradient-auto" {
  if (projet.couverture) return projet.couverture;
  // Fallback : gradient dégradé basé sur le slug (reproductible, esthétique)
  return "gradient-auto";
}

export const PROJETS: ProjetData[] = [
  {
    slug: "withings-scanwatch",
    titre: "ScanWatch 2, Light et Nova",
    client: "Withings",
    resume:
      "Création de toute la gamme de montres ScanWatch 2, ScanWatch Light et ScanWatch Nova : vidéos 360° pour le shop interactif et packshots pour la grande distribution.",
    categorie: "Modélisation",
    annee: 2025,
    couverture: "/images/projets/withings/01-hero.jpg",
    role: "Graphiste 3D indépendant",
    outils: ["Visuels", "Packshots", "Vidéos 360°"],
    types: ["modelisation"],
    etudeCas: true,
    defi: "Créer une gamme complète de montres connectées en 3D, décliner chaque boîtier, cadran et bracelet, et produire visuels et packshots homogènes pour le shop interactif comme pour la grande distribution.",
    solution:
      "Modélisation des boîtiers 37 à 43 mm avec déclinaisons de cadrans, matières industrielles en valeurs de gris et textures dédiées pour cuir et tissu. Mise en scène studio soignée puis composition finale calque par calque.",
  },
  {
    slug: "decotec",
    titre: "Architecture d'Intérieur, Salle de Bain",
    client: "Décotec",
    resume:
      "Perspectives 3D photoréalistes pour la présentation de collections de mobilier de salle de bain, scénographies de gammes, étude d'éclairage et workflow technique.",
    categorie: "Architecture",
    annee: 2024,
    couverture: "/images/projets/decotec/01-hero.jpg",
    role: "Modélisation 3D · Rendu Photoréaliste · Optimisation GLTF",
    outils: ["Cinema 4D", "Corona Renderer", "Substance 3D", "Blender"],
    types: ["modelisation", "architecture"],
    defi: "Créer des perspectives 3D photoréalistes mettant en valeur les collections de mobilier de salle de bain dans des environnements variés, avec une fidélité maximale des matériaux et un pipeline optimisé pour la déclinaison temps réel.",
    solution:
      "Modélisation haute densité, étude d'éclairage en trois variantes (jour, neutre, nuit), scénographies de six ambiances matérielles distinctes et optimisation du maillage pour export GLTF/GLB léger.",
  },
  {
    slug: "nft-floofies",
    titre: "Floofies, Le shiba du futur",
    client: "NFT Floofies",
    resume:
      "Collection de NFT 3D mettant en scène un univers cartoon et pop-futuriste, shibas modulaires, accessoires spatiaux et compositions génératives structurées en quatre niveaux de rareté.",
    categorie: "Design Digital",
    annee: 2024,
    couverture: "/images/projets/nft-floofies/01-hero.jpg",
    role: "Art Director 3D · Character Design · NFT Generative",
    outils: ["Cinema 4D", "Substance 3D", "Blender", "Photoshop"],
    types: ["modelisation", "design"],
    defi: "Créer un univers visuel cohérent et distinctif pour une collection NFT modulaire, avec quatre niveaux de rareté progressive (base, compositions, rares, légendaires) et une qualité cinématographique.",
    solution:
      "Base morphologique commune déclinable en trois pelages, système modulaire à cinq couches (chapeau, œil, bouche, corps, objet dos), pièces rares cyberpunk et légendaires uniques développées comme œuvres 3D à part entière.",
  },
  {
    slug: "summum-3d",
    titre: "Studio Summum, Sauvegarde Numérique d'Œuvres d'Art",
    client: "Studio Summum",
    resume:
      "Numérisation haute fidélité d'œuvres d'art par photogrammétrie, retopologie et optimisation GLTF/GLB pour une exploitation temps réel (musées virtuels, WebGL, archives).",
    categorie: "Photogrammétrie & 3D Temps Réel",
    annee: 2023,
    couverture: "/images/projets/summum-3d/01-hero.jpg",
    role: "Photogrammétrie · Retopologie · Optimisation GLB",
    outils: ["RealityCapture", "Blender", "Substance", "glTF"],
    types: ["modelisation", "temps-reel"],
    defi: "Restituer la fidélité maximale des œuvres tout en produisant des fichiers 3D légers, compatibles WebGL et exploitables sur tous supports.",
    solution:
      "Pipeline photogrammétrie haute densité, nettoyage manuel, retopologie et baking vers low-poly, export GLTF/GLB compressé (Draco/Meshopt) avec textures KTX2.",
  },
  {
    slug: "velyv-elo",
    titre: "VélyVélo, Conception de Vélo Électrique",
    client: "VélyVélo",
    resume:
      "Conception 3D d'un vélo électrique de livraison urbaine, structure caisson-selle, personnalisation par enseigne et déclinaisons de flottes professionnelles.",
    categorie: "Design Produit & Mobilité",
    annee: 2023,
    couverture: "/images/projets/velyv-elo/01-hero.jpg",
    role: "Modélisateur 3D lead · Designer produit",
    outils: ["Cinema 4D", "Substance Designer", "Octane Render", "Photoshop"],
    types: ["modelisation", "design"],
    defi: "Concevoir un vélo électrique modulaire pour la livraison urbaine, adaptable à toutes les enseignes de mobilité rapide, avec un système de personnalisation cohérent et industriellement viable.",
    solution:
      "Structure arrière innovante caisson-selle, système de flocage par enseigne (éléments fixes noirs, jantes/pédales/porte-bagage colorés, rappel secondaire cadre) et déclinaisons de palettes pour flottes professionnelles.",
  },
  {
    slug: "agences-georges",
    titre: "Application Showroom 3D, Fashion Luxury",
    client: "Agences Georges",
    resume:
      "Application interactive 3D pour présentation de collections haute couture, essayage virtuel et personnalisation en temps réel.",
    categorie: "Application 3D",
    annee: 2023,
    couverture: "/images/projets/agences-georges/01-hero.jpg",
    role: "Lead 3D · Architecture WebGL",
    outils: ["Three.js", "Babylon.js", "React", "Tailwind"],
    types: ["temps-reel"],
    defi: "Créer une expérience d'essayage virtuel fluide et intuitive pour collections de luxe, performante sur mobile et desktop.",
    solution:
      "Pipeline optimisé pour assets mode, shaders custom pour matières (soie, cuir, verre), interface épurée et responsive.",
  },
  {
    slug: "alquyme",
    titre: "Alquyme, Flacon d'exception",
    client: "Alquyme",
    resume:
      "Création 3D et mise en scène d'un flacon de parfum ALQUYME, sablier vertical à double récipient, gravures dorées et déclinaisons chromatiques pour une collection modulaire.",
    categorie: "Design Packaging & Parfum",
    annee: 2023,
    couverture: "/images/projets/alquyme/01-hero.jpg",
    role: "Modélisateur 3D · Designer packaging",
    outils: ["Cinema 4D", "Octane Render", "Substance Designer", "Photoshop"],
    types: ["modelisation", "design"],
    defi: "Créer un flacon de parfum haut de gamme au dessin signature, avec un système modulaire de teintes et d'écrins précieux pour décliner une collection d'éditions olfactives.",
    solution:
      "Modélisation d'un flacon sablier vertical à double récipient, textures de gravures dorées, mise en scène sur drapé rouge et déclinaisons chromatiques (transparent, bleu, rose, argent, or, ambre).",
  },
  {
    slug: "steamone",
    titre: "Steamone - Défroisseur vapeur",
    client: "Steamone",
    resume:
      "Modélisation 3D et vue éclatée d'un défroisseur vapeur, révéler l'architecture interne, expliquer l'ergonomie et sublimer le design industriel.",
    categorie: "Design Produit & Éclaté 3D",
    annee: 2022,
    couverture: "/images/projets/steamone/01-hero.jpg",
    role: "Modélisateur 3D · Designer produit",
    outils: ["Cinema 4D", "Octane Render", "Substance Designer", "Photoshop"],
    types: ["modelisation", "design"],
    defi: "Créer une communication visuelle pédagogique et esthétique révélant la technologie interne d'un défroisseur vapeur nouvelle génération, sous plusieurs axes d'éclatement.",
    solution:
      "Modélisation précise des 42 pièces internes, éclatés multi-axes (vertical, horizontal, radial), gros plans sur composants électroniques et vues isométriques d'assemblage.",
  },
  {
    slug: "creation-originales",
    titre: "Création Originales, Design Produit 3D",
    client: "Création Originales",
    resume:
      "Modélisation 3D et rendu de produits design artisanaux pour catalogues, portfolio digital et campagnes e-commerce.",
    categorie: "Design Produit",
    annee: 2022,
    couverture: "/images/projets/creation-originales/01-hero.jpg",
    role: "Modélisateur 3D · Product Visualizer",
    outils: ["Cinema 4D", "Octane Render", "Substance 3D", "Lightroom"],
    types: ["modelisation", "design"],
    defi: "Valoriser des créations artisanales via 3D photo-réaliste, capturer matières et finitions avec fidélité.",
    solution:
      "Modélisation haute-poly avec textures custom, éclairage studio-like, post-production minutieuse pour rendu naturel.",
  },
  {
    slug: "horlogerie-suisse",
    titre: "Horlogerie, Mise en scène de montres",
    client: "Projet personnel",
    resume:
      "Projets personnels de modélisation 3D horlogère, Villeret Chinese Calendar, Polaris Memovox 50e anniversaire et collection évolutive de pièces d'exception.",
    categorie: "Modélisation Horlogerie",
    annee: 2022,
    couverture: "/images/projets/horlogerie-suisse/01-hero.jpg",
    role: "Modélisateur 3D · Direction artistique",
    outils: ["Cinema 4D", "Octane Render", "Substance Designer", "Photoshop"],
    types: ["modelisation"],
    defi: "Restituer avec exactitude les complications, matériaux et finitions de pièces horlogères de prestige, verre saphir, cadrans soleillés, boîtiers polis/brossés, tout en construisant une collection évolutive et harmonieuse.",
    solution:
      "Modélisation haute précision (Villeret Chinese Calendar, Polaris Memovox), rendus clay et matériaux, compositions duo, galerie évolutive prête à accueillir les futures pièces.",
  },
];
