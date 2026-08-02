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
      className="relative w-full h-screen bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] overflow-hidden"
    >
      <div
        ref={heroImageRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-black"
        style={{
          backgroundImage: 'url("/images/projets/horlogerie-suisse/01-hero.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center gouttiere text-center md:items-start md:text-left"
      >
        <div className="mb-6 tracking-widest">
          <p className="text-sm md:text-base font-light text-white/80 uppercase letter-spacing">
            Horlogerie / Projet Personnel
          </p>
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-thin text-white leading-tight max-w-4xl">
          Horlogerie
          <br />
          <span className="text-neutral-300">Mise en scène de montres, Collection évolutive</span>
        </h1>

        <p className="max-w-2xl text-sm md:text-base text-neutral-300 font-light leading-relaxed">
          Projets personnels de modélisation 3D horlogère, pièces d&apos;exception mises en scène
          sur des décors texturés et lunaires. Précision mécanique, matériaux nobles et éclairage
          sophistiqué au service de l&apos;horlogerie de prestige.
        </p>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-xs text-white/80 uppercase tracking-wider drop-shadow-sm">
            Scroll
          </p>
          <svg
            className="w-4 h-6 text-white/80"
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
