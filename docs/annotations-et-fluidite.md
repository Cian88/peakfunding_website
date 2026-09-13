# Annotations et fluidité — 12 septembre 2026

## Cible verrouillée avant réalisation

Amélioration de la V2 Altitude existante, d'après les six annotations utilisateur.
Mercury (fiche Refero 95fd135a-64bd-4f9d-9a02-cac6422266c8 relue) reste dominant :
héros immersif plein écran, titres légers, fonds profonds, navigation discrète.
Titan reste limité aux traits et chiffres ; aucune recoloration des images.
La V1 `blog.html` fournit le principe des cartes blanches bordées, images de hauteur
fixe 180 px. La demande actuelle de tailles identiques prime sur sa vedette plus grande.

| Décision | Source | Application |
|---|---|---|
| Accueil plein écran | Annotation 4 + Mercury | Hauteur minimale du viewport, sans plafond 850 px, contenu non rogné sur écran court |
| Deux accès explicités | Annotation 1 + navigation Mercury | Menu encadré, pictogrammes fins, descriptions, focus clavier |
| Méthode plus visuelle | Annotation 2 + direction Altitude technique | Quatre schémas de processus, sans chiffres financiers fictifs |
| Cartes identiques | Annotation 3 + V1 blog | Plus de vedette ; même hauteur d'image et même structure |
| Assurance nouvel onglet | Annotation 5 | Liens natifs target=_blank, URL partenaire et attribution conservées |
| Simulateur en deux colonnes | Annotation 6 | Réorganisation CSS du formulaire existant, source de calcul intacte |
| Transitions des fonds | Demande utilisateur + référence motion | Raccords de couleur progressifs pilotés au scroll, sans interception du défilement |

Sauvegarde : `../peakfunding-v2-backups/20260912-annotations`.
Invariants : images originales, textes réglementaires, questionnaire et simulateur
source inchangés ; aucun envoi de formulaire ni déploiement.

## Contrôles réalisés

- Build de 19 pages et 13 tests réussis, dont les cinq empreintes source protégées.
- Héros : hauteur exacte de 720 px à 1280 × 720 ; 1272 px à 1934 × 1272 ;
  844 px à 390 × 844. La section suivante est sous le pli. Sur un écran très court,
  le contenu peut agrandir le héros pour rester lisible, sans montrer la suite avant scroll.
- Menu : capture de l'état ouvert, descriptions et pictogrammes, fermeture Échap.
- Articles : sept zones de 180 px de haut et largeurs égales dans la grille ;
  contrôle à 320 px sans débordement. Les vignettes utilisent le cadrage `cover`
  des cartes V1, sans recoloration ; les images complètes restent dans les articles.
- Simulateur : deux colonnes sur ordinateur ; saisie puis résultat sur mobile.
  À 320 px, résultat et formulaire font tous deux 223 px, sans débordement.
  Le bouton de contact ouvre bien le questionnaire de rendez-vous à l'étape 1 ;
  fermeture au clavier vérifiée, sans saisie ni envoi.
  Calculs contrôlés : 425 000 € initialement ; 480 000 € avec revenus 6 000 € ;
  525 000 € en locatif ; 415 000 € avec les paramètres initiaux sur 24 ans.
- Assurance : ouverture réelle d'un nouvel onglet vers l'URL partenaire complète,
  attribution 33656 conservée, aucune fenêtre assurance injectée dans la page.
- Méthode : quatre schémas explicatifs examinés, sans taux ni montants fictifs.
- Fonds : six raccords ; avancement mesuré de 61,7 % à 75 % après scroll.
  Les dégradés évoluent dans les marges inter-sections uniquement. En `?statique`,
  la classe de mouvement et le pseudo-élément de raccord sont absents.
- Tests responsive dans une iframe locale dimensionnée, pas sur téléphone physique.
  Le fichier temporaire est retiré avant le build final. Aucune dépendance ajoutée.
- L'aperçu Astro a été relancé pour purger une erreur de module gardée en cache.
