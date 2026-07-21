# Étape 4b - Guide d'intégration complète

Passer du **Viewer (lecture seule)** à l'**Éditeur sécurisé**.

---

## 📊 Flux de données global

```
[PORTFOLIO - Next.js]
    ↓
    (utilisateur clique "Éditer")
    ↓
    [/editor route]
    │
    ├─ Vérifier authentification
    ├─ Générer JWT (backend)
    ├─ Charger Editor3D component
    │
    └─ Editor3D (Étape 4 - iframe sécurisée)
        │
        ├─ src: viewer-edit.html
        ├─ sandbox: allow-scripts
        ├─ postMessage: AUTH_TOKEN
        │
        ↓ [IFRAME - viewer-edit.html]
        │
        ├─ Initialiser SceneManager
        ├─ Attacher messaging (useIframeChild)
        ├─ Attendre AUTH_TOKEN
        │
        ← postMessage(AUTH_TOKEN)
        │
        ├─ Valider JWT structure
        ├─ Stocker en mémoire
        ├─ Envoyer IFRAME_READY
        │
        ← postMessage(PROJECT_DATA)
        │
        ├─ SceneManager.unloadModel()
        ├─ SceneManager.loadModel(glbUrl)
        ├─ Setup cameras
        ├─ Setup HUD (cotations, labels)
        ├─ Envoyer STATE_CHANGE (ready)
        │
        ← postMessage(EDITOR_CONFIG)
        │
        ├─ EditorTools.enable()
        ├─ Afficher panneau HTML (#editor-panel)
        ├─ Activer listeners (POV, cotations, lights)
        ├─ Envoyer STATE_CHANGE (editing)
        │
        ↓ [ÉDITION]
        │
        ├─ Utilisateur clique "Placer POV"
        ├─ EditorTools enregistre changement
        ├─ Utilisateur clique "Enregistrer"
        ├─ Envoyer SAVE_PROJECT(changes)
        │
        → [PORTFOLIO]
        │
        ├─ Recevoir SAVE_PROJECT
        ├─ Valider JWT signature (backend)
        ├─ Persister changements
        ├─ Envoyer confirmation
```

---

## 🛠️ Étapes d'implémentation

### Étape 1: Créer `viewer-edit.html` minimaliste

