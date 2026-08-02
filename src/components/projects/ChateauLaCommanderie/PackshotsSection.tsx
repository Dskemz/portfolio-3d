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
  { id: 1, variant: 'Rouge Classique', description: 'Appellation Contrôlée', image: '/images/projets/agences-georges/12-packshot-1.jpg' },
  { id: 2, variant: 'Blanc Prestige', description: 'Cuvée Limitée', image: '/images/projets/agences-georges/13-packshot-2.jpg' },
  { id: 3, variant: 'Rosé Délicat', description: 'Été 2021', image: '/images/projets/agences-georges/14-packshot-3.jpg' },
  { id: 4, variant: 'Mousseux Festif', description: 'Édition Spéciale', image: '/images/projets/agences-georges/15-packshot-4.jpg' },
];

export default function PackshotsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      className="w-full py-16 gouttiere bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Packshots Commerciaux
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto">
            Déclinaisons standardisées de la gamme prêtes pour l&apos;e-commerce et
            les catalogues print.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {PACKSHOTS_DATA.map((packshot, idx) => (
            <div
              key={packshot.id}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-slate-800 mb-4">
                <img
                  src={packshot.image}
                  alt={packshot.variant}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm md:text-base font-light text-white">
                {packshot.variant}
              </h3>
              <p className="text-xs text-slate-400 font-light uppercase tracking-wide mt-1">
                {packshot.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '4K', label: 'Résolution' },
              { value: 'PNG 32-bit', label: 'Format' },
              { value: 'sRGB', label: 'Profil' },
              { value: 'Web & Print', label: 'Usage' },
            ].map((spec) => (
              <div key={spec.label}>
                <p className="text-lg md:text-xl font-light text-white">{spec.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{spec.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
