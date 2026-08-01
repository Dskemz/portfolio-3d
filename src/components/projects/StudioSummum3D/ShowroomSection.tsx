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
  { image: '/images/projets/summum-3d/11-showroom-1.jpg', title: 'Veste texturée', description: 'Textile plissé, coutures et patine' },
  { image: '/images/projets/summum-3d/12-showroom-2.jpg', title: 'Sculpture buste', description: 'Pierre sculptée, traces d\'outils' },
  { image: '/images/projets/summum-3d/13-showroom-3.jpg', title: 'Graffiti urbain', description: 'Couches de peinture et relief mural' },
  { image: '/images/projets/summum-3d/14-showroom-4.jpg', title: 'Objet céramique', description: 'Émail, glaçure et imperfections' },
];

export default function ShowroomSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Déclinaisons Showroom
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Fichiers GLB légers et robustes, prêts pour l&apos;intégration dans
            des environnements interactifs et musées virtuels.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {ITEMS.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-slate-800 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm md:text-base font-light text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 font-light uppercase tracking-wide mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 'GLTF / GLB', label: 'Format' },
              { value: 'Draco', label: 'Compression' },
              { value: 'KTX2', label: 'Textures' },
              { value: 'WebGL', label: 'Cible' },
            ].map((spec) => (
              <div key={spec.label}>
                <p className="text-lg md:text-xl font-light text-white">{spec.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{spec.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
