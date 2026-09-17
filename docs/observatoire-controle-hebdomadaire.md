# Observatoire — contrôle du 17 septembre 2026

## Correction locale

Le widget utilisait `checkedAt: null` dans le JSON statique et affichait à tort
« Source vérifiée le » sans date. Il distingue désormais :

- un contrôle automatique réussi et daté ;
- une copie de secours, datée grâce à `verifiedOn` ;
- une date inconnue, signalée explicitement ;
- un contrôle vieux de sept jours ou plus, signalé « actualisation en attente ».

La date du jour n'est jamais substituée à la date réelle de contrôle.
Correction vérifiée dans Edge après hydratation et chargement du JSON.

## Constat initial, avant confirmation de l'hébergement

Aucun contrôle hebdomadaire automatique de l'Observatoire n'est actuellement
configuré dans le dépôt. Le workflow `deploy.yml` reconstruit quotidiennement
le site sur GitHub Pages mais ne récupère pas les données de l'Observatoire.
Le widget recharge un JSON fixe ; le relais PHP existant n'est pas appelé.

L'hébergement cible reste à confirmer : Hostinger avait été annoncé, mais le
déploiement actuel du dépôt utilise GitHub Pages. Ne pas remplacer ce workflow
ni activer un relais PHP sans clarifier la cible.

- Hostinger PHP : brancher le relais puis planifier son contrôle hebdomadaire
  dans hPanel, même sans visite. Tester aussi le cache partagé entre PHP web et CLI.
- GitHub Pages : récupération côté automatisation, validation et publication du
  JSON avec persistance de la dernière copie valide entre les déploiements.

Aucune tâche distante activée, aucun changement publié. Le contrôle hebdomadaire
ne doit pas être annoncé comme opérationnel avant configuration et premier test.

Documentation Hostinger :
https://www.hostinger.com/support/1583465-how-to-set-up-a-cron-job-at-hostinger/

## Configuration retenue — GitHub Pages

Le propriétaire a confirmé GitHub et autorisé explicitement les mises à jour
automatiques des deux JSON sur main, suivies de la publication du site.

- Workflow `deploy.yml` : contrôle forcé chaque lundi à **06:17 UTC**
  (`17 6 * * 1`), soit 08:17 en été / 07:17 en hiver à Paris.
- Déclenchement manuel : contrôle forcé également.
- La reconstruction quotidienne à 06:00 UTC est conservée pour les avis.
  Elle relance la récupération si le dernier contrôle est absent ou date
  d'au moins sept jours. Un échec CSA n'empêche pas cette reconstruction.
- Source officielle fixe, HTTPS, redirections refusées, délai 15 secondes,
  réponse limitée à 2 Mo et validation de période, taux, durée et lien.
- En cas d'échec ou de régression du mois : aucune copie remplacée,
  aucun commit de données, job en erreur visible dans Actions.
- En cas de succès : date `checkedAt` réelle même si le mois n'a pas changé ;
  `observatoire.json` et `observatoire-seed.json` enregistrés ensemble.
- Le job Observatoire possède `contents: write` sur le dépôt ; son code
  indexe seulement ces deux fichiers. Aucun secret supplémentaire ni PAT.
- Pas de force-push ni de modification des protections de branche.
  Le build suivant lit main après ce job, car un push du GITHUB_TOKEN ne
  déclenche pas automatiquement un deuxième workflow.
- Les calculs du simulateur et les composants d'avis ne sont pas modifiés.

Les horaires GitHub peuvent subir un retard ; en cas d'inactivité prolongée,
GitHub peut désactiver les tâches planifiées d'un dépôt public. Contrôler les
échecs dans Actions et vérifier que le workflow reste actif.

Référence : https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule

Commande de diagnostic sans écriture :
`node scripts/actualiser-observatoire.mjs --force --dry-run`

La validation du premier passage distant est consignée après son exécution.
