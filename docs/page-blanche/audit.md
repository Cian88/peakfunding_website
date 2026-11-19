# Recette du Relevé · 19 novembre 2026

## Comparaison de l’accueil

À 390 × 844, le clone d’origine présente deux fois PEAK PITCH et son prix avant le lien « Estimer mon budget ». Le Relevé place « Estimer ma capacité » sous la description du courtage. Le nom des clients concernés, l’assurance emprunteur et les repères ORIAS et ACPR se lisent dans le même écran. Sur ordinateur, la carte du puy de Dôme laisse une colonne entière à la lecture et à l’action. En paysage de faible hauteur, le bouton « Simulateur » reste accessible dans la navigation. [Comparaison mobile](captures/comparaison-390.webp) · [Comparaison bureau](captures/comparaison-1440.webp)

La comparaison reprend le commit `2be6266` du clone des services dans une copie locale isolée. `PUBLIC_PEAK_PITCH_HERO=true` sélectionne le film historique. L’image de référence montre son affiche en mouvement réduit, avec `?statique`. Les ventes sont restées fermées.

## Couverture

| Contrôle | Couverture | Résultat |
| --- | --- | --- |
| Chromium, premiers écrans | 14 familles × 2 langues × 7 formats × 4 modes | 784 rendus. Titre et pied présents. Aucun débordement horizontal, aucune image visible en échec, aucune exception JavaScript ou violation CSP remontée. |
| Chromium, ensemble des routes | 72 documents statiques × 3 formats en mouvement réduit | 216 rendus à 390, 768 et 1 440 px, tous affichés avec leur titre, sans débordement ni image en échec. |
| Firefox 159 | 14 familles × 2 langues × 2 formats, 390 et 1 440 px | 56 réponses locales en HTTPS. Police calculée Manrope, aucun débordement. |
| WebKit 27.2 | Mêmes 56 cas | Police calculée Manrope, aucun débordement. L’interception de Playwright fournit les octets du build à la même origine HTTPS. Le moteur local ne prend pas en charge le transport TLS. |
| axe-core 4.14 | 14 familles × 2 langues × 2 formats, 390 et 1 440 px | 56 audits des règles automatisables WCAG A/AA. Aucune violation détectée. |

Les formats de la matrice sont 320 × 568, 390 × 844, 768 × 1 024, 1 024 × 768, 1 440 × 900, 1 920 × 1 080 et 844 × 390. Chaque combinaison a été affichée en mode standard, en mouvement réduit, sans JavaScript et avec `?statique`.

Les familles contrôlées comprennent l’accueil, PEAK ESTATE, la liste d’analyses, l’article sur la capacité en investissement locatif, PITCH, EXCHANGE, le livre, le contact, les espaces client et mandataire, le dépôt et l’invitation d’avis, les mentions légales et la 404. La seconde série couvre aussi les autres expertises, articles et documents juridiques. Le contrôle 404 porte sur le document fourni dans le build.

Les planches par famille et par route ont servi à la relecture. La revue détaillée a porté sur l’accueil, les actions, les sections au défilement et les anomalies. Les tests ont été rejoués après correction du contraste des boutons d’extrait, de la largeur des lignes d’analyses à 844 px, du double affichage du repère ORIAS et de l’accès direct à Actelo. [Expertise mobile](captures/expertise-fr-mobile.webp) · [Analyses sur tablette](captures/analyses-en-tablette.webp) · [Simulateur sur ordinateur](captures/simulateur-fr-bureau.webp)

## Lecture au défilement

Sur l’accueil français, la molette a parcouru 13 917 px en 21 vues à 390 px et 12 854 px en 18 vues à 1 440 px. Les titres et les citations étaient visibles à leur passage dans la fenêtre. Après retour en haut et stabilisation, Chromium a pris une capture pleine page native par format à densité 1. Les deux captures ont été relues de haut en bas. Deux images supplémentaires montrent les panneaux ESTATE et PIM pendant leur épinglage. [Accueil complet mobile](captures/accueil-complet-390.webp) · [Accueil complet bureau](captures/accueil-complet-1440.webp) · [Scène ESTATE](captures/scene-estate.webp) · [Scène PIM](captures/scene-pim.webp)

Les 40 essais de liens vers les quatre zones ont placé leur cible sous le bandeau. Les 40 essais au clavier des liens du profil ont atteint les stations de méthode correspondantes. Au défilement, les stations 01 à 04 se sont activées dans l’ordre de passage, dans les deux sens. La trace reste fixe en mouvement réduit et avec `?statique`. Sans JavaScript, le profil et ses quatre stations restent lisibles.

## Parcours et clavier

- En français et en anglais, Entrée ouvre le menu mobile, Échap le ferme et le focus revient au bouton. La FAQ s’ouvre avec Entrée. Le lien principal rejoint le simulateur. La modification du revenu change le résultat estimé.
- La touche Fin atteint le pied de page et la touche Début ramène à zéro. Les ancres du simulateur et de l’équipe placent les sections à 86 px du haut pour des bandeaux de 63 et 73 px. Après saisie d’une ancre dans la barre d’adresse et visite d’une expertise, le bouton Précédent restaure exactement la position de départ, 1 137 px sur mobile et 1 467 px sur ordinateur.
- Sur ordinateur, Chromium a signalé une transition interrompue au cours d’une navigation interceptée par Playwright. Le contenu et le défilement ont été restaurés. Trois répétitions par connexion locale directe ont restauré la page sans ce message.
- Les commandes des avis font passer de 01/06 à 02/06, puis à 01/06. L’ancre du deuxième avis affiche sa citation. Les six avis sont présents sans JavaScript.
- À 320 px sans JavaScript, le menu et la FAQ s’ouvrent au clavier. Le simulateur affiche sa valeur initiale et explique comment activer le recalcul. Les formulaires privés expliquent leur dépendance à JavaScript. Le lien direct vers Actelo reste visible.

## Polices et zoom

Les tables de caractères des deux polices locales couvrent les 33 caractères vérifiés, dont les accents français, Œ, œ et €. Le zoom a été émulé à 200 % et 400 % pour les 14 familles en français et en anglais, soit 56 vérifications. La fenêtre de référence de 1 440 px dispose respectivement de 720 et 360 px CSS. Aucun titre ni document ne déborde. Le contrôle au fort grossissement a porté sur les paires serrées de lettres, notamment dans « Financement » et « Cette ». [Détail des titres à 400 %](captures/titre-400.webp)

## Poids et compilation

L’accueil charge **6 120 octets gzip de JavaScript hors simulateur**, en français comme en anglais. La mesure additionne les sept scripts intégrés comprimés individuellement. Aucun fichier JavaScript externe n’a été chargé pendant le parcours avec le simulateur isolé. Le JSON-LD est exclu. Les 14 fichiers WebP conservés occupent **2 056 706 octets**.

La compilation produit 72 pages. La suite compte 71 tests, dont 70 réussites et un comparatif historique V1 omis faute de source. Après correction du libellé SVG de la méthode au commit `64f87f5`, les quatre audits axe de l’accueil ont confirmé la disparition de la violation sur les noms accessibles des stations.

## Limites

Ces contrôles ont utilisé des fenêtres émulées et des services tiers neutralisés. Les parcours de paiement, de réservation et de connexion authentifiée n’ont pas été exercés. L’audit automatique et les essais au clavier ne constituent pas une certification WCAG. La préférence pour cette direction visuelle reste à apprécier par Valentin. Aucun test utilisateur, lecteur d’écran ou appareil physique n’a été utilisé.
