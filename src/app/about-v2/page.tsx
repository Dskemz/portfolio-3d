import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "M3D Studio — Studio création solutions 3D",
  description: "M3D Studio : studio de création spécialisé dans les solutions 3D universelles.",
};

const solutions = [
  ["01", "PRISM", "Écosystème visite 3D automatisée. Du plan 2D au viewer interactif avec gestion centralisée et branding client."],
  ["02", "N3D Moteur", "Infrastructure graphique universelle : viewer, studio, générateur, système de variantes. Config-driven et production-ready."],
  ["03", "N3D Studio", "Photo 4K, vidéo, export RTT, exploded views. Transformation de produits bruts en contenus premium."],
] as const;

export default function AProposV2() {
  return <main className="overflow-hidden bg-[#f7f4ee] text-[#171717]">
    <section className="relative bg-[#e6ded1] px-5 py-6 sm:px-10 lg:px-16">
      <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#171717]/55"><span>M3D Studio</span><span>À propos — 01</span></div>
      <div className="mx-auto mt-20 max-w-7xl lg:mt-32"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#df4f37]">M3D Studio</p><h1 className="mt-8 max-w-6xl font-display text-[clamp(3.6rem,10vw,11rem)] font-semibold leading-[0.8] tracking-[-0.09em]">Créateur de solutions 3D universelles.</h1><p className="mt-14 max-w-3xl text-xl leading-8 text-[#171717]/70">Nous transformons la manière dont les marques présentent leurs produits et services à travers le moteur graphique N3D et l&apos;écosystème PRISM.</p></div>
    </section>
    <section className="bg-[#171717] px-6 py-28 text-[#f7f4ee] sm:px-10 lg:px-16 lg:py-40"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#df4f37]">Nos solutions</p><div className="mt-16">{solutions.map(([number,title,text]) => <article key={title} className="grid gap-6 border-t border-[#f7f4ee]/20 py-10 lg:grid-cols-[0.12fr_0.45fr_1fr] lg:items-start"><span className="text-sm font-bold text-[#df4f37]">{number}</span><h2 className="font-display text-4xl font-semibold leading-[0.9] tracking-[-0.06em]">{title}</h2><p className="max-w-xl text-base leading-7 text-[#f7f4ee]/65">{text}</p></article>)}</div></div></section>
    <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-40"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#df4f37]">Notre vision</p><p className="mt-14 max-w-5xl text-2xl leading-[1.35] tracking-[-0.03em] sm:text-4xl">M3D Studio est un studio de création spécialisé dans les solutions 3D universelles. Fondé sur l&apos;expertise en modélisation 3D haute-fidélité et rendu Babylon.js, nous concevons des expériences interactives clef-en-main pour le retail, l&apos;immobilier, les musées, et l&apos;industrie. Nous ne faisons pas du freelance sur mesure. Nous bâtissons des produits. C&apos;est pourquoi nous avons créé N3D, notre moteur graphique universel, et PRISM, notre écosystème de visite 3D automatisée. Nous croyons en la qualité plutôt que la quantité. Chaque solution est testée en production avant déploiement. Notre approche avec Withings, Mesplaques, Cartoon prouve la fiabilité de nos produits. L&apos;automatisation est au cœur de notre vision : moins d&apos;intervention manuelle signifie meilleure scalabilité client et plus de rentabilité.</p></div></section>
    <section className="relative bg-[#df4f37] px-6 py-28 text-[#171717] sm:px-10 lg:px-16 lg:py-40"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.22em]">Commencer</p><h2 className="mt-14 max-w-5xl font-display text-[clamp(3rem,7vw,8rem)] font-semibold leading-[0.82] tracking-[-0.08em]">Prêt à déployer une solution N3D pour votre cas d&apos;usage ?</h2><p className="mt-12 max-w-2xl text-lg leading-8 text-[#171717]/75">Consultez nos études de cas ou contactez-nous pour explorer comment PRISM, N3D Studio ou N3D Générateur peuvent transformer votre approche.</p><div className="mt-10 flex flex-wrap gap-3"><Link href="/portfolio" className="bg-[#171717] px-6 py-4 text-sm font-medium text-[#f7f4ee]">Voir nos projets</Link><Link href="/contact" className="border border-[#171717]/40 px-6 py-4 text-sm font-medium">Nous contacter</Link></div></div></section>
  </main>;
}
