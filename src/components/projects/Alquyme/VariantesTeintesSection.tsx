'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Ecrin {
  id: string;
  nom: string;
  usage: string;
  image: string;
}

interface Variante {
  id: string;
  teinte: string;
  ambiance: string;
  hex: string;
  image: string;
}

const ECRINS: Ecrin[] = [
  {
    id: 'etui-cuir',
    nom: 'Étui cuir texturé',
    usage: 'Édition Prestige, présentation individuelle',
    image: '/images/projets/alquyme/11-etui-cuir.jpg',
  },
  {
    id: 'boite-cadeau',
    nom: 'Boîte-cadeau bicolore',
    usage: 'Édition Coffret, écrin de collection',
    image: '/images/projets/alquyme/12-boite-cadeau.jpg',
  },
];

const VARIANTES: Variante[] = [
  {
    id: 'transparent',
    teinte: 'Verre transparent',
    ambiance: 'Signature, matière originale',
    hex: '#E8E4D4',
    image: '/images/projets/alquyme/13-var-transparent.jpg',
  },
  {
    id: 'bleu-pastel',
    teinte: 'Bleu pastel',
    ambiance: 'Marine, fraîcheur aquatique',
    hex: '#A8C5D6',
    image: '/images/projets/alquyme/14-var-bleu.jpg',
  },
  {
    id: 'rose-poudre',
    teinte: 'Rose poudré',
    ambiance: 'Florale, douceur romantique',
    hex: '#E8B8B8',
    image: '/images/projets/alquyme/15-var-rose.jpg',
  },
  {
    id: 'argent',
    teinte: 'Argent monochrome',
    ambiance: 'Boisée, minéralité argentée',
    hex: '#C0C0C8',
    image: '/images/projets/alquyme/16-var-argent.jpg',
  },
  {
    id: 'or',
    teinte: 'Or monochrome',
    ambiance: 'Orientale, chaleur ambrée',
    hex: '#D4AF37',
    image: '/images/projets/alquyme/17-var-or.jpg',
  },
  {
    id: 'ambre',
    teinte: 'Ambre profond',
    ambiance: 'Précieuse, mystère résineux',
    hex: '#8B4513',
    image: '/images/projets/alquyme/18-var-ambre.jpg',
  },
];

export default function VariantesTeintesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ecrinsRef = useRef<(HTMLDivElement | null)[]>([]);
  const variantesRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(ecrinsRef.current, {
        opacity: 0,
        x: 40,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(variantesRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black via-amber-950/10 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-light text-amber-400 uppercase tracking-widest">03</span>
            <span className="h-px w-12 bg-amber-400/50" />
            <span className="text-xs font-light text-amber-300 uppercase tracking-widest">Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Variantes de teintes
            <br />
            <span className="text-slate-400">&amp; collections</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            La <span className="text-white">modularité chromatique</span> du flacon permet de
            décliner l&apos;identité ALQUYME en plusieurs éditions distinctes : dégradés pastel
            évoquant des familles olfactives précises, versions monochromes argentées ou dorées
            pour les collections d&apos;exception.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            À côté des variantes de teinte, les <span className="text-white">écrins précieux</span>
            {" "}— étui cuir et boîte-cadeau bicolore, prolongent le rituel jusqu&apos;au
            déballage, transformant chaque acquisition en cérémonie.
          </p>
        </div>

        {/* Écrins précieux */}
        <div className="mb-20 md:mb-24">
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Écrins &amp; boîte-cadeau
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Prolongements du rituel, geste de dévoilement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {ECRINS.map((ecrin, idx) => (
              <div
                key={ecrin.id}
                ref={(el) => { ecrinsRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900 to-black border border-slate-700 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                  <img
                    src={ecrin.image}
                    alt={ecrin.nom}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-light text-amber-400 uppercase tracking-widest">
                      Écrin 0{idx + 1}
                    </span>
                    <span className="h-px w-8 bg-amber-400/50" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-light text-white mb-2">
                    {ecrin.nom}
                  </h4>
                  <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                    {ecrin.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variations chromatiques */}
        <div>
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Variations chromatiques
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Une identité, six ambiances olfactives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {VARIANTES.map((variante, idx) => (
              <div
                key={variante.id}
                ref={(el) => { variantesRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-4 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                  <img
                    src={variante.image}
                    alt={variante.teinte}
                    className="w-full h-full object-contain object-center p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-600"
                      style={{ backgroundColor: variante.hex }}
                    />
                    <h4 className="text-lg font-light text-white">{variante.teinte}</h4>
                  </div>
                  <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                    {variante.ambiance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout de clôture */}
        <div className="mt-20 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-amber-950/20 via-slate-900/50 to-black border border-amber-900/30 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
            Un flacon, une alchimie
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed max-w-3xl">
            ALQUYME est pensé comme une collection modulaire : un dessin signature, des variations
            chromatiques qui déclinent les familles olfactives, des écrins qui prolongent le rituel.
            Le rendu 3D permet d&apos;anticiper chaque édition avant la production, de composer les
            images de communication et de proposer un univers cohérent d&apos;une teinte à l&apos;autre.
          </p>
        </div>
      </div>
    </section>
  );
}
