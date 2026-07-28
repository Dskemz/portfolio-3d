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
    bottleImage: '',
    labelImage: '',
  },
  {
    year: 2021,
    bottleImage: '',
    labelImage: '',
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
      className="w-full py-16 md:py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-amber-50 to-stone-100"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-4">
            Une Identité Visuelle Déclinée
          </h2>
          <p className="text-sm md:text-base text-slate-700 font-light max-w-3xl mx-auto">
            Accompagnement global sur plusieurs années (2013-2021) : modélisation rigoureuse des étiquettes et des textures (variations or et argent) pour assurer une identité visuelle pérenne.
          </p>
        </div>

        {/* Bottles Grid - 2 items max */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
          {BOTTLES_DATA.map((item, idx) => (
            <div
              key={item.year}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex flex-col items-center gap-6 group"
            >
              {/* Bottle Image */}
              <div className="relative w-full aspect-[2/5] overflow-hidden rounded-lg bg-white border border-stone-200">
                <div className="w-full h-full bg-white flex items-center justify-center">
                  {item.bottleImage ? (
                    <img
                      src={item.bottleImage}
                      alt={`Château La Commanderie ${item.year}`}
                      className="w-auto h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-stone-300 text-sm">Bouteille {item.year}</div>
                  )}
                </div>
                {/* Soft Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />
              </div>

              {/* Label Image */}
              <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-white border border-stone-200">
                <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                  {item.labelImage ? (
                    <img
                      src={item.labelImage}
                      alt={`Étiquette ${item.year}`}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-stone-300 text-sm">Étiquette {item.year}</div>
                  )}
                </div>
              </div>

              {/* Year Label */}
              <p className="text-center text-sm md:text-base font-light text-slate-700 tracking-wide">
                Millésime {item.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
