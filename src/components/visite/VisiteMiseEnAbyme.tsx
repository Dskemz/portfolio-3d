"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mise en abyme de la visite virtuelle.
 *
 * L'iframe charge une fausse page d'annonce (hébergée à part, CROSS-ORIGIN)
 * qui contient déjà le bouton « entrer dans le viewer ». Le parent ne peut
 * donc PAS lire la hauteur du contenu ni détecter le clic : c'est l'iframe qui
 * prévient le parent par `postMessage`. Contrat attendu (source `visite-3d`) :
 *
 *   parent.postMessage({ source:"visite-3d", kind:"height", value:<px> }, "*")
 *       → hauteur réelle du contenu, envoyée au chargement puis à chaque
 *         resize. Le parent cale l'iframe dessus → AUCUN scroll interne, c'est
 *         la page qui défile.
 *   parent.postMessage({ source:"visite-3d", kind:"viewer" }, "*")
 *       → l'utilisateur est entré dans le viewer 3D. L'iframe s'élargit et
 *         prend une hauteur plein écran, et le défilement de la page est gelé
 *         au survol pour laisser la molette piloter la scène 3D.
 *   parent.postMessage({ source:"visite-3d", kind:"annonce" }, "*")
 *       → retour à la fausse annonce (optionnel).
 */

const SRC = "https://hub-visite-3d.vercel.app/viewer.html";
const ORIGINE_AUTORISEE = new URL(SRC).origin;

// Repli si l'iframe n'annonce pas encore sa hauteur.
const HAUTEUR_ANNONCE_DEFAUT = 640;

type Mode = "annonce" | "viewer";

interface MessageVisite {
  source?: string;
  kind?: "height" | "viewer" | "annonce";
  value?: number;
}

export default function VisiteMiseEnAbyme() {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const verrouilleRef = useRef(false);
  const [mode, setMode] = useState<Mode>("annonce");
  const [hauteurAnnonce, setHauteurAnnonce] = useState(HAUTEUR_ANNONCE_DEFAUT);
  const [pointeurFin, setPointeurFin] = useState(false);

  // Verrou de défilement (viewer only) : l'iframe étant cross-origin, la molette
  // à l'intérieur ne remonte pas — la seule prise du parent est SON défilement,
  // qu'on gèle au survol du viewer. Jamais sur tactile (piégerait l'utilisateur).
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const maj = () => setPointeurFin(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);

  const verrouiller = useCallback(() => {
    if (verrouilleRef.current) return;
    verrouilleRef.current = true;
    const { documentElement: html, body } = document;
    const compensation = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (compensation > 0) body.style.paddingRight = `${compensation}px`;
  }, []);

  const deverrouiller = useCallback(() => {
    if (!verrouilleRef.current) return;
    verrouilleRef.current = false;
    const { documentElement: html, body } = document;
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.paddingRight = "";
  }, []);

  // Écoute des messages de l'iframe (hauteur + bascule viewer).
  useEffect(() => {
    const surMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGINE_AUTORISEE) return;
      const data = e.data as MessageVisite | null;
      if (!data || data.source !== "visite-3d") return;

      if (data.kind === "height" && typeof data.value === "number") {
        setHauteurAnnonce(Math.max(320, Math.round(data.value)));
      } else if (data.kind === "viewer") {
        setMode("viewer");
        requestAnimationFrame(() =>
          conteneurRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        );
      } else if (data.kind === "annonce") {
        setMode("annonce");
      }
    };

    window.addEventListener("message", surMessage);
    return () => window.removeEventListener("message", surMessage);
  }, []);

  // Filets de sécurité du verrou : sortie de fenêtre, onglet caché, démontage,
  // retour en mode annonce.
  useEffect(() => {
    if (mode !== "viewer") {
      deverrouiller();
      return;
    }
    if (!pointeurFin) return;

    const surSortieFenetre = (e: MouseEvent) => {
      if (!e.relatedTarget) deverrouiller();
    };
    const surVisibilite = () => {
      if (document.hidden) deverrouiller();
    };
    document.addEventListener("mouseout", surSortieFenetre);
    document.addEventListener("visibilitychange", surVisibilite);
    window.addEventListener("blur", deverrouiller);
    return () => {
      document.removeEventListener("mouseout", surSortieFenetre);
      document.removeEventListener("visibilitychange", surVisibilite);
      window.removeEventListener("blur", deverrouiller);
      deverrouiller();
    };
  }, [mode, pointeurFin, deverrouiller]);

  const estViewer = mode === "viewer";

  return (
    <div
      ref={conteneurRef}
      onMouseEnter={estViewer && pointeurFin ? verrouiller : undefined}
      onMouseLeave={estViewer && pointeurFin ? deverrouiller : undefined}
      className="mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black"
      style={{
        // Annonce : fenêtre plus ÉTROITE que la page (mise en abyme).
        // Viewer : elle s'élargit et prend la pleine hauteur du viewer 3D.
        maxWidth: estViewer ? "min(80rem, 100%)" : "min(62rem, 100%)",
        height: estViewer ? "min(88vh, 920px)" : `${hauteurAnnonce}px`,
        transition:
          "max-width 0.55s cubic-bezier(0.16,1,0.3,1), height 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <iframe
        src={SRC}
        title="Visite virtuelle interactive"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="block h-full w-full border-none"
      />
    </div>
  );
}
