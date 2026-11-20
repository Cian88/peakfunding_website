# Clone de prévisualisation — trois services

11 novembre 2026. **Aucune publication, aucune ouverture des ventes.**

Le clone local est dans `C:/Users/valen/dev/peakfunding-preview`, branche `codex/services-preview`. Il contient le dernier `main` distant vérifié (`057cf44`), puis les préparations EXCHANGE et livre et les retours graphiques de Valentin. Le checkout d’origine et la production ne sont pas modifiés. Le workflow est gardé sur `main` pour la construction et le déploiement, y compris lors d’un lancement manuel ; la branche de prévisualisation ne publie pas.

## Modifications réunies

- Menu **Nos services** immédiatement avant **Vos espaces**, regroupant livre, PEAK PITCH et PEAK EXCHANGE. Déclinaison mobile, fermeture au clic extérieur et par Échap, un seul menu ouvert.
- Livre vendu par PEAK FUNDING à 24,90 € TTC (TVA à 5,5 % incluse), auteur Valentin Boura--Defranoux, extraits FR/EN gratuits, livres complets hors du site public.
- PEAK PITCH à 99 €, TVA non applicable (article 261 C du CGI), trois livrables et une génération par projet. Reprise de la page existante, sans ancienne option EXCHANGE.
- PEAK EXCHANGE autonome à 299 € TTC (TVA à 20 % incluse), déduction conditionnelle des honoraires de courtage conservée.
- Ouvertures livre et EXCHANGE sous le menu en plein écran ; conditions du livre discrètes dans la conclusion sombre.
- Barre de défilement native rétablie. Le signet de lecture reste disponible dans son composant, sans montage global : proposition non validée par Valentin.

## Vidéo d’accueil

La vidéo est reprise de la production locale existante, avec photographie fixe, titrage natif, fondus de 1,15 s, 22 secondes à 60 images/s. Les deux nouvelles éditions HD et UHD et l’affiche sont dans `public/peak-pitch/pitch-hero-*`. L’ancienne ligne d’option PEAK EXCHANGE a été retirée lors de la recomposition des plans. Aucun faux remplacement de prix par-dessus le film.

La lecture est automatique, muette, sans boucle ; la fin conserve la dernière image et le lien Découvrir PEAK PITCH. Le contrôleur respecte le mouvement réduit, la visibilité de l’onglet, les menus et la navigation Astro. La racine `.heros` est conservée pour les transitions de fond du site. La page PEAK PITCH utilise le même film nettoyé.

`PUBLIC_PEAK_PITCH_HERO=true` est défini uniquement dans le `.env` ignoré du clone. Sa valeur d’exemple est `false`. Le contrôle de décodage de l’UHD a réussi. L’affiche finale a été inspectée ; la lecture réelle et le rendu de page restent à vérifier dans un navigateur disponible.

## Configuration Stancer

Dans le clone, toutes les valeurs de vente restent fermées :

```text
PUBLIC_STANCER_READY=false
PUBLIC_PEAK_PITCH_ENABLED=false
PUBLIC_PEAK_PITCH_URL=
PUBLIC_PEAK_EXCHANGE_ENABLED=false
PUBLIC_PEAK_EXCHANGE_URL=
PUBLIC_EBOOK_SALES_ENABLED=false
PUBLIC_EBOOK_SERVICE_URL=
```

Valentin a confirmé la validation du compte Stancer le 20 novembre 2026. Le build requiert `PUBLIC_STANCER_READY=true`, l’interrupteur propre à chaque offre et son URL de service HTTPS. Pour ouvrir une offre, utiliser le serveur vérifié en mode production et appliquer les réglages correspondants documentés dans `peak-dossier`.

Avant ouverture, vérifier le paiement et la livraison ou l’accès à l’agenda, ainsi que les CGV. Les interrupteurs contrôlent aussi l’indexation des pages commerciales. Chaque ouverture nécessite l’accord de publication de Valentin.

## Vérifications

72 pages FR/EN construites. 70 tests réussis, zéro échec, un comparatif historique omis faute d’archive V1. Vérifications des liens, des contenus protégés, des accès fermés, du menu et du contrôleur de défilement. Aucun appel Claude, paiement, rendez-vous ou e-mail réel. L’accès navigateur disponible auparavant était indisponible ; la recette visuelle réelle reste une étape avant publication.

## Corrections de revue du 17 novembre 2026

Travail poursuivi sur le VPS, dans /home/valentin/dev/peakfunding-preview, branche codex/services-preview, à partir de 52f32ae. Aucun push, déploiement ni rebase. Les ventes restent fermées. Voir corrections-revue-2026-11-17.md pour la recette et les décisions.
