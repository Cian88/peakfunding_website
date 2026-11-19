# Le Relevé

## Version de référence

Le point de départ est le clone non publié des trois services, branche `codex/services-preview`, commit `2be6266`. Il contient le livre, PEAK PITCH, PEAK EXCHANGE, leurs conditions, les extraits bilingues et les parcours de préouverture. La comparaison visuelle utilise son option de film PEAK PITCH. Les 72 URL du clone restent accessibles dans la refonte.

## Direction

Une carte se lit à deux distances. De loin, on identifie le territoire et le relief. De près, on lit une cote et sa source. L’accueil emploie cette hiérarchie pour présenter le métier du cabinet puis conduire au calcul. Le titre nomme le financement et l’assurance emprunteur. Le simulateur est la première action. PEAK EXCHANGE conduit à la présentation de la consultation et de ses conditions.

Le puy de Dôme forme la matière graphique de la première feuille. Une isoligne à 1 200 mètres reçoit le signal vermillon. Le nord, la barre de 500 mètres, le crédit et la cote du sommet permettent une lecture réelle. Quatre fenêtres ouvrent ensuite la même feuille à des échelles différentes. La rubrique méthode coupe ce terrain d’ouest en est sur 1 536 mètres. Quatre repères associent les textes du cabinet aux points de lecture du profil. Les cotes et les distances décrivent exclusivement le terrain. [Données, licence et reproduction du relief](relief.md)

## Références consultées

