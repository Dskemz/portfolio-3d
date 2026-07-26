'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      className="space-y-8 border-t border-mine pt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <h2 className="font-display text-2xl leading-tight">Détails & Matières</h2>

      {/* Grille responsive */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className="group relative overflow-hidden rounded-lg bg-graphite-900 aspect-square cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src={img.url}
              alt={img.alt || `Détail ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white/0 group-hover:text-white/100 transition-all font-mono text-xs tracking-[0.24em]">
                AGRANDIR
              </span>
            </div>
            {/* Bordure au survol */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 border border-[#ed8936]/30 rounded-lg" />
              <div className="absolute inset-0 border border-[#ed8936]/10 rounded-lg blur-[2px]" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedIdx(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            onClick={() => setSelectedIdx(null)}
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            className="relative w-full max-w-4xl aspect-auto max-h-[80vh]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIdx].url}
              alt={images[selectedIdx].alt || `Détail ${selectedIdx + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <button
              onClick={() => setSelectedIdx((selectedIdx - 1 + images.length) % images.length)}
              className="p-2 rounded-full border border-white/20 hover:border-[#ed8936] transition-colors"
              aria-label="Précédent"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="flex items-center text-white/60 font-mono text-xs">
              {selectedIdx + 1} / {images.length}
            </span>
            <button
              onClick={() => setSelectedIdx((selectedIdx + 1) % images.length)}
              className="p-2 rounded-full border border-white/20 hover:border-[#ed8936] transition-colors"
              aria-label="Suivant"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
