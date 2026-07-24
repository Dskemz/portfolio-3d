import type { Metadata, Viewport } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

/**
 * Sora — police de tout le site (SIL Open Font License, gratuite).
 *
 * Elle est appliquée par `sora.className` sur le <body>, PAS via une classe
 * Tailwind : `font-display` et `font-body` ne génèrent aucun CSS dans ce projet
 * (le design system vit dans `tailwind.config.ts`, que Tailwind v4 ne charge
 * pas sans directive `@config`). Passer par le <body> couvre donc l'ensemble
 * des pages par héritage, quelles que soient les classes utilisées ailleurs.
 *
 * La variable `--font-display` est conservée : elle reprendra son rôle le jour
 * où la directive `@config` sera activée.
 */
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://graphite3d.fr"),
  title: {
    default: "Denis Masquet — Graphiste 3D généraliste | Graphite 3D",
    template: "%s | Graphite 3D",
  },
  description:
    "Modélisation 3D, temps réel Babylon.js et visites virtuelles immersives. Graphite 3D, studio de Denis Masquet.",
};

export const viewport: Viewport = {
  themeColor: "#14161a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Graphite 3D",
  founder: { "@type": "Person", name: "Denis Masquet" },
  url: "https://graphite3d.fr",
  areaServed: "FR",
  description:
    "Modélisation 3D, visites virtuelles interactives et intégrations web temps réel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${mono.variable}`}>
      <body
        className={`${sora.className} flex min-h-screen flex-col bg-encre text-papier antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main id="contenu" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
