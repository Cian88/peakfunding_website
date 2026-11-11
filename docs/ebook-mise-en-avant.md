# Ebook — préparation de la mise en avant

11 novembre 2026. Demande : promouvoir le livre de Valentin sur peakfunding.eu, en français et en anglais, avec extrait gratuit et édition complète à **24,90 €** après paiement Stripe. Préparation uniquement ; aucune vente ni publication activée.

## Périmètre réalisé

- Pages `/livre/` et `/en/livre/`, couvertures originales rendues depuis les PDF, présentation, publics concernés, sommaire de 26 chapitres en quatre parties, prix, auteur et rappel du caractère informatif.
- Encart sur l’accueil dans les deux langues, entrée de navigation et lien de pied de page.
- Deux éditions PDF : française de 80 pages et anglaise de 78 pages. Les fichiers complets retrouvés dans Downloads correspondent aux dernières éditions du projet éditorial et sont copiés sans modification dans `private/ebook/`, ignoré par Git et exclu du build Astro.
- Le contenu du guide n’a pas été réécrit. Aucun des PDF complets n’est accessible depuis `public/` ou `dist/`.
- Les deux fichiers d’extrait ne sont pas présents dans les pièces de cette demande ni retrouvés dans les emplacements consultés. Leur chemin a été demandé à Valentin ; les emplacements sont préparés, sans faux lien de téléchargement.
- Aucun appel Stripe, paiement, transmission de données client ou e-mail réel effectué. PEAK EXCHANGE reste sur Stancer ; cette offre de livre emploiera Stripe séparément.

## Direction graphique — SILLAGE / Refero

Référence dominante : la charte Altitude déjà approuvée pour PEAK FUNDING (Geist, encre `#0b0d12`, cuivre `#d9a47c`, papier `#f2f0eb`). Référence complémentaire consultée : **Franco Maria Ricci — the collector’s cabinet**, Refero `2c3b31a4-6e28-47a0-afbd-cb22e22e34fb`, pour le livre comme objet réel, les surfaces papier, les filets et les compositions éditoriales. Son caractère Bodoni et ses actions entre accolades ne sont pas repris : les polices, boutons et couleurs du site restent ceux du cabinet.

Les couvertures fournissent l’image et leur typographie propre. Pas de faux témoignages, de ventes annoncées ou d’illustration inventée. Sur mobile, titre, prix et actions précèdent le détail et le visuel du livre. Sommaire en accordéons natifs pour limiter la hauteur de lecture. Le code des fondus, de navigation et des avis existants est conservé.

## Fichiers d’extrait à raccorder

Quand les chemins des deux PDF sont confirmés :

```powershell
node scripts/import-ebook-assets.mjs --extrait-fr 'CHEMIN_FR.pdf' --extrait-en 'CHEMIN_EN.pdf'
```

Le script accepte seulement des PDF, refuse de publier comme extrait un fichier identique au livre intégral enregistré et met à jour `src/data/ebook-assets.json`. Seuls les extraits seront copiés dans `public/extraits/ebook-fr.pdf` et `public/extraits/ebook-en.pdf`. Vérifier leur contenu, langue, absence de coordonnées que Valentin ne souhaite pas publier et pagination avant publication.

Pour réimporter une édition complète locale : `--livre-fr` / `--livre-en`. Ces options ne copient jamais le livre dans le répertoire public. Les couvertures actuelles sont tirées des éditions identifiées et non générées artificiellement.

## Raccordement Stripe à réaliser par Valentin / l’intégrateur

Cette livraison prépare la vitrine et ses points de raccordement. **Le serveur de livraison après achat n’est pas implémenté dans ce lot.** Les PDF privés locaux ne sont donc pas encore un système de distribution aux acheteurs.

1. Créer deux Payment Links Stripe, un par édition, en EUR, paiement unique à 24,90 €, quantité fixe de 1, sans abonnement. La préparation utilise une édition au choix par achat ; une inclusion des deux langues demanderait une décision commerciale explicite.
2. Recueillir les informations de facturation et les consentements applicables à la vente de contenu numérique ; faire valider les conditions de vente avant activation.
3. Implémenter une livraison serveur avec vérification du paiement, du produit, de l’édition, de la devise et du montant, et une autorisation de téléchargement. Conserver les livres dans un stockage privé ; ne jamais transformer la redirection de succès en lien public permanent vers les PDF.
4. Vérifier les signatures du webhook et rendre la création du droit d’accès idempotente. Traiter les paiements différés et prévoir la reprise si le client ne revient pas sur la page après paiement. Stripe recommande un webhook pour cette livraison, complété par le retour navigateur. [Documentation Stripe — fulfillment](https://docs.stripe.com/checkout/fulfillment.md?ui=full-page).
5. Configurer l’URL de retour du Payment Link avec `{CHECKOUT_SESSION_ID}` vers la page de livraison retenue ; ce paramètre ne remplace pas la vérification serveur. [Payment Links et page de retour](https://docs.stripe.com/checkout/fulfillment.md?ui=full-page#payment-links).
6. Prévoir le re-téléchargement sécurisé et la gestion des remboursements. Le reçu Stripe seul ne contient pas le livre : vérifier la remise effective avant ouverture des ventes.

Variables publiques du build, également transmises par le workflow GitHub Pages :

```text
PUBLIC_EBOOK_SALES_ENABLED=false
PUBLIC_EBOOK_STRIPE_LINK_FR=
PUBLIC_EBOOK_STRIPE_LINK_EN=
PUBLIC_EBOOK_DELIVERY_URL=
```

Les boutons d’achat restent désactivés sans activation explicite, lien `https://buy.stripe.com/…` de la langue concernée et URL HTTPS de livraison protégée. L’URL de livraison est un paramètre de préparation : son existence et sa sécurité doivent être testées, pas seulement renseignées. Les clés secrètes et le secret de webhook restent exclusivement dans l’environnement du futur serveur, jamais dans des variables `PUBLIC_`.

## Vérifications et publication

- Compilation de 66 pages FR/EN ; contrôles de liens, images, ancres, langue, données structurées Book et prix 24,90 €.
- Tests spécifiques : vente fermée par défaut, URL Stripe autorisée, présence d’une livraison HTTPS requise, états d’extrait manquant, livres intégraux hors du build. Tests existants de non-régression conservés.
- 62 tests réussis, zéro échec ; un ancien comparatif d’empreinte des visuels V1 omis car l’archive locale n’est pas versionnée. Cette limite n’est pas un contrôle de la nouvelle couverture.
- Les deux couvertures ont été inspectées. La recette navigateur ordinateur/mobile doit encore être faite avant mise en ligne, selon disponibilité de l’accès navigateur.
- Aucun push sur `main` ni déclenchement de déploiement. La sauvegarde éventuelle de la branche de travail n’active pas le site. Le lot PEAK EXCHANGE reste soumis à la confirmation explicite Stancer prévue dans `docs/peak-exchange-deploiement.md`.
