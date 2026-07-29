"use client";

import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/lib/imageResolver";

/**
 * Écrin de la visite. L'iframe (annonce Laforêt → viewer 3D, tout se passe à
 * l'intérieur) est habillée pour donner une stature de logiciel SaaS. Aucun
 * fichier distant n'est touché : tout est géré dans cette page hôte.
 *
 * DESKTOP / TABLETTE — mockup d'ordinateur portable FIXE (PNG, écran = trou
 * transparent). L'écran ne fait que ~770 px de large : si on y mettait l'iframe
 * à 100 %, la page distante afficherait sa mise en page MOBILE (effet loupe).
 * On rend donc l'iframe à une LARGEUR LOGIQUE DESKTOP (1440 px) puis on la
 * réduit avec un simple `transform: scale()` 2D (PAS de perspective 3D → les
 * clics restent précis au pixel) pour remplir exactement la dalle. Résultat :
 * la vraie mise en page desktop 16/9, à l'échelle, nette et centrée.
 *
 * MOBILE — châssis effacé → carte fluide au format téléphone. L'iframe est en
 * largeur native (pas de mise à l'échelle : la page rend sa version mobile, ce
 * qui est le rendu voulu). Un BOUCLIER tactile garde le défilement de la page
 * prioritaire : iframe `pointer-events:none` par défaut (le doigt défile la
 * PAGE), un tap sur « Toucher pour explorer » active la visite en FULLSCREEN,
 * « Terminer » la relâche — jamais piégé par le tactile du viewer 3D.
 * En fullscreen, la navbar se rétracte et l'iframe occupe tout l'écran.
 */

const SRC = "https://hub-visite-3d.vercel.app/index-laforet.html";

// Position de l'écran dans l'image rognée (public/images/laptop.png, 2332×1500).
const ECRAN = { left: 13.979, top: 5.133, width: 71.998, height: 61.267 };
// Ratio de la dalle (bbox mesurée 1679×919) → l'iframe logique le reprend
// pour remplir sans marge.
const ECRAN_RATIO = 1679 / 919; // ≈ 1.827
const LOGIQUE_W = 1440; // largeur logique = mise en page desktop
const LOGIQUE_H = Math.round(LOGIQUE_W / ECRAN_RATIO); // 788

function Iframe() {
  return (
    <iframe
      src={SRC}
      title="Visite virtuelle interactive"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="block h-full w-full border-none bg-white"
    />
  );
}

export default function VisiteEmbed() {
  const [actif, setActif] = useState(false); // interaction tactile mobile
  const containerRef = useRef<HTMLDivElement>(null);
  const ecranRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  // Échelle = largeur réelle de la dalle / largeur logique (1440). Recalculée
  // à chaque redimensionnement pour rester responsive.
  useEffect(() => {
    const el = ecranRef.current;
    if (!el) return;
    const maj = () => setScale(el.clientWidth / LOGIQUE_W);
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fullscreen sur mobile quand actif = true
  useEffect(() => {
    if (!actif || !containerRef.current) return;

    // Masquer scrollbar de la page
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [actif]);

  return (
    <div className="w-full">
      {/* ================= DESKTOP / TABLETTE — écrin laptop ================= */}
      <div className="mx-auto hidden w-full max-w-[1080px] px-6 lg:block">
        <div className="relative mx-auto aspect-[2332/1500] w-full">
          {/* Dalle : cadre rectangulaire aux coins subtilement arrondis, calé
              pile dans l'écran, rempli par l'iframe mise à l'échelle */}
          <div
            ref={ecranRef}
            className="absolute overflow-hidden rounded-[8px] bg-white"
            style={{
              left: `${ECRAN.left}%`,
              top: `${ECRAN.top}%`,
              width: `${ECRAN.width}%`,
              height: `${ECRAN.height}%`,
            }}
          >
            <div
              style={{
                width: `${LOGIQUE_W}px`,
                height: `${LOGIQUE_H}px`,
                transform: `scale(${scale || 0})`,
                transformOrigin: "top left",
                opacity: scale ? 1 : 0,
              }}
            >
              <Iframe />
            </div>
          </div>
          {/* Châssis par-dessus, transparent aux clics */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl("/images/laptop")}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          />
        </div>
      </div>

      {/* ===================== MOBILE — carte fluide ======================== */}
      {/* Quand actif = true : fullscreen immersif, navbar masquée */}
      <div
        ref={containerRef}
        className={`lg:hidden ${
          actif
            ? "fixed inset-0 z-[9999] flex flex-col bg-black"
            : "relative px-4"
        }`}
      >
        <div
          className={`relative mx-auto overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.85)] ${
            actif
              ? "h-full w-full max-w-none flex-1 rounded-none border-0 shadow-none"
              : "w-full max-w-[440px]"
          }`}
          style={
            actif
              ? { height: "100%" }
              : { height: "min(92svh, 1000px)" }
          }
        >
          <div className="h-full" style={{ pointerEvents: actif ? "auto" : "none" }}>
            <Iframe />
          </div>

          {/* Bouclier : couche pleine en pointer-events:none (le doigt fait
              défiler la PAGE), seul le bouton central capte le tap d'activation. */}
          {!actif && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 backdrop-blur-[1px]">
              <button
                type="button"
                onClick={() => setActif(true)}
                className="pointer-events-auto rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/75"
              >
                Toucher pour explorer la visite
              </button>
              <span className="text-xs text-white/70">
                Le défilement de la page reste libre
              </span>
            </div>
          )}

          {/* Relâche l'interaction → le défilement de la page reprend la main */}
          {actif && (
            <button
              type="button"
              onClick={() => setActif(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/65 px-3 py-1.5 text-xs font-medium text-white"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
