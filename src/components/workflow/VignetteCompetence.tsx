"use client";

import { useState } from "react";
import type { EtapeWorkflow, ModeMedia } from "@/content/workflow";

interface VignetteCompetenceProps {
  etape: EtapeWorkflow;
}

/**
 * Vignette de compétence — socle fonctionnel.
 *
 * La zone média est pour l'instant un placeholder : cadre fin, fond
 * sourd, halo orange discret. Elle est déjà câblée sur deux états (2D /
 * 3D) décrits dans `MediaEtape`, de sorte que brancher les vrais assets
 * plus tard ne demandera que de remplir `src` dans `workflow.ts` et de
 * remplacer le bloc `<Placeholder>` par le rendu réel.
 *
 * Le sélecteur 2D/3D n'apparaît que si l'étape déclare un média
 * `interactif` : la donnée pilote l'interface, pas l'inverse.
 */
export default function VignetteCompetence({ etape }: VignetteCompetenceProps) {
  const [mode, setMode] = useState<ModeMedia>("2d");

  const bascule = Boolean(etape.media.interactif);
  const estBis = etape.type === "bis";
  const media = mode === "3d" ? etape.media.interactif : etape.media.statique;

  return (
    <article
      className={`group relative border bg-black/60 backdrop-blur-[2px] transition-colors duration-500 ${
        estBis
          ? "border-mine/50 p-5 md:p-6"
          : "border-mine p-6 md:p-8"
      } hover:border-[#FF7F50]/50`}
    >
      {/* En-tête */}
      <header className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF7F50]">
          {etape.index}
        </span>
        {estBis && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-trait">
            Dérivation
          </span>
        )}
      </header>

      <h3
        className={`mt-4 font-display tracking-tight text-papier ${
          estBis ? "text-lg" : "text-xl md:text-2xl"
        }`}
      >
        {etape.titre}
      </h3>

      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-trait">
        {etape.sousTitre}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-papier/70">
        {etape.description}
      </p>

      {/* Zone média — placeholder pour l'instant */}
      <div className="mt-6">
        {bascule && (
          <div className="mb-3 flex gap-px border border-mine/60 p-px">
            {(["2d", "3d"] as const).map((valeur) => (
              <button
                key={valeur}
                type="button"
                onClick={() => setMode(valeur)}
                aria-pressed={mode === valeur}
                className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  mode === valeur
                    ? "bg-[#FF7F50] text-black"
                    : "text-trait hover:text-papier"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                {valeur}
              </button>
            ))}
          </div>
        )}

        <Placeholder
          mode={bascule ? mode : "2d"}
          libelle={media?.alt ?? etape.media.statique.alt}
          compact={estBis}
        />
      </div>
    </article>
  );
}

interface PlaceholderProps {
  mode: ModeMedia;
  libelle: string;
  compact: boolean;
}

/**
 * Emplacement réservé au futur asset.
 *
 * À remplacer par `next/image` (mode 2d) et par le viewer Babylon
 * (mode 3d) une fois les médias disponibles. Conserve volontairement le
 * ratio final pour que la mise en page ne bouge pas lors de la bascule.
 */
function Placeholder({ mode, libelle, compact }: PlaceholderProps) {
  return (
    <div
      style={{ aspectRatio: compact ? "16 / 9" : "4 / 3" }}
      className="relative w-full overflow-hidden border border-mine/60 bg-graphite-950"
    >
      {/* Halo orange sourd */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,127,80,0.14), transparent 70%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
          {mode === "3d" ? "Média 3D" : "Média 2D"}
        </span>
        <span className="max-w-[80%] text-center text-[11px] leading-snug text-trait/70">
          {libelle}
        </span>
      </div>
    </div>
  );
}
