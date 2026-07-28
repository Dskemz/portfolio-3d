"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROJETS } from "@/content/projets";

/** Trois projets, pas quatre. Le reste vit sur /portfolio/tous. */
const SELECTION = PROJETS.slice(0, 3);

/**
 * Aplats d'attente — À SUPPRIMER une fois les visuels en place.
 * Tant que `public/images/portfolio/` est vide, ces gris donnent à voir les
 * gabarits et l'enchaînement des blocs.
 */
const TEINTE = ["#1b1e23", "#2a2f36", "#14161a"] as const;

/**
 * Format panoramique imposé aux trois visuels de l'index.
 *
 * Le ratio déclaré dans les données ne s'applique plus ici : ces trois-là
 * doivent se lire comme des bandes, pas comme des cartes. Le 21/9 reste
 * utilisé par les autres pages.
 */
const FORMAT = "16 / 9";

/**
 * Index des projets — colonne de texte à gauche, visuels à droite.
 *
 * Répartition : un tiers pour l'écrit, deux tiers pour l'image. La colonne
 * de gauche est collante et occupe toute la hauteur : le nom du projet se
 * cale en haut, sa description en bas. Elle se met à jour au fil du
 * défilement, sans que rien ne bouge à l'écran — seul le texte change.
 *
 * Sous 1024 px la colonne collante n'a plus de sens : le texte redescend
 * sous chaque visuel, dans l'ordre naturel de lecture.
 */
export default function IndexProjets() {
  const [actif, setActif] = useState(0);
  const reperes = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Le projet « actif » est celui qui croise la bande médiane de l'écran.
    const observateur = new IntersectionObserver(
      (entrees) => {
        const visible = entrees
          .filter((entree) => entree.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = reperes.current.indexOf(visible.target as HTMLElement);
        if (index !== -1) setActif(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    reperes.current.forEach((noeud) => noeud && observateur.observe(noeud));
    return () => observateur.disconnect();
  }, []);

  const projetActif = SELECTION[actif];

  return (
    /* Pleine largeur assumée : aucune largeur maximale, aucune gouttière à
       droite. Les visuels touchent le bord de l'écran, ce qui est la seule
       façon pour un 21/9 de tenir sa promesse quel que soit le moniteur. */
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-3">
        {/* ---------------------------------------------------------------- */}
        {/*  Colonne de gauche — 1/3, collante, desktop uniquement           */}
        {/*  Dupliquée du contenu de droite, donc masquée aux lecteurs       */}
        {/*  d'écran : ils lisent la version en flux, sous chaque visuel.    */}
        {/* ---------------------------------------------------------------- */}
        <aside
          aria-hidden="true"
          className="hidden lg:sticky lg:top-0 lg:col-span-1 lg:flex lg:h-screen lg:flex-col lg:justify-start lg:py-40 lg:pl-16 lg:pr-14 xl:pl-24"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bleu-encre">
            {String(actif + 1).padStart(2, "0")} /{" "}
            {String(SELECTION.length).padStart(2, "0")}
          </p>

          {/* Titre et description forment un seul bloc, calé en haut : le
              cadre ne bouge plus d'un projet à l'autre, seul son contenu
              change. C'est ce qui permet de faire défiler les trois projets
              sans que la page elle-même semble avancer. */}
          <div
            key={projetActif.slug}
            className="animate-[apparition_500ms_ease-out]"
          >
            <h2 className="mt-8 font-display text-[clamp(1.8rem,2.6vw,3rem)] font-light leading-[1.05] tracking-tight text-papier">
              {projetActif.titre}
            </h2>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
              {projetActif.client} — {projetActif.annee}
            </p>

            <p className="mt-4 max-w-xs text-base font-light leading-relaxed text-papier/60">
              {projetActif.resume}
            </p>
          </div>
        </aside>

        {/* ---------------------------------------------------------------- */}
        {/*  Colonne de droite — 2/3, les visuels empilés                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-[2px] lg:col-span-2 lg:py-40">
          {SELECTION.map((projet, index) => (
            <article
              key={projet.slug}
              ref={(noeud) => {
                reperes.current[index] = noeud;
              }}
              className="group"
            >
              <Link href={`/portfolio/${projet.slug}`} className="block">
                <div
                  style={{
                    aspectRatio: FORMAT,
                    backgroundColor: TEINTE[index % TEINTE.length],
                    transform:
                      index === actif ? "translateY(-0.35rem)" : "none",
                    ...(
                      !projet.couverture && {
                        background: `linear-gradient(135deg, hsl(${
                          projet.slug.charCodeAt(0) * 3
                        }, 45%, 35%) 0%, hsl(${
                          projet.slug.charCodeAt(1) * 3
                        }, 55%, 25%) 100%)`,
                      }
                    ),
                  }}
                  className="relative w-full overflow-hidden transition-transform duration-500 ease-sobre lg:!translate-y-0"
                >
                  {projet.couverture && (
                    <Image
                      src={projet.couverture}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority={index === 0}
                      className="object-cover opacity-85 transition-[transform,opacity] duration-700 ease-sobre group-hover:scale-[1.015] group-hover:opacity-100"
                    />
                  )}
                </div>

                {/* Sous 1024 px, le texte ne s'affiche que pour la vignette
                    en cours de lecture : la miniature se soulève et découvre
                    son commentaire, les trois autres restent soudées. La
                    bascule 0fr → 1fr anime une hauteur inconnue à l'avance,
                    ce qu'un max-height figé ne sait pas faire proprement. */}
                <div
                  aria-hidden="true"
                  style={{ gridTemplateRows: index === actif ? "1fr" : "0fr" }}
                  className="grid transition-[grid-template-rows] duration-500 ease-sobre lg:hidden"
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-7 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
                        {projet.client} — {projet.annee}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-light leading-tight text-papier">
                        {projet.titre}
                      </h2>
                      <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-papier/60">
                        {projet.resume}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sémantique : le texte visible est décoratif à ce stade,
                    puisqu'il apparaît et disparaît au défilement. */}
                <span className="sr-only">
                  {projet.titre} — {projet.resume} ({projet.client},{" "}
                  {projet.annee})
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
