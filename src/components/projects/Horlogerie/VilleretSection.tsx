'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images génériques présentes dans le repo, utilisées en repli tant que les
// visuels définitifs ne sont pas encore déposés. Dès qu'un fichier au bon nom
// existe, il s'affiche automatiquement à la place.
const FALLBACKS = [
  '/images/projets/horlogerie-suisse/02-montre.jpg',
  '/images/projets/horlogerie-suisse/03-mecanisme.jpg',
  '/images/projets/horlogerie-suisse/04-detail-1.jpg',
  '/images/projets/horlogerie-suisse/05-detail-2.jpg',
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

interface VueAngle {
  id: string;
  angle: string;
  description: string;
  image: string;
}

const MACROS_VILLERET: Macro[] = [
  {
    id: 'cadran',
    nom: 'Cadran émaillé',
    detail: 'Complications chinoises, index gravés à la main',
    image: '/images/projets/horlogerie-suisse/02-villeret-cadran.jpg',
  },
  {
    id: 'saphir',
    nom: 'Verre saphir',
    detail: 'Reflets contrôlés, antireflets bombé',
    image: '/images/projets/horlogerie-suisse/03-villeret-saphir.jpg',
  },
  {
    id: 'aiguilles',
    nom: 'Aiguilles bleuies',
    detail: 'Feuille finement travaillée, traitement thermique',
    image: '/images/projets/horlogerie-suisse/04-villeret-aiguilles.jpg',
  },
  {
    id: 'bracelet',
    nom: 'Bracelet cuir alligator',
    detail: 'Grain texturé, coutures ton sur ton',
    image: '/images/projets/horlogerie-suisse/05-villeret-bracelet.jpg',
  },
];

const VUES_VILLERET: VueAngle[] = [
  {
    id: 'face',
    angle: 'Face avant',
    description: 'Cadran complet, lecture des complications',
    image: '/images/projets/horlogerie-suisse/06-villeret-face.jpg',
  },
  {
    id: 'profil',
    angle: 'Vue de profil',
    description: 'Épaisseur du boîtier, courbes de la carrure',
    image: '/images/projets/horlogerie-suisse/07-villeret-profil.jpg',
  },
  {
    id: 'dos',
    angle: 'Fond ouvert',
    description: 'Mouvement mécanique visible, masse oscillante gravée',
    image: '/images/projets/horlogerie-suisse/08-villeret-dos.jpg',
  },
];

export default function VilleretSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const macrosRef = useRef<(HTMLDivElement | null)[]>([]);
  const vuesRef = useRef<(HTMLDivElement | null)[]>([]);

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
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(vuesRef.current, {
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Villeret Chinese Calendar
            <br />
            <span className="text-slate-400">Fidélité des complications</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Modélisation et mise en scène 3D de la <span className="text-white">Villeret Chinese
            Calendar</span>, une pièce d&apos;exception dont les complications font écho au
            calendrier lunaire traditionnel. Chaque détail a été reproduit fidèlement : indexation
            gravée, aiguilles feuilles bleuies, guillochage du cadran.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Un travail particulier a été porté sur les <span className="text-white">reflets du verre
            saphir</span>, sur les cadrans multicouches et sur la texture du
            <span className="text-white"> bracelet cuir alligator</span>, jusqu&apos;au grain
            reproduit à l&apos;identique.
          </p>
        </div>

        {/* Layout riche : macros + vues d'ensemble */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Gros plans macro - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Détails du cadran
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Gros plans macro, savoir-faire horloger
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {MACROS_VILLERET.map((macro, idx) => (
                <div
                  key={macro.id}
                  ref={(el) => { macrosRef.current[idx] = el; }}
                  className="group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 hover:border-rose-300/50 hover:shadow-lg hover:shadow-rose-300/10"
                >
                  <div className="relative w-full h-full">
                    <img
                      src={macro.image}
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

          {/* Vues d'angle - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Vues d&apos;ensemble
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Compositions sous différents angles
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {VUES_VILLERET.map((vue, idx) => (
                <div
                  key={vue.id}
                  ref={(el) => { vuesRef.current[idx] = el; }}
                  className="group flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-5 rounded-2xl border border-slate-800 hover:border-rose-300/40 bg-slate-900/40 transition-all duration-500"
                >
                  <div className="relative w-full md:w-2/3 aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-rose-300/10">
                    <img
                      src={vue.image}
                      alt={vue.angle}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => handleImgError(e, idx)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-light text-rose-300 uppercase tracking-widest">
                        Vue 0{idx + 1}
                      </span>
                      <span className="h-px w-8 bg-rose-300/50" />
                    </div>
                    <h4 className="text-lg md:text-xl font-light text-white mb-2">
                      {vue.angle}
                    </h4>
                    <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                      {vue.description}
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
