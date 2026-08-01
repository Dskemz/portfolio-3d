"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type EtatViewer = "chargement" | "pret" | "erreur";

interface Viewer3DProps {
  /** URL du modèle GLB/GLTF. */
  src: string;
  /** Description du modèle pour les lecteurs d'écran. */
  alt: string;
  /** Ratio du cadre. Réservé avant chargement, donc CLS nul. */
  ratio?: `${number} / ${number}`;
  /** Affiche les cotes mesurées autour du cadre. */
  cotes?: boolean;
  className?: string;
}

/**
 * Viewer 3D isolé, il ne rend QUE le modèle.
 *
 * Volontairement dépourvu de titre, de texte et de boutons : la section qui
 * l'accueille porte déjà son propre discours, et le haut de page porte
 * l'identité. Aucun contenu n'est dupliqué entre les deux.
 */
export default function Viewer3D({
  src,
  alt,
  ratio = "16 / 9",
  cotes = true,
  className = "",
}: Viewer3DProps) {
  const cadreRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);

  const [etat, setEtat] = useState<EtatViewer>("chargement");
  const [mesure, setMesure] = useState<{ l: number; h: number } | null>(null);

  // Cycle de vie du modèle
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const surCharge = () => setEtat("pret");
    const surErreur = () => setEtat("erreur");

    viewer.addEventListener("load", surCharge);
    viewer.addEventListener("error", surErreur);

    return () => {
      viewer.removeEventListener("load", surCharge);
      viewer.removeEventListener("error", surErreur);
    };
  }, [src]);

  // Cotes mesurées en direct
  useEffect(() => {
    const cadre = cadreRef.current;
    if (!cadre || !cotes) return;

    const observateur = new ResizeObserver(([entree]) => {
      const { width, height } = entree.contentRect;
      setMesure({ l: Math.round(width), h: Math.round(height) });
    });

    observateur.observe(cadre);
    return () => observateur.disconnect();
  }, [cotes]);

  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        type="module"
        strategy="lazyOnload"
      />

      <figure className={`relative ${className}`}>
        {cotes && (
          <>
            {/* Cote horizontale */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-7 hidden h-7 md:block"
            >
              <span className="absolute inset-x-0 top-1/2 border-t border-trait/40" />
              <span className="absolute left-0 top-1/2 h-2 -translate-y-1/2 border-l border-trait/60" />
              <span className="absolute right-0 top-1/2 h-2 -translate-y-1/2 border-l border-trait/60" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-encre px-2 font-mono text-[11px] tracking-[0.18em] text-trait">
                {mesure ? `${mesure.l} px` : "—"}
              </span>
            </div>

            {/* Cote verticale */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -right-7 hidden w-7 md:block"
            >
              <span className="absolute inset-y-0 left-1/2 border-l border-trait/40" />
              <span className="absolute left-1/2 top-0 w-2 -translate-x-1/2 border-t border-trait/60" />
              <span className="absolute bottom-0 left-1/2 w-2 -translate-x-1/2 border-t border-trait/60" />
              <span className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap bg-encre px-2 font-mono text-[11px] tracking-[0.18em] text-trait">
                {mesure ? `${mesure.h} px` : "—"}
              </span>
            </div>
          </>
        )}

        <div
          ref={cadreRef}
          style={{ aspectRatio: ratio }}
          className="relative w-full overflow-hidden border border-mine bg-mine/30"
        >
          {etat === "chargement" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-trait/30 border-t-bleu-encre-clair" />
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-trait">
                Chargement du modèle
              </p>
            </div>
          )}

          {etat === "erreur" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm text-papier">
                Le modèle n'a pas pu être chargé.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-trait">
                Vérifiez votre connexion, puis rechargez la page
              </p>
            </div>
          )}

          <model-viewer
            ref={viewerRef}
            src={src}
            alt={alt}
            auto-rotate
            camera-controls
            style={{
              width: "100%",
              height: "100%",
              opacity: etat === "pret" ? 1 : 0,
              transition: "opacity 400ms ease-out",
              touchAction: "manipulation",
            }}
          />
        </div>

        <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-trait">
          <span>Cliquez et déplacez-vous dans le modèle</span>
          {cotes && mesure && (
            <span aria-hidden>{`${mesure.l}×${mesure.h}`}</span>
          )}
        </figcaption>
      </figure>
    </>
  );
}
