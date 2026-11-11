# Clone de prévisualisation — trois services

11 novembre 2026. **Aucune publication, aucune ouverture des ventes.**

Le clone local est dans `C:/Users/valen/dev/peakfunding-preview`, branche `codex/services-preview`. Il contient le dernier `main` distant vérifié (`057cf44`), puis les préparations EXCHANGE et livre et les retours graphiques de Valentin. Le checkout d’origine et la production ne sont pas modifiés. Le workflow est gardé sur `main` pour la construction et le déploiement, y compris lors d’un lancement manuel ; la branche de prévisualisation ne publie pas.

## Modifications réunies

- Menu **Nos services** immédiatement avant **Vos espaces**, regroupant livre, PEAK PITCH et PEAK EXCHANGE. Déclinaison mobile, fermeture au clic extérieur et par Échap, un seul menu ouvert.
- Livre vendu par PEAK FUNDING à 24,90 €, auteur Valentin Boura Defranoux, extraits FR/EN gratuits, livres complets hors du site public.
- PEAK PITCH à 99 €, TVA non applicable, trois livrables et une génération par projet. Reprise de la page existante, sans ancienne option EXCHANGE à 199 €.
- PEAK EXCHANGE autonome à 299 € TTC, déduction conditionnelle des honoraires de courtage conservée.
- Ouvertures livre et EXCHANGE sous le menu en plein écran ; conditions du livre discrètes dans la conclusion sombre.
- Ancienne courbe latérale refusée par Valentin et retirée. Proposition de **signet de dossier**, petite encoche cuivre mobile au bord de l’écran ; titre de rubrique seulement au survol ou au focus. Voir `navigation-lecture.md`.

## Vidéo d’accueil

La vidéo est reprise de la production locale existante, avec photographie fixe, titrage natif, fondus de 1,15 s, 22 secondes à 60 images/s. Les deux nouvelles éditions HD et UHD et l’affiche sont dans `public/peak-pitch/pitch-hero-*`. L’ancienne ligne « En option : PEAK EXCHANGE · 199 € TTC » a été retirée lors de la recomposition des plans. Aucun faux remplacement de prix par-dessus le film.

La lecture est automatique, muette, sans boucle ; la fin conserve la dernière image et le lien Découvrir PEAK PITCH. Le contrôleur respecte le mouvement réduit, la visibilité de l’onglet, les menus et la navigation Astro. La racine `.heros` est conservée pour les transitions de fond du site. La page PEAK PITCH utilise le même film nettoyé.

`PUBLIC_PEAK_PITCH_HERO=true` est défini uniquement dans le `.env` ignoré du clone. Sa valeur d’exemple est `false`. Le contrôle de décodage de l’UHD a réussi. L’affiche finale a été inspectée ; la lecture réelle et le rendu de page restent à vérifier dans un navigateur disponible.

## Ouverture Stancer, après confirmation seulement

Dans le clone, toutes les valeurs de vente restent fermées :

```text
PUBLIC_STANCER_READY=false
PUBLIC_PEAK_PITCH_ENABLED=false
PUBLIC_PEAK_PITCH_URL=
PUBLIC_PEAK_EXCHANGE_URL=
PUBLIC_EBOOK_SALES_ENABLED=false
PUBLIC_EBOOK_SERVICE_URL=
```

Un lien serveur renseigné ne suffit pas : les trois offres attendent `PUBLIC_STANCER_READY=true`, et PITCH/livre leur activation spécifique. Aucun lien automatique vers un paiement local n’est présenté en développement. Ce drapeau représente la confirmation du cabinet, pas une vérification automatique du compte Stancer.

Avant ouverture : confirmation explicite de Valentin, compte Stancer opérationnel, serveur configuré sur Stancer, recette complète du paiement et des droits de livraison/rendez-vous, CGV définitives et fiscalité du livre. Les pages de conditions sont des projets non indexables. Les pages PITCH sont privées tant que l’offre est fermée ; leur inclusion dans le sitemap sera à finaliser au lancement.

## Vérifications

72 pages FR/EN construites. 70 tests réussis, zéro échec, un comparatif historique omis faute d’archive V1. Vérifications des liens, des contenus protégés, des accès fermés, du menu et du contrôleur de défilement. Aucun appel Claude, paiement, rendez-vous ou e-mail réel. L’accès navigateur disponible auparavant était indisponible ; la recette visuelle réelle reste une étape avant publication.
