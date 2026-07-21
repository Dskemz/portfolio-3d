# Étape 4: Intégration sécurisée de l'Éditeur 3D

Architecture sécurisée pour intégrer un éditeur 3D privé (Babylon.js) via iframe dans votre portfolio Next.js 16.

## 🎯 Objectif

Mettre en place une iframe sécurisée avec:
- ✅ Sandbox strict pour l'isolation
- ✅ Communication postMessage validée
- ✅ Authentification JWT
- ✅ Content Security Policy
- ✅ Validation d'origins
- ✅ Protection contre les attaques courantes

---

## 📁 Structure des fichiers

```
src/
├── components/ui/
│   └── Editor3D.tsx              # Composant principal
├── lib/security/
│   └── validation.ts             # Utilitaires de sécurité
├── hooks/
│   └── useIframeMessenger.ts      # Hook postMessage
├── types/
│   └── iframe-messages.ts         # Types TypeScript stricts
└── app/
    └── editor/
        └── page.tsx              # Page d'exemple
        
next.config.js                    # CSP + headers de sécurité
ARCHITECTURE_SECURITE.md           # Documentation détaillée
.env.example                       # Variables d'environnement
```

---

## 🚀 Intégration rapide

### 1. Copier les fichiers dans votre projet

```bash
# Depuis le dossier projet-securise
cp -r src/* /path/to/your/portfolio/src/
cp next.config.js /path/to/your/portfolio/
cp .env.example /path/to/your/portfolio/.env.local
```

### 2. Configurer les variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_EDITOR_URL=https://visite3d.example.com/editor
NEXT_PUBLIC_ALLOWED_ORIGINS=https://visite3d.example.com
JWT_SECRET=your-secret-key-here
```

### 3. Utiliser le composant Editor3D

```tsx
import Editor3D from "@/components/ui/Editor3D";

export default function Page() {
  return (
    <Editor3D
      editorUrl={process.env.NEXT_PUBLIC_EDITOR_URL!}
      authToken={jwtToken}
      projectId={projectId}
      userId={userId}
      onSave={(changes) => console.log("Save:", changes)}
    />
  );
}
```

---

## 🔒 Points de sécurité essentiels

### 1. Sandbox de l'iframe

```tsx
sandbox={[
  "allow-same-origin",    // Pour postMessage
  "allow-scripts",        // Pour Babylon.js
  "allow-presentation",   // Pour fullscreen
  "allow-pointer-lock"    // Pour contrôles 3D
].join(" ")}
```

**⚠️ À JAMAIS ajouter:**
- `allow-top-navigation` → empêche les redirection vers autre URL
- `allow-popups` → empêche les popups malveillants
- `allow-forms` → empêche les forms cachées

### 2. Validation d'origin

```typescript
// Tous les domaines autorisés
export const ALLOWED_ORIGINS = {
  production: ["https://visite3d.example.com"],
  staging: ["https://staging-visite3d.example.com"],
  development: ["http://localhost:3000"],
};

// À chaque message reçu
if (!validateOrigin(event, getAllowedOrigins())) {
  return; // Rejeter le message
}
```

### 3. Validation de structure

```typescript
// Vérifie automatiquement:
validateParentMessage(data)
  ✓ Type valide (string)
  ✓ Payload valide (object)
  ✓ Timestamp valide (nombre, < 5 min)
  ✓ Format conforme TypeScript
```

### 4. JWT - stockage en mémoire

```typescript
// ✅ BON
let token = "eyJhbGc..."; // Variable locale

// ❌ MAUVAIS
localStorage.setItem('token', token); // Accessible par XSS
sessionStorage.setItem('token', token); // Idem
```

### 5. CSP stricte

```javascript
// next.config.js
"frame-src 'self' https://visite3d.example.com",
"default-src 'self'",
"upgrade-insecure-requests", // HTTPS uniquement
```

---

## 📝 Flux d'authentification

```
1. User se connecte au portfolio
   ↓
2. Page /editor charge
   ↓
3. Backend génère JWT signé
   JWT = {
     "sub": "user-123",
     "projectId": "550e...",
     "exp": now + 3600
   }
   ↓
4. Frontend envoie JWT à l'iframe via postMessage
   postMessage({
     type: "AUTH_TOKEN",
     payload: { token: JWT, ... }
   })
   ↓
5. Iframe valide JWT + stocke en mémoire
   ↓
6. Iframe fait requêtes API avec Authorization header
   fetch(apiUrl, {
     headers: { Authorization: `Bearer ${token}` }
   })
   ↓
7. Backend valide signature + expiration
   ↓
8. Si valide → données retournées
```

---

## 🧪 Test de sécurité

### Test 1: Validation d'origin

```typescript
// ❌ Doit être rejeté
const evil = new MessageEvent('message', {
  data: { type: 'AUTH_TOKEN', payload: {...} },
  origin: 'https://evil.com' // ← NOT in ALLOWED_ORIGINS
});

