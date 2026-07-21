"use client";

import { useEffect, useRef, useState } from "react";
import type { ModelViewerProps, ViewerState } from "@/types/hero";

/**
 * ModelViewer — Composant client pour le viewer 3D avec model-viewer de Google.
 *
 * Responsabilités:
 * - Charger le CDN model-viewer (via next/script dans le layout parent)
 * - Gérer l'état de chargement (idle → loading → ready | error)
 * - Mesurer les dimensions du conteneur en temps réel (Bento Grid signature)
 * - Offrir des callbacks pour les états de chargement/erreur
 */
export default function ModelViewer({
  src,
  alt,
  autoRotate = true,
  cameraControls = true,
  ratio = "16 / 10",
  showDimensions = true,
  onLoad,
  onError,
}: ModelViewerProps) {
  const cadreRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  const [state, setState] = useState<ViewerState>("idle");
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(
    null
  );

  // Gestion du cycle de vie du modèle
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    // Passer à "loading" au montage
    setState("loading");

    // Listener pour quand le modèle est prêt
    const handleLoad = () => {
      setState("ready");
      onLoad?.();
    };

    // Listener pour les erreurs
    const handleError = () => {
      const error = new Error(
        `Impossible de charger le modèle 3D depuis ${src}`
      );
      setState("error");
      onError?.(error);
    };

    // model-viewer expose des événements custom
    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
    };
  }, [src, onLoad, onError]);

  // ResizeObserver pour mesurer les dimensions en direct
  useEffect(() => {
    const cadre = cadreRef.current;
    if (!cadre || !showDimensions) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({
        w: Math.round(width),
        h: Math.round(height),
      });
    });

    observer.observe(cadre);
    return () => observer.disconnect();
  }, [showDimensions]);

  return (
    <figure
      ref={cadreRef}
      className="relative"
      aria-label="Visite virtuelle 3D interactive"
    >
      {/* — Cote horizontale — */}
      {showDimensions && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-7 hidden h-7 md:block"
        >
          {/* Ligne horizontale */}
          <span className="absolute inset-x-0 top-1/2 border-t border-trait/40" />
          {/* Attache gauche */}
          <span className="absolute left-0 top-1/2 h-2 -translate-y-1/2 border-l border-trait/60" />
          {/* Attache droite */}
          <span className="absolute right-0 top-1/2 h-2 -translate-y-1/2 border-l border-trait/60" />
          {/* Valeur */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-encre px-2 font-mono text-xs tracking-wider text-trait">
            {dimensions ? `${dimensions.w} px` : "—"}
          </span>
        </div>
      )}

      {/* — Cote verticale — */}
      {showDimensions && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -right-7 hidden w-7 md:block"
        >
          {/* Ligne verticale */}
          <span className="absolute inset-y-0 left-1/2 border-l border-trait/40" />
          {/* Attache top */}
          <span className="absolute left-1/2 top-0 w-2 -translate-x-1/2 border-t border-trait/60" />
          {/* Attache bottom */}
          <span className="absolute bottom-0 left-1/2 w-2 -translate-x-1/2 border-t border-trait/60" />
          {/* Valeur */}
          <span className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 rotate-90 bg-encre px-2 font-mono text-xs tracking-wider text-trait">
            {dimensions ? `${dimensions.h} px` : "—"}
          </span>
        </div>
      )}

      {/* — Conteneur viewer — */}
      <div
        style={{ aspectRatio: ratio }}
        className="relative w-full overflow-hidden border border-mine bg-mine/40"
      >
        {/* État de chargement */}
        {state === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-encre/80 backdrop-blur-sm">
            <div className="space-y-3 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-trait/40 border-t-bleu-encre" />
              <p className="text-sm text-trait">Chargement du modèle 3D…</p>
            </div>
          </div>
        )}

        {/* État d'erreur */}
        {state === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-encre/80">
            <div className="space-y-2 text-center px-4">
              <p className="text-sm font-medium text-red-500">
                Erreur de chargement
              </p>
              <p className="text-xs text-trait">
                Le modèle 3D n'a pas pu être chargé.
              </p>
            </div>
          </div>
        )}

        {/* model-viewer — ne s'affiche que si le CDN est chargé */}
        {typeof window !== "undefined" &&
          (window as any)["ModelViewerElement"] && (
            <model-viewer
              ref={modelViewerRef}
              src={src}
              alt={alt}
              auto-rotate={autoRotate}
              camera-controls={cameraControls}
              touch-action="pan-y"
              style={{
                width: "100%",
                height: "100%",
                opacity: state === "ready" ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          )}

        {/* Fallback si model-viewer n'est pas chargé */}
        {typeof window !== "undefined" &&
          !(window as any)["ModelViewerElement"] && (
            <div className="absolute inset-0 flex items-center justify-center bg-mine/20">
              <p className="text-sm text-trait">
                Chargement de la bibliothèque 3D…
              </p>
            </div>
          )}
      </div>

      {/* Caption */}
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-xs tracking-wider text-trait">
        <span>Visite interactive — cliquez et déplacez-vous</span>
        {showDimensions && dimensions && (
          <span aria-hidden>{dimensions.w}×{dimensions.h}</span>
        )}
      </figcaption>
    </figure>
  );
}