**Fichier:** `public/viewer-edit.html`

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.babylonjs.com/babylon.min.js"></script>
  <style>
    body { margin: 0; overflow: hidden; }
    #canvas { width: 100%; height: 100vh; }
    .editor-panel { 
      position: fixed; right: 0; top: 0; width: 380px; height: 100vh;
      background: #1a1a1a; border-left: 1px solid #333; z-index: 1000;
      display: none; /* hidden par défaut */
    }
    .editor-panel.active { display: flex; flex-direction: column; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <div id="editor-panel" class="editor-panel">
    <!-- Contenu ui éditeur -->
  </div>

  <script>
    // Voir SceneManager.ts
    class SceneManager { /* ... */ }
    
    // Voir IframeMessaging.ts
    class IframeMessaging { /* ... */ }
    
    // Voir EditorTools (au-dessous)
    class EditorTools { /* ... */ }
    
    // Bootstrap
    async function init() {
      const sceneManager = new SceneManager(document.getElementById('canvas'));
      const iframeMessaging = new IframeMessaging();
      
      await sceneManager.initScene();
      iframeMessaging.init();
      
      // Handlers postMessage
      iframeMessaging.onMessage('AUTH_TOKEN', (payload) => {
        // Valider JWT structure
        // Stocker token
        console.log('✓ Authenticated');
      });
      
      iframeMessaging.onMessage('PROJECT_DATA', async (payload) => {
        await sceneManager.updateFromProjectData(payload);
        console.log('✓ Scene loaded');
      });
      
      iframeMessaging.onMessage('EDITOR_CONFIG', (payload) => {
        editorTools.enable();
        document.getElementById('editor-panel').classList.add('active');
      });
    }
    
    window.addEventListener('load', init);
  </script>
</body>
</html>
```

### Étape 2: Intégrer `SceneManager`

**Copier:** `SceneManager.ts` → `src/iframe/SceneManager.ts`

**Compiler:** TypeScript → JavaScript (ou inline dans HTML)

**Utilisation:**

```typescript
const sceneManager = new SceneManager(canvas);
await sceneManager.initScene(); // Babylon.js init
await sceneManager.loadModel(glbUrl); // Charger GLB
```

### Étape 3: Intégrer `IframeMessaging`

**Copier:** `IframeMessaging.ts` → `src/iframe/IframeMessaging.ts`

**Utilisation:**

```typescript
const iframeMessaging = new IframeMessaging();
iframeMessaging.init(); // Écouter postMessage

// Handler example
iframeMessaging.onMessage('PROJECT_DATA', async (payload) => {
  await sceneManager.updateFromProjectData(payload);
});
```

### Étape 4: Créer `EditorTools`

**Fichier:** `src/iframe/EditorTools.ts`

```typescript
class EditorTools {
  private sceneManager: SceneManager;
  private isEnabled = false;
  private editingState = {};

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  enable() {
    this.isEnabled = true;
    this.attachEventListeners();
    console.log('[EditorTools] Enabled');
  }

  disable() {
    this.isEnabled = false;
    this.detachEventListeners();
  }

  private attachEventListeners() {
    // POV clicks
    document.getElementById('btn-add-pov')?.addEventListener('click', () => {
      this.startPoiPlacement();
    });

    // Cotation edits
    document.getElementById('form-dimensions')?.addEventListener('change', (e) => {
      this.updateDimensions(e);
    });

    // Save
    document.getElementById('btn-save')?.addEventListener('click', () => {
      this.saveChanges();
    });
  }

  private startPoiPlacement() {
    console.log('[EditorTools] POI placement mode');
    
    // Activer picking dans la scène
    const scene = this.sceneManager.getScene();
    const handleClick = (e: PointerEvent) => {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        console.log('Clicked at:', pickInfo.pickedPoint);
        // Créer POI
        this.createPoi(pickInfo.pickedPoint);
      }
    };
    
    window.addEventListener('click', handleClick, { once: true });
  }

  private createPoi(position: BABYLON.Vector3) {
    this.editingState['currentPoi'] = {
      position,
      name: 'POV ' + Date.now(),
      height: 1.6
    };
    
    console.log('[EditorTools] Created POI at', position);
    iframeMessaging.sendMessage('STATE_CHANGE', {
      state: 'editing',
      details: { poi: this.editingState['currentPoi'] }
    });
  }

  private updateDimensions(event: Event) {
    // Valider + stocker changement
    const input = event.target as HTMLInputElement;
    this.editingState['dimensions'] = parseFloat(input.value);
  }

  private async saveChanges() {
    const auth = iframeMessaging.getAuthState();
    
    iframeMessaging.sendMessage('SAVE_PROJECT', {
      projectId: auth?.projectId,
      changes: this.editingState,
      timestamp: Date.now()
    });
    
    console.log('[EditorTools] Saved');
  }

  private detachEventListeners() {
    // Retirer listeners
  }
}
```

### Étape 5: Setup postMessage handlers

**Fichier:** `src/iframe/handlers.ts`

```typescript
export function setupHandlers(sceneManager: SceneManager) {
  // AUTH_TOKEN
  iframeMessaging.onMessage('AUTH_TOKEN', (payload) => {
    const parts = payload.token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT');
    }
    
    // Stocker en mémoire
    window.__auth = {
      token: payload.token,
      projectId: payload.projectId,
      userId: payload.userId,
      expiresAt: Date.now() + (payload.expiresIn * 1000)
    };
    
    console.log('✓ Authenticated');
  });

  // PROJECT_DATA
  iframeMessaging.onMessage('PROJECT_DATA', async (payload) => {
    try {
      await sceneManager.updateFromProjectData(payload);
      
      iframeMessaging.sendMessage('STATE_CHANGE', {
        state: 'ready',
        details: { meshCount: sceneManager.getState().meshCount }
      });
    } catch (error) {
      iframeMessaging.sendMessage('ERROR', {
        code: 'SCENE_UPDATE_FAILED',
        message: error.message
      });
    }
  });

  // EDITOR_CONFIG
  iframeMessaging.onMessage('EDITOR_CONFIG', (payload) => {
    sceneManager.switchToEditorMode();
    editorTools.enable();
    
    document.getElementById('editor-panel')?.classList.add('active');
    
    iframeMessaging.sendMessage('STATE_CHANGE', {
      state: 'editing',
      details: { uiMode: payload.uiMode }
    });
  });

  // DISCONNECT
  iframeMessaging.onMessage('DISCONNECT', (payload) => {
    sceneManager.dispose();
    editorTools.disable();
    document.getElementById('editor-panel')?.classList.remove('active');
    
    console.log('Session ended:', payload.reason);
  });
}
```

### Étape 6: Update `Editor3D` component (portfolio)

**Fichier:** `src/components/ui/Editor3D.tsx`

```tsx
import { useEffect, useRef } from 'react';
import { useIframeMessenger } from '@/hooks/useIframeMessenger';

interface Editor3DProps {
  editorUrl: string;
  authToken: string;
  projectId: string;
  userId: string;
  onReady?: () => void;
  onSave?: (changes: any) => void;
  onError?: (error: Error) => void;
}

