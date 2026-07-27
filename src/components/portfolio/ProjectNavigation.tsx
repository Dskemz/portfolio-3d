import Link from "next/link";
import Image from "next/image";

interface ProjetLien {
  slug: string;
  titre: string;
  client: string;
  couverture: string;
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
    <nav className="grid gap-8 border-t border-mine pt-16 md:grid-cols-2">
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
      <div className="relative aspect-video overflow-hidden bg-graphite-800">
        <Image
          src={projet.couverture}
          alt={projet.titre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-sobre group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
      </div>

      <div className={`mt-5 space-y-2 ${aligneDroite ? "md:text-right" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait transition-colors duration-300 group-hover:text-orange-500">
          {aligneDroite ? "Projet suivant →" : "← Projet précédent"}
        </p>
        <h3 className="font-display text-lg font-light leading-tight tracking-tight text-papier transition-colors duration-300 group-hover:text-orange-500">
          {projet.titre}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
          {projet.client}
        </p>
      </div>
    </Link>
  );
}
