"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Embarque la visite dans MA page, sans jamais toucher aux fichiers distants
 * (index-laforet.html / viewer.html sont sur un autre domaine, hors de mon
 * contrôle). Toute la logique de dimensionnement vit ICI, côté parent.
 *
 * Deux états :
 *  • ANNONCE → l'iframe occupe TOUTE la largeur de la page, hauteur généreuse ;
 *    la fausse annonce s'affiche en entier et c'est le body de la page qui
 *    défile (aucun scroll interne).
 *  • VIEWER  → dès qu'on ouvre la visite 3D, l'iframe se ramène aux dimensions
 *    du viewer : une pleine hauteur d'écran immersive. Le viewer gère LUI-MÊME
 *    son panneau latéral (desktop/tablette) et son bottom-sheet (mobile) selon
 *    la largeur qu'on lui donne — je ne fais que lui offrir le bon cadre.
 *
 * ⚠️ CONTRAINTE CROSS-ORIGIN : l'iframe étant sur un autre domaine, je ne peux
 * NI lire son URL NI écouter le clic du bouton interne. Le seul signal
 * disponible sans modifier le distant est l'événement `load` : chaque
 * NAVIGATION interne de l'iframe le redéclenche. 1er load = annonce, 2e =
 * le visiteur a ouvert la visite 3D → on passe en cadre viewer.
 * Repli : si le bouton faisait un échange DOM sur place (sans navigation),
 * `load` ne se redéclenche pas — l'iframe reste alors en grand format, ce qui
 * demeure parfaitement lisible (dégradation propre).
 */

const SRC = "https://hub-visite-3d.vercel.app/index-laforet.html";

export default function VisiteEmbed() {
  const [enViewer, setEnViewer] = useState(false);
  const chargements = useRef(0);
  const zoneRef = useRef<HTMLDivElement>(null);

  const surLoad = useCallback(() => {
    chargements.current += 1;
    if (chargements.current >= 2 && !enViewer) {
      setEnViewer(true);
      requestAnimationFrame(() =>
        zoneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [enViewer]);

  return (
    <div
      ref={zoneRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-black"
      style={{
        // Annonce : hauteur pilotée par le min-h de l'iframe (plein écran large,
        // la page défile). Viewer : une pleine hauteur d'écran immersive.
        height: enViewer ? "100svh" : undefined,
        transition: "height 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <iframe
        src={SRC}
        title="Visite virtuelle interactive"
        onLoad={surLoad}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        scrolling="no"
        className={
          enViewer
            ? "block h-full w-full border-none"
            : "block min-h-[1100px] w-full border-none"
        }
        style={{ overflow: "hidden" }}
      />
    </div>
  );
}
