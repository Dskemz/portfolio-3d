"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FilPortfolio — le fil orange de la page projets, en UN SEUL tracé.
 *
 * Les tentatives en bordures CSS juxtaposées donnaient deux segments distincts
 * à chaque coude (un « double fil »). Ici c'est un unique `<path>` SVG : le
 * tracé est donc continu par construction, coudes arrondis compris.
 *
 * Parcours : bas du « j » de Projets → gauche → coude 90° → descente le long
 * de la colonne de texte → coude 90° → ligne droite vers la droite, entre le
 * bouton « Voir la grille » et le bandeau de logos, jusqu'au bord de l'écran.
 *
 * Les points d'ancrage (le « j », le couloir bouton/logos) sont MESURÉS dans
 * le DOM : le départ suit la taille `clamp` du titre et la position du couloir
 * suit la hauteur réelle du contenu, sans coordonnée en dur. Re-mesuré au
 * redimensionnement et une fois les polices chargées (la largeur du mot
 * « Pro » décale le « j »).
 *
 * L'émission est une seconde passe du même tracé, plus épaisse et translucide,
 * PAS un filtre SVG (coût de rastérisation au défilement). Comme les deux
 * passes partagent le même `d`, l'œil ne voit qu'un fil.
 *
 * Desktop uniquement : sur mobile le fil vertical du carrousel joue ce rôle.
 */

const GOUTTIERE = 32; // px depuis le bord gauche, à gauche de la colonne texte
const RAYON = 10; // rayon des coudes

export default function FilPortfolio() {
  const svg = useRef<SVGSVGElement>(null);
  const [trace, setTrace] = useState("");
  const [boite, setBoite] = useState({ largeur: 0, hauteur: 0 });

  useEffect(() => {
    const noeud = svg.current;
    if (!noeud) return;
    const zone = noeud.parentElement; // <main> en position relative
    if (!zone) return;

    const mesurer = () => {
      const depart = document.getElementById("fil-depart-j");
      const couloir = document.getElementById("fil-couloir");
      if (!depart || !couloir) return;

      const rz = zone.getBoundingClientRect();
      const rj = depart.getBoundingClientRect();
      const rc = couloir.getBoundingClientRect();

      const largeur = rz.width;
      const hauteur = rz.height;

      const xj = rj.left - rz.left; // bord gauche du j
      const yj = rj.bottom - rz.top; // bas du j (sous la hampe)
      const yCouloir = rc.top - rz.top + rc.height / 2;

      // Un seul path : gauche, coude bas, descente, coude droite, bord droit.
      const d = [
        `M ${xj.toFixed(1)} ${yj.toFixed(1)}`,
        `H ${GOUTTIERE + RAYON}`,
        `Q ${GOUTTIERE} ${yj.toFixed(1)} ${GOUTTIERE} ${(yj + RAYON).toFixed(1)}`,
        `V ${(yCouloir - RAYON).toFixed(1)}`,
        `Q ${GOUTTIERE} ${yCouloir.toFixed(1)} ${GOUTTIERE + RAYON} ${yCouloir.toFixed(1)}`,
        `H ${largeur.toFixed(1)}`,
      ].join(" ");

      setBoite({ largeur, hauteur });
      setTrace(d);
    };

    mesurer();

    const ro = new ResizeObserver(mesurer);
    ro.observe(zone);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(mesurer).catch(() => {});
    }
    window.addEventListener("resize", mesurer);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, []);

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      viewBox={`0 0 ${boite.largeur || 1} ${boite.hauteur || 1}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
    >
      {trace && (
        <>
          {/* Émission : même tracé, épais et translucide */}
          <path
            d={trace}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={5}
            opacity={0.16}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Trait plein */}
          <path
            d={trace}
            fill="none"
            stroke="#FF7F50"
            strokeWidth={1.5}
            opacity={0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}
