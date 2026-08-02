'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ArtPiece {
  name: string;
  mainImage: string;
  detailImage: string;
}

const PIECES_DATA: ArtPiece[] = [
  {
    name: 'Veste texturée',
    mainImage: '/images/projets/summum-3d/02-piece-main-1.svg',
    detailImage: '/images/projets/summum-3d/03-piece-detail-1.svg',
  },
  {
    name: 'Œuvre emblématique',
    mainImage: '/images/projets/summum-3d/04-piece-main-2.svg',
    detailImage: '/images/projets/summum-3d/05-piece-detail-2.svg',
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
      className="w-full py-16 gouttiere bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Fidélité & Préservation des Détails
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto">
            Restitution minutieuse des textures complexes (textiles plissés,
            patines) pour figer l'œuvre dans le temps.
          </p>
        </div>

        {/* Pieces Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-12 max-w-3xl mx-auto">
          {PIECES_DATA.map((item, idx) => (
            <div
              key={item.name}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex flex-col items-center gap-6 group"
            >
              {/* Main Image */}
              <div className="relative w-full aspect-[9/16] overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Soft Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>

              {/* Detail Image */}
              <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                <img
                  src={item.detailImage}
                  alt={`Détail ${item.name}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Name Label */}
              <p className="text-center text-sm md:text-base font-light text-slate-400 tracking-wide">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
