import Link from "next/link";
import Image from "next/image";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture?: string;
}

interface ProjectNavigationProps {
  previous: ProjetLien;
  next: ProjetLien;
}

/**
 * Navigation de bas de page — projet précédent / suivant. Deux vignettes avec
 * survol : léger zoom du visuel, titre qui vire à l'orange.
 */
export function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
  return (
    <nav className="grid grid-cols-2 gap-4 border-t border-mine pt-12 sm:gap-8 md:pt-16">
      <Carte projet={previous} sens="précédent" />
      <Carte projet={next} sens="suivant" />
    </nav>
  );
}

function Carte({
  projet,
  sens,
}: {
  projet: ProjetLien;
  sens: "précédent" | "suivant";
}) {
  const aligneDroite = sens === "suivant";

  return (
    <Link href={`/portfolio/${projet.slug}`} className="group block">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-graphite-800 sm:aspect-video"
        style={
          !projet.couverture
            ? {
                background: `linear-gradient(135deg, hsl(${
                  projet.slug.charCodeAt(0) * 3
                }, 45%, 35%) 0%, hsl(${
                  projet.slug.charCodeAt(1) * 3
                }, 55%, 25%) 100%)`,
              }
            : undefined
        }
      >
        {projet.couverture && (
          <Image
            src={projet.couverture}
            alt={projet.titre}
            fill
            sizes="(max-width: 768px) 50vw, 50vw"
            className="object-cover transition-transform duration-500 ease-sobre group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
      </div>

      <div className={`mt-3 space-y-1.5 sm:mt-5 sm:space-y-2 ${aligneDroite ? "text-right" : ""}`}>
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-trait transition-colors duration-300 group-hover:text-orange-500 sm:text-[10px] sm:tracking-[0.28em]">
          {aligneDroite ? (
            <>
              <span className="sm:hidden">Suivant →</span>
              <span className="hidden sm:inline">Projet suivant →</span>
            </>
          ) : (
            <>
              <span className="sm:hidden">← Précédent</span>
              <span className="hidden sm:inline">← Projet précédent</span>
            </>
          )}
        </p>
        <h3 className="font-display text-sm font-light leading-tight tracking-tight text-papier transition-colors duration-300 group-hover:text-orange-500 sm:text-lg">
          {projet.titre}
        </h3>
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-trait sm:text-[10px]">
          {projet.client}
        </p>
      </div>
    </Link>
  );
}
