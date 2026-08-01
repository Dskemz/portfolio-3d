import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Trois rôles, trois fontes, aucune n'est décorative.
 * - Archivo (variable, largeurs étendues) : le display. Grotesque technique,
 *   large, qui tient une identité sans passer par un serif « agence ».
 * - Instrument Sans : le texte courant. Neutre mais pas anonyme.
 * - IBM Plex Mono : la fonte utilitaire. Elle porte les données chiffrées
 *   (cotes, ratios, coordonnées), le vocabulaire du plan coté.
 */

export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const fontVariables = [
  archivo.variable,
  instrumentSans.variable,
  plexMono.variable,
].join(" ");
