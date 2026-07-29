'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DefiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(panelRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 items-center">
        {/* Large image — 3/5 width */}
        <div
          ref={imageRef}
          className="lg:col-span-3 relative aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-[75vh] overflow-hidden rounded-sm bg-slate-800"
        >
          <img
            src="/images/projets/summum-3d/02-defi-piece.svg"
            alt="Pièce principale numérisée"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text panel — 2/5 width, offset right */}
        <div
          ref={panelRef}
          className="lg:col-span-2 lg:pl-12 xl:pl-20 flex flex-col justify-center"
        >
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-6">
            02 — Le Défi
          </p>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extralight text-white leading-snug mb-6">
            Du scan brut
            <br />
            au fichier
            <br />
            <span className="text-neutral-500">temps réel</span>
          </h2>

          <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed mb-8">
            La photogrammétrie produit des maillages de plusieurs millions de
            polygones, inexploitables en l&apos;état. Le défi : descendre à quelques
            dizaines de milliers de faces tout en préservant chaque pli, chaque
            patine, chaque aspérité de l&apos;œuvre originale.
          </p>

          {/* Metrics */}
          <div className="flex gap-10">
            <div>
              <p className="text-2xl md:text-3xl font-extralight text-white">12M</p>
              <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">
                Polygones scan
              </p>
            </div>
            <div className="w-px bg-neutral-800" />
            <div>
              <p className="text-2xl md:text-3xl font-extralight text-white">45K</p>
              <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">
                Polygones GLB
              </p>
            </div>
            <div className="w-px bg-neutral-800" />
            <div>
              <p className="text-2xl md:text-3xl font-extralight text-white">&lt;5 MB</p>
              <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">
                Poids final
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
