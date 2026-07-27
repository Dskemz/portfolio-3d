# 📸 Guide — Ajouter des images Withings

## Images actuelles (16 images vides prêtes)

Tous ces fichiers existent déjà dans `public/images/projets/withings/` :

```
Chapitre 1 — Éléments 3D (5 montres)
├── 01-hero.jpg          (visuel hero large — 21/9)
├── 02-face.jpg          (montre 37mm)
├── 02b-face-38.jpg      (montre 38mm)
├── 02c-face-42.jpg      (montre 42mm)
├── 02d-face-43.jpg      (montre 43mm)
└── 03-3quart.jpg        (montre angle 3/4)

Chapitre 2 — Matières et teintes (grille asymétrique)
├── 04-profil.jpg        (montre profil)
├── 05-boucle.jpg        (boucle déployante — la grande)
├── 06-couture.jpg       (détail couture cuir)
├── 07-tissage.jpg       (détail tissage)
├── 08-sablage.jpg       (détail sablage métal)
└── 09-silicone.jpg      (détail silicone)

Chapitre 3 — Lumière et reflets
└── 10-studio.jpg        (mise en scène studio)

Chapitre 4 — Touche finale & éclaté
├── 11-eclate.jpg        (vue éclatée)
├── 12-cadran-vert.jpg   (cadran vert)
└── 13-cadran-noir.jpg   (cadran noir)
```

**Ce que tu fais :** Tu remplaces chacun de ces fichiers JPG vides par TES vraies images. C'est tout.

---

## ➕ Ajouter une image SUPPLÉMENTAIRE (pas prévue initialement)

Tu veux ajouter une 6ème image de montre ? C'est ultra simple :

### Étape 1 : Ajoute l'image au dossier
Place ton image dans `public/images/projets/withings/` avec un nom logique :
```
public/images/projets/withings/02e-face-nova.jpg
```

### Étape 2 : Ajoute une ligne dans le code
Ouvre `src/components/portfolio/EtudeCasWithings.tsx`, trouve le chapitre 1 (environ ligne 123), et ajoute juste une ligne :

```jsx
{/* Placeholder 2 — 5 montres sous différents angles */}
<div className="mt-10 grid grid-cols-5 gap-2 lg:gap-4 lg:mt-0">
  <VisuelWithings name="02-face" label="37mm" ratio="3/4" teinte="#1b1e23" />
  <VisuelWithings name="02b-face-38" label="38mm" ratio="3/4" teinte="#20242a" />
  <VisuelWithings name="02c-face-42" label="42mm" ratio="3/4" teinte="#1b1e23" />
  <VisuelWithings name="02d-face-43" label="43mm" ratio="3/4" teinte="#20242a" />
  <VisuelWithings name="03-3quart" label="3/4" ratio="3/4" teinte="#1b1e23" />
  {/* 👇 Ajoute cette ligne pour ta 6ème montre : */}
  <VisuelWithings name="02e-face-nova" label="Nova" ratio="3/4" teinte="#20242a" />
</div>
```

**C'est tout.** L'image s'affiche automatiquement. Aucun autre code à écrire.

---

## 📝 Syntaxe rapide

```jsx
<VisuelWithings 
  name="MON-NOM-FICHIER"      {/* Sans .jpg — il l'ajoute tout seul */}
  label="Texte visible"        {/* Description courte */}
  ratio="16/9"                 {/* 16/9, 4/3, 1/1, 3/4, ou 21/9 */}
  teinte="#couleur-fallback"   {/* Gris si image manque */}
/>
```

---

## ✨ Bonus : ajouter une section entière

Tu veux un 5ème chapitre avec nouvelles images ? Copie-colle un chapitre existant et modifie le `name` des images :

```jsx
<section className="border-t border-mine pt-16">
  <Reveal>
    <div className="max-w-2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
        Chapitre 05 — Mon nouveau chapitre
      </p>
      <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
        Ma description ici.
      </p>
    </div>
  </Reveal>

  <Reveal className="mt-10 grid gap-4 lg:grid-cols-3">
    <VisuelWithings name="14-nouvelle-image-1" label="Image 1" ratio="16/9" />
    <VisuelWithings name="15-nouvelle-image-2" label="Image 2" ratio="16/9" />
    <VisuelWithings name="16-nouvelle-image-3" label="Image 3" ratio="16/9" />
  </Reveal>
</section>
```

Ajoute juste tes images correspondantes au dossier :
```
public/images/projets/withings/14-nouvelle-image-1.jpg
public/images/projets/withings/15-nouvelle-image-2.jpg
public/images/projets/withings/16-nouvelle-image-3.jpg
```

Et voilà ! 🎯

---

## 🎨 Les grilles disponibles (copie-colle)

**Ligne unique (responsive) :**
```jsx
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  <VisuelWithings name="..." label="..." ratio="16/9" />
  <VisuelWithings name="..." label="..." ratio="16/9" />
</div>
```

**3 colonnes sur large écran :**
```jsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <VisuelWithings name="..." label="..." ratio="16/9" />
  {/* ... */}
</div>
```

**4 colonnes asymétrique (comme chapitre 2) :**
```jsx
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
  <VisuelWithings name="..." label="..." ratio="1/1" className="lg:col-span-2 lg:row-span-2" />
  {/* 4 petites images côté */}
</div>
```

---

## ⚠️ Rappel

- ✅ Fichiers JPG ou WebP
- ✅ Pas de `.jpg` dans le `name` (le composant l'ajoute)
- ✅ Les images vides gris existent déjà, tu les remplace juste
- ✅ Si une image manque, un placeholder gris s'affiche (pas d'erreur)
