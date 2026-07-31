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
          id: 'heroScrollWithings',
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
      className="relative w-full h-screen bg-slate-900 overflow-hidden"
    >
      {/*
        Image de fond immersive (montre sur le sable) :
        - backgroundPosition '70% center' recentre l'image sur mobile pour garder
          la montre visible.
        - md:bg-right la replace proprement à droite sur les grands écrans afin
          de laisser la colonne de texte à gauche.
      */}
      <div
        ref={heroImageRef}
        className="absolute inset-x-0 top-0 w-full h-[calc(100%+160px)] bg-gradient-to-br from-slate-800 to-black md:bg-right"
        style={{
          backgroundImage: 'url("/images/projets/withings/01-hero.jpg")',
          backgroundPosition: '70% center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/55 md:bg-black/35" />
      </div>

      {/*
        Conteneur du texte :
        - items-center text-center sur mobile (centré sous l'image)
        - md:items-start md:text-left sur ordinateur (aligné à gauche pour
          laisser la montre respirer à droite)
      */}
      <div
        ref={textContentRef}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center md:items-start md:text-left md:px-16 lg:px-24"
      >
        <div className="mb-6 tracking-widest">
          <p className="text-sm md:text-base font-light text-white/90 uppercase drop-shadow-sm">
            Withings — Modélisation 3D &amp; Horlogerie connectée
          </p>
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-thin text-white leading-tight max-w-4xl drop-shadow-md">
          ScanWatch 2, Light
          <br />
          <span className="text-white/80">et Nova</span>
        </h1>

        <p className="max-w-xl text-sm md:text-base text-white/90 font-light leading-relaxed drop-shadow-sm">
          Création 3D de toute la gamme de montres connectées : boîtiers,
          cadrans et bracelets. Vidéos 360° pour le shop interactif et packshots
          pour la grande distribution.
        </p>

      </div>
    </section>
  );
}
