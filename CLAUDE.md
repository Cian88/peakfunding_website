# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte

### Dernières annotations — héros +20 %, Observatoire dans le simulateur

Voir `docs/annotations-accueil-simulateur.md`. Le widget n'est plus dans le héros :
il est intégré en bandeau clair au-dessus du formulaire de capacité. Les informations
restent indépendantes du calcul. Bloc du héros à 120 % sur ordinateur ; quatre pôles
avec entrée photo puis texte. Méthode sombre et fondus inchangés.

### Dernier lot — héros repositionné, widget mensuel et méthode sombre

Voir `docs/heros-observatoire.md`. Texte du héros en haut à gauche, widget informatif
Crédit Logement / CSA en bas à droite sur desktop, empilé sur mobile. Relais PHP pour
Hostinger Web/Cloud, cache 6 h à la demande ; équivalent Node en développement Astro.
Ce sont des données mensuelles, jamais des cotations « en temps réel ». Le simulateur
ne lit pas ces données et conserve son calcul. Méthode et ses cartes redeviennent
sombres avec fondu au scroll ; les autres sections conservent leur couleur.

### Direction actuelle — ouverture sombre, centre clair, conclusion sombre

Voir `docs/rythme-noir-clair-noir.md`. Après le héros : chiffres et mission sombres.
Simulateur, expertises, méthode, équipe/partenaires et FAQ clairs. Bandeau final et
footer sombres. Les deux fondus au scroll subsistent. Les cartes de méthode et le
simulateur ont une variante CSS claire ; les composants métier restent inchangés.
Cette demande remplace la dominante sombre décrite ci-dessous.

### Dernière direction — continuité sombre, moins d'alternances

Voir `docs/dominante-sombre.md`. L'accueil ne conserve qu'une section claire :
équipe et partenaires. Mission et expertises sont sombres, avec une composition
asymétrique et quatre lignes illustrées sans cartes blanches. Trois filets d'entrée
se révèlent au scroll ; les deux transitions de fond restantes utilisent toujours
le canevas uni réversible. Pas de filtres sur les photos. Suite : 17 tests.
Cette direction remplace l'alternance sombre/cendre systématique des notes anciennes.

### Correction prioritaire — vrai fond au scroll et largeur Actelo

Voir `docs/fond-scroll-et-espace-client.md`. Les anciennes bandes en dégradé sont
supprimées. `fond-scroll.mjs` interpole un fond uni commun aux sections de l'accueil,
avec contraste recalculé ; `motion.ts` applique les couleurs selon la position du
scroll. Les cartes, le héros, les photos et le simulateur conservent leur palette.
Le mode statique et le mouvement réduit gardent les fonds d'origine. L'espace client
utilise une largeur maximale de 1840 px avec marges fluides. Suite : 16 tests.
Les descriptions plus anciennes des « raccords » ne s'appliquent plus.

### Dernier lot — annotations et fluidité

Voir `docs/annotations-et-fluidite.md`. Héros plein viewport sans plafond de hauteur,
cartes d'articles uniformes (180 px de visuel), menu Vos espaces détaillé, quatre
schémas de méthode. Le simulateur source reste inchangé : ses champs et son résultat
sont placés en deux colonnes par CSS, puis empilés sur mobile.
Tous les liens d'assurance sont maintenant des liens natifs vers un nouvel onglet.
La fenêtre intégrée d'assurance et son contrôleur ont été retirés ; les notes des
lots antérieurs à ce sujet sont historiques. Formspree et Actelo sont conservés.
Les raccords clair/sombre sont confinés aux espacements entre sections, pilotés par
`--fondu-avancement`, sans altérer les images ni les contrastes du texte. Ils sont
désactivés sans animation. Vérification courante : 19 pages et 13 tests.

### Lot complémentaire — retour V1 et homogénéité

Voir `docs/retour-v1-et-homogeneite.md` pour les deux artefacts Claude lus et l'audit.
Les sept illustrations V1 sont extraites à l'identique par `scripts/extract-v1-visuals.mjs`.
Dernière demande : afficher les originaux sans filtre ni voile coloré pour les articles
et les quatre expertises. `VisuelArticle.astro` affiche l'image brute ; le composant
de filtre cuivre a été retiré. La suite comporte désormais 12 tests.
`src/data/integrations.ts` conserve les URL V1 : assurance Simulassur/Magnolia avec
attribution 33656, script client Actelo .app et portail mandataire .fr.
L'espace client utilise une navigation document, et ses liens `data-astro-reload`,
pour isoler le script fournisseur. Ne pas remplacer son widget par un lien mailto.
L'assurance possède sa propre fenêtre, distincte de la prise de rendez-vous.
Le menu mobile utilise un voile flouté et un contrôleur clavier/inert ; les notes
historiques « menu sans script » ne décrivent plus le comportement actuel.
Vérification courante : build de 19 pages puis 11 tests, dont les intégrations V1.
Ne jamais envoyer un formulaire réel ni réserver pendant ces vérifications.

