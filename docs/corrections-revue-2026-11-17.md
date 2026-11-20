# Corrections de la revue — 17 novembre 2026

Travail réalisé uniquement sur le VPS, dans /home/valentin/dev/peakfunding-preview, branche codex/services-preview, à partir de 52f32ae. Le clone Windows reste inchangé. Aucun push, déploiement, rebase ni ouverture des ventes. Coffre Obsidian laissé à Claude selon la délégation.

## Corrections

1. **Coordonnées légales.** contact@peakfunding.eu reste lisible dans l'identité de l'éditeur, la procédure de réclamation et l'exercice des droits RGPD, en FR/EN. Ces trois occurrences portent un marqueur explicite que public-contact.mjs préserve. Aucun mailto commercial ajouté. Le remplacement des autres occurrences dirige vers le contact administratif avec URL et libellé anglais sous /en/. Les textes juridiques français restent la version opposable, conformément à l'avertissement existant.
2. **Lecture.** ProgressionLecture.astro et son contrôleur restent disponibles, mais le composant et son initialisation ont été retirés de Base.astro. Aucune feuille de style du signet ni masquage de barre native n'est chargé globalement.
3. **Accueil.** Avec PUBLIC_PEAK_PITCH_HERO=true, le h1 visible présente le cabinet de courtage en financement et assurance emprunteur. PEAK PITCH devient un h2. Film et visuels pleine largeur conservés.
4. **Assurance.** Les guides FR/EN renvoient vers PEAK INSURE, qui conserve son comparateur et propose ses guides assurance en action secondaire. Choix : rester dans le parcours assurance déjà disponible, sans ajouter une consultation de financement payante.
5. **Indexation.** /livre/, /peak-exchange/, /contact/ et leurs versions EN sont noindex et exclus du sitemap tant que leur paiement est fermé. Base et sitemap appellent la même fonction, elle-même fondée sur les fonctions qui déterminent les liens de paiement. Livre : activation Stancer, activation du livre et URL valide ; EXCHANGE/contact : activation Stancer et URL EXCHANGE valide. L'offre PreOrder est supprimée ; une offre InStock n'est produite qu'une fois les ventes ouvertes.
6. **Détails.** 404 FR/EN orientées vers accueil et ressources, sans ancienne durée ; nom harmonisé en « Valentin Boura--Defranoux », forme déjà employée dans l'équipe et les offres, y compris auteurs et JSON-LD ; espaces insécables pour les prix concernés et le nom ; PriseRendezVous.tsx et RendezVousModal.tsx supprimés après vérification de l'absence d'import extérieur à leur paire ; affiche d'accueil WebP, picture AVIF/WebP/JPEG en mode statique, repli JPEG pour le poster vidéo ; PEAK FUNDING en capitales sur le livre ; descriptions des conditions PEAK PITCH complètes ; contactPoint anglais vers /en/contact/.

## Prix

PEAK EXCHANGE reste à 299 € TTC. Recherche sur src/, public/ et docs/ : aucune occurrence de l'ancien tarif ni de l'ancienne promesse de durée, hors coordonnées numériques sans rapport dans france-departements.json. Les seuls littéraux de l'ancien tarif dans les tests sont des assertions de non-régression. Les mentions éventuelles du coffre sont à corriger par Claude.

Les dispositions relatives à L.519-6, à la déduction des honoraires et au régime de TVA ne sont pas modifiées.

## Validation

- Build : 72 pages construites.
- Tests : 73 tests, 72 réussis, zéro échec, un contrôle de l'archive V1 omis faute de source.
- Les anciens tests d'envoi Formspree ont été retirés avec les composants morts ; les tests de validation de saisie encore applicables et de calcul du simulateur sont conservés.
- Deux compilations réelles vérifiées : configuration fermée ; configuration ouverte avec URL fictives. Les six routes deviennent indexables et réintègrent le sitemap, le livre produit alors une offre InStock. Configuration fermée restaurée ensuite.
- Contrôle des e-mails sur tout le build, des liens FR/EN, des chemins assurance, du nom dans les données structurées et de l'absence d'ancien tarif.
- Recette navigateur : 72 pages aux formats 1440 × 900 et 390 × 844, 290 captures initiales, aucun débordement horizontal, aucune image manquante ni erreur JavaScript. Lecture et pause vidéo vérifiées. Inspection visuelle des pages clés FR/EN et correction ciblée du cadrage statique mobile et du nom dans EXCHANGE. Voir le rapport JSON et les captures dans /home/valentin/dev/_revues/clone-services/apres/, recopiés dans C:/Users/valen/dev/_revues/clone-services/apres/. Script reproductible : scripts/revue-services.mjs. Services tiers neutralisés pendant la capture, sans paiement ni message.

## Reste à faire

La validation des sujets juridiques et fiscaux hors périmètre, la finalisation des conditions commerciales et la recette réelle Stancer restent à traiter par Valentin/Claude avant une éventuelle ouverture. Aucune de ces actions n'est réalisée ici. La mise à jour du coffre incombe à Claude.
