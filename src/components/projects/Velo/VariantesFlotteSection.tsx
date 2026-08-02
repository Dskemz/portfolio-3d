'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Palette {
  id: string;
  nom: string;
  usage: string;
  image: string;
}

interface Finition {
  id: string;
  titre: string;
  description: string;
  image: string;
}

const PALETTES_SECONDAIRES: Palette[] = [
  {
    id: 'menthe',
    nom: 'Palette Menthe & Nuit',
    usage: 'Flottes urbaines premium, logistique écoresponsable',
    image: '/images/projets/velyv-elo/15-palette-menthe.jpg',
  },
  {
    id: 'corail',
    nom: 'Palette Corail & Sable',
    usage: 'Livraison boutique, commerces spécialisés',
    image: '/images/projets/velyv-elo/16-palette-corail.jpg',
  },
  {
    id: 'graphite',
    nom: 'Palette Graphite & Chrome',
    usage: 'Flotte corporate, services entreprises B2B',
    image: '/images/projets/velyv-elo/17-palette-graphite.jpg',
  },
];

const FINITIONS_TECHNIQUES: Finition[] = [
  {
    id: 'guidon',
    titre: 'Guidon & Poste de conduite',
    description: 'Ergonomie du grip, positionnement des commandes, écran de bord central.',
    image: '/images/projets/velyv-elo/18-finition-guidon.jpg',
  },
  {
    id: 'optique',
    titre: 'Optique avant',
    description: 'Bloc phare LED intégré au cadre, signature lumineuse identifiable de loin.',
    image: '/images/projets/velyv-elo/19-finition-optique.jpg',
  },
  {
    id: 'attache-caisson',
    titre: 'Système d\'attache du caisson',
    description: 'Fixation rapide sécurisée, compatibilité multi-caissons selon partenaire.',
    image: '/images/projets/velyv-elo/20-finition-attache.jpg',
  },
];

export default function VariantesFlotteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const palettesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finitionsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(palettesRef.current, {
        opacity: 0,
        x: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(finitionsRef.current, {
        opacity: 0,
        x: -40,
        stagger: 0.12,
        duration: 0.9,
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
      className="w-full py-20 md:py-32 gouttiere bg-gradient-to-b from-black via-emerald-950/10 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Variantes de flottes
            <br />
            <span className="text-slate-400">&amp; déclinaisons pro</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Au-delà des grandes plateformes de livraison rapide, le modèle VélyVélo s&apos;adapte
            à une variété de <span className="text-white">contextes professionnels</span> :
            logistique urbaine premium, commerces de proximité, services entreprises.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Chaque flotte est déclinée dans une palette secondaire dédiée, avec le même soin
            porté aux finitions techniques : optique avant, poste de conduite, attache du caisson.
          </p>
        </div>

        {/* Alternance palettes secondaires */}
        <div className="mb-20 md:mb-24">
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Palettes secondaires
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Déclinaisons de flottes professionnelles
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {PALETTES_SECONDAIRES.map((palette, idx) => (
              <div
                key={palette.id}
                ref={(el) => { palettesRef.current[idx] = el; }}
                className={`group grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 items-center ${
                  idx % 2 === 1 ? 'md:direction-rtl' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`md:col-span-3 ${idx % 2 === 1 ? 'md:order-2' : ''}`}
                >
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                    <img
                      src={palette.image}
                      alt={palette.nom}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Texte */}
                <div className={`md:col-span-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-light text-emerald-400 uppercase tracking-widest">
                      Palette 0{idx + 1}
                    </span>
                    <span className="h-px w-8 bg-emerald-400/50" />
                  </div>
                  <h4 className="text-xl md:text-2xl lg:text-3xl font-light text-white mb-3">
                    {palette.nom}
                  </h4>
                  <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
                    {palette.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finitions techniques */}
        <div>
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Finitions techniques
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Détails d&apos;exécution &amp; savoir-faire industriel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {FINITIONS_TECHNIQUES.map((finition, idx) => (
              <div
                key={finition.id}
                ref={(el) => { finitionsRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950/40 via-slate-900 to-black border border-slate-700 mb-6 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                  <img
                    src={finition.image}
                    alt={finition.titre}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                <div>
                  <h4 className="text-lg md:text-xl font-light text-white mb-2">
                    {finition.titre}
                  </h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {finition.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout de clôture */}
        <div className="mt-20 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-emerald-950/20 via-slate-900/50 to-black border border-emerald-900/30 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
            Un vélo, mille identités
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed max-w-3xl">
            VélyVélo se pense comme une plateforme industrielle : une architecture technique
            commune, un système de personnalisation clair, et une capacité de déclinaison
            immédiate pour toute nouvelle enseigne. La mobilité urbaine professionnelle
            devient un objet de design cohérent, désirable, et industriellement viable.
          </p>
        </div>
      </div>
    </section>
  );
}
