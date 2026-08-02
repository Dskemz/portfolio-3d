'use client';

import React from 'react';
import Link from 'next/link';

export default function ProjectFooter() {
  return (
    <footer className="w-full bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="gouttiere py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-20">
            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
                Projet
              </h4>
              <h3 className="text-2xl md:text-3xl font-light text-white">
                Le Cartoon mis en scène
              </h3>
              <p className="text-sm text-neutral-500 font-light mt-2">
                Créations Originales
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
                Univers
              </h4>
              <p className="text-lg md:text-xl font-light text-white">
                Cartoon &amp; Design ludique
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
                Spécialités
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Modélisation 3D', 'Character Design', 'Mise en scène', 'Rendu'].map(
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
                Une série de créations 3D originales et ludiques : personnages,
                mises en scène colorées et compositions décalées, pensées comme
                de petites histoires visuelles au rendu net et « clean ».
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
                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300 font-light text-black text-sm md:text-base rounded-lg hover:bg-neutral-700 transition-colors duration-300 w-fit"
              >
                Discutons de votre projet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="gouttiere py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 font-light">
            <p>© 2024 D. Freelance Designer &amp; Developer</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white font-light transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/portfolio"
              className="text-xs text-neutral-400 hover:text-white font-light transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/services"
              className="text-xs text-neutral-400 hover:text-white font-light transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-xs text-neutral-400 hover:text-white font-light transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
