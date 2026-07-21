import Link from "next/link";

interface Repere {
  cle: string;
  valeur: string;
}

const REPERES: readonly Repere[] = [
  { cle: "Discipline", valeur: "Artiste 3D généraliste & retail." },
  { cle: "Spécialité", valeur: "Optimisation .glb & Web 3D" },
  { cle: "Moteur", valeur: "Babylon.js — temps réel" },
] as const;

/**
 * Hero d'introduction — texte centré, sans 3D.
 *
 * Composant serveur : le H1 est présent dans le HTML initial, donc il porte
 * le LCP et le référencement sans dépendre du chargement de la 3D placée
 * plus bas dans la page.
 */
export default function HeroIntro() {
  return (
    <section
      aria-labelledby="hero-titre"
      className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-24 pt-36 text-center md:px-10 md:pb-32 md:pt-48"
    >

      <h1
        id="hero-titre"
        className="mt-6 font-display text-[clamp(2.3rem,6vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-papier"
      >
        Denis Masquet
        <span className="mt-2 block text-[#FF7F50]">Conception Digitale & Expériences</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-papier/80 md:text-xl">
        Artiste 3D généraliste — modélisation haute fidélité, expériences
        interactives et visites virtuelles immersives. Spécialisé en optimisation
        web et Babylon.js pour des solutions performantes et captivantes.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/visite-virtuelle"
          className="bg-[#FF7F50] px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-[#E67E22]"
        >
          Voir la solution 3D
        </Link>
        <Link
          href="/portfolio"
          className="border border-mine px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:border-trait"
        >
          Découvrir les projets
        </Link>
      </div>

      <dl className="mt-16 grid w-full grid-cols-1 border-t border-mine sm:grid-cols-3">
        {REPERES.map(({ cle, valeur }) => (
          <div
            key={cle}
            className="border-b border-mine py-5 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-trait">
              {cle}
            </dt>
            <dd className="mt-1.5 text-sm text-papier/90">{valeur}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
