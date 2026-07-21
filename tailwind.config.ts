import type { Config } from "tailwindcss";

/**
 * Design system « Graphite » — thème sombre, accent unique et sobre.
 *
 * Les gris ne sont pas neutres : ils tirent légèrement vers le bleu-vert,
 * comme la mine de graphite. Un gris parfaitement neutre sur fond noir
 * paraît sale ; cette dérive de teinte est ce qui donne au thème sa densité.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Rampe graphite — du fond au texte */
        graphite: {
          950: "#0e1013", // fond le plus profond, sections en creux
          900: "#14161a", // fond de page (= encre)
          800: "#1b1e23", // surfaces surélevées, cartes
          700: "#252930", // bordures marquées
          600: "#3c4148", // bordures par défaut (= mine)
          500: "#5a6068", // séparateurs sur fond clair
          400: "#8b9199", // texte secondaire, cotes (= trait)
          300: "#b4b9bf", // texte tertiaire
          100: "#e6e7e5", // texte sur fond sombre, variante douce
          50: "#f2f2f0", // texte principal (= papier)
        },

        /* Accent unique — encre bleue, réservé à l'interactif */
        encreBleue: {
          600: "#2f2cb8",
          500: "#3d3ad1", // état par défaut
          400: "#6c69ea", // survol, liens, surtitres
          300: "#9a98f2",
        },

        /* Alias conservés pour ne rien casser dans les composants existants */
        encre: "#14161a",
        mine: "#3c4148",
        trait: "#8b9199",
        papier: "#f2f2f0",
        "bleu-encre": "#3d3ad1",
        "bleu-encre-clair": "#6c69ea",
      },

      fontFamily: {
        display: ["var(--font-archivo)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-instrument-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },

      /* Échelle typographique — interlignage et interlettrage liés à la taille */
      fontSize: {
        "etiquette": ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.2em" }],
        "surtitre": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.28em" }],
        "corps-sm": ["0.875rem", { lineHeight: "1.6" }],
        "corps": ["1rem", { lineHeight: "1.7" }],
        "corps-lg": ["1.125rem", { lineHeight: "1.65" }],
        "titre-sm": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "titre": ["2rem", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "titre-lg": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "affiche": ["4rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },

      /* Deux graisses seulement : le display porte l'identité, pas le gras */
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
      },

      spacing: {
        "cote-decalage": "1.75rem",
        "section": "6rem",
        "section-lg": "8rem",
      },

      borderRadius: {
        /* Angles vifs : le thème graphite est un thème de plan technique */
        none: "0",
        DEFAULT: "0",
        bento: "0.125rem",
      },

      transitionTimingFunction: {
        sobre: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
