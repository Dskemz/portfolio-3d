'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MacroItem {
  image: string;
  label: string;
  span: string;
}

const MACROS: MacroItem[] = [
  { image: '/images/projets/summum-3d/07-macro-cuir.jpg', label: 'Cuir patiné', span: 'col-span-2 row-span-2' },
  { image: '/images/projets/summum-3d/08-macro-graffiti.jpg', label: 'Graffiti mural', span: 'col-span-1 row-span-1' },
  { image: '/images/projets/summum-3d/09-macro-plis.jpg', label: 'Plis complexes', span: 'col-span-1 row-span-1' },
  { image: '/images/projets/summum-3d/10-macro-detail.jpg', label: 'Micro-détails', span: 'col-span-2 row-span-1' },
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
        scale: 0.95,
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Focus Matières & Détails
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
            Gros plans prouvant que l&apos;optimisation n&apos;altère pas la fidélité
            des textures d&apos;origine.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4"
        >
          {MACROS.map((macro) => (
            <div
              key={macro.label}
              className={`${macro.span} relative overflow-hidden rounded-lg bg-slate-800 group`}
            >
              <img
                src={macro.image}
                alt={macro.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-3 text-xs md:text-sm font-light text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {macro.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
