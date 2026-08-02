'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VueTechnique {
  id: string;
  titre: string;
  legende: string;
  image: string;
}

const VUES_TECHNIQUES: VueTechnique[] = [
  {
    id: 'trois-quarts',
    titre: 'Vue trois-quarts',
    legende: 'Silhouette générale, équilibre des masses',
    image: '/images/projets/velyv-elo/02-vue-3-4.jpg',
  },
  {
    id: 'selle',
    titre: 'Selle & Assise',
    legende: 'Ergonomie du poste de conduite, confort longue durée',
    image: '/images/projets/velyv-elo/03-vue-selle.jpg',
  },
  {
    id: 'porte-bagages',
    titre: 'Porte-bagages arrière',
    legende: 'Structure de fixation pour caisson de livraison',
    image: '/images/projets/velyv-elo/04-vue-porte-bagages.jpg',
  },
];

export default function InnovationSection() {
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
      className="w-full py-8 md:py-12 gouttiere bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Innovation
            <br />
            <span className="text-slate-400">Fondations &amp; confort</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Le projet VélyVélo repose sur la <span className="text-white">création d&apos;une structure
            arrière spécifique</span>, conçue pour accueillir simultanément une selle ergonomique
            et un caisson de livraison. Un compromis technique qui préserve le confort du livreur
            tout en libérant un volume de chargement conséquent.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            L&apos;autonomie de la batterie, l&apos;équilibre des masses et la finesse des lignes
            ont guidé chaque choix de modélisation, un vélo pensé pour de longues journées
            en milieu urbain, avec une identité visuelle forte et un vocabulaire industriel maîtrisé.
          </p>
        </div>

        {/* Grille aérée des vues techniques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {VUES_TECHNIQUES.map((vue, idx) => (
            <div
              key={vue.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                <img
                  src={vue.image}
                  alt={vue.titre}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Glow subtil */}
                <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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

        {/* Key specs */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Autonomie
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">80 km</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Volume caisson
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">85 L</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Vitesse max
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">25 km/h</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Charge utile
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">30 kg</p>
          </div>
        </div>
      </div>
    </section>
  );
}
