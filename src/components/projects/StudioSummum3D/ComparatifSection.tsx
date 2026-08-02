'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ComparisonPair {
  left: { image: string; label: string };
  right: { image: string; label: string };
  caption: string;
}

const PAIRS: ComparisonPair[] = [
  {
    left: { image: '/images/projets/summum-3d/03-scan-brut.jpg', label: 'Maillage High-poly vs Low-poly' },
    right: { image: '/images/projets/summum-3d/04-maillage-clean.jpg', label: 'Maillage nettoyé' },
    caption: 'Suppression des artefacts de reconstruction et retopologie manuelle.',
  },
  {
    left: { image: '/images/projets/summum-3d/05-highpoly-wire.jpg', label: 'High-poly wireframe' },
    right: { image: '/images/projets/summum-3d/06-lowpoly-texture.jpg', label: 'Low-poly texturé' },
    caption: 'Baking des détails du high-poly vers le maillage optimisé via normal + AO maps.',
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
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pair,
            start: 'top 65%',
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Comparatif Scan · Maillage · Texture
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
            Comparaison directe entre les données brutes issues de la capture et
            le résultat après nettoyage, retopologie et re-projection des
            textures.
          </p>
        </div>

        <div className="space-y-16 md:space-y-20">
          {PAIRS.map((pair, idx) => (
            <div
              key={idx}
              ref={(el) => { pairsRef.current[idx] = el; }}
            >
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-800 group">
                  <img
                    src={pair.left.image}
                    alt={pair.left.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs md:text-sm font-light text-white">
                    {pair.left.label}
                  </span>
                </div>

                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-800 group">
                  <img
                    src={pair.right.image}
                    alt={pair.right.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-3 text-xs md:text-sm font-light text-white">
                    {pair.right.label}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400 font-light max-w-lg">
                {pair.caption}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-white">
              Nettoyage & Reconstruction
            </h3>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Suppression manuelle des artefacts, reconstruction des zones
              occluses et re-projection propre des textures haute résolution.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-white">
              Cartes de Textures Optimisées
            </h3>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Baking des maps (albedo, normal, roughness, AO) et compression
              adaptée à un rendu temps réel fidèle à l&apos;original.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
