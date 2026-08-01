'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Materiau {
  id: string;
  titre: string;
  description: string;
  image: string;
}

interface Duo {
  id: string;
  titre: string;
  legende: string;
  image: string;
}

const MATERIAUX_POLARIS: Materiau[] = [
  {
    id: 'clay-boitier',
    titre: 'Clay render, Boîtier',
    description: 'Coque neutre, étude des volumes et proportions',
    image: '/images/projets/horlogerie-suisse/09-polaris-clay.jpg',
  },
  {
    id: 'acier-poli',
    titre: 'Acier poli miroir',
    description: 'Facettes rehaussées, reflets contrastés',
    image: '/images/projets/horlogerie-suisse/10-polaris-acier-poli.jpg',
  },
  {
    id: 'acier-brosse',
    titre: 'Acier brossé satiné',
    description: 'Rayures directionnelles, capture douce de la lumière',
    image: '/images/projets/horlogerie-suisse/11-polaris-acier-brosse.jpg',
  },
  {
    id: 'cadran-soleille',
    titre: 'Cadran soleillé',
    description: 'Rayons partant du centre, jeu chromatique subtil',
    image: '/images/projets/horlogerie-suisse/12-polaris-cadran.jpg',
  },
];

const DUOS_POLARIS: Duo[] = [
  {
    id: 'duo-01',
    titre: 'Composition duo, Édition classique',
    legende: 'Bracelet cuir vs bracelet acier, pièces jumelles',
    image: '/images/projets/horlogerie-suisse/13-polaris-duo-1.jpg',
  },
  {
    id: 'duo-02',
    titre: 'Composition duo, Édition anniversaire',
    legende: 'Cadran bleu profond vs cadran gris ardoise',
    image: '/images/projets/horlogerie-suisse/14-polaris-duo-2.jpg',
  },
];

export default function PolarisSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const materiauxRef = useRef<(HTMLDivElement | null)[]>([]);
  const duosRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(materiauxRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(duosRef.current, {
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
      className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Polaris Memovox
            <br />
            <span className="text-slate-400">50e anniversaire</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Modélisation 3D dédiée à la <span className="text-white">Polaris Memovox</span>, pièce
            iconique dont l&apos;héritage horloger célèbre son 50e anniversaire. L&apos;étude
            approfondie des matériaux, <span className="text-white">boîtier acier</span>, cadrans
            soleillés et bracelets spécifiques, permet une restitution fidèle du savoir-faire.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Le travail est présenté à travers des <span className="text-white">rendus en clay
            render</span> (coque neutre) qui révèlent les volumes purs, complétés par des vues
            des finitions polies et brossées haute précision. Des compositions en duo permettent
            de comparer les éditions.
          </p>
        </div>

        {/* Matériaux & clay renders */}
        <div className="mb-20 md:mb-24">
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Matériaux &amp; finitions
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Clay render, Acier poli, Acier brossé, Cadran soleillé
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {MATERIAUX_POLARIS.map((mat, idx) => (
              <div
                key={mat.id}
                ref={(el) => { materiauxRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-4 transition-all duration-500 group-hover:border-rose-300/50 group-hover:shadow-2xl group-hover:shadow-rose-300/10">
                  <img
                    src={mat.image}
                    alt={mat.titre}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Numéro */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-light text-rose-300 tracking-widest">
                      0{idx + 1}
                    </span>
                    <span className="h-px w-4 bg-rose-300/50" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base md:text-lg font-light text-white mb-1">
                    {mat.titre}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-400 font-light italic leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compositions duo */}
        <div>
          <div className="mb-8">
            <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
              Compositions en duo
            </h3>
            <p className="text-sm text-slate-500 font-light">
              Pièces jumelles, dialogue des variantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {DUOS_POLARIS.map((duo, idx) => (
              <div
                key={duo.id}
                ref={(el) => { duosRef.current[idx] = el; }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-6 transition-all duration-500 group-hover:border-rose-300/50 group-hover:shadow-2xl group-hover:shadow-rose-300/10">
                  <img
                    src={duo.image}
                    alt={duo.titre}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Radial glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-rose-300/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-light text-rose-300 uppercase tracking-widest">
                      Duo 0{idx + 1}
                    </span>
                    <span className="h-px w-8 bg-rose-300/50" />
                  </div>
                  <h4 className="text-lg md:text-xl font-light text-white mb-2">
                    {duo.titre}
                  </h4>
                  <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                    {duo.legende}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
