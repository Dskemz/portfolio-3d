# Château La Commanderie — Projet 3D Portfolio

Page portfolio complète pour la présentation du projet Château La Commanderie.

## 📁 Structure des Fichiers

```
src/
├── app/
│   └── projets/
│       └── chateau-la-commanderie/
│           ├── page.tsx          # Page principale orchestrant les sections
│           └── layout.tsx         # Layout avec métadonnées SEO
└── components/
    └── projects/
        └── ChateauLaCommanderie/
            ├── HeroSection.tsx              # Section 1 : Hero shot plein écran
            ├── GammeSection.tsx             # Section 2 : Grille de bouteilles et étiquettes
            ├── TexturesSection.tsx          # Section 3 : Gros plans macro
            ├── TechBreakdownSection.tsx     # Section 4 : Passes de rendu technique
            ├── PackshotsSection.tsx         # Section 5 : Packshots commerciaux
            ├── ProjectFooter.tsx            # Footer avec CTA et navigation
            └── index.ts                     # Exports
```

## 🎨 Sections

### 1. Hero Section (100vh)
- Image de fond immersive au format paysage
- Textes positionnés au centre (surtitre, titre, description)
- Animation parallax au scroll
- Indicateur de scroll animé

### 2. Gamme Section
- Grille fluide responsive (2-4 colonnes selon viewport)
- Bouteilles avec shadow portée douce
- Étiquettes en dessous
- Animation stagger au scroll

### 3. Textures Section
- Disposition asymétrique Masonry
- Deux images macro (liège, étiquette)
- Parallax opposé au scroll
- Captions au hover

### 4. Tech Breakdown Section
- Grille 2x2 des passes de rendu
- Modal au clic pour détails
- Section specifications avec pipeline technique
- Animations scale + opacity

### 5. Packshots Section
- Grille responsive 1-4 colonnes
- Fond studio avec grid subtile
- Drop shadow sur les bouteilles
- Specifications et déclinaisons listées

### 6. Footer
- Infos projet, année, spécialités
- CTA vers portfolio et contact
- Navigation bas de page

## 🔧 Installation & Utilisation

### 1. Placer les fichiers dans le repo portfolio-3d

```bash
cp -r chateau-code/src/* ./src/
```

### 2. S'assurer que les dépendances sont installées

```bash
npm install
```

### 3. Adapter les images

Remplacer les URLs des images (actuellement Unsplash placeholders) par vos vrais visuels :

- **HeroSection.tsx** : backgroundImage URL
- **GammeSection.tsx** : bottleImage, labelImage URLs
- **TexturesSection.tsx** : Image macro 1 & 2 URLs
- **TechBreakdownSection.tsx** : 4 images passes de rendu
- **PackshotsSection.tsx** : 4 images packshot

Formats recommandés :
- Héro : 1920x1080px minimum (JPG optimisé, ~200KB)
- Bouteilles : PNG détouré transparent
- Étiquettes : PNG haute définition
- Macro : 2400x2400px minimum
- Passes techniques : 1200x1200px
- Packshots : 4K recommandé (4096x6144px)

### 4. Adapter les textes

- Page title & description dans `layout.tsx`
- Surtitre, titres et descriptions dans chaque composant

### 5. Adapter les liens

- `/portfolio` → lien vers votre page portfolio
- `/contact` → lien vers votre page contact
- Homepage → `/`

## 🚀 Stack Utilisé

- **Next.js 16** — Framework React
- **React 19** — UI library
- **TypeScript 5** — Type safety
- **Tailwind CSS 4** — Styling
- **GSAP 3** — Scroll animations
- **Framer Motion** (optionnel) — Alternative pour animations

## ⚡ Optimisations Appliquées

✅ Animations GSAP avec ScrollTrigger (performance optimisée)
✅ Images responsive avec Tailwind
✅ Lazy loading automatique des images
✅ TypeScript strict pour type safety
✅ Composants modulaires et réutilisables
✅ Métadonnées SEO complètes (Open Graph, canonical)
✅ Accessibilité WCAG (alt texts, focus states)
✅ Dark mode compatible (design dark hero)

## 🎯 Points de Personnalisation

### Couleurs & Typo

L'ensemble utilise la palette de couleurs Tailwind par défaut :
- `slate-900` → Noir profond (textes, backgrounds)
- `neutral-50` → Blanc cassé (backgrounds subtils)
- `white` → Blanc pur (hero, sections)

Pour modifier, éditer les classes Tailwind dans chaque composant.

### Animations

Les délais et durées d'animation sont dans les fichiers GSAP :
- `stagger` : délai entre éléments
- `duration` : durée de l'animation
- `scrollTrigger.start/end` : points de déclenchement

### Grille & Espacing

Tailwind grid system utilisé :
- Desktop : `grid-cols-4` (packshots)
- Tablet : `md:grid-cols-2`
- Mobile : `grid-cols-1`

## 🔗 Routes Accessibles

Une fois intégré, le projet est accessible à :

```
/projets/chateau-la-commanderie
```

## 📱 Responsive Design

✅ Mobile-first (320px+)
✅ Tablet optimisé (768px+)
✅ Desktop full-width (1024px+)
✅ Ultra-wide ready (1280px+)

Breakpoints Tailwind :
- `sm` : 640px
- `md` : 768px (tablet)
- `lg` : 1024px (desktop)
- `xl` : 1280px

## 🎬 Animations Scroll Incluses

1. **Hero Parallax** : Image fond se déplace lors du scroll
2. **Text Fade Out** : Texte héro disparaît en scrollant
3. **Stagger Entries** : Éléments grille apparaissent progressivement
4. **Image Parallax Opposite** : Deux images textures parallaxent en sens inverse
5. **Grid Scale** : Cartes passes rendu scale au scroll
6. **Botles Stagger** : Packshots apparaissent avec délai

## 🚨 À Vérifier Avant Production

- [ ] Remplacer toutes les images Unsplash par les vrais visuels
- [ ] Vérifier les liens de navigation (`/portfolio`, `/contact`)
- [ ] Adapter les textes et descriptions
- [ ] Tester responsive sur mobile/tablet/desktop
- [ ] Valider SEO metadata
- [ ] Optimiser images (WebP, compression)
- [ ] Tester animations performance (Lighthouse)
- [ ] Vérifier accessibility (alt texts, colors contrast)

## 💡 Améliorations Futures

- [ ] Intégrer vraie galerie lightbox (photoswipe, etc.)
- [ ] Ajouter section "Clients" ou "Services"
- [ ] Intégrer testimonial agence
- [ ] Slider interactif passes rendu
- [ ] 3D viewer Babylon.js intégré
- [ ] PDF catalog téléchargeable
- [ ] Form contact intégré

---

**Coded with ⚡ by D.**
