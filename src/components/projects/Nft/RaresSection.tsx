'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images génériques présentes dans le repo, utilisées en repli tant que les
// visuels définitifs ne sont pas encore déposés. Dès qu'un fichier au bon nom
// existe, il s'affiche automatiquement à la place.
const FALLBACKS = [
  '/images/projets/nft-floofies/02-character.jpg',
  '/images/projets/nft-floofies/03-environment.jpg',
  '/images/projets/nft-floofies/04-detail-1.jpg',
  '/images/projets/nft-floofies/05-detail-2.jpg',
];
const fallbackFor = (idx: number) => FALLBACKS[idx % FALLBACKS.length];
const handleImgError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  idx: number,
) => {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = fallbackFor(idx);
};

interface PieceRare {
  id: string;
  nom: string;
  image: string;
}

interface RareRendu {
  id: string;
  nom: string;
  description: string;
  image: string;
}

const PIECES_RARES: PieceRare[] = [
  { id: 'arme-1', nom: 'Blaster plasma', image: '/images/projets/nft-floofies/13-rare-item-1.jpg' },
  { id: 'arme-2', nom: 'Katana laser', image: '/images/projets/nft-floofies/14-rare-item-2.jpg' },
  { id: 'casque-1', nom: 'Casque HUD tactique', image: '/images/projets/nft-floofies/15-rare-item-3.jpg' },
  { id: 'casque-2', nom: 'Masque cyber', image: '/images/projets/nft-floofies/16-rare-item-4.jpg' },
];

const RARES_RENDUS: RareRendu[] = [
  {
    id: 'cyber-armor',
    nom: 'Shiba Cyber Armor',
    description: 'Armure cybernétique complète, équipement de combat',
    image: '/images/projets/nft-floofies/17-rare-cyber.jpg',
  },
  {
    id: 'neon-warrior',
    nom: 'Shiba Neon Warrior',
    description: 'Guerrier néon, katana laser + casque HUD',
    image: '/images/projets/nft-floofies/18-rare-warrior.jpg',
  },
];

export default function RaresSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef<(HTMLDivElement | null)[]>([]);
  const rendusRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(piecesRef.current, {
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.7,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(rendusRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black via-indigo-950/20 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Quelques rares
            <br />
            <span className="text-slate-400">Compositions cyberpunk exclusives</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Une seconde catégorie de NFT bâtis sur la même base morphologique, mais avec 
            <span className="text-white"> moins de déclinaisons disponibles</span>, chaque pièce 
            possède un caractère plus affirmé et une valeur collectionneur significativement supérieure.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            L&apos;esthétique cyberpunk domine : armures, armes lasers, casques HUD tactiques et 
            équipements de combat futuristes.
          </p>
        </div>

        {/* Alternance visuelle : pièces + rendus */}
        <div className="space-y-16 md:space-y-20">
          {/* Rangée 1 : Grille pièces rares */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest">
                Pièces détachées rares
              </h3>
              <span className="text-xs font-light text-purple-400 uppercase tracking-widest">
                Édition limitée
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {PIECES_RARES.map((piece, idx) => (
                <div
                  key={piece.id}
                  ref={(el) => { piecesRef.current[idx] = el; }}
                  className="group aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-900/50 transition-all duration-500 hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="relative w-full h-full p-4">
                    <img
                      src={piece.image}
                      alt={piece.nom}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => handleImgError(e, idx)}
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs font-light text-slate-300 truncate">
                        {piece.nom}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rangée 2 : Rendus complets cyberpunk */}
          <div>
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest">
                Rendus finaux, Shibas armés
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {RARES_RENDUS.map((rendu, idx) => (
                <div
                  key={rendu.id}
                  ref={(el) => { rendusRef.current[idx] = el; }}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950/60 via-indigo-950/40 to-black border border-purple-900/50 transition-all duration-500 group-hover:border-purple-500/70 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                    <img
                      src={rendu.image}
                      alt={rendu.nom}
                      className="w-full h-full object-contain object-center p-6 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => handleImgError(e, idx)}
                    />
                    {/* Cyber glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-light text-purple-400 uppercase tracking-widest">
                        Rare
                      </span>
                      <span className="h-px w-8 bg-purple-400/50" />
                    </div>
                    <h4 className="text-xl md:text-2xl font-light text-white mb-2">{rendu.nom}</h4>
                    <p className="text-sm text-slate-400 font-light italic">{rendu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
