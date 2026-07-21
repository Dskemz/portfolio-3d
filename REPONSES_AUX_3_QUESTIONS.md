# Étape 4b - Réponses aux 3 questions clés

Vos 3 questions reflètent les **pièges majeurs** du projet. Voici les réponses directes et les solutions.

---

## ❓ Question 1: Architecture Viewer vs Éditeur sans rechargement

**Votre question:**
> Comment gérer le basculement "Viewer" vs "Éditeur" dans `viewer-edit.html` via `postMessage` sans recharger l'iframe?

### Réponse court

**Ne pas avoir 2 fichiers, ne pas recharger. Un seul `viewer-edit.html` avec 2 modes:**

```
[START] Viewer mode (read-only)
    ↓ reçoit EDITOR_CONFIG
[SWITCH] Editor mode (outils actifs)
    ↓ UI HTML overlay apparaît
    ↓ listeners Babylon activés
    ↓ handlers POV/cotations actifs
[END] Même scène 3D, même state Babylon
```

### Architecture

```typescript
// viewer-edit.html a UNE seule instance Babylon.js

const sceneManager = new SceneManager(canvas);
const editorTools = new EditorTools(sceneManager);
const iframeMessaging = new IframeMessaging();

// Flux 1: Viewer (par défaut)
iframeMessaging.onMessage('PROJECT_DATA', async (payload) => {
  // Charger modèle 3D
  await sceneManager.updateFromProjectData(payload);
  // éditorTools est INACTIF (disabled)
  // Panneau HTML caché
});

// Flux 2: Switch éditeur (via postMessage)
iframeMessaging.onMessage('EDITOR_CONFIG', (payload) => {
  // Activer outils
  editorTools.enable();
  
  // Afficher panneau UI
  document.getElementById('editor-panel').classList.remove('hidden');
  
  // La scène 3D N'EST PAS rechargée
  // Meshes/materials persistent
  // Juste les outils deviennent actifs
});
```

### Points clés

1. **Pas de rechargement:** Utiliser `classList.remove('hidden')` pour afficher/masquer, pas rechargement iframe
2. **Même state:** La scène Babylon persiste, les meshes sont déjà chargés
3. **Listeners**: Attachés/détachés dynamiquement selon le mode
4. **Overlays CSS:** Panneau HTML avec z-index > canvas

### Piège typique

❌ **MAUVAIS:**
```typescript
// RECHARGEMENT IFRAME = perte de la scène 3D
if (mode === 'editor') {
  location.href = 'viewer-edit.html?edit=1'; // ← NE PAS FAIRE!
}
```

✅ **BON:**
```typescript
// TOGGLE CSS = scène persiste
if (mode === 'editor') {
  editorTools.enable();
  editorPanel.classList.remove('hidden');
  // Babylon.js instance continue de tourner
}
```

---

## ❓ Question 2: Cycle de vie Babylon.js & gestion mémoire

**Votre question:**
> Meilleure méthode pour mettre à jour la scène Babylon.js à la réception de `PROJECT_DATA` sans fuite mémoire?

### Réponse court

**Dispose dans l'ordre inverse (textures → materials → meshes). Enregistrer chaque création.**

### Pattern SceneManager

```typescript
class SceneManager {
  private meshRegistry = new Map<string, BABYLON.AbstractMesh>();
  private materialRegistry = new Map<string, BABYLON.Material>();
  private textureRegistry = new Map<string, BABYLON.BaseTexture>();

  // CHARGER: enregistrer tout
  async loadModel(glbUrl: string) {
    // 1. Dispose ancien modèle
    this.unloadModel();

    // 2. Charger GLB
    const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
      '', glbUrl, this.scene
    );
    
    // 3. ENREGISTRER pour cleanup
    container.meshes.forEach(m => 
      this.meshRegistry.set(m.id, m)
    );
    container.materials.forEach(m => 
      this.materialRegistry.set(m.id, m)
    );
    container.textures.forEach(t => 
      this.textureRegistry.set(t.name, t)
    );
  }

  // DÉCHARGER: nettoyer dans l'ordre inverse
  private unloadModel() {
    // 1. Meshes
    this.meshRegistry.forEach(mesh => mesh.dispose());
    this.meshRegistry.clear();

    // 2. Materials
    this.materialRegistry.forEach(mat => mat.dispose());
    this.materialRegistry.clear();

    // 3. Textures
    this.textureRegistry.forEach(tex => tex.dispose());
    this.textureRegistry.clear();
  }
}
```

### Piège: Observers qui fuient

**Symptôme:** À chaque update PROJECT_DATA, les handlers postMessage sont appelés 2x, 4x, 8x...

