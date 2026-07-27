"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
}

/**
 * Galerie de détails en grille (matières, angles secondaires). Survol : liseré
 * orange émissif, identique à The Vault. Clic : lightbox plein écran avec
 * navigation clavier (← → Échap) et au clic.
 */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [actif, setActif] = useState<number | null>(null);

  const fermer = useCallback(() => setActif(null), []);
  const precedent = useCallback(
    () => setActif((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const suivant = useCallback(
    () => setActif((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (actif === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      if (e.key === "ArrowLeft") precedent();
      if (e.key === "ArrowRight") suivant();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actif, fermer, precedent, suivant]);

  return (
    <section className="border-t border-mine pt-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
        Détails &amp; matières
      </p>

      <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" cascade>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActif(i)}
            className="group relative aspect-square overflow-hidden bg-graphite-800"
            aria-label={img.alt ?? `Détail ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={img.alt ?? `Détail ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-sobre group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-orange-500/0 transition-colors duration-300 group-hover:border-orange-500/50"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-orange-500/0 blur-[3px] transition-colors duration-300 group-hover:border-orange-500/30"
            />
          </button>
        ))}
      </Reveal>

      {/* Lightbox */}
      {actif !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={fermer}
        >
          <button
            onClick={fermer}
            aria-label="Fermer"
            className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.24em] text-papier/60 transition-colors hover:text-papier"
          >
            Fermer ✕
          </button>

          <div
            className="relative h-full max-h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[actif].url}
              alt={images[actif].alt ?? `Détail ${actif + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={precedent}
              aria-label="Précédent"
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-papier/60 transition-colors hover:text-orange-500"
            >
              ← Préc.
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
              {String(actif + 1).padStart(2, "0")} — {String(images.length).padStart(2, "0")}
            </span>
            <button
              onClick={suivant}
              aria-label="Suivant"
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-papier/60 transition-colors hover:text-orange-500"
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
