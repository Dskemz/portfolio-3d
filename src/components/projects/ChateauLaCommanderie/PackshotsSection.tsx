'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { getImageUrl } from '@/lib/imageResolver';
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
    image: '/images/projets/agences-georges/12-packshot-1.svg',
  },
  {
    id: 2,
    variant: 'Blanc Prestige',
    description: 'Cuvée Limitée',
    image: '/images/projets/agences-georges/13-packshot-2.svg',
  },
  {
    id: 3,
    variant: 'Rosé Délicat',
    description: 'Été 2021',
    image: '/images/projets/agences-georges/14-packshot-3.svg',
  },
  {
    id: 4,
    variant: 'Mousseux Festif',
    description: 'Édition Spéciale',
    image: '/images/projets/agences-georges/15-packshot-4.svg',
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Packshots Commerciaux
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto">
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
              <div className="w-full mb-6 bg-gradient-to-b from-slate-800 via-slate-900 to-black rounded-xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden relative">
                {/* Subtle grid background */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Bottle Image Placeholder */}
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
                <h3 className="text-lg md:text-xl font-light text-white">
                  {packshot.variant}
                </h3>
                <p className="text-sm text-slate-400 font-light uppercase tracking-wide">
                  {packshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-24 pt-20 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-light text-slate-400 uppercase tracking-wider mb-2">
                Résolution
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                4K - 4096x6144px
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-400 uppercase tracking-wider mb-2">
                Format
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                PNG 32-bit + Alpha
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-400 uppercase tracking-wider mb-2">
                Profondeur Couleur
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                sRGB / Adobe RGB
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-slate-400 uppercase tracking-wider mb-2">
                Utilisation
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                Web & Print
              </p>
            </div>
          </div>

          {/* Formats Section */}
          <div className="mt-16 space-y-4">
            <h4 className="text-xl md:text-2xl font-light text-white">
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
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-sm md:text-base text-slate-300 font-light">
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
