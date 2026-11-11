# Repère de lecture et ouvertures plein écran

Préparation du 11 novembre 2026, sans publication.

## Décisions visuelles

La charte Altitude reste la référence dominante : encre, cuivre, Geist et données en mono. Recherche Refero complémentaire : **Mercury — atmospheric everyday ambition** (`a4f6a081-6711-4696-b9d0-97192e907949`) pour les repères compacts sur des fonds alternés, et **Column — infrastructure in soft focus** (`cac43891-1ba6-43b5-b8a8-c71c4a1a5457`) pour les filets techniques et annotations chiffrées. Leurs palettes et polices ne sont pas reprises.

La nouvelle courbe ascendante représente exclusivement la **progression de lecture**, jamais une probabilité d’accord bancaire, une performance ou l’état d’un financement. Elle reste dans la marge : tracé cuivre, grille fine, point courant et pourcentage. Sur ordinateur large, une commande native de type range permet le glisser et le clavier. Sous 1 440 px ou sur écran très bas, une version étroite et informative préserve l’espace et les gestes tactiles.

Les ouvertures du livre et de PEAK EXCHANGE occupent au minimum la hauteur visible, déduction faite du menu de 76 px et de son filet de 1 px. Le contenu est centré verticalement. Sur écran plus petit que le contenu, la section peut grandir : aucun texte ni bouton n’est coupé.

Le lien des conditions du livre est intégré à la conclusion sombre, sous les informations de l’auteur, sans bandeau clair séparé. Il conserve un soulignement et un état de focus visible, en français et en anglais.

## Intégration et repli

`ProgressionLecture.astro` et `lecture.ts` sont isolés du contrôleur historique `motion.ts`, qui reste inchangé. Aucun remplacement de la molette, du tactile, des ancres, de l’historique ou des transitions de fond. Pas de boucle d’animation autonome : une frame au plus par actualisation. Le repère suit aussi les chargements tardifs qui modifient la hauteur et se nettoie à la navigation Astro.

La barre native est masquée seulement après activation du composant par JavaScript. Elle reste disponible sans JavaScript, sans API SVG adaptée et en contraste forcé. Les zones internes qui nécessitent leur propre défilement restent utilisables. Le composant ne s’imprime pas. Aucune inertie ajoutée ni animation décorative, y compris en mouvement réduit.

## Vérifications

Build des 68 pages FR/EN et suite existante. Cinq tests supplémentaires contrôlent la position restaurée, les bornes, le pilotage du range, les libellés anglais, les contenus chargés tardivement, les pages courtes et le nettoyage lors de la navigation Astro. Ces tests simulent le DOM et ne remplacent pas une vérification sur un navigateur réel.

Hôte navigateur indisponible lors des tentatives de recette. Les réponses locales des pages sont vérifiées ; contrôle visuel ordinateur/mobile et interaction réelle du range à compléter avant publication. Aucun changement du serveur Stancer, des droits d’accès au livre ou des traitements Claude. Les ventes et la publication restent fermées selon l’instruction de Valentin.
