# Guide d'intégration - Votre portfolio existant

Comment intégrer la solution sécurisée dans votre portfolio Next.js actuel.

---

## 1. Analyse de votre architecture actuelle

Vous avez actuellement:
- ✅ Portfolio Next.js 16 (App Router)
- ✅ Composant `Viewer3D` qui charge model-viewer
- ✅ Composant `Solution` qui intègre une iframe du viewer
- ✅ Styling Tailwind CSS

### Fichier actuel: `components/sections/Solution.tsx`

```tsx
<div className="w-full h-[70vh]" onMouseEnter/Leave>
  <iframe
    src="https://hub-visite-3d.vercel.app/viewer.html"
    sandbox="allow-same-origin allow-scripts"
    // ⚠️ Pas de sandbox strict! À améliorer
  />
</div>
```

### Problèmes de sécurité actuels

1. ❌ `sandbox` incomplet → permet `allow-forms`, `allow-top-navigation`
2. ❌ Pas de validation d'origin
3. ❌ Pas de communication sécurisée postMessage
4. ❌ Pas d'authentification
5. ❌ Pas de CSP

---

## 2. Où ajouter l'éditeur sécurisé

### Option A: Page dédiée `/editor` (recommandée)

Créer une nouvelle page sécurisée pour l'édition:

```
/editor
├── page.tsx (client component)
├── layout.tsx (authentification requise)
└── actions.ts (backend - générer JWT)
```

**Avantages:**
- Isolation complète du contexte
- Authentification stricte
- Pas d'impact sur le portfolio public

**Fichiers à créer:**

```tsx
// src/app/editor/layout.tsx
import { redirect } from 'next/navigation';

export default async function EditorLayout({ children }) {
  // Vérifier que l'user est authentifié
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  
  return children;
}
```

```tsx
// src/app/editor/page.tsx
import Editor3D from '@/components/ui/Editor3D';
import { generateJWT } from './actions';

export default async function EditorPage() {
  const session = await getSession();
  const token = await generateJWT(session.userId);
  
  return (
    <Editor3D
      editorUrl={process.env.NEXT_PUBLIC_EDITOR_URL!}
      authToken={token}
      projectId={session.projectId}
      userId={session.userId}
      onSave={handleSave}
    />
  );
}
```

### Option B: Modal sur une page existante

Ajouter l'éditeur dans un modal/dialog:

```tsx
// pages/portfolio/[slug]/page.tsx
import { useState } from 'react';
import EditorModal from '@/components/EditorModal';

export default function ProjectPage() {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowEditor(true)}>
        Éditer ce projet
      </button>
      
      {showEditor && (
        <EditorModal onClose={() => setShowEditor(false)} />
      )}
    </>
  );
}
```

---

## 3. Migration du composant Solution existant

### Avant: `Solution.tsx`

```tsx
<iframe
  src="https://hub-visite-3d.vercel.app/viewer.html"
  sandbox="allow-same-origin allow-scripts"
  title="Visite virtuelle 3D"
/>
```

### Après: `Solution.tsx` amélioré

```tsx
'use client';

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export default function Solution() {
  return (
    <section id="solution">
      {/* ... texte ... */}
      
      <Reveal delai={100} className="mt-12">
        <div className="w-full h-[70vh] overflow-hidden rounded-xl border border-mine">
          <iframe
            src="https://hub-visite-3d.vercel.app/viewer.html"
            className="h-full w-full border-none"
            title="Visite virtuelle 3D"
            // ✅ Sandbox amélioré
            sandbox={[
              "allow-same-origin",
              "allow-scripts",
              "allow-presentation",
              "allow-pointer-lock"
            ].join(" ")}
            // ✅ Permissions restrictives
            allow="accelerometer; gyroscope; magnetometer"
            onMouseEnter={() => document.body.style.overflow = 'hidden'}
            onMouseLeave={() => document.body.style.overflow = 'auto'}
          />
        </div>
      </Reveal>
      
      {/* Bouton pour accéder à l'éditeur (authentifié) */}
      <Reveal delai={80} className="mx-auto mt-16 max-w-2xl text-center">
        <p className="text-lg leading-relaxed text-papier/85">
          Un écosystème tout-en-un : le viewer que vos visiteurs parcourent et
          l'éditeur avec lequel vous le pilotez.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/contact"
            className="inline-block bg-bleu-encre px-7 py-3.5 font-display text-sm font-medium text-papier hover:bg-bleu-encre-clair"
          >
            Discuter de votre projet
          </Link>
          <Link
            href="/editor"
            className="inline-block border border-bleu-encre px-7 py-3.5 font-display text-sm font-medium text-bleu-encre hover:bg-bleu-encre/10"
          >
            Accéder à l'éditeur
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
```

---

## 4. Implémentation du backend JWT

### Créer l'action serveur

```typescript
// src/app/editor/actions.ts
'use server';

import { jwtSign } from '@/lib/jwt';
import { getSession } from '@/lib/auth';

export async function generateJWT() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const payload = {
    sub: session.userId,
    projectId: session.projectId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1h
  };
  
  const token = await jwtSign(payload, process.env.JWT_SECRET!);
  return token;
}
```

### Utilitaire JWT

```typescript
// src/lib/jwt.ts
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret'
);

export async function jwtSign(payload: any, secretKey: string) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(secretKey));
  
  return token;
}

export async function jwtVerify(token: string, secretKey: string) {
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(secretKey)
  );
  
  return verified.payload;
}
```

