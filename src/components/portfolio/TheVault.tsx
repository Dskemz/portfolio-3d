'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJETS, TYPES_PROJETS } from '@/content/projets';
import { motion } from 'framer-motion';

export function TheVault() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjets = useMemo(() => {
    if (activeFilter === 'all') return PROJETS;
    return PROJETS.filter((p) => p.types.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      {/* Filtres */}
      <div className="flex flex-wrap gap-3 border-b border-mine pb-8">
        <motion.button
          onClick={() => setActiveFilter('all')}
          className={`font-mono text-xs tracking-[0.24em] transition-all ${
            activeFilter === 'all'
              ? 'border-b-2 border-[#ed8936] text-papier'
              : 'text-trait hover:text-papier'
          }`}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          TOUS
        </motion.button>

        {TYPES_PROJETS.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => setActiveFilter(type.id)}
            className={`font-mono text-xs tracking-[0.24em] transition-all ${
              activeFilter === type.id
                ? 'border-b-2 border-[#ed8936] text-papier'
                : 'text-trait hover:text-papier'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Grille de projets */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredProjets.map((projet, idx) => (
          <motion.div
            key={projet.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link href={`/portfolio/${projet.slug}`}>
              <div className="group relative space-y-4 cursor-pointer">
                {/* Image avec overlay */}
                <div className="relative overflow-hidden rounded-lg aspect-video bg-graphite-900">
                  <Image
                    src={projet.couverture}
                    alt={projet.nom}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  {/* Halo au survol */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 border border-[#ed8936]/30 rounded-lg" />
                    <div className="absolute inset-0 border border-[#ed8936]/10 rounded-lg blur-[2px]" />
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-lg leading-tight group-hover:text-[#ed8936] transition-colors">
                      {projet.nom}
                    </h3>
                    <span className="text-xs text-trait font-mono">{projet.annee}</span>
                  </div>
                  <p className="text-sm text-trait">{projet.client}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {projet.types.map((typeId) => {
                      const type = TYPES_PROJETS.find((t) => t.id === typeId);
                      return (
                        <span
                          key={typeId}
                          className="inline-block border border-graphite-600 px-2 py-1 text-xs text-trait group-hover:border-[#ed8936] group-hover:text-[#ed8936] transition-all"
                        >
                          {type?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Lien avec flèche */}
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.24em] text-trait group-hover:text-[#ed8936] transition-colors pt-2">
                  Découvrir <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjets.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-trait">Aucun projet pour ce filtre.</p>
        </div>
      )}
    </div>
  );
}
