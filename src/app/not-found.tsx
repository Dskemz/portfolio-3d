import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 pb-24 pt-40 text-center md:px-10 md:pb-32 md:pt-52">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-trait">
        Erreur 404
      </p>
      <h1 className="mt-5 font-display text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold tracking-tight text-papier">
        Cette page n'existe pas
      </h1>
      <p className="mt-5 text-base leading-relaxed text-papier/75">
        Le lien est peut-être obsolète. Revenez à l'accueil pour retrouver la
        démonstration et les prestations.
      </p>
      <Link
        href="/"
        className="mt-9 inline-block bg-bleu-encre px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-bleu-encre-clair"
      >
        Retour à l'accueil
      </Link>
    </section>
  );
}