// ✅ Sera accepté
const good = new MessageEvent('message', {
  data: { type: 'AUTH_TOKEN', payload: {...} },
  origin: 'https://visite3d.example.com' // ← In ALLOWED_ORIGINS
});
```

### Test 2: Validation de structure

```typescript
// ❌ Doit être rejeté (pas de timestamp)
postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: '...' }
  // timestamp manquant!
}, origin);

// ✅ Sera accepté
postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: '...' },
  timestamp: Date.now()
}, origin);
```

### Test 3: Sandboxing

```javascript
// Dans l'iframe, ces opérations doivent échouer:
window.top.location.href = "https://evil.com"; // ❌ Bloqué
window.open("https://evil.com"); // ❌ Bloqué
document.cookie = "admin=true"; // ❌ Bloqué
```

---

## 🐛 Débogage

### Vérifier les logs de communication

```typescript
// Dans le composant Editor3D
const { send, on } = useIframeMessenger({
  onError: (error) => console.error("Communication error:", error)
});

// Dans l'iframe
useEffect(() => {
  const unsubscribe = on("AUTH_TOKEN", (payload) => {
    console.log("✓ AUTH_TOKEN reçu:", payload);
  });
  return unsubscribe;
}, [on]);
```

### Vérifier la CSP

Ouvrir DevTools → Console:
```javascript
// Doit afficher les directives CSP
document.currentScript?.getAttribute('csp')
// Ou regarder les headers réseau
```

### Vérifier le sandbox

```javascript
// Dans l'iframe:
console.log(document.currentScript?.sandbox); // Doit afficher les tokens
```

---

## 📊 Performance

### Optimisations

1. **Lazy load de l'iframe** → utilisé seulement sur /editor
2. **Compilation séparée** → code Babylon.js en bundle séparé
3. **Message batching** → grouper plusieurs changements avant postMessage
4. **Debouncing** → limiter la fréquence des SAVE_PROJECT

### Temps d'initialisation (cible)

- 0-500ms: Montage du composant
- 500-1000ms: Chargement iframe + Babylon.js
- 1000-1500ms: Envoi AUTH_TOKEN
- 1500-2000ms: Chargement du modèle 3D
- **Total: < 2s**

---

## 🚨 Erreurs courantes

### ❌ Erreur 1: "Message rejected: invalid origin"

```
Cause: L'origin de l'iframe n'est pas dans ALLOWED_ORIGINS
Solution:
  1. Vérifier l'URL dans NEXT_PUBLIC_EDITOR_URL
  2. Ajouter le domaine à ALLOWED_ORIGINS
  3. En dev: "http://localhost:3000"
```

### ❌ Erreur 2: "Token is invalid or expired"

```
Cause: JWT non valide ou expiré
Solution:
  1. Vérifier que tokenExpiresIn > 0
  2. Vérifier que JWT_SECRET est identique côté backend
  3. Vérifier la durée de vie (min 5min pour l'édition)
```

### ❌ Erreur 3: "iframe not available"

```
Cause: iframe pas encore montée quand on envoie un message
Solution:
  1. Attendre event "IFRAME_READY" avant d'envoyer
  2. Utiliser setState("ready") dans onReady
  3. Vérifier que iframeRef.current existe
```

### ❌ Erreur 4: "sandbox: allow-top-navigation not allowed"

```
Cause: Vous avez ajouté allow-top-navigation au sandbox
Solution:
  1. RETIRER allow-top-navigation
  2. Si redirection nécessaire → utiliser postMessage
```

---

## 🔄 Mise à jour vers stricte CSP (futur)

Actuellement, CSP utilise `'unsafe-inline'` pour flexibilité. Pour meilleure sécurité:

```javascript
// Étape 1: Utiliser des nonces
<script nonce={nonce}>...</script>

// Étape 2: Générer nonce aléatoire par page
const nonce = crypto.randomUUID();

// Étape 3: Inclure dans CSP
"script-src 'nonce-{nonce}' 'strict-dynamic'"

// Étape 4: Supprimer 'unsafe-inline' et 'unsafe-eval'
```

---

## 📞 Support & Questions

Pour une assistance technique:
1. Vérifier `ARCHITECTURE_SECURITE.md`
2. Activer les logs (DevTools)
3. Vérifier `.env.local` vs `.env.example`
4. Tester en isolation: créer une simple demo avec postMessage

---

## 📄 Licence

MIT

---

## 🎉 Prochaines étapes

- [x] Étape 4a: Architecture iframe sécurisée ✓ (VOUS ÊTES ICI)
- [ ] Étape 4b: Intégration Babylon.js dans l'iframe
- [ ] Étape 4c: API de sauvegarde backend
- [ ] Étape 4d: Tests d'intégration E2E
- [ ] Étape 5: Déploiement en production
