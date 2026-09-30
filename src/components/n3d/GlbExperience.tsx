"use client";

import { useState } from "react";
import GlbViewer from "@/components/workflow/GlbViewer";

export default function GlbExperience() {
  const [active, setActive] = useState(true);

  return (
    <div className="relative overflow-hidden border border-white/15 bg-[#17191d] shadow-2xl shadow-black/40">
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        <span className="h-2 w-2 rounded-full bg-[#FF7F50]" /> Démonstration interactive
      </div>
      <div className="relative aspect-square min-h-[360px] w-full md:min-h-[500px]">
        <GlbViewer glbUrl="/models/boussole.glb" active={active} />
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-zinc-400">
        <span>Glissez pour tourner · molette pour zoomer</span>
        <button type="button" onClick={() => setActive((value) => !value)} className="text-[#FF7F50] transition-colors hover:text-white">
          {active ? "Mettre en pause" : "Activer l'expérience"}
        </button>
      </div>
    </div>
  );
}
