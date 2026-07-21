# Étape 4b - Architecture: Viewer → Éditeur via postMessage

Adaptation du viewer Babylon.js en éditeur réactif sans rechargement iframe.

---

## 📋 Vue d'ensemble

```
[PORTFOLIO - Next.js]
    ↓ postMessage(AUTH_TOKEN)
[VIEWER-EDIT.HTML]
    │
    ├─ Mode LECTEUR (par défaut)
    │  └─ Charge modèle 3D (read-only)
    │  └─ ArcRotate camera
    │  └─ Affiche POV/pièces/cotations
    │
    ← postMessage(EDITOR_CONFIG)
    │
    └─ Mode ÉDITEUR (switched)
       ├─ Outils actifs (placement POV, édition cotations, etc.)
       ├─ Panneau latéral HTML (overlay)
       ├─ Gestion de l'état Babylon optimisée
       ├─ Écouteurs postMessage pour changements temps réel
       └─ Envoie SAVE_PROJECT au parent via postMessage
```

### Flux d'état

```
[START] LOADING
  ↓
  viewer.html chargé + Babylon.js init (basic scene, pas modèle)
  ↓
[AWAIT AUTH_TOKEN] → Token reçu via postMessage
  ↓
[AWAIT PROJECT_DATA] → Modèle + cameras reçus
  ↓
[UPDATE SCENE] → Charge GLB, setup cameras, HUD
  ↓
[VIEWER READY] → Peut basculer mode édition
  ↓
← postMessage(EDITOR_CONFIG, { uiMode: 'advanced' })
  ↓
[SWITCH TO EDITOR] → Active outils, affiche panneau, change mode UI
  ↓
[EDITING] → Utilisateur modifie POV/cotations/lights
  ↓
← postMessage(SAVE_PROJECT, { changes })
  ↓
[SAVED] → Backend valide signature + persiste
```

---

## 🏗️ 1. Architecture `viewer-edit.html`

### Structure de fichier

```html
<!-- viewer-edit.html ~1200 lignes -->

<!DOCTYPE html>
<html>
<head>
  <!-- Babylon.js, styles, meta -->
</head>
<body>
  <!-- Canvas Babylon -->
  <canvas id="canvas"></canvas>
  
  <!-- Panneau édition HTML (overlay) -->
  <div id="editor-panel" class="editor-panel hidden">
    <!-- Onglets, outils, etc. -->
  </div>
  
  <!-- Scripts: Babylon init + messagerie + editeur tools -->
  <script src="...babylon.min.js"></script>
  <script>
    // === PART 1: Babylon.js State Management ===
    // SceneManager class
    
    // === PART 2: PostMessage Communication ===
    // useIframeChild() + message handlers
    
    // === PART 3: Editor Tools ===
    // POV placement, cotations, etc.
    
    // === PART 4: UI & DOM ===
    // Panel rendering, tab switching
    
    // === PART 5: Main Init ===
    // bootstrap()
  </script>
</body>
</html>
```

### Taille estimée

- viewer.html original: ~4150 lignes (lecture seule)
- viewer-edit.html: ~1200 lignes (éditeur + outils)
  - 300 lignes: SceneManager (dispose/reload)
  - 250 lignes: postMessage handlers
  - 400 lignes: Editor tools (POV, cotations, lights)
  - 250 lignes: UI/DOM rendering

**Pas de duplication:** viewer-edit.html s'exécute ISOLÉ, utilise les mêmes patterns Babylon que viewer.html mais découplé.

---

## 🔄 2. Cycle de vie & Gestion mémoire

### Piège #1: Leaks mémoire avec dispose()

**Symptôme:** Chaque changement PROJECT_DATA ralentit davantage (GPU memory croît)

**Cause:** Babylon meshes/materials/textures ne sont pas nettoyés

**Solution: SceneManager Pattern**