### Lot du 12 septembre 2026 — amélioration de la v2 existante

L'utilisateur a donné carte blanche pour ce lot, sans reconstruction de zéro ni publication.
Les contraintes permanentes restent les textes légaux exacts et les mécaniques du
simulateur et du questionnaire. Voir `docs/direction-et-verifications.md` pour les
références Refero, les arbitrages et la sauvegarde antérieure.

La direction Altitude conserve Mercury comme référence principale ; Titan ne sert
qu'à la précision typographique des données. Les photographies déjà présentes sont réutilisées.
Les notes historiques ci-dessous ne décrivent pas toutes la dernière implémentation :

- `motion.ts` initialise un contrôleur nettoyable sur `astro:page-load` : révélations
  via IntersectionObserver, compteurs, menu, progression de lecture et méthode.
  Le contenu est visible sans JavaScript ; `?statique` désactive les animations.
- L'en-tête n'est plus persistant entre les pages ; la fenêtre de rendez-vous reste persistante.
- Les filtres éditoriaux restent en CSS natif. `src/lib/editorial.mjs` normalise les
  accents et trie les dates françaises. `document.mjs` ajoute uniquement les ancres
  à une copie du HTML ; les sources éditoriales et légales sont inchangées.
- Vérification reproductible : `npm run build` puis `npm test` (6 tests, 19 pages,
  empreintes des 5 sources protégées, textes rendus, liens/ancres/images, tri et thèmes).
- Dans Codex, utiliser le navigateur intégré pour les tests et suivre son skill.
  Ne pas réutiliser automatiquement les commandes Edge headless historiques.

### Contexte historique

Site v2 de PEAK FUNDING (courtage en financement, ORIAS n° 24002546). Répondre en français. L'utilisateur exige **l'accord explicite avant toute modification** (grouper les demandes par lot) et une **économie de tokens** : réponses courtes, une capture par vérification.

`_source/` = ancien site (v1, identique à la production), logos, polices, documents. **Lecture seule, exclu de git** (48 Mo de vidéo). L'audit de la v1 est dans la feuille de route publiée en artifact ; ne pas ré-auditer.

## Commandes

Node, npm et git ne sont pas dans le PATH de la session VS Code : préfixer `export PATH="/c/Program Files/nodejs:$PATH"` (Bash) ; git = `C:\Program Files\Git\cmd\git.exe`.

```bash
npm run dev      # http://localhost:4321 (démon Astro : npx astro dev stop|status|logs)
npm run build    # dist/ statique, déployable tel quel sur Hostinger
npm run check
```

Vérification visuelle : Edge headless, autorisé par l'utilisateur.
`"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --screenshot=<png> --window-size=1280,800 <url>` — chemins `file://` en forme Windows.

**Piège : Edge headless impose une fenêtre d'au moins 492 px et rogne ensuite la capture** — `--window-size=390` produit une image trompeuse (contenu « coupé » à droite) et de fausses mesures. Pour le mobile, charger la page dans un `<iframe>` de 390 px depuis une page-harnais locale (fenêtre 900 px) et capturer/mesurer celle-ci ; ajouter `--allow-file-access-from-files` pour lire le DOM d'un iframe `file://`.

## Architecture

Astro 7 (sortie statique) + `@astrojs/react` + Tailwind 4 via plugin Vite (`@theme` dans `src/styles/global.css`, pas de `tailwind.config`).

- Pages de contenu en `.astro` statique. **React uniquement en îlots** (`src/components/react/*.tsx`, `client:visible`) là où l'utilisateur agit : simulateur, formulaire, FAQ, filtres.
- `Base.astro` inclut `Header` et `Footer` sur toutes les pages. Le pied de page porte les liens légaux, l'ORIAS/ACPR et « Un crédit vous engage… » — absents de la v1 sur 30 pages : ne jamais les retirer.
- Menu mobile en `<details>` natif, sans script ; le bouton « Prendre rendez-vous » passe dans le menu sous 640 px.
- `src/contenu-legal/*.html` : textes légaux **au mot près**, injectés par `Legal.astro`. Toute modification passe par le service conformité de l'utilisateur (écarts connus avec la fiche cabinet du 11/06/2026 : capital, statut, catégories ORIAS, TVA).

## Design — direction « Altitude » (validée le 2026-09-12, remplace Titan)

