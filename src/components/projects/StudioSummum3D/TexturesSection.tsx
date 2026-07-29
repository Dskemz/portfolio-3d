'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TexturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left image: subtle parallax
      gsap.to(leftImageRef.current, {
        y: -30,
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'center 20%',
          scrub: 0.5,
          toggleActions: 'play none none reverse',
        },
      });

      // Right image: opposite direction parallax
      gsap.to(rightImageRef.current, {
        y: 30,
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'center 20%',
          scrub: 0.5,
          toggleActions: 'play none none reverse',
        },
      });

      // Initial state
      gsap.set([leftImageRef.current, rightImageRef.current], {
        opacity: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Du Scan Brut au Modèle Sublimé
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
            Traitement des données issues de la photogrammétrie : nettoyage des
            artefacts, reconstruction et optimisation des cartes de textures.
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Image - Larger */}
          <div
            ref={leftImageRef}
            className="md:col-span-2 overflow-hidden rounded-xl bg-slate-800"
          >
            <div className="relative aspect-video md:aspect-auto md:h-80 overflow-hidden group bg-slate-700">
              <img
                src="/images/projets/summum-3d/06-textures-macro-1.svg"
                alt="Zoom sur la matière et les textures d'une œuvre numérisée"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-sm md:text-base font-light">
                  Détail macro d'une texture reconstruite à partir du scan photogrammétrique
                </p>
              </div>
            </div>
          </div>

          {/* Right Image - Smaller */}
          <div
            ref={rightImageRef}
            className="md:col-span-1 overflow-hidden rounded-xl bg-slate-800"
          >
            <div className="relative aspect-square md:aspect-auto md:h-80 overflow-hidden group bg-slate-700">
              <img
                src="/images/projets/summum-3d/07-textures-macro-2.svg"
                alt="Zone nettoyée après traitement photogrammétrique"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs md:text-sm font-light">
                  Zone nettoyée après suppression des artefacts de scan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
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
              adaptée à un rendu temps réel fidèle à l'original.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
