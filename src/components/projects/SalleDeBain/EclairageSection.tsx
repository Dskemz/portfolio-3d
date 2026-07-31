'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EclairageVariante {
  id: string;
  titre: string;
  description: string;
  details: string;
  image: string;
  temperature: string;
}

const ECLAIRAGE_VARIANTES: EclairageVariante[] = [
  {
    id: 'jour',
    titre: 'Lumière Naturelle (Jour)',
    description: 'Lumière douce et chaleureuse',
    details: 'Rendu en lumière du jour dominante — baie vitrée large — reflets sur les surfaces lisses — ambiance sereine et lumineuse.',
    image: '/images/projets/decotec/09-eclairage-jour.jpg',
    temperature: '6500K',
  },
  {
    id: 'blanc',
    titre: 'Éclairage Blanc Neutre',
    description: 'Clarté & Netteté optimales',
    details: 'Éclairage LED blanc froid (4500K) — rendu détaillé et lisible — idéal pour la visualisation des matériaux et finitions.',
    image: '/images/projets/decotec/10-eclairage-blanc.jpg',
    temperature: '4500K',
  },
  {
    id: 'nuit',
    titre: 'Ambiance de Nuit (Spa)',
    description: 'Détente & Intimité',
    details: 'Éclairage tamisé (2700K) — jeux de lumière indirecte — reflets dramatiques sur le marbre et l\'eau — atmosphère relaxante.',
    image: '/images/projets/decotec/11-eclairage-nuit.jpg',
    temperature: '2700K',
  },
];

export default function EclairageSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedVariante, setSelectedVariante] = useState<EclairageVariante | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        opacity: 0,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.8,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Étude d&apos;Éclairage &amp; Variantes
          </h2>
          <p className="text-base md:text-lg text-slate-400 font-light max-w-3xl mx-auto">
            Analyse comparative montrant l&apos;influence décisive de l&apos;éclairage sur la perception
            des matériaux — contrastes, reflets, et ambiance générale de l&apos;espace.
          </p>
        </div>

        {/* Triptyque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {ECLAIRAGE_VARIANTES.map((variante, idx) => (
            <div
              key={variante.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group cursor-pointer"
              onClick={() => setSelectedVariante(variante)}
            >
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-6 bg-slate-800 border border-slate-700 transition-all duration-300 group-hover:border-slate-500">
                <img
                  src={variante.image}
                  alt={variante.titre}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Temperature Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                  <p className="text-xs font-light text-white uppercase tracking-wider">
                    {variante.temperature}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-light text-white mb-2 group-hover:text-slate-300 transition-colors">
                  {variante.titre}
                </h3>
                <p className="text-sm text-slate-400 font-light italic mb-3">
                  {variante.description}
                </p>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  {variante.details}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition-colors">
                  <span>Détails</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Analysis */}
        <div className="p-8 md:p-12 bg-slate-800/30 border border-slate-700 rounded-lg">
          <h3 className="text-2xl font-light text-white mb-6">
            Stratégie d&apos;Éclairage &amp; Rendu
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-light text-white mb-3">Analyse des Reflets</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Les surfaces lisses du marbre et de la céramique jouent un rôle essentiel dans la
                définition de l&apos;ambiance. La disposition des sources lumineuses crée des reflets
                directionnels qui modifient la perception des formes et de la profondeur.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-3">Contraste &amp; Profondeur</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Les variations de contraste entre les zones éclairées et les ombres déterminent
                la dramatisation de l&apos;espace. Une lumière rasante accentue les textures ; une
                lumière frontale unifie et apaise.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-3">Température de Couleur</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                De 2700K (ambiante chaude) à 6500K (lumière naturelle), la température chromatique
                influence l&apos;interprétation émotionnelle de la pièce — intimité vs clarté analytique.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-3">Cas d&apos;Usage en Vente</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Ces trois variantes d&apos;éclairage sont fournies conjointement pour permettre aux
                clients de visualiser la gamme dans différents contextes réalistes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedVariante && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedVariante(null)}
        >
          <div
            className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[16/9] bg-slate-800">
              <img
                src={selectedVariante.image}
                alt={selectedVariante.titre}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedVariante(null)}
                className="absolute top-4 right-4 bg-slate-800/90 hover:bg-slate-700 p-3 rounded-full transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                {selectedVariante.titre}
              </h2>
              <p className="text-lg text-slate-400 font-light italic mb-8">
                {selectedVariante.description}
              </p>
              <p className="text-base text-slate-300 font-light leading-relaxed">
                {selectedVariante.details}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
