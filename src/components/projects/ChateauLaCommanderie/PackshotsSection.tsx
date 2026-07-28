'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Packshot {
  id: number;
  variant: string;
  description: string;
  image: string;
}

const PACKSHOTS_DATA: Packshot[] = [
  {
    id: 1,
    variant: 'Rouge Classique',
    description: 'Appellation Contrôlée',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2e3bb6?w=400&h=600&fit=crop',
  },
  {
    id: 2,
    variant: 'Blanc Prestige',
    description: 'Cuvée Limitée',
    image:
      'https://images.unsplash.com/photo-1516594798972-b7e95dd33c58?w=400&h=600&fit=crop',
  },
  {
    id: 3,
    variant: 'Rosé Délicat',
    description: 'Été 2021',
    image:
      'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=400&h=600&fit=crop',
  },
  {
    id: 4,
    variant: 'Mousseux Festif',
    description: 'Édition Spéciale',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=600&fit=crop',
  },
];

export default function PackshotsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation
      gsap.from(itemsRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
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
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Packshots Commerciaux
          </h2>
          <p className="text-base md:text-lg text-slate-600 font-light max-w-2xl mx-auto">
            Déclinaisons standardisées de la gamme prêtes pour l'e-commerce et
            les catalogues print.
          </p>
        </div>

        {/* Packshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {PACKSHOTS_DATA.map((packshot, idx) => (
            <div
              key={packshot.id}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="group flex flex-col items-center text-center"
            >
              {/* Studio Background - Soft Shadow */}
              <div className="w-full mb-6 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden relative">
                {/* Subtle grid background */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Bottle Image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src={packshot.image}
                    alt={packshot.variant}
                    className="h-full w-auto max-h-96 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Studio Light Effect */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-16 bg-gradient-radial from-black/10 to-transparent blur-3xl pointer-events-none" />
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-light text-slate-900">
                  {packshot.variant}
                </h3>
                <p className="text-sm text-slate-500 font-light uppercase tracking-wide">
                  {packshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-24 pt-20 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-light text-slate-600 uppercase tracking-wider mb-2">
                Résolution
              </h4>
              <p className="text-lg md:text-xl font-light text-slate-900">
                4K - 4096x6144px
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-600 uppercase tracking-wider mb-2">
                Format
              </h4>
              <p className="text-lg md:text-xl font-light text-slate-900">
                PNG 32-bit + Alpha
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-600 uppercase tracking-wider mb-2">
                Profondeur Couleur
              </h4>
              <p className="text-lg md:text-xl font-light text-slate-900">
                sRGB / Adobe RGB
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-600 uppercase tracking-wider mb-2">
                Utilisation
              </h4>
              <p className="text-lg md:text-xl font-light text-slate-900">
                Web & Print
              </p>
            </div>
          </div>

          {/* Formats Section */}
          <div className="mt-16 space-y-4">
            <h4 className="text-xl md:text-2xl font-light text-slate-900">
              Déclinaisons Disponibles
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Fond blanc pur',
                'Fond transparent',
                'Lifestyle context',
                'Close-up détail',
                'Vue trois-quarts',
                'Avec étiquette détachée',
              ].map((format, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="text-sm md:text-base text-slate-600 font-light">
                    {format}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
