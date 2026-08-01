'use client';

import Script from "next/script";
import dynamic from 'next/dynamic';
import type { HeroLayoutProps } from "@/types/hero";
import HeroContent from "./HeroContent";

// Importation dynamique pour éviter les erreurs de rendu côté serveur (SSR)
const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
});

/**
 * HeroLayout, Composant client pour la section hero.
 */
export default function HeroLayout({
  modelUrl,
  modelAlt = "Visite virtuelle 3D interactive, démonstration Graphite 3D",
  className = "",
}: HeroLayoutProps) {
  return (
    <>
      {/*, Charger le CDN model-viewer, */}
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        type="module"
        strategy="lazyOnload"
        onLoad={() => {
          if (process.env.NODE_ENV === "development") {
            console.log("[HeroLayout] model-viewer CDN chargé");
          }
        }}
      />

      {/*, Section hero, */}
      <section
        className={`mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24 ${className}`}
        aria-labelledby="hero-title"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start lg:items-center">
          
          <div className="md:col-span-5">
            <HeroContent />
          </div>

          <div className="md:col-span-7">
            <ModelViewer
              src={modelUrl}
              alt={modelAlt}
              autoRotate={true}
              cameraControls={true}
              ratio="16 / 10"
              showDimensions={true}
              onLoad={() => {
                if (process.env.NODE_ENV === "development") {
                  console.log("[ModelViewer] Modèle chargé avec succès");
                }
              }}
              onError={(error: any) => {
                console.error("[ModelViewer] Erreur:", error.message);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}