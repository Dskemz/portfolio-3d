'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LumiereSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pairRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(studioRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: studioRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(pairRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pairRef.current[0],
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Mise en scène studio, reflets spéculaires */}
        <div
          ref={studioRef}
          className="w-full aspect-[16/9] overflow-hidden rounded-lg bg-slate-800 mb-10 lg:mb-14 group"
        >
          <img
            src="/images/projets/withings/10-studio.jpg"
            alt="Mise en scène studio, reflets spéculaires sur verre et biseaux"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Bloc texte, l'accent sur l'horlogerie pure */}
        <div
          ref={textRef}
          className="grid grid-cols-1 lg:grid-cols-[8rem_1fr] gap-6 lg:gap-10 mb-16 lg:mb-20"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-5">
              L&apos;horlogerie pure, sculptée par la lumière
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Faire ressortir les lignes des profils ultra-fins, souligner les
              reflets soleillés des cadrans, comme le bleu profond, et révéler
              les tranches de boîtiers. La lumière forme un ensemble cohérent qui
              met chaque élément en valeur.
            </p>
          </div>
        </div>

        {/* Paire de profils, reflets soleillés côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div
            ref={(el) => { pairRef.current[0] = el; }}
            className="group relative overflow-hidden rounded-lg bg-slate-800 aspect-[4/3]"
          >
            <img
              src="/images/projets/withings/04-profil.jpg"
              alt="Profil ultra-fin du boîtier"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-sm font-light text-white">
                Profil ultra-fin
              </p>
            </div>
          </div>
          <div
            ref={(el) => { pairRef.current[1] = el; }}
            className="group relative overflow-hidden rounded-lg bg-slate-800 aspect-[4/3]"
          >
            <img
              src="/images/projets/withings/13-cadran-noir.jpg"
              alt="Reflet soleillé sur cadran bleu profond"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-sm font-light text-white">
                Reflet soleillé, bleu profond
              </p>
            </div>
          </div>
        </div>

        {/* Bande de tranches de boîtiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { src: '/images/projets/withings/16-detail-cadran-1.jpg', label: 'Tranche polie' },
            { src: '/images/projets/withings/17-detail-bracelet-1.jpg', label: 'Corne & bracelet' },
            { src: '/images/projets/withings/18-detail-boitier-1.jpg', label: 'Biseau lumière' },
            { src: '/images/projets/withings/19-detail-cadran-2.jpg', label: 'Index appliqué' },
          ].map((item, idx) => (
            <div
              key={item.label}
              ref={(el) => { pairRef.current[idx + 2] = el; }}
              className="group flex flex-col"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-800 mb-3">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs text-slate-400 font-light uppercase tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
