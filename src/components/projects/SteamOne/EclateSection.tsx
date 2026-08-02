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

interface VueEclate {
  id: string;
  titre: string;
  legende: string;
  image: string;
}

const VUES_ECLATE: VueEclate[] = [
  {
    id: 'reservoir',
    titre: 'Réservoir',
    legende: 'Contenance eau, module amovible',
    image: '/images/projets/steamone/02-eclate-reservoir.jpg',
  },
  {
    id: 'boitier',
    titre: 'Boîtier principal',
    legende: 'Coque ergonomique, poignée &amp; commandes',
    image: '/images/projets/steamone/03-eclate-boitier.jpg',
  },
  {
    id: 'resistances',
    titre: 'Résistances',
    legende: 'Bloc de chauffe, génération de vapeur',
    image: '/images/projets/steamone/04-eclate-resistances.jpg',
  },
  {
    id: 'grille',
    titre: 'Grille de diffusion',
    legende: 'Sortie vapeur, répartition homogène',
    image: '/images/projets/steamone/05-eclate-grille.jpg',
  },
];

export default function EclateSection() {
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
        stagger: 0.1,
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Éclaté
            <br />
            <span className="text-slate-400">Fondations &amp; architecture interne</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Création d&apos;un <span className="text-white">éclaté produit</span> destiné à dévoiler
            la technologie interne du nouveau défroisseur vapeur SteamOne. L&apos;objectif :
            expliquer visuellement l&apos;ergonomie du produit et rendre lisibles les choix
            d&apos;ingénierie qui font sa singularité.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Les grandes pièces, réservoir, boîtier, résistances, grille de diffusion, sont
            séparées et flottent dans l&apos;espace, comme si le produit se démontait par lui-même
            face au regard. Une mise en scène pédagogique, précise et esthétique.
          </p>
        </div>

        {/* Grille aérée des 4 éléments principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {VUES_ECLATE.map((vue, idx) => (
            <div
              key={vue.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-sky-500/50 group-hover:shadow-2xl group-hover:shadow-sky-500/10">
                <img
                  src={vue.image}
                  alt={vue.titre}
                  className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => handleImgError(e, idx)}
                />
                {/* Glow subtil */}
                <div className="absolute inset-0 bg-gradient-radial from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Numéro */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-xs font-light text-sky-400 tracking-widest">
                    0{idx + 1}
                  </span>
                  <span className="h-px w-6 bg-sky-400/50" />
                </div>
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

        {/* Metrics techniques */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Pièces modélisées
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">42</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Vues éclatées
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">6</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Précision
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">0.1 mm</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Rendus finaux
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">18</p>
          </div>
        </div>
      </div>
    </section>
  );
}
