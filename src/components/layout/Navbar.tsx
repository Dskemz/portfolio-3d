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

/**
 * ⚠️ À REMPLACER par les vraies URL de profil.
 * Isolées en tête de fichier : une seule ligne à changer pour chacune.
 */
const RESEAUX = [
  { nom: "LinkedIn", href: "https://www.linkedin.com/" },
  { nom: "Instagram", href: "https://www.instagram.com/" },
] as const;

/** Distance de scroll (px) sur laquelle le fond passe de transparent à opaque. */
const DISTANCE_FONDU = 120;

/** Icônes tracées au trait, pour rester dans la sobriété du reste de la navbar. */
function IconeReseau({ nom }: { nom: (typeof RESEAUX)[number]["nom"] }) {
  if (nom === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.2 10.6v6.2" />
      <circle cx="7.2" cy="7.3" r="1" fill="currentColor" stroke="none" />
      <path d="M11.2 16.8v-6.2" />
      <path d="M11.2 13.4a2.6 2.6 0 0 1 5.2 0v3.4" />
    </svg>
  );
}

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
      */}
      <div
        className="absolute inset-x-0 top-0 z-0 h-24 pointer-events-none md:h-28"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, ${opacite}) 0%, rgba(0, 0, 0, ${
            opacite * 0.92
          }) 62%, rgba(0, 0, 0, 0) 100%)`,
        }}
      />

      {/*
        `relative z-10` : SANS ça, le masque ci-dessus recouvrait l'îlot.
        Il est `absolute` (donc peint avec les descendants positionnés) tandis
        que ce conteneur est `static` (peint plus tôt), l'ordre de peinture CSS
        le faisait donc passer AU-DESSUS de la navbar.
      */}
      <div className="relative z-10 pt-4 px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Navigation principale"
          style={{
            backgroundColor: `rgba(20, 22, 26, ${Math.max(opacite * 0.94, 0.75)})`,
            borderColor: `rgba(60, 65, 72, ${Math.max(opacite, 0.3)})`,
          }}
          className="pointer-events-auto relative mx-auto flex h-14 w-full max-w-4xl items-center justify-between rounded-2xl border px-5 shadow-2xl transition-colors duration-150 md:h-16 md:px-6"
        >
          <Link
            href="/"
            onClick={surClicLogo}
            className="flex shrink-0 items-center text-white transition-colors duration-200 hover:text-[#ed8936]"
            aria-label="Accueil, revenir en haut"
          >
            <svg
              className="h-6 w-auto"
              viewBox="0 0 40 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Point de départ */}
              <circle cx="4" cy="4" r="2" fill="currentColor" />
              {/* Trait avec coude arrondi, espace et raccord */}
              <path
                d="M4 6V14C4 16 6 18 8 18H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18 18H22C24 18 26 20 26 22V24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="26" cy="22" r="2" fill="currentColor" />
            </svg>
          </Link>

          {/* Onglets, parfaitement centrés au milieu de la barre */}
          <ul className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {LIENS.map(({ libelle, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={estActif(href) ? "page" : undefined}
                  className={`relative inline-block whitespace-nowrap text-sm transition-colors duration-200 ${
                    estActif(href) ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {libelle}
                  {/*
                    Trait corail sous l'onglet SÉLECTIONNÉ uniquement.
                    Le halo est un second trait flouté par `blur-[3px]` : aucun
                    filtre SVG, donc aucun coût de rastérisation au défilement.
                  */}
                  {estActif(href) && (
                    <>
                      <span
                        aria-hidden
                        className="absolute -bottom-1.5 left-0 h-[3px] w-full bg-[#FF7F50] opacity-45 blur-[3px]"
                      />
                      <span
                        aria-hidden
                        className="absolute -bottom-1.5 left-0 h-px w-full bg-[#FF7F50]"
                      />
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Réseaux, tout à droite de la barre */}
          <div className="hidden items-center gap-4 md:flex">
            {RESEAUX.map(({ nom, href }) => (
              <a
                key={nom}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nom}
                className="text-zinc-500 transition-colors duration-200 hover:text-[#FF7F50]"
              >
                <IconeReseau nom={nom} />
              </a>
            ))}
          </div>

          {/* Navigation mobile, HTML natif, sans JavaScript. */}
          <MenuMobile liens={LIENS} actif={pathname} />
        </nav>
      </div>
    </header>
  );
}
