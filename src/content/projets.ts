/**
 * Source unique des projets.
 *
 * `/portfolio` les déroule toutes dans son index, `/portfolio/tous` les
 * reprend en grille et `/portfolio/[slug]` génère une page par entrée. Pas
 * de sélection ni de filtre : une seule liste, un seul ordre. Passer plus tard à un CMS ou à du MDX ne demandera que de
 * remplacer ce module : rien d'autre ne connaît la forme des données.
 */

export type PoidsProjet = "majeur" | "standard" | "mineur";

export type CategorieProjet =
  | "Visite virtuelle"
  | "Modélisation 3D"
  | "Direction artistique"
  | "Retail";

export interface Projet {
  slug: string;
  /** Nom du projet. */
  titre: string;
  /** Client ou contexte, affiché en surtitre. */
  client: string;
  /** Une phrase, pas deux. */
  resume: string;
  /** Année de réalisation, affichée en mono. */
  annee: string;
  categorie: CategorieProjet;
  /** Visuel de couverture, dans /public/images/portfolio/. */
  couverture: string;
  /** Ratio du visuel — sert à réserver la place avant chargement. */
  ratio: `${number} / ${number}`;
  /**
   * Poids éditorial. Pilote la place occupée dans la grille de
   * /portfolio/tous : « majeur » prend la largeur, « mineur » se fait
   * discret. L'ordre du tableau, lui, reste l'ordre d'affichage.
   */
  poids: PoidsProjet;
  /** Chapô affiché sur la page dédiée. */
  intro?: string;
  /** Renseigné quand une visite est publiquement démontrable. */
  visiteUrl?: string;
  // Nouveaux champs pour enrichir :
  descriptionComplete?: string; // Texte long
  galerie?: string[];           // Liste de chemins d'images supplémentaires
}

export const PROJETS: readonly Projet[] = [
  {
    slug: "visite-3d-agences",
    titre: "WITHINGS - Scanwatch 2 Light & Nova",
    client: "WHITHINGS",
    resume:
      "Création de toute la gamme demontres Scanwatch2, Light et Nova. Réalisation de vidéos 360° pour le shop interactif en ligne. Production de packshots pour la grande distribution et le catalogue produits en ligne.",
    annee: "2025",
    categorie: "Retail",
    couverture: "/images/withings/couv.jpg",
    poids: "majeur",
    ratio: "4 / 5",

    // Nouveau contenu ici :
  descriptionComplete: `Elements 3D: 
  
  Modélisation des boitiers 37mm, 38mm, 42mm, et 43mm de la gamme Scanwatch 2. Déclinaison des cadrans, soleillage et sablage. Modélisation des bracelets cuirs, métal, tissu et silicone pour chaque taille de boitiers`,
  galerie: [
    "/images/withings/SW2_42_BLACK_SCREEN_FOCUS.png",
    "/images/withings/SW2_38_WHITE_SCREEN_FOCUS.png",
    "/images/withings/SW_LIGHT_RG_DUNE_SCREEN_FOCUS.png",
    "/images/withings/NOVA_43_BACK_CINE.png"
  ],
  },
  {
    slug: "appartement-haussmannien",
    titre: "Appartement haussmannien",
    client: "Paris 9e",
    resume:
      "Visite temps réel d'un 120 m² parisien, navigation libre dans le navigateur.",
    annee: "2026",
    categorie: "Visite virtuelle",
    couverture: "/images/portfolio/appartement-haussmannien.jpg",
    poids: "majeur",
    ratio: "4 / 5",
  },
  {
    slug: "editeur-visites",
    titre: "Éditeur de visites",
    client: "Outil propriétaire",
    resume:
      "Placement des points de vue, cotation et réglage d'ambiance, sans compétence technique.",
    annee: "2026",
    categorie: "Modélisation 3D",
    couverture: "/images/portfolio/editeur-visites.jpg",
    poids: "standard",
    ratio: "4 / 5",
  },
  {
    slug: "villa-contemporaine",
    titre: "Villa contemporaine",
    client: "Agence immobilière",
    resume:
      "Parcours interactif intérieur / extérieur livré en marque blanche.",
    annee: "2026",
    categorie: "Visite virtuelle",
    couverture: "/images/portfolio/villa-contemporaine.jpg",
    poids: "majeur",
    ratio: "4 / 3",
  },
  {
    slug: "mobilier-editorial",
    titre: "Mobilier — série éditoriale",
    client: "Catalogue print et web",
    resume: "Rendus produit en éclairage studio pour un catalogue de mobilier.",
    annee: "2025",
    categorie: "Modélisation 3D",
    couverture: "/images/portfolio/mobilier-editorial.jpg",
    poids: "standard",
    ratio: "4 / 4",
  },
  {
    slug: "loft-industriel",
    titre: "Loft industriel",
    client: "Promoteur",
    resume:
      "Reconstitution 3D d'un plateau brut avant travaux, support de commercialisation.",
    annee: "2025",
    categorie: "Visite virtuelle",
    couverture: "/images/portfolio/loft-industriel.jpg",
    poids: "standard",
    ratio: "4 / 3",
  },
  {
    slug: "objets-ceramique",
    titre: "Céramique — étude de matières",
    client: "Recherche personnelle",
    resume:
      "Shaders et textures procédurales sur une collection d'objets utilitaires.",
    annee: "2025",
    categorie: "Direction artistique",
    couverture: "/images/portfolio/objets-ceramique.jpg",
    poids: "mineur",
    ratio: "4 / 3",
  },
  {
    slug: "bureaux-open-space",
    titre: "Bureaux — open space",
    client: "Aménagement tertiaire",
    resume:
      "Projection 3D d'un aménagement, livrée en images fixes et en visite navigable.",
    annee: "2024",
    categorie: "Modélisation 3D",
    couverture: "/images/portfolio/bureaux-open-space.jpg",
    poids: "mineur",
    ratio: "4 / 3",
  },
] as const;

export function getProjet(slug: string): Projet | undefined {
  return PROJETS.find((projet) => projet.slug === slug);
}

export function getSlugs(): string[] {
  return PROJETS.map((projet) => projet.slug);
}
