/**
 * workflowData.ts
 * Flux narratif « SkillFlow » — circuit unique, 7 étapes.
 *
 * Les étapes principales et secondaires s'inscrivent À LA SUITE sur le
 * MÊME circuit : le flux descend l'axe, traverse une étape principale,
 * part à angle droit vers l'étape secondaire, revient sur l'axe, et ainsi
 * de suite jusqu'à la fiche finale où il s'arrête net.
 *
 *   1 · Modélisation 3D            principale
 *   2 · GLB                        secondaire
 *   3 · Textures et shaders        principale
 *   4 · UV's et matériaux PBR      secondaire
 *   5 · Lighting et rendu          principale
 *   6 · Visite virtuelle           secondaire
 *   7 · Démarrer votre projet      terminal
 */

export type NodeKind = "principale" | "secondaire" | "terminal";

export interface WorkflowQuote {
  text: string;
  author: string;
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

  /** Visuel du volet droit. Absent ⇒ blueprint généré. */
  media?: string;
  /** Variante du blueprint généré (0–3) */
  blueprint?: 0 | 1 | 2 | 3;
}

/** Ancre d'amorçage : le point lumineux en bas de l'accueil */
export const ORIGIN_ID = "wf-origin";

export const INTRO = {
  name: "Denis Masquet",
  role: "Artiste 3D indépendant & Visites virtuelles",
  quote:
    "Je ne subis pas le pipeline, je le construis. Du volume brut à la scène navigable dans le navigateur, chaque étape prépare la suivante.",
  hint: "Descendez pour suivre le courant",
};

export const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: "modelisation",
    kind: "principale",
    step: "01",
    title: "Modélisation 3D",
    quote: {
      text: "La structure précède la liberté ; sans un cadre solide, l'improvisation n'est que le chaos.",
      author: "Jean Cocteau",
    },
    description:
      "Que vous ayez besoin d'immersion interactive, d'image fixe ou de pièce physique, j'assure la structure 3D pour vous livrer des fichiers propres, stables et prêts à l'emploi. Vous avez l'idée, je m'assure qu'elle s'intègre partout.",
    tags: ["Échelle réelle", "Quads", "Sur-mesure"],
    href: "/portfolio/tous",
    hrefLabel: "Voir les projets",
    blueprint: 0,
  },
  {
    id: "glb",
    kind: "secondaire",
    step: "02",
    title: "GLB",
    description:
      "Export normalisé du modèle : hiérarchie propre, transformations appliquées, échelle en mètres. Décimation guidée par la silhouette et compression Draco pour que le fichier reste léger sans perdre sa lecture.",
    tags: ["glTF 2.0", "gltf-transform", "Draco"],
    blueprint: 2,
  },
  {
    id: "textures-shaders",
    kind: "principale",
    step: "03",
    title: "Textures et shaders",
    quote: {
      text: "La perfection est atteinte non quand il n'y a plus rien à ajouter, mais plus rien à retirer.",
      author: "Antoine de Saint-Exupéry",
    },
    description:
      "Construction des matières : réponse à la lumière, micro-relief, transparence. Les shaders sont écrits pour tenir aussi bien dans un rendu hors ligne que dans un moteur temps réel, sans réécriture d'un support à l'autre.",
    tags: ["PBR", "KTX2", "Atlas"],
    blueprint: 1,
  },
  {
    id: "uv-pbr",
    kind: "secondaire",
    step: "04",
    title: "UV's et matériaux PBR",
    description:
      "Dépliage sans recouvrement, densité de texels homogène, marges maîtrisées. Les cartes albédo, rugosité, métallicité et normales sont calibrées pour rester lisibles à toutes les distances de caméra.",
    tags: ["UV propres", "Texel density", "4K"],
    blueprint: 2,
  },
  {
    id: "lighting-rendu",
    kind: "principale",
    step: "05",
    title: "Lighting et rendu",
    quote: {
      text: "Ce que l'on conçoit bien s'énonce clairement, et se manipule sans mode d'emploi.",
      author: "d'après Nicolas Boileau",
    },
    description:
      "Mise en lumière de la scène, du path tracing hors ligne au budget d'images à la milliseconde dans le navigateur. Éclairage indirect, ombres dynamiques, ambiance : la même scène sert l'image fixe et le temps réel.",
    tags: ["HDRI", "Denoise", "Babylon.js"],
    blueprint: 3,
  },
  {
    id: "visite-virtuelle",
    kind: "secondaire",
    step: "06",
    title: "Visite virtuelle",
    description:
      "La scène devient navigable : points d'intérêt, trajectoires de caméra, ambiances. Livrée en lien partageable, intégrable en iframe, et pilotable par le client sans une ligne de code.",
    tags: ["Iframe", "No-code", "< 2 s"],
    href: "/visite-virtuelle",
    hrefLabel: "Essayer la visite",
    blueprint: 3,
  },
  {
    id: "contact-terminal",
    kind: "terminal",
    step: "07",
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
