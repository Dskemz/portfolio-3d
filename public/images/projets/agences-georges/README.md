# Images Château La Commanderie

## Guide de remplacement des images

Tous les fichiers numérotés **01 à 15** sont des **placeholders SVG** provisoires. Remplace-les par tes vraies images en gardant **exactement les mêmes noms de fichier**.

### Détail de chaque image :

| # | Nom fichier | Section | Dimensions recommandées | Description |
|---|---|---|---|---|
| **01** | `01-hero.svg` | Hero | 1920×1080px | Image plein écran paysage (fond) |
| **02** | `02-gamme-bottle-1.svg` | Gamme | ~300×480px | Bouteille 2013 (format 9:16 portrait) |
| **03** | `03-gamme-label-1.svg` | Gamme | ~400×300px | Étiquette 2013 |
| **04** | `04-gamme-bottle-2.svg` | Gamme | ~300×480px | Bouteille 2021 (format 9:16 portrait) |
| **05** | `05-gamme-label-2.svg` | Gamme | ~400×300px | Étiquette 2021 |
| **06** | `06-textures-macro-1.svg` | Textures | ~800×320px | Macro bouchon liège (paysage) |
| **07** | `07-textures-macro-2.svg` | Textures | ~320×320px | Macro étiquette+dorure (carré) |
| **08** | `08-tech-pass-08.svg` | Tech Breakdown | ~300×300px | Passe Diffuse Color (carré) |
| **09** | `09-tech-pass-09.svg` | Tech Breakdown | ~300×300px | Passe Roughness (carré) |
| **10** | `10-tech-pass-10.svg` | Tech Breakdown | ~300×300px | Wireframe topologie (carré) |
| **11** | `11-tech-pass-11.svg` | Tech Breakdown | ~300×300px | Image finale composite (carré) |
| **12** | `12-packshot-1.svg` | Packshots | ~400×600px | Packshot Rouge Classique (portrait) |
| **13** | `13-packshot-2.svg` | Packshots | ~400×600px | Packshot Blanc Prestige (portrait) |
| **14** | `14-packshot-3.svg` | Packshots | ~400×600px | Packshot Rosé Délicat (portrait) |
| **15** | `15-packshot-4.svg` | Packshots | ~400×600px | Packshot Mousseux Festif (portrait) |

---

## Comment remplacer une image ?

### Option 1 : Remplacer directement le fichier
1. Prends ta vraie image (JPG, PNG, WebP, etc.)
2. Renomme-la exactement comme le placeholder (ex: `02-gamme-bottle-1.jpg`)
3. Mets-la dans `/public/images/projets/agences-georges/`
4. Le site affiche automatiquement ta vraie image à la place du numéro

### Option 2 : Garder le même nom
```
Avant: 02-gamme-bottle-1.svg  ← placeholder
Après: 02-gamme-bottle-1.jpg  ← ta vraie image
```

### ⚠️ Important
- **Garde les numéros dans le nom de fichier** — c'est la clé pour que chaque image aille au bon endroit
- **L'extension peut changer** (.svg → .jpg, .png, .webp, etc.)
- **Les autres fichiers React ne changent pas** — tout est automatique

---

## Formats optimisés par section

### Hero (01)
- Format : paysage 16:9
- Résolution idéale : 1920×1080px ou 1280×720px
- Format fichier : JPG optimisé (~200-300KB)

### Gamme Bouteilles (02, 04)
- Format : portrait 9:16
- Résolution idéale : 300-400px de large minimum
- Format fichier : PNG transparent ou JPG

### Gamme Étiquettes (03, 05)
- Format : paysage (~4:3)
- Résolution idéale : 400×300px minimum
- Format fichier : PNG haute résolution

### Textures Macro (06, 07)
- 06 (Large) : paysage (2:1 environ)
- 07 (Carré) : carré (1:1)
- Résolution idéale : 800×320px (06) et 320×320px (07)
- Format fichier : JPG qualité élevée

### Tech Breakdown (08-11)
- Format : carré (1:1)
- Résolution idéale : 300-400px
- Format fichier : JPG ou PNG

### Packshots (12-15)
- Format : portrait (2:3)
- Résolution idéale : 400×600px minimum (ou 4K pour e-commerce)
- Format fichier : PNG 32-bit transparent ou JPG fond blanc

---

## Exemple concret

**Tu as une image `ma-bouteille-2013.jpg` de ta bouteille :**

```
public/images/projets/agences-georges/
├── 01-hero.svg
├── 02-gamme-bottle-1.svg  ← À remplacer
│
→ Renomme ta photo en : `02-gamme-bottle-1.jpg`
→ Place-la dans le dossier
│
├── 02-gamme-bottle-1.jpg  ← ✓ Automatiquement affiché à la place du placeholder
├── 03-gamme-label-1.svg
└── ...
```

C'est tout ! Aucun changement de code nécessaire.

---

## Questions techniques ?

- **Où se trouve la liste des images dans le code ?**
  - Hero : `src/components/projects/ChateauLaCommanderie/HeroSection.tsx` (ligne ~40)
  - Gamme : `src/components/projects/ChateauLaCommanderie/GammeSection.tsx` (ligne ~15)
  - Textures : `src/components/projects/ChateauLaCommanderie/TexturesSection.tsx` (ligne ~50+)
  - Tech : `src/components/projects/ChateauLaCommanderie/TechBreakdownSection.tsx` (ligne ~20)
  - Packshots : `src/components/projects/ChateauLaCommanderie/PackshotsSection.tsx` (ligne ~40)

- **Comment les textes modifiables ?**
  - Les fichiers .tsx contiennent tous les textes (titres, descriptions, etc.)
  - Cherche les balises `<h2>`, `<p>`, `<h3>` et modifie le contenu directement
  - Exemple : `<h2 className="...">Une Identité Visuelle Déclinée</h2>` → change le texte

---

**Résumé : Place tes images dans ce dossier avec les bons numéros, et c'est bon ! 🎉**
