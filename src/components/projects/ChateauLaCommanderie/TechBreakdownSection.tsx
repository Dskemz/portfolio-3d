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
    image:
      'https://images.unsplash.com/photo-1579546059666-e1b6944ed25e?w=600&h=600&fit=crop',
    fullDescription:
      'La passe Diffuse Color représente les couleurs de base sans éclairage. Elle capture l\'albédo de chaque matériau : verre teinté, étiquette, bouchon.',
  },
  {
    id: 'roughness',
    title: 'Passe Roughness / Reflections',
    description: 'Réflectivité et rugosité des surfaces',
    image:
      'https://images.unsplash.com/photo-1503694712202-371f2b4bcc11?w=600&h=600&fit=crop',
    fullDescription:
      'La carte de rugosité définit comment chaque surface diffuse ou réfléchit la lumière. Le verre est hautement réfléchissant, l\'étiquette très diffuse.',
  },
  {
    id: 'wireframe',
    title: 'Topologie & Wireframe',
    description: 'Géométrie et maillage 3D',
    image:
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=600&fit=crop',
    fullDescription:
      'Topologie propre et optimisée du maillage. Densité de polygones adaptée au niveau de détail requis : subdivisions au goulot et bouchon.',
  },
  {
    id: 'final',
    title: 'Image Finale Compositée',
    description: 'Rendu complet avec éclairage et effets',
    image:
      'https://images.unsplash.com/photo-1616516305581-5eef39dce6b9?w=600&h=600&fit=crop',
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
            Analyse Technique & Passes de Rendu
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-light max-w-3xl">
            Décomposition du processus de rendu et de la topologie 3D. Chaque
            passe représente une couche du pipeline de production.
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
              <h4 className="text-lg font-light text-white">
                Rendu & Composition
              </h4>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Éclairage 3 points studio. Passes AOV pour flexibilité en
                post-production. Color grading pour cohérence visuelle.
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
