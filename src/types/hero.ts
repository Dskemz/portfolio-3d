/**
 * Types pour la section Hero du portfolio Graphite 3D.
 * Centralise les contrats TypeScript pour une maintenabilité maximale.
 */

export interface Repere {
  /** Étiquette du repère (ex: "Discipline") */
  cle: string;
  /** Valeur du repère (ex: "Graphisme 3D généraliste") */
  valeur: string;
}

export interface HeroLayoutProps {
  /** URL du modèle 3D (GLB/GLTF) */
  modelUrl: string;
  /** Texte alternatif du modèle pour l'accessibilité */
  modelAlt?: string;
  /** Classe CSS additionnelle pour le conteneur */
  className?: string;
}

export interface HeroContentProps {
  /** Repères (Discipline, Spécialité, Moteur) */
  reperes?: Repere[];
  /** Callback au clic sur "Demander une démonstration" */
  onDemoClick?: () => void;
  /** Callback au clic sur "Voir les projets" */
  onProjectsClick?: () => void;
}

export interface ModelViewerProps {
  /** URL du modèle 3D (GLB/GLTF) */
  src: string;
  /** Texte alternatif */
  alt: string;
  /** Auto-rotate le modèle au chargement */
  autoRotate?: boolean;
  /** Permet l'interaction tactile/souris */
  cameraControls?: boolean;
  /** Ratio d'aspect du conteneur (par défaut: 16/10) */
  ratio?: `${number} / ${number}`;
  /** Affiche les cotes dynamiques (Bento Grid signature) */
  showDimensions?: boolean;
  /** Callback quand le modèle finit de charger */
  onLoad?: () => void;
  /** Callback en cas d'erreur */
  onError?: (error: Error) => void;
}

/**
 * État du viewer 3D — utilisé par ModelViewer.tsx
 */
export type ViewerState = "idle" | "loading" | "ready" | "error";
