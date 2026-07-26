# CLAUDE.md - Directives pour le projet de portfolio 3D

## 1. Profil & Philosophie du Projet
- **Utilisateur :** Graphiste 3D (ne code pas). Autonomie et efficacité maximales requises.
- **Règles d'or absolues :**
  - **Sobriété et efficacité :** Le plus simple est toujours la meilleure solution. Pas de plugins ou d'effets tendance superflus, privilégier l'identité visuelle de l'auteur.
  - **Performance universelle :** Le site et le viewer 3D doivent être extrêmement légers et parfaitement fonctionnels sur tous les supports (desktop, tablettes, mobiles).
  - **Rendu professionnel :** Le design et l'intégration doivent être irréprochables, propres et élégants.

## 2. Stack Technique
- **Framework Frontend :** Next.js
- **Animations UI :** Tailwind Motion (exclusivement pour les micro-interactions et transitions d'interface, pour préserver les performances du viewer 3D).
- **Viewer 3D :** Babylon.js (intégré dans une page ou un composant dédié, ex: `viewer.tsx` ou `viewer.html`).
- **Version Control & Hosting :** Git / GitHub (push automatique via Vercel).

## 3. Directives de Communication & Tokens
- **Mode d'exécution :** Exécute les tâches directement et rapidement sans explications superflues. **Ne fais pas de longs discours.** 
- **Exception :** N'explique le code *que* si l'utilisateur le demande explicitement.
- **Économie de tokens :** Sois concis dans tes réponses. Va droit au but, modifie les fichiers nécessaires sans réécrire l'intégralité du projet si ce n'est pas requis.
- **Commentaires dans le code :** Ajoute des annotations claires et concises directement dans le code (commentaires `//` ou `/* */`) pour identifier les zones modifiées ou les paramètres basiques que l'utilisateur pourrait vouloir ajuster lui-même (ex: position de la caméra, intensité de la lumière, chemins des assets `.glb`).

## 4. Commandes Utiles
- Lancement en local : `npm run dev`
- Build de vérification : `npm run build`