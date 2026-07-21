/**
 * Exports pour la section Hero du portfolio Graphite 3D.
 *
 * Utilisation:
 * import { HeroLayout, HeroContent, ModelViewer } from '@/components/hero';
 * import type { HeroLayoutProps, ViewerState } from '@/components/hero';
 */

export { default as HeroLayout } from "./HeroLayout";
export { default as HeroContent } from "./HeroContent";
export { default as ModelViewer } from "./ModelViewer";

// Types
export type {
  HeroLayoutProps,
  HeroContentProps,
  ModelViewerProps,
  ViewerState,
  Repere,
} from "@/types/hero";
