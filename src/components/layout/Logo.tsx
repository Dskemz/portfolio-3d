import Link from "next/link";

/**
 * Logotype générique provisoire, carré orange vectoriel.
 * Remplace le nom en toutes lettres dans le coin haut-gauche de la Navbar.
 *
 * Dans Navbar.tsx :
 *     import Logo from "@/components/layout/Logo";
 *     <Logo />
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Accueil"
      className={`inline-flex items-center ${className}`}
    >
      <svg
        viewBox="0 0 28 28"
        className="h-6 w-6 md:h-7 md:w-7"
        aria-hidden
        style={{ filter: "drop-shadow(0 0 10px rgba(255,127,80,0.45))" }}
      >
        <rect x="0" y="0" width="28" height="28" fill="#FF7F50" />
      </svg>
    </Link>
  );
}
