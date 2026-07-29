'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(bigRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bigRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(sideRef.current, {
        x: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sideRef.current[0],
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#0a0f1d] to-[#121212]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Bloc texte épuré */}
        <div ref={textRef} className="max-w-3xl mb-14 lg:mb-20">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-[0.3em] mb-5">
            01 — Le cartoon
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.15]">
            Allier deux idées,
            <br />
            obtenir une création.
          </h2>
          <p className="mt-6 text-base md:text-lg text-neutral-500 font-light leading-relaxed">
            Couleur, dynamisme, une mise en scène simple pour une création unique.
            Chaque visuel naît de la rencontre inattendue de deux univers.
          </p>
        </div>

        {/* Mise en valeur asymétrique — 1 visuel phare + 2 satellites */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Visuel phare (ex. l'ours / personnage cartoon) */}
          <div
            ref={bigRef}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 to-teal-200 aspect-[4/5] lg:aspect-auto lg:min-h-[560px]"
          >
            <img
              src="/images/projets/creation-originales/02-produit.jpg"
              alt="Personnage cartoon — visuel phare"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Colonne de 2 satellites (licorne sur bouée donut, astronaute aux ballons cœur) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <div
              ref={(el) => { sideRef.current[0] = el; }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 to-pink-200 aspect-[4/3] flex-1"
            >
              <img
                src="/images/projets/creation-originales/03-detail-1.jpg"
                alt="Licorne sur sa bouée donut"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div
              ref={(el) => { sideRef.current[1] = el; }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-200 to-indigo-200 aspect-[4/3] flex-1"
            >
              <img
                src="/images/projets/creation-originales/04-detail-2.jpg"
                alt="Petit astronaute aux ballons en forme de cœur"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
