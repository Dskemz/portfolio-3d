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
}

/**
 * Le visuel large (la pieuvre) est isolé en tête pour mettre en valeur son
 * format panoramique, suivi des créations au format portrait dans une grille
 * de 3. Chaque image est en object-contain pour rester visible dans son
 * intégralité, sur un fond sombre homogène avec les autres études de cas.
 */
const FEATURE: Creation = {
  id: 0,
  titre: 'La pieuvre jongleuse',
  legende: 'Huit bras, huit couleurs',
  image: '/images/projets/creation-originales/Poulpe.jpg',
};

const CREATIONS: Creation[] = [
  {
    id: 1,
    titre: 'Bain moussant',
    legende: 'Un personnage au chaud dans sa tasse',
    image: '/images/projets/creation-originales/teatime.jpg',
  },
  {
    id: 2,
    titre: 'Ballons cœur',
    legende: 'Le petit astronaute s\'envole',
    image: '/images/projets/creation-originales/astronaute.jpg',
  },
  {
    id: 3,
    titre: 'Licorne donut',
    legende: 'Flottaison sucrée',
    image: '/images/projets/creation-originales/licorne.jpg',
  },
];

export default function ScenesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
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
      gsap.from(featureRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featureRef.current,
          start: 'top 82%',
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
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="max-w-2xl mb-14 lg:mb-16">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-[0.3em] mb-5">
            02, Mises en scène et personnages
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
            Des créations originales,
            <br />
            un rendu net et pop.
          </h2>
          <p className="mt-5 text-base text-neutral-400 font-light leading-relaxed">
            Chaque scène joue sur un fond uni pastel pour laisser la 3D léchée
            occuper toute la lumière.
          </p>
        </div>

        {/* Visuel large panoramique */}
        <div ref={featureRef} className="mb-10 lg:mb-14">
          <div className="group relative w-full aspect-[16/9] overflow-hidden rounded-3xl bg-slate-800">
            <img
              src={FEATURE.image}
              alt={FEATURE.titre}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-4 text-base md:text-lg font-light text-white">
            {FEATURE.titre}
          </h3>
          <p className="text-sm text-neutral-400 font-light mt-0.5">
            {FEATURE.legende}
          </p>
        </div>

        {/* Créations au format portrait */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CREATIONS.map((c, idx) => (
            <div
              key={c.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group"
            >
              <div className="relative w-full aspect-[7/8] overflow-hidden rounded-3xl bg-slate-800 mb-4">
                <img
                  src={c.image}
                  alt={c.titre}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base md:text-lg font-light text-white">
                {c.titre}
              </h3>
              <p className="text-sm text-neutral-400 font-light mt-0.5">
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
