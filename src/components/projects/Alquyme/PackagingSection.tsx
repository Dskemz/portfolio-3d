'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Vue {
  id: string;
  titre: string;
  legende: string;
  image: string;
}

const VUES: Vue[] = [
  {
    id: 'sablier',
    titre: 'Flacon sablier vertical',
    legende: 'Silhouette signature, deux récipients en dualité',
    image: '/images/projets/alquyme/02-sablier.jpg',
  },
  {
    id: 'reflets',
    titre: 'Reflets dorés',
    legende: 'La lumière glisse sur les bagues métalliques et se prend dans les gravures',
    image: '/images/projets/alquyme/03-reflets.jpg',
  },
  {
    id: 'support',
    titre: 'Mise en scène sur drapé',
    legende: 'Support texturé rouge profond, écho des rituels précieux',
    image: '/images/projets/alquyme/04-drape.jpg',
  },
];

export default function PackagingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Packaging &amp; écrin
            <br />
            <span className="text-slate-400">Fondations &amp; lumière</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Création d&apos;un <span className="text-white">packaging et de rituels</span> mettant
            en scène le parfum ALQUYME. Le flacon se compose de <span className="text-white">deux
            récipients</span> en dualité, dessinant une silhouette de sablier vertical
            reconnaissable, chaque volume porte sa propre ambiance olfactive.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Aussi puissante qu&apos;une odeur, la <span className="text-white">lumière qui se
            reflète</span> dans les surfaces transparentes et les bagues métalliques
            raconte une histoire. Le rendu 3D capture ces jeux de matière : verre, or,
            texture du support, chaque plan est composé comme une nature morte contemporaine.
          </p>
        </div>

        {/* Grille aérée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {VUES.map((vue, idx) => (
            <div
              key={vue.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                <img
                  src={vue.image}
                  alt={vue.titre}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Golden glow */}
                <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Label */}
              <div>
                <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                  {vue.titre}
                </h3>
                <p className="text-sm text-slate-400 font-light italic">
                  {vue.legende}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Métriques du projet */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Volumes flacon
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">2×50 ml</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Éditions
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">6</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Matériaux
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">Verre / Or</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Rendus finaux
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">24</p>
          </div>
        </div>
      </div>
    </section>
  );
}
