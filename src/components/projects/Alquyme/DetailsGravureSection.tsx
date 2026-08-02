'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images génériques présentes dans le repo, utilisées en repli tant que les
// visuels définitifs ne sont pas encore déposés. Dès qu'un fichier au bon nom
// existe, il s'affiche automatiquement à la place.
const FALLBACKS = [
  '/images/projets/alquyme/02-dataviz.jpg',
  '/images/projets/alquyme/03-detail-1.jpg',
  '/images/projets/alquyme/04-detail-2.jpg',
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

interface Macro {
  id: string;
  nom: string;
  detail: string;
  image: string;
}

interface Composition {
  id: string;
  titre: string;
  description: string;
  image: string;
}

const MACROS: Macro[] = [
  {
    id: 'bague-cannelee',
    nom: 'Bague cannelée',
    detail: 'Rythme régulier des rainures, jeu tactile et lumineux',
    image: '/images/projets/alquyme/05-macro-bague.jpg',
  },
  {
    id: 'logo-relief',
    nom: 'Logo en relief',
    detail: 'Marquage ALQUYME frappé dans la matière dorée',
    image: '/images/projets/alquyme/06-macro-logo.jpg',
  },
  {
    id: 'jonction',
    nom: 'Jonction des deux volumes',
    detail: 'Anneau central articulé, finition brossée',
    image: '/images/projets/alquyme/07-macro-jonction.jpg',
  },
  {
    id: 'goulot',
    nom: 'Goulot &amp; capsule',
    detail: 'Vissage précis, étanchéité et geste rituel',
    image: '/images/projets/alquyme/08-macro-goulot.jpg',
  },
];

const COMPOSITIONS: Composition[] = [
  {
    id: 'ouvert',
    titre: 'Flacon ouvert',
    description: 'Séparation des deux volumes, révélation du geste modulaire',
    image: '/images/projets/alquyme/09-compo-ouvert.jpg',
  },
  {
    id: 'assemble',
    titre: 'Assemblage complet',
    description: 'Silhouette pleine, équilibre des masses et des matières',
    image: '/images/projets/alquyme/10-compo-assemble.jpg',
  },
];

export default function DetailsGravureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const macrosRef = useRef<(HTMLDivElement | null)[]>([]);
  const composRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(macrosRef.current, {
        opacity: 0,
        scale: 0.92,
        stagger: 0.08,
        duration: 0.7,
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Détails &amp; gravure
            <br />
            <span className="text-slate-400">Précision artisanale</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Un travail méticuleux de <span className="text-white">textures</span> vient sublimer
            chaque bague métallique cannelée. Les rainures régulières captent la lumière et
            créent un jeu de contraste subtil, tandis que le <span className="text-white">logo
            ALQUYME</span> est frappé en relief dans la matière dorée, signature tactile et visuelle.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Ces gros plans macro révèlent le soin apporté à chaque finition. Les vues de
            composition montrent quant à elles la <span className="text-white">modularité du
            flacon</span> : les deux récipients peuvent se séparer, révélant leur double nature
            olfactive dans un geste rituel élégant.
          </p>
        </div>

        {/* Layout : macros + compositions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Grille macros - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Gros plans macro
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Finitions dorées gravées
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {MACROS.map((macro, idx) => (
                <div
                  key={macro.id}
                  ref={(el) => { macrosRef.current[idx] = el; }}
                  className="group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="relative w-full h-full">
                    <img
                      src={fallbackFor(idx)}
                      alt={macro.nom}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => handleImgError(e, idx)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                      <p className="text-[11px] md:text-xs font-light text-white leading-tight">
                        {macro.nom}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compositions ouverture/modularité - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Compositions &amp; modularité
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Ouverture, assemblage &amp; geste rituel
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {COMPOSITIONS.map((compo, idx) => (
                <div
                  key={compo.id}
                  ref={(el) => { composRef.current[idx] = el; }}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-amber-950/30 via-slate-900 to-black border border-slate-700 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                    <img
                      src={compo.image}
                      alt={compo.titre}
                      className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => handleImgError(e, idx)}
                    />
                    {/* Golden glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-light text-white mb-1">{compo.titre}</h4>
                    <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                      {compo.description}
                    </p>
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
