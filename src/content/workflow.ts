/**
 * Source unique du flux narratif de la page d'accueil.
 *
 * Tout se configure ici : l'ordre des étapes, le côté d'apparition sur
 * desktop, la nature de la branche, et le média associé. `SkillFlow` ne
 * fait que lire ce tableau — ajouter une étape ne demande aucune
 * modification de composant.
 */

/** Côté d'affichage de la vignette sur desktop. Ignoré sur mobile. */
export type CoteEtape = "gauche" | "droite";

/**
 * Nature du branchement sur le fil conducteur.
 * - `principale` : jalon du parcours, ancré directement sur le fil central.
 * - `bis` : spécialisation technique, reliée au fil par une dérivation
 *   courte et un tracé plus fin.
 */
export type TypeBranche = "principale" | "bis";

/** Les deux états que la zone média peut prendre. */
export type ModeMedia = "2d" | "3d";

export interface SourceMedia {
  /**
   * Chemin de l'asset. Laissé vide pour l'instant : la vignette affiche
   * son placeholder tant que rien n'est renseigné.
   * - mode 2d : image dans `public/images/workflow/`
   * - mode 3d : modèle dans `public/models/`
   */
  src?: string;
  /** Texte alternatif — obligatoire dès qu'un `src` est renseigné. */
  alt: string;
}

export interface MediaEtape {
  /** Toujours présent : c'est l'état par défaut de la vignette. */
  statique: SourceMedia;
  /**
   * Optionnel. Sa seule présence fait apparaître le sélecteur 2D/3D sur
   * la vignette — pas besoin d'un drapeau supplémentaire.
   */
  interactif?: SourceMedia;
}

export interface EtapeWorkflow {
  /** Identifiant stable, sert de clé React et d'ancre SVG. */
  id: string;
  /** Numéro affiché en mono, ex. "01". Purement éditorial. */
  index: string;
  titre: string;
  sousTitre: string;
  /** Une à deux phrases. Au-delà, la vignette perd sa lisibilité. */
  description: string;
  cote: CoteEtape;
  type: TypeBranche;
  media: MediaEtape;
}

export const ETAPES: readonly EtapeWorkflow[] = [
  {
    id: "modelisation",
    index: "01",
    titre: "Modélisation 3D",
    sousTitre: "Haute fidélité, pensée pour le web",
    description:
      "Topologie propre et UV maîtrisés dès la construction. Ce qui est modélisé ici conditionne tout ce qui suit.",
    cote: "gauche",
    type: "principale",
    media: {
      statique: { alt: "Modélisation haute fidélité" },
      interactif: { alt: "Modèle explorable en temps réel" },
    },
  },
  {
    id: "optimisation",
    index: "01b",
    titre: "Optimisation .glb",
    sousTitre: "gltf-transform, compression KTX2",
    description:
      "Réduction du poids sans perte visible : la même scène, mais chargée en moins d'une seconde.",
    cote: "gauche",
    type: "bis",
    media: {
      statique: { alt: "Comparatif avant / après optimisation" },
    },
  },
  {
    id: "temps-reel",
    index: "02",
    titre: "Temps réel Web",
    sousTitre: "Babylon.js, WebGL",
    description:
      "Mise en scène interactive dans le navigateur. Aucune installation, aucun plugin, sur tous les appareils.",
    cote: "droite",
    type: "principale",
    media: {
      statique: { alt: "Scène temps réel" },
      interactif: { alt: "Scène navigable" },
    },
  },
  {
    id: "editeur",
    index: "02b",
    titre: "Éditeur intégré",
    sousTitre: "Outil propriétaire",
    description:
      "Placement des points de vue et réglages d'ambiance, sans compétence technique.",
    cote: "droite",
    type: "bis",
    media: {
      statique: { alt: "Interface de l'éditeur" },
    },
  },
  {
    id: "visite-virtuelle",
    index: "03",
    titre: "Visite virtuelle",
    sousTitre: "Solution clé en main",
    description:
      "Le parcours complet, livré prêt à intégrer et à exploiter en autonomie.",
    cote: "gauche",
    type: "principale",
    media: {
      statique: { alt: "Visite virtuelle immersive" },
      interactif: { alt: "Visite navigable en temps réel" },
    },
  },
  {
    id: "direction-artistique",
    index: "04",
    titre: "Direction artistique",
    sousTitre: "Matières, lumière, cadrage",
    description:
      "La couche qui distingue une image techniquement juste d'une image qui tient debout.",
    cote: "droite",
    type: "principale",
    media: {
      statique: { alt: "Recherche de matières et d'éclairage" },
    },
  },
] as const;
