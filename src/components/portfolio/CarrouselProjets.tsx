"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PROJETS } from "@/content/projets";

/**
 * CarrouselProjets, défilement vertical des projets.
 *
 * Le visuel de premier plan part vers le BAS et disparaît ; le suivant arrive
 * par le HAUT. Celui de derrière est deux fois plus petit, décalé sur la
 * gauche et flouté : on l'aperçoit, on ne le lit pas.
 *
 * Aucune écriture sur le visuel, le texte vit entièrement dans la colonne de
 * gauche, alignée sur le HAUT de l'image. L'image bénéficie du même traitement
 * que les fiches de la home : halo orange, gradient radial, périmètre animé SVG.
 *
 * Le carrousel BOUCLE : après le dernier projet on revient au premier, et
 * inversement. Il n'y a donc plus de « bord ».
 *
 * Navigation : molette sur ordinateur, glissement vertical du doigt sur
 * tablette et téléphone (sens naturel : on tire le visuel vers le haut pour
 * remonter aux projets précédents).
 *
 * Pour que la page reste franchissable malgré la boucle, on ne capte le geste
 * que pendant un cycle complet d'affilée : au-delà de PROJETS.length crans
 * consommés sans pause, la molette et le doigt repassent la main au
 * défilement de la page. Une pause (500 ms) réarme le cycle.
 */

const DUREE = 640;

/** Amplitude minimale d'un glissement pour valider un changement de projet. */
const SEUIL_GLISSEMENT = 45;

/** Au-delà de ce déplacement, le geste est considéré comme vertical.
    Bas volontairement : capter la verticalité tôt réduit la fenêtre pendant
    laquelle la page pourrait bouger avant que le carrousel ne prenne la main. */
const SEUIL_DECISION = 4;

/**
 * ImageCardWrapper, enveloppe l'image du carrousel avec le traitement glow
 * identique aux fiches de la home page : halo, gradient radial, périmètre SVG,
 * ombre portée. S'assure la cohérence visuelle globale du site.
 */
interface ImageCardWrapperProps {
  project: (typeof PROJETS)[0];
  isCurrent: boolean;
  tabIndex: number;
}

const METAL =
  "linear-gradient(150deg, #171717 0%, #121212 44%, #0d0d0d 74%, #151515 100%)";

function ImageCardWrapper({
  project,
  isCurrent,
  tabIndex,
}: ImageCardWrapperProps) {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  /**
   * Compteur incrémenté à chaque fois que le projet DEVIENT courant. Sert de
   * `key` au tracé du périmètre : changer la key remonte le path, donc le
   * redessine depuis 0 → 1. C'est ce qui donne l'animation « le flux se
   * redessine à chaque changement de projet », en rappel des fiches home.
   */
  const [redraw, setRedraw] = useState(0);
  const prevCurrent = useRef(isCurrent);
  /**
   * Premier montage de la page : le périmètre attend que la carte ait fini de
   * glisser depuis la droite avant de se tracer (enchaînement carte → contour,
   * comme les fiches home). Les redessins suivants (changement de projet) sont
   * immédiats.
   */
  const [premierMontage, setPremierMontage] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setPremierMontage(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    // Passage false → true : on relance l'animation du périmètre.
    if (isCurrent && !prevCurrent.current) {
      setRedraw((n) => n + 1);
    }
    prevCurrent.current = isCurrent;
  }, [isCurrent]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const perimeter =
    box.w > 0 && box.h > 0 ? `M ${box.w / 2} 0 H ${box.w} V ${box.h} H 0 V 0 Z` : "";

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="relative block h-full w-full border border-white/[0.07] overflow-hidden"
      style={{ background: METAL }}
      aria-hidden={!isCurrent}
      tabIndex={tabIndex}
    >
      {/* Mesure du cadre pour le périmètre */}
      <div ref={frameRef} className="absolute inset-0 z-0" aria-hidden />

      {/* Gradient radial de glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,127,80,0.14), rgba(255,127,80,0) 62%)",
        }}
      />

      {/* Image ou fallback gradient */}
      {project.couverture ? (
        <motion.img
          src={project.couverture}
          alt={project.titre}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
          initial={false}
          animate={{
            opacity: isCurrent ? 1 : 0.6,
          }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, hsl(${
              project.slug.charCodeAt(0) * 3
            }, 45%, 35%) 0%, hsl(${project.slug.charCodeAt(1) * 3}, 55%, 25%) 100%)`,
          }}
        />
      )}

      {/* Ombre portée dynamique */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        initial={false}
        animate={{
          boxShadow: isCurrent
            ? "0 0 48px rgba(255,127,80,0.26), 0 24px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 0 24px rgba(255,127,80,0.12), 0 20px 42px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Périmètre SVG animé, se redessine à chaque passage courant */}
      {perimeter && isCurrent && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={`edge-${project.slug}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="g" />
              <feMerge>
                <feMergeNode in="g" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            key={redraw}
            d={perimeter}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.4, 0, 0.2, 1],
              delay: premierMontage && !reduceMotion ? 0.95 : 0,
            }}
            style={{
              filter: `url(#edge-${project.slug}) drop-shadow(0 0 4px rgba(255,127,80,0.55))`,
            }}
          />
        </svg>
      )}
    </Link>
  );
}

