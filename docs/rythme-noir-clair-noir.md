# Rythme noir / clair / noir

## Cible et décisions

La demande précise de l'utilisateur remplace la dominante sombre du lot précédent.
Référence : système Altitude existant, recherche Mercury / Dovetail documentée dans
`dominante-sombre.md`. Pas de nouveau langage graphique ni d'images : mêmes agencements,
typographies, filets animés, cuivre et photographies. Le guide couleur Refero impose
une adaptation des surfaces et des contrastes, pas seulement des fonds de section.

- Après le héros : chiffres et mission sombres.
- Centre clair : simulateur, expertises, méthode, équipe/partenaires et FAQ.
- Conclusion sombre : bandeau de prise de rendez-vous puis footer.
- Deux transitions réversibles conservées, désormais à l'entrée du simulateur et du
  bandeau final. Cartes de méthode, schémas et formulaire du simulateur adaptés au clair
  par CSS, sans toucher aux calculs ni au composant source protégé.
- Variantes fixes lisibles en mode statique et mouvement réduit.

## Vérifications

- Compilation des 19 pages et 17 tests réussis, dont la séquence exacte des neuf
  sections de l'accueil et du footer, la conservation des sources protégées et des intégrations.
- Contrôle navigateur desktop 1280 × 720 : simulateur blanc avec champs clairs,
  méthode et schémas clairs, canevas central rgb(242,240,235), conclusion et footer
  rgb(11,13,18). Deux transitions conservées dans le moteur de scroll inchangé.
- Contrôle mobile 390 × 844 via cadre temporaire : simulateur empilé, aucun débordement,
  montant initial 425 000 €. Méthode et FAQ également contrôlées en mode statique.
- Petits textes cuivre des surfaces claires renforcés : contraste minimal vérifié
  de 5,52:1 sur le résultat du simulateur. Les actions cuivre/blanc gardent 4,60:1.
- Cadre de contrôle retiré. Aucun envoi de formulaire, réservation ou déploiement.
