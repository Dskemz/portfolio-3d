'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Scenographie {
  id: string;
  titre: string;
  sous_titre: string;
  ambiance: string;
  finitions: string[];
  image: string;
}

const SCENOGRAPHIES: Scenographie[] = [
  {
    id: 'travertin-beige',
    titre: 'Travertin Beige',
    sous_titre: 'Chaleur & Sérénité',
    ambiance: 'Collection travertin brossé — vasque intégrée — robinetterie chromée',
    finitions: ['Travertin massif', 'Vasque simple', 'Miroir biseauté'],
    image: '/images/projets/decotec/03-scenographie-travertin.jpg',
  },
  {
    id: 'pierre-grise',
    titre: 'Pierre Grise',
    sous_titre: 'Minimalisme Contemporain',
    ambiance: 'Revêtements pierre grise mate — double vasque — éclairage épuré',
    finitions: ['Pierre lisse', 'Double vasque', 'Façade mate'],
    image: '/images/projets/decotec/04-scenographie-pierre.jpg',
  },
  {
    id: 'carreaux-verts',
    titre: 'Carreaux Verts',
    sous_titre: 'Rétro Inspiré & Élégance',
    ambiance: 'Carrelage vert profond — vasque en céramique — quincaillerie laiton',
    finitions: ['Carrelage géométrique', 'Vasque ronde', 'Finitions laiton'],
    image: '/images/projets/decotec/05-scenographie-vert.jpg',
  },
  {
    id: 'bois-strie',
    titre: 'Bois Strié',
    sous_titre: 'Chaleur Naturelle & Texture',
    ambiance: 'Mobilier en bois strié naturel — vasque suspendue — ambiance spa',
    finitions: ['Bois naturel', 'Vasque suspendue', 'Miroir intégré'],
    image: '/images/projets/decotec/06-scenographie-bois.jpg',
  },
  {
    id: 'marbre-blanc',
    titre: 'Marbre Blanc',
    sous_titre: 'Luxe & Pureté',
    ambiance: 'Revêtements marbre blanc — vasque double — éclairage doré',
    finitions: ['Marbre massif', 'Double vasque', 'Quincaillerie dorée'],
    image: '/images/projets/decotec/07-scenographie-marbre.jpg',
  },
  {
    id: 'beton-brut',
    titre: 'Béton Brut',
    sous_titre: 'Industriel & Moderne',
    ambiance: 'Béton poli — vasque intégrée épurée — éclairage architectural',
    finitions: ['Béton poli', 'Vasque minimale', 'Acier inox'],
    image: '/images/projets/decotec/08-scenographie-beton.jpg',
  },
];

export default function ScenographieSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
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
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Scénographies &amp; Collections
          </h2>
          <p className="text-base md:text-lg text-slate-400 font-light max-w-3xl">
            Exploration de six univers distincts mettant en lumière les variantes de finitions,
            les décors texturés et les gammes de mobilier disponibles — chaque ambiance raconte
            une histoire de design intérieur.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SCENOGRAPHIES.map((scenographie, idx) => (
            <div
              key={scenographie.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-6 bg-slate-800 border border-slate-700">
                <img
                  src={scenographie.image}
                  alt={scenographie.titre}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                    {scenographie.titre}
                  </h3>
                  <p className="text-sm text-slate-400 font-light italic">
                    {scenographie.sous_titre}
                  </p>
                </div>

                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  {scenographie.ambiance}
                </p>

                {/* Finitions Tags */}
                <div className="flex flex-wrap gap-2">
                  {scenographie.finitions.map((finition, fidx) => (
                    <span
                      key={fidx}
                      className="text-xs font-light text-slate-300 border border-slate-600 px-3 py-1 rounded-full"
                    >
                      {finition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Box */}
        <div className="mt-20 p-8 md:p-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-2xl font-light text-white mb-4">
            Variantes &amp; Déclinaisons
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed">
            Chacune de ces scénographies explore une palette matérielle distincte et peut être
            déclinée en multiples variantes : vasques simples ou doubles, façades brillantes ou mates,
            mobilier suspendu ou reposant au sol. Ces rendus servent de base aux portfolios produits,
            catalogues de vente et matériels de présentation pour les agences de design d&apos;intérieur.
          </p>
        </div>
      </div>
    </section>
  );
}
