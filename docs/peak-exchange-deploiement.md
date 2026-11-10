# PEAK EXCHANGE — lot de déploiement en attente

État au 10 novembre 2026 : **préparation locale, aucune publication et aucun paiement réel activé**. Attendre que Valentin confirme explicitement que Stancer est opérationnel avant tout push sur `main`, déclenchement de workflow ou activation des paiements.

## Parcours préparé

- Tous les accès à l’ancien formulaire, y compris simulateur, expertises, articles, avis, équipe, navigation et pages 404 FR/EN, rejoignent `/peak-exchange/` ou `/en/peak-exchange/`.
- Les favoris `#rdv` et l’ancien événement `ouvrir-rdv` sont redirigés ; le formulaire et les agendas gratuits ne sont plus chargés dans le bundle du site.
- PEAK EXCHANGE : 299 € TTC, échange d’analyse et d’argumentation bancaire, puis note de conseil personnalisée. Service autonome.
- Conditions commerciales : si le client confie son financement au cabinet et que le cabinet accepte de l’accompagner, sous réserve que le dossier soit défendable, les 299 € TTC réglés sont déduits des honoraires de courtage. Cette disposition figure sur l’offre, l’accueil, les conditions préparatoires, le paiement et la confirmation de commande.
- La déduction sera portée sur le décompte d’honoraires du cabinet ; aucune réduction automatique ni facture de courtage n’est créée par le site. Les factures restent établies depuis Qonto.
- Coordonnées administratives protégées à l’affichage ; adresse retirée du footer, JSON-LD, repli du formulaire et `llms.txt`. Le contact légal reste accessible sur la page Contact. Les personnes qui connaissent déjà l’adresse peuvent toujours écrire.
- Les comparateurs d’assurance externes et les espaces Actelo conservent leurs destinations. Le code de mouvement global et le composant animé des avis sont conservés.

## Sources et paramètres

Site : worktree `C:/Users/valen/dev/peakfunding-exchange`, branche `codex/peak-exchange-299`, issue de `origin/main` ; la branche `peak-pitch` n’est pas fusionnée.

Serveur : dépôt `C:/Users/valen/dev/peak-dossier`, routes `/api/exchange/`, pages `exchange-paiement.html` et `exchange-retour.html`. Aucune dépendance à un dossier PEAK PITCH ou à une génération Claude.

- `PUBLIC_PEAK_EXCHANGE_URL` : URL publique HTTPS du serveur. La compilation GitHub Pages lit la variable GitHub du même nom. Vide = page de présentation avec réservations annoncées prochainement, sans lien mort vers le serveur.
- `PEAK_EXCHANGE_ENABLED=false` tant que la confirmation de Valentin et la recette de production ne sont pas acquises.
- `PEAK_EXCHANGE_TERMS_URL` : conditions de vente dédiées définitives, publiées en HTTPS.
- `PEAK_EXCHANGE_BOOKING_URL` : agenda privé dans la configuration du serveur uniquement, jamais dans le frontend, Git ou Obsidian.
- Clé Stancer de production et configuration existante : côté serveur uniquement. Ne pas copier la clé de test dans Git, ni l’utiliser comme preuve d’ouverture réelle.

## Contrôles avant ouverture

1. Recevoir la confirmation explicite de Valentin que Stancer est opérationnel, puis vérifier la configuration de production.
2. Finaliser les conditions de vente encore en projet : durée de l’échange, délai de remise de la note, reports/annulations et médiation des consommateurs. Ne pas ouvrir la vente avec ces paramètres indéterminés.
3. Vérifier le serveur hébergé : l’ancienne erreur 500 du Worker doit être résolue ou le serveur doit être disponible ailleurs. La seule validation du compte Stancer ne suffit pas à rendre un serveur indisponible opérationnel.
4. Refaire `npm run build` et `npm test` sur les deux dépôts. Le test d’empreinte des visuels V1 exige une archive locale non versionnée ; s’il est omis pour absence de l’archive, ce résultat doit être déclaré. Les URL d’assurance/Actelo, les pages et les images restent contrôlées sans cette archive.
5. Recette visuelle ordinateur/mobile : boutons, langue, ancien `#rdv`, menu, fondus, avis, prix et déduction. La précédente vérification d’Edge a été interrompue par Computer Use : ne pas la déclarer complète.
6. Recette Stancer autorisée : une commande 299 €, confirmation par API serveur, absence d’agenda avant paiement, accès après confirmation, reprise sans double débit. Les tests automatisés utilisent un prestataire factice ; aucun paiement réel n’a été effectué.
7. Commiter les changements des deux dépôts avant publication. Vérifier ce qui entre dans `main`, préserver les changements parallèles et ne pas embarquer le lancement PEAK PITCH par accident.
8. Après publication autorisée : vérifier les pages publiques et leur contenu, les anciennes destinations RDV, la disponibilité du serveur, l’absence d’e-mail du cabinet en clair dans HTML/JS/JSON-LD/llms et de lien privé d’agenda. Conserver un statut Git propre et renseigner les commits publiés dans Obsidian.

## Validation automatique

Les tests vérifient la redirection des anciennes entrées, l’absence du formulaire et des agendas publics, la présence des conditions de déduction et la préservation des calculs, avis et animations. Les tests serveur vérifient également le montant fixé côté serveur, la commande autonome, les doubles clics, les réponses perdues, la confirmation durable et les accès remboursés.

Résultats du lot au 10 novembre : compilation de 64 pages ; 58 tests du site réussis, zéro échec, un test de comparaison de visuels V1 omis faute d’archive ; 122 tests du module réussis, zéro échec. Les contrats d’URL Magnolia et Actelo sont contrôlés même sans l’archive. Les empreintes des calculs et du mur d’avis sont conservées, et le contrôleur global `motion.ts` n’a pas été modifié.

Ces résultats ne remplacent pas la recette visuelle et le contrôle du serveur hébergé avant ouverture. La validation de Stancer n’a pas été constatée dans ce lot.
