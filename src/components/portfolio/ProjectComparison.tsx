'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectComparisonProps {
  wireframeUrl: string;
  wireframeLabel: string;
  finalUrl: string;
  finalLabel: string;
}

export function ProjectComparison({
  wireframeUrl,
  wireframeLabel,
  finalUrl,
  finalLabel,
}: ProjectComparisonProps) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newPos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, newPos)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const newPos = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, newPos)));
  };

  return (
    <motion.section
      className="space-y-8 border-t border-mine pt-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="font-display text-2xl leading-tight">Du Concept au Rendu</h2>

      {/* Slider comparatif */}
      <div
        className="relative overflow-hidden rounded-lg bg-graphite-900 aspect-video cursor-col-resize select-none group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {}}
        onTouchMove={handleTouchMove}
      >
        {/* Image finale (arrière) */}
        <div className="absolute inset-0">
          <Image
            src={finalUrl}
            alt={finalLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
          />
        </div>

        {/* Image wireframe (avant, clippée) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative h-full w-full" style={{ width: `${100 / (sliderPos / 100)}%` }}>
            <Image
              src={wireframeUrl}
              alt={wireframeLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Slider handle */}
        <div
          className="absolute inset-y-0 w-1 bg-[#ed8936]/60 transition-colors group-hover:bg-[#ed8936]"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          {/* Circles at top and bottom */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-5 bg-[#ed8936] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Labels */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="flex-1 flex items-center justify-start p-6">
            <span className="font-mono text-xs tracking-[0.24em] text-white/80 bg-black/40 px-3 py-1 rounded">
              {wireframeLabel}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-end p-6">
            <span className="font-mono text-xs tracking-[0.24em] text-white/80 bg-black/40 px-3 py-1 rounded">
              {finalLabel}
            </span>
          </div>
        </div>

        {/* Émission du slider */}
        <div
          className="absolute inset-y-0 w-1 pointer-events-none"
          style={{
            left: `${sliderPos}%`,
            transform: 'translateX(-50%)',
            boxShadow: '0 0 12px rgba(237, 137, 54, 0.4)',
          }}
        />
      </div>

      <p className="text-xs text-trait font-mono tracking-[0.24em]">GLISSEZ POUR COMPARER</p>
    </motion.section>
  );
}
