"use client";

import { useRef } from "react";
import Link from "next/link";

export interface LienNav {
  libelle: string;
  href: string;
}

interface MenuMobileProps {
  liens: readonly LienNav[];
  actif: string;
}

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
      className="group relative -mr-6 md:-mr-10 md:hidden"
    >
      <summary
        className="flex min-h-12 min-w-12 cursor-pointer list-none items-center justify-end pr-6 text-sm font-medium text-papier [&::-webkit-details-marker]:hidden md:pr-10"
        style={{ touchAction: "manipulation" }}
      >
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Fermer</span>
      </summary>

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
                onClick={fermerMenu}
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