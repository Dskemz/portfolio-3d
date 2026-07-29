'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ShowroomItem {
  image: string;
  title: string;
  description: string;
}

const ITEMS: ShowroomItem[] = [
  {
    image: '/images/projets/summum-3d/11-showroom-1.svg',
    title: 'Veste texturée',
    description: 'Textile plissé, coutures et patine',
  },
  {
    image: '/images/projets/summum-3d/12-showroom-2.svg',
    title: 'Sculpture buste',
    description: 'Pierre sculptée, traces d\'outils',
  },
  {
    image: '/images/projets/summum-3d/13-showroom-3.svg',
    title: 'Graffiti urbain',
    description: 'Couches de peinture et relief mural',
  },
  {
    image: '/images/projets/summum-3d/14-showroom-4.svg',
    title: 'Objet céramique',
    description: 'Émail, glaçure et imperfections',
  },
];

export default function ShowroomSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-20 text-center">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4">
            05 — Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight text-white mb-4">
            Déclinaisons Showroom
          </h2>
          <p className="text-sm md:text-base text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
            Fichiers GLB légers et robustes, prêts pour l&apos;intégration dans
            des environnements interactifs et musées virtuels.
          </p>
        </div>

        {/* 2×2 grid with hover reveal */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
          {ITEMS.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-900"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Always-visible subtle label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <p className="text-xs md:text-sm font-light text-white/80">
                  {item.title}
                </p>
                <p className="text-[10px] md:text-xs text-neutral-500 font-light mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Specs bar */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: 'GLTF / GLB', label: 'Format' },
            { value: 'Draco', label: 'Compression' },
            { value: 'KTX2', label: 'Textures' },
            { value: 'WebGL', label: 'Cible' },
          ].map((spec) => (
            <div key={spec.label}>
              <p className="text-lg md:text-xl font-extralight text-white">
                {spec.value}
              </p>
              <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
