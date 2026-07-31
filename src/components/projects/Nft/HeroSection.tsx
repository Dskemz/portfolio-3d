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
      className="relative w-full h-screen bg-gradient-to-br from-indigo-900 to-black overflow-hidden"
    >
      <div
        ref={heroImageRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-950 to-black"
        style={{
          backgroundImage: 'url("/images/projets/nft-floofies/01-hero.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/40 md:bg-black/25" />
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center md:items-start md:text-left md:px-16 lg:px-24"
      >
        <div className="mb-6 tracking-widest">
          <p className="text-sm md:text-base font-light text-cyan-300 uppercase letter-spacing">
            Projet NFT
          </p>
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-thin text-white leading-tight max-w-4xl">
          Floofies
          <br />
          <span className="text-neutral-300">Le shiba du futur</span>
        </h1>

        <p className="max-w-2xl text-sm md:text-base text-neutral-300 font-light leading-relaxed">
          Collection de NFT 3D mettant en scène un univers cartoon et pop-futuriste — personnages
          modulaires, accessoires spatiaux et compositions génératives dans une esthétique
          science-fiction assumée.
        </p>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-xs text-stone-100 uppercase tracking-wider">
            Scroll
          </p>
          <svg
            className="w-4 h-6 text-stone-100"
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