export default function CarrouselProjets() {
  const [courant, setCourant] = useState(0);
  const scene = useRef<HTMLDivElement>(null);
  const verrou = useRef(false);
  const reduceMotion = useReducedMotion();

  const aller = useCallback((pas: number) => {
    if (verrou.current) return;
    verrou.current = true;
    window.setTimeout(() => {
      verrou.current = false;
    }, DUREE);
    setCourant(
      (index) => (index + pas + PROJETS.length) % PROJETS.length,
    );
  }, []);

  useEffect(() => {
    const noeud = scene.current;
    if (!noeud) return;

    /* ---------------------------- Molette / trackpad ----------------------------
       Tant que le pointeur est sur le carrousel, la page ne défile JAMAIS : c'est
       le comportement voulu (seul le carrousel s'anime). Pour continuer à défiler
       la page, l'utilisateur sort le pointeur du visuel (colonne de texte, marges).

       preventDefault() est appelé EN PREMIER, avant tout seuil. C'est le point
       clé du correctif trackpad : les pavés tactiles émettent une rafale de
       micro-deltas (1, 2, 3 px) en début et fin de geste. Si on les filtrait
       avant preventDefault (comme avant), ces micro-deltas passaient au travers
       et faisaient défiler la page « en même temps ». Une molette classique,
       elle, envoie un seul grand delta discret et ne déclenchait pas le bug. */
    const onWheel = (evenement: WheelEvent) => {
      evenement.preventDefault();
      // Bruit sous le seuil : on ne navigue pas. `aller` possède déjà un verrou
      // temporel (un seul cran par DUREE) qui absorbe l'inertie macOS.
      if (Math.abs(evenement.deltaY) < 2) return;
      aller(evenement.deltaY > 0 ? 1 : -1);
    };

    /* ---------------------------- Tactile ----------------------------
       Le conteneur porte `touch-action: pan-x` : le navigateur ne prend donc
       jamais en charge le défilement vertical au-dessus du carrousel, ce qui
       rend notre preventDefault fiable. On détecte la direction dès les
       premiers pixels ; un geste vertical pilote le carrousel, un geste
       horizontal est ignoré. */
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
        if (
          Math.abs(ecart) < SEUIL_DECISION &&
          Math.abs(lateral) < SEUIL_DECISION
        ) {
          return;
        }
        // Geste majoritairement vertical → le carrousel prend la main.
        capture = Math.abs(ecart) > Math.abs(lateral);
      }

      if (capture && evenement.cancelable) evenement.preventDefault();
    };

    const onTouchEnd = () => {
      if (capture && Math.abs(ecart) > SEUIL_GLISSEMENT) {
        // Doigt vers le HAUT (ecart < 0) → projet précédent (sens naturel).
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
  }, [aller]);

  const projet = PROJETS[courant];

  // Animation d'entrée : le bloc entre au chargement de la page, la colonne
  // carrousel glissant depuis la droite comme si elle « rentrait » dans la
  // page. Rappel de l'apparition des fiches en home (slide + léger scale de
  // profondeur). Respecte reduced-motion.
  const entreeTexte = reduceMotion
    ? { initial: false as const, animate: {} }
    : {
        initial: { opacity: 0, x: -32 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 },
      };

  const entreeCarrousel = reduceMotion
    ? { initial: false as const, animate: {} }
    : {
        initial: { opacity: 0, x: 180, scale: 0.92 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: 0.95,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: 0.1,
        },
      };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------------------------------------------------------- */}
      {/*  Colonne de texte, titre en HAUT, détails alignés sur le BAS     */}
      {/*  du carrousel (la colonne s'étire à la hauteur de la scène).      */}
      {/* ---------------------------------------------------------------- */}
      <motion.div className="flex flex-col" {...entreeTexte}>
        <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] font-light leading-tight tracking-tight text-papier">
          {projet.titre}
        </h2>

        {/* mt-auto : ce bloc descend au bas de la colonne, donc au bas du visuel */}
        <div className="mt-auto pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-orange-500">
            /{String(courant + 1).padStart(2, "0")}
            <span className="text-trait">
              {" "}
             , {String(PROJETS.length).padStart(2, "0")}
            </span>
          </p>

          <p className="mt-5 max-w-md font-body text-sm font-light leading-relaxed text-papier/60">
            {projet.resume}
          </p>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-trait">
            {projet.categorie} · {projet.client} · {projet.annee}
          </p>

          <Link
            href={`/portfolio/${projet.slug}`}
            className="group mt-8 inline-flex items-center gap-4 self-start font-mono text-[10px] uppercase tracking-[0.24em] text-orange-500 transition-colors duration-300 ease-sobre hover:text-[#E67E22]"
          >
            Voir le projet
            <span
              aria-hidden="true"
              className="h-px w-10 bg-orange-500 transition-[width] duration-300 ease-sobre group-hover:w-16"
            />
          </Link>
        </div>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/*  Carrousel, le visuel avec traitement glow + lien grille dessous */}
      {/* ---------------------------------------------------------------- */}
      <motion.div className="flex flex-col" {...entreeCarrousel}>
        <div
          ref={scene}
          className="relative h-[clamp(14rem,28vw,22rem)] select-none"
          style={{ touchAction: "pan-x" }}
        >
          {PROJETS.map((entree, index) => {
            /*
              Écart circulaire : au dernier projet, le premier est « juste après »
              (il arrive par le haut), pas à l'autre bout. C'est ce qui fait
              boucler l'animation sans téléportation visible.
            */
            let ecartIndex = index - courant;
            const moitie = PROJETS.length / 2;
            if (ecartIndex > moitie) ecartIndex -= PROJETS.length;
            else if (ecartIndex < -moitie) ecartIndex += PROJETS.length;

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
              <motion.div
                key={entree.slug}
                className="absolute inset-y-0 left-10 right-0 overflow-hidden"
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
                {/* Conteneur avec traitement glow comme WorkflowCard */}
                <ImageCardWrapper
                  project={entree}
                  isCurrent={estCourant}
                  tabIndex={estCourant ? 0 : -1}
                />
              </motion.div>
            );
          })}
        </div>

        {/*
          Lien « Voir la grille complète » sous le carrousel, aligné à droite
          de l'image principale (l'image part à left-10, donc on aligne le
          bloc de lien sur la même colonne via pl-10).
        */}
        <div className="mt-6 flex justify-end pl-10">
          <Link
            href="/portfolio/tous"
            className="group inline-flex items-center gap-3 border border-white/[0.14] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-trait transition-all duration-300 ease-sobre hover:border-[#FF7F50]/60 hover:text-papier hover:shadow-[0_0_20px_rgba(255,127,80,0.18)]"
          >
            Voir la grille complète
            <span
              aria-hidden="true"
              className="text-[#FF7F50] transition-transform duration-300 ease-sobre group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
