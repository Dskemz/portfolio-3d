"use client";

import Link from "next/link";
import type { HeroContentProps, Repere } from "@/types/hero";

/**
 * HeroContent — Texte principal, sous-titre, CTAs et repères.
 *
 * Responsabilités:
 * - Afficher le titre H1 avec identité visuelle (nom + titre)
 * - CTAs convertis (contact + projets)
 * - Repères structurés (Discipline, Spécialité, Moteur)
 * - Callbacks optionnels pour analytics/routing
 */
export default function HeroContent({
  reperes = [
    { cle: "Discipline", valeur: "Graphisme 3D généraliste" },
    { cle: "Spécialité", valeur: "Visites virtuelles 3D" },
    { cle: "Moteur", valeur: "Babylon.js — temps réel" },
  ],
  onDemoClick,
  onProjectsClick,
}: HeroContentProps) {
  return (
    <div className="flex flex-col justify-start">
      {/* Eyebrow — marque */}
      <p className="font-mono text-xs tracking-widest text-bleu-encre-clair">
        GRAPHITE 3D
      </p>

      {/* H1 — titre principal avec identité */}
      <h1 className="mt-5 font-display text-[clamp(2.1rem,5.2vw,3.9rem)] font-semibold leading-tight tracking-tight text-papier">
        Denis Masque
        <span aria-hidden className="mx-3 text-trait">
          |
        </span>
        <span className="block text-trait sm:inline">
          Graphiste 3D Généraliste
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-papier/80">
        Solutions de visites virtuelles 3D immersives et ultra-performantes.
      </p>

      {/* CTAs — Boutons d'action */}
      <div className="mt-9 flex flex-wrap gap-3">
        {/* Bouton principal — Demander une démo */}
        <Link
          href="/contact?type=demo"
          onClick={onDemoClick}
          className="inline-block bg-bleu-encre px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-bleu-encre-clair active:scale-95"
        >
          Demander une démonstration
        </Link>

        {/* Bouton secondaire — Voir les projets */}
        <Link
          href="/projets"
          onClick={onProjectsClick}
          className="inline-block border border-mine px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:border-trait active:scale-95"
        >
          Voir les projets
        </Link>
      </div>

      {/* Repères — Structure d'information */}
      <dl className="mt-12 grid grid-cols-1 gap-px border-t border-mine pt-1 sm:grid-cols-3">
        {reperes.map(({ cle, valeur }) => (
          <div key={cle} className="border-b border-mine py-4 sm:border-b-0">
            <dt className="font-mono text-xs tracking-widest text-trait">
              {cle}
            </dt>
            <dd className="mt-1.5 text-sm text-papier/90">{valeur}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
