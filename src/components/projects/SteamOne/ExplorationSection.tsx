'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images génériques présentes dans le repo, utilisées en repli tant que les
// visuels définitifs ne sont pas encore déposés. Dès qu'un fichier au bon nom
// existe, il s'affiche automatiquement à la place.
const FALLBACKS = [
  '/images/projets/steamone/02-visite.jpg',
  '/images/projets/steamone/03-detail-1.jpg',
  '/images/projets/steamone/04-detail-2.jpg',
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

interface VueAxe {
  id: string;
  axe: string;
  description: string;
  image: string;
}

interface Finition {
  id: string;
  titre: string;
  description: string;
  image: string;
}

const VUES_AXES: VueAxe[] = [
  {
    id: 'axe-vertical',
    axe: 'Axe vertical',
    description: 'Décomposition en couches horizontales, lecture par étages',
    image: '/images/projets/steamone/12-axe-vertical.jpg',
  },
  {
    id: 'axe-horizontal',
    axe: 'Axe horizontal',
    description: 'Décomposition latérale, pièces alignées en séquence',
    image: '/images/projets/steamone/13-axe-horizontal.jpg',
  },
  {
    id: 'axe-radial',
    axe: 'Axe radial',
    description: 'Expansion depuis le centre, organisation spatiale du volume',
    image: '/images/projets/steamone/14-axe-radial.jpg',
  },
];

const FINITIONS: Finition[] = [
  {
    id: 'plastique-mat',
    titre: 'Plastique mat texturé',
    description: 'Coque principale, toucher agréable, résistant aux traces de doigts',
    image: '/images/projets/steamone/15-finition-mat.jpg',
  },
  {
    id: 'aluminium-brosse',
    titre: 'Aluminium brossé',
    description: 'Bandeau frontal, signature premium, réflexion contrôlée',
    image: '/images/projets/steamone/16-finition-alu.jpg',
  },
  {
    id: 'grille-inox',
    titre: 'Grille inox perforée',
    description: 'Sortie vapeur, dessin technique visible et lisible',
    image: '/images/projets/steamone/17-finition-inox.jpg',
  },
];

export default function ExplorationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const axesRef = useRef<(HTMLDivElement | null)[]>([]);
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

      gsap.from(axesRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
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
        y: 60,
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black via-sky-950/10 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Exploration
            <br />
            <span className="text-slate-400">&amp; vues multiples</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            La <span className="text-white">transparence</span> et la
            <span className="text-white"> lisibilité</span> guident chaque choix de mise en scène :
            plusieurs axes d&apos;éclatement racontent la même architecture sous des angles
            différents, chacun mettant en lumière un aspect distinct du produit.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            À côté des vues techniques, les finitions de surface, plastique mat, aluminium brossé,
            inox perforé, rappellent que le design industriel se joue aussi dans le toucher,
            la réflexion de la lumière et la qualité perçue.
          </p>
        </div>

        {/* Alternance : Vues éclatées multiples */}
        <div className="mb-20 md:mb-24">
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Vues éclatées sous plusieurs axes
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Une architecture, trois lectures spatiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {VUES_AXES.map((vue, idx) => (
              <div
                key={vue.id}
                ref={(el) => { axesRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-sky-950/40 via-slate-900 to-black border border-slate-700 transition-all duration-500 group-hover:border-sky-500/50 group-hover:shadow-2xl group-hover:shadow-sky-500/10">
                  <img
                    src={vue.image}
                    alt={vue.axe}
                    className="w-full h-full object-contain object-center p-6 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => handleImgError(e, idx)}
                  />
                  {/* Radial glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-light text-sky-400 uppercase tracking-widest">
                      Vue 0{idx + 1}
                    </span>
                    <span className="h-px w-8 bg-sky-400/50" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-light text-white mb-2">
                    {vue.axe}
                  </h4>
                  <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                    {vue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finitions de surface du boîtier */}
        <div>
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Finitions de surface du boîtier
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Matières, textures &amp; qualité perçue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {FINITIONS.map((finition, idx) => (
              <div
                key={finition.id}
                ref={(el) => { finitionsRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-sky-500/50 group-hover:shadow-2xl group-hover:shadow-sky-500/10">
                  <img
                    src={finition.image}
                    alt={finition.titre}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => handleImgError(e, idx)}
                  />
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
        <div className="mt-20 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-sky-950/20 via-slate-900/50 to-black border border-sky-900/30 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
            L&apos;éclaté comme récit
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed max-w-3xl">
            Décomposer un objet, c&apos;est raconter son histoire. Chaque vue éclatée du SteamOne
            expose une intention de conception : le confort d&apos;usage, la maintenance possible,
            le soin apporté à chaque composant. Le rendu 3D devient un outil pédagogique et
            commercial à la fois, comprendre pour désirer.
          </p>
        </div>
      </div>
    </section>
  );
}
