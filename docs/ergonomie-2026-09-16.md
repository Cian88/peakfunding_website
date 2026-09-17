# Ergonomie — audit Edge du 16 septembre 2026

## Cible verrouillée avant réalisation
Référence principale : V2 Altitude examinée dans Edge (grand écran et 390 × 844).
Conserver montagne, Geist, cuivre pour les actions/données, photos originales,
expertises horizontales et méthode sombre. Refero Craft : révélation progressive,
erreurs près des champs, formats de saisie adaptés, retour d'état explicite.

| Décision | Source | Rôle |
|---|---|---|
| Résumé mobile et hypothèses repliables | Résultat à plus de 2100 px du début de la section | Garder la capacité accessible |
| Budget / emprunt / apport séparés | Calcul actuel additionnant emprunt et apport | Lever l'ambiguïté sans changer les formules |
| Groupes, validation et attente d'envoi | Étape 1 acceptant « test » comme coordonnées | Fiabiliser le parcours existant |
| Expertises avant simulateur | Publics particuliers et professionnels | Orienter avant l'outil immobilier |
| Sections compactées | Expertises 1932 px, méthode 2866 px au viewport audité | Réduire le défilement sans remplacer les compositions |

## Périmètre
- Avis clients entièrement exclus, composants et CSS inchangés.
- Formules et valeurs par défaut du simulateur conservées ; seule la valeur
  « emprunt » déjà calculée est exposée pour la décomposition du résultat.
- Mêmes champs, charge utile, endpoints Formspree, mailto de secours et agendas.
  En cas d'échec, le visiteur choisit explicitement l'envoi e-mail avant l'agenda.
- Aucun envoi réel ni réservation pendant les tests.
- Aucun texte légal ni source d'article modifié ; variantes FR/EN conservées.

## Vérifications du 17 septembre 2026

- Compilation Astro réussie : 44 pages FR/EN.
- 43 tests réussis, dont validation des saisies, charge utile inchangée,
  succès/échec/délai dépassé et double clic sur un envoi simulé.
- Textes légaux, calculs financiers et composants d'avis protégés par empreintes.
- Serveur local : réponse HTTP 200 sur http://localhost:4322/.
- Aucun envoi réel à Formspree, aucune réservation et aucune publication.
- La nouvelle passe visuelle Edge reste à faire : la connexion navigateur a
  expiré à plusieurs reprises, y compris sur son contrôle de disponibilité.
  Les captures de l'audit initial ne valent pas validation du rendu modifié.
