"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJETS } from "@/content/projets";

/**
 * CarrouselProjets — défilement vertical des projets.
 *
 * Le visuel de premier plan part vers le BAS et disparaît ; le suivant arrive
 * par le HAUT. Celui de derrière est deux fois plus petit, décalé sur la
 * gauche et flouté : on l'aperçoit, on ne le lit pas.
 *
 * Aucune écriture sur le visuel — le texte vit entièrement dans la colonne de
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

/** Au-delà de ce déplacement, le geste est considéré comme vertical. */
const SEUIL_DECISION = 8;

/**
 * ImageCardWrapper — enveloppe l'image du carrousel avec le traitement glow
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

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
      {/* Gradient radial de glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,127,80,0.14), rgba(255,127,80,0) 62%)",
        }}
      />

      {/* Image */}
      <motion.img
        src={project.couverture}
        alt={project.titre}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
        initial={false}
        animate={{
          opacity: isCurrent ? 1 : 0.6,
          scale: isCurrent ? 1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

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

      {/* Périmètre SVG animé */}
      {perimeter && (
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
            d={perimeter}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: isCurrent ? 1 : 0, opacity: isCurrent ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            filter={`url(#edge-${project.slug})`}
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

    /*
      Budget de cycle : nombre de crans qu'on s'autorise à capter d'affilée.
      À zéro, on rend la main à la page (molette) ou on laisse le navigateur
      défiler (tactile, via touch-action). Une pause de 500 ms réarme le
      budget à un cycle complet.
    */
    let budget = PROJETS.length;
    let dernier = 0;

    const rearmer = () => {
      const maintenant = Date.now();
      if (maintenant - dernier > 500) budget = PROJETS.length;
      dernier = maintenant;
    };

    /* ---------------------------- Molette ---------------------------- */
    const onWheel = (evenement: WheelEvent) => {
      if (Math.abs(evenement.deltaY) < 4) return;
      rearmer();
      if (budget <= 0) return; // cycle épuisé : la page défile
      evenement.preventDefault();
      budget -= 1;
      aller(evenement.deltaY > 0 ? 1 : -1);
    };

    /* ---------------------------- Tactile ----------------------------
       `touch-action` est basculé à chaque touchstart : `pan-x` tant qu'il
       reste du budget (on capte le vertical), `pan-y` une fois le cycle
       épuisé (le navigateur reprend le défilement de la page). C'est le
       seul réglage fiable cross-navigateur pour rendre la main sur mobile. */
    let departY = 0;
    let departX = 0;
    let ecart = 0;
    let capture: boolean | null = null;

    const onTouchStart = (evenement: TouchEvent) => {
      rearmer();
      noeud.style.touchAction = budget > 0 ? "pan-x" : "pan-y";
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
        // Vertical et budget disponible → on prend la main ; sinon on laisse.
        capture = Math.abs(ecart) > Math.abs(lateral) && budget > 0;
      }

      if (capture) evenement.preventDefault();
    };

    const onTouchEnd = () => {
      if (capture && Math.abs(ecart) > SEUIL_GLISSEMENT) {
        budget -= 1;
        // Doigt vers le HAUT (ecart < 0) → projet précédent.
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

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------------------------------------------------------- */}
      {/*  Colonne de texte — titre en HAUT, détails alignés sur le BAS     */}
      {/*  du carrousel (la colonne s'étire à la hauteur de la scène).      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col">
        <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] font-light leading-[1.1] tracking-tight text-papier">
          {projet.titre}
        </h2>

        {/* mt-auto : ce bloc descend au bas de la colonne, donc au bas du visuel */}
        <div className="mt-auto pt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500">
            /{String(courant + 1).padStart(2, "0")}
            <span className="text-trait">
              {" "}
              — {String(PROJETS.length).padStart(2, "0")}
            </span>
          </p>

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

          <Link
            href="/portfolio/tous"
            className="mt-4 inline-flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-trait transition-colors duration-300 ease-sobre hover:text-papier"
          >
            Voir la grille complète
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Carrousel — le visuel seul, avec traitement glow cohérent home   */}
      {/* ---------------------------------------------------------------- */}
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
    </div>
  );
}
