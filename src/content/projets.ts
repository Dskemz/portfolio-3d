export const TYPES_PROJETS = [
  { id: 'temps-reel', label: 'Temps Réel' },
  { id: 'visite-virtuelle', label: 'Visite Virtuelle' },
  { id: 'modelisation', label: 'Modélisation' },
  { id: 'architecture', label: 'Architecture' },
] as const;

export interface ProjetData {
  slug: string;
  nom: string;
  client: string;
  resume: string;
  role: string;
  outils: string[];
  annee: number;
  types: string[];
  couverture: string;
  viewer?: string;
  hasIframe?: boolean;
  ratioViewer?: '16/9' | '4/3' | '1/1' | '9/16';
  defi: string;
  solution: string;
  resultats?: string;
  wireframe?: string;
  wireframeLabel?: string;
  final?: string;
  finalLabel?: string;
  galerie?: Array<{ url: string; alt?: string; caption?: string }>;
}

export const PROJETS: ProjetData[] = [
  {
    slug: 'nexity-visite-virtuelle',
    nom: 'Visite Virtuelle Interactive',
    client: 'Nexity',
    resume: 'Plateforme de visite virtuelle 360° temps réel pour portefeuille immobilier premium',
    role: 'Direction technique 3D • Babylon.js • Architecture WebGL',
    outils: ['Babylon.js', 'WebGL', 'Three.js', 'Node.js'],
    annee: 2024,
    types: ['visite-virtuelle', 'temps-reel'],
    couverture: '/images/projets/nexity-cover.jpg',
    viewer: 'https://viewer.exemple.com/nexity',
    hasIframe: true,
    defi:
      'Créer une expérience immersive permettant aux visiteurs d\'explorer des propriétés haut de gamme en temps réel, avec des chargements optimisés pour des connexions variables et une compatibilité cross-device.',
    solution:
      'Développement d\'une architecture Babylon.js optimisée avec streaming progressif des actifs 3D, gestion des LOD (Levels of Detail), et implémentation de shaders personnalisés pour une qualité visuelle cinématographique. Interface de contrôle épurée favorisant l\'exploration intuitive.',
    resultats:
      'Réduction du temps de chargement de 68%, amélioration du taux d\'engagement visiteur de 45%, et augmentation des demandes de visite physique de 32%.',
    galerie: [
      { url: '/images/projets/nexity-detail-1.jpg', alt: 'Matière du marbre', caption: 'Détail des textures' },
      { url: '/images/projets/nexity-detail-2.jpg', alt: 'Éclairage ambiant', caption: 'Éclairage temps réel' },
      { url: '/images/projets/nexity-detail-3.jpg', alt: 'Interface utilisateur', caption: 'Contrôles immersifs' },
    ],
  },
  {
    slug: 'bouygues-modelisation-3d',
    nom: 'Modélisation Architecturale',
    client: 'Bouygues Immobilier',
    resume: 'Modélisation 3D photogrammétrique d\'un complexe résidentiel de 15 000 m²',
    role: 'Modélisateur 3D lead • Post-production visuelles',
    outils: ['Cinema 4D', 'Octane Render', 'Substance Designer', 'Photogrammetry'],
    annee: 2023,
    types: ['modelisation', 'architecture'],
    couverture: '/images/projets/bouygues-cover.jpg',
    wireframe: '/images/projets/bouygues-wireframe.jpg',
    wireframeLabel: 'Modèle brut',
    final: '/images/projets/bouygues-final.jpg',
    finalLabel: 'Rendu final',
    defi:
      'Créer une représentation 3D fidèle d\'une architecture existante complexe pour un marketing pré-vente, en respectant les contraintes réglementaires et en livrant des visuels photoréalistes pour campagne commerciale.',
    solution:
      'Acquisition photogrammétrique sur site, nettoyage et optimisation du maillage, texture procédurale haute définition via Substance. Rendu temps réel optimisé pour présentation client et export pour supports de communication.',
    resultats:
      'Visuels utilisés dans campagne marketing multi-canal, augmentation du taux de conversion pré-vente de 28%.',
    galerie: [
      { url: '/images/projets/bouygues-detail-1.jpg', alt: 'Façade détail', caption: 'Détail façade' },
      { url: '/images/projets/bouygues-detail-2.jpg', alt: 'Matériaux', caption: 'Palette matériaux' },
    ],
  },
  {
    slug: 'withings-configurateur-produit',
    nom: 'Configurateur 3D Produit',
    client: 'Withings',
    resume: 'Outil de configuration et visualisation 3D temps réel pour gamme santé connectée',
    role: 'Direction artistique • Optimisation shader WebGL',
    outils: ['Three.js', 'React', 'GLSL', 'TypeScript'],
    annee: 2024,
    types: ['temps-reel', 'modelisation'],
    couverture: '/images/projets/withings-cover.jpg',
    hasIframe: true,
    defi:
      'Permettre aux utilisateurs de personnaliser et visualiser leurs produits santé en temps réel directement sur le site e-commerce, tout en maintenant une performance optimale sur appareils mobiles.',
    solution:
      'Développement d\'un viewer Three.js avec système de matériaux paramétriques, rendu PBR temps réel, et système de customisation intuitive. Optimisation agressive des shaders et des modèles 3D pour mobile.',
    resultats:
      'Diminution du taux de retour de 18%, augmentation du panier moyen de 24%, et 92% de satisfaction utilisateur.',
    galerie: [
      { url: '/images/projets/withings-detail-1.jpg', alt: 'Rendu produit', caption: 'Qualité rendu' },
      { url: '/images/projets/withings-detail-2.jpg', alt: 'Customization UI', caption: 'Interface personnalisation' },
    ],
  },
  {
    slug: 'laforet-visite-3d',
    nom: 'Hub Visite 3D Multi-Agences',
    client: 'Laforêt Immobilier',
    resume: 'Plateforme centralisée pour gestion et déploiement de visites virtuelles immobilières',
    role: 'Architecte système • Lead développement front',
    outils: ['Next.js', 'Babylon.js', 'PostgreSQL', 'AWS'],
    annee: 2024,
    types: ['visite-virtuelle', 'temps-reel'],
    couverture: '/images/projets/laforet-cover.jpg',
    viewer: '/portfolio/visite-3d',
    hasIframe: true,
    defi:
      'Concevoir une infrastructure de visite virtuelle permettant à 200+ agences immobilières de déployer et gérer leurs propres visites sans compétences techniques, avec support multi-device et performances robustes.',
    solution:
      'Architecture Next.js avec CMS intégré, générateur de tours 3D automatisé, système de permissions par agence, et deployment simplifié. Viewer Babylon.js ultra-optimisé pour appareils variés.',
    resultats:
      '200+ agences actives, 50 000+ visites déployées, temps de mise en ligne réduit de 90%, réduction des coûts de support de 65%.',
    galerie: [
      { url: '/images/projets/laforet-detail-1.jpg', alt: 'Interface admin', caption: 'Dashboard de gestion' },
      { url: '/images/projets/laforet-detail-2.jpg', alt: 'Viewer immobilier', caption: 'Viewer optimisé' },
      { url: '/images/projets/laforet-detail-3.jpg', alt: 'Mobile experience', caption: 'Expérience mobile' },
    ],
  },
  {
    slug: 'btp-simulation-dynamique',
    nom: 'Simulation Dynamique BTP',
    client: 'Grand Groupe BTP',
    resume: 'Moteur de simulation 3D pour analyse d\'impact structurel et optimisation de chantier',
    role: 'Développeur 3D temps réel • Physics engine',
    outils: ['Babylon.js', 'Cannon.js', 'WebWorkers', 'THREE.js'],
    annee: 2023,
    types: ['temps-reel', 'architecture'],
    couverture: '/images/projets/btp-cover.jpg',
    defi:
      'Créer un outil interactif permettant aux ingénieurs BTP de simuler et visualiser en temps réel l\'impact de charges structurelles et d\'optimiser les configurations de chantier.',
    solution:
      'Moteur de physique basé sur Cannon.js avec workers web pour calculs parallèles, visualisation Babylon.js avec géométries dynamiques, et système d\'annotation 3D pour mesures précises.',
    resultats:
      'Réduction du temps d\'analyse de 40%, amélioration de la précision de 92%, et adoption par 15+ équipes d\'ingénierie.',
  },
  {
    slug: 'ecommerce-ar-produit',
    nom: 'Expérience AR pour E-commerce',
    client: 'Marque de Luxe',
    resume: 'Viewer 3D avec mode AR WebXR pour essayage virtuel de produits premium',
    role: 'Direction créative • Implémentation AR WebXR',
    outils: ['Three.js', 'WebXR', 'React Three Fiber', 'TensorFlow'],
    annee: 2024,
    types: ['temps-reel', 'modelisation'],
    couverture: '/images/projets/ar-luxury-cover.jpg',
    hasIframe: true,
    defi:
      'Développer une expérience AR immersive permettant aux clients de visualiser des produits de luxe en leur environnement réel avant achat, compatible avec des appareils AR mobiles grand public.',
    solution:
      'Implémentation WebXR avec Three.js et React Three Fiber, modèles 3D ultra-optimisés (LOD système), étalonnage chromatique pour rendu fidèle, et détection d\'environnement IA pour placement intelligent.',
    resultats:
      'Taux d\'utilisation de 67%, augmentation de la confiance achat de 44%, retours réduits de 31%.',
    galerie: [
      { url: '/images/projets/ar-detail-1.jpg', alt: 'Rendu AR', caption: 'Qualité visuelle AR' },
      { url: '/images/projets/ar-detail-2.jpg', alt: 'Expérience mobile', caption: 'Compatibilité mobile' },
    ],
  },
  {
    slug: 'data-visualization-3d',
    nom: 'Visualisation de Données 3D',
    client: 'Groupe Financier',
    resume: 'Dashboard analytique 3D temps réel pour visualisation de métriques complexes',
    role: 'Développeur WebGL • Data visualization',
    outils: ['Three.js', 'D3.js', 'WebGL', 'Node.js'],
    annee: 2023,
    types: ['temps-reel'],
    couverture: '/images/projets/dataviz-cover.jpg',
    hasIframe: true,
    defi:
      'Transformer des données financières complexes en visualisations 3D interactives permettant aux analystes de détecter rapidement les tendances et anomalies.',
    solution:
      'Système de shaders personnalisés pour rendu haute performance, librairie de graphiques 3D modulaire, synchronisation temps réel avec données backend, et interaction intuitive aux gestes.',
    resultats:
      'Temps de détection d\'anomalies réduit de 60%, adoption par 40+ analystes, économie estimée en détection d\'erreur de 2M€/an.',
  },
  {
    slug: 'patrimoine-numerique-archive',
    nom: 'Archivage Numérique Patrimonial',
    client: 'Ministère de la Culture',
    resume: 'Plateforme de numérisation 3D et d\'archivage pour patrimoine culturel',
    role: 'Lead développement • Archéologie numérique',
    outils: ['Photogrammetry', 'Cinema 4D', 'PostgreSQL', 'WebGL'],
    annee: 2023,
    types: ['modelisation', 'architecture'],
    couverture: '/images/projets/patrimoine-cover.jpg',
    defi:
      'Créer une infrastructure de numérisation 3D haute-précision et d\'archivage à long terme pour monuments et artefacts patrimoniaux, avec accès public et outils de recherche avancée.',
    solution:
      'Pipeline photogrammétrique optimisé, compression 3D lossless, système d\'indexation spatiale, viewer Web performant avec outils de mesure historiques, et métadonnées CIDOC-CRM complètes.',
    resultats:
      '500+ artefacts numérisés, 200 000+ utilisateurs/an, certification OAIS pour archivage pérenne.',
    galerie: [
      { url: '/images/projets/patrimoine-detail-1.jpg', alt: 'Détail sculpture', caption: 'Precision haute-définition' },
      { url: '/images/projets/patrimoine-detail-2.jpg', alt: 'Interface archive', caption: 'Système d\'archivage' },
    ],
  },
];
