'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroImageRef.current, {
        scrollTrigger: {
          id: 'heroScrollCartoon',
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
          onUpdate: (self) => {
            gsap.to(heroImageRef.current, {
              y: -self.progress * 100,
              duration: 0,
            });
          },
        },
      });
      gsap.to(textContentRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'center center',
          scrub: 0.5,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-orange-300 to-rose-400"
    >
      {/*
        Image de fond immersive (avion "Pou Piou !" sur fond chaud/orangé) :
        - backgroundPosition '70% center' recentre l'image sur mobile pour garder
          l'avion visible.
        - md:bg-right la replace à droite sur grand écran afin de laisser la
          colonne de texte respirer à gauche.
      */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 w-full h-full bg-[#121212] md:bg-right"
        style={{
          backgroundImage: 'url("/images/projets/creation-originales/01-hero.jpg")',
          backgroundPosition: '70% center',
          backgroundSize: 'cover',
        }}
      >
        {/* Voile chaud très léger pour la lisibilité du texte, sans ternir les couleurs */}
        <div className="absolute inset-0 bg-black/25 md:bg-black/10" />
      </div>

      {/*
        Conteneur du texte :
        - items-center text-center sur mobile (centré)
        - md:items-start md:text-left sur ordinateur (aligné à gauche)
      */}
      <div
        ref={textContentRef}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center md:items-start md:text-left md:px-16 lg:px-24"
      >
        <div className="mb-6 tracking-widest">
          <p className="text-sm md:text-base font-medium text-slate-900/80 uppercase drop-shadow-sm">
            Créations Originales, Cartoon 3D
          </p>
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-light text-white leading-tight max-w-4xl drop-shadow-md">
          Le Cartoon
          <br />
          <span className="font-thin text-white/80">mis en scène</span>
        </h1>

        <p className="max-w-xl text-sm md:text-base text-white/90 font-light leading-relaxed drop-shadow-sm">
          Couleur, dynamisme et mises en scène décalées. Des créations 3D
          originales et ludiques, pensées comme de petites histoires visuelles au
          rendu léché et « clean ».
        </p>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-xs text-slate-900/80 uppercase tracking-wider drop-shadow-sm">
            Scroll
          </p>
          <svg
            className="w-4 h-6 text-slate-900/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
