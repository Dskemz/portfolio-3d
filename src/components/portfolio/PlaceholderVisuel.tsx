interface PlaceholderVisuelProps {
  /** Libellé discret décrivant le visuel à venir. */
  label: string;
  /** Ratio d'affichage. */
  ratio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9" | "9/16";
  /** Teinte de fond (rampe graphite). */
  teinte?: string;
  className?: string;
}

const RATIOS: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

/**
 * Encart de couleur épuré tenant lieu de visuel non encore intégré. Aplat
 * graphite, liseré orange émissif (net + halo flouté) au survol, et un petit
 * libellé mono en filigrane pour identifier le cadre. Retirer ce composant au
 * profit d'un <Image> une fois les rendus livrés.
 */
export function PlaceholderVisuel({
  label,
  ratio = "16/9",
  teinte = "#1b1e23",
  className = "",
}: PlaceholderVisuelProps) {
  return (
    <div
      className={`group relative overflow-hidden ${RATIOS[ratio] ?? RATIOS["16/9"]} ${className}`}
      style={{ backgroundColor: teinte }}
    >
      {/* Grille de repère très discrète */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ff7f50 1px, transparent 1px), linear-gradient(to bottom, #ff7f50 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Libellé */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <span className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-papier/30">
          {label}
        </span>
      </div>

      {/* Liseré émissif au survol, net + halo flouté */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-orange-500/10 transition-colors duration-300 group-hover:border-orange-500/40"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-transparent blur-[3px] transition-colors duration-300 group-hover:border-orange-500/25"
      />
    </div>
  );
}