```typescript
class SceneManager {
  private scene: BABYLON.Scene;
  private registrations = {
    meshes: Map<string, BABYLON.AbstractMesh>,
    textures: Map<string, BABYLON.BaseTexture>,
    materials: Map<string, BABYLON.Material>,
    observers: Array<() => void>
  };

  // ===== INITIALIZATION =====
  async initScene(canvas) {
    this.scene = new BABYLON.Scene(engine);
    // Basic setup (camera, lights, skybox)
  }

  // ===== LOAD MODEL =====
  async loadModel(glbUrl, options) {
    // 1. Dispose anciens meshes
    this.unloadModel();
    
    // 2. Charger GLB
    const { meshes, materials, textures } = await BABYLON.SceneLoader.ImportMeshAsync(
      '', glbUrl, '', this.scene
    );
    
    // 3. Enregistrer pour cleanup futur
    meshes.forEach(m => this.registrations.meshes.set(m.id, m));
    materials.forEach(m => this.registrations.materials.set(m.id, m));
    textures.forEach(t => this.registrations.textures.set(t.name, t));
    
    return { meshes, materials, textures };
  }

  // ===== UNLOAD MODEL =====
  private unloadModel() {
    // Dispose dans l'ordre inverse (textures → materials → meshes)
    this.registrations.meshes.forEach(mesh => mesh.dispose());
    this.registrations.meshes.clear();
    
    this.registrations.materials.forEach(mat => mat.dispose());
    this.registrations.materials.clear();
    
    this.registrations.textures.forEach(tex => tex.dispose());
    this.registrations.textures.clear();
  }

  // ===== CLEANUP OBSERVERS =====
  private cleanupObservers() {
    this.registrations.observers.forEach(unsubscribe => unsubscribe());
    this.registrations.observers = [];
  }

  // ===== PUBLIC: Update scene =====
  async updateFromProjectData(projectData) {
    try {
      // Cleanup anciennes données
      this.cleanupObservers();
      
      // Charger modèle
      await this.loadModel(projectData.modelUrl);
      
      // Setup cameras
      this.setupCameras(projectData.cameras);
      
      // Setup HUD (cotations, labels)
      this.setupHUD(projectData.metadata);
      
      // Attacher listeners (scene updates)
      this.attachObservers();
      
      return { success: true };
    } catch (error) {
      console.error('[SceneManager] Update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== CLEANUP TOTAL =====
  dispose() {
    this.unloadModel();
    this.cleanupObservers();
    this.scene.dispose();
  }
}
```

### Piège #2: Rechargement GLB avec pointeurs de texture cassés

**Symptôme:** Textures absentes après chargement GLB

**Cause:** GLB interne référence des textures par chemin relatif absent

**Solution: Sanitize + Fallback**

```typescript
async loadModel(glbUrl, options = {}) {
  try {
    // Charger avec container (isole les meshes)
    const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
      '', glbUrl, this.scene
    );
    
    // Ajouter à la scène
    container.addAllToScene();
    
    // FALLBACK textures si cassées
    this.healBrokenTextures(container);
    
    // Enregistrer pour cleanup
    container.meshes.forEach(m => 
      this.registrations.meshes.set(m.id, m)
    );
    
    return container;
  } catch (error) {
    if (error.message.includes('texture')) {
      console.warn('[LoadModel] Texture error, attempting recovery...');
      // Charger avec textures par défaut
      return this.loadModelWithFallback(glbUrl);
    }
    throw error;
  }
}

private healBrokenTextures(container) {
  // Détecter matériaux sans textures
  container.materials?.forEach(mat => {
    if (mat instanceof BABYLON.PBRMaterial) {
      if (!mat.albedoTexture && mat.albedoColor.a < 0.5) {
        // Texture manquante → fallback couleur
        mat.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8);
      }
    }
  });
}
```

### Piège #3: Observers Babylon qui fuient

**Symptôme:** Handlers postMessage appelés multiple fois (doublement à chaque update)

**Cause:** Observers Babylon jamais détachés

**Solution: Observable tracking**

