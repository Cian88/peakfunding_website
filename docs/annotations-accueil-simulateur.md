# Ajustements des trois annotations

## Animation des indicateurs CSA — complément

- Même référence Altitude/Fey, conformément au guide Refero Motion : hiérarchie
  des chiffres, sans boucle ni changement de mise en page.
- Comptage natif au premier affichage des mesures (60 % visibles), 900 ms avec
  décélération cubique et décalage de 90 ms entre taux et durée. Une actualisation
  numérique part de la valeur courante en 320 ms, sans recommencer à zéro.
- Pas de relance lors d'une simple vérification de source ou d'un retour au scroll.
  Arrêt à la valeur exacte hors écran, onglet masqué, préférence de mouvement réduit.
- Valeurs exactes rendues côté serveur et accessibles aux lecteurs d'écran ; seuls
  les chiffres visuels sont animés. Mode `?statique` immédiat. Aucun calcul modifié.
- QA navigateur : comptage intermédiaire observé sur ordinateur et mobile 390 px,
  arrivée à 3,31 % / 252 mois, un seul départ après aller-retour au scroll desktop.
  Mode statique mobile : une seule paire de valeurs, aucune largeur débordante.
  Tests d'interpolation (bornes, ralentissement, baisse, interruption) et du HTML
  accessible ajoutés ; cadre de contrôle temporaire supprimé.

## Cible avant réalisation

Référence directe : captures et annotations utilisateur. Altitude/Mercury restent
le langage de mise en page ; la hiérarchie des données Fey est conservée et adaptée
à la surface claire existante. Guide Refero Motion : continuité et hiérarchie,
aucune boucle, mouvements modestes et préférence de réduction respectée.

- Bloc du héros agrandi à 120 % sur ordinateur : largeur de 790 à 948 px, titre de
  80 à 96 px au maximum, paragraphes, boutons et espacements multipliés par 1,2.
  Dimensions CSS réelles, pas de transform qui ferait déborder les zones cliquables.
  Mobile conserve l'échelle lisible précédente.
- Widget déplacé dans le panneau du simulateur : bandeau clair horizontal avec
  période, taux, durée et attribution. Séparateur avec le formulaire ; empilement mobile.
  Mention explicite : les indicateurs ne changent pas l'hypothèse de calcul à 3,5 %.
- Expertises : révélation individuelle de chaque pôle, photo puis texte échelonné.
  Pilotage par l'observateur d'intersection existant, sans nouvelle dépendance.
  Tout reste visible sans JS, en mode statique ou mouvement réduit ; focus clavier visible.
- Méthode sombre et fondus conservés. Pas de modification des sources protégées.

## Vérifications

- Contrôle grand écran 1934 × 1272 : bloc de 948 px, titre de 96 px, héros de
  1272 px, aucune superposition ni débordement. Widget absent du héros.
- Contrôle desktop 1280 × 720 : bandeau du marché de 97 px de haut au-dessus
  du formulaire, trois colonnes et source chargée depuis le relais local.
- Mobile 390 × 844 : widget clair et champs empilés, aucune largeur dépassée.
  Le montant initial reste 425 000 € ; composant source du simulateur intact.
- Défilement réel : quatre pôles initialement en attente hors écran, révélés
  successivement ; décalages du texte 80/140/200/260 ms, opacité finale 1.
- Mode statique mobile : aucune révélation en attente, quatre photos visibles
  sans découpe. Les règles animées sont exclues en mouvement réduit.
- Cadre temporaire supprimé avant le build final. 19 pages et 22 tests.
- Relais PHP Hostinger préparé mais non exécuté ici (pas d'interpréteur PHP local)
  ni déployé. Le relais Node local et les cas d'erreur/cache sont testés.
