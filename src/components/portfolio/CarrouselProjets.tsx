"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJETS } from "@/content/projets";

/**
 * CarrouselProjets — défilement vertical des projets.
 *
 * Le visuel de premier plan part vers le BAS et disparaît ; le suivant arrive
 * par le HAUT. Celui de derrière est deux fois plus petit, décalé sur la
 * gauche et flouté : on l'aperçoit, on ne le lit pas.
 *
 * Aucune écriture sur le visuel — le texte vit entièrement dans la colonne de
 * gauche, alignée sur le HAUT de l'image.
 *
 * Navigation : molette sur ordinateur, glissement vertical du doigt sur
 * tablette et téléphone (sens naturel : on tire le visuel vers le haut pour
 * remonter aux projets précédents).
 */

const DUREE = 640;

/** Amplitude minimale d'un glissement pour valider un changement de projet. */
const SEUIL_GLISSEMENT = 45;

/** Au-delà de ce déplacement, le geste est considéré comme vertical. */
const SEUIL_DECISION = 8;

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

    const possible = (pas: number) => {
      const suivant = courant + pas;
      return suivant >= 0 && suivant < PROJETS.length;
    };

    /* ---------------------------- Molette ---------------------------- */
    const onWheel = (evenement: WheelEvent) => {
      if (Math.abs(evenement.deltaY) < 4) return;
      const pas = evenement.deltaY > 0 ? 1 : -1;
      if (!possible(pas)) return;
      evenement.preventDefault();
      aller(pas);
    };

    /* ---------------------------- Tactile ----------------------------
       On ne confisque le geste QUE s'il est vertical et qu'un projet
       existe dans cette direction. Sinon on laisse la page défiler : au
       premier et au dernier projet, le doigt doit pouvoir sortir du
       carrousel. `passive: false` est indispensable, sans quoi
       preventDefault est ignoré sur mobile.                             */
    let departY = 0;
    let departX = 0;
    let ecart = 0;
    let capture: boolean | null = null;

    const onTouchStart = (evenement: TouchEvent) => {
      const doigt = evenement.touches[0];
      departY = doigt.clientY;
      departX = doigt.clientX;
      ecart = 0;
      capture = null;
    };

    const onTouchMove = (evenement: TouchEvent) => {
      const doigt = evenement.touches[0];
      ecart = doigt.clientY - departY;
      const lateral = doigt.clientX - departX;

      if (capture === null) {
        if (Math.abs(ecart) < SEUIL_DECISION && Math.abs(lateral) < SEUIL_DECISION) {
          return;
        }
        // Geste horizontal, ou vertical sans destination : on rend la main.
        // Glissement vers le HAUT (ecart < 0) = revenir au projet précédent,
        // comme le défilement naturel d'une page.
        const pas = ecart < 0 ? -1 : 1;
        capture = Math.abs(ecart) > Math.abs(lateral) && possible(pas);
      }

      if (capture) evenement.preventDefault();
    };

    const onTouchEnd = () => {
      if (capture && Math.abs(ecart) > SEUIL_GLISSEMENT) {
        aller(ecart < 0 ? -1 : 1);
      }
      capture = null;
      ecart = 0;
    };

    noeud.addEventListener("wheel", onWheel, { passive: false });
    noeud.addEventListener("touchstart", onTouchStart, { passive: true });
    noeud.addEventListener("touchmove", onTouchMove, { passive: false });
    noeud.addEventListener("touchend", onTouchEnd, { passive: true });
    noeud.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      noeud.removeEventListener("wheel", onWheel);
      noeud.removeEventListener("touchstart", onTouchStart);
      noeud.removeEventListener("touchmove", onTouchMove);
      noeud.removeEventListener("touchend", onTouchEnd);
      noeud.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [courant, aller]);

  const projet = PROJETS[courant];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------------------------------------------------------- */}
      {/*  Colonne de texte — alignée sur le HAUT du visuel                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500">
          /{String(courant + 1).padStart(2, "0")}
          <span className="text-trait">
            {" "}
            — {String(PROJETS.length).padStart(2, "0")}
          </span>
        </p>

        <h2 className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-[1.1] tracking-tight text-papier">
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
      {/*  Carrousel — le visuel seul, sans surcharge                       */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={scene}
        className="relative h-[clamp(16rem,34vw,27rem)] select-none"
        style={{ touchAction: "pan-x" }}
      >
        {PROJETS.map((entree, index) => {
          const ecartIndex = index - courant;

          /*
            0  → premier plan, net
            1  → le suivant : moitié moins grand, décalé à gauche, flouté
            -1 → celui qu'on quitte : part vers le bas
          */
          let transformation = "translate3d(-32%,-16%,0) scale(0.5)";
          let flou = "blur(9px)";
          let opacite = 0;
          let plan = 0;

          if (ecartIndex === 0) {
            transformation = "translate3d(0,0,0) scale(1)";
            flou = "blur(0px)";
            opacite = 1;
            plan = 3;
          } else if (ecartIndex === 1) {
            transformation = "translate3d(-32%,-14%,0) scale(0.5)";
            flou = "blur(7px)";
            opacite = 0.45;
            plan = 2;
          } else if (ecartIndex === -1) {
            transformation = "translate3d(0,120%,0) scale(0.96)";
            flou = "blur(10px)";
            opacite = 0;
            plan = 1;
          }

          const estCourant = ecartIndex === 0;

          return (
            <Link
              key={entree.slug}
              href={`/portfolio/${entree.slug}`}
              aria-hidden={!estCourant}
              tabIndex={estCourant ? 0 : -1}
              className="absolute inset-y-0 left-10 right-0 block overflow-hidden border border-mine bg-graphite-950"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entree.couverture}
                alt={entree.titre}
                loading={index < 2 ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
