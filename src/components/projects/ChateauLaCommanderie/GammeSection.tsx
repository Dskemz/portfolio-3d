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
    bottleImage:
      'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=300&h=600&fit=crop',
    labelImage:
      'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=400&h=300&fit=crop',
  },
  {
    year: 2021,
    bottleImage:
      'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=300&h=600&fit=crop',
    labelImage:
      'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=400&h=300&fit=crop',
  },
];

export default function GammeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation on items
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
      className="w-full py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Une Évolution Cohérente de la Gamme
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Modélisation rigoureuse des étiquettes et des textures sur plusieurs
            millésimes pour assurer une identité visuelle pérenne.
          </p>
        </div>

        {/* Bottles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
          {BOTTLES_DATA.map((item, idx) => (
            <div
              key={item.year}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex flex-col items-center gap-6 group"
            >
              {/* Bottle Image */}
              <div className="relative w-full h-[46vh] max-h-[460px] overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={item.bottleImage}
                  alt={`Château La Commanderie ${item.year}`}
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Soft Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>

              {/* Label Image */}
              <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                <img
                  src={item.labelImage}
                  alt={`Étiquette ${item.year}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Year Label */}
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
