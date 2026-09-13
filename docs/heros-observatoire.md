# Héros et Observatoire

> Placement initial remplacé par `annotations-accueil-simulateur.md` : le widget
> est maintenant intégré au simulateur en clair, plus dans l'image d'accueil.

## Référence verrouillée

La capture utilisateur définit le placement : texte plus haut et plus à gauche,
sommet dégagé, widget dans l'espace inférieur disponible. Altitude/Mercury restent
la base (photo, cuivre, Geist léger). Refero Fey `08ae8676-eeed-4eba-9835-856c0f25a1d4`
apporte seulement un module de données compact : surface sombre, nombres monospace,
filets et hiérarchie de lecture. Aucun graphique inventé, aucun clignotement « live ».
La méthode redevient sombre, y compris ses cartes, via le moteur de fondu existant.

## Source et actualisation

- Source officielle : https://lobservatoire.creditlogement.fr/ ; dernière publication
  consultée le 12 septembre 2026 : août 2026, taux moyen 3,31 %, durée moyenne 252 mois.
- Publication **mensuelle**, pas de cotation en temps réel. L'API WordPress publique
  renvoie un contenu vide ; extraction limitée aux deux métriques du panneau mensuel HTML.
- Relais Hostinger `public/api/observatoire.php`, PHP 8+, extensions cURL/DOM. Il sera
  copié dans `dist/api/`. Cache serveur de six heures, renouvelé à la prochaine visite
  après expiration ; contrôle navigateur toutes les heures tant que la page reste visible.
  Ce n'est pas une tâche cron : aucune activité réseau sans visite.
- En erreur, dernière donnée validée conservée, avertissement affiché, nouvelle tentative
  après dix minutes côté serveur. Copie initiale datée dans `observatoire-seed.json`.
- URL amont fixe, TLS vérifié, aucun cookie ou formulaire transmis, taille et délai bornés,
  données validées et jamais injectées comme HTML. Cache hors dossier public.
- Astro local utilise un relais Node équivalent. Aucun changement du taux de calcul
  du simulateur : le widget est informatif et totalement indépendant.

## Mise en ligne Hostinger (non effectuée)

Déployer le contenu de `dist` sur un hébergement **Web/Cloud avec PHP**, pas le Website
Builder ni un service purement statique. Vérifier PHP 8+ et les extensions cURL/DOM,
puis ouvrir `/api/observatoire.php` : réponse JSON, `stale:false`, `checkedAt` renseigné.
Ne jamais considérer le code PHP comme validé en production avant ce contrôle.
Documentation : https://www.hostinger.com/support/which-php-extensions-and-configuration-options-are-supported-at-hostinger/

## Vérifications

- Relais Node : extraction réelle de la publication août 2026 vérifiée, statut
  `stale:false`, valeurs 3,31 % et 252 mois. Cache, validation, indisponibilité
  et copie de secours couverts par les tests automatisés.
- Méthode sombre vérifiée au scroll : à y=4607 fond rgb(22,24,28), en remontant
  à y=4367 fond rgb(203,201,198), cartes de méthode toujours sombres.
- Contrôles visuels définitifs et position actuelle : voir le document d'annotations.
- PHP non exécuté localement (interpréteur absent). Vérification sur Hostinger
  toujours requise avant de considérer le relais de production comme validé.
