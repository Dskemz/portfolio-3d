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
      // Parallax effect on hero image
      gsap.to(heroImageRef.current, {
        y: (index, target) => {
          return ScrollTrigger.getById('heroScroll')
            ? -innerHeight * 0.15
            : 0;
        },
        scrollTrigger: {
          id: 'heroScroll',
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

      // Fade out text on scroll
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
      className="relative w-full h-screen bg-slate-900 overflow-hidden"
    >
      {/* Hero Background */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-black"
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Text Content */}
      <div
        ref={textContentRef}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Surtitre */}
        <div className="mb-6 tracking-widest">
          <p className="text-sm md:text-base font-light text-neutral-300 uppercase letter-spacing">
            Projet 3D — Direction Artistique & Packaging
          </p>
        </div>

        {/* Titre Principal */}
        <h1 className="mb-6 text-4xl md:text-6xl font-thin text-white leading-tight max-w-4xl">
          La Commanderie
          <br />
          <span className="text-neutral-400">de 2013 à 2021</span>
        </h1>

        {/* Paragraphe Descriptif */}
        <p className="max-w-2xl text-sm md:text-base text-neutral-300 font-light leading-relaxed">
          Étude de cas d'un accompagnement complet pour le développement d'une
          marque de vin : modélisation 3D de toute la gamme et mise en scène
          publicitaire haut de gamme.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            Scroll
          </p>
          <svg
            className="w-4 h-6 text-neutral-400"
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
