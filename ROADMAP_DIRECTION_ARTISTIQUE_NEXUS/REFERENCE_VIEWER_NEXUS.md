# Document de référence — Viewer Nexus

## Rôle dans la home

Le viewer du fauteuil devient la démonstration principale de Nexus. La home ne présente pas une succession d’images : elle montre une expérience interactive construite directement dans le système.

## Workflow visuel

```text
Maillage → Wireframe → Matière → Vue éclatée → Reconstruction → Studio → Gravité → Présentation finale → Prise de rendez-vous
```

### 1. Création du maillage

- des points apparaissent progressivement ;
- les points se connectent ;
- les faces apparaissent et se triangulent ;
- le wireframe complet du fauteuil se construit sous l’action du scroll.

### 2. Passage vers la matière

- l’intensité du wireframe diminue ;
- l’ambient occlusion devient visible ;
- une mécanique de noise révèle progressivement les textures ;
- le modèle passe de la structure à la matière.

### 3. Vue éclatée

- les pieds, l’assise, le dossier et les accessoires se détachent ;
- l’utilisateur peut tourner autour du modèle ;
- certaines pièces, comme les patins, peuvent se visser ou s’animer ;
- des annotations courtes apparaissent sur les éléments concernés.

### 4. Reconstruction

- les composants reviennent de manière plus dynamique ;
- le fauteuil se recompose ;
- une légère inertie donne du poids aux mouvements ;
- la scène évite un rendu trop mécanique.

### 5. Apparition du studio

- un cyclo ou un espace de présentation apparaît ;
- le fond de la page peut évoluer ;
- les lumières et la caméra se mettent en place ;
- le modèle passe d’un espace technique à une présentation produit.

### 6. Gravité et stabilisation

- le fauteuil tombe ou se pose au sol ;
- une ombre portée accompagne le contact ;
- une légère animation de stabilisation donne une sensation de poids et de présence.

### 7. Présentation finale

- le fauteuil est présenté dans sa scène finale ;
- l’utilisateur peut manipuler le viewer Nexus ;
- la séquence se termine par une prise de rendez-vous.

## Fonction narrative

- Le maillage explique la construction.
- Le wireframe explique la structure.
- Le noise révèle la matière.
- L’éclaté explique les composants.
- La reconstruction montre la cohésion.
- Le studio montre la mise en scène.
- La gravité donne une sensation de présence.
- Le viewer prouve l’interactivité de Nexus.

## Direction du scroll

Le storytelling est horizontal sur desktop afin de :

- renforcer la sensation de déplacement ;
- garder le fauteuil posé dans un espace cohérent ;
- rendre l’éclaté latéral naturel ;
- se différencier des parcours verticaux classiques.

Sur mobile, la même expérience devient verticale :

- caméra plus proche ;
- objets recentrés ;
- annotations empilées ;
- éclaté vertical ou en profondeur ;
- interactions tactiles simplifiées.

Il s’agit d’un seul workflow responsive, avec une mise en scène différente selon l’axe disponible.

## Onglet Nexus

L’onglet Nexus doit devenir une preuve directe de fonctionnement et proposer :

1. le configurateur de plaque ;
2. le générateur de bague ;
3. le fauteuil interactif ;
4. une vidéo explicative de Nexus.

La vidéo explique simplement la logique :

```text
mécaniques atomiques → groupes composés → expériences interactives → Nexa assemble les possibilités
```

L’utilisateur doit pouvoir regarder, manipuler, comprendre et comparer les expériences.

## Principe technique et artistique

Cette présentation doit être produite directement dans Nexus : mesh reveal, wireframe, noise, parentage, éclaté, caméra, courbes, gravité, ombres, matériaux et interactions. Aucun visuel généré par IA ne doit simuler le workflow.