---

## 5. Configuration des variables d'environnement

### `.env.local`

```bash
# Éditeur 3D
NEXT_PUBLIC_EDITOR_URL=https://visite3d.example.com/editor
NEXT_PUBLIC_ALLOWED_ORIGINS=https://visite3d.example.com

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=3600

# API Backend
NEXT_PUBLIC_API_URL=https://api.example.com

# Auth (exemple: NextAuth)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Variables en production

```bash
# Production (.env.production)
NEXT_PUBLIC_EDITOR_URL=https://visite3d.example.com/editor
NEXT_PUBLIC_ALLOWED_ORIGINS=https://visite3d.example.com
JWT_SECRET=<random-generated-secret>
```

---

## 6. Mise à jour du `next.config.js`

Fusionner la nouvelle CSP avec votre config existante:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... votre config actuelle ...
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ... vos headers existants ...
          
          // Ajouter CSP
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self' https://visite3d.example.com",
              "connect-src 'self' https://api.example.com",
              // ... autres directives ...
            ].join('; ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## 7. Gestion de l'authentification

### Option 1: NextAuth.js

```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin');
  }
  return session;
}
```

### Option 2: Authentification personnalisée

```typescript
// lib/auth.ts
export async function getSession() {
  const cookies = require('next/headers').cookies();
  const token = cookies.get('session-token')?.value;
  
  if (!token) return null;
  
  return await verifySessionToken(token);
}

async function verifySessionToken(token: string) {
  // Appeler votre backend d'authentification
  const response = await fetch(`${process.env.AUTH_API}/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) return null;
  return await response.json();
}
```

---

## 8. Composant réutilisable EditorModal

Utile si vous voulez embarquer l'éditeur dans une modale:

```tsx
// src/components/EditorModal.tsx
'use client';

import { useEffect, useState } from 'react';
import Editor3D from '@/components/ui/Editor3D';

interface EditorModalProps {
  projectId: string;
  onClose: () => void;
}

export default function EditorModal({ projectId, onClose }: EditorModalProps) {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  
  useEffect(() => {
    // Récupérer le token du serveur
    fetch('/api/auth/token', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        setToken(data.token);
        setUserId(data.userId);
      });
  }, []);
  
  if (!token) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">Éditeur 3D</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
        
        {/* Contenu */}
        <div className="flex-1 overflow-hidden">
          <Editor3D
            editorUrl={process.env.NEXT_PUBLIC_EDITOR_URL!}
            authToken={token}
            projectId={projectId}
            userId={userId}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Route API pour générer les tokens

```typescript
// src/app/api/auth/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateJWT } from '@/app/editor/actions';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = await generateJWT();
    
    return NextResponse.json({
      token,
      userId: session.userId,
      projectId: session.projectId
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
```

---

## 10. Checklist d'intégration

- [ ] Copier tous les fichiers dans `src/`
- [ ] Mettre à jour `next.config.js` avec CSP
- [ ] Ajouter variables d'environnement à `.env.local`
- [ ] Créer page `/editor` avec authentification
- [ ] Créer route API `/api/auth/token`
- [ ] Implémenter JWT (côté backend)
- [ ] Tester en dev: `npm run dev` → accéder à `http://localhost:3000/editor`
- [ ] Vérifier DevTools: Console → pas d'erreurs postMessage
- [ ] Tester authentification: token doit s'envoyer à l'iframe
- [ ] Vérifier CSP: aucun warning CSP dans Console
- [ ] Tester sandbox: iframe ne peut pas naviguer au top
- [ ] Déployer en staging d'abord
- [ ] Tester en production avec domaines finaux
- [ ] Configurer logs/monitoring

---

## 11. Commandes utiles

```bash
# Développement
npm run dev
# → http://localhost:3000/editor

# Build
npm run build

# Prod
npm run start

# Lint & type-check
npm run lint
npm run type-check

# Tester postMessage (DevTools)
// Dans la console parent
window.frames[0].postMessage({
  type: 'AUTH_TOKEN',
  payload: { token: 'test', projectId: '...', userId: 'test' },
  timestamp: Date.now()
}, 'http://localhost:3000')
```

---

## 12. Problèmes courants lors de l'intégration

### ❌ "Cannot find module" après copie

```
Solution:
1. Vérifier que tous les imports sont relatifs (@/)
2. Vérifier que tsconfig.json a les paths configurés
3. Redémarrer dev server
```

### ❌ CSP blocking resources

```
Solution:
1. Ouvrir DevTools → Console
2. Chercher "Refused to load..."
3. Ajouter la ressource à CSP dans next.config.js
```

### ❌ postMessage: "Message rejected"

```
Solution:
1. Vérifier NEXT_PUBLIC_ALLOWED_ORIGINS
2. Vérifier l'origin réel de l'iframe
3. Vérifier que origin n'a pas de trailing slash
```

### ❌ Authentification échoue

```
Solution:
1. Vérifier JWT_SECRET en .env.local
2. Vérifier que la session existe (cookies)
3. Vérifier les logs du serveur
```

---

## Prochaines étapes

1. **Intégration Babylon.js** dans l'iframe
2. **API de sauvegarde** backend (POST /api/projects/save)
3. **Gestion des projets** (listing, suppression, partage)
4. **Tests E2E** (Cypress/Playwright)
5. **Déploiement production** (vérifier CSP, headers, origins)
