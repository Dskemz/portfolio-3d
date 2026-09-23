"use client";

/** Décor commun aux volets visuels des fiches étape : grille technique + cotes d'angle. */
export function Grid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.16]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
      }}
    />
  );
}

export function Corners() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-white/25" />
      <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-white/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-white/25" />
    </>
  );
}
