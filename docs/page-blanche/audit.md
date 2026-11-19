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

## Interactions et poids

- En français et en anglais, le clavier ouvre le menu mobile, Échap le ferme et le focus revient au bouton. La FAQ s’ouvre avec Entrée. Le lien principal rejoint le simulateur et la modification d’un revenu change le résultat estimé.
- À 320 px sans JavaScript, le menu et la FAQ s’ouvrent au clavier. Le simulateur affiche sa valeur initiale et une explication sur le recalcul. Les formulaires privés expliquent leur dépendance à JavaScript. Le lien direct vers Actelo reste visible.
- Après défilement de l’accueil complet en français et en anglais, le JavaScript hors simulateur pèse **10 384 octets gzip**. Le calcul additionne les scripts intégrés compressés individuellement (4 760 octets) et le seul fichier JavaScript chargé (5 624 octets). L’îlot du simulateur a été maintenu hors affichage pendant cette mesure pour isoler son coût. Les données JSON-LD sont exclues.
- Les comparaisons, vues ciblées et neuf fichiers WebP conservés occupent **490 044 octets** dans le dossier des captures.

## Compilation et polices

Le build produit 72 pages. La suite compte 71 tests, dont 70 réussites et un comparatif historique V1 omis faute de source. Les tables de caractères des deux polices locales contiennent les 33 caractères contrôlés, dont les lettres accentuées françaises, Œ, œ et €.

## Limites

Ces contrôles ont utilisé des fenêtres émulées et des services tiers neutralisés. Les parcours de paiement, de réservation et de connexion authentifiée n’ont pas été exercés. L’audit automatique et les essais au clavier ne constituent pas une certification WCAG. La préférence pour cette direction visuelle reste à apprécier par Valentin. Aucun test utilisateur, lecteur d’écran ou appareil physique n’a été utilisé.
