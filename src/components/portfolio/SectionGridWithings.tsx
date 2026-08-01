"use client";

import { VisuelProjet } from "./VisuelProjet";
import { Reveal } from "../ui/Reveal";
import type { SectionGrid } from "@/content/withings-layout-config";

interface SectionGridWithingsProps {
  section: SectionGrid;
  slug: string; // Slug du projet, détermine le dossier des images
}

/**
 * Composant réutilisable pour afficher une section d'images de projet.
 * La grille s'adapte automatiquement selon la config (colonnes, gaps, ratios).
 * 
 * Utilisation :
 * <SectionGridWithings section={SECTION_CHAPITRE_1} slug="withings-scanwatch" />
 */
export function SectionGridWithings({
  section,
  slug,
}: SectionGridWithingsProps) {
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
          <VisuelProjet
            slug={slug}
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
