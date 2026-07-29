'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MacroItem {
  image: string;
  label: string;
  span: string; // tailwind col-span
}

const MACROS: MacroItem[] = [
  {
    image: '/images/projets/summum-3d/07-macro-cuir.svg',
    label: 'Cuir patiné',
    span: 'col-span-2 row-span-2',
  },
  {
    image: '/images/projets/summum-3d/08-macro-graffiti.svg',
    label: 'Graffiti mural',
    span: 'col-span-1 row-span-1',
  },
  {
    image: '/images/projets/summum-3d/09-macro-plis.svg',
    label: 'Plis complexes',
    span: 'col-span-1 row-span-1',
  },
  {
    image: '/images/projets/summum-3d/10-macro-detail.svg',
    label: 'Micro-détails',
    span: 'col-span-2 row-span-1',
  },
];

export default function FocusMatiereSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.children;
      if (!items) return;
      gsap.from(Array.from(items), {
        opacity: 0,
        scale: 0.96,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-neutral-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4">
              04 — Matières
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-white leading-snug">
              Qualité intacte,
              <br />
              poids divisé
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-light max-w-xs leading-relaxed md:text-right">
            Gros plans prouvant que l&apos;optimisation n&apos;altère pas la fidélité
            des textures d&apos;origine.
          </p>
        </div>

        {/* Masonry-like grid: 4 cols, varied spans */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-2 md:gap-3"
        >
          {MACROS.map((macro) => (
            <div
              key={macro.label}
              className={`${macro.span} relative overflow-hidden rounded-sm bg-neutral-900 group`}
            >
              <img
                src={macro.image}
                alt={macro.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Label on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-3 text-[10px] md:text-xs font-mono uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {macro.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
