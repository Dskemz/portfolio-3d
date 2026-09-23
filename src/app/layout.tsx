import type { Metadata, Viewport } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

/**
 * Sora, police de tout le site (SIL Open Font License, gratuite).
 *
 * Les variables exposées ici s'appellent `--font-sora` et `--font-plex-mono`,
 * PAS `--font-display` / `--font-mono` : ces deux derniers noms sont ceux des
 * tokens Tailwind déclarés dans le bloc `@theme` de globals.css, et réutiliser
 * le même nom produirait une référence circulaire
 * (`--font-display: var(--font-display)`), donc une fonte jamais résolue.
 *
 * Depuis la restauration du bloc `@theme`, `font-display`, `font-body` et
 * `font-mono` génèrent à nouveau du CSS. `sora.className` reste néanmoins sur
 * le <body> : il garantit la fonte par héritage même sur les éléments qui ne
 * portent aucune classe de fonte.
 */
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://graphite3d.fr"),
  title: {
    default: "M3D Studio — Moteur graphique N3D",
    template: "%s | M3D Studio",
  },
  description:
    "M3D Studio. Création de solutions 3D avec moteur graphique N3D",
  openGraph: {
    title: "M3D Studio — Moteur graphique N3D",
    description: "M3D Studio. Création de solutions 3D avec moteur graphique N3D",
  },
};

export const viewport: Viewport = {
  themeColor: "#14161a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "M3D Studio",
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
        {/*
          Sans ça, un rechargement restaure la position de scroll précédente
          (comportement par défaut du navigateur, `history.scrollRestoration`
          vaut "auto") : la page semble démarrer en plein milieu du contenu
          noir au lieu du haut. Script synchrone, avant tout le reste du
          <body>, pour couper court avant la première peinture.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);",
          }}
        />
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
