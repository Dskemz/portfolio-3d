'use client';

import { motion } from 'framer-motion';

interface ProjectHeaderProps {
  client: string;
  nom: string;
  role: string;
  outils: string[];
  annee: number;
}

export function ProjectHeader({ client, nom, role, outils, annee }: ProjectHeaderProps) {
  return (
    <motion.header
      className="border-b border-mine bg-noir px-6 py-20 lg:px-8 lg:py-32"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Titre principal */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-[0.24em] text-[#ed8936]">{client}</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
              {nom}
            </h1>
          </div>
          <p className="max-w-2xl font-body text-trait">{role}</p>
        </div>

        {/* Métadonnées techniques */}
        <div className="grid gap-12 border-t border-graphite-800 pt-12 lg:grid-cols-3">
          {/* Année */}
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-[0.32em] text-graphite-500">ANNÉE</p>
            <p className="font-display text-2xl text-papier">{annee}</p>
          </div>

          {/* Rôle visuel */}
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-[0.32em] text-graphite-500">DOMAINE</p>
            <p className="font-body text-papier">Direction 3D<br />& Modélisation</p>
          </div>

          {/* Outils */}
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-[0.32em] text-graphite-500">OUTILS</p>
            <div className="flex flex-wrap gap-2">
              {outils.map((outil) => (
                <span
                  key={outil}
                  className="inline-block border border-graphite-700 px-3 py-1 text-xs text-trait hover:border-[#ed8936] hover:text-[#ed8936] transition-all"
                >
                  {outil}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
