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
    id: 'diffuse',
    title: 'Passe Diffuse Color',
    description: 'Couleurs de base et albédo',
    image: '/images/projets/agences-georges/08-tech-pass-08.jpg',
    fullDescription:
      'La passe Diffuse Color représente les couleurs de base sans éclairage. Elle capture l\'albédo de chaque matériau : verre teinté, étiquette, bouchon.',
  },
  {
    id: 'roughness',
    title: 'Passe Roughness / Reflections',
    description: 'Réflectivité et rugosité des surfaces',
    image: '/images/projets/agences-georges/09-tech-pass-09.jpg',
    fullDescription:
      'La carte de rugosité définit comment chaque surface diffuse ou réfléchit la lumière. Le verre est hautement réfléchissant, l\'étiquette très diffuse.',
  },
  {
    id: 'wireframe',
    title: 'Topologie & Wireframe',
    description: 'Géométrie et maillage 3D',
    image: '/images/projets/agences-georges/10-tech-pass-10.jpg',
    fullDescription:
      'Topologie propre et optimisée du maillage. Densité de polygones adaptée au niveau de détail requis.',
  },
  {
    id: 'final',
    title: 'Image Finale Compositée',
    description: 'Rendu complet avec éclairage et effets',
    image: '/images/projets/agences-georges/11-tech-pass-11.jpg',
    fullDescription:
      'Composition finale intégrant tous les éléments : éclairage 3 points studio, reflets, ombres et post-traitement.',
  },
];

export default function TechBreakdownSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedPass, setSelectedPass] = useState<RenderPass | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      className="w-full py-16 gouttiere bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Analyse Technique & Passes de Rendu
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-3xl">
            Décomposition du processus de rendu et de la topologie 3D. Chaque
            passe représente une couche du pipeline de production.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {RENDER_PASSES.map((pass, idx) => (
            <div
              key={pass.id}
              ref={(el) => { gridItemsRef.current[idx] = el; }}
              className="group cursor-pointer"
              onClick={() => setSelectedPass(pass)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={pass.image}
                  alt={pass.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm md:text-base font-light text-white">
                    {pass.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-1 hidden md:block">
                    {pass.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-slate-800 rounded-lg p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
            Pipeline de Production
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">Modélisation</h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Topologie quad-based pour sculpture et déformation fluides.
                Subdivision surfaces pour géométrie organique du bouchon.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">Texturing</h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                PBR workflow : Diffuse, Roughness, Metallic, Normal, AO maps.
                Procédural texturing pour imperfections naturelles.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-light text-white">Rendu & Composition</h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Éclairage 3 points studio. Passes AOV pour flexibilité en
                post-production. Color grading pour cohérence visuelle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video relative">
              <img
                src={selectedPass.image}
                alt={selectedPass.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-light text-white mb-4">
                {selectedPass.title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                {selectedPass.fullDescription}
              </p>
            </div>
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedPass(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
