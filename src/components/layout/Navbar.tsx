"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MenuMobile, { type LienNav } from "./MenuMobile";

const LIENS: readonly LienNav[] = [
  { libelle: "Visite Virtuelle", href: "/visite-virtuelle" },
  { libelle: "Projets", href: "/portfolio" },
  { libelle: "À propos", href: "/about" },
  { libelle: "Contact", href: "/contact" },
] as const;

/** Distance de scroll (px) sur laquelle le fond passe de transparent à opaque. */
const DISTANCE_FONDU = 120;

/**
 * Navbar fixe flottante en îlot.
 *
 * Le fond s'assombrit en fondu continu sur les 120 premiers pixels de
 * défilement plutôt que par bascule à un seuil : même rendu progressif
 * sur mobile et sur desktop.
 *
 * La navigation mobile est déléguée à `MenuMobile`, qui repose sur
 * `<details>` / `<summary>` et ne dépend d'AUCUN JavaScript. Le seul
 * JavaScript restant dans ce fichier pilote l'opacité du fond : s'il
 * échoue, le menu continue de fonctionner.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [opacite, setOpacite] = useState(0);

  useEffect(() => {
    const surDefilement = () => {
      setOpacite(Math.min(window.scrollY / DISTANCE_FONDU, 1));
    };
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  const estActif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-150">
      
      {/* 
        Dégradé supérieur invisible pour cacher le contenu qui défile 
        dans la marge au-dessus de la navbar flottante.
      */}
      <div 
        className="absolute inset-x-0 top-0 h-6 pointer-events-none transition-opacity duration-150"
        style={{
          background: `linear-gradient(to bottom, rgba(20, 22, 26, ${opacite}) 0%, rgba(20, 22, 26, 0) 100%)`,
        }}
      />

      {/* 
        Le pt-4 décolle la navbar du haut. 
        pointer-events-auto rend la navbar cliquable (car le parent est none).
      */}
      <div className="pt-4 px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Navigation principale"
          style={{
            backgroundColor: `rgba(20, 22, 26, ${Math.max(opacite * 0.94, 0.75)})`,
            borderColor: `rgba(60, 65, 72, ${Math.max(opacite, 0.3)})`,
          }}
          className="pointer-events-auto mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl border shadow-2xl backdrop-blur-md px-6 md:h-20 md:px-8 transition-colors duration-150"
        >
          <Link
  href="/"
  className="flex items-center text-papier transition-colors hover:text-[#FF7F50]"
  aria-label="Accueil"
>
  <svg
    className="h-6 w-24"
    fill="none"
    viewBox="0 0 96 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    {/* Premier segment horizontal avec un point à chaque extrémité */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16h32"
    />
    <circle cx="4" cy="16" r="2" fill="currentColor" />
    <circle cx="36" cy="16" r="2" fill="currentColor" />

    {/* Liaison en diagonale et second segment horizontal plus haut */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M42 16l8-8h42"
    />
    
    {/* Point final à l'extrémité haute */}
    <circle cx="92" cy="8" r="2" fill="currentColor" />
  </svg>
</Link>

          {/* Navigation desktop */}
          <ul className="hidden items-center gap-8 md:flex">
            {LIENS.map(({ libelle, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={estActif(href) ? "page" : undefined}
                  className={`text-sm transition-colors ${
                    estActif(href) ? "text-papier" : "text-trait hover:text-papier"
                  }`}
                >
                  {libelle}
                </Link>
              </li>
            ))}
          </ul>

          {/* Navigation mobile — HTML natif, sans JavaScript. */}
          <MenuMobile liens={LIENS} actif={pathname} />
        </nav>
      </div>
    </header>
  );
}