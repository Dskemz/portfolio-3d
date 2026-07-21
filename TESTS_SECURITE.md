# Tests de sécurité - Iframe & postMessage

Guide pour tester et valider la sécurité de l'architecture iframe.

---

## 📋 Tests manuels (DevTools)

### Test 1: Validation d'Origin

**Objectif:** Vérifier qu'un message provenant d'un mauvais origin est rejeté.

**Procédure:**

1. Ouvrir `/editor` dans le navigateur
2. Ouvrir DevTools (F12)
3. Aller dans l'onglet Console
4. Exécuter:

```javascript
// Message VALIDE (du bon origin)
window.frames[0].postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: 'test-token', projectId: 'test-id' },
  timestamp: Date.now()
}, window.location.origin);
// ✅ Doit être traité

// Message INVALIDE (du mauvais origin - simulé)
// ❌ Ne pas exécuter réellement (postMessage contrôle l'origin)
// Mais illustre le concept
```

**Résultat attendu:**
- Logs: "✓ AUTH_TOKEN reçu"
- Pas d'erreur dans la console

---

### Test 2: Validation de structure du message

**Objectif:** Vérifier que les messages mal formés sont rejetés.

**Procédure:**

```javascript
// ❌ Message sans timestamp
window.frames[0].postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: 'test' }
  // ← timestamp manquant!
}, window.location.origin);
// Résultat: "Invalid message: timestamp required"

// ❌ Message avec timestamp trop ancien (> 5 min)
window.frames[0].postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: 'test', projectId: 'test-id' },
  timestamp: Date.now() - (10 * 60 * 1000) // 10 min
}, window.location.origin);
// Résultat: "Message expired"

// ❌ Message avec type invalide
window.frames[0].postMessage({
  type: 123, // ← number au lieu de string!
  payload: {},
  timestamp: Date.now()
}, window.location.origin);
// Résultat: "Invalid message: type must be string"
```

**Résultat attendu:**
- Tous les messages invalides doivent générer une erreur
- Logs: "Message validation failed"

---

### Test 3: Sandbox - Impossibilité de naviguer le top

**Objectif:** Vérifier que l'iframe ne peut pas rediriger la page parente.

**Procédure:**

1. Dans la console de l'iframe (click droit → Inspector):
2. Exécuter:

```javascript
// ❌ Doit échouer silencieusement (sandbox sans allow-top-navigation)
window.top.location.href = "https://evil.com";
console.log("Redirection tentée");
// Résultat: iframe ne peut pas changer location du parent
```

**Résultat attendu:**
- Aucune navigation du parent
- Pas d'erreur visible, mais action bloquée
- URL du parent inchangée

---

### Test 4: Sandbox - Impossibilité d'ouvrir des popups

**Objectif:** Vérifier que l'iframe ne peut pas ouvrir de popups.

**Procédure:**

```javascript
// ❌ Doit échouer (sandbox sans allow-popups)
window.open("https://evil.com");
// Résultat: null (popup ouverture interdite)

// ✅ Vérifier le résultat
console.log(window.open("https://google.com")); 
// → null (pas de popup créée)
```

**Résultat attendu:**
- `window.open()` retourne `null`
- Aucune popup ne s'ouvre
- Pas d'erreur dans la console

---

### Test 5: JWT - Validation de structure

**Objectif:** Vérifier que les JWT malformés sont rejetés.

**Procédure:**

```javascript
// ❌ JWT sans les 3 parties
const badJWT1 = "not.a.jwt";
validateJWT(badJWT1);
// Résultat: false

// ❌ JWT avec payload expiré
const expiredJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6MTAwfQ.signature";
validateJWT(expiredJWT);
// Résultat: false

// ✅ JWT valide (peut-être généré par votre backend)
const validJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6OTk5OTk5OTk5OX0.signature";
validateJWT(validJWT);
// Résultat: true
```

**Résultat attendu:**
- JWT invalides → `false`
- JWT expiré → `false`
- JWT valide → `true`

---

### Test 6: URL Sanitization

**Objectif:** Vérifier que les URLs malveillantes sont rejetées.

**Procédure:**

