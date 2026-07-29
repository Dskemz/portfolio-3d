# Configuration des Images — Château La Commanderie

Ce fichier liste toutes les URLs d'images à remplacer par vos visuels réels.

## 🖼️ Images à Remplacer

### HeroSection.tsx

```typescript
backgroundImage: 'url("REMPLACER_PAR_IMAGE_HERO")'
```

**Spécifications :**
- Format : Paysage (16:9)
- Résolution : 1920x1080px minimum
- Fichier : JPG optimisé (~200-300KB)
- Description : Image plein écran immersive du produit ou de la mise en scène

---

### GammeSection.tsx

**Bouteilles (8 URLs à adapter) :**

```typescript
BOTTLES_DATA = [
  {
    year: 2013,
    bottleImage: "REMPLACER_PAR_BOUTEILLE_2013",      // PNG détouré
    labelImage: "REMPLACER_PAR_ETIQUETTE_2013",       // PNG haute déf
  },
  {
    year: 2014,
    bottleImage: "REMPLACER_PAR_BOUTEILLE_2014",
    labelImage: "REMPLACER_PAR_ETIQUETTE_2014",
  },
  // ... 6 autres entrées
]
```

**Spécifications :**
- **Bouteilles** : PNG 32-bit transparent, 300x600px minimum
- **Étiquettes** : PNG haute résolution, 400x300px minimum
- Toutes doivent avoir la même hauteur pour alignement

---

### TexturesSection.tsx

**Image 1 — Macro Bouchon :**

```typescript
src="REMPLACER_PAR_MACRO_BOUCHON"
alt="Zoom sur bouchon liège et capsule étain"
```

**Spécifications :**
- Format : Carré (1:1) ou paysage
- Résolution : 2400x2400px minimum
- Fichier : JPG qualité élevée
- Description : Gros plan sur texture liège + gravure capsule

---

**Image 2 — Macro Étiquette :**

```typescript
src="REMPLACER_PAR_MACRO_ETIQUETTE"
alt="Étiquette papier texturé et dorure"
```

**Spécifications :**
- Format : Carré (1:1) ou paysage
- Résolution : 2400x2400px minimum
- Fichier : JPG qualité élevée
- Description : Détail étiquette texturée + détail dorure

---

### TechBreakdownSection.tsx

**4 images techniques à adapter :**

```typescript
RENDER_PASSES = [
  {
    id: 'diffuse',
    title: 'Passe Diffuse Color',
    image: "REMPLACER_PAR_DIFFUSE_PASS"      // PNG ou JPG
  },
  {
    id: 'roughness',
    title: 'Passe Roughness / Reflections',
    image: "REMPLACER_PAR_ROUGHNESS_PASS"
  },
  {
    id: 'wireframe',
    title: 'Topologie & Wireframe',
    image: "REMPLACER_PAR_WIREFRAME_PASS"
  },
  {
    id: 'final',
    title: 'Image Finale Compositée',
    image: "REMPLACER_PAR_FINAL_RENDER"
  }
]
```

**Spécifications :**
- Format : Carré (1:1)
- Résolution : 1200x1200px
- Fichier : PNG ou JPG
- Description : Décomposition du rendu technique

**Exemple de passes :**
- **Diffuse** : Couleurs sans éclairage
- **Roughness** : Carte de rugosité (canal gris)
- **Wireframe** : Topologie maillage
- **Final** : Rendu composite final

---

### PackshotsSection.tsx

**4 packshots à adapter :**

```typescript
PACKSHOTS_DATA = [
  {
    id: 1,
    variant: 'Rouge Classique',
    image: "REMPLACER_PAR_PACKSHOT_1"
  },
  {
    id: 2,
    variant: 'Blanc Prestige',
    image: "REMPLACER_PAR_PACKSHOT_2"
  },
  {
    id: 3,
    variant: 'Rosé Délicat',
    image: "REMPLACER_PAR_PACKSHOT_3"
  },
  {
    id: 4,
    variant: 'Mousseux Festif',
    image: "REMPLACER_PAR_PACKSHOT_4"
  }
]
```

**Spécifications :**
- Format : Portrait (2:3)
- Résolution : 4096x6144px (4K)
- Fichier : PNG 32-bit transparent OU JPG fond blanc pur
- Description : Bouteille seule, cadrée de face

---

## 📋 Checklist de Remplacement

```
[ ] Image Hero (1 fichier)
[ ] 8 images bouteilles + 8 étiquettes (16 fichiers)
[ ] 2 images macro textures (2 fichiers)
[ ] 4 passes techniques (4 fichiers)
[ ] 4 packshots commerciaux (4 fichiers)

Total : 29 fichiers à préparer/héberger
```

---

## 🔗 Formats d'URLs Acceptés

### URLs Absolues (recommandé)

```typescript
image: "https://cdn.example.com/images/bouteille-2013.png"
image: "https://storage.google.com/bucket/etiquette.jpg"
```

### URLs Relatives (si fichiers locaux)

```typescript
// Dans /public/images/
image: "/images/chateau/bouteille-2013.png"
```

**Avantage relatif :** Plus rapide, meilleur caching

---

## ⚡ Optimisations Recommandées

### 1. **Compression Image**

Avant upload, optimiser avec :
- **TinyPNG** (https://tinypng.com) — PNG/JPG
- **ImageOptim** (https://imageoptim.com) — Mac
- **FileOptimizer** — Windows

### 2. **Formats Modernes**

Considérer WebP pour performance :
```typescript
<img src="image.webp" alt="..." />
```

### 3. **Responsive Images**

Pour images hero/macro, générer plusieurs tailles :
```
image-1920x1080.jpg (desktop full)
image-1280x720.jpg  (tablet)
image-640x360.jpg   (mobile)
```

### 4. **CDN & Caching**

Utiliser Vercel Image Optimization :
```typescript
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  quality={85}
  priority
/>
```

---

## 🎬 Exemple de Remplacement Complet

**Avant :**
```typescript
// HeroSection.tsx
backgroundImage: 'url("https://images.unsplash.com/...")'
```

**Après :**
```typescript
// HeroSection.tsx
backgroundImage: 'url("https://cdn.monsite.com/chateau-la-commanderie/hero-1920x1080.jpg")'
```

---

## 📞 Besoin d'Aide ?

- Vérifier les consoles browser (F12) pour erreurs CORS
- S'assurer que les images sont publiquement accessibles
- Tester les URLs directement dans le navigateur

---

**Astuce :** Une fois toutes les URLs mises à jour, lancer `npm run build` pour vérifier que tout charge correctement.
