import Link from "next/link";

interface LienSobreProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Bouton de navigation minimaliste : un contour fin qui se pigmente
 * d'orange au survol, sans remplissage ni ombre. Utilisé comme porte
 * d'entrée vers la grille complète et vers le contact.
 */
export default function LienSobre({
  href,
  children,
  className = "",
}: LienSobreProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 border border-mine px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-papier transition-colors duration-300 ease-sobre hover:border-bleu-encre hover:text-bleu-encre ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-sobre group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
