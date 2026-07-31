/**
 * PROJETS — Catalogue complet avec configurations flexibles
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
  // — Champs historiques —
  slug: string;
  titre: string;
  client: string;
  resume: string;
  categorie: string;
  annee: number;
  /** URL de l'image hero. Optionnelle : fallback à un gradient si absente. */
  couverture?: string;

  // — Champs étendus (page projet) —
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
    titre: "Architecture d'Intérieur – Salle de Bain",
    client: "Décotec",
    resume:
      "Perspectives 3D photoréalistes pour la présentation de collections de mobilier de salle de bain — scénographies de gammes, étude d'éclairage et workflow technique.",
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
    titre: "NFT Floofies – Univers Digital Collectible",
    client: "NFT Floofies",
    resume:
      "Création visuelle complète d'un univers NFT : characters, environments, animations et visuels marketing pour plateforme blockchain.",
    categorie: "Design Digital",
    annee: 2024,
    couverture: "/images/projets/nft-floofies/01-hero.jpg",
    role: "Art Director 3D · Character Design · Animation",
    outils: ["Cinema 4D", "Substance 3D", "Unreal Engine", "Blender"],
    types: ["modelisation", "design"],
    defi: "Créer un univers visuel cohérent et distinctif pour des assets NFT, avec qualité cinématographique et adaptabilité multi-formats.",
    solution:
      "Modélisation stylisée des characters avec rigging et animation, création d'environments dreamlike, rendu en haute résolution pour blockchain.",
  },
  {
    slug: "summum-3d",
    titre: "Studio Summum — Sauvegarde Numérique d'Œuvres d'Art",
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
    titre: "VélyVélo – Conception de Vélo Électrique",
    client: "VélyVélo",
    resume:
      "Conception et modélisation 3D complète d'une gamme de vélos électriques, packshots et animations de présentation produit.",
    categorie: "Modélisation Produit",
    annee: 2023,
    couverture: "/images/projets/velyv-elo/01-hero.jpg",
    role: "Modélisateur 3D lead · Designer produit",
    outils: ["Cinema 4D", "Substance Designer", "Octane Render", "Photoshop"],
    types: ["modelisation"],
    defi: "Modéliser une gamme de vélos avec précision technique et rendu réaliste, générer assets pour site e-commerce et matériel marketing.",
    solution:
      "Modélisation paramétrique pour déclinaisons multiples (tailles, couleurs), matériaux techniques fidèles, packshots optimisés.",
  },
  {
    slug: "agences-georges",
    titre: "Application Showroom 3D – Fashion Luxury",
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
    titre: "Alquyme – Data Visualization 3D Interactive",
    client: "Alquyme",
    resume:
      "Plateforme de visualisation de données chimiques et moléculaires en 3D temps réel, avec interaction et animation scientifique.",
    categorie: "Data Visualization",
    annee: 2023,
    couverture: "/images/projets/alquyme/01-hero.jpg",
    role: "Développeur 3D · Data Engineer",
    outils: ["Babylon.js", "Node.js", "D3.js", "Python"],
    types: ["temps-reel"],
    defi: "Transformer des data chimiques complexes en visualisations 3D interactives et compréhensibles, performantes à grande échelle.",
    solution:
      "Moteur 3D custom avec shader graph pour molécules, synchronisation temps réel avec backend, interface de contrôle intuitive.",
  },
  {
    slug: "steamone",
    titre: "Steamone – Visite Virtuelle Immobilier Luxe",
    client: "Steamone",
    resume:
      "Plateforme de visite immersive pour portefeuille immobilier haut de gamme, avec navigation intuitive et mise en scène photographique.",
    categorie: "Visite Virtuelle",
    annee: 2022,
    couverture: "/images/projets/steamone/01-hero.jpg",
    role: "Direction technique · Architecture 3D",
    outils: ["Babylon.js", "Photogrammetry", "HDRi", "Node.js"],
    types: ["visite-virtuelle", "temps-reel"],
    defi: "Créer des visites immersives photorealistic de propriétés de luxe, avec navigation fluide et interface haut de gamme.",
    solution:
      "Photogrammetrie precision + HDRi mapping, optimisation LOD agressive pour mobile, interface minimaliste de prestige.",
  },
  {
    slug: "creation-originales",
    titre: "Création Originales – Design Produit 3D",
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
    titre: "Horlogerie Suisse – Campagne Visuelle 360°",
    client: "Horlogerie Suisse",
    resume:
      "Production visuelle complète : modélisation montres de prestige, vidéos 360°, animations mécanisme et matériaux de luxe.",
    categorie: "Modélisation Horlogerie",
    annee: 2022,
    couverture: "/images/projets/horlogerie-suisse/01-hero.jpg",
    role: "Graphiste 3D senior · Director créatif",
    outils: ["Cinema 4D", "Octane Render", "Houdini", "After Effects"],
    types: ["modelisation", "video"],
    defi: "Créer des rendus horlogers avec précision mécanique extrême et beauté cinématographique, valoriser héritage et savoir-faire.",
    solution:
      "Modélisation mécanique précise (engrenages, spiraux), matériau or/acier avec couches de brillance, animation du mécanisme en mouvement.",
  },
];
