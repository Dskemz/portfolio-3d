/**
 * Données des projets — source unique lue par TOUS les composants portfolio.
 *
 * Champs HISTORIQUES (lus par CarrouselProjets, GrilleProjets, IndexProjets) :
 *   slug · titre · client · resume · categorie · annee · couverture
 * NE PAS renommer ni retirer ces champs : les composants existants s'appuient
 * dessus (un renommage casse silencieusement le carrousel et les grilles).
 *
 * Champs ÉTENDUS (lus par la page projet /portfolio/[slug]) :
 *   role · outils · types · viewer · hasIframe · ratioViewer ·
 *   defi · solution · resultats · wireframe · final · galerie …
 *
 * `categorie` est le libellé lisible affiché tel quel (« Visite Virtuelle »).
 * `types` est la liste d'identifiants machine servant aux FILTRES de The Vault
 * (voir TYPES_PROJETS). Un projet peut relever de plusieurs typologies.
 */

export const TYPES_PROJETS = [
  { id: "temps-reel", label: "Temps Réel" },
  { id: "visite-virtuelle", label: "Visite Virtuelle" },
  { id: "modelisation", label: "Modélisation" },
  { id: "architecture", label: "Architecture" },
] as const;

export type TypeProjetId = (typeof TYPES_PROJETS)[number]["id"];

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
    slug: "nexity-visite-virtuelle",
    titre: "Visite Virtuelle Interactive",
    client: "Nexity",
    resume:
      "Plateforme de visite virtuelle 360° temps réel pour portefeuille immobilier premium.",
    categorie: "Visite Virtuelle",
    annee: 2024,
    role: "Direction technique 3D · Babylon.js · Architecture WebGL",
    outils: ["Babylon.js", "WebGL", "Three.js", "Node.js"],
    types: ["visite-virtuelle", "temps-reel"],
    viewer: "https://viewer.exemple.com/nexity",
    hasIframe: true,
    defi: "Créer une expérience immersive permettant d'explorer des propriétés haut de gamme en temps réel, avec des chargements optimisés pour des connexions variables et une compatibilité multi-appareils.",
    solution:
      "Architecture Babylon.js optimisée avec streaming progressif des actifs 3D, gestion des niveaux de détail (LOD) et shaders personnalisés pour une qualité visuelle cinématographique. Interface de contrôle épurée favorisant l'exploration intuitive.",
    resultats:
      "Temps de chargement réduit de 68 %, engagement visiteur en hausse de 45 %, demandes de visite physique en hausse de 32 %.",
    galerie: [
      { url: "/images/projets/nexity-detail-1.jpg", alt: "Détail des matières" },
      { url: "/images/projets/nexity-detail-2.jpg", alt: "Éclairage temps réel" },
      { url: "/images/projets/nexity-detail-3.jpg", alt: "Contrôles immersifs" },
    ],
  },
  {
    slug: "bouygues-modelisation-3d",
    titre: "Modélisation Architecturale",
    client: "Bouygues Immobilier",
    resume:
      "Modélisation 3D photogrammétrique d'un complexe résidentiel de 15 000 m².",
    categorie: "Modélisation",
    annee: 2023,
    role: "Modélisateur 3D lead · Post-production visuelle",
    outils: ["Cinema 4D", "Octane Render", "Substance Designer", "Photogrammétrie"],
    types: ["modelisation", "architecture"],
    wireframe: "/images/projets/bouygues-wireframe.jpg",
    wireframeLabel: "Modèle brut",
    final: "/images/projets/bouygues-final.jpg",
    finalLabel: "Rendu final",
    defi: "Produire une représentation 3D fidèle d'une architecture complexe pour un marketing pré-vente, en respectant les contraintes réglementaires et en livrant des visuels photoréalistes.",
    solution:
      "Acquisition photogrammétrique sur site, nettoyage et optimisation du maillage, texture procédurale haute définition via Substance. Rendu optimisé pour présentation client et supports de communication.",
    resultats:
      "Visuels déployés en campagne multi-canal, taux de conversion pré-vente en hausse de 28 %.",
    galerie: [
      { url: "/images/projets/bouygues-detail-1.jpg", alt: "Détail façade" },
      { url: "/images/projets/bouygues-detail-2.jpg", alt: "Palette matériaux" },
    ],
  },
  {
    slug: "laforet-visite-3d",
    titre: "Hub Visite 3D Multi-Agences",
    client: "Laforêt Immobilier",
    resume:
      "Plateforme centralisée de gestion et déploiement de visites virtuelles immobilières.",
    categorie: "Visite Virtuelle",
    annee: 2024,
    role: "Architecte système · Lead développement front",
    outils: ["Next.js", "Babylon.js", "PostgreSQL", "AWS"],
    types: ["visite-virtuelle", "temps-reel"],
    viewer: "/portfolio/visite-3d",
    hasIframe: true,
    defi: "Concevoir une infrastructure permettant à plus de 200 agences de déployer et gérer leurs visites sans compétences techniques, avec support multi-appareils et performances robustes.",
    solution:
      "Architecture Next.js avec CMS intégré, générateur de tours 3D automatisé, permissions par agence et déploiement simplifié. Viewer Babylon.js ultra-optimisé pour appareils variés.",
    resultats:
      "200+ agences actives, 50 000+ visites déployées, mise en ligne 90 % plus rapide, coûts de support réduits de 65 %.",
    galerie: [
      { url: "/images/projets/laforet-detail-1.jpg", alt: "Dashboard de gestion" },
      { url: "/images/projets/laforet-detail-2.jpg", alt: "Viewer optimisé" },
      { url: "/images/projets/laforet-detail-3.jpg", alt: "Expérience mobile" },
    ],
  },
  {
    slug: "btp-simulation-dynamique",
    titre: "Simulation Dynamique BTP",
    client: "Grand Groupe BTP",
    resume:
      "Moteur de simulation 3D pour analyse d'impact structurel et optimisation de chantier.",
    categorie: "Temps Réel",
    annee: 2023,
    role: "Développeur 3D temps réel · Moteur physique",
    outils: ["Babylon.js", "Cannon.js", "Web Workers", "Three.js"],
    types: ["temps-reel", "architecture"],
    defi: "Offrir aux ingénieurs BTP un outil interactif pour simuler et visualiser en temps réel l'impact de charges structurelles et optimiser les configurations de chantier.",
    solution:
      "Moteur physique Cannon.js avec workers web pour calculs parallèles, visualisation Babylon.js à géométries dynamiques et annotation 3D pour mesures précises.",
    resultats:
      "Temps d'analyse réduit de 40 %, précision améliorée de 92 %, adoption par 15+ équipes d'ingénierie.",
  },
  {
    slug: "ecommerce-ar-produit",
    titre: "Expérience AR pour E-commerce",
    client: "Marque de Luxe",
    resume:
      "Viewer 3D avec mode AR WebXR pour essayage virtuel de produits premium.",
    categorie: "Temps Réel",
    annee: 2024,
    role: "Direction créative · Implémentation AR WebXR",
    outils: ["Three.js", "WebXR", "React Three Fiber", "TensorFlow"],
    types: ["temps-reel", "modelisation"],
    hasIframe: true,
    defi: "Développer une expérience AR immersive permettant de visualiser des produits de luxe dans leur environnement réel avant achat, compatible avec les appareils AR mobiles grand public.",
    solution:
      "Implémentation WebXR avec Three.js et React Three Fiber, modèles 3D ultra-optimisés (système LOD), étalonnage chromatique fidèle et détection d'environnement par IA pour un placement intelligent.",
    resultats:
      "Taux d'utilisation de 67 %, confiance à l'achat en hausse de 44 %, retours en baisse de 31 %.",
    galerie: [
      { url: "/images/projets/ar-detail-1.jpg", alt: "Qualité visuelle AR" },
      { url: "/images/projets/ar-detail-2.jpg", alt: "Compatibilité mobile" },
    ],
  },
  {
    slug: "data-visualization-3d",
    titre: "Visualisation de Données 3D",
    client: "Groupe Financier",
    resume:
      "Dashboard analytique 3D temps réel pour visualisation de métriques complexes.",
    categorie: "Temps Réel",
    annee: 2023,
    role: "Développeur WebGL · Data visualization",
    outils: ["Three.js", "D3.js", "WebGL", "Node.js"],
    types: ["temps-reel"],
    hasIframe: true,
    defi: "Transformer des données financières complexes en visualisations 3D interactives permettant aux analystes de détecter rapidement tendances et anomalies.",
    solution:
      "Shaders personnalisés pour un rendu haute performance, librairie de graphiques 3D modulaire, synchronisation temps réel avec le backend et interaction aux gestes.",
    resultats:
      "Détection d'anomalies 60 % plus rapide, adoption par 40+ analystes, économies estimées à 2 M€/an.",
  },
  {
    slug: "patrimoine-numerique-archive",
    titre: "Archivage Numérique Patrimonial",
    client: "Ministère de la Culture",
    resume:
      "Plateforme de numérisation 3D et d'archivage pour le patrimoine culturel.",
    categorie: "Modélisation",
    annee: 2023,
    role: "Lead développement · Archéologie numérique",
    outils: ["Photogrammétrie", "Cinema 4D", "PostgreSQL", "WebGL"],
    types: ["modelisation", "architecture"],
    defi: "Créer une infrastructure de numérisation 3D haute-précision et d'archivage à long terme pour monuments et artefacts patrimoniaux, avec accès public et outils de recherche avancée.",
    solution:
      "Pipeline photogrammétrique optimisé, compression 3D sans perte, indexation spatiale, viewer web performant avec outils de mesure et métadonnées CIDOC-CRM complètes.",
    resultats:
      "500+ artefacts numérisés, 200 000+ utilisateurs/an, certification OAIS pour archivage pérenne.",
    galerie: [
      { url: "/images/projets/patrimoine-detail-1.jpg", alt: "Précision haute-définition" },
      { url: "/images/projets/patrimoine-detail-2.jpg", alt: "Système d'archivage" },
    ],
  },
];
