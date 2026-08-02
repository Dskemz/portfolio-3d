'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroductionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 20%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      gsap.from(textRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
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
      className="w-full py-20 md:py-32 gouttiere bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Visuel grand format, baignoire avec lumière naturelle */}
        <div ref={imageRef} className="mb-16 md:mb-24 w-full">
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
            <img
              src="/images/projets/decotec/02-intro-hero.jpg"
              alt="Baignoire avec vue sur l'extérieur et lumière naturelle"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>

        {/* Texte d'introduction */}
        <div ref={textRef} className="max-w-3xl mx-auto text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Perspectives 3D Photoréalistes
            <br />
            <span className="text-slate-400">Fidélité &amp; Présentation de Gammes</span>
          </h2>

          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8">
            Cette étude de cas présente une série de perspectives 3D haute fidélité développées pour la
            présentation de collections de mobilier de salle de bain. Chaque rendu capture l&apos;essence
            des gammes proposées : finitions de surfaces, jeux de lumière naturelle, et harmonie des
            proportions dans des environnements réalistes et aspirationnels.
          </p>

          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Modélisation précise • Étude d&apos;éclairage naturel et artificiel • Textures haute résolution •
            Rendu photoréaliste • Intégration des collections et finitions
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 md:p-8 border border-slate-700 rounded-lg bg-gradient-to-br from-slate-800/50 to-transparent">
            <h3 className="text-lg md:text-xl font-light text-white mb-3">
              Modélisation 3D Précise
            </h3>
            <p className="text-sm md:text-base text-slate-400 font-light">
              Géométrie haute densité pour capturer chaque détail des surfaces et des profils, vasques,
              robinetterie, mobilier encastré.
            </p>
          </div>

          <div className="p-6 md:p-8 border border-slate-700 rounded-lg bg-gradient-to-br from-slate-800/50 to-transparent">
            <h3 className="text-lg md:text-xl font-light text-white mb-3">
              Étude d&apos;Éclairage Nuancée
            </h3>
            <p className="text-sm md:text-base text-slate-400 font-light">
              Analyse des jeux de lumière naturelle (fenêtre, réflexions sur les surfaces) pour une
              ambiance authentique et vendeuse.
            </p>
          </div>

          <div className="p-6 md:p-8 border border-slate-700 rounded-lg bg-gradient-to-br from-slate-800/50 to-transparent">
            <h3 className="text-lg md:text-xl font-light text-white mb-3">
              Textures &amp; Matériaux
            </h3>
            <p className="text-sm md:text-base text-slate-400 font-light">
              Recréation fidèle des finitions, céramique, travertin, pierre, bois strié, avec
              microsurfaces et patines réalistes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
