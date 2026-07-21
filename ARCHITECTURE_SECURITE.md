# Architecture Sécurisée Iframe - Next.js 16 + Babylon.js

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Couches de sécurité](#couches-de-sécurité)
3. [Communication postMessage](#communication-postmessage)
4. [Configuration CSP](#configuration-csp)
5. [Authentification](#authentification)
6. [Flux d'initialisation](#flux-dinitialisation)
7. [Checklist de sécurité](#checklist-de-sécurité)

---

## Vue d'ensemble

Cette architecture sécurise l'intégration d'un éditeur 3D privé dans votre portfolio Next.js via une iframe isolée.

```
┌─────────────────────────────────────────────┐
│         Portfolio (Next.js 16)              │
│   ┌──────────────────────────────────────┐  │
│   │    Editor3D Component                │  │
│   │  ┌────────────────────────────────┐  │  │
│   │  │  <iframe sandbox="...">        │  │  │
│   │  │    https://visite3d.../editor │  │  │
│   │  └────────────────────────────────┘  │  │
│   │                                      │  │
│   │  postMessage (validé)                │  │
│   └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
         ↕ postMessage
┌──────────────────────────────────────────────┐
│  Éditeur 3D (domaine séparé - sécurisé)      │
│  - Babylon.js 3D                             │
│  - Interface d'édition                       │
│  - Reçoit token JWT + projectId              │
└──────────────────────────────────────────────┘
```

---

## Couches de sécurité

### 1️⃣ Isolation de l'iframe (Sandbox)

**Fichier: `Editor3D.tsx`**

```tsx
sandbox={[
  "allow-same-origin",    // Nécessaire pour postMessage
  "allow-scripts",        // Nécessaire pour Babylon.js
  "allow-presentation",   // Pour fullscreen si besoin
  "allow-pointer-lock",   // Pour les contrôles 3D
  // PAS DE: allow-top-navigation, allow-popups, allow-forms, etc.
].join(" ")}
```

**Ce que cela empêche:**
- Navigation vers une autre URL (`allow-top-navigation` absent)
- Ouverture de popups/redirects malveillants
- Accès au localStorage/sessionStorage (sauf `allow-same-origin`)
- Accès au DOM parent (sauf via postMessage)

### 2️⃣ Validation d'Origin

**Fichier: `lib/security/validation.ts`**

```typescript
// Autoriser UNIQUEMENT les origins de confiance
export const ALLOWED_ORIGINS = {
  production: ["https://visite3d.example.com"],
  staging: ["https://staging-visite3d.example.com"],
  development: ["http://localhost:3000"],
};

// Vérifier à CHAQUE message reçu
if (!validateOrigin(event, getAllowedOrigins())) {
  console.warn("Message rejeté: invalid origin");
  return;
}
```

**Pourquoi c'est crucial:**
- Un attaquant pourrait injecter du code et envoyer des messages faux
- `event.origin` ne peut pas être spoofé par JavaScript
- C'est la première ligne de défense

### 3️⃣ Validation Structurelle des Messages

```typescript
validateParentMessage(data) ✓ Vérifie:
  - Type: string valide (AUTH_TOKEN, PROJECT_DATA, etc.)
  - Payload: objet valide
  - Timestamp: nombre positif, pas trop ancien (< 5 min)
  - Format: conforme à la spec TypeScript
```

**Exemple d'attaque bloquée:**
```javascript
// ❌ Bloqué: type invalide
window.postMessage({ type: 123, payload: {} }, '*');

// ❌ Bloqué: timestamp trop ancien (rejeu)
window.postMessage({ 
  type: "AUTH_TOKEN", 
  payload: {...}, 
  timestamp: Date.now() - 10*60*1000 // 10 min
}, '*');
```

### 4️⃣ Sanitization des URLs

```typescript
sanitizeUrl(url) ✓ Garantit:
  - Protocole HTTPS uniquement (sauf dev)
  - URL bien formée (new URL())
  - Pas d'injection de caractères malveillants
```

### 5️⃣ Sanitization des Strings

```typescript
sanitizeString(str, maxLength=1000) ✓ Prévient:
  - XSS (échappe les caractères HTML: <, >, ", ', &)
  - Oversized payloads (limité à 1000 caractères)
```

### 6️⃣ Validation des Tokens JWT

```typescript
validateJWT(token) ✓ Vérifie:
  - Structure valide (3 parts séparées par '.')
  - Pas expiré (vérification du champ 'exp')
  
⚠️ NOTE: Validation de signature = CÔTÉ SERVEUR seulement
```

---

## Communication postMessage

### Architecture

```
Parent (Next.js)
  │
  ├─→ send(message) : envoie à l'iframe
  │    └─ Validation: constructeur TypeScript
  │    └─ postMessage avec origin cible
  │
  └─ on(type, handler) : écoute les messages
       └─ event listener global
       └─ Validation d'origin & structure
       └─ Call handler si valide
       
Iframe (Éditeur 3D)
  │
  ├─→ send(message) : envoie au parent
  │
  └─ on(type, handler) : écoute les messages
```

### Types de messages

#### Parent → Iframe

```typescript
// 1. Authentification (TOUJOURS en premier)
{
  type: "AUTH_TOKEN",
  payload: {
    token: "eyJhbGc...",      // JWT Bearer
    projectId: "550e8400...",  // UUIDv4
    userId: "user-123",
    expiresIn: 3600
  },
  timestamp: Date.now(),
  nonce: "a1b2c3d4..." // Pour détecter les rejeux
}

// 2. Données du projet
{
  type: "PROJECT_DATA",
  payload: {
    projectId: "550e8400...",
    modelUrl: "https://s3.../model.glb",
    cameras: [{
      id: "cam-1",
      position: [0, 10, 20],
      target: [0, 0, 0],
      fov: 45,
      name: "Entrée"
    }],
    metadata: { /* custom data */ }
  },
  timestamp: Date.now()
}

// 3. Configuration éditeur
{
  type: "EDITOR_CONFIG",
  payload: {
    theme: "dark",
    features: ["lighting", "camera-edit", "export"],
    uiMode: "advanced"
  },
  timestamp: Date.now()
}

// 4. Déconnexion / revocation
{
  type: "DISCONNECT",
  payload: { reason: "token expired" },
  timestamp: Date.now()
}
```

#### Iframe → Parent

```typescript
// 1. Prêt à recevoir des messages
{
  type: "IFRAME_READY",
  payload: { iframeVersion: "1.0.0" },
  timestamp: Date.now()
}

// 2. Demande de sauvegarde
{
  type: "SAVE_PROJECT",
  payload: {
    projectId: "550e8400...",
    changes: {
      cameras: [...],
      lighting: {...},
      metadata: {...}
    },
    timestamp: Date.now()
  },
  timestamp: Date.now()
}

// 3. Erreur
{
  type: "ERROR",
  payload: {
    code: "INVALID_TOKEN",
    message: "Token JWT invalide ou expiré",
    details: { field: "token" }
  },
  timestamp: Date.now()
}

// 4. Changement d'état
{
  type: "STATE_CHANGE",
  payload: {
    state: "editing",
    details: { unsavedChanges: true }
  },
  timestamp: Date.now()
}
```

### Flux de communication sécurisée

```
1. Parent charge l'iframe
   └─ Attribute sandbox strict appliqué
   
2. Iframe envoie IFRAME_READY
   ├─ Parent reçoit via event listener
   ├─ Valide: origin, structure
   └─ Appelle onReady()

3. Parent envoie AUTH_TOKEN
   ├─ Iframe reçoit via event listener
   ├─ Valide: origin, JWT, timestamp
   ├─ Stocke token en mémoire (PAS localStorage)
   └─ Utilisable pour requêtes API

4. Parent envoie PROJECT_DATA
   ├─ Iframe charge les données
   └─ Affiche le modèle 3D

5. Utilisateur édite → Iframe envoie SAVE_PROJECT
   ├─ Parent reçoit
   ├─ Valide la signature (côté serveur)
   └─ Appelle onSave()
```

---

## Configuration CSP

**Fichier: `next.config.js`**

### Content Security Policy (CSP)

La CSP est une couche de défense supplémentaire qui empêche le navigateur de charger/exécuter des ressources non autorisées.

```http
Content-Security-Policy: 
  default-src 'self';
  frame-src 'self' https://visite3d.example.com;
  connect-src 'self' https://api.example.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  ...
```

### Directives importantes

| Directive | Valeur | Raison |
|-----------|--------|--------|
| `frame-src` | `'self' https://visite3d.example.com` | Autoriser UNIQUEMENT l'éditeur |
| `connect-src` | `'self' https://api.example.com` | API sécurisées seulement |
| `upgrade-insecure-requests` | (production) | Forcer HTTPS |
| `default-src 'self'` | Fallback | Tout le reste restreint |

### Migration vers strict CSP (futur)

Actuellement, Next.js + Tailwind exigent `'unsafe-inline'` pour les styles. Pour une meilleure sécurité:

1. **Utiliser des nonces** pour les scripts inline
2. **Générer la CSP dynamiquement** avec nonce unique par page
3. **Supprimer `'unsafe-eval'`** (sauf si nécessaire)

---

## Authentification

### Flux

```
1. Utilisateur se connecte au portfolio
   └─ Session établie (cookies HttpOnly)

2. Utilisateur accède à /editor?projectId=XXX
   └─ Page sécurisée (vérifier session)

3. Backend génère JWT signé
   {
     "sub": "user-123",
     "projectId": "550e8400...",
     "iat": 1234567890,
     "exp": 1234567890 + 3600
   }
   └─ Signature: HMAC-SHA256(secret)

4. Frontend reçoit JWT + projectId
   └─ Transmet via postMessage à l'iframe

5. Iframe stocke JWT en mémoire
   └─ Utilise dans Authorization header
   └─ PAS de localStorage (accessible par XSS)

6. Chaque API call depuis l'iframe
   └─ Authorization: Bearer <token>
   └─ Backend valide signature + exp

7. Token expire → iframe reçoit DISCONNECT
   └─ User doit se re-authentifier
```

### Best practices

```typescript
// ✅ BON
const token = "eyJhbGc..."; // En mémoire
fetch(apiUrl, {
  headers: { Authorization: `Bearer ${token}` }
});

// ❌ MAUVAIS
localStorage.setItem('token', token); // Accessible via XSS
```

---

## Flux d'initialisation

### Étape par étape

**1. Montage du composant Editor3D**

```tsx
<Editor3D
  editorUrl="https://visite3d.example.com/editor"
  authToken={jwtToken}
  projectId={projectId}
  userId={userId}
  onReady={() => console.log("Ready!")}
  onSave={(changes) => saveToBackend(changes)}
/>
```

**2. iframe chargée + sandbox appliqué**

- Navigateur applique les restrictions sandbox
- Iframe commence à charger le code

**3. Iframe envoie IFRAME_READY**

```typescript
// Dans l'iframe (useIframeChild hook)
useEffect(() => {
  send({
    type: "IFRAME_READY",
    payload: { iframeVersion: "1.0.0" },
    timestamp: Date.now()
  });
}, []);
```

**4. Parent reçoit IFRAME_READY**

```typescript
// Dans Editor3D (useIframeMessenger hook)
const { send, on } = useIframeMessenger({ ... });

useEffect(() => {
  const unsubscribe = on("IFRAME_READY", () => {
    setState("ready");
    onReady?.();
  });
  return unsubscribe;
}, [on, onReady]);
```

**5. État "ready" → Parent envoie AUTH_TOKEN**

```typescript
useEffect(() => {
  if (state === "ready") {
    authenticateIframe(); // Envoie AUTH_TOKEN
  }
}, [state, authenticateIframe]);
```

**6. Iframe reçoit + valide AUTH_TOKEN**

```typescript
// Dans l'iframe
useEffect(() => {
  const unsubscribe = on("AUTH_TOKEN", (payload) => {
    // Valider JWT
    if (!validateJWT(payload.token)) {
      throw new Error("Invalid token");
    }
    // Stocker en mémoire
    sessionState.token = payload.token;
    sessionState.projectId = payload.projectId;
  });
  return unsubscribe;
}, [on]);
```

**7. Parent envoie PROJECT_DATA**

```typescript
await send({
  type: "PROJECT_DATA",
  payload: {
    projectId,
    modelUrl: sanitizeUrl(modelUrl),
    cameras: [...],
    metadata: {...}
  },
  timestamp: Date.now()
});
```

**8. Iframe affiche le modèle 3D**

- Babylon.js initialise la scène
- Charge le GLB depuis modelUrl
- Configurationde las caméras
- IHM prête pour l'édition

---

## Checklist de sécurité

### ✅ Avant le déploiement

- [ ] Vérifier que `NEXT_PUBLIC_ALLOWED_ORIGINS` est configuré correctement
- [ ] Vérifier que `sanitizeUrl()` rejette les protocoles non-https
- [ ] Vérifier que `sandbox` n'inclut pas `allow-top-navigation`
- [ ] Vérifier que `sandbox` n'inclut pas `allow-popups`
- [ ] Vérifier que CSP est configurée dans `next.config.js`
- [ ] Vérifier que `frame-src` spécifie les bons domaines
- [ ] Vérifier que JWT_SECRET est différent en production
- [ ] Vérifier que tokens sont en mémoire, PAS localStorage
- [ ] Vérifier que postMessage valide l'origin
- [ ] Vérifier que les timestamps sont validés (< 5 min)

### 🔍 En production

- [ ] Logs des validations échouées (origin, token, etc.)
- [ ] Monitoring des tentatives de communication non-autorisées
- [ ] Rotation régulière des secrets JWT
- [ ] Audit CSP violations (Content-Security-Policy-Report-Only)
- [ ] Tests de pénétration focalisés sur iframe
- [ ] Vérifier l'absence de fuite de données sensibles en XHR

### 📊 Métriques de sécurité

```
- % de messages validés ✓
- % de tentatives origin rejetées
- Temps moyen d'initialisation
- Nombre de tokens expirés
- Erreurs de validation de structure
```

---

## Références

- [MDN: postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP: Clickjacking](https://owasp.org/www-community/attacks/clickjacking)
- [JWT.io](https://jwt.io/)
