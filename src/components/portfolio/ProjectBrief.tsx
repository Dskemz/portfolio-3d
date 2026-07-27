import { Reveal } from "@/components/ui/Reveal";

interface ProjectBriefProps {
  defi: string;
  solution: string;
  resultats?: string;
}

/**
 * Défi artistique / solution technique, en deux colonnes. Trame éditoriale du
 * site : filet `border-mine`, surtitre mono orange, corps `text-papier/70`.
 */
export function ProjectBrief({ defi, solution, resultats }: ProjectBriefProps) {
  return (
    <section className="border-t border-mine pt-16">
      <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16" cascade>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
            Le défi
          </p>
          <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
            {defi}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
            La solution
          </p>
          <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
            {solution}
          </p>
        </div>
      </Reveal>

      {resultats && (
        <Reveal className="mt-12 border-t border-mine pt-12" delai={120}>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
            Résultats
          </p>
          <p className="mt-6 max-w-3xl text-base font-light leading-relaxed text-papier/70">
            {resultats}
          </p>
        </Reveal>
      )}
    </section>
  );
}
