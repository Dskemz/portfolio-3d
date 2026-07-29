'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { getImageUrl } from '@/lib/imageResolver';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ComparisonPair {
  left: { image: string; label: string };
  right: { image: string; label: string };
  caption: string;
}

const PAIRS: ComparisonPair[] = [
  {
    left: {
      image: '/images/projets/summum-3d/03-scan-brut.svg',
      label: 'Scan brut',
    },
    right: {
      image: '/images/projets/summum-3d/04-maillage-clean.svg',
      label: 'Maillage nettoyé',
    },
    caption:
      'Suppression des artefacts de reconstruction et retopologie manuelle.',
  },
  {
    left: {
      image: '/images/projets/summum-3d/05-highpoly-wire.svg',
      label: 'High-poly wireframe',
    },
    right: {
      image: '/images/projets/summum-3d/06-lowpoly-texture.svg',
      label: 'Low-poly texturé',
    },
    caption:
      'Baking des détails du high-poly vers le maillage optimisé via normal + AO maps.',
  },
];

export default function ComparatifSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pairsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      pairsRef.current.forEach((pair) => {
        if (!pair) return;
        gsap.from(pair, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pair,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-black to-neutral-950"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4">
            03 — Processus
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight text-white leading-snug max-w-xl">
            Scan · Maillage · Texture
          </h2>
          <p className="mt-4 text-sm md:text-base text-neutral-400 font-light max-w-xl leading-relaxed">
            Comparaison directe entre les données brutes issues de la capture et
            le résultat après nettoyage, retopologie et re-projection des
            textures.
          </p>
        </div>

        {/* Comparison pairs */}
        <div className="space-y-20 md:space-y-28">
          {PAIRS.map((pair, idx) => (
            <div
              key={idx}
              ref={(el) => { pairsRef.current[idx] = el; }}
              className="group"
            >
              {/* Side-by-side images */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {/* Left */}
                <div className="relative aspect-square overflow-hidden rounded-sm bg-neutral-900">
                  <img
                    src={pair.left.image}
                    alt={pair.left.label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] md:text-xs font-mono uppercase tracking-wider text-neutral-400 bg-black/70 px-2 py-1 rounded-sm">
                    {pair.left.label}
                  </span>
                </div>

                {/* Right */}
                <div className="relative aspect-square overflow-hidden rounded-sm bg-neutral-900">
                  <img
                    src={pair.right.image}
                    alt={pair.right.label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] md:text-xs font-mono uppercase tracking-wider text-neutral-400 bg-black/70 px-2 py-1 rounded-sm">
                    {pair.right.label}
                  </span>
                </div>
              </div>

              {/* Caption below pair */}
              <p className="mt-4 text-sm text-neutral-500 font-light max-w-lg">
                {pair.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
