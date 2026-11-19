# Le Relevé

## Version de référence

Le point de départ est le clone non publié des trois services, branche `codex/services-preview`, commit `2be6266`. Il contient le livre, PEAK PITCH, PEAK EXCHANGE, leurs conditions, les extraits bilingues et les parcours de préouverture. La comparaison visuelle utilise son option de film PEAK PITCH. Les 72 URL du clone restent accessibles dans la refonte.

## Direction

Une carte se lit à deux distances. De loin, on identifie le territoire et le relief. De près, on lit une cote et sa source. L’accueil emploie cette hiérarchie pour présenter le métier du cabinet puis conduire au calcul. Le titre nomme le financement et l’assurance emprunteur. Le simulateur est la première action. PEAK EXCHANGE conduit à la présentation de la consultation et de ses conditions.

Le puy de Dôme forme la matière graphique de la première feuille. Une isoligne à 1 200 mètres reçoit le signal vermillon. Le nord, la barre de 500 mètres, le crédit et la cote du sommet permettent une lecture réelle. Le profil de la rubrique méthode est un diagramme des quatre étapes du dossier. Ses points renvoient aux étapes rédigées par le cabinet. [Données, licence et reproduction du relief](relief.md)

## Références consultées

| Référence | Choix appliqué |
| --- | --- |
| [Column](https://styles.refero.design/style/a76ec6ba-20b3-495c-9d89-1e58281e79e7) | Encre institutionnelle, données à chasse fixe et séparation nette entre mesure et commentaire. Le simulateur associe la saisie à une colonne de résultat. |
| [Nofilter.space](https://styles.refero.design/style/4235ebdc-a070-46ef-abbf-692151449bea) | Les filets délimitent la planche, les entrées d’index et les métadonnées. Les changements de rubrique suivent la grille. |
| [AREA 17](https://styles.refero.design/style/143d553e-d71f-4e86-98ed-b80b9ef78ea9) | Un seul accent ponctue une composition presque monochrome. Le poids visuel vient d’abord de la taille du titre. |
| [DNCO](https://styles.refero.design/style/c072c00a-ee7f-4160-bd06-645cca12f7a8) | Échelle typographique de catalogue et espace autour des images. Les vrais portraits restent documentaires. |
| [V–A–C Foundation](https://styles.refero.design/style/f8a0de9f-438a-442f-b7d4-5e48e977be96) | L’index relie titres et destinations. Les analyses se parcourent en lignes illustrées avec filtres thématiques. |

Les recherches du catalogue portaient sur la grille suisse éditoriale, les filets, le blanc avec une couleur d’accent et les angles nets. La recherche sémantique du MCP Refero a complété les fiches du catalogue public. Les conventions cartographiques reprennent la légende, l’orientation et l’échelle des cartes topographiques. [Catalogue Refero](https://refero.design/styles) · [Cartes nationales suisses](https://www.swisstopo.admin.ch/fr/cartes-nationales)

## Système graphique

| Rôle | Valeur et usage |
| --- | --- |
| Papier | `#f7f8f4`, fond courant. Trame `#ecf0eb` pour séparer méthode, marché et services. |
| Encre | `#172b32` pour le texte, le logo et le colophon. Texte secondaire `#49595b`. |
| Signal | `#b73b1c` pour l’action principale, le point actif et le tracé. Filet courant `#c3c9c5`. |
| Typographie | Manrope variable pour le texte et les titres. IBM Plex Mono pour cotes, étapes et mesures. Les deux fichiers sont servis localement avec leurs licences. |
| Composition | Largeur de feuille plafonnée à 1 740 px, marges fluides de 18 à 80 px. Texte et carte côte à côte sur grand écran. Sur téléphone, le titre, l’action et l’immatriculation précèdent la carte. |
| Commandes | Bords droits, hauteur de commande principale de 50 px, focus de 3 px. Les détails natifs gardent les menus et les questions utilisables au clavier. |

L’accueil alterne index des expertises, profil de méthode, calculateur, données mensuelles, portraits et partenaires. Les offres précèdent les avis, analyses et questions. Les avis de l’accueil sont lus dans la vue publique lors du build et rendus en HTML. Une reconstruction actualise cette édition. L’Observatoire actualise son propre encart à partir de la copie JSON locale. Le simulateur garde ses hypothèses indépendantes.

Chaque expertise a sa propre planche vectorielle. Les offres reprennent les conditions de la préversion. Le livre conserve sa couverture et ses extraits. Les pages légales, les articles longs, les espaces privés et la 404 emploient les mêmes encre, marges et repères.

## Mouvement

| Source examinée | Mécanisme retenu |
| --- | --- |
| [Magic UI, Text Reveal](https://magicui.design/docs/components/text-reveal) | Révélation à l’entrée dans la vue. Les grands intitulés des pôles se découvrent par masque CSS. |
| [21st, Sticky Services Stack](https://21st.dev/@abushaidislam7/components/sticky-services-stack) | Une colonne de contexte reste en place pendant la lecture des lignes sur grand écran. |
| [21st, Horizontal Feature Reveal](https://21st.dev/@hyperiux/components/horizontal-feature-reveal) | Masque de ligne et retour à une composition verticale sur téléphone. |
| [21st, Scroll Autoplay](https://21st.dev/@youcefbnm/components/scroll-autoplay) | Le point actif du profil suit la position de l’étape dans la fenêtre. Les quatre textes restent consultables. |

Les métadonnées et les aperçus des trois démos 21st ont servi à comparer leurs comportements. Le code a été écrit pour Astro, avec CSS natif et IntersectionObserver. Le tracé d’isoligne dure 1,6 seconde. Le texte et la carte de fond sont visibles dès le rendu HTML. Le changement de page utilise la transition Astro. Les mouvements décoratifs suivent la préférence de réduction et le paramètre `?statique`.

Les index locaux React Bits, Aceternity, Magic UI et 21st ont guidé les choix de repli tactile et d’accès clavier. Les ressorts, le défilement horizontal forcé, l’inclinaison 3D, les boucles automatiques et les dépendances React pour les effets ont été écartés.
