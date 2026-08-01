'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MeshPass {
  id: string;
  titre: string;
  description: string;
  details: string;
  image: string;
  fullDescription: string;
  color: string;
}

const MESH_PASSES: MeshPass[] = [
  {
    id: 'highpoly',
    titre: 'Modélisation Haute Densité',
    description: 'Géométrie brute détaillée',
    details: 'Capture initiale avec densité polygonale élevée, microreliefs, biseautages, arêtes.',
    image: '/images/projets/decotec/12-mesh-highpoly.jpg',
    fullDescription: 'Modélisation CAO haute fidélité représentant la géométrie complète de la salle de bain, chaque surface courbe, chaque angle, chaque détail, pour un total de plusieurs millions de polygones.',
    color: 'from-cyan-500/20 to-cyan-600/10',
  },
  {
    id: 'wireframe',
    titre: 'Wireframe Colorisé',
    description: 'Topologie optimisée',
    details: 'Structure topologique épurée, lignes de construction visibles, maillage propre et fluide.',
    image: '/images/projets/decotec/13-mesh-wireframe.jpg',
    fullDescription: 'Affichage du wireframe colorisé montrant la topologie finale du maillage optimisé, chaque arête, chaque polygone est disposé de manière logique pour supporter le rendu temps réel sans compromettre la fidélité visuelle.',
    color: 'from-lime-500/20 to-lime-600/10',
  },
  {
    id: 'optimized',
    titre: 'Rendu Optimisé',
    description: 'Modèle léger & fluide',
    details: 'Géométrie retopologisée, réduction polygonale intelligente, prêt pour GLTF/GLB.',
    image: '/images/projets/decotec/14-mesh-optimized.jpg',
    fullDescription: 'Maillage final optimisé avec une réduction polygonale ciblée. Les détails visuels sont préservés via baking de textures (normal maps, roughness, AO), permettant un rendu léger et fluide idéal pour exportation GLTF et intégration WebGL.',
    color: 'from-orange-500/20 to-orange-600/10',
  },
];

export default function WorkflowTechniqueSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedPass, setSelectedPass] = useState<MeshPass | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        opacity: 0,
        scale: 0.92,
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
      className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Workflow Technique &amp; Maillage
          </h2>
          <p className="text-base md:text-lg text-slate-400 font-light max-w-3xl">
            Mise en avant du pipeline de modélisation, de la géométrie brute haute densité jusqu&apos;à
            l&apos;optimisation finale pour rendu temps réel (GLTF/GLB). Chaque étape garantit propreté
            topologique et fluidité de performance.
          </p>
        </div>

        {/* Grid 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {MESH_PASSES.map((pass, idx) => (
            <div
              key={pass.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group cursor-pointer"
              onClick={() => setSelectedPass(pass)}
            >
              <div className="h-full rounded-lg overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 group-hover:border-slate-500 group-hover:shadow-2xl">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-700">
                  <img
                    src={pass.image}
                    alt={pass.titre}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${pass.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>

                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-light text-white mb-2">
                    {pass.titre}
                  </h3>
                  <p className="text-sm text-slate-400 font-light mb-4">
                    {pass.description}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed mb-4">
                    {pass.details}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition-colors">
                    <span>Voir plus</span>
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
            </div>
          ))}
        </div>

        {/* Pipeline Breakdown */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg mb-20">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
            Pipeline de Modélisation &amp; Optimisation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-xs font-light text-cyan-300">1</span>
                </div>
                <h4 className="text-lg font-light text-white">Modélisation CAO</h4>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Création de la géométrie haute fidélité en logiciel de modélisation, tous les détails
                et microreliefs capturés.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center">
                  <span className="text-xs font-light text-lime-300">2</span>
                </div>
                <h4 className="text-lg font-light text-white">Retopologie</h4>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Création d&apos;une nouvelle topologie épurée et optimisée, structure logique, lignes
                de flux maîtrisées.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-xs font-light text-orange-300">3</span>
                </div>
                <h4 className="text-lg font-light text-white">Baking Textures</h4>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Transfert des détails du high-poly vers le low-poly via cartes de textures
                (normal, roughness, AO).
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xs font-light text-purple-300">4</span>
                </div>
                <h4 className="text-lg font-light text-white">Export GLTF</h4>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Compression intelligente (Draco/Meshopt), textures optimisées (KTX2), prêt pour
                le Web.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Polygones Initiaux
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">12.5M</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Polygones Optimisés
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">185K</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Taux de Compression
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">98.5%</p>
          </div>
          <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/30">
            <h4 className="text-xs font-light text-slate-400 uppercase tracking-wider mb-2">
              Fichier GLB Final
            </h4>
            <p className="text-2xl md:text-3xl font-light text-white">2.3 MB</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPass && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[16/9] bg-slate-800">
              <img
                src={selectedPass.image}
                alt={selectedPass.titre}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedPass.color}`} />
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute top-4 right-4 bg-slate-800/90 hover:bg-slate-700 p-3 rounded-full transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                {selectedPass.titre}
              </h2>
              <p className="text-lg text-slate-400 font-light italic mb-8">
                {selectedPass.description}
              </p>
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
