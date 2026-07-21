# Hero Section — Graphite 3D Portfolio

## Architecture

```
src/
├── components/hero/
│   ├── HeroLayout.tsx        (serveur) — Structure global + grille responsive
│   ├── HeroContent.tsx       (client)  — Texte, CTA, repères
│   ├── ModelViewer.tsx       (client)  — Viewer 3D + gestion d'état
│   └── index.ts              — Exports centralisés
├── types/
│   └── hero.ts               — Types TypeScript partagés
└── app/
    └── page.example.tsx      — Exemple d'intégration + SEO
```

## Utilisation

### Import simple

```tsx
import { HeroLayout } from '@/components/hero';

export default function Home() {
  return (
    <HeroLayout 
      modelUrl="https://exemple.com/mon-modele.glb"
      modelAlt="Visite 3D interactive"
    />
  );
}
```

### Avec metadata SEO

```tsx
import type { Metadata } from 'next';
import { HeroLayout } from '@/components/hero';

export const metadata: Metadata = {
  title: 'Denis Masque | Graphiste 3D Généraliste',
  description: 'Solutions de visites virtuelles 3D immersives.',
  keywords: ['visite virtuelle 3D', 'modélisation 3D', 'Babylon.js'],
};

export default function Home() {
  return <HeroLayout modelUrl="..." />;
}
```

### Avec callbacks (analytics, routing)

```tsx
import { HeroContent, ModelViewer } from '@/components/hero';

export default function CustomHero() {
  return (
    <div className="grid md:grid-cols-12 gap-16">
      <div className="md:col-span-5">
        <HeroContent 
          onDemoClick={() => console.log('Demo clicked')}
          onProjectsClick={() => console.log('Projects clicked')}
        />
      </div>
      <div className="md:col-span-7">
        <ModelViewer 
          src="..." 
          alt="..."
          onLoad={() => console.log('Model loaded')}
          onError={(err) => console.error(err)}
        />
      </div>
    </div>
  );
}
```

## Configuration

### Tailwind tokens

Les couleurs sont pré-configurées dans `tailwind.config.ts`:

```tsx
// Utilisation
<div className="bg-encre text-papier border-mine">
  <h1 className="text-bleu-encre">Titre</h1>
</div>
```

### Fonts

Les trois fontes sont chargées dans `src/app/fonts.ts`:

- **Archivo** (display) — Grotesque large et technique
- **Instrument Sans** (body) — Neutre et lisible
- **IBM Plex Mono** (mono) — Pour les chiffres et cotes

## Grille Responsive (Bento Grid)

| Breakpoint | Layout | HeroContent | ModelViewer |
|------------|--------|-------------|-------------|
| Mobile    | 1 col  | col-span-1  | col-span-1  |
| md (768px)| 12 col | col-span-5  | col-span-7  |

## États du ModelViewer

```
idle    → loading → ready
              ↓
            error
```

- **idle**: Avant le montage
- **loading**: CDN/modèle en cours de chargement
- **ready**: Modèle chargé et interactif
- **error**: Erreur de chargement (affiche message + callback)

## Performance

- **Script strategy**: `lazyOnload` — model-viewer charge après l'interaction utilisateur
- **CLS**: Aspect ratio fixe sur le viewer = zéro layout shift
- **LCP**: H1 au premier paint (composant serveur, pas de JS bloquant)
- **INP**: ModelViewer en iframe potentielle (même origine) = thread partagé

## SEO

- ✅ H1 unique et structuré
- ✅ Meta descriptions + keywords
- ✅ JSON-LD (ProfessionalService)
- ✅ Open Graph / Twitter Cards
- ✅ Mots-clés cibles: "visite virtuelle 3D", "modélisation 3D", "Babylon.js"

## Dépannage

### Le modèle ne charge pas

1. Vérifier que l'URL est valide et CORS-compatible
2. Vérifier que model-viewer CDN a chargé (console: `window.ModelViewerElement`)
3. Vérifier le format (GLB/GLTF)
4. Regarder `onError` callback

### Le viewer reste en "loading"

- model-viewer n'émet pas d'événement `load` → vérifier le modèle lui-même
- Le CDN n'a pas chargé → vérifier la connexion réseau

### Les cotes ne s'affichent pas

- Mobile: cotes masquées (`display: none` sur md+)
- `showDimensions={false}` sur ModelViewer
- ResizeObserver pas initié → vérifier le navigateur

---

**Version**: 1.0  
**Dernière mise à jour**: Juillet 2026
