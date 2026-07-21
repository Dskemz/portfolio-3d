"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJETS } from "@/content/projets";

/**
 * Grille déstructurée — liseré de 2 px, aucune annotation au repos.
 *
 * Deux colonnes indépendantes : les projets y sont répartis en alternance et
 * chaque colonne empile ses vignettes. Comme les hauteurs diffèrent, les deux
 * colonnes se désalignent d'elles-mêmes — c'est ce décalage qui déstructure.
 *
 * Volontairement autonome : les hauteurs viennent d'un rythme défini ici, et
 * non d'un champ des données. Une entrée incomplète ne peut donc plus faire
 * disparaître la grille. Seuls `slug`, `titre`, `client` et `couverture` sont
 * lus, tous présents depuis l'origine.
 *
 * Au survol, la vignette se rétracte vers le haut et découvre le bandeau
 * qu'elle masquait. L'image ne grossit pas, elle libère de la place.
 */

/**
 * Rythme des gabarits, en pixels, appliqué dans l'ordre puis répété.
 * Alterner haut / bas / moyen est ce qui empêche les colonnes de se
 * synchroniser. Réordonnez librement, la grille suit.
 */
const GABARIT = [560, 340, 400, 620, 360, 500, 300, 460] as const;

/**
 * Aplats d'attente — À SUPPRIMER une fois les visuels en place.
 * Assez clairs pour se détacher du fond noir et donner à voir les gabarits,
 * le liseré et le mouvement de rétraction.
 */
const TEINTE = [
  "#23272d",
  "#31363d",
  "#1c2025",
  "#3d434b",
  "#282d34",
  "#464c55",
  "#20242a",
  "#353b43",
] as const;

/** Hauteur du bandeau découvert au survol. Reprise par le retrait de l'image. */
const BANDEAU = 44;

export default function GrilleProjets() {
  const [survole, setSurvole] = useState<string | null>(null);

  // Répartition en alternance : colonne gauche les rangs pairs, droite les impairs.
  const colonnes = [
    PROJETS.filter((_, index) => index % 2 === 0),
    PROJETS.filter((_, index) => index % 2 === 1),
  ];

  return (
    /* Pleine largeur : la mosaïque file jusqu'au bord droit de l'écran. */
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-3">
        {/* ---------------------------------------------------------------- */}
        {/*  Colonne de gauche — 1/3, collante                               */}
        {/* ---------------------------------------------------------------- */}
        <aside className="px-6 lg:sticky lg:top-0 lg:col-span-1 lg:flex lg:h-screen lg:flex-col lg:justify-start lg:px-0 lg:py-40 lg:pl-16 lg:pr-14 xl:pl-24">
          <Link
            href="/portfolio"
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait transition-colors duration-300 ease-sobre hover:text-bleu-encre"
          >
            ← Index
          </Link>

          <h1 className="mt-10 font-display text-[clamp(2rem,3vw,3rem)] font-light leading-[1.05] tracking-tight text-papier">
            Tous les projets
          </h1>

          <p className="mt-5 max-w-xs text-base font-light leading-relaxed text-papier/60">
            Visites virtuelles, modélisation, direction artistique. La taille
            dit l'importance.
          </p>
        </aside>

        {/* ---------------------------------------------------------------- */}
        {/*  Mosaïque — 2/3, deux colonnes désalignées                       */}
        {/* ---------------------------------------------------------------- */}
        <div className="pb-16 pt-16 lg:col-span-2 lg:py-40">
          <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2">
            {colonnes.map((colonne, indexColonne) => (
              <div key={indexColonne} className="flex flex-col gap-[2px]">
                {colonne.map((projet, rang) => {
                  // Rang absolu dans la liste : garde le rythme cohérent
                  // d'une colonne à l'autre.
                  const position = rang * 2 + indexColonne;
                  const actif = survole === projet.slug;

                  return (
                    <article
                      key={projet.slug}
                      onMouseEnter={() => setSurvole(projet.slug)}
                      onMouseLeave={() => setSurvole(null)}
                      style={{
                        height: `${GABARIT[position % GABARIT.length]}px`,
                        backgroundColor: TEINTE[position % TEINTE.length],
                      }}
                      className="group relative w-full overflow-hidden"
                    >
                      <Link
                        href={`/portfolio/${projet.slug}`}
                        className="block h-full w-full"
                      >
                        {/* Bandeau : là en permanence, simplement recouvert. */}
                        <div
                          style={{
                            height: `${BANDEAU}px`,
                            opacity: actif ? 1 : 0,
                            transform: actif ? "none" : "translateY(0.4rem)",
                          }}
                          className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-black px-4 transition-[opacity,transform] duration-500 ease-sobre"
                        >
                          <span className="truncate font-display text-sm font-light text-papier">
                            {projet.titre}
                          </span>
                          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-trait sm:block">
                            {projet.client}
                          </span>
                        </div>

                        {/* Image : se rétracte de la hauteur du bandeau.
                            Balise native volontairement — un fichier absent
                            ne doit jamais compromettre la mise en page. */}
                        <div
                          style={{
                            bottom: actif ? `${BANDEAU}px` : 0,
                            backgroundColor: TEINTE[position % TEINTE.length],
                          }}
                          className="absolute inset-x-0 top-0 overflow-hidden transition-[bottom] duration-500 ease-sobre"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={projet.couverture}
                            alt=""
                            loading="lazy"
                            onError={(evenement) => {
                              evenement.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-cover opacity-90 transition-opacity duration-500 ease-sobre group-hover:opacity-100"
                          />
                        </div>

                        {/* Le bandeau tronque : le contexte complet vit ici. */}
                        <span className="sr-only">
                          {projet.titre} — {projet.client}
                        </span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
