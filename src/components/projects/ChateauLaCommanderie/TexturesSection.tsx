'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TexturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftImageRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(rightImageRef.current, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Maîtrise des Textures & du Photoréalisme
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
            Travail minutieux sur les shaders (rugosité du verre, imperfections,
            relief des capsules) pour gommer l&apos;effet &quot;trop propre&quot; de la 3D.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div
            ref={leftImageRef}
            className="md:col-span-2 overflow-hidden rounded-lg bg-slate-800"
          >
            <div className="relative aspect-video md:aspect-auto md:h-80 overflow-hidden group">
              <img
                src="/images/projets/agences-georges/06-textures-macro-1.jpg"
                alt="Zoom sur bouchon liège et capsule étain"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-sm md:text-base font-light">
                  Zoom sur le bouchon en liège avec subsurface scattering et
                  capsule en étain gravée
                </p>
              </div>
            </div>
          </div>

          <div
            ref={rightImageRef}
            className="md:col-span-1 overflow-hidden rounded-lg bg-slate-800"
          >
            <div className="relative aspect-square md:aspect-auto md:h-80 overflow-hidden group">
              <img
                src="/images/projets/agences-georges/07-textures-macro-2.jpg"
                alt="Étiquette papier texturé et dorure"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs md:text-sm font-light">
                  Étiquette papier texturé, dorure à chaud et réfraction lumière
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-white">
              Subsurface Scattering & Matériaux Organiques
            </h3>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Le liège, matériau naturel, requiert un rendu spécifique avec
              diffusion de la lumière interne pour simuler la translucidité.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-light text-white">
              Rugosité & Imperfections
            </h3>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Ajout de micro-rayures et variations de normales map pour éviter
              l&apos;aspect hyper-lissé typique des rendus 3D.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