```javascript
import { sanitizeUrl } from '@/lib/security/validation';

// ❌ Protocole non-https
try {
  sanitizeUrl("http://example.com");
  console.log("❌ HTTP devrait être rejeté en production");
} catch (e) {
  console.log("✓ HTTP rejeté:", e.message);
}

// ❌ URL JavaScript injection
try {
  sanitizeUrl("javascript:alert('xss')");
  console.log("❌ JavaScript URL devrait être rejeté");
} catch (e) {
  console.log("✓ JavaScript URL rejeté:", e.message);
}

// ❌ Protocole data
try {
  sanitizeUrl("data:text/html,<script>alert('xss')</script>");
  console.log("❌ Data URL devrait être rejeté");
} catch (e) {
  console.log("✓ Data URL rejeté:", e.message);
}

// ✅ URL valide
try {
  const cleaned = sanitizeUrl("https://example.com/path");
  console.log("✓ URL HTTPS acceptée:", cleaned);
} catch (e) {
  console.log("❌ Erreur:", e.message);
}
```

**Résultat attendu:**
- HTTP rejeté en production ✓
- Protocoles malveillants rejetés ✓
- HTTPS accepté ✓

---

### Test 7: XSS Prevention (String Sanitization)

**Objectif:** Vérifier que les caractères HTML dangereux sont échappés.

**Procédure:**

```javascript
import { sanitizeString } from '@/lib/security/validation';

// ❌ Injection de tags HTML
const malicious = "<script>alert('xss')</script>";
const sanitized = sanitizeString(malicious);
console.log(sanitized);
// Résultat: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
// → Les < et > sont échappés → pas d'exécution

// ❌ Injection de quotes
const quotes = 'Hello" onclick="alert(\'xss\')"';
const sanitized2 = sanitizeString(quotes);
console.log(sanitized2);
// Résultat: 'Hello&quot; onclick=&quot;alert(&#x27;xss&#x27;)&quot;'
// → Les quotes sont échappés

// ✅ Texte normal
const normal = "Hello, World!";
const sanitized3 = sanitizeString(normal);
console.log(sanitized3);
// Résultat: "Hello, World!" (inchangé)
```

**Résultat attendu:**
- `<`, `>`, `"`, `'`, `&` sont remplacés par entités HTML
- Pas d'exécution de JavaScript
- Texte normal préservé

---

### Test 8: CSP - Vérifier les headers

**Objectif:** Vérifier que la CSP est bien configurée.

**Procédure:**

1. Ouvrir DevTools → Onglet Network
2. Recharger la page
3. Cliquer sur la première ressource (document principal)
4. Aller dans l'onglet Headers
5. Chercher "Content-Security-Policy"

**Résultat attendu:**
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  frame-src 'self' https://visite3d.example.com; 
  ...
```

**Vérifications:**
- [ ] `default-src 'self'` présent
- [ ] `frame-src` inclut le domaine de l'éditeur
- [ ] `frame-src` n'inclut PAS `*` (wildcard)
- [ ] `upgrade-insecure-requests` en production
- [ ] `script-src` ne contient pas `*`

---

### Test 9: CSP - Bloquer les ressources non-autorisées

**Objectif:** Vérifier que CSP bloque les ressources non-autorisées.

**Procédure:**

1. Dans la console:

```javascript
// ❌ Charger un script non-autorisé
const script = document.createElement('script');
script.src = 'https://untrusted-cdn.com/script.js';
document.head.appendChild(script);
```

2. Vérifier les logs:

**Résultat attendu:**
- Console: "Refused to load the script '...' because it violates the Content Security Policy directive"
- Le script n'est pas chargé
- Pas d'erreur d'exécution

---

## 🤖 Tests automatisés

### Test avec Jest/Vitest

```typescript
// __tests__/security/validation.test.ts

import {
  validateOrigin,
  validateJWT,
  sanitizeUrl,
  sanitizeString,
} from '@/lib/security/validation';

