'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/**
 * Fiche horlogère de la galerie.
 *
 * Pour ajouter une nouvelle pièce au fil des projets :
 *   1. Ajouter une entrée dans PIECES_HORLOGERES ci-dessous
 *   2. Déposer les visuels dans /public/images/projets/horlogerie-suisse/
 *   3. La grille s'adapte automatiquement (masonry responsive)
 *
 * Pour transformer un slot "coming soon" en pièce publiée :
 *   - Passer status: 'published' et renseigner image + description
 */
interface PieceHorlogere {
  id: string;
  nom: string;
  reference: string;
  annee: string;
  description: string;
  image: string;
  status: 'published' | 'coming-soon';
}

const PIECES_HORLOGERES: PieceHorlogere[] = [
  {
    id: 'reverso-tribute',
    nom: 'Reverso Tribute',
    reference: 'Boîtier rectangulaire réversible',
    annee: '2024',
    description: 'Étude du mécanisme de retournement, double cadran',
    image: '',
    status: 'published',
  },
  {
    id: 'master-control',
    nom: 'Master Control',
    reference: 'Complications classiques',
    annee: '2024',
    description: 'Cadran opalin, index appliques or rose',
    image: '',
    status: 'published',
  },
  {
    id: 'geophysic',
    nom: 'Geophysic True Second',
    reference: 'Édition anniversaire',
    annee: '2025',
    description: 'Aiguille des secondes à saut d\'une seconde',
    image: '',
    status: 'published',
  },
  {
    id: 'piece-a-venir-1',
    nom: 'Prochaine pièce',
    reference: '',
    annee: '',
    description: 'Modélisation en cours, à venir prochainement',
    image: '',
    status: 'coming-soon',
  },
  {
    id: 'piece-a-venir-2',
    nom: 'Prochaine pièce',
    reference: '',
    annee: '',
    description: 'Modélisation en cours, à venir prochainement',
    image: '',
    status: 'coming-soon',
  },
];

export default function GalerieSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 gouttiere bg-gradient-to-b from-black via-rose-950/5 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Galerie horlogère
            <br />
            <span className="text-slate-400">&amp; pièces futures</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Cette galerie est pensée comme un <span className="text-white">espace évolutif</span>,
            conçu pour s&apos;enrichir au fil de mes projets personnels d&apos;horlogerie 3D.
            Chaque nouvelle pièce vient s&apos;ajouter à la collection sans rupture visuelle,
            dans une grille flexible et harmonieuse.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Modélisation, texturing, éclairage et compositions : chaque étude est menée avec la
            même exigence, celle du geste horloger, précis et patient.
          </p>
        </div>

        {/* Grille flexible responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PIECES_HORLOGERES.map((piece, idx) => {
            const isPublished = piece.status === 'published';
            return (
              <div
                key={piece.id}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className={`group flex flex-col !opacity-100 ${
                  isPublished ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Image ou placeholder */}
                <div
                  className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 border transition-all duration-500 ${
                    isPublished
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 group-hover:border-rose-300/50 group-hover:shadow-2xl group-hover:shadow-rose-300/10'
                      : 'bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800 border-dashed'
                  }`}
                >
                  {isPublished ? (
                    <>
                      {piece.image && (
                      <img
                        src={piece.image}
                        alt={piece.nom}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                      {/* Radial glow */}
                      <div className="absolute inset-0 bg-gradient-radial from-rose-300/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </>
                  ) : (
                    /* Placeholder "coming soon" */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                      <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-light text-slate-600 uppercase tracking-widest text-center">
                        Prochainement
                      </p>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div>
                  {isPublished ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-light text-white">
                          {piece.nom}
                        </h3>
                        <span className="text-xs font-light text-rose-300/70 tracking-widest">
                          {piece.annee}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-light italic mb-2">
                        {piece.reference}
                      </p>
                      <p className="text-sm text-slate-400 font-light leading-relaxed">
                        {piece.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg md:text-xl font-light text-slate-500 mb-2">
                        {piece.nom}
                      </h3>
                      <p className="text-sm text-slate-600 font-light italic leading-relaxed">
                        {piece.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout final */}
        <div className="mt-20 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-rose-950/10 via-slate-900/50 to-black border border-rose-900/20 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
            Un atelier ouvert
          </h3>
          <p className="text-base text-slate-300 font-light leading-relaxed max-w-3xl">
            L&apos;horlogerie est un terrain d&apos;exploration privilégié pour la 3D, précision
            mécanique extrême, matériaux nobles, jeux de reflets sophistiqués. Cette collection
            s&apos;enrichira régulièrement de nouvelles études, chacune apportant son lot
            d&apos;apprentissages sur le rendu de la matière, la lumière et le mouvement.
          </p>
        </div>
      </div>
    </section>
  );
}
