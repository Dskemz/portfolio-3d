'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ItemPiece {
  id: string;
  categorie: string;
  nom: string;
  image: string;
}

interface Composition {
  id: string;
  nom: string;
  description: string;
  image: string;
}

const ACCESSOIRES: ItemPiece[] = [
  { id: 'chapeau-1', categorie: 'Chapeau', nom: 'Casque cosmonaute', image: '' },
  { id: 'oeil-1', categorie: 'Œil', nom: 'Visière LED', image: '' },
  { id: 'bouche-1', categorie: 'Bouche', nom: 'Sourire pixelisé', image: '' },
  { id: 'corps-1', categorie: 'Corps', nom: 'Combinaison spatiale', image: '' },
  { id: 'objet-1', categorie: 'Objet dos', nom: 'Propulseur', image: '' },
  { id: 'chapeau-2', categorie: 'Chapeau', nom: 'Bandeau néon', image: '' },
];

const COMPOSITIONS: Composition[] = [
  {
    id: 'vr',
    nom: 'Casque VR',
    description: 'Composition futuriste, visière VR + tenue tech',
    image: '',
  },
  {
    id: 'lunettes-3d',
    nom: 'Lunettes 3D',
    description: 'Composition pop, lunettes 3D + bomber lumineux',
    image: '',
  },
];

export default function CompositionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const composRef = useRef<(HTMLDivElement | null)[]>([]);
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

      gsap.from(itemsRef.current, {
        opacity: 0,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.6,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(composRef.current, {
        opacity: 0,
        x: 60,
        stagger: 0.15,
        duration: 0.9,
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
      className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Quelques compositions
            <br />
            <span className="text-slate-400">Modularité &amp; combinaisons</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Chaque NFT est le résultat d&apos;un assemblage modulaire de cinq couches distinctes : 
            <span className="text-white"> chapeau, œil, bouche, corps</span> (avec vêtements) 
            et <span className="text-white">objet dans le dos</span>.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Ce système permet de générer des milliers de combinaisons uniques tout en préservant 
            une identité visuelle forte et cohérente à travers l&apos;ensemble de la collection.
          </p>
        </div>

        {/* Layout riche : Grille mini-items + Compositions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Mini-grille accessoires - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Bibliothèque d&apos;accessoires
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Éléments modulaires combinables
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ACCESSOIRES.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => { itemsRef.current[idx] = el; }}
                  className="group aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-500/10 !opacity-100"
                >
                  <div className="relative w-full h-full">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.nom}
                        className="w-full h-full object-contain object-center p-2 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[10px] font-light text-white uppercase tracking-wider">
                        {item.categorie}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compositions complètes - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Rendus complets
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Personnages finalisés en composition
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {COMPOSITIONS.map((compo, idx) => (
                <div
                  key={compo.id}
                  ref={(el) => { composRef.current[idx] = el; }}
                  className="group flex flex-col !opacity-100"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 transition-all duration-500 group-hover:border-fuchsia-500/50 group-hover:shadow-2xl group-hover:shadow-fuchsia-500/10">
                    {compo.image && (
                      <img
                        src={compo.image}
                        alt={compo.nom}
                        className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-light text-white mb-1">{compo.nom}</h4>
                    <p className="text-sm text-slate-400 font-light italic">{compo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
