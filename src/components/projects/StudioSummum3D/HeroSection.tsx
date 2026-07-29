'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 1.8,
        ease: 'power3.out',
      });
      gsap.from(textRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Full-bleed image */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/images/projets/summum-3d/01-hero.svg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      {/* Text — bottom-left aligned, editorial */}
      <div
        ref={textRef}
        className="relative z-10 h-full min-h-screen flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-20 md:pb-28"
      >
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4">
          Photogrammétrie · Retopologie · GLB
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white leading-[1.05] max-w-3xl mb-6">
          Studio Summum
        </h1>

        <p className="max-w-lg text-sm md:text-base text-neutral-400 font-light leading-relaxed">
          Numérisation haute fidélité d&apos;œuvres d&apos;art par photogrammétrie,
          retopologie et optimisation pour le temps réel.
        </p>

        {/* Scroll line */}
        <div className="mt-12 w-px h-16 bg-gradient-to-b from-neutral-600 to-transparent" />
      </div>
    </section>
  );
}