Mercury (héros photo plein écran, titres légers, narration au défilement) + Dovetail (grille technique, mono) + Capital (alternance sombre/cendre). Jetons dans `global.css` : `abime`, `ardoise`, `graphite`, `filet`, `etoile`, `argent`, `brume` (registre sombre) ; `cendre`, `blanc`, `encre`, `corps`, `gris`, `trait` (registre clair) ; `cuivre` / `cuivre-clair` / `cuivre-profond` = signal unique (boutons, chiffres, traits — jamais d'aplat). Geist 300–400 pour les titres, Geist Mono pour les données. Rayons : pilule 40 px, données 8 px, cartes 16 px. Aucune ombre.

Sections : `.sombre` (+ `<div class="grille">`) ou `.clair`, avec `.section-sombre` / `.section-claire`. Boutons `.btn-cuivre` / `.btn-fantome` (s'adaptent au registre). Cartes `.carte-donnee` (sombre) / `.carte-claire`.

**Mouvement** : entrées de section (`.reveal`, `.reveal-groupe`), pictogrammes qui se tracent (`.trace`), parallaxe du héros et givrage de l'en-tête sont des **animations CSS pilotées par le défilement** (`animation-timeline: view()/scroll()`), donc visibles sans JavaScript et déterministes. `src/scripts/motion.ts` ne gère que les compteurs (`[data-compte]`, logique v1) et la méthode épinglée (`[data-etape]`, `[data-onglet]`, `[data-rail]`). Tout respecte `prefers-reduced-motion`.

**Contraintes dures** : `SimulateurCapacite.tsx` reproduit la mécanique v1 (taux 3,5 %, effort 35 %, arrondi 5 000 €, autres revenus existants pondérés 70/90 %) avec les évolutions demandées le 2026-09-14 : loyers attendus du projet pondérables 70 %/90 % (défaut 70 %, HCSF) ; nombre d'emprunteurs 1–6 ; taux du prêt par curseur 0–15 % (défaut 3,5 %) ; assurance emprunteur (taux 0–1 %, base linéaire ou CRD, garanties DC/PTIA/ITT/IPP ou DC/PTIA à 60 % du taux, quotité par emprunteur) incluse dans l'effort HCSF : `emprunt = mensualité max / (facteur d'annuité + prime mensuelle par €)` ; **plafond d'effort 35 % assurance incluse, 33 % si aucune assurance n'est prise en compte** (règle confirmée par le cabinet) ; `PriseRendezVous.tsx` reproduit le parcours v1 (2 étapes → Formspree `mykrggwk`/`xkjnbpod` selon le courtier, repli mailto → agendas Proton). Ne pas modifier sans demande explicite.

**Vérifier une section basse** : Edge headless + ancre est brouillé par le défilement animé. Créer temporairement `public/_verif.html` (iframe même origine sur `/`, script qui met `scroll-behavior:auto` et `scrollTo` l'ancre passée en `?a=`), capturer `http://localhost:4322/_verif.html?a=simulateur`, **puis supprimer le fichier** avant tout build/déploiement.

## Design — direction « Titan » (2026-09-09, remplacée — conservée pour mémoire)

Système de la référence Refero **Titan** (style `56105743-b6f0-49df-8788-1578972a2e1d`) appliqué à tout le site : monochrome discipliné, encre `#111111` sur blanc, surfaces sauge `#f3efeb`, filets `#e9eaeb`, boutons **pilule 160 px** noirs ou fantômes, cartes 20/32 px, **aucune ombre**, sections à 80 px, 1200 px max. Le cuivre `#b87b4f` ne sert qu'aux traits d'illustration (rôle de l'orange décoratif chez Titan) — jamais de texte ni d'aplat cuivre. Polices **Geist + Geist Mono** (`@fontsource-variable`, importées dans `Base.astro`) ; mono pour les chiffres, les eyebrows et les métadonnées. Imagerie : illustrations au trait (`Peak.astro`, `Pictogramme.astro`), portraits en noir et blanc, logos partenaires en niveaux de gris — pas de photo couleur.

Les classes partagées vivent dans `global.css` (`@layer components`) : `.contenu`, `.section`, `.display`, `.titre`, `.sous-titre`, `.eyebrow`, `.corps`, `.donnee`, `.btn-noir`, `.btn-fantome`, `.btn-nav`, `.carte`, `.carte-lg`, `.prose-pf`. Tailwind 4 refuse `@apply` d'une classe maison : répéter les utilitaires.

Contenus : `src/data/site.ts` (accueil), `expertises.ts`, `textes.ts` (FAQ, partenaires), `articles.json` + `src/contenu-articles/*.html` (corps verbatim de la v1). Tout texte vient de la v1 mot pour mot ; ne pas réécrire sans demande.

Pour toute évolution visuelle : skill `refero-design` (recherche de références d'abord), Recraft pour les visuels. Fiche cabinet navy/or `#0C1B2A`/`#C8A97E` = charte concurrente non retenue.
