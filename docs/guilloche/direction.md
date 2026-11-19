# Guilloché — accueil PEAK FUNDING

## Direction

L’ouverture associe une gravure circulaire à une photographie du salon haussmannien. Le mot *financement* et l’expression *assurance emprunteur* occupent la colonne de lecture. Le bouton doré mène au simulateur. Le lien PEAK EXCHANGE ouvre la présentation de la consultation.

Le salon et sa localisation identifient le cabinet. Les numéros romains rythment les chapitres. Les quatre pôles forment une galerie sur vélin. La méthode déroule quatre étapes en léger décalage. Le simulateur se lit comme un registre ouvert, avec la saisie à gauche et le résultat sur fond vert. Sur téléphone, ces deux colonnes se suivent. L’Observatoire possède sa propre date de publication, sa source et ses unités.

## Références

- L’usage d’une didone à grande échelle et des filets fins provient de l’étude des compositions financières de Slash et Origin. Le vert, le cartouche et le motif sont propres à cet accueil. [Slash](https://styles.refero.design/style/7c38e84b-aea0-4c8f-b3e9-60b994ee6c6b) · [Origin](https://styles.refero.design/style/c60f05ff-2420-4a24-92db-80c4b6a74683)
- Les recherches du catalogue ont porté sur les maisons de luxe et le rapport d’échelle entre titres et légendes. [Luxury brand](https://refero.design/styles/search?query=Luxury%20brand) · [Huge serif headlines](https://refero.design/styles/search?query=Huge%20serif%20headlines)
- Le rôle des textures dans la délimitation des zones d’un cadran a guidé les deux couronnes autour de la photographie. [Le guillochage selon Breguet](https://www.breguet.com/fr/le-guillochage-selon-breguet)
- Les salons des associés et les photographies d’architecture ont inspiré le choix d’un intérieur pour représenter le cabinet. [Histoire de Pictet](https://www.pictet.com/mc/fr/a-propos/histoire-de-pictet)

## Matières et caractères

Le vert profond est composé de deux tons, #102c25 et #0b211b. Le vélin utilise #f4efe3. L’or mat #d6c395 sert aux traits, à l’italique et à l’action principale. Sur vélin, les légendes emploient une encre plus sombre, #685631.

Bodoni Moda en romain et en italique est livré en WOFF2 avec sa licence OFL. Manrope porte les textes, les unités et les commandes. Les ligatures sont désactivées sur les noms. Le nom officiel Boura--Defranoux conserve ses deux traits. Le salon, la table de travail et les quatre ambiances mesurent 1 600 × 1 000 pixels. Le cadrage utilise object-fit. Le panorama peut être agrandi sur un écran plus large que la photographie.

## Gravure et mouvement

Le script scripts/generer-guilloche.mjs construit deux courbes polaires périodiques à douze et dix-huit lobes. Les copies tournées autour d’un même centre forment des enveloppes et des interférences. Le SVG réutilise les tracés par référence. La rosace reste disponible dès la lecture du HTML.

À l’entrée, le médaillon s’ouvre, deux cercles se tracent et le titre se compose ligne par ligne. Le défilement fait légèrement pivoter la gravure devant sa contre-épreuve. Le masque de la photographie de travail s’élargit jusqu’aux bords de la fenêtre. Ces effets utilisent les animations CSS natives. Les liens d’ancre et les sections restent dans le flux du document. Le mode de mouvement réduit et la requête ?statique donnent accès à la composition fixe.

## Recherche MCP

- Magic UI a fourni la référence *Line Shadow Text* pour étudier le mouvement de lignes superposées. La contre-épreuve du médaillon reprend ce principe sur la gravure.
- Les métadonnées 21st de *Reveal Image Mask* (10905), *Scroll media expansion hero* (1932) et *Mask Reveal* (39591) ont servi à comparer ouverture, agrandissement et déclenchement. Le masque CSS est écrit dans la feuille locale.
- Les fiches du coffre consacrées au motion, aux illustrations SVG, au pointeur, à l’architecture de page et aux compétences MCP ont guidé la lecture sans animation et les contrôles au clavier.

## Données

Les avis publiés sont lus à la construction et rendus en HTML, dans la langue de leur auteur. L’Observatoire présente la copie mensuelle du dépôt. Une nouvelle construction publie les nouvelles données. Les photographies, fontes et scripts sont servis par le site. Le simulateur conserve son calcul et ses hypothèses.

## Recette

La construction Astro produit 72 pages. Les six avis présents lors de la recette sont rendus dans les deux langues du site avec leur texte d’origine. Les liens de l’accueil pointent vers des pages construites ou des ancres. Le simulateur passe de 405 000 € à 555 000 € dans le scénario contrôlé, lorsque le revenu mensuel passe de 5 200 € à 7 400 €.

Le JavaScript de page, chargeur d’îlot Astro compris, représente 2 413 octets gzip avant le chargement du simulateur. La limite demandée est de 40 Ko. L’audit automatique axe sur les règles WCAG A/AA en FR et EN aux largeurs 390, 844 et 1 440 px ne relève aucune violation. L’ancre du simulateur arrive à moins d’un pixel du haut de la fenêtre. La touche Fin atteint le bas du pied de page en FR et EN.

### Suite du dépôt

Sur 71 tests, 64 réussissent. Le test « Sept visuels V1 exacts, utilisés dans la liste ET dans chaque article » est ignoré par la suite car son archive locale est absente. Les six échecs concernent les attentes de l’ancien accueil. Les fichiers de test restent ceux du dépôt.

| Test et emplacement | Première divergence avec Guilloché |
| --- | --- |
| Accueil FR/EN · repères sans statistiques ni compteurs — accueil-promesse.test.mjs, ligne 6 | Les quatre repères se trouvent dans la clôture et utilisent des articles. Le test cherche quatre éléments de liste immédiatement après le héros. |
| Accueil FR/EN · spécialités explicites, signature et actions conservées — accueil-promesse.test.mjs, ligne 24 | Le test cherche le titre historique dans .heros. Le nouveau titre nomme les deux activités et le bouton principal ouvre le simulateur. |
| Annotations · cartes uniformes, méthode illustrée, héros et simulateur responsive — integrations.test.mjs, ligne 53 | Le test exige quatre schémas SVG dans la méthode. Les quatre étapes utilisent une composition typographique. |
| Homogénéité · une image de travail dans Mission, zones partenaires et voile mobile — integrations.test.mjs, ligne 95 | La photo de travail s’ouvre en panorama après la section Mission. Le test la cherche dans cette section. |
| Accueil · ouverture et fin sombres, méthode sombre entre les sections claires — integrations.test.mjs, ligne 105 | Le test impose l’ancien ordre des fonds et des sections. |
| CSA · valeurs exactes sans JavaScript, copie accessible indépendante du comptage — integrations.test.mjs, ligne 125 | Le test cherche les deux mesures dans le formulaire du simulateur. Elles figurent en HTML dans la section Observatoire avec leur période et leur source. |

La revue Chromium couvre 30 parcours à la molette, en français et en anglais. Les formats sont 390 × 844, 768 × 1 024, 1 440 × 900, 1 920 × 1 080 et 844 × 390. Chaque format a été parcouru avec animation, avec mouvement réduit et avec JavaScript désactivé. Les 30 parcours atteignent le pied de page sans débordement horizontal ni erreur de console. Dix captures WebP sont conservées dans captures/.
