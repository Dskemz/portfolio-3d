"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectViewerProps {
  src: string;
  alt: string;
  ratio?: "16/9" | "4/3" | "1/1" | "9/16";
  isIframe?: boolean;
}

const RATIOS: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
};

/**
 * Espace central immersif de la page projet : viewer 3D embarqué (iframe
 * `loading="lazy"`) ou visuel grand format. Même traitement glow que le reste
 * du site — liseré orange net doublé d'un halo flouté, apparaissant une fois le
 * média chargé.
 */
export function ProjectViewer({
  src,
  alt,
  ratio = "16/9",
  isIframe = false,
}: ProjectViewerProps) {
  const [charge, setCharge] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-graphite-800 ${RATIOS[ratio] ?? RATIOS["16/9"]}`}
    >
      {isIframe ? (
        <iframe
          src={src}
          title={alt}
          loading="lazy"
          className="h-full w-full border-none bg-graphite-950"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          allowFullScreen
          onLoad={() => setCharge(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
          onLoad={() => setCharge(true)}
        />
      )}

      {/* Liseré émissif — net + halo flouté, une fois le média chargé */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border transition-opacity duration-500 ${
          charge ? "border-orange-500/25 opacity-100" : "border-transparent opacity-0"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border blur-[3px] transition-opacity duration-500 ${
          charge ? "border-orange-500/20 opacity-100" : "border-transparent opacity-0"
        }`}
      />
    </div>
  );
}
