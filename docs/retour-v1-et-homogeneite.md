# Rétablissement V1 et homogénéité — 12 septembre 2026

## Sources et direction verrouillée

### Ajustement demandé après le premier lot

Dernière demande utilisateur, prioritaire : images originales à 100 % pour les
articles et les quatre pôles d'expertise. Tous les filtres cuivre, gris et les voiles
colorés de ces images sont retirés, dans la liste, les articles, l'accueil et les
pages d'expertise. Aucun fichier image n'a été modifié. Cette décision remplace
les traitements biton et contours cuivre décrits dans l'historique ci-dessous.

- Planche Claude « Altitude » : https://claude.ai/code/artifact/94aa5781-f065-450b-813f-9072e0701ccb
- DA « Direction Altitude » : https://claude.ai/code/artifact/da137a01-671a-4b34-b16d-54e57bc5470d
- Référence Refero Mercury `95fd135a-64bd-4f9d-9a02-cac6422266c8`, relue.
- V1 locale `_source/site-actuel`, jamais modifiée.

Les deux artefacts ont été lus dans le navigateur. Mercury reste dominant ; la DA
réserve à Dovetail les données et à Capital l'alternance des surfaces. Le présent
lot corrige la V2, sans reconstruire le site ni reprendre toutes les animations
proposées dans la planche. La demande actuelle de visuels d'articles remplace la
proposition ancienne de les présenter sans images.

| Décision | Source | Rôle et limite |
|---|---|---|
| Sept visuels d'articles V1 | JSON image-slots-state + demande utilisateur | Extraire les WebP originaux, pas de photos de remplacement |
| Biton cuivre | Demande utilisateur + palette Altitude | Filtre de présentation commun aux listes et aux articles, sources intactes |
| Une scène de travail pour Mission | Planche Claude, état 2 | Supprimer le triptyque et les clés de cette section |
| Logos à taille optique équivalente | Audit utilisateur + craft images | Respecter leurs proportions, réserver la même zone et aligner les textes |
| Menu mobile floutant l'arrière-plan | Demande utilisateur + craft overlays | Voile fixe, fermeture extérieure/Échap, arrière-plan non interactif |
| Client Actelo intégré | V1 espace-client.html | Même script et même conteneur ; navigation document pour isoler le widget |
| Mandataire Actelo | V1 espace-mandataire.html | Conserver le lien externe, rétablir sa visibilité dans l'en-tête |
| Assurance Simulassur/Magnolia | V1 expertise-insure.html | Même URL marque blanche et utm_source=33656, fenêtre dédiée avec lien de repli |
| Formspree | V1 index.html + PriseRendezVous.tsx | Conserver les deux endpoints, les champs et les agendas ; ne pas envoyer de test réel |

Sauvegarde avant ce lot : `../peakfunding-v2-backups/20260912-v1-integrations`.
Les cinq sources protégées du lot précédent restent soumises aux empreintes SHA-256.

## Points détectés

- P1 : espace client remplacé à tort par une demande d'accès par mail.
- P1 : CTA assurance dirigés vers le rendez-vous au lieu du simulateur partenaire.
- P2 : espace mandataire présent dans le pied de page mais absent de l'en-tête.
- P2 : trois visuels d'articles remplacés, et quatre seulement disponibles dans les articles.
- P2 : juxtaposition bureau / scène de travail / clés sans hiérarchie dans Mission.
- P2 : hauteur identique de logos aux proportions différentes, réduisant excessivement PRIVEOS.
- P2 : menu mobile sans voile de séparation du contenu.

Le taux indiqué dans une ligne de la DA (3,2 %) diffère du code V1 et du simulateur
existant (3,5 %). La mécanique V1, explicitement protégée par l'utilisateur, prime.

## Corrections et vérifications réalisées

- Les sept images V1 sont présentes sur la liste et dans chacun des articles,
  sans recadrage destructif. Les fichiers WebP sont comparés octet pour octet aux
  données V1 ; le biton cuivre est uniquement un filtre SVG/CSS partagé.
- Mission utilise une seule scène de travail. Les clés et le triptyque ont été
  retirés de cette section, sans suppression de fichiers d'origine. La photographie
  décorative de la FAQ a laissé place à une action de contact. Les photographies
  d'expertise partagent le même traitement cuivre. Les portraits restent neutres.
- Les deux logos partenaires respectent leurs proportions, dans une zone de même
  hauteur ; leurs textes et liens sont alignés. Contrôle visuel sur ordinateur effectué.
- Le menu mobile est contrôlé dans une iframe locale de 390 px : flou calculé de
  10 px, contenu et pied de page `inert`, fermeture Échap et par le voile, liens
  client/mandataire présents, navigation vers les analyses et réactivation du fond.
- Analyses : sept images présentes à 390 et 320 px, sans débordement horizontal
  (largeurs utiles respectives de 375 et 305 px, barre de défilement comprise).
  Captures du menu, de Mission, des partenaires et des illustrations examinées.
  Il s'agit d'un contrôle responsive en iframe, pas d'un téléphone physique.
  Le fichier temporaire de contrôle a été retiré avant le build final.
- Assurance : les boutons ouvrent la fenêtre dédiée ; l'URL conserve exactement
  les paramètres V1. La fermeture décharge le cadre. Le lien direct affiche bien
  le simulateur Simulassur (Projet / Situation / Coordonnées), sans saisie ni envoi.
- Actelo : le script V1 injecte bien `actelo-frame` avec l'URL
  `https://peakfunding.actelo.app/#fromRemote`. Le lien direct affiche la connexion
  PEAK FUNDING. Aucune connexion à un dossier privé n'a été tentée.
- **Limite à lever avant publication** : les cadres externes Actelo et assurance
  sont restés blancs dans le navigateur d'aperçu alors que leurs liens directs
  fonctionnent. La cause n'est pas établie par ce contrôle. Les intégrations V1
  sont rétablies, avec un lien d'ouverture directe visible pour chacune ; leur
  affichage intégré doit encore être validé dans le navigateur cible du site.
- Formspree : les deux endpoints, le POST JSON, le repli mailto et les deux agendas
  Proton sont contrôlés dans les sources et le bundle construit. Le questionnaire
  est inchangé. Aucun mail, formulaire réel ou rendez-vous n'a été envoyé/créé.
- Build statique : 19 pages. Suite : 11 tests, incluant les cinq empreintes SHA-256,
  les textes légaux et les articles rendus, les liens internes, images et intégrations.
  Aucune dépendance ajoutée ; `astro check` non exécuté, son module est absent.
- Aucun déploiement, aucune modification de `_source` ni des cinq fichiers protégés.
