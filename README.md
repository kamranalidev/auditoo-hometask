# HomeTask fullstack frontend engineer

## Context

Chez Auditoo, notre mission est de faciliter et d'accélérer la collecte des données sur les logements individuels par les diagnostiqueurs immobiliers, à l'aide d'une application mobile. 

Chaque année, plus de 4 millions de logements sont visités par ces professionnels.

Un diagnostic immobilier dure entre 1 et 4 heures selon la taille du logement et la complexité des missions à réaliser.

Le diagnostiqueur commence systématiquement par décrire la configuration du logement, à savoir faire l'inventaire des espaces et des niveaux qui le composent.

**Example de prompt utilisateur :**

> Je suis dans une maison, au rez-de-chaussée il y a un salon, une cuisine, un bureau, un couloir et un chambre parentale avec salle de bain et toilettes séparés. A l'étage, il y a 3 chambres, un placard technique, un dressing et une seconde salle de bain avec un wc.

## Sujet

Dans cette tâche, nous te proposons de maquetter l'interface de gestion des niveaux et des espaces d'un logement dans Auditoo, en t'appuyant sur les designs figma et en respectant les élements donnés ci-après.

Tu te concentreras uniquement sur la partie frontend, en intéragissant avec un modèle de donnée local / en mémoire. Nous aborderons les questions de data sync lors de l'échange.

### Design

- selon [les designs](https://www.figma.com/design/P6ERrCTkPIqfAMnxOSikoC/Home-Task---Full-Stack?node-id=0-1&t=GwlpViyzI6bI8GJQ-1)
- notre web app est utilisée uniquement sur mobile et navigateur chrome

### Modèle de données

- on appelera `element` un niveau ou un espace
- chaque `element` possède un `id` unique et un `name`
- les `id` sont des string de 4 chars (alphabet base64)
- un espace appartient forcément à un seul et unique niveau

### Fonctionalités de base

- [ ] modéliser la donnée (quel type ou structure adopter ?)
- [ ] ajouter un niveau ou un espace
- [ ] editer le nom d'un niveau ou d'un espace
- [ ] supprimer un niveau ou un espace

### Fonctionalités avancées

Propose une solution pour réordonner les espaces et les niveaux, en choisissant le pattern UX/UI que tu juges le plus adapté et efficace :

- [ ] réordonner les espaces au sein d'un niveau
- [ ] réordonner les niveaux entre eux
- [ ] repositionner un espace dans un autre niveau

Pour l'ordonnancement, utilise des fractional indexes (ex: lib `fractional-indexing`). Explique dans ton Loom pourquoi ce pattern est pertinent dans notre contexte métier et quels edge cases tu as identifiés.

### Stack

- architecture de type SPA (distribuée via CDN)
- react + vite + typescript
- [tanstack router](https://tanstack.com/router/latest/docs/framework/react/overview)
- tailwind v4 + [shadcn](https://ui.shadcn.com/docs/components) + [lucide](https://lucide.dev/icons/)
- [dndkit](https://next.dndkit.com/overview)

### Utilisation de l'IA

Tu es encouragé(e) à utiliser des outils d'IA (Claude Code, ou IDE IA) pour t'aider à développer.

## Rendu

- Tu peux déployer ton application gratuitement sur render (static site) pour nous permettre de tester ta feature live ou nous partager ton code source.

### Loom

Enregistre une courte vidéo Loom ([loom.com](https://www.loom.com)) de présentation. Pas besoin de faire une démo exhaustive du projet — concentre-toi sur :

- Les **choix techniques importants** que tu as faits (structure de données, librairies, patterns)
- Comment tu as **utilisé l'IA** dans ton process de développement

### Envoi

Quand tu as terminé, envoie un email à **gauthier@auditoo.eco** avec :
- Le **zip de ton code** OU un **lien vers ton repo GitHub/Render**
- Le **lien vers ton Loom**

Bonne chance et à très vite pour la session de peer programming avec Lionel !