describe('Security Validation', () => {
  
  describe('validateOrigin', () => {
    it('should accept valid origins', () => {
      const event = new MessageEvent('message', {
        origin: 'https://visite3d.example.com'
      });
      
      expect(validateOrigin(event, ['https://visite3d.example.com']))
        .toBe(true);
    });
    
    it('should reject invalid origins', () => {
      const event = new MessageEvent('message', {
        origin: 'https://evil.com'
      });
      
      expect(validateOrigin(event, ['https://visite3d.example.com']))
        .toBe(false);
    });
  });
  
  describe('validateJWT', () => {
    it('should accept valid JWT', () => {
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6OTk5OTk5OTk5OX0.signature';
      expect(validateJWT(validJWT)).toBe(true);
    });
    
    it('should reject malformed JWT', () => {
      expect(validateJWT('not.a.jwt')).toBe(false);
      expect(validateJWT('only-two-parts')).toBe(false);
    });
  });
  
  describe('sanitizeUrl', () => {
    it('should accept https URLs', () => {
      const url = 'https://example.com/path';
      expect(() => sanitizeUrl(url)).not.toThrow();
    });
    
    it('should reject http URLs in production', () => {
      process.env.NODE_ENV = 'production';
      expect(() => sanitizeUrl('http://example.com'))
        .toThrow();
    });
    
    it('should reject malicious URLs', () => {
      expect(() => sanitizeUrl('javascript:alert("xss")'))
        .toThrow();
      expect(() => sanitizeUrl('data:text/html,<script>alert</script>'))
        .toThrow();
    });
  });
  
  describe('sanitizeString', () => {
    it('should escape HTML characters', () => {
      const result = sanitizeString('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });
  });
});
```

### Exécuter les tests

```bash
npm test -- tests/security
```

---

## 🔍 Tests de pénétration (Penetration Testing)

### Test 1: Replay attack

**Objectif:** Vérifier qu'un ancien message ne peut pas être rejeu.

```javascript
// Capturer un message légitime
const message = {
  type: 'AUTH_TOKEN',
  payload: { token: '...', projectId: '...' },
  timestamp: Date.now() - 1000 // 1 sec ago
};

// Attendre 5+ minutes
setTimeout(() => {
  // Renvoyer le même message
  window.frames[0].postMessage(message, origin);
  // ❌ Doit être rejeté: "Message timestamp is Xs old (max: 300s)"
}, 5 * 60 * 1000);
```

### Test 2: Man-in-the-Middle (MITM) simulation

**Objectif:** Vérifier que les tokens ne peuvent pas être intercept/réutilisés.

```javascript
// ❌ Essayer d'utiliser un token d'une autre session
const stolenToken = 'eyJ...'; // Token intercepté
fetch(`${API_URL}/api/projects`, {
  headers: { Authorization: `Bearer ${stolenToken}` }
});
// Résultat: 401 Unauthorized (signature invalide)
```

### Test 3: CSRF - Cross-Site Request Forgery

**Objectif:** Vérifier que l'iframe ne peut pas faire de requêtes au domaine parent.

```javascript
// Dans l'iframe
// ❌ Essayer de faire une requête au parent avec credentials
fetch('https://portfolio.example.com/api/admin', {
  credentials: 'include' // Inclure les cookies
});
// Résultat: Cross-origin request blocked (CORS)
// + CSP bloque la connexion
```

---

## 📊 Checklist de validation

- [ ] **Origin validation**
  - [ ] Messages d'origin non-autorisé rejetés
  - [ ] Logs des rejets
  
- [ ] **Message structure**
  - [ ] Messages sans timestamp rejetés
  - [ ] Messages trop anciens rejetés
  - [ ] Type invalide rejeté
  
- [ ] **Sandbox**
  - [ ] allow-top-navigation absent
  - [ ] allow-popups absent
  - [ ] allow-forms absent
  - [ ] iframe ne peut pas naviguer le top
  
- [ ] **JWT**
  - [ ] JWT malformés rejetés
  - [ ] JWT expiré rejeté
  - [ ] Signature vérifiée côté serveur
  
- [ ] **URLs**
  - [ ] HTTP rejeté en production
  - [ ] javascript: rejeté
  - [ ] data: rejeté
  - [ ] HTTPS accepté
  
- [ ] **XSS**
  - [ ] HTML tags échappés
  - [ ] Quotes échappés
  - [ ] Texte normal préservé
  
- [ ] **CSP**
  - [ ] Headers présents
  - [ ] frame-src correctement configuré
  - [ ] default-src 'self'
  - [ ] Pas de CSP warnings en console

---

## 📝 Rapporter les vulnérabilités

Si vous découvrez une faille de sécurité:

1. **Ne pas la publier publiquement**
2. **Nous contacter privément**
3. **Inclure:**
   - Description du problème
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correction (si applicable)

---

## Ressources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [MDN: postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Content Security Policy Violations](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
