"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderVisuel } from "./PlaceholderVisuel";

interface VisuelProjetProps {
  /** Slug du projet (ex: "withings-scanwatch"). Détermine le dossier des images. */
  slug: string;
  /** Nom du fichier sans extension (ex: "01-hero"). Cherche "{slug}/01-hero.jpg" */
  name: string;
  /** Libellé si placeholder affiché */
  label: string;
  /** Ratio d'affichage */
  ratio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9" | "9/16";
  /** Teinte placeholder de secours */
  teinte?: string;
  /** Classes additionnelles */
  className?: string;
}

const RATIOS: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

/**
 * Affiche une image du dossier du projet : /images/projets/{slug}/{name}.jpg
 * Sinon, fallback sur un placeholder.
 *
 * Utilisation :
 * <VisuelProjet slug="decotec" name="01-hero" label="Visuel" ratio="21/9" />
 * → cherche /images/projets/decotec/01-hero.jpg
 */
export function VisuelProjet({
  slug,
  name,
  label,
  ratio = "16/9",
  teinte = "#1b1e23",
  className = "",
}: VisuelProjetProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/images/projets/${slug}/${name}.jpg`;

  if (imageError) {
    return (
      <PlaceholderVisuel
        label={label}
        ratio={ratio}
        teinte={teinte}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative ${RATIOS[ratio] ?? RATIOS["16/9"]} overflow-hidden rounded-sm bg-graphite-900 ${className}`}
    >
      <Image
        src={imagePath}
        alt={label}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
        className="object-cover"
        onError={() => setImageError(true)}
        priority={ratio === "21/9"}
      />
    </div>
  );
}
