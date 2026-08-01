'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Macro {
  id: number;
  titre: string;
  legende: string;
  image: string;
  className: string;
}

// Composition asymétrique : une macro maîtresse à gauche, le reste en mosaïque.
const MACROS: Macro[] = [
  {
    id: 1,
    titre: 'Boucle ardillon',
    legende: 'Boucle déployante métal brossé',
    image: '/images/projets/withings/05-boucle.jpg',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    titre: 'Cuir piqué',
    legende: 'Couture sellier apparente',
    image: '/images/projets/withings/06-couture.jpg',
    className: '',
  },
  {
    id: 3,
    titre: 'Tissage',
    legende: 'Bracelet tissu technique',
    image: '/images/projets/withings/07-tissage.jpg',
    className: '',
  },
  {
    id: 4,
    titre: 'Sablage',
    legende: 'Fond de boîtier gravé',
    image: '/images/projets/withings/08-sablage.jpg',
    className: '',
  },
  {
    id: 5,
    titre: 'Silicone',
    legende: 'Grain mat sport',
    image: '/images/projets/withings/09-silicone.jpg',
    className: '',
  },
];

export default function MatieresSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const macrosRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(macrosRef.current, {
        opacity: 0,
        scale: 0.96,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: macrosRef.current[0],
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Bloc texte, création des éléments industriels et textures */}
        <div ref={textRef} className="mb-14 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5">
            Du gris industriel aux textures organiques
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
            La plupart des éléments industriels sont créés à partir de valeurs de
            gris. Les autres, cuirs piqués, coutures, boucles ardillons ou fond
            de boîtier gravé avec ses capteurs, nécessitent des textures
            spécifiques travaillées en macro.
          </p>
        </div>

        {/* Composition en macro-détails, mise en valeur du grain */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[200px] gap-4 md:gap-6">
          {MACROS.map((macro, idx) => (
            <div
              key={macro.id}
              ref={(el) => { macrosRef.current[idx] = el; }}
              className={`group relative overflow-hidden rounded-lg bg-slate-800 ${macro.className}`}
            >
              <img
                src={macro.image}
                alt={macro.titre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-sm font-light text-white">{macro.titre}</p>
                <p className="text-xs text-slate-300 font-light mt-0.5">
                  {macro.legende}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
