"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/**
 * HomeIntro — séquence d'introduction (loader) de la page d'accueil.
 *
 * Déroulé :
 *   1. Écran totalement noir, défilement bloqué, aucun contenu visible.
 *   2. Le fil orange arrive du HAUT, fait un coude à angle droit légèrement
 *      arrondi et SORT par la gauche.
 *   3. Effet de liaison : il rentre aussitôt par la DROITE et revient au
 *      CENTRE de l'écran.
 *   4. Au centre, animation « goutte d'eau » : il ralentit, enfle légèrement
 *      et s'immobilise (easing back-out).
 *   5. À cet instant, le cœur orange se matérialise et le contenu de la home
 *      apparaît progressivement (fondu).
 *   6. La séquence terminée, le défilement est débloqué.
 *
 * Le contenu (children) est TOUJOURS monté, seulement masqué en opacité : le
 * HTML reste présent pour le SEO et il n'y a aucun clignotement au reveal.
 *
 * `prefers-reduced-motion` : la séquence est sautée, le contenu est affiché
 * immédiatement et le défilement n'est jamais bloqué.
 *
 * Le fil est tracé en pixels réels (viewBox = dimensions de la fenêtre,
 * `preserveAspectRatio="none"` → échelle 1:1, donc coude non déformé) : pas de
 * distorsion et les extrémités touchent vraiment les bords de l'écran.
 */

const CORNER_R = 14;
const ACCENT = "#FF7F50";

export default function HomeIntro({ children }: { children: React.ReactNode }) {
  const [reveal, setReveal] = useState(false);
  const [fini, setFini] = useState(false);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  const overlay = useRef<HTMLDivElement>(null);
  const filArrivee = useRef<SVGPathElement>(null);
  const filRetour = useRef<SVGPathElement>(null);
  const goutte = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDim({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    if (dim.w === 0) return;

    const html = document.documentElement;
    const overflowPrecedent = html.style.overflow;
    const debloquer = () => {
      html.style.overflow = overflowPrecedent;
    };

    const reduit =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduit) {
      setReveal(true);
      setFini(true);
      return;
    }

    // Blocage du défilement pendant toute la séquence.
    html.style.overflow = "hidden";

    let annule = false;

    const jouer = async () => {
      const a = filArrivee.current;
      const b = filRetour.current;
      const g = goutte.current;
      const ov = overlay.current;
      if (!a || !b || !g || !ov) {
        setReveal(true);
        setFini(true);
        debloquer();
        return;
      }

      const lenA = a.getTotalLength();
      const lenB = b.getTotalLength();
      const seg = Math.min(180, lenA * 0.55);

      // Comète = un segment visible qui parcourt le tracé (aucune traînée fixe).
      a.style.strokeDasharray = `${seg} ${lenA + seg}`;
      a.style.strokeDashoffset = `${seg}`;
      b.style.strokeDasharray = `${seg} ${lenB + seg}`;
      b.style.strokeDashoffset = `${seg}`;

      // 2. Arrivée du haut → coude → sortie à gauche.
      await animate(seg, -lenA, {
        duration: 0.85,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (v) => {
          a.style.strokeDashoffset = String(v);
        },
      }).finished;
      if (annule) return;

      // 3. Liaison : rentrée par la droite → retour au centre.
      await animate(seg, -lenB, {
        duration: 0.62,
        ease: [0.22, 0.61, 0.36, 1],
        onUpdate: (v) => {
          b.style.strokeDashoffset = String(v);
        },
      }).finished;
      if (annule) return;

      // 4. Goutte d'eau : enfle puis se stabilise (back-out).
      await animate(
        g,
        { opacity: [0, 1, 1], scale: [0, 1.35, 1] },
        { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
      ).finished;
      if (annule) return;

      // 5. Révélation progressive du contenu.
      setReveal(true);

      // Fondu de l'écran noir par-dessus le contenu qui apparaît.
      await animate(ov, { opacity: [1, 0] }, { duration: 0.65, ease: "easeInOut" })
        .finished;
      if (annule) return;

      // 6. Fin : on retire l'écran et on débloque le défilement.
      setFini(true);
      debloquer();
    };

    jouer();

    return () => {
      annule = true;
      debloquer();
    };
  }, [dim.w, dim.h]);

  const cx = dim.w / 2;
  const cy = dim.h / 2;
  const traceArrivee = `M ${cx} 0 V ${cy - CORNER_R} Q ${cx} ${cy} ${cx - CORNER_R} ${cy} H 0`;
  const traceRetour = `M ${dim.w} ${cy} H ${cx}`;

  return (
    <>
      <div
        className={`transition-opacity duration-700 ease-out ${
          reveal ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>

      {!fini && (
        <div
          ref={overlay}
          className="fixed inset-0 z-[100] bg-black"
          aria-hidden="true"
        >
          {dim.w > 0 && (
            <>
              <svg
                viewBox={`0 0 ${dim.w} ${dim.h}`}
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,127,80,0.55))" }}
              >
                <path
                  ref={filArrivee}
                  d={traceArrivee}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  ref={filRetour}
                  d={traceRetour}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Goutte au centre : conteneur positionné, enfant animé en échelle */}
              <div
                className="absolute"
                style={{
                  left: cx,
                  top: cy,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  ref={goutte}
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: ACCENT,
                    boxShadow:
                      "0 0 22px 6px rgba(255,127,80,0.75), 0 0 4px 1px rgba(255,127,80,0.9)",
                    opacity: 0,
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