**Cause:** `scene.onAfterRenderObservable.add()` jamais `.remove()`

**Solution:**

```typescript
// Tracker les observers
private observerRegistry: Array<() => void> = [];

attachObservers() {
  const renderObs = this.scene.onAfterRenderObservable.add(() => {
    this.onRender();
  });
  
  // Enregistrer la fonction de désabonnement
  this.observerRegistry.push(() => {
    this.scene.onAfterRenderObservable.remove(renderObs);
  });
}

// AVANT chaque update: nettoyer
cleanupObservers() {
  while (this.observerRegistry.length > 0) {
    const unsubscribe = this.observerRegistry.pop();
    unsubscribe(); // Appeler la fonction
  }
}

// FLOW
async updateFromProjectData(data) {
  this.cleanupObservers(); // Cleanup AVANT
  await this.loadModel(data.modelUrl);
  this.attachObservers(); // Réattacher
}
```

### Piège: Textures cassées après rechargement

**Symptôme:** Modèle 3D loaded mais textures vides (rendu gris)

**Cause:** Pointeurs de texture dans GLB référencent des chemins qui n'existent pas

**Solution:**

```typescript
private healBrokenTextures(container: BABYLON.AssetContainer) {
  container.materials?.forEach(mat => {
    if (mat instanceof BABYLON.PBRMaterial) {
      // Texture manquante → fallback couleur
      if (!mat.albedoTexture) {
        mat.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8);
      }
    }
  });
}
```

### Checklist dispose

```
✓ Disposer ancien modèle AVANT charger nouveau
✓ Enregistrer chaque mesh/material/texture chargé
✓ Nettoyer observers AVANT chaque update
✓ Pas d'observers globaux non-trackés
✓ Pas de `window.scene = ...` (référence globale)
✓ Pas de `setInterval`/`setTimeout` sans clearInterval/clearTimeout
✓ Dispose complet au DISCONNECT
```

---

## ❓ Question 3: UI Éditeur - DOM HTML vs AdvancedDynamicTexture?

**Votre question:**
> Privilégier le DOM HTML (overlay) ou `AdvancedDynamicTexture` pour les outils 3D?

### Réponse court

**DOM HTML pour les outils lourds (formulaires, éditeurs). AdvancedDynamicTexture pour les annotations IN-SCENE (labels, dimensions).**

### Comparaison détaillée

| Aspect | DOM HTML | AdvancedDynamicTexture |
|--------|----------|------------------------|
| **Outils (POV, cotations)** | ⭐⭐⭐⭐⭐ EXCELLENT | ⭐⭐ Lourd |
| **Annotations (labels POI)** | ⭐⭐ Overlay | ⭐⭐⭐⭐⭐ Native 3D |
| **Perfo GPU** | ✓ CPU only | ✗ Occupe RenderTarget |
| **Responsive** | ✓ Facile | ✗ Manual scaling |
| **Styling** | ✓ Tailwind/CSS | ✗ XML verbeux |
| **Clics 2D→3D** | Faisable | ✓ Natif |
| **Forms/inputs** | ✓ Standard HTML | ✗ Primitives |

### Recommandation: Architecture hybride

```
┌──────────────────────────────┐
│  Canvas Babylon.js           │
│  (3D scene + rendering)      │
├──────────────────────────────┤
│ AdvancedDynamicTexture       │
│ (Annotations IN-SCENE)       │
│  - POI labels                │
│  - Dimension cotations       │
│  - Room labels               │
├──────────────────────────────┤
│ DOM HTML Overlay             │
│ (Éditeur UI)                 │
│  - Formulaires POV           │
│  - Sliders dimensions        │
│  - Dropdown pièces           │
│  - Save/Cancel buttons       │
└──────────────────────────────┘
```

### DOM HTML pour les outils (prioritaire)

**Pourquoi:**
- Outils = formulaires, inputs, color pickers (complexes en AdvancedDynamicTexture)
- Styling facile en Tailwind/CSS
- Responsive mobile/tablet trivial
- Performance: pas d'impact GPU

**Exemple:**

```html
<!-- Overlay HTML (z-index: 1000) -->
<div id="editor-panel" class="editor-panel">
  <div class="form-group">
    <label>Nom POV</label>
    <input type="text" id="poi-name" />
  </div>
  
  <div class="form-group">
    <label>Hauteur</label>
    <input type="range" id="poi-height" min="0" max="2" step="0.1" />
  </div>
  
  <button id="btn-place-poi">📍 Placer sur la scène</button>
</div>
```

### AdvancedDynamicTexture pour les annotations

