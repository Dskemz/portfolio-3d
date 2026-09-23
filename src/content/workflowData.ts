/**
 * workflowData.ts
 * Flux narratif « SkillFlow », circuit unique et linéaire, 4 étapes.
 *
 * Une seule colonne centrale, aucune fiche décalée : le flux descend l'axe
 * tout droit d'étape en étape jusqu'à la fiche finale où il s'arrête net.
 *
 *   01 · Modélisation 3D
 *   02 · Textures et shaders
 *   03 · Lighting et rendu
 *   04 · Démarrer votre projet   (terminal)
 *
 * Chaque étape porte trois états visuels (voir StepVisual.tsx) :
 *   1. croquis + points d'intérêt annotés (au scroll)
 *   2. rendu baked figé + citation + CTA
 *   3. modèle GLB interactif (survol desktop / tap mobile)
 */

export type NodeKind = "step" | "terminal";

export interface WorkflowQuote {
  text: string;
  author: string;
}

/** Point d'intérêt annoté sur le croquis, en coordonnées du viewBox (0 0 320 240). */
export interface WorkflowPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  step: string;

  title: string;
  quote?: WorkflowQuote;
  description: string;
  tags: string[];

  href?: string;
  hrefLabel?: string;

  /** Variante du croquis vectoriel généré (0–3) */
  blueprint?: 0 | 1 | 2 | 3;
  /** Points d'intérêt annotés sur le croquis (état 1) */
  points?: WorkflowPoint[];

  /** Rendu 3D figé (état 2). Absent ⇒ placeholder généré à partir du croquis. */
  bakedImage?: string;
  /** Modèle glTF/GLB (état 3, survol/tap). Absent ⇒ mesh placeholder animé. */
  glbUrl?: string;
  /** Texte de l'encart qui glisse sous le viewer GLB (état 3). */
  realtimeText?: string;
}

/** Ancre d'amorçage : le point lumineux en bas de l'accueil */
export const ORIGIN_ID = "wf-origin";

export const INTRO = {
  name: "M3D Studio",
  /**
   * Rendu DANS le <h1> (voir SkillFlow), pas dans un <p> à côté : c'est cette
   * ligne qui porte les mots-clés du document. Elle contient « 3D » et
   * « visites virtuelles », les deux termes que la page doit revendiquer.
   */
  role: "Moteur graphique N3D",
  quote:
    "Modélisations haute qualité et rendu photoréaliste pour la vente retail. " +
    "Création d'expériences interactives, de visites virtuelles immersives " +
    "développées sur Babylon.js pour des solutions performantes et captivantes. " +
    "Je vous propose un accompagnement pas à pas de votre projet pour une " +
    "personnalisation sur mesure.",
  hint: "Descendez pour suivre le courant",
};

export const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: "modelisation",
    kind: "step",
    step: "01",
    title: "Modélisation 3D",
    quote: {
      text: "La structure précède la liberté ; sans un cadre solide, l'improvisation n'est que le chaos.",
      author: "Jean Cocteau",
    },
    description:
      "Que vous ayez besoin d'immersion interactive, d'image fixe ou de pièce physique, j'assure la structure 3D pour vous livrer des fichiers propres, stables et prêts à l'emploi. Vous avez l'idée, je m'assure qu'elle s'intègre partout.",
    tags: ["Échelle réelle", "Quads", "glTF 2.0", "Sur-mesure"],
    href: "/portfolio/tous",
    hrefLabel: "Voir les projets",
    blueprint: 0,
    points: [
      { id: "maillage", x: 157, y: 60, label: "Maillage" },
      { id: "proportions", x: 110, y: 130, label: "Proportions" },
      { id: "symetrie", x: 157, y: 96, label: "Symétrie" },
      { id: "details", x: 128, y: 190, label: "Détails" },
    ],
    realtimeText: "Explorez le maillage en temps réel",
  },
  {
    id: "textures-shaders",
    kind: "step",
    step: "02",
    title: "Textures et shaders",
    quote: {
      text: "La perfection est atteinte non quand il n'y a plus rien à ajouter, mais plus rien à retirer.",
      author: "Antoine de Saint-Exupéry",
    },
    description:
      "Construction des matières : réponse à la lumière, micro-relief, transparence. Dépliage UV sans recouvrement et densité de texels homogène, pour des shaders qui tiennent aussi bien dans un rendu hors ligne que dans un moteur temps réel, sans réécriture d'un support à l'autre.",
    tags: ["PBR", "Texel density", "4K"],
    blueprint: 2,
    points: [
      { id: "albedo", x: 160, y: 74, label: "Albédo" },
      { id: "rugosite", x: 100, y: 106, label: "Rugosité" },
      { id: "normales", x: 220, y: 106, label: "Normales" },
      { id: "uv", x: 160, y: 118, label: "UV" },
    ],
    realtimeText: "Explorez les matières en temps réel",
  },
  {
    id: "lighting-rendu",
    kind: "step",
    step: "03",
    title: "Lighting et rendu",
    quote: {
      text: "Ce que l'on conçoit bien s'énonce clairement, et se manipule sans mode d'emploi.",
      author: "d'après Nicolas Boileau",
    },
    description:
      "Mise en lumière de la scène, du path tracing hors ligne au budget d'images à la milliseconde dans le navigateur. Éclairage indirect, ombres dynamiques, ambiance : la même scène sert l'image fixe et la visite virtuelle temps réel, navigable et intégrable en iframe.",
    tags: ["HDRI", "Denoise", "Babylon.js"],
    href: "/visite-virtuelle",
    hrefLabel: "Essayer la visite",
    blueprint: 3,
    points: [
      { id: "hdri", x: 98, y: 89, label: "HDRI" },
      { id: "ombres", x: 150, y: 118, label: "Ombres" },
      { id: "reflexions", x: 210, y: 112, label: "Réflexions" },
      { id: "exposition", x: 160, y: 78, label: "Exposition" },
    ],
    realtimeText: "Explorez l'éclairage en temps réel",
  },
  {
    id: "contact-terminal",
    kind: "terminal",
    step: "04",
    title: "Démarrer votre projet",
    description:
      "Le courant s'arrête ici. Décrivez votre projet : je vous dis par quelle étape il commence et ce que cela implique concrètement.",
    tags: ["Réponse sous 48 h", "Devis gratuit"],
    href: "/contact",
    hrefLabel: "Discuter de votre projet",
  },
];

export const getNodeAnchorId = (id: string) => `wf-anchor-${id}`;
export const getNodeExitId = (id: string) => `wf-exit-${id}`;
export const getNodeCardId = (id: string) => `wf-card-${id}`;
