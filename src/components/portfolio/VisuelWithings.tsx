"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderVisuel } from "./PlaceholderVisuel";

interface VisuelWithingsProps {
  /** Nom du fichier sans extension (ex: "01-hero"). Il cherchera "01-hero.jpg" ou ".webp" */
  name: string;
  /** Libellé si placeholder affiché */
  label: string;
  /** Ratio d'affichage */
  ratio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9";
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
};

/**
 * Affiche une vraie image si elle existe à `/images/projets/withings/{name}.jpg`
 * Sinon, fallback sur un placeholder gris.
 *
 * Utilisation :
 * <VisuelWithings name="01-hero" label="Visuel maître" ratio="21/9" />
 *
 * Place simplement ton image à : public/images/projets/withings/01-hero.jpg
 * Prêt ! Elle s'affiche automatiquement.
 */
export function VisuelWithings({
  name,
  label,
  ratio = "16/9",
  teinte = "#1b1e23",
  className = "",
}: VisuelWithingsProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/images/projets/withings/${name}.jpg`;

  // Si l'image a échoué à charger, affiche le placeholder.
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
        priority={ratio === "21/9"} // Hero image = priority
      />
    </div>
  );
}
