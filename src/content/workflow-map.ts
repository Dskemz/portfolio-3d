export type CardPosition = "left" | "right";

export interface WorkflowNode {
  id: string;
  title: string;
  subtitle: string;
  isMain: boolean;
  position: CardPosition;
  techIndicator: string;
  media: {
    blueprint?: string;
    rendered?: string;
  };
  linkedTo?: number;
}

export const WORKFLOW_NODES: readonly WorkflowNode[] = [
  {
    id: "modelisation",
    title: "Modélisation 3D",
    subtitle: "Haute fidélité pensée pour le web",
    isMain: true,
    position: "left",
    techIndicator: "Blender • Topologie propre",
    media: {
      blueprint: "/images/workflow/modelisation-2d.jpg",
    },
    linkedTo: -1,
  },
  {
    id: "optimisation",
    title: "Optimisation .glb",
    subtitle: "gltf-transform, compression KTX2",
    isMain: false,
    position: "right",
    techIndicator: "142 KB • Gain 85%",
    media: {
      blueprint: "/images/workflow/optimisation-2d.jpg",
    },
    linkedTo: 0,
  },
  {
    id: "babylon",
    title: "Temps réel Web",
    subtitle: "Babylon.js, WebGL natif",
    isMain: true,
    position: "right",
    techIndicator: "120 FPS • Responsive",
    media: {
      blueprint: "/images/workflow/babylon-2d.jpg",
    },
    linkedTo: 0,
  },
  {
    id: "editeur",
    title: "Éditeur intégré",
    subtitle: "Outil propriétaire Graphite",
    isMain: false,
    position: "left",
    techIndicator: "No-Code • Real-time",
    media: {
      blueprint: "/images/workflow/editeur-2d.jpg",
    },
    linkedTo: 1,
  },
  {
    id: "visite-virtuelle",
    title: "Visite virtuelle",
    subtitle: "Solution clé en main immédiate",
    isMain: true,
    position: "left",
    techIndicator: "POI • Caméra piloté",
    media: {
      blueprint: "/images/workflow/visite-2d.jpg",
    },
    linkedTo: 2,
  },
  {
    id: "direction",
    title: "Direction artistique",
    subtitle: "Matières, lumière, cadrage",
    isMain: true,
    position: "right",
    techIndicator: "Éclairage HDR • PBR",
    media: {
      blueprint: "/images/workflow/direction-2d.jpg",
    },
    linkedTo: 4,
  },
] as const;

export const MAIN_NODES_INDEX = WORKFLOW_NODES.reduce(
  (acc, node, idx) => {
    if (node.isMain) acc.push(idx);
    return acc;
  },
  [] as number[]
);