| Référence | Choix appliqué |
| --- | --- |
| [Column](https://styles.refero.design/style/a76ec6ba-20b3-495c-9d89-1e58281e79e7) | Encre institutionnelle, données à chasse fixe et séparation nette entre mesure et commentaire. Le simulateur associe la saisie à une colonne de résultat. |
| [Nofilter.space](https://styles.refero.design/style/4235ebdc-a070-46ef-abbf-692151449bea) | Les filets délimitent la planche, les entrées d’index et les métadonnées. Les changements de rubrique suivent la grille. |
| [AREA 17](https://styles.refero.design/style/143d553e-d71f-4e86-98ed-b80b9ef78ea9) | Un seul accent ponctue une composition presque monochrome. Le poids visuel vient d’abord de la taille du titre. |
| [DNCO](https://styles.refero.design/style/c072c00a-ee7f-4160-bd06-645cca12f7a8) | Échelle typographique de catalogue et espace autour des images. Les vrais portraits restent documentaires. |
| [Felt](https://styles.refero.design/style/ea1af29d-301c-4654-8da2-b224d9036f4d) | La feuille, ses annotations et la marge ont des fonctions distinctes. Le nom du sommet et les cotes disposent de réserves de papier opaques. Le tracé vermillon s’interrompt sous ces réserves. |
| [V–A–C Foundation](https://styles.refero.design/style/f8a0de9f-438a-442f-b7d4-5e48e977be96) | L’index relie titres et destinations. Les analyses se parcourent en lignes illustrées avec filtres thématiques. |

Les recherches du catalogue portaient sur la grille suisse éditoriale, les filets, le blanc avec une couleur d’accent et les angles nets. La recherche sémantique du MCP Refero a complété les fiches du catalogue public. Les conventions cartographiques reprennent la légende, l’orientation et l’échelle des cartes topographiques. [Catalogue Refero](https://refero.design/styles) · [Cartes nationales suisses](https://www.swisstopo.admin.ch/fr/cartes-nationales)

## Système graphique

| Rôle | Valeur et usage |
| --- | --- |
| Papier | `#f7f8f4`, fond courant. Trame `#ecf0eb` pour séparer méthode, marché et services. |
| Encre | `#172b32` pour le texte, le logo et le colophon. Texte secondaire `#49595b`. |
| Signal | `#b73b1c` pour l’action principale, le point actif et le tracé. Filet courant `#c3c9c5`. |
| Typographie | Manrope variable pour le texte et les titres. IBM Plex Mono pour cotes, étapes et mesures. Les deux familles sont auto-hébergées avec leurs licences. Les très grands corps ouvrent à +0,005 em, les titres intermédiaires gardent l’approche de la fonte, le texte courant ajoute 0,006 em. Les cotes disposent d’une approche plus large. |
| Composition | Largeur de feuille plafonnée à 1 740 px, marges fluides de 18 à 80 px. Texte et carte côte à côte sur grand écran. Sur téléphone, le titre, l’action et l’immatriculation précèdent la carte. |
| Commandes | Bords droits, hauteur de commande principale de 50 px, focus de 3 px. Les détails natifs gardent les menus et les questions utilisables au clavier. |

## Parcours de lecture

- **Quatre pôles.** Sur grand écran, un cartouche épinglé accompagne la traversée de chaque fenêtre cartographique. Le titre, le public concerné, le texte et le lien restent groupés. Les fenêtres alternent le côté de lecture. Une réglette et des cotes permettent de lire chaque extrait. Sur téléphone, les quatre zones se suivent dans le flux.
- **Méthode.** La coupe panoramique utilise 49 altitudes du cache IGN. Le trait sombre donne le profil complet. Le vermillon progresse au défilement. Les quatre stations, à 512 m d’intervalle, renvoient aux étapes décrites sous la figure. [Reproduction et valeurs des stations](relief.md)
- **Calcul et marché.** L’estimation regroupe les saisies et le résultat sur la même planche. L’Observatoire lit sa propre copie mensuelle des données. Le simulateur garde ses hypothèses indépendantes.
- **Équipe, partenaires et services.** Les portraits documentaires occupent trois colonnes décalées. Les marques des partenaires ont leur propre registre. Les deux prestations de conseil précèdent un tirage de la couverture du livre installé sur un extrait de carte.
- **Avis et analyses.** Une citation occupe la largeur de lecture. Les deux commandes parcourent les témoignages publiés. Chaque avis conserve son texte et sa note individuelle. Tous sont présents dans le HTML du build. Le chapitre suivant distingue un article principal illustré des autres analyses.
- **Questions et clôture.** La colonne de repères dirige vers l’expertise, le territoire, l’équipe et la consultation. Les réponses se déplient au clavier. Sur téléphone, les questions passent avant ces repères. En fin de page, la carte entière revient sur la table. L’action conduit directement à l’estimation.

Les pages expertise reprennent les quatre fenêtres du relief. Les pages d’offres reprennent les marges cartographiques et les conditions de la préversion. Le livre conserve sa couverture et ses extraits. Les pages légales, les articles longs, les espaces privés et la 404 emploient les mêmes encre, marges et repères.

## Mouvement

| Source examinée | Mécanisme retenu |
| --- | --- |
| [Magic UI, Text Reveal](https://magicui.design/docs/components/text-reveal) | Un masque de 720 ms imprime un passage de vermillon sur un double décoratif du titre. Son texte principal reste lisible en continu. |
| [21st, Sticky Services Stack](https://21st.dev/@abushaidislam7/components/sticky-services-stack) | Chaque planche possède son cartouche épinglé. La feuille passe sous le cartouche puis cède la place à la zone suivante. |
| [21st, Horizontal Feature Reveal](https://21st.dev/@hyperiux/components/horizontal-feature-reveal) | Le déplacement latéral du terrain change la fenêtre de lecture sur grand écran. Sur téléphone, les planches reviennent dans le flux vertical. |
| [21st, Scroll Autoplay](https://21st.dev/@youcefbnm/components/scroll-autoplay) | Le trait de coupe et la station active suivent la lecture dans les deux sens. Un accès direct à une étape recale le tracé. |

Les métadonnées et les aperçus des trois démos 21st ont servi à comparer leurs comportements. Le code utilise CSS, IntersectionObserver et la position des stations dans la fenêtre. Le tracé d’isoligne dure 1,6 seconde. Le texte et la carte de fond sont visibles dès le rendu HTML. Les documents passent par la navigation native du navigateur. Lorsque celui-ci accepte les transitions entre documents, le fondu sortant dure 140 ms et l’entrant 220 ms. L’en-tête garde sa position. Les ancres, la touche Fin et l’historique conservent le texte de base visible. Les mouvements décoratifs suivent la préférence de réduction et le paramètre `?statique`.

Les index locaux React Bits, Aceternity, Magic UI et 21st ont guidé les choix de repli tactile et d’accès clavier. Les ressorts, le défilement horizontal forcé, l’inclinaison 3D, les boucles automatiques et les dépendances React pour les effets ont été écartés.
