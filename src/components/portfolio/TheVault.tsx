"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PROJETS, TYPES_PROJETS } from "@/content/projets";

/**
 * The Vault — grille globale filtrable par typologie.
 *
 * Filtres : « Tous » + les quatre typologies de TYPES_PROJETS. Un projet
 * apparaît dès qu'il porte le type sélectionné (un projet peut en cumuler
 * plusieurs). Le survol révèle un liseré orange émissif (bord net + halo
 * flouté), sur le modèle du traitement des fiches ailleurs sur le site.
 */
export default function TheVault() {
  const [filtre, setFiltre] = useState<string>("tous");

  const projetsFiltres = useMemo(() => {
    if (filtre === "tous") return PROJETS;
    return PROJETS.filter((p) => p.types.includes(filtre as never));
  }, [filtre]);

  return (
    <div className="space-y-12">
      {/* Filtres */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-mine pb-6">
        <FiltreBouton
          actif={filtre === "tous"}
          onClick={() => setFiltre("tous")}
          label="Tous"
        />
        {Object.entries(TYPES_PROJETS).map(([id, { label }]) => (
          <FiltreBouton
            key={id}
            actif={filtre === id}
            onClick={() => setFiltre(id as any)}
            label={label}
          />
        ))}
      </div>

      {/* Grille */}
      <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projetsFiltres.map((projet) => (
            <motion.div
              key={projet.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Link href={`/portfolio/${projet.slug}`} className="group block">
                {/* Visuel + liseré émissif au survol */}
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-graphite-800"
                  style={
                    !projet.couverture
                      ? {
                          background: `linear-gradient(135deg, hsl(${
                            projet.slug.charCodeAt(0) * 3
                          }, 45%, 35%) 0%, hsl(${
                            projet.slug.charCodeAt(1) * 3
                          }, 55%, 25%) 100%)`,
                        }
                      : undefined
                  }
                >
                  {projet.couverture && (
                    <Image
                      src={projet.couverture}
                      alt={projet.titre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-sobre group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                  {/* Liseré : bord net + halo flouté */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 border border-orange-500/0 transition-colors duration-300 group-hover:border-orange-500/50"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 border border-orange-500/0 blur-[3px] transition-colors duration-300 group-hover:border-orange-500/30"
                  />
                </div>

                {/* Métadonnées */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg font-light leading-tight tracking-tight text-papier transition-colors duration-300 group-hover:text-orange-500">
                      {projet.titre}
                    </h3>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
                      {projet.annee}
                    </span>
                  </div>

                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
                    {projet.client}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {projet.types.map((typeId) => {
                      const typeData = TYPES_PROJETS[typeId];
                      if (!typeData) return null;
                      return (
                        <span
                          key={typeId}
                          className="inline-block border border-mine px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-trait transition-colors duration-300 group-hover:border-orange-500/40"
                        >
                          {typeData.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {projetsFiltres.length === 0 && (
        <p className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-trait">
          Aucun projet pour ce filtre
        </p>
      )}
    </div>
  );
}

function FiltreBouton({
  actif,
  onClick,
  label,
}: {
  actif: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] uppercase tracking-[0.24em] transition-colors duration-300 ease-sobre ${
        actif
          ? "text-orange-500"
          : "text-trait hover:text-papier"
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`mt-1 block h-px origin-left transition-transform duration-300 ease-sobre ${
          actif ? "scale-x-100 bg-orange-500" : "scale-x-0 bg-transparent"
        }`}
      />
    </button>
  );
}
