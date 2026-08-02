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
      gsap.from(panelRef.current, {
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
        <div
          ref={imageRef}
          className="lg:col-span-3 relative aspect-[3/4] lg:aspect-auto lg:h-[70vh] overflow-hidden rounded-lg bg-slate-800"
        >
          <img
            src="/images/projets/summum-3d/02-defi-piece.jpg"
            alt="Pièce principale numérisée"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div
          ref={panelRef}
          className="lg:col-span-2 lg:pl-8 flex flex-col justify-center"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white leading-snug mb-6">
            Du Scan Brut au Fichier Temps Réel
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed mb-8">
            La photogrammétrie produit des maillages de plusieurs millions de
            polygones, inexploitables en l&apos;état. Le défi : descendre à quelques
            dizaines de milliers de faces tout en préservant chaque pli, chaque
            patine, chaque aspérité de l&apos;œuvre originale.
          </p>

          <div className="flex gap-10">
            <div>
              <p className="text-2xl md:text-3xl font-light text-white">12M</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Polygones scan
              </p>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <p className="text-2xl md:text-3xl font-light text-white">45K</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Polygones GLB
              </p>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <p className="text-2xl md:text-3xl font-light text-white">&lt;5 MB</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Poids final
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
