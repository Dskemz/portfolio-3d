"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import MenuMobile, { type LienNav } from "./MenuMobile";
import { jumpToTop } from "@/components/workflow/stepping";

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

  /**
   * Le logo ramène TOUJOURS en haut de l'accueil, instantanément.
   *
   * Deux cas distincts :
   *  · déjà sur "/" → aucune navigation à attendre, on saute tout de suite ;
   *  · ailleurs → on laisse Next naviguer (prefetch, historique, transitions
   *    conservés) et on note l'intention ; l'effet ci-dessous remonte la page
   *    une fois la route commise.
   *
   * Next remet bien la page en haut lors d'une navigation, mais en passant par
   * le lisseur natif de `globals.css` : d'où le second passage explicite en
   * `behavior: "auto"`, seul moyen d'obtenir un saut réellement instantané.
   */
  const veutRemonter = useRef(false);

  /**
   * Menu mobile ouvert ⇒ `body { overflow: hidden }` (menu-mobile.css) et la
   * page ne peut pas être repositionnée. On le referme d'abord ; le second
   * passage de `jumpToTop` au frame suivant s'exécute une fois le style relâché.
   */
  const fermerMenuMobile = () => {
    const menu = document.getElementById("menu-mobile");
    if (menu instanceof HTMLDetailsElement) menu.open = false;
  };

  const surClicLogo = (evenement: MouseEvent<HTMLAnchorElement>) => {
    fermerMenuMobile();

    if (pathname === "/") {
      evenement.preventDefault();
      jumpToTop();
      return;
    }
    veutRemonter.current = true;
  };

  useEffect(() => {
    if (pathname !== "/" || !veutRemonter.current) return;
    veutRemonter.current = false;
    jumpToTop();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-150">
      
      {/*
        Masque supérieur : couvre toute la hauteur de l'îlot puis se fond vers le
        bas, pour que le flux de la home s'évanouisse en approchant du haut au
        lieu de rester visible dans les marges autour de la navbar.
        Couleur = fond de page (#000), pas la couleur de l'îlot.
      */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none md:h-28"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, ${opacite}) 0%, rgba(0, 0, 0, ${
            opacite * 0.92
          }) 62%, rgba(0, 0, 0, 0) 100%)`,
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
          className="pointer-events-auto mx-auto flex h-14 w-full max-w-4xl items-center justify-between rounded-2xl border shadow-2xl px-5 md:h-16 md:px-6 transition-colors duration-150"
        >
          <Link
            href="/"
            onClick={surClicLogo}
            className="flex items-center text-papier transition-colors hover:text-[#FF7F50]"
            aria-label="Accueil — revenir en haut"
          >
            <svg
              className="h-5 w-20"
              fill="none"
              viewBox="0 0 96 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {/* Ligne principale avec une cassure de progression */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12h32m8 0h48"
              />
              {/* Point de départ */}
              <circle cx="4" cy="12" r="2" fill="currentColor" />
              {/* Nœud central "étape" */}
              <circle cx="36" cy="12" r="2" fill="currentColor" />
              {/* Point d'arrivée final */}
              <circle cx="92" cy="12" r="2" fill="currentColor" />
            </svg>
          </Link>

          {/* Navigation desktop */}
          <ul className="hidden items-center gap-7 md:flex">
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