# Accueil — continuité sombre

## Direction verrouillée avant réalisation

- Demande : réduire l'alternance des fonds, dominante sombre et transitions au scroll.
- Référence principale : Mercury, https://mercury.com/, consulté le 12 septembre 2026 ; fiche Refero Mercury `95fd135a-64bd-4f9d-9a02-cac6422266c8` (version archivée sombre, distincte de la page live). Retenir la continuité du canevas, les listes fonctionnelles séparées par un filet, les grands espacements et les titres légers. Ne pas copier son contenu ou sa couleur bleue.
- Garder Altitude / Dovetail pour le vocabulaire financier, les données monospace et le cuivre de PEAK FUNDING. Abandonner l'alternance systématique précédemment empruntée à Capital.
- Un seul chapitre clair : équipe et partenaires. Mission et expertises rejoignent le fond sombre ; deux transitions de tonalité au lieu de six.
- Mission : composition asymétrique photo / principes ; expertises : lignes illustrées ouvertes, pas de cartes blanches ; méthode : progression épinglée conservée.
- Mouvement : révélations modestes et filets d'entrée, sans scroll forcé ni boucle ; le fond reste réellement calculé selon le scroll et réversible. Sans animation : tout visible, fonds fixes accessibles.
- Intangibles : photos originales, textes, simulateur, questionnaire, Formspree, calendriers, Actelo et pages légales.

## Vérifications

- Build : 19 pages ; 17 tests réussis, dont conservation octet pour octet des cinq sources protégées, des images V1 et contrôle des intégrations.
- Navigateur : contrôle visuel à 1280 × 720, 1934 × 1272, 390 × 844 et 320 × 700 (ces trois dernières tailles dans un cadre local temporaire supprimé après contrôle). Aucun débordement horizontal sur les tailles contrôlées. Sur grand écran, environ 86 % de la hauteur du contenu principal appartient aux sections sombres.
- Transition vers l'équipe vérifiée par scroll réel : à y=7473 fond rgb(231,229,225), en remontant à y=7233 rgb(50,51,55), puis retour exact à la première couleur en redescendant. Mission, simulateur et expertises restent sur rgb(11,13,18).
- Mode `?statique` vérifié à 320 px : tous les contenus visibles, aucune classe de révélation en attente. Les animations des filets sont limitées à `prefers-reduced-motion: no-preference`.
- Résultat initial du simulateur toujours 425 000 €. Aucun envoi de formulaire, aucune réservation, aucun déploiement.
- Le serveur Astro local a été relancé : son cache servait encore l'ancienne feuille de style scoped malgré le HTML actualisé.
