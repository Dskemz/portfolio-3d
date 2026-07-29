'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Creation {
  id: number;
  titre: string;
  legende: string;
  image: string;
  fond: string;
  ratio: string;
}

/**
 * Chaque carte porte son propre fond pastel/pop pour faire ressortir l'aspect
 * 3D léché. Les images sont branchées sur les visuels réellement présents dans
 * /public/images/projets/creation-originales/ ; il suffit de déposer les
 * fichiers manquants (05-…, 06-…) pour compléter la grille sans toucher au code.
 */
const CREATIONS: Creation[] = [
  {
    id: 1,
    titre: 'La pieuvre jongleuse',
    legende: 'Huit bras, huit couleurs',
    image: '/images/projets/creation-originales/Poulpe.jpg',
    fond: 'from-teal-200 to-emerald-200',
    ratio: 'aspect-[16/9]',
  },
  {
    id: 2,
    titre: 'Bain moussant',
    legende: 'Un personnage au chaud dans sa tasse',
    image: '/images/projets/creation-originales/teatime.jpg',
    fond: 'from-sky-200 to-cyan-200',
    ratio: 'aspect-[4/3]',
  },
  {
    id: 3,
    titre: 'Ballons cœur',
    legende: 'Le petit astronaute s\'envole',
    image: '/images/projets/creation-originales/astronaute.jpg',
    fond: 'from-rose-200 to-fuchsia-200',
    ratio: 'aspect-[4/5]',
  },
  {
    id: 4,
    titre: 'Licorne donut',
    legende: 'Flottaison sucrée',
    image: '/images/projets/creation-originales/licorne.jpg',
    fond: 'from-violet-200 to-purple-200',
    ratio: 'aspect-[4/5]',
  },
];

export default function ScenesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#0a0f1d] to-[#121212]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="max-w-2xl mb-14 lg:mb-16">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-[0.3em] mb-5">
            02 — Mises en scène et personnages
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
            Des créations originales,
            <br />
            un rendu net et pop.
          </h2>
          <p className="mt-5 text-base text-neutral-500 font-light leading-relaxed">
            Chaque scène joue sur un fond uni pastel pour laisser la 3D léchée
            occuper toute la lumière.
          </p>
        </div>

        {/* Grille dynamique alternée — décalage vertical 1 carte sur 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CREATIONS.map((c, idx) => (
            <div
              key={c.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className={`group ${idx % 2 === 1 ? 'sm:mt-10 lg:mt-16' : ''}`}
            >
              <div
                className={`relative w-full ${c.ratio} overflow-hidden rounded-3xl bg-gradient-to-br ${c.fond} mb-4`}
              >
                <img
                  src={c.image}
                  alt={c.titre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base md:text-lg font-light text-white">
                {c.titre}
              </h3>
              <p className="text-sm text-white font-light mt-0.5">
                {c.legende}
              </p>
            </div>
          ))}
        </div>

        {/* Bandeau dégradé pop de clôture */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300 px-8 py-14 md:px-16 md:py-20 text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight drop-shadow-sm max-w-3xl mx-auto">
            Deux idées, une création. Et à chaque fois, une petite histoire à
            raconter.
          </h3>
        </div>
      </div>
    </section>
  );
}
