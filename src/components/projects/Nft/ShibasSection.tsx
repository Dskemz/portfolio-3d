'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images génériques présentes dans le repo, utilisées en repli tant que les
// visuels définitifs ne sont pas encore déposés. Dès qu'un fichier au bon nom
// existe, il s'affiche automatiquement à la place.
const FALLBACKS = [
  '/images/projets/nft-floofies/02-character.jpg',
  '/images/projets/nft-floofies/03-environment.jpg',
  '/images/projets/nft-floofies/04-detail-1.jpg',
  '/images/projets/nft-floofies/05-detail-2.jpg',
];
const fallbackFor = (idx: number) => FALLBACKS[idx % FALLBACKS.length];
const handleImgError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  idx: number,
) => {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = fallbackFor(idx);
};

interface ShibaBase {
  id: string;
  nom: string;
  variante: string;
  image: string;
}

const SHIBAS_BASE: ShibaBase[] = [
  {
    id: 'jaune',
    nom: 'Shiba Jaune',
    variante: 'Base commune, pelage doré',
    image: '/images/projets/nft-floofies/02-shiba-jaune.jpg',
  },
  {
    id: 'blanc',
    nom: 'Shiba Blanc',
    variante: 'Base commune, pelage neige',
    image: '/images/projets/nft-floofies/03-shiba-blanc.jpg',
  },
  {
    id: 'poils',
    nom: 'Shiba Poilu',
    variante: 'Base commune, fourrure longue',
    image: '/images/projets/nft-floofies/04-shiba-poils.jpg',
  },
];

export default function ShibasSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

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
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Les shibas
            <br />
            <span className="text-slate-400">Fondations &amp; base commune</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            La collection repose sur une <span className="text-white">base morphologique commune</span>, 
            un shiba stylisé aux proportions cartoon, décliné en trois grandes familles de pelage. 
            Ces fondations garantissent la cohérence de l&apos;ensemble tout en offrant des variations 
            graphiques immédiatement reconnaissables.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Chaque base sert de socle aux couches suivantes : accessoires, vêtements, casques, 
            armes, permettant la génération de milliers de combinaisons uniques.
          </p>
        </div>

        {/* Shiba Cards - Grille aérée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {SHIBAS_BASE.map((shiba, idx) => (
            <div
              key={shiba.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group flex flex-col items-center"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-cyan-500/50 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                <img
                  src={shiba.image}
                  alt={shiba.nom}
                  className="w-full h-full object-contain object-center p-6 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => handleImgError(e, idx)}
                />
                {/* Radial glow on hover */}
                <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                  {shiba.nom}
                </h3>
                <p className="text-sm text-slate-400 font-light italic">
                  {shiba.variante}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
