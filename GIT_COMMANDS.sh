#!/bin/bash

# Commandes Git pour intégrer la section Hero dans le portfolio Graphite 3D
# Utilisation: bash GIT_COMMANDS.sh

# 1. Ajouter tous les fichiers modifiés/nouveaux
git add \
  src/components/hero/HeroLayout.tsx \
  src/components/hero/HeroContent.tsx \
  src/components/hero/ModelViewer.tsx \
  src/components/hero/index.ts \
  src/types/hero.ts \
  src/app/fonts.ts \
  src/app/globals.css \
  tailwind.config.ts

# 2. Commit
git commit -m "feat: Add Hero section with Bento Grid responsive layout

- HeroLayout (serveur): Structure globale + grille 12-col responsive
- HeroContent (client): Texte, CTA, repères
- ModelViewer (client): Viewer 3D avec gestion d'état de chargement
- Types TypeScript: Interface pour composants et propriétés
- Tailwind config: Tokens de couleur Graphite 3D (encre, mine, trait, bleu)
- Fonts: Archivo, Instrument Sans, IBM Plex Mono
- Styles globaux: Variables CSS, palette sombre

Grid responsive:
- Mobile (col-span-1): Texte et viewer empilés
- Desktop (md+): Texte (col-span-5), Viewer (col-span-7)

Performance:
- model-viewer chargé via lazyOnload (async)
- État de chargement géré (idle → loading → ready | error)
- Mesure dynamique des dimensions (Bento Grid signature)
- Zéro CLS grâce au aspect-ratio fixe

SEO:
- H1 structuré et unique
- Metadata et JSON-LD (ProfessionalService)
- Mots-clés cibles intégrés
"

# 3. Push vers la branche courante
git push origin HEAD

echo "✅ Hero section intégrée avec succès!"
