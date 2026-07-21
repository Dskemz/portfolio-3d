import type { ReactNode } from "react";

/**
 * Bento Grid — grille modulaire pour le futur portfolio.
 *
 * Non intégré à la navigation : ce fichier n'est encore appelé nulle part.
 * Il attend d'être branché sur `src/content/projets.ts`.
 *
 * Principe : une grille de 6 colonnes sur desktop, 2 sur tablette, 1 sur
 * mobile. Chaque tuile déclare la largeur et la hauteur qu'elle occupe ;
 * c'est l'irrégularité des tailles qui fait le rythme d'un bento, pas la
 * décoration. Une grille de tuiles toutes identiques n'est qu'un tableau.
 */

type Largeur = 1 | 2 | 3 | 6;
type Hauteur = "courte" | "normale" | "haute";

const LARGEURS: Record<Largeur, string> = {
  1: "md:col-span-1 lg:col-span-2",
  2: "md:col-span-1 lg:col-span-3",
  3: "md:col-span-2 lg:col-span-4",
  6: "md:col-span-2 lg:col-span-6",
};

const HAUTEURS: Record<Hauteur, string> = {
  courte: "min-h-[220px]",
  normale: "min-h-[320px]",
  haute: "min-h-[460px]",
};

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  /** Largeur en unités de grille. 6 = pleine largeur. */
  largeur?: Largeur;
  hauteur?: Hauteur;
  /** Rend la tuile survolable et cliquable. */
  interactif?: boolean;
  className?: string;
}

export function BentoItem({
  children,
  largeur = 2,
  hauteur = "normale",
  interactif = false,
  className = "",
}: BentoItemProps) {
  return (
    <div
      className={`relative flex flex-col justify-end overflow-hidden border border-graphite-600 bg-graphite-800 p-6 ${
        LARGEURS[largeur]
      } ${HAUTEURS[hauteur]} ${
        interactif
          ? "transition-colors duration-300 ease-sobre hover:border-graphite-400"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoTuileProps {
  titre: string;
  /** Ligne de contexte affichée au-dessus du titre. */
  etiquette?: string;
  description?: string;
  largeur?: Largeur;
  hauteur?: Hauteur;
  /** Visuel de fond. Passer un `next/image` pour l'optimisation. */
  media?: ReactNode;
}

/**
 * Tuile prête à l'emploi. Le média occupe le fond, le texte se pose dessus
 * derrière un voile qui garantit la lisibilité quelle que soit l'image.
 */
export function BentoTuile({
  titre,
  etiquette,
  description,
  largeur = 2,
  hauteur = "normale",
  media,
}: BentoTuileProps) {
  return (
    <BentoItem largeur={largeur} hauteur={hauteur} interactif>
      {media && (
        <>
          <div className="absolute inset-0 -z-10">{media}</div>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite-950/90 via-graphite-950/40 to-transparent"
          />
        </>
      )}

      {etiquette && (
        <p className="font-mono text-etiquette uppercase text-graphite-400">
          {etiquette}
        </p>
      )}
      <h3 className="mt-2 font-display text-titre-sm font-medium text-graphite-50">
        {titre}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-corps-sm text-graphite-300">
          {description}
        </p>
      )}
    </BentoItem>
  );
}
