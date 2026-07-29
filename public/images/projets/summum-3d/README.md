# Images Studio Summum 3D

## Guide de remplacement des images

Tous les fichiers numérotés **01 à 15** sont des **placeholders SVG** provisoires. Remplace-les par tes vraies images en gardant **exactement les mêmes noms de fichier**.

### Détail de chaque image :

| # | Nom fichier | Section | Dimensions recommandées | Description |
|---|---|---|---|---|
| **01** | `01-hero.svg` | Hero | 1920×1080px | Image plein écran d'une œuvre numérisée (paysage) |
| **02** | `02-piece-main-1.svg` | Collection | ~300×480px | Pièce 1 (veste texturée) - Vue principale portrait 9:16 |
| **03** | `03-piece-detail-1.svg` | Collection | ~400×300px | Pièce 1 - Détail texture (paysage 4:3) |
| **04** | `04-piece-main-2.svg` | Collection | ~300×480px | Pièce 2 (œuvre emblématique) - Vue principale portrait 9:16 |
| **05** | `05-piece-detail-2.svg` | Collection | ~400×300px | Pièce 2 - Détail texture (paysage 4:3) |
| **06** | `06-textures-macro-1.svg` | Photogrammétrie | ~800×400px | Macro scan brut avec artefacts (paysage 2:1) |
| **07** | `07-textures-macro-2.svg` | Photogrammétrie | ~400×400px | Macro zone nettoyée (carré 1:1) |
| **08** | `08-tech-highpoly.svg` | Breakdown | ~400×400px | Maillage haute densité photogrammétrique (carré) |
| **09** | `09-tech-lowpoly.svg` | Breakdown | ~400×400px | Topologie optimisée / low-poly (carré) |
| **10** | `10-tech-textures.svg` | Breakdown | ~400×400px | Comparaison de textures avant/après baking (carré) |
| **11** | `11-tech-final-glb.svg` | Breakdown | ~400×400px | Modèle final GLB (carré) |
| **12** | `12-showroom-1.svg` | Showroom | ~400×600px | Showroom virtuel WebGL (portrait 2:3) |
| **13** | `13-showroom-2.svg` | Showroom | ~400×600px | Musée virtuel (portrait 2:3) |
| **14** | `14-showroom-3.svg` | Showroom | ~400×600px | Vue fiche œuvre interactive (portrait 2:3) |
| **15** | `15-showroom-4.svg` | Showroom | ~400×600px | Configurateur rotation/zoom (portrait 2:3) |

---

## Comment remplacer une image ?

1. Prends ta vraie image (JPG, PNG, WebP…)
2. Renomme-la avec le même numéro (ex: `02-piece-main-1.jpg`)
3. Glisse-la dans ce dossier
4. Le site affiche automatiquement ta vraie image à la place du placeholder

### ⚠️ Important
- **Garde les numéros dans le nom de fichier** — c'est la clé du positionnement
- **L'extension peut changer** (.svg → .jpg, .png, .webp…)
- **Aucun code React à modifier** — tout est automatique

---

## Où sont les textes dans le code ?

- Hero : `src/components/projects/StudioSummum3D/HeroSection.tsx`
- Collection : `src/components/projects/StudioSummum3D/GammeSection.tsx`
- Photogrammétrie : `src/components/projects/StudioSummum3D/TexturesSection.tsx`
- Breakdown : `src/components/projects/StudioSummum3D/TechBreakdownSection.tsx`
- Showroom : `src/components/projects/StudioSummum3D/PackshotsSection.tsx`
- Footer : `src/components/projects/StudioSummum3D/ProjectFooter.tsx`

Cherche les balises `<h1>`, `<h2>`, `<h3>`, `<p>` et modifie le contenu directement.