**Pourquoi:**
- Annotations = éléments QUI BOUGENT avec la caméra (POI labels, dimensions)
- Intégré à la scène 3D (perspective correcte)
- Clics sur annotations (picking)
- Transformations 3D (rotation, z-fighting)

**Exemple:**

```typescript
// Créer ADT (attachment: scène entière ou objet 3D)
const advancedTexture = BABYLON.DynamicTexture.CreateForMesh(
  'hud', // nom
  this.scene,
  512 // résolution texture
);

// Ajouter text (POI label)
const text = new BABYLON.TextBlock();
text.text = "Chambre principale";
text.fontSize = 24;
text.color = "white";
advancedTexture.addControl(text);

// Le label suit la position du POI (perspective)
```

### Piège: Mélanger maladroitement

❌ **MAUVAIS:**
```typescript
// Formulaire dans AdvancedDynamicTexture
// → Difficile à styler, pas de media queries, inputs laids
const textInput = new BABYLON.InputText("name", "");
textInput.fontSize = 14;
textInput.text = "POV name";
advancedTexture.addControl(textInput);
// ← Performance catastrophique, UX horrible
```

✅ **BON:**
```html
<!-- Formulaire en DOM HTML -->
<div class="editor-panel">
  <input type="text" id="poi-name" placeholder="POV name" />
  <!-- Clean, responsive, performant -->
</div>
```

### Mise en place

```typescript
class EditorUI {
  private advancedTexture: BABYLON.DynamicTexture; // Pour annotations
  
  constructor(scene: BABYLON.Scene) {
    // AdvancedDynamicTexture pour in-scene
    this.advancedTexture = BABYLON.DynamicTexture.CreateForMesh(
      'hud-annotations',
      scene,
      1024 // résolution
    );
  }
  
  // Ajouter annotation (POI label)
  addAnnotation(poi: any) {
    const text = new BABYLON.TextBlock();
    text.text = poi.name;
    text.color = "white";
    this.advancedTexture.addControl(text);
    
    // Positionner via world to screen
    this.updateAnnotationPosition(text, poi);
  }
  
  // DOM HTML géré via getElementById + classList
  showFormPOV(poi: any) {
    // Formulaire en HTML (voir viewer-edit.html)
    const form = document.getElementById('form-poi');
    form.classList.remove('hidden');
  }
}
```

---

## 📊 Résumé: Les 3 pièges + solutions

### Piège 1️⃣: Rechargement iframe
**Symptôme:** Basculement Viewer→Éditeur → perte modèle 3D, écran blanc

**Cause:** `location.href = ...` recharge tout

**Solution:** CSS toggle `.hidden` + listeners dynamiques

---

### Piège 2️⃣: Leaks mémoire
**Symptôme:** Chaque update PROJECT_DATA → ralentissement, GPU mem croît

**Cause:** dispose() non appelé, observers non-trackés

**Solution:** 
- Enregistrer chaque asset (mesh/material/texture)
- Nettoyer observers AVANT chaque update
- Dispose dans l'ordre: textures → materials → meshes

---

### Piège 3️⃣: UI lourdeur GPU
**Symptôme:** Formulaires in-scene → lag, rendu dégradé, aliasing

**Cause:** AdvancedDynamicTexture occupe RenderTarget, pas adapté

**Solution:**
- DOM HTML pour formulaires/inputs/outils
- AdvancedDynamicTexture pour annotations (labels, cotations)
- Pas de mélange

---

## ✅ Checklist d'implémentation

- [ ] Un seul `viewer-edit.html` (pas rechargement)
- [ ] SceneManager wraps dispose() + observers
- [ ] unloadModel() avant loadModel()
- [ ] cleanupObservers() avant chaque update PROJECT_DATA
- [ ] EditorTools class avec enable/disable
- [ ] DOM HTML pour outils (sidebar 380px)
- [ ] AdvancedDynamicTexture pour annotations uniquement
- [ ] CSS z-index: 1000 pour overlay
- [ ] postMessage handlers (AUTH_TOKEN, PROJECT_DATA, EDITOR_CONFIG, DISCONNECT)
- [ ] Disposal complet au DISCONNECT

---

## 🚀 Étapes suivantes

1. **Implémenter SceneManager** (voir `SceneManager.ts`)
2. **Intégrer IframeMessaging** (voir `IframeMessaging.ts`)
3. **Créer EditorTools** (expandable, voir `viewer-edit.html`)
4. **Setup AdvancedDynamicTexture** pour HUD (annotations POI)
5. **Tester le flux:** AUTH_TOKEN → PROJECT_DATA → EDITOR_CONFIG
