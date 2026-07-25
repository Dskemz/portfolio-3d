"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { ORIGIN_ID } from "@/content/workflowData";

/**
 * HomeIntro — séquence d'introduction (loader) de la page d'accueil.
 *
 * Récit : de NOMBREUX flux (les workflows éprouvés au fil de la carrière)
 * entrent par le haut comme les pistes d'un circuit imprimé, à angles droits,
 * et CONVERGENT en un seul point. De ce point, un unique flux — le workflow
 * affiné, optimisé — descend, sort par la gauche, rentre par la droite (effet
 * de liaison) et vient se poser en « goutte d'eau » EXACTEMENT sur l'amorce de
 * la home (`#wf-origin`), le point qui lance le storytelling. Le contenu
 * apparaît alors en fondu, puis le défilement est débloqué.
 *
 * Points de conception importants :
 * – Le point d'arrivée est la position RÉELLE de l'amorce, mesurée dans le DOM
 *   (le contenu est monté dès le départ, masqué en opacité), re-mesurée juste
 *   avant la goutte pour un raccord parfait.
 * – Aucun `await document.fonts.ready` en tête : sur une machine lente il
 *   retardait tout le lancement (l'utilisateur « ratait » l'animation). On
 *   démarre immédiatement.
 * – Aucun filtre CSS `drop-shadow` (rastérisé à CHAQUE image) : coûteux sur
 *   vieux matériel. Les pistes sont des traits nets ; la lueur est portée par
 *   la goutte finale.
 * – Chaque piste est MASQUÉE (opacity 0) dès que sa comète a fini : sinon un
 *   `stroke-linecap: round` laisse un point orange résiduel à l'extrémité —
 *   c'était le point fantôme qui restait au bord gauche sur téléphone.
 *
 * `prefers-reduced-motion` : séquence sautée, contenu affiché, scroll libre.
 */

const CORNER_R = 12;
const ACCENT = "#FF7F50";
/** Longueur du segment lumineux (comète), en fraction du tracé (pathLength=1). */
const SEG = 0.4;

/** Pistes sources : point de départ en haut (x) et hauteur du palier (y). */
const SOURCES = [
  { x: 0.14, y: 0.15 },
  { x: 0.33, y: 0.22 },
  { x: 0.5, y: 0.12 },
  { x: 0.67, y: 0.22 },
  { x: 0.86, y: 0.15 },
] as const;

/** Point de convergence (haut-centre), en fractions du viewport. */
const MERGE = { x: 0.5, y: 0.31 } as const;

export default function HomeIntro({ children }: { children: React.ReactNode }) {
  const [reveal, setReveal] = useState(false);
  const [fini, setFini] = useState(false);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  const overlay = useRef<HTMLDivElement>(null);
  const sources = useRef<(SVGPathElement | null)[]>([]);
  const continuation = useRef<SVGPathElement>(null);
  const retour = useRef<SVGPathElement>(null);
  const goutteBox = useRef<HTMLDivElement>(null);
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

    html.style.overflow = "hidden";
    let annule = false;

    const cible = () => {
      // Position réelle de l'amorce ; fallback = centre. X ≈ centre (héros centré).
      const el = document.getElementById(ORIGIN_ID);
      const c = { x: dim.w / 2, y: dim.h / 2 };
      if (el) {
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        if (x > 0 && x < dim.w && y > 0 && y < dim.h) {
          c.x = x;
          c.y = y;
        }
      }
      return c;
    };

    const filerVers = (p: SVGPathElement | null, duree: number, retard = 0) =>
      p
        ? animate(
            p,
            { strokeDashoffset: [SEG, -1] },
            { duration: duree, delay: retard, ease: [0.4, 0, 0.2, 1] },
          ).finished
        : Promise.resolve();

    const jouer = async () => {
      const cont = continuation.current;
      const ret = retour.current;
      const gBox = goutteBox.current;
      const g = goutte.current;
      const ov = overlay.current;
      if (!cont || !ret || !gBox || !g || !ov) {
        setReveal(true);
        setFini(true);
        debloquer();
        return;
      }

      const w = dim.w;
      const h = dim.h;
      const mx = MERGE.x * w;
      const my = MERGE.y * h;
      const ori0 = cible();

      // ── Géométrie des pistes sources (style circuit, coudes à 90°) ──────
      sources.current.forEach((el, i) => {
        if (!el) return;
        const xi = SOURCES[i].x * w;
        const yi = SOURCES[i].y * h;
        const dir = mx >= xi ? 1 : -1;
        const d =
          xi === mx
            ? `M ${xi} 0 V ${my}` // piste centrale : tout droit
            : `M ${xi} 0 V ${yi - CORNER_R} ` +
              `Q ${xi} ${yi} ${xi + dir * CORNER_R} ${yi} ` +
              `H ${mx - dir * CORNER_R} ` +
              `Q ${mx} ${yi} ${mx} ${yi + CORNER_R} V ${my}`;
        el.setAttribute("d", d);
      });

      // Continuation : du point de convergence, descente → coude → sortie gauche.
      cont.setAttribute(
        "d",
        `M ${mx} ${my} V ${ori0.y - CORNER_R} ` +
          `Q ${mx} ${ori0.y} ${mx - CORNER_R} ${ori0.y} H 0`,
      );

      // 1. Les nombreux flux convergent (départs légèrement décalés).
      await Promise.all(
        sources.current.map((el, i) => filerVers(el, 0.6, i * 0.06)),
      );
      if (annule) return;
      // Masque les sources pour éviter tout point résiduel aux extrémités.
      sources.current.forEach((el) => el && (el.style.opacity = "0"));

      // 2. Le flux unique descend et sort par la gauche.
      await filerVers(cont, 0.7);
      if (annule) return;
      cont.style.opacity = "0";

      // 3. Liaison : re-mesure de l'amorce puis rentrée par la droite → point.
      const ori = cible();
      ret.setAttribute("d", `M ${w} ${ori.y} H ${ori.x}`);
      gBox.style.left = `${ori.x}px`;
      gBox.style.top = `${ori.y}px`;

      await filerVers(ret, 0.55);
      if (annule) return;
      ret.style.opacity = "0";

      // 4. Goutte d'eau : enfle puis se stabilise (back-out), sur l'amorce.
      await animate(
        g,
        { opacity: [0, 1, 1], scale: [0, 1.35, 1] },
        { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
      ).finished;
      if (annule) return;

      // 5. Révélation progressive du contenu.
      setReveal(true);

      await animate(ov, { opacity: [1, 0] }, { duration: 0.6, ease: "easeInOut" })
        .finished;
      if (annule) return;

      // 6. Fin : retrait de l'écran + déblocage du défilement.
      setFini(true);
      debloquer();
    };

    jouer();

    return () => {
      annule = true;
      debloquer();
    };
  }, [dim.w, dim.h]);

  const dashInit = { strokeDasharray: `${SEG} 1`, strokeDashoffset: SEG };

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
              >
                {SOURCES.map((_, i) => (
                  <path
                    key={i}
                    ref={(el) => {
                      sources.current[i] = el;
                    }}
                    pathLength={1}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={dashInit}
                  />
                ))}
                <path
                  ref={continuation}
                  pathLength={1}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={dashInit}
                />
                <path
                  ref={retour}
                  pathLength={1}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={dashInit}
                />
              </svg>

              <div
                ref={goutteBox}
                className="absolute"
                style={{ transform: "translate(-50%, -50%)" }}
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
