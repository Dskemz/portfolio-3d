import Link from "next/link";

export interface LienNav {
  libelle: string;
  href: string;
}

interface MenuMobileProps {
  liens: readonly LienNav[];
  /** Chemin courant, fourni par la Navbar. */
  actif: string;
}

/**
 * Menu mobile — HTML natif `<details>` / `<summary>`, sans JavaScript.
 *
 * Fonctionne même sans hydratation React.
 *
 * L'`id="menu-mobile"` porté par le `<details>` n'est pas décoratif : il
 * sert de point d'accroche à la règle `body:has(#menu-mobile[open])` de
 * `globals.css`, qui floute et neutralise le reste de la page pendant
 * que le menu est ouvert. Le renommer casserait cet effet.
 */
export default function MenuMobile({ liens, actif }: MenuMobileProps) {
  const estActif = (href: string) =>
    href === "/" ? actif === "/" : actif.startsWith(href);

  return (
    <details
      id="menu-mobile"
      className="group relative -mr-6 md:-mr-10 md:hidden"
    >
      {/*
        `list-none` + la règle webkit retirent la flèche native du summary.
        `min-h-12 min-w-12` : cible tactile de 48 px (WCAG 2.5.5).
      */}
      <summary
        className="flex min-h-12 min-w-12 cursor-pointer list-none items-center justify-end pr-6 text-sm font-medium text-papier [&::-webkit-details-marker]:hidden md:pr-10"
        style={{ touchAction: "manipulation" }}
      >
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Fermer</span>
      </summary>

      {/*
        Voile d'assombrissement, purement visuel : il complète le flou que
        `globals.css` applique au contenu. `pointer-events-none` — c'est
        la règle CSS qui rend la page inerte, pas ce calque.
        Déclaré AVANT le panneau : le panneau, peint ensuite, passe
        au-dessus sans avoir besoin d'un z-index.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 top-16 bg-black/40"
      />

      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-mine bg-encre px-6 pb-8 md:px-10"
      >
        <ul>
          {liens.map(({ libelle, href }) => (
            <li key={href} className="border-b border-mine/60 last:border-b-0">
              <Link
                href={href}
                aria-current={estActif(href) ? "page" : undefined}
                className={`block py-5 font-display text-2xl tracking-tight ${
                  estActif(href) ? "text-[#FF7F50]" : "text-papier"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                {libelle}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
