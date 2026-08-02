'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EnseigneRendu {
  id: string;
  enseigne: string;
  description: string;
  couleurPrincipale: string;
  couleurRappel: string;
  image: string;
}

interface Declinaison {
  id: string;
  nom: string;
  hex: string;
  image: string;
}

const ENSEIGNES_RENDUS: EnseigneRendu[] = [
  {
    id: 'flink',
    enseigne: 'Flink',
    description: 'Rose signature, jantes, pédales et porte-bagage',
    couleurPrincipale: 'Rose vif',
    couleurRappel: 'Noir mat',
    image: '/images/projets/velyv-elo/05-flink.jpg',
  },
  {
    id: 'stuart',
    enseigne: 'Stuart',
    description: 'Orange dynamique, équipements colorés',
    couleurPrincipale: 'Orange',
    couleurRappel: 'Blanc',
    image: '/images/projets/velyv-elo/06-stuart.jpg',
  },
  {
    id: 'just-eat',
    enseigne: 'Just Eat',
    description: 'Rouge/orange gourmand, rappel jaune sur cadre',
    couleurPrincipale: 'Rouge',
    couleurRappel: 'Jaune',
    image: '/images/projets/velyv-elo/07-just-eat.jpg',
  },
  {
    id: 'gopuff',
    enseigne: 'Gopuff',
    description: 'Violet/rose, identité visuelle affirmée',
    couleurPrincipale: 'Violet',
    couleurRappel: 'Rose',
    image: '/images/projets/velyv-elo/08-gopuff.jpg',
  },
];

const DECLINAISONS: Declinaison[] = [
  { id: 'rose', nom: 'Rose Flink', hex: '#FF3B7B', image: '/images/projets/velyv-elo/09-decli-rose.jpg' },
  { id: 'orange', nom: 'Orange Stuart', hex: '#FF6B00', image: '/images/projets/velyv-elo/10-decli-orange.jpg' },
  { id: 'rouge', nom: 'Rouge Just Eat', hex: '#FF3A2E', image: '/images/projets/velyv-elo/11-decli-rouge.jpg' },
  { id: 'violet', nom: 'Violet Gopuff', hex: '#8B4CFF', image: '/images/projets/velyv-elo/12-decli-violet.jpg' },
  { id: 'jaune', nom: 'Jaune Signal', hex: '#FFD400', image: '/images/projets/velyv-elo/13-decli-jaune.jpg' },
  { id: 'bleu', nom: 'Bleu Corporate', hex: '#2B7CFF', image: '/images/projets/velyv-elo/14-decli-bleu.jpg' },
];

export default function FlocageSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const enseignesRef = useRef<(HTMLDivElement | null)[]>([]);
  const declinaisonsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(enseignesRef.current, {
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

      gsap.from(declinaisonsRef.current, {
        opacity: 0,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.6,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 35%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 gouttiere bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Flocage
            <br />
            <span className="text-slate-400">Personnalisation par enseigne</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Le vélo se décline selon la charte graphique de chaque partenaire. Les
            <span className="text-white"> éléments fixes</span>, fourche, gardes-boue, batterie —
            restent en <span className="text-white">noir mat</span>, socle universel.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Les <span className="text-white">jantes, pédales et le porte-bagage</span> reprennent
            la couleur principale du logo, tandis qu&apos;un <span className="text-white">rappel
            subtil de la teinte secondaire</span> vient dynamiser le cadre. Une logique de
            personnalisation lisible, économique en production, et immédiatement identifiable
            dans le paysage urbain.
          </p>
        </div>

        {/* Grille de rendus par enseigne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-20">
          {ENSEIGNES_RENDUS.map((enseigne, idx) => (
            <div
              key={enseigne.id}
              ref={(el) => { enseignesRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                <img
                  src={enseigne.image}
                  alt={`Vélo brandé ${enseigne.enseigne}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge enseigne */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
                  <p className="text-xs font-light text-white uppercase tracking-widest">
                    {enseigne.enseigne}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                  Livraison {enseigne.enseigne}
                </h3>
                <p className="text-sm text-slate-400 font-light italic mb-4">
                  {enseigne.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-light text-slate-300 border border-slate-600 px-3 py-1 rounded-full">
                    {enseigne.couleurPrincipale}
                  </span>
                  <span className="text-xs font-light text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
                    Rappel {enseigne.couleurRappel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Palette de déclinaisons */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Palette de déclinaisons
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Bibliothèque de teintes disponibles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {DECLINAISONS.map((decl, idx) => (
              <div
                key={decl.id}
                ref={(el) => { declinaisonsRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 mb-3 transition-all duration-300 group-hover:border-slate-500">
                  <img
                    src={decl.image}
                    alt={decl.nom}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600"
                    style={{ backgroundColor: decl.hex }}
                  />
                  <p className="text-xs font-light text-slate-300 truncate">{decl.nom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