export default function Editor3D({
  editorUrl,
  authToken,
  projectId,
  userId,
  onReady,
  onSave,
  onError
}: Editor3DProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { send, on } = useIframeMessenger({
    iframeRef,
    onReady,
    onError
  });

  // Attendre que l'iframe soit prête
  useEffect(() => {
    const unsubscribe = on('IFRAME_READY', () => {
      // Envoyer AUTH_TOKEN
      send({
        type: 'AUTH_TOKEN',
        payload: {
          token: authToken,
          projectId,
          userId,
          expiresIn: 3600
        },
        timestamp: Date.now()
      });

      // Envoyer PROJECT_DATA
      send({
        type: 'PROJECT_DATA',
        payload: {
          projectId,
          modelUrl: '/models/property-demo.glb',
          cameras: [
            {
              id: 'poi-1',
              position: [0, 1.6, -5],
              target: [0, 1.6, 0],
              fov: 45,
              name: 'Entrée'
            }
          ],
          metadata: {
            rooms: [],
            dimensions: {},
            lighting: {}
          }
        },
        timestamp: Date.now()
      });

      // Envoyer EDITOR_CONFIG
      send({
        type: 'EDITOR_CONFIG',
        payload: {
          theme: 'dark',
          features: ['poi', 'dimensions', 'rooms', 'lights'],
          uiMode: 'advanced'
        },
        timestamp: Date.now()
      });
    });

    // Écouter SAVE_PROJECT
    const unsubscribeSave = on('SAVE_PROJECT', (payload) => {
      console.log('Sauvegarde depuis iframe:', payload);
      onSave?.(payload);
    });

    return () => {
      unsubscribe();
      unsubscribeSave();
    };
  }, [send, on, authToken, projectId, userId, onSave]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        ref={iframeRef}
        src={editorUrl}
        sandbox={[
          'allow-same-origin',
          'allow-scripts',
          'allow-presentation'
        ].join(' ')}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
}
```

---

## ✅ Checklist complète

### Phase 1: Préparation
- [ ] Copier `SceneManager.ts` dans `src/iframe/`
- [ ] Copier `IframeMessaging.ts` dans `src/iframe/`
- [ ] Compiler TypeScript → JavaScript (ou inline)
- [ ] Tester SceneManager indépendamment (sans messaging)

### Phase 2: `viewer-edit.html`
- [ ] Créer `public/viewer-edit.html` minimal
- [ ] Intégrer SceneManager
- [ ] Intégrer IframeMessaging
- [ ] Créer EditorTools class
- [ ] Tester en dev: http://localhost:3000/viewer-edit.html

### Phase 3: Handlers postMessage
- [ ] AUTH_TOKEN handler (JWT validation)
- [ ] PROJECT_DATA handler (scene load)
- [ ] EDITOR_CONFIG handler (mode switch)
- [ ] DISCONNECT handler (cleanup)
- [ ] Tester flux: AUTH → PROJECT → EDITOR

### Phase 4: EditorTools
- [ ] POV placement (click picking)
- [ ] Dimension editing (inputs)
- [ ] Room management (add/remove)
- [ ] Light control (place/configure)
- [ ] Save/Cancel buttons

### Phase 5: Intégration avec Editor3D
- [ ] Editor3D component envoie AUTH_TOKEN
- [ ] Editor3D component envoie PROJECT_DATA
- [ ] Editor3D component envoie EDITOR_CONFIG
- [ ] Editor3D component reçoit SAVE_PROJECT
- [ ] Backend valide JWT signature + persiste

### Phase 6: Tests
- [ ] Test dev: http://localhost:3000/editor
- [ ] Vérifier console: aucune erreur
- [ ] Vérifier mémoire: pas de leaks (DevTools)
- [ ] Vérifier CSP: aucun warning
- [ ] Tester UI éditeur: UI affichée, outils fonctionnels

### Phase 7: Sécurité
- [ ] Vérifier origin validation dans messaging
- [ ] Vérifier JWT validation (structure + expiration)
- [ ] Vérifier sandbox est stricte
- [ ] Vérifier CSP ne contient pas `*`

---

## 🚨 Points critiques de débogage

### Problème: "Message rejected: invalid origin"
```
→ Vérifier ALLOWED_ORIGINS dans IframeMessaging.ts
→ Vérifier origin exact (incluant protocole + port)
```

### Problème: "iframe not available"
```
→ Attendre IFRAME_READY avant d'envoyer
→ Vérifier que iframeRef.current existe
```

### Problème: GPU memory croît à chaque update
```
→ Vérifier unloadModel() est appelé
→ Vérifier cleanupObservers() est appelé
→ Ajouter logs: console.log(sceneManager.getState())
```

### Problème: EditorTools panel ne s'affiche pas
```
→ Vérifier EDITOR_CONFIG est envoyé
→ Vérifier editorTools.enable() est appelé
→ Vérifier editor-panel existe en HTML
→ Vérifier z-index: 1000
```

---

## 📈 Prochaines étapes après Étape 4b

1. **Implémenter AdvancedDynamicTexture** pour HUD annotations
2. **POI placement workflow:** clic mode → placer sur scène → height slider → save
3. **Cotation editing:** éditable numbers + algorithme auto-calculation
4. **Light placement:** UI + scene picking
5. **Backend API:** POST /api/projects/save avec JWT validation
6. **Tests E2E:** Cypress/Playwright coverage
