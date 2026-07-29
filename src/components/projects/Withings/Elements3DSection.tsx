'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Declinaison {
  id: number;
  taille: string;
  legende: string;
  image: string;
}

const DECLINAISONS: Declinaison[] = [
  { id: 1, taille: '37 mm', legende: 'ScanWatch Light', image: '/images/projets/withings/02b-face-38.jpg' },
  { id: 2, taille: '38 mm', legende: 'ScanWatch 2', image: '/images/projets/withings/02c-face-42.jpg' },
  { id: 3, taille: '42 mm', legende: 'ScanWatch Nova', image: '/images/projets/withings/02d-face-43.jpg' },
  { id: 4, taille: '43 mm', legende: 'Édition Acier', image: '/images/projets/withings/03-3quart.jpg' },
];

export default function Elements3DSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<(HTMLDivElement | null)[]>([]);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(explodedRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: explodedRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(gridRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current[0],
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(focusRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: focusRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Bloc texte asymétrique — aligné à gauche, sur 2 colonnes décalées */}
        <div
          ref={textRef}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-16 mb-16 lg:mb-20"
        >
          <div className="lg:pt-4">
            <p className="text-xs font-light text-slate-500 uppercase tracking-[0.3em] mb-5">
              01 — Éléments 3D
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
              Une gamme entière,
              <br />
              modélisée pièce par pièce
            </h2>
          </div>
          <div className="lg:pt-16 space-y-4 max-w-lg">
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Modélisation des boîtiers 37 mm, 38 mm, 42 mm et 43 mm de la gamme
              ScanWatch 2, avec déclinaisons de cadrans, soleillage et sablage.
            </p>
            <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
              Modélisation des bracelets cuir, métal, tissu et silicone pour
              chaque taille de boîtier, afin de couvrir l&apos;intégralité des
              références du catalogue.
            </p>
          </div>
        </div>

        {/* Grande vue éclatée */}
        <div
          ref={explodedRef}
          className="w-full aspect-[21/9] overflow-hidden rounded-lg bg-slate-800 mb-6 lg:mb-8 group"
        >
          <img
            src="/images/projets/withings/11-eclate.jpg"
            alt="Vue éclatée de la ScanWatch — boîtier, capteurs et bracelet"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Grille de 4 déclinaisons de modèles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 lg:mb-20">
          {DECLINAISONS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => { gridRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-800 mb-3">
                <img
                  src={item.image}
                  alt={`Déclinaison ${item.taille}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm md:text-base font-light text-white">
                {item.taille}
              </p>
              <p className="text-xs text-slate-400 font-light uppercase tracking-wide mt-0.5">
                {item.legende}
              </p>
            </div>
          ))}
        </div>

        {/* Focus grand format sur un cadran (ex. cadran vert soleillé) */}
        <div
          ref={focusRef}
          className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-slate-800 group"
        >
          <img
            src="/images/projets/withings/12-cadran-vert.jpg"
            alt="Focus sur le cadran vert soleillé"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-light text-white">
              Cadran vert soleillé
            </h3>
            <p className="text-sm text-slate-300 font-light mt-2 max-w-md">
              Effet soleillé obtenu par un travail précis des micro-rainures et
              du soleillage pour capter la lumière selon l&apos;angle de vue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
