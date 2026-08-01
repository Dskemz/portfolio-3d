"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fil mobile partagé (/about et /visite). Mesuré sur la pile RÉELLE de cartes :
 * il ENTRE depuis le bord de l'écran par un coude, serpente orthogonalement en
 * traversant chaque carte empilée, puis fait un virage à 90° pour RESSORTIR
 * proprement sur le bord de l'écran, plus aucun trait qui s'arrête dans le
 * vide. Animé comme le desktop : `pathLength` sur 3 traits concentriques +
 * illumination transitoire par carte au passage du front. Positions lues en
 * offsetTop/offsetHeight (insensibles aux transforms d'apparition des cartes) ;
 * décalage vers le bord d'écran mesuré via getBoundingClientRect.
 */

interface Item {
  titre: string;
  description: string;
}

const FLUX_DELAI = 0.9;
const DUREE_TRACE = 2.6;
const R = 8; // rayon des coudes

export default function RailMobile({
  items,
  accent,
  heading = "h3",
}: {
  items: readonly Item[];
  accent: string;
  heading?: "h2" | "h3";
}) {
  const reduceMotion = useReducedMotion();
  const contRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [geo, setGeo] = useState<{
    w: number;
    h: number;
    d: string;
    noeuds: { x: number; y: number; cadre: number }[];
    illum: number[];
  } | null>(null);

  useLayoutEffect(() => {
    const cont = contRef.current;
    if (!cont) return;

    const mesurer = () => {
      const w = cont.offsetWidth;
      const h = cont.offsetHeight;
      const cartes = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (w === 0 || cartes.length < items.length) return;

      const rect = cont.getBoundingClientRect();
      const offL = rect.left; // distance conteneur → bord gauche écran
      const offR = window.innerWidth - rect.right; // → bord droit
      const bandes = cartes.map((c) => ({
        top: c.offsetTop,
        bottom: c.offsetTop + c.offsetHeight,
      }));
      const xs = bandes.map((_, i) => (i % 2 === 0 ? w * 0.3 : w * 0.7));
      const f = (n: number) => n.toFixed(1);
      // Bord d'écran le plus proche de la colonne i (retrait de 4px pour que le
      // halo arrondi reste dans l'écran).
      const bord = (i: number) => (xs[i] <= w / 2 ? -offL + 4 : w + offR - 4);
      const noeuds: { x: number; y: number; cadre: number }[] = [];

      // ── Entrée : bord d'écran → coude → descente dans la 1re carte
      const yIn = Math.max(2, bandes[0].top - 12);
      const exIn = bord(0);
      const dIn = Math.sign(xs[0] - exIn) || 1;
      const rIn = Math.max(0, Math.min(R, Math.abs(xs[0] - exIn), bandes[0].top - yIn));
      let d =
        `M ${f(exIn)} ${f(yIn)} L ${f(xs[0] - dIn * rIn)} ${f(yIn)}` +
        ` Q ${f(xs[0])} ${f(yIn)} ${f(xs[0])} ${f(yIn + rIn)}`;

      // ── Traversée des cartes + zigzags dans les interstices
      bandes.forEach((b, i) => {
        const x = xs[i];
        noeuds.push({ x, y: b.top, cadre: i });
        noeuds.push({ x, y: b.bottom, cadre: i });
        d += ` L ${f(x)} ${f(b.bottom)}`;
        if (i < bandes.length - 1) {
          const nx = xs[i + 1];
          const dir = Math.sign(nx - x) || 1;
          const gapMid = (b.bottom + bandes[i + 1].top) / 2;
          const r = Math.max(
            0,
            Math.min(R, Math.abs(nx - x) / 2, gapMid - b.bottom, bandes[i + 1].top - gapMid),
          );
          d +=
            ` L ${f(x)} ${f(gapMid - r)} Q ${f(x)} ${f(gapMid)} ${f(x + dir * r)} ${f(gapMid)}` +
            ` L ${f(nx - dir * r)} ${f(gapMid)} Q ${f(nx)} ${f(gapMid)} ${f(nx)} ${f(gapMid + r)}` +
            ` L ${f(nx)} ${f(bandes[i + 1].top)}`;
        }
      });

      // ── Sortie : dernière carte → virage 90° → bord d'écran
      const last = bandes.length - 1;
      const xl = xs[last];
      const yOut = Math.min(h - 2, bandes[last].bottom + 12);
      const exOut = bord(last);
      const dOut = Math.sign(exOut - xl) || 1;
      const rOut = Math.max(0, Math.min(R, Math.abs(exOut - xl), yOut - bandes[last].bottom));
      d +=
        ` L ${f(xl)} ${f(yOut - rOut)} Q ${f(xl)} ${f(yOut)} ${f(xl + dOut * rOut)} ${f(yOut)}` +
        ` L ${f(exOut)} ${f(yOut)}`;

      const illum = bandes.map((b) =>
        Math.max(0, FLUX_DELAI + ((b.top + b.bottom) / 2 / h) * DUREE_TRACE - 0.3),
      );
      setGeo({ w, h, d, noeuds, illum });
    };

    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(cont);
    cardRefs.current.forEach((c) => c && ro.observe(c));
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(mesurer).catch(() => {});
    }
    return () => ro.disconnect();
  }, [items.length]);

  const traitAnime =
    reduceMotion || !geo
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.25 as const },
          transition: {
            duration: DUREE_TRACE,
            ease: [0.4, 0, 0.2, 1] as const,
            delay: FLUX_DELAI,
          },
        };

  const Titre = heading;

  return (
    <div ref={contRef} className="relative lg:hidden">
      {geo && (
        <svg
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full overflow-visible"
        >
          {[
            { sw: 7, op: 0.1 },
            { sw: 4, op: 0.18 },
            { sw: 2, op: 1 },
          ].map(({ sw, op }) => (
            <motion.path
              key={sw}
              d={geo.d}
              fill="none"
              stroke={accent}
              strokeWidth={sw}
              opacity={op}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...traitAnime}
            />
          ))}
        </svg>
      )}

      <div className="relative z-10 flex flex-col gap-10 py-6">
        {items.map((item, index) => (
          <motion.article
            key={item.titre}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="relative border border-mine bg-black px-7 py-8"
            {...(reduceMotion
              ? { initial: false as const }
              : {
                  initial: { opacity: 0, y: index % 2 === 0 ? 30 : -30 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.4 as const },
                  transition: {
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1] as const,
                    delay: index * 0.15,
                  },
                })}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border"
              style={{
                borderColor: accent,
                boxShadow: `0 0 22px 2px ${accent}66, inset 0 0 26px ${accent}22`,
              }}
              {...(reduceMotion || !geo
                ? { initial: false as const }
                : {
                    initial: { opacity: 0 },
                    whileInView: { opacity: [0, 1, 0] },
                    viewport: { once: true, amount: 0.4 as const },
                    transition: {
                      duration: 0.6,
                      delay: geo.illum[index],
                      times: [0, 0.5, 1] as const,
                      ease: "easeInOut" as const,
                    },
                  })}
            />
            <Titre className="whitespace-pre-line font-display text-xl font-light leading-[1.14] tracking-tight text-papier">
              {item.titre}
            </Titre>
            <p className="mt-3 text-sm font-light leading-relaxed text-papier/60">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>

      {geo && (
        <svg
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >
          {geo.noeuds.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={3.5}
              fill={accent}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.35,
                delay: reduceMotion ? 0 : geo.illum[n.cadre] + 0.15,
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
