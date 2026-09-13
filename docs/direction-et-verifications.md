# Améliorations du 12 septembre 2026

## Cible de réalisation

Améliorer la v2 Altitude existante, pour des emprunteurs particuliers, investisseurs
et dirigeants. Objectif : comprendre le rôle du cabinet, identifier son expertise,
simuler puis préparer un rendez-vous. L'autorisation « carte blanche » permet de
réaliser directement ce lot. Aucune publication distante prévue.

Référence principale : Mercury, fiche Refero
`95fd135a-64bd-4f9d-9a02-cac6422266c8` (https://mercury.com).
Conserver la photo immersive, les titres légers, les surfaces ardoise, les boutons
pilules et le passage de l'atmosphère à une information précise.
Référence secondaire : Titan, fiche `56105743-b6f0-49df-8788-1578972a2e1d` :
uniquement Geist Mono pour les chiffres et la discipline des filets.
Écran documentaire Mercury `61aa2b21-deb8-44ba-8af1-38b9b3833a3e` : sommaire
latéral et colonne de lecture pour les contenus longs.

| Choix | Source | Application |
|---|---|---|
| Héros immersif | Mercury + photos existantes | Photo de sommet, voile pour lire les deux actions, titre court |
| Navigation | Parcours PEAK FUNDING | Expertises, méthode, simulateur, équipe, actualités ; accès direct aux quatre pôles |
| Données | Titan | Chiffres tabulaires, séparation fine, aucune fausse courbe financière |
| Cuivre | Identité PEAK FUNDING | Accent de marque ; texte sombre sur cuivre clair ou blanc sur cuivre profond |
| Méthode | Demande d'animation + référence motion du skill | Indicateur d'étape lié au défilement, accès clavier, aucune interception du scroll |
| Contenus longs | Écran Refero Mercury Terms | Sommaire généré à partir des titres, texte source intact |
| Responsive | Craft du skill | Cibles tactiles, menu fermé après navigation, méthode non épinglée sur mobile |

Images : réutiliser les WebP et portraits déjà fournis. Les images d'ambiance ne
seront pas présentées comme une preuve de locaux ou de clients réels.
Ne pas ajouter de nouvelles dépendances pour les animations.

## Invariants

- `_source` intact.
- Les trois fichiers `src/contenu-legal/*.html` restent identiques octet pour octet.
- `PriseRendezVous.tsx` et `SimulateurCapacite.tsx` restent identiques octet pour octet.
- Les changements de modal concernent seulement son enveloppe et son focus.
- Aucun envoi réel à Formspree et aucune réservation pendant les tests.
- Sauvegarde avant changement : `../peakfunding-v2-backups/20260912-185605`.

## Vérification attendue

Build statique, liens et ancres internes, invariants SHA-256, tri chronologique et
filtres, calculs du simulateur dans le navigateur, questionnaire jusqu'à l'étape 2
sans envoi, fermeture clavier de la modal, navigation interne, lecture sur mobile
390 px et capture de l'accueil. Contenus toujours lisibles sans animation.

## Résultats du lot

- Build Astro : **19 pages**, réussi.
- `npm test` : **6 tests réussis**. Contrôle SHA-256 des cinq fichiers protégés,
  égalité des textes légaux et des sept articles rendus, tri, thèmes, sommaires,
  liens internes, images, ancres et unicité des titres principaux/identifiants.
- Un lien v1 `article-capacite-locatif.html` était cassé dans l'article « Enchaîner » :
  réécriture de son URL dans la copie rendue seulement.
- Navigateur : aperçu de l'accueil et de la fenêtre de rendez-vous sur ordinateur ;
  passage de l'étape 1 à l'étape 2 avec des coordonnées fictives ; fermeture Échap.
  Aucun envoi Formspree, mailto ou réservation n'a été déclenché.
- Simulateur : résultat initial 425 000 € ; revenus portés à 6 000 € → 480 000 € ;
  mode locatif avec 900 € de loyers → 525 000 €. Mécanique source inchangée.
- Filtres « Taux & marché » et « Résidence principale » : seul l'article attendu
  reste visible. Navigation mobile au clavier vers les analyses et fermeture du menu.
- Contrôle responsive dans une iframe locale de 390 puis 320 px (et non sur un
  téléphone physique) : captures de l'accueil et du formulaire, mesures sans
  débordement horizontal sur l'accueil, les analyses et le formulaire.
  Le contrôle natif de taille du navigateur n'ayant pas répondu, l'iframe a servi
  de surface de vérification ; son fichier temporaire a été retiré.
- Aucune nouvelle dépendance, aucun changement de backend, aucune publication.

## À connaître avant publication

Mise à jour du lot suivant : l'intégration Actelo exacte a été retrouvée dans la V1
et rétablie. Le diagnostic initial d'URL manquante est donc résolu. Voir
`retour-v1-et-homogeneite.md` pour les intégrations, les nouveaux tests et leurs limites.
Les éventuelles mentions à compléter dans les textes réglementaires ont été
conservées volontairement, conformément à la demande de reprise exacte.
`astro check` n'a pas été exécuté : son module dédié n'est pas installé. Le build
et les tests de régression ci-dessus ont été exécutés sans ajouter de dépendance.
