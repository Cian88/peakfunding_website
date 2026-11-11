# Livre numérique — préparation du lancement

État au 11 novembre 2026. **Ne pas publier ni ouvrir les ventes sans accord de Valentin.**

## Offre et vendeur

PEAK FUNDING, SIREN 987 461 787, vend le livre ; Valentin Boura Defranoux est l’auteur. Prix affiché : **24,90 €**, paiement unique, une édition PDF française ou anglaise au choix par achat, sans abonnement. **Stancer** remplace le choix initial de Stripe.

Le traitement fiscal du livre reste à confirmer pour la facturation Qonto ; ne pas reprendre automatiquement celui des autres prestations. Le serveur conserve `vatTreatment: to_confirm`.

## Contenu préparé

Pages `/livre/` et `/en/livre/`, encart sur les deux accueils, navigation et pied de page, couvertures originales, sommaire de 26 chapitres en quatre parties, auteur, prix et extraits gratuits. Information générale, sans promesse de financement.

Les quatre PDF transmis ont été reçus et contrôlés : livre français 80 pages, anglais 78 pages, deux extraits gratuits de **8 pages**. Titres : « Financer son projet en France — Ce que les banques regardent vraiment » et « Financing Your Project in France — What lenders really look for ».

Les extraits approuvés sont dans `public/extraits/ebook-fr.pdf` et `ebook-en.pdf`. Les fichiers complets sont uniquement dans `private/ebook/`, ignorés par Git et absents du site exporté. Les couvertures WebP proviennent des premières pages des PDF originaux. Aucun PDF n’a été modifié.

Pour une mise à jour future :

```powershell
node scripts/import-ebook-assets.mjs --livre-fr 'LIVRE_FR.pdf' --livre-en 'LIVRE_EN.pdf' --extrait-fr 'EXTRAIT_FR.pdf' --extrait-en 'EXTRAIT_EN.pdf'
```

Le script contrôle les en-têtes PDF et refuse de publier comme extrait un fichier identique à un livre complet enregistré. Une revue du contenu de tout nouvel extrait reste nécessaire.

## Direction graphique — SILLAGE et Refero

Référence dominante : charte Altitude approuvée, Geist, encre `#0b0d12`, cuivre `#d9a47c`, papier `#f2f0eb`. Complément consulté : **Franco Maria Ricci — the collector’s cabinet**, Refero `2c3b31a4-6e28-47a0-afbd-cb22e22e34fb`, pour l’objet livre, les surfaces papier et les filets éditoriaux. Sa police Bodoni et ses boutons ne sont pas repris.

Sur mobile, titre, prix et actions passent avant les développements longs. Sommaire en accordéons natifs. Contrôleurs des animations, transitions de fond et avis conservés.

## Raccordement Stancer préparé

Serveur : worktree `C:/Users/valen/dev/peak-ebook-checkout`, branche `codex/ebook-stancer-2490`, document `docs/ebook-stancer.md`.

- Facturation particulier ou société avant paiement, au nom du cabinet.
- Prix immuable de 2 490 centimes EUR côté serveur, édition contrôlée et consentements conservés.
- Réutilisation de la commande et de l’intention Stancer pour les doubles clics et réponses perdues.
- Confirmation serveur ; un paramètre du navigateur ne prouve jamais un paiement. Remboursement complet ou contestation : accès révoqué.
- Téléchargement privé seulement pour la commande payée, sans URL publique du livre.
- Confirmation de commande sur support durable via le dispositif transactionnel existant ; facture séparée dans Qonto.

Variables publiques du site :

```text
PUBLIC_EBOOK_SALES_ENABLED=false
PUBLIC_EBOOK_SERVICE_URL=
```

Bouton désactivé sans activation explicite et URL HTTPS du service. La version française mène à `/ebook-paiement.html`, l’anglaise à `/ebook-payment.html`.

## Avant ouverture

1. Accord explicite de Valentin pour publier cette page, distinct de la validation Stancer.
2. Stancer opérationnel et recette du paiement, confirmation, téléchargement et remboursement.
3. Service serveur sain, fichiers complets installés dans le stockage privé de production et contrôlés. Aucun chargement de production dans ce lot.
4. Finaliser les CGV du livre et leur traduction, la rétractation numérique, la médiation et le traitement fiscal avec les interlocuteurs compétents. Les pages de conditions sont des **projets non indexables**.
5. Arbitrer l’écart entre le pied de page des extraits (SASU, capital 1 400 €) et les mentions historiques du site (SAS, 2 000 €). Ni les PDF reçus ni les mentions légales protégées du site n’ont été réécrits.
6. Recette navigateur ordinateur/mobile et récupération du livre. Le re-téléchargement fonctionne dans le même navigateur avec son cookie privé ; pas encore de récupération autonome par e-mail sur un autre appareil.

## Vérifications et sauvegarde

Compilation de 68 pages FR/EN ; contrôles des liens, images, ancres, langues, données structurées, prix, vendeur, activation, extraits et absence des livres complets dans le build. Suite site : 62 réussites, zéro échec, un ancien comparatif d’archive visuelle omis car archive locale absente. Tests serveur avec transports Stancer et e-mail simulés. Les couvertures ont été inspectées ; la recette navigateur reste à réaliser selon disponibilité de l’outil.

Sauvegarde sur branches de travail uniquement. **Aucune fusion ni push sur main, aucun déploiement, paiement ou e-mail réel.** PEAK EXCHANGE reste soumis à la confirmation Stancer et à sa recette finale.
