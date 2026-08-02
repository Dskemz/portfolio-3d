import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Balise de rendu. `div` par défaut ; passer `section`, `main`, etc.
   * pour garder une sémantique propre sans wrapper superflu.
   */
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
  /**
   * Largeur maximale du contenu.
   *   - "large"  : max-w-7xl (80rem / 1280px) — DÉFAUT, cadence éditoriale
   *   - "moyen"  : max-w-5xl (64rem / 1024px) — pages de lecture (contact…)
   *   - "etroit" : max-w-3xl (48rem / 768px)  — colonne de texte centrée
   *   - "plein"  : aucune limite — bandeaux pleine largeur
   * @default "large"
   */
  taille?: "large" | "moyen" | "etroit" | "plein";
  /**
   * Gouttière latérale fluide. `true` par défaut.
   * Mise à `false` pour les blocs qui gèrent eux-mêmes leur padding
   * (bandeau défilant pleine largeur, par exemple).
   * @default true
   */
  gouttiere?: boolean;
}

/**
 * Conteneur centralisé pour TOUTES les sections principales du site.
 *
 * Remplace les `mx-auto max-w-6xl px-6 lg:px-16 xl:px-24` éparpillés, qui
 * plafonnaient les marges latérales dès 1536px : entre 1280 et 3440px le
 * contenu restait figé pendant que les blocs pleine largeur s'étalaient,
 * d'où la sensation de « compression » sur écran Full HD.
 *
 * La gouttière est ici FLUIDE (`--gouttiere`, un `clamp()` défini dans
 * globals.css) : la marge latérale grandit en continu avec l'écran, sans
 * saut de breakpoint, jusqu'à ~14rem au-delà de 2560px. Le contenu, lui,
 * est plafonné à `max-w-7xl` (Option A : aéré, éditorial).
 *
 * Aucune incidence sur les animations au scroll : le conteneur ne fait que
 * centrer et marger ; les composants qui mesurent le DOM (SkillFlow,
 * Elements3DSection…) lisent la position de leurs propres éléments, pas
 * celle de cette gouttière.
 */
export default function Container({
  children,
  className,
  as: Balise = "div",
  taille = "large",
  gouttiere = true,
}: ContainerProps) {
  const largeurs = {
    large: "max-w-7xl",
    moyen: "max-w-5xl",
    etroit: "max-w-3xl",
    plein: "max-w-none",
  };

  return (
    <Balise
      className={cn(
        "mx-auto w-full",
        largeurs[taille],
        gouttiere && "gouttiere",
        className
      )}
    >
      {children}
    </Balise>
  );
}
