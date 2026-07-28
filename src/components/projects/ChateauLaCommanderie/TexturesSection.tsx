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
      className="w-full py-24 px-6 md:px-12 lg:px-20 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-20 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Maîtrise des Textures & du Photoralisme
          </h2>
          <p className="text-base md:text-lg text-slate-600 font-light leading-relaxed">
            Travail minutieux sur les shaders (rugosité du verre, imperfections,
            relief des capsules) pour gommer l'effet "trop propre" de la 3D.
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Image - Larger */}
          <div
            ref={leftImageRef}
            className="md:col-span-2 overflow-hidden rounded-xl bg-neutral-100"
          >
            <div className="relative aspect-video md:aspect-[4/3] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1516594798972-b7e95dd33c58?w=1200&h=800&fit=crop"
                alt="Zoom sur bouchon liège et capsule étain"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-sm md:text-base font-light">
                  Zoom sur le bouchon en liège avec subsurface scattering et
                  capsule en étain gravée
                </p>
              </div>
            </div>
          </div>

          {/* Right Image - Smaller */}
          <div
            ref={rightImageRef}
            className="md:col-span-1 overflow-hidden rounded-xl bg-neutral-100"
          >
            <div className="relative aspect-square overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2e3bb6?w=600&h=600&fit=crop"
                alt="Étiquette papier texturé et dorure"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs md:text-sm font-light">
                  Étiquette papier texturé, dorure à chaud et réfraction lumière
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-slate-900">
              Subsurface Scattering & Matériaux Organiques
            </h3>
            <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
              Le liège, matériau naturel, requiert un rendu spécifique avec
              diffusion de la lumière interne pour simuler la translucidité.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-slate-900">
              Rugosité & Imperfections
            </h3>
            <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
              Ajout de micro-rayures et variations de normales map pour éviter
              l'aspect hyper-lissé typique des rendus 3D.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