```typescript
private attachObservers() {
  // Scene render observable
  const renderObs = this.scene.onAfterRenderObservable.add(() => {
    this.onSceneRender();
  });
  this.registrations.observers.push(() => 
    this.scene.onAfterRenderObservable.remove(renderObs)
  );
  
  // Pointer events
  const pointerObs = this.scene.onPointerObservable.add((evt) => {
    this.onPointerEvent(evt);
  });
  this.registrations.observers.push(() =>
    this.scene.onPointerObservable.remove(pointerObs)
  );
  
  // Camera changes
  const cameraObs = this.scene.onActiveCameraChanged.add(() => {
    this.onCameraChanged();
  });
  this.registrations.observers.push(() =>
    this.scene.onActiveCameraChanged.remove(cameraObs)
  );
}

private cleanupObservers() {
  // Appeler tous les unsubscribe dans l'ordre inverse
  while (this.registrations.observers.length > 0) {
    const unsubscribe = this.registrations.observers.pop();
    unsubscribe();
  }
}
```

---

## 📡 3. Communication postMessage (dans l'iframe)

### Implémentation useIframeChild() dans viewer-edit.html

```typescript
// Dans viewer-edit.html, après SceneManager

let parentWindow = null;
const messageHandlers = new Map();

// Initialiser communication
function initIframeMessaging() {
  window.addEventListener('message', (event) => {
    try {
      // 1. Valider origin (COPIÉ de Étape 4)
      const ALLOWED_ORIGINS = [
        'https://portfolio.example.com',
        'http://localhost:3000' // dev
      ];
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn(`[Security] Message from unauthorized origin: ${event.origin}`);
        return;
      }
      
      // 2. Valider structure
      const msg = event.data;
      if (!msg.type || !msg.payload || typeof msg.timestamp !== 'number') {
        console.warn('[postMessage] Invalid message structure');
        return;
      }
      
      // 3. Vérifier timestamp (< 5 min)
      const age = Date.now() - msg.timestamp;
      if (age > 5 * 60 * 1000) {
        console.warn(`[postMessage] Message too old: ${Math.floor(age/1000)}s`);
        return;
      }
      
      // 4. Enregistrer parent
      parentWindow = event.source;
      
      // 5. Appeler handler
      const handler = messageHandlers.get(msg.type);
      if (handler) {
        handler(msg.payload, msg);
      } else {
        console.warn(`[postMessage] No handler for type: ${msg.type}`);
      }
    } catch (error) {
      console.error('[postMessage] Error:', error);
      sendMessageToParent('ERROR', {
        code: 'MESSAGE_HANDLER_ERROR',
        message: error.message
      });
    }
  });
  
  // Notifier parent que iframe est prête
  setTimeout(() => {
    sendMessageToParent('IFRAME_READY', { iframeVersion: '1.0.0' });
  }, 500);
}

// Envoyer message au parent
function sendMessageToParent(type, payload) {
  if (!parentWindow) {
    console.warn('[postMessage] Parent window not available');
    return;
  }
  
  const message = {
    type,
    payload,
    timestamp: Date.now()
  };
  
  parentWindow.postMessage(message, '*');
}

// Enregistrer handler
function onMessage(type, handler) {
  messageHandlers.set(type, handler);
}
```

### Handlers postMessage

