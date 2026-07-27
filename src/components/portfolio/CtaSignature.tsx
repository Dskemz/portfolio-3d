import Link from "next/link";
import { FiletAnime } from "@/components/portfolio/FiletAnime";

/**
 * Bloc d'appel à l'action signature — « Un projet en tête, discutons-en ».
 * Filet lumineux (net orange + halo flouté) partant de la fin du titre, sur le
 * modèle de /contact. Partagé par la page hub et les pages projet.
 */
export function CtaSignature() {
  return (
    <section className="mx-auto w-full max-w-6xl border-t border-mine px-6 py-20 lg:px-16 lg:py-28 xl:px-24">
      <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait lg:pt-4">
          On en parle ?
        </p>

        <div className="mt-8 lg:mt-0">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-light leading-[1.2] tracking-tight text-papier">
            Un projet en tête,{" "}
            <span className="relative inline-block">
              discutons-en
              <FiletAnime top="0.7em" />
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-sm font-light leading-relaxed text-papier/60 md:text-base">
            Une intention architecturale, un produit à mettre en valeur, une
            visite à faire vivre dans le navigateur ? Décrivez-moi votre besoin,
            je vous réponds sous 24 heures.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block border border-mine px-8 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-papier transition-colors duration-300 ease-sobre hover:border-bleu-encre hover:text-bleu-encre"
            >
              Discuter de votre projet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
