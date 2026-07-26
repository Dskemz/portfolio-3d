"use client";

import { useState } from "react";

/**
 * Écrin de la visite. L'iframe (annonce Laforêt → viewer 3D, tout se passe à
 * l'intérieur) est habillée pour donner une stature de logiciel SaaS. Aucun
 * fichier distant n'est touché : tout est géré dans cette page hôte.
 *
 * DESKTOP / TABLETTE — mockup d'ordinateur portable FIXE (image PNG, écran
 * transparent). L'iframe est posée DERRIÈRE l'image, calée pile dans le trou
 * de l'écran ; le châssis (opaque) l'encadre, l'écran (transparent) la révèle.
 * L'image est en `pointer-events:none` → clics/molette atteignent l'iframe.
 *
 * MOBILE — le châssis s'efface au profit d'un conteneur fluide arrondi. Un
 * BOUCLIER tactile garde le défilement de la page prioritaire : par défaut le
 * doigt fait défiler la page (iframe `pointer-events:none`), on n'active le
 * tactile de la visite que sur un tap explicite, et un bouton « Terminer » le
 * relâche — l'utilisateur n'est jamais piégé par le tactile du viewer 3D.
 */

const SRC = "https://hub-visite-3d.vercel.app/index-laforet.html";

// Position de l'écran dans l'image rognée (public/images/laptop.png, 4758×3094).
const ECRAN = { left: 13.661, top: 5.301, width: 71.648, height: 67.453 };

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

  return (
    <div className="w-full">
      {/* ================= DESKTOP / TABLETTE — écrin laptop ================= */}
      <div className="mx-auto hidden w-full max-w-[1080px] px-6 lg:block">
        <div className="relative mx-auto aspect-[4758/3094] w-full">
          {/* Écran : l'iframe, posée dans le trou transparent du mockup */}
          <div
            className="absolute overflow-hidden bg-white"
            style={{
              left: `${ECRAN.left}%`,
              top: `${ECRAN.top}%`,
              width: `${ECRAN.width}%`,
              height: `${ECRAN.height}%`,
            }}
          >
            <Iframe />
          </div>
          {/* Châssis par-dessus, transparent aux clics */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/laptop.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          />
        </div>
      </div>

      {/* ===================== MOBILE — carte fluide ======================== */}
      <div className="px-4 lg:hidden">
        <div
          className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.85)]"
          style={{ height: "min(72vh, 600px)" }}
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
              Terminer · défiler la page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
