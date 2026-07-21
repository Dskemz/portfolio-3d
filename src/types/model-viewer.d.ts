import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * model-viewer est un custom element : TypeScript ne le connaît pas.
 * Cette déclaration évite d'avoir à caster à chaque usage.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          "touch-action"?: string;
          exposure?: string | number;
          "shadow-intensity"?: string | number;
        },
        HTMLElement
      >;
    }
  }
}

export {};
