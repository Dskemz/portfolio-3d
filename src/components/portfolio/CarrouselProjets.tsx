"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJETS } from "@/content/projets";

/**
 * CarrouselProjets — défilement vertical des projets.
 *
 * Le visuel de premier plan part vers le BAS et disparaît ; le suivant arrive
 * par le HAUT. Celui de derrière est décalé en haut à gauche, réduit et flouté :
 * on sait qu'il y a quelque chose sans pouvoir le lire.
 *
 * La vignette principale n'est pas une image nue mais une FENÊTRE : barre
 * d'en-tête avec le nom du projet et la catégorie en accent, puis le visuel.
 * C'est ce qui la fait lire comme un projet présenté, pas comme un fond.
 *
 * La molette n'est captée que tant qu'il reste un projet dans la pile ; au
 * premier et au dernier, elle repasse à la page pour ne pas emprisonner le
 * défilement.
 */

const DUREE = 640;

export default function CarrouselProjets() {
  const [courant, setCourant] = useState(0);
  const scene = useRef<HTMLDivElement>(null);
  const verrou = useRef(false);

  const aller = useCallback((pas: number) => {
    if (verrou.current) return;
    setCourant((index) => {
      const suivant = index + pas;
      if (suivant < 0 || suivant >= PROJETS.length) return index;
      verrou.current = true;
      window.setTimeout(() => {
        verrou.current = false;
      }, DUREE);
      return suivant;
    });
  }, []);

  useEffect(() => {
    const noeud = scene.current;
    if (!noeud) return;

    const onWheel = (evenement: WheelEvent) => {
      if (Math.abs(evenement.deltaY) < 4) return;
      const pas = evenement.deltaY > 0 ? 1 : -1;
      const suivant = courant + pas;
      if (suivant < 0 || suivant >= PROJETS.length) return;
      evenement.preventDefault();
      aller(pas);
    };

    noeud.addEventListener("wheel", onWheel, { passive: false });
    return () => noeud.removeEventListener("wheel", onWheel);
  }, [courant, aller]);

  const projet = PROJETS[courant];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------------------------------------------------------- */}
      {/*  Colonne de texte                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col lg:justify-end lg:pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500">
          /{String(courant + 1).padStart(2, "0")}
          <span className="text-trait"> — {String(PROJETS.length).padStart(2, "0")}</span>
        </p>

        <h2 className="mt-5 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-light leading-[1.1] tracking-tight text-papier">
          {projet.titre}
        </h2>

        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-papier/60">
          {projet.resume}
        </p>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-trait">
          {projet.categorie} · {projet.client} · {projet.annee}
        </p>

        <Link
          href={`/portfolio/${projet.slug}`}
          className="group mt-8 inline-flex items-center gap-4 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500 transition-colors duration-300 ease-sobre hover:text-bleu-encre-clair"
        >
          Voir le projet
          <span
            aria-hidden="true"
            className="h-px w-10 bg-orange-500 transition-[width] duration-300 ease-sobre group-hover:w-16"
          />
        </Link>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Carrousel                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <div
          ref={scene}
          className="relative h-[clamp(20rem,42vw,34rem)] select-none"
        >
          {PROJETS.map((entree, index) => {
            const ecart = index - courant;

            /*
              ecart  0 → au premier plan, net
              ecart  1 → le suivant : petit, très décalé en haut à gauche, flouté
              ecart -1 → celui qu'on vient de quitter : part vers le bas
            */
            let transformation = "translate3d(-34px,-64px,0) scale(0.84)";
            let flou = "blur(12px)";
            let opacite = 0;
            let plan = 0;

            if (ecart === 0) {
              transformation = "translate3d(0,0,0) scale(1)";
              flou = "blur(0px)";
              opacite = 1;
              plan = 3;
            } else if (ecart === 1) {
              transformation = "translate3d(-34px,-56px,0) scale(0.86)";
              flou = "blur(8px)";
              opacite = 0.45;
              plan = 2;
            } else if (ecart === -1) {
              transformation = "translate3d(0,120%,0) scale(0.96)";
              flou = "blur(10px)";
              opacite = 0;
              plan = 1;
            }

            const estCourant = ecart === 0;

            return (
              <article
                key={entree.slug}
                aria-hidden={!estCourant}
                className="absolute inset-y-0 left-10 right-0 flex flex-col border border-mine bg-graphite-950"
                style={{
                  transform: transformation,
                  filter: flou,
                  opacity: opacite,
                  zIndex: plan,
                  transition: `transform ${DUREE}ms var(--ease-sobre), filter ${DUREE}ms var(--ease-sobre), opacity ${DUREE}ms var(--ease-sobre)`,
                  willChange: "transform, opacity",
                  pointerEvents: estCourant ? "auto" : "none",
                }}
              >
                {/* Barre d'en-tête de la fenêtre projet */}
                <div className="flex items-baseline justify-between gap-6 border-b border-mine px-6 py-4">
                  <span className="truncate font-display text-lg font-light tracking-tight text-papier">
                    {entree.client}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500">
                    {entree.categorie}
                  </span>
                </div>

                {/* Visuel */}
                <Link
                  href={`/portfolio/${entree.slug}`}
                  tabIndex={estCourant ? 0 : -1}
                  className="relative block flex-1 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entree.couverture}
                    alt={entree.titre}
                    loading={index < 2 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Commandes */}
        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-graphite-500">
            Molette ou flèches
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => aller(-1)}
              disabled={courant === 0}
              aria-label="Projet précédent"
              className="flex h-10 w-10 items-center justify-center border border-mine text-papier/70 transition-colors duration-300 ease-sobre hover:border-orange-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:border-mine disabled:hover:text-papier/70"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                <path
                  d="M6.5 11V2M2.5 6l4-4 4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => aller(1)}
              disabled={courant === PROJETS.length - 1}
              aria-label="Projet suivant"
              className="flex h-10 w-10 items-center justify-center border border-mine text-papier/70 transition-colors duration-300 ease-sobre hover:border-orange-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:border-mine disabled:hover:text-papier/70"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                <path
                  d="M6.5 2v9M2.5 7l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
