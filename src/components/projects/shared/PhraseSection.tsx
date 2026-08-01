import React from 'react';

interface PhraseSectionProps {
  /** Phrase de transition affichée en blanc sur fond sombre. */
  children: React.ReactNode;
}

/**
 * Phrase de transition entre la première et la deuxième partie d'une étude de
 * cas : simple texte blanc centré sur fond noir, sans encart coloré.
 */
export default function PhraseSection({ children }: PhraseSectionProps) {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <p className="max-w-4xl mx-auto text-center text-2xl md:text-3xl lg:text-4xl font-light italic text-white leading-tight">
        {children}
      </p>
    </section>
  );
}
