# GUIDE — Ajouter des nouveaux projets

**Tu as 10 projets actuellement.** Pour en ajouter un 11e, voici le processus :

## 📋 Étape 1 : Ajouter le projet dans `projets.ts`

Ouvre `src/content/projets.ts` et ajoute un nouvel objet à la fin du tableau `PROJETS` :

```typescript
{
  slug: "mon-projet-slug",  // ← Unique, sans espaces
  titre: "Mon Projet – Sous-titre",
  client: "Client Name",
  resume: "Description courte du projet...",
  categorie: "Modélisation",
  annee: 2024,
  // couverture: "/images/projets/mon-projet/01-hero.jpg",  // Optionnel
  role: "Ton rôle",
  outils: ["Tool 1", "Tool 2"],
  types: ["modelisation", "design"],
  etudeCas: false,  // true si tu veux une page customisée comme Withings
  defi: "Explique le défi du projet...",
  solution: "Explique comment tu l'as résolu...",
  resultats: "Résultats obtenus (optionnel)",
}
```

C'est tout pour la donnée. La route existe déjà (`/portfolio/mon-projet-slug`).

---

## 🎨 Étape 2 : Créer une config layout (optionnel)

Si tu veux une mise en page personnalisée avec des sections d'images :

### Copie le template
```bash
cp src/content/TEMPLATE-projet-layout-config.ts src/content/mon-projet-layout-config.ts
```

### Modifie la config

```typescript
// src/content/mon-projet-layout-config.ts

import type { SectionGrid } from "@/content/withings-layout-config";

export const SECTION_1: SectionGrid = {
  colonnes: 3,  // ← Nombre de colonnes (1, 2, 3, 4, 5, 6)
  gap: "gap-4",  // ← Espacement (gap-2, gap-3, gap-4, gap-6, gap-8)
  images: [
    {
      name: "01-hero",  // ← Correspond à public/images/projets/mon-projet/01-hero.jpg
      label: "Visuel maître",
      ratio: "21/9",  // ← 21/9, 16/9, 9/16, 4/3, 3/4, 1/1
      teinte: "#14161a",  // Couleur placeholder si image manquante
      colSpan: 1,  // Sur combien de colonnes (1, 2, 3, 4)
    },
    // ... autres images
  ],
};

export const SECTIONS_MON_PROJET = [SECTION_1, /* autres sections */];
```

### Mets à jour la page `[slug]/page.tsx`

À la fin du fichier, importe tes sections et passe-les :

```typescript
// Avant la dernière accolade
import { SECTIONS_MON_PROJET } from "@/content/mon-projet-layout-config";

// Dans le rendu (si etudeCas: false)
return (
  <GenericProjetPage
    projet={projet}
    precedent={precedent}
    suivant={suivant}
    sections={projet.slug === "mon-projet-slug" ? SECTIONS_MON_PROJET : []}
  />
);
```

---

## 📷 Étape 3 : Ajouter tes images

Crée le dossier et place tes images au bon format :

```
public/images/projets/mon-projet/
├── 01-hero.jpg         (ratio 21/9 → 2520×1080)
├── 02-banner.jpg       (ratio 21/9 → 2520×1080)
├── 03-detail-1.jpg     (ratio 4/3 → 1440×1080)
├── 04-detail-2.jpg     (ratio 4/3 → 1440×1080)
└── 05-detail-3.jpg     (ratio 1/1 → 1080×1080)
```

Les ratios sont **critiques** — regarde `GUIDE_CONFIG_FLEXIBLE.md` pour les dimensions exactes.

---

## 🚀 Résumé rapide

| Étape | Action | Fichier |
|-------|--------|---------|
| 1 | Ajoute le projet | `src/content/projets.ts` |
| 2 | Crée la config (optionnel) | `src/content/mon-projet-layout-config.ts` |
| 3 | Ajoute tes images | `public/images/projets/mon-projet/` |
| 4 | Test en local | `npm run dev` |
| 5 | Push | `git add . && git commit -m "..." && git push` |

---

## 💡 Cas particuliers

### Je veux une page custom (comme Withings)

Crée un composant spécifique dans `src/components/portfolio/` (ex: `MonProjetCas.tsx`) et ajoute `etudeCas: true` dans `projets.ts`.

### Je veux garder le layout simple

Laisse `etudeCas: false` et la page affichera juste défi + solution. Zéro config besoin.

### Je veux changer les colonnes en live

Ouvre `mon-projet-layout-config.ts`, change `colonnes: 3` à `colonnes: 2`, sauve. L'effet est immédiat en local (`npm run dev`).

---

## ⚠️ Notes importantes

- Le `slug` doit être unique et en lowercase
- Les images doivent avoir le ratio exact pour pas perdre d'info
- Si une image manque, un gradient placeholder s'affiche automatiquement
- Le fichier `TEMPLATE-projet-layout-config.ts` est juste un modèle — tu peux le réutiliser sans le renommer

**Voilà. C'est un système très simple et extensible.** Aucune limite de projets. À toi de jouer ! 🎨
