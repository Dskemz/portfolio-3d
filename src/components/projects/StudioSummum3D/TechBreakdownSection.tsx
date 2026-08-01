'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RenderPass {
  id: string;
  title: string;
  description: string;
  image: string;
  fullDescription: string;
}

const RENDER_PASSES: RenderPass[] = [
  {
    id: 'highpoly',
    title: 'Maillage Haute Densité',
    description: 'Sortie brute de la photogrammétrie',
    image: '/images/projets/summum-3d/08-tech-highpoly.svg',
    fullDescription:
      'Maillage haute densité directement issu de la reconstruction photogrammétrique, plusieurs millions de polygones capturant chaque détail de surface.',
  },
  {
    id: 'lowpoly',
    title: 'Topologie Optimisée (Low-Poly)',
    description: 'Retopologie et allègement du modèle',
    image: '/images/projets/summum-3d/09-tech-lowpoly.svg',
    fullDescription:
      'Retopologie manuelle pour obtenir un maillage propre et léger, prêt pour l\'exploitation temps réel tout en préservant les silhouettes clés.',
  },
  {
    id: 'textures',
    title: 'Comparaison de Textures',
    description: 'Baking depuis le high-poly',
    image: '/images/projets/summum-3d/10-tech-textures.svg',
    fullDescription:
      'Baking des cartes (normal, albedo, roughness, AO) depuis le maillage haute densité vers le low-poly pour conserver le détail visuel avec un budget polygone réduit.',
  },
  {
    id: 'final',
    title: 'Modèle Final GLB',
    description: 'Livrable optimisé pour le Web',
    image: '/images/projets/summum-3d/11-tech-final-glb.svg',
    fullDescription:
      'Export final au format GLTF/GLB compressé (Draco/Meshopt), prêt pour intégration WebGL avec un poids maîtrisé et un rendu fidèle à l\'original.',
  },
];

export default function TechBreakdownSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedPass, setSelectedPass] = useState<RenderPass | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation on grid items
      gsap.from(gridItemsRef.current, {
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
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
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-black to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Optimisation & Formats Temps Réel (GLTF / GLB)
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-3xl">
            Réduction du nombre de polygones et compression intelligente pour
            garantir une fluidité parfaite sur le Web.
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {RENDER_PASSES.map((pass, idx) => (
            <div
              key={pass.id}
              ref={(el) => { gridItemsRef.current[idx] = el; }}
              className="group cursor-pointer"
              onClick={() => setSelectedPass(pass)}
            >
              {/* Card */}
              <div className="h-full rounded-lg overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 group-hover:border-slate-500 group-hover:shadow-xl">
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                  <div className="w-full h-full bg-slate-700" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm md:text-base font-light text-white mb-2">
                    {pass.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 font-light mb-4">
                    {pass.description}
                  </p>

                  {/* Read More Indicator */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition-colors duration-300">
                    <span>Détails</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Details Section */}
        <div className="mt-20 bg-slate-800 rounded-lg p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
            Pipeline Photogrammétrie
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">Acquisition</h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Prises de vues photographiques calibrées sous éclairage
                contrôlé pour reconstruire chaque œuvre en très haute fidélité.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">Nettoyage & Retopo</h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Suppression des artefacts, retopologie manuelle et baking des
                cartes depuis le high-poly vers un maillage optimisé.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">
                Export GLTF / GLB
              </h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Compression Draco/Meshopt, textures KTX2, LOD adaptés pour un
                rendu WebGL fluide sur tous supports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal detail view */}
      {selectedPass && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-800">
              <div className="w-full aspect-square bg-slate-700" />
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute top-4 right-4 bg-slate-800/90 hover:bg-slate-700 p-2 rounded-full transition-all"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-light text-white mb-4">
                {selectedPass.title}
              </h3>
              <p className="text-base text-slate-300 font-light leading-relaxed">
                {selectedPass.fullDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
