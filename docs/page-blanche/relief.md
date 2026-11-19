# Feuille du puy de Dôme

La carte représente une emprise de 2 880 × 2 304 m dans la chaîne des Puys. Le nord se trouve en haut. Le repère du sommet se situe à 45,7724° N, 2,9642° E. Son altitude de référence est de 1 465 m. [Site du Département du Puy-de-Dôme](https://volcan.puy-de-dome.fr/puy-de-dome/histoire.html)

**Crédit cartographique** — Source IGN, RGE ALTI®, Licence Ouverte 2.0. Fiche du jeu mise à jour le 1er octobre 2026. Extraction du 19 novembre 2026. Les courbes et la mise en page sont une réalisation dérivée de PEAK FUNDING. [Fiche et licence du jeu de données](https://www.data.gouv.fr/datasets/rge-alti-r)

Le script échantillonne 6 643 altitudes sur une grille régulière de 32 m. Il interpole les courbes tous les 15 m, épaissit les courbes maîtresses tous les 75 m et simplifie les lignes pour l'affichage. La barre graphique vaut 500 m à toutes les tailles. L'échelle numérique dépend du support. La cote du sommet provient du Département. La grille échantillonnée décrit le relief voisin, avec une précision limitée par son pas.

## Reproduction

Depuis la racine du dépôt, exécuter `python3 scripts/relief/terrain.py`. La bibliothèque standard Python suffit. La commande lit le cache versionné et écrit `public/cartographie/relief.svg`. Le build Astro et le navigateur servent le SVG local.

L'option explicite `--fetch` renouvelle le cache auprès de la Géoplateforme en 73 requêtes successives de 91 points, espacées d'au moins 300 ms. Le script contrôle chaque ligne et remplace le cache à la fin de l'extraction. [Géoservice altimétrique IGN](https://geoservices.ign.fr/services-geoplateforme-altimetrie)