```typescript
const sceneManager = new SceneManager();

// ===== AUTH_TOKEN =====
onMessage('AUTH_TOKEN', (payload) => {
  console.log('[iframe] AUTH_TOKEN received');
  
  // Valider JWT structure (client-side validation only)
  const parts = payload.token.split('.');
  if (parts.length !== 3) {
    sendMessageToParent('ERROR', {
      code: 'INVALID_JWT',
      message: 'JWT format invalid'
    });
    return;
  }
  
  // Stocker en mémoire
  window.__auth = {
    token: payload.token,
    projectId: payload.projectId,
    userId: payload.userId,
    expiresAt: Date.now() + (payload.expiresIn * 1000)
  };
  
  console.log('[iframe] ✓ Authenticated');
});

// ===== PROJECT_DATA =====
onMessage('PROJECT_DATA', async (payload) => {
  console.log('[iframe] PROJECT_DATA received');
  
  try {
    // Mettre à jour la scène Babylon
    await sceneManager.updateFromProjectData(payload);
    
    // Valider les données sont prêtes
    const isValid = sceneManager.getScene().meshes.length > 0;
    
    if (isValid) {
      console.log('[iframe] ✓ Scene updated');
      sendMessageToParent('STATE_CHANGE', {
        state: 'ready',
        details: { meshCount: sceneManager.getScene().meshes.length }
      });
    } else {
      throw new Error('Scene update incomplete');
    }
  } catch (error) {
    console.error('[iframe] Scene update failed:', error);
    sendMessageToParent('ERROR', {
      code: 'SCENE_UPDATE_FAILED',
      message: error.message,
      details: { modelUrl: payload.modelUrl }
    });
  }
});

// ===== EDITOR_CONFIG =====
onMessage('EDITOR_CONFIG', (payload) => {
  console.log('[iframe] EDITOR_CONFIG received');
  
  // Activer mode édition
  switchToEditorMode(payload.uiMode); // 'simple' | 'advanced'
  
  // Activer outils
  const editorPanel = document.getElementById('editor-panel');
  editorPanel.classList.remove('hidden');
  
  sendMessageToParent('STATE_CHANGE', {
    state: 'editing',
    details: { uiMode: payload.uiMode }
  });
});

// ===== DISCONNECT =====
onMessage('DISCONNECT', (payload) => {
  console.log('[iframe] DISCONNECT received:', payload.reason);
  
  // Cleanup
  sceneManager.dispose();
  window.__auth = null;
  
  // Afficher message
  showNotification('Session terminée: ' + payload.reason);
});
```

---

## 🎨 4. UI Éditeur: DOM HTML vs AdvancedDynamicTexture

### Comparaison

| Aspect | DOM HTML | AdvancedDynamicTexture |
|--------|----------|------------------------|
| **Perfo** | ⭐⭐⭐⭐⭐ Rapide | ⭐⭐ Lourd GPU |
| **Styling** | ⭐⭐⭐⭐⭐ CSS Tailwind | ⭐⭐ XML verbeux |
| **Accessibilité** | ⭐⭐⭐⭐⭐ HTML standard | ⭐ Limité |
| **Responsive** | ⭐⭐⭐⭐⭐ Médias queries | ⭐⭐ Manual scaling |
| **Outils lourds** | ⭐⭐⭐⭐⭐ (color picker, sliders) | ⭐⭐ Aliasing |
| **Intégration 3D** | ⭐⭐⭐ (overlay z-index) | ⭐⭐⭐⭐⭐ In-scene |

### Recommandation: **DOM HTML + Overlay**

**Pourquoi:**
- Outils lourds (color picker, inputs numériques, dropdown) performants en DOM
- Styling Tailwind déjà maîtrisé dans Next.js
- Responsive mobile/tablet facile
- Accessibility pour utilisateurs malvoyants
- Pas de contention GPU avec post-processing

**Cas AdvancedDynamicTexture:**
- Uniquement annotations IN-SCENE (labels, dimensions, POI)
- Pas de formulaires/éditeurs

### Structure HTML recommandée

```html
<!-- Overlay éditeur (z-index 1000) -->
<div id="editor-panel" class="editor-panel hidden">
  <!-- Header -->
  <div class="editor-header">
    <h2>Éditeur 3D</h2>
    <button class="btn-close">✕</button>
  </div>
  
  <!-- Tabs -->
  <div class="editor-tabs">
    <button class="tab-btn active" data-tab="pov">POV</button>
    <button class="tab-btn" data-tab="dimensions">Cotations</button>
    <button class="tab-btn" data-tab="rooms">Pièces</button>
    <button class="tab-btn" data-tab="lights">Lumières</button>
  </div>
  
  <!-- Tab content -->
  <div class="editor-content">
    <div class="tab-content active" id="tab-pov">
      <!-- POV tools -->
    </div>
    <div class="tab-content" id="tab-dimensions">
      <!-- Dimension tools -->
    </div>
    <!-- etc -->
  </div>
  
  <!-- Footer actions -->
  <div class="editor-footer">
    <button class="btn-save">💾 Enregistrer</button>
    <button class="btn-cancel">Annuler</button>
  </div>
</div>

<!-- HUD annotations in-scene (AdvancedDynamicTexture) -->
<canvas id="hud-canvas"></canvas>
```

