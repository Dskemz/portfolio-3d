import Link from "next/link";

const LIENS_LEGAUX = [
  { libelle: "Mentions légales", href: "/mentions-legales" },
  { libelle: "Confidentialité", href: "/confidentialite" },
] as const;

const LIENS_SITE = [
  { libelle: "Services", href: "/services" },
  { libelle: "À propos", href: "/about" },
  { libelle: "Contact", href: "/contact" },
] as const;

/**
 * Composant serveur, aucun état, aucun JS envoyé au client.
 */
export default function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-mine">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-base font-medium text-papier">
              Denis Masquet
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-trait">
              Artiste 3D généraliste, visites virtuelles 3D immersives performantes et retail.
            </p>
          </div>

          <nav aria-label="Plan du site">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-trait">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5">
              {LIENS_SITE.map(({ libelle, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-papier/80 transition-colors hover:text-papier"
                  >
                    {libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informations légales">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-trait">
              Légal
            </p>
            <ul className="mt-4 space-y-2.5">
              {LIENS_LEGAUX.map(({ libelle, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-papier/80 transition-colors hover:text-papier"
                  >
                    {libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-mine pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-trait sm:flex-row sm:items-center sm:justify-between">
          <span>© {annee} Graphiste 3D</span>
          <span>Micro-entrepreneur, SIRET 880727649</span>
        </div>
      </div>
    </footer>
  );
}
