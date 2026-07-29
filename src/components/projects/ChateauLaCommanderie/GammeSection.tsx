'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BottleItem {
  year: number;
  bottleImage: string;
  labelImage: string;
}

const BOTTLES_DATA: BottleItem[] = [
  {
    year: 2013,
    bottleImage: '/images/projets/agences-georges/02-gamme-bottle-1.jpg',
    labelImage: '/images/projets/agences-georges/03-gamme-label-1.jpg',
  },
  {
    year: 2021,
    bottleImage: '/images/projets/agences-georges/04-gamme-bottle-2.jpg',
    labelImage: '/images/projets/agences-georges/05-gamme-label-2.jpg',
  },
];

export default function GammeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.8,
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Une Identité Visuelle Déclinée
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto">
            Modélisation rigoureuse des étiquettes et des textures sur plusieurs
            millésimes pour assurer une identité visuelle pérenne.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-16 max-w-4xl mx-auto">
          {BOTTLES_DATA.map((item, idx) => (
            <div
              key={item.year}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex flex-col items-center gap-4 md:gap-6 group"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={item.bottleImage}
                  alt={`Château La Commanderie ${item.year}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={item.labelImage}
                  alt={`Étiquette ${item.year}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <p className="text-center text-sm md:text-base font-light text-slate-400 tracking-wide">
                Millésime {item.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