### Styling

```css
.editor-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  background: #1a1a1a;
  border-left: 1px solid #333;
  z-index: 1000;
  
  display: flex;
  flex-direction: column;
  
  overflow-y: auto;
}

.editor-panel.hidden {
  display: none;
}

.editor-header {
  padding: 16px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #333;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
}

.tab-btn.active {
  color: #fff;
  border-bottom-color: #d97757; /* accent orange */
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.editor-footer {
  padding: 16px;
  border-top: 1px solid #333;
  display: flex;
  gap: 8px;
}

.btn-save {
  flex: 1;
  padding: 12px;
  background: #d97757;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:hover {
  background: #e08860;
}
```

---

## ⚙️ 5. Intégration avec Étape 4

### Composant Editor3D (parent, dans portfolio)

```tsx
import Editor3D from "@/components/ui/Editor3D";

export default function EditorPage() {
  const [authToken, setAuthToken] = useState("");
  const [projectId, setProjectId] = useState("");
  
  useEffect(() => {
    // Récupérer JWT du backend
    fetch('/api/auth/token', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        setAuthToken(data.token);
        setProjectId(data.projectId);
      });
  }, []);
  
  const handleReady = () => {
    console.log('iframe prête');
  };
  
  const handleSave = (changes) => {
    console.log('Sauvegarde:', changes);
    // Persister au backend
  };
  
  return (
    <Editor3D
      editorUrl="https://visite3d.example.com/viewer-edit.html"
      authToken={authToken}
      projectId={projectId}
      userId="user-123"
      onReady={handleReady}
      onSave={handleSave}
    />
  );
}
```

### Flux postMessage complet

```
1. [PARENT] Envoie AUTH_TOKEN
   → [IFRAME] Stocke token en mémoire
   → [IFRAME] Envoie IFRAME_READY

2. [PARENT] Envoie PROJECT_DATA
   → [IFRAME] SceneManager.updateFromProjectData()
   → [IFRAME] Charge GLB, setup cameras, HUD
   → [IFRAME] Envoie STATE_CHANGE (ready)

3. [PARENT] Envoie EDITOR_CONFIG
   → [IFRAME] switchToEditorMode()
   → [IFRAME] Affiche panneau HTML
   → [IFRAME] Active outils (POV, cotations, etc.)
   → [IFRAME] Envoie STATE_CHANGE (editing)

4. [IFRAME] Utilisateur édite (clic POV, modifie cotation, etc.)
   → [IFRAME] Capture changements dans window.__edits

5. [IFRAME] Utilisateur clique "Enregistrer"
   → [IFRAME] Envoie SAVE_PROJECT(changes)
   → [PARENT] Reçoit, valide JWT signature
   → [BACKEND] Persiste changements

6. [PARENT] Utilisateur quitte
   → [PARENT] Envoie DISCONNECT
   → [IFRAME] SceneManager.dispose()
   → [IFRAME] Cleanup mémoire
```

---

## 🧠 Résumé des patterns

### Mémoire
- SceneManager wraps tous les dispose()
- unloadModel() avant loadModel()
- cleanupObservers() avant chaque update
- Pas de global state Babylon (window.scene = null après dispose)

### postMessage
- Validation origin AVANT traitement
- Tracking des handlers (eviter les doublons)
- Token stocké mémoire only
- Listeners cleanup stricte

### UI
- DOM HTML + Tailwind (pas AdvancedDynamicTexture pour outils)
- HUD annotations via Canvas 2D ou AdvancedDynamicTexture for POI/dimensions
- Overlay z-index: 1000

### Basculement Viewer ↔ Éditeur
- Même `viewer-edit.html`, mode switché via postMessage(EDITOR_CONFIG)
- Pas rechargement iframe
- Outils activés/désactivés via class CSS `.hidden`
- État Babylon persistent (meshes stay loaded)
