# GUIDE — Configuration Flexible Withings

Tu n'as besoin de toucher qu'**un seul fichier** : `src/content/withings-layout-config.ts`

## Exemple 1 : Changer le nombre de colonnes

**Dans le fichier de config :**
```typescript
export const SECTION_CHAPITRE_1: SectionGrid = {
  colonnes: 3,  // ← CHANGE ICI : 2, 3, 4, 5, 6
  gap: "gap-4",
  images: [ ... ]
};
```

**Résultat automatique :**
- `colonnes: 3` → 3 images côte à côte
- `colonnes: 2` → 2 images côte à côte (plus larges)
- `colonnes: 4` → 4 images côte à côte (plus petites)

Les ratios s'ajustent tout seul, tout s'adapte.

---

## Exemple 2 : Changer le ratio d'une image

**Dans le fichier de config :**
```typescript
export const SECTION_CHAPITRE_1: SectionGrid = {
  colonnes: 3,
  gap: "gap-4",
  images: [
    {
      name: "02b-face-38",
      label: "38mm",
      ratio: "4/3",  // ← CHANGE ICI : "21/9", "16/9", "9/16", "4/3", "3/4", "1/1"
      teinte: "#20242a",
      colSpan: 1,
    },
    // ... autres images
  ]
};
```

**Résultats :**
- `ratio: "4/3"` → paysage modéré
- `ratio: "16/9"` → paysage large
- `ratio: "9/16"` → portrait (haute)
- `ratio: "1/1"` → carré

---

## Exemple 3 : Changer l'espacement

**Dans le fichier de config :**
```typescript
export const SECTION_CHAPITRE_1: SectionGrid = {
  colonnes: 3,
  gap: "gap-6",  // ← CHANGE ICI : "gap-2", "gap-3", "gap-4", "gap-6", "gap-8"
  images: [ ... ]
};
```

Plus le nombre est haut, plus l'espacement est grand.

---

## Exemple 4 : Image qui s'étend sur plusieurs colonnes

Utile pour faire de l'asymétrie.

**Dans le fichier de config :**
```typescript
{
  name: "05-boucle",
  label: "Boucle déployante",
  ratio: "1/1",
  teinte: "#1b1e23",
  colSpan: 2,  // ← S'étend sur 2 colonnes
}
```

Si tu as une grille de 4 colonnes (`colonnes: 4`), cette image prendra 2 colonnes de large.

---

## Comment ça marche dans le code

Dans `EtudeCasWithings.tsx`, tu appelles juste :

```tsx
import { SECTION_CHAPITRE_1 } from "@/content/withings-layout-config";
import { SectionGridWithings } from "./SectionGridWithings";

// ...dans le composant :
<SectionGridWithings section={SECTION_CHAPITRE_1} />
```

C'est tout. Le composant lit la config et génère la grille automatiquement.

---

## Récapitulatif des paramètres

| Paramètre | Valeurs | Exemple |
|-----------|---------|---------|
| `colonnes` | 1, 2, 3, 4, 5, 6 | `colonnes: 3` |
| `gap` | gap-2, gap-3, gap-4, gap-6, gap-8 | `gap: "gap-4"` |
| `ratio` | 21/9, 16/9, 9/16, 4/3, 3/4, 1/1 | `ratio: "4/3"` |
| `colSpan` | 1, 2, 3, 4 | `colSpan: 2` |

---

**Voilà. Tu changes des nombres, tout s'adapte. C'est tout ce que tu dois faire.**
