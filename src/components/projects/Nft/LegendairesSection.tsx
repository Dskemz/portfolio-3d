'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TeteVariante {
  id: string;
  nom: string;
  image: string;
}

interface LegendaireRendu {
  id: string;
  nom: string;
  description: string;
  image: string;
  edition: string;
}

const TETES_LEGENDAIRES: TeteVariante[] = [
  { id: 'tigre', nom: 'Tigre', image: '/images/projets/nft-floofies/19-legend-tete-tigre.jpg' },
  { id: 'leopard', nom: 'Léopard', image: '/images/projets/nft-floofies/20-legend-tete-leopard.jpg' },
  { id: 'panda', nom: 'Panda', image: '/images/projets/nft-floofies/21-legend-tete-panda.jpg' },
  { id: 'renard', nom: 'Renard doré', image: '/images/projets/nft-floofies/22-legend-tete-renard.jpg' },
];

const LEGENDAIRES_RENDUS: LegendaireRendu[] = [
  {
    id: 'cryo',
    nom: 'Caisson Cryogénique',
    description: 'Shiba en stase cryogénique, gaz vert, capsule futuriste',
    edition: '1 / 1',
    image: '/images/projets/nft-floofies/23-legend-cryo.jpg',
  },
  {
    id: 'momie',
    nom: 'Shiba Momie',
    description: 'Bandelettes ancestrales, aura mystique, pièce unique',
    edition: '1 / 1',
    image: '/images/projets/nft-floofies/24-legend-momie.jpg',
  },
  {
    id: 'armure-maille',
    nom: 'Armure de Mailles',
    description: 'Cotte de mailles médiévale, chevalier du futur',
    edition: '1 / 1',
    image: '/images/projets/nft-floofies/25-legend-armure.jpg',
  },
];

export default function LegendairesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tetesRef = useRef<(HTMLDivElement | null)[]>([]);
  const rendusRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(tetesRef.current, {
        opacity: 0,
        scale: 0.85,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(rendusRef.current, {
        opacity: 0,
        y: 80,
        stagger: 0.18,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black via-amber-950/10 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-light text-amber-400 uppercase tracking-widest">04</span>
            <span className="h-px w-12 bg-amber-400/50" />
            <span className="text-xs font-light text-amber-300 uppercase tracking-widest">Sommet de la collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Quelques légendaires
            <br />
            <span className="text-slate-400">Pièces uniques &amp; rarissimes</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Au sommet de la collection se trouvent les <span className="text-white">pièces légendaires</span>, 
            uniques, spectaculaires, développées comme de véritables œuvres 3D à part entière. 
            Elles constituent le cœur de la valeur collectionneur de l&apos;univers Floofies.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Variantes graphiques exotiques (tigre, léopard, panda) associées à des mises en scène 
            narratives spectaculaires : cryogénisation, momification, armure de chevalier.
          </p>
        </div>

        {/* Grille variantes de tête */}
        <div className="mb-16 md:mb-20">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest">
              Variantes graphiques
            </h3>
            <span className="text-xs font-light text-amber-400 uppercase tracking-widest">
              Motifs légendaires
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TETES_LEGENDAIRES.map((tete, idx) => (
              <div
                key={tete.id}
                ref={(el) => { tetesRef.current[idx] = el; }}
                className="group aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-900/40 transition-all duration-500 hover:border-amber-500/70 hover:shadow-2xl hover:shadow-amber-500/20"
              >
                <div className="relative w-full h-full p-4">
                  <img
                    src={tete.image}
                    alt={tete.nom}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-xs font-light text-amber-200 uppercase tracking-wider">
                      {tete.nom}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rendus légendaires spectaculaires */}
        <div>
          <div className="mb-6">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest">
              Pièces légendaires, Éditions uniques
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {LEGENDAIRES_RENDUS.map((rendu, idx) => (
              <div
                key={rendu.id}
                ref={(el) => { rendusRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900 to-black border border-amber-900/50 transition-all duration-500 group-hover:border-amber-500/70 group-hover:shadow-2xl group-hover:shadow-amber-500/20">
                  <img
                    src={rendu.image}
                    alt={rendu.nom}
                    className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Golden glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Édition badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-amber-500/30">
                    <p className="text-xs font-light text-amber-300 tracking-wider">
                      {rendu.edition}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-light text-amber-400 uppercase tracking-widest">
                      Légendaire
                    </span>
                    <span className="h-px w-8 bg-amber-400/50" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-light text-white mb-2">{rendu.nom}</h4>
                  <p className="text-sm text-slate-400 font-light italic">{rendu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout de clôture */}
        <div className="mt-20 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-amber-950/20 via-slate-900/50 to-black border border-amber-900/30 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
            Une collection, quatre niveaux de rareté
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed max-w-3xl">
            Des shibas de base généreusement déclinés aux pièces légendaires uniques, Floofies 
            organise sa collection selon un principe clair de rareté progressive. Chaque niveau 
            offre son propre récit visuel, sa propre valeur collectionneur, tout en s&apos;inscrivant 
            dans un univers cohérent, cartoon, pop et résolument tourné vers le futur.
          </p>
        </div>
      </div>
    </section>
  );
}
