'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GrosPlan {
  id: string;
  nom: string;
  image: string;
}

interface VueIsometrique {
  id: string;
  titre: string;
  description: string;
  image: string;
}

const GROS_PLANS: GrosPlan[] = [
  { id: 'pcb', nom: 'Circuit imprimé principal', image: '/images/projets/steamone/06-close-pcb.jpg' },
  { id: 'chauffe', nom: 'Élément chauffant', image: '/images/projets/steamone/07-close-chauffe.jpg' },
  { id: 'connectique', nom: 'Connectique interne', image: '/images/projets/steamone/08-close-connectique.jpg' },
  { id: 'poignee', nom: 'Ergonomie de la poignée', image: '/images/projets/steamone/09-close-poignee.jpg' },
];

const VUES_ISO: VueIsometrique[] = [
  {
    id: 'assemblage-1',
    titre: 'Assemblage vue de dessus',
    description: 'Empilement modulaire des sous-ensembles, chaîne d\'assemblage lisible',
    image: '/images/projets/steamone/10-iso-assemblage-1.jpg',
  },
  {
    id: 'assemblage-2',
    titre: 'Assemblage vue de côté',
    description: 'Flux thermique et hydraulique, parcours de l\'eau et de la vapeur',
    image: '/images/projets/steamone/11-iso-assemblage-2.jpg',
  },
];

export default function ArchitectureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const grosPlansRef = useRef<(HTMLDivElement | null)[]>([]);
  const isoRef = useRef<(HTMLDivElement | null)[]>([]);

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

      gsap.from(grosPlansRef.current, {
        opacity: 0,
        scale: 0.92,
        stagger: 0.08,
        duration: 0.7,
        ease: 'back.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(isoRef.current, {
        opacity: 0,
        x: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 35%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Architecture &amp; composants
            <br />
            <span className="text-slate-400">Dissémination technique</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4">
            Au cœur du produit, un agencement <span className="text-white">modulaire et compact</span> :
            circuit imprimé principal, éléments chauffants, connectiques internes et
            ergonomie soignée de la poignée cohabitent dans un volume restreint.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Les gros plans révèlent la précision de chaque pièce ; les vues isométriques
            d&apos;assemblage racontent la logique industrielle du montage. Deux échelles
            de lecture qui se répondent, le détail et le tout.
          </p>
        </div>

        {/* Layout riche : gros plans + vues iso */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Grille gros plans - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Gros plans composants
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Détails techniques &amp; électroniques
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {GROS_PLANS.map((plan, idx) => (
                <div
                  key={plan.id}
                  ref={(el) => { grosPlansRef.current[idx] = el; }}
                  className="group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="relative w-full h-full">
                    <img
                      src={plan.image}
                      alt={plan.nom}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                      <p className="text-[11px] md:text-xs font-light text-white leading-tight">
                        {plan.nom}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vues isométriques - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-2">
                Vues isométriques d&apos;assemblage
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Compréhension globale du produit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VUES_ISO.map((vue, idx) => (
                <div
                  key={vue.id}
                  ref={(el) => { isoRef.current[idx] = el; }}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 transition-all duration-500 group-hover:border-sky-500/50 group-hover:shadow-2xl group-hover:shadow-sky-500/10">
                    <img
                      src={vue.image}
                      alt={vue.titre}
                      className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-light text-white mb-1">{vue.titre}</h4>
                    <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                      {vue.description}
                    </p>
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
