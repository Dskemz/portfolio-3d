import Link from "next/link";
import ReturnToUniverseOnWheel from "@/components/portfolio/ReturnToUniverseOnWheel";

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReturnToUniverseOnWheel />
      {children}
      <Link
        href="/portfolio"
        className="fixed left-5 top-5 z-[100] inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#090c11]/80 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
        aria-label="Retour à l’univers Nexus"
      >
        <span aria-hidden="true">←</span>
        Retour à l’univers
      </Link>
    </>
  );
}
