"use client";

import Link from "next/link";
import { useRef } from "react";

export interface LienNav {
  libelle: string;
  href: string;
}

/** ⚠️ À REMPLACER par la vraie adresse quand le domaine sera vérifié. */
const EMAIL = "contact@graphite3d.fr";

const ADRESSE = ["Rambouillet, 78120", "France"] as const;

interface MenuMobileProps {
  liens: readonly LienNav[];
  actif: string;
}

/**
 * Navigation mobile — PAGE plein écran, pas un panneau flottant.
 *
 * ⚠️ Repose sur `<details>` / `<summary>` natifs : zéro état React, zéro
 * dépendance à l'hydratation. C'est la seule implémentation qui ait fini par
 * fonctionner après quatre tentatives en JavaScript — ne pas y revenir.
 * L'`id="menu-mobile"` est le point d'accroche de `menu-mobile.css`
 * (verrou de défilement) : NE PAS le renommer.
 *
 * Le bouton est un pictogramme : trois traits fermé, un seul trait ouvert.
 * Les deux traits extérieurs disparaissent en `group-open:opacity-0`, celui du
 * milieu reste — donc aucune bascule d'icône, juste une transition d'opacité.
 */
export default function MenuMobile({ liens, actif }: MenuMobileProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const estActif = (href: string) =>
    href === "/" ? actif === "/" : actif.startsWith(href);

  const fermerMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details
      ref={detailsRef}
      id="menu-mobile"
      className="group relative -mr-6 ml-auto md:-mr-10 md:hidden"
    >
      {/*
        `relative z-10` : le panneau ci-dessous est `fixed` donc peint après le
        summary dans l'ordre du document. Sans ce z-index, il recouvrirait le
        bouton et il deviendrait impossible de refermer le menu.
      */}
      <summary
        className="relative z-10 flex min-h-12 min-w-12 cursor-pointer list-none items-center justify-end pr-6 text-zinc-200 transition-colors duration-200 [&::-webkit-details-marker]:hidden group-open:text-white md:pr-10"
        style={{ touchAction: "manipulation" }}
      >
        <span className="sr-only">Ouvrir ou fermer le menu</span>
        <span aria-hidden className="flex h-[14px] w-7 flex-col justify-between">
          <span className="h-[2px] w-full bg-current transition-opacity duration-200 group-open:opacity-0" />
          <span className="h-[2px] w-full bg-current" />
          <span className="h-[2px] w-full bg-current transition-opacity duration-200 group-open:opacity-0" />
        </span>
      </summary>

      {/*
        Page plein écran opaque : plus de flou ni de voile sur le contenu
        derrière, il est simplement recouvert. `pt-28` dégage la hauteur de
        l'îlot pour que le logo et le bouton restent visibles par-dessus.
      */}
      <div className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-black px-6 pb-10 pt-28">
        <nav aria-label="Navigation mobile" className="flex flex-col">
          {liens.map(({ libelle, href }) => (
            <Link
              key={href}
              href={href}
              onClick={fermerMenu}
              aria-current={estActif(href) ? "page" : undefined}
              className={`relative w-fit py-3 text-[clamp(2rem,9vw,2.75rem)] font-light leading-tight tracking-tight transition-colors ${
                estActif(href) ? "text-white" : "text-zinc-300"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              {libelle}
              {estActif(href) && (
                <>
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-0 h-[3px] w-full bg-[#FF7F50] opacity-45 blur-[3px]"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-0 h-px w-full bg-[#FF7F50]"
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bloc de pied — poussé en bas de l'écran par `mt-auto` */}
        <div className="mt-auto pt-16">
          <address className="not-italic">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-zinc-500">
              {ADRESSE.map((ligne) => (
                <span key={ligne} className="block">
                  {ligne}
                </span>
              ))}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              onClick={fermerMenu}
              className="mt-4 inline-block border-b border-white/40 pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-200 transition-colors hover:border-[#FF7F50] hover:text-[#FF7F50]"
              style={{ touchAction: "manipulation" }}
            >
              Nous écrire
            </a>
          </address>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            <Link
              href="/mentions-legales"
              onClick={fermerMenu}
              className="transition-colors hover:text-zinc-300"
              style={{ touchAction: "manipulation" }}
            >
              Mentions légales
            </Link>
            <span>Denis Masquet</span>
          </div>
        </div>
      </div>
    </details>
  );
}
