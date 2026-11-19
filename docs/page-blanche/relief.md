# Feuille du puy de Dôme

La carte représente une emprise de 2 880 × 2 304 m dans la chaîne des Puys. Le nord se trouve en haut. Le repère du sommet se situe à 45,7724° N, 2,9642° E. Son altitude de référence est de 1 465 m. [Site du Département du Puy-de-Dôme](https://volcan.puy-de-dome.fr/puy-de-dome/histoire.html)

**Crédit cartographique** — Source IGN, RGE ALTI®, Licence Ouverte 2.0. Fiche du jeu mise à jour le 1er octobre 2026. Extraction du 19 novembre 2026. Les courbes et la mise en page sont une réalisation dérivée de PEAK FUNDING. [Fiche et licence du jeu de données](https://www.data.gouv.fr/datasets/rge-alti-r)

Le script échantillonne 6 643 altitudes sur une grille régulière de 32 m. Il interpole les courbes tous les 15 m, épaissit les courbes maîtresses tous les 75 m et simplifie les lignes pour l'affichage. La barre graphique vaut 500 m à toutes les tailles. L'échelle numérique dépend du support. La cote du sommet provient du Département. La grille échantillonnée décrit le relief voisin, avec une précision limitée par son pas.

## Reproduction

Depuis la racine du dépôt, exécuter `python3 scripts/relief/terrain.py`. La bibliothèque standard Python suffit. La commande lit le cache versionné et écrit `public/cartographie/relief.svg`. Le build Astro et le navigateur servent le SVG local.

L'option explicite `--fetch` renouvelle le cache auprès de la Géoplateforme en 73 requêtes successives de 91 points, espacées d'au moins 300 ms. Le script contrôle chaque ligne et remplace le cache à la fin de l'extraction. [Géoservice altimétrique IGN](https://geoservices.ign.fr/services-geoplateforme-altimetrie)

## Coupe de la méthode

La figure de méthode suit le parallèle de latitude 45,7724° N, du bord ouest de la feuille au repère du sommet. Le composant utilise à la compilation les 49 premières mesures de la ligne 38 (index à partir de zéro). La distance est la projection horizontale, mesurée d'ouest en est. Le graphique emploie deux échelles indépendantes pour la distance et l'altitude.

| Repère | Distance | Altitude échantillonnée |
| --- | ---: | ---: |
| 01 | 0 m | 979,61 m |
| 02 | 512 m | 1 051,38 m |
| 03 | 1 024 m | 1 293,99 m |
| 04 | 1 536 m | 1 462,64 m |

La coupe prend ses valeurs dans le même cache que les isolignes. La ligne sombre, les quatre repères et leurs cotes restent visibles dans le HTML statique. Au défilement, une ligne vermillon suit le profil entre les étapes du dossier. Le mouvement réduit ou le paramètre `?statique` présente le tracé en entier.

Le groupe SVG `#courbes-terrain` fournit des extraits de la même carte aux pages expertise. Le trajet `#courbe-repere` du héros interrompt ses segments à l'entrée des cartouches. Les cotes et le nom du sommet s'impriment sur le papier opaque de la carte.

L’aperçu social 1 200 × 630 px reprend la carte, le cartouche du sommet, les coordonnées et le crédit. La commande `node scripts/relief/partage.mjs` le régénère après la carte.
