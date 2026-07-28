'use client';

import React from 'react';
import Link from 'next/link';

export default function ProjectFooter() {
  return (
    <footer className="w-full bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="px-6 md:px-12 lg:px-20 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-20">
            <div>
              <h4 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-4">
                Projet
              </h4>
              <h3 className="text-2xl md:text-3xl font-light text-white">
                Château La Commanderie
              </h3>
              <p className="text-sm text-slate-400 font-light mt-2">
                George Agence
              </p>
            </div>

            <div>
              <h4 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-4">
                Année
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                2013 - 2021
              </p>
            </div>

            <div>
              <h4 className="text-xs font-light text-slate-400 uppercase tracking-widest mb-4">
                Spécialités
              </h4>
              <div className="flex flex-wrap gap-2">
                {['3D Modeling', 'Texturing', 'Rendering', 'Packaging'].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="text-xs font-light text-slate-300 border border-slate-600 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Description & CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                Accompagnement complet d'une marque de vin : de la modélisation
                3D des bouteilles à la composition studio, en passant par
                l'évolution cohérente de l'identité visuelle sur plusieurs
                millésimes.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 text-sm md:text-base font-light text-white hover:text-slate-300 transition-colors duration-300 w-fit"
              >
                <span>Voir tous les projets</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-slate-900 font-light text-sm md:text-base rounded-lg hover:bg-slate-100 transition-colors duration-300 w-fit"
              >
                Discutons de votre projet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-light">
            <p>© 2024 D. — Freelance Designer & Developer</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white font-light transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/portfolio"
              className="text-xs text-slate-400 hover:text-white font-light transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/services"
              className="text-xs text-slate-400 hover:text-white font-light transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-xs text-slate-400 hover:text-white font-light transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
