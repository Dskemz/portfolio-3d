"use client";

import { VisuelWithings } from "./VisuelWithings";
import { Reveal } from "../ui/Reveal";
import type { SectionGrid } from "@/content/withings-layout-config";

interface SectionGridWithingsProps {
  section: SectionGrid;
  title?: string;
  subtitle?: string;
}

/**
 * Composant réutilisable pour afficher une section d'images Withings.
 * La grille s'adapte automatiquement selon la config (colonnes, gaps, ratios).
 * 
 * Utilisation :
 * <SectionGridWithings section={SECTION_CHAPITRE_1} />
 */
export function SectionGridWithings({
  section,
  title,
  subtitle,
}: SectionGridWithingsProps) {
  // Génère les classes Tailwind pour la grille en fonction du nombre de colonnes
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[section.colonnes] || "grid-cols-3";

  const colSpanClass = (span: number) => {
    const classes: Record<number, string> = {
      1: "",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
    };
    return classes[span] || "";
  };

  return (
    <Reveal className={`grid ${gridColsClass} ${section.gap}`} cascade>
      {section.images.map((image) => (
        <div key={image.name} className={colSpanClass(image.colSpan || 1)}>
          <VisuelWithings
            name={image.name}
            label={image.label}
            ratio={image.ratio}
            teinte={image.teinte}
          />
        </div>
      ))}
    </Reveal>
  );
}
