# Retouches de la relecture Claude — 17 novembre 2026

Branche `codex/services-preview`, base `308a26c`. Travail local uniquement : aucun push, déploiement, rebase ou modification du coffre Obsidian.

## Réponse point par point

1. **Nom officiel** : `Valentin Boura--Defranoux` dans les données, auteurs, offres, métadonnées, JSON-LD, mentions légales, llms et documentation. Nom en ASCII, sans espace insécable ; spans `whitespace-nowrap` pour les noms visibles. Empreinte légale recalculée.
2. **Code mort** : suppression de `ProgressionLecture.astro`, `src/scripts/lecture.ts` et des tests spécifiques au contrôleur. Aucun import restant. Suppression du dictionnaire RDV entièrement inutilisé (dont les deux listes de courtiers) ; le simulateur reste inchangé.
3. **Extraits V1** : suppression de `index.txt` et `expertise-{pro,estate,pim}.txt`, après recherche d'imports sans résultat.
4. **PEAK PITCH** : retrait de l'exclusion fixe du sitemap et ajout à `salesIndexable`, avec les mêmes contrôles d'activation et d'URL que le paiement. Tests des interrupteurs et des URL invalides. Un build distinct, activé avec des URL factices `.example.test`, confirme les huit routes FR/EN des quatre pages dans le sitemap et sans noindex. Aucun service réel activé.
5. **404 EN** : bascule FR vers `/404.html`, fichier réellement généré ; retour FR → EN vers `/en/404/`. Vérification navigateur aux deux formats.
6. **Footer EN** : `Book PEAK EXCHANGE`.
7. **Accueil** : le cadre du film garde son ratio 16:9 et se dimensionne selon la hauteur disponible sur ordinateur. Référence verrouillée : composition Altitude existante, cuivre réservé aux actions, film et typographie conservés ; seul le dimensionnement change. Mobile conservé. À 1440×900, bouton entre y=700,34 et y=740,78 ; à 390×844, entre y=667,25 et y=719,25. Visible aux deux formats.
8. **Médias** : audit détaillé ci-dessous. Quatre originaux portent encore l'ancienne graphie ; aucun générateur de leur contenu n'existe dans le dépôt. Ils sont conservés sans retouche destructive.

## Vérifications

- Build statique : 72 pages.
- Tests : 67 réussis, zéro échec, un omis (comparatif V1 faute d'archive `_source/`). Le nombre baisse car les tests du contrôleur de lecture supprimé n'ont plus lieu d'être.
- Chromium : accueil, EXCHANGE, mentions légales et équipe en FR/EN, 1440×900 et 390×844 ; 404 FR/EN en complément. Aucun débordement horizontal, image cassée ou erreur JavaScript détecté dans les huit routes du rapport automatisé. Lecture/pause du film vérifiées hors préférence de mouvement réduit.
- Captures et mesures : `/home/valentin/dev/_revues/clone-services/retouches/`, rapports `rapport-navigateur-cible.json` et `complement-navigateur.json`.
- Le build ouvert de simulation est conservé dans ce même dossier, hors dépôt. Le build normal reste fermé.

## Médias : méthode et anomalies

Inventaire des fichiers médias du site : 58 fichiers, tous sous `public/` ; pas de `src/assets/`, ni de storyboard enregistré dans les sources du dépôt. Les copies `dist/` sont des sorties du build. Les planches d'inspection créées pour cet audit sont dans le dossier de captures.

- 2 vidéos de 22 s : ffmpeg extrait 44 images par vidéo, toutes les 0,5 s, de 0 à 21,5 s ; OCR Tesseract sur chaque image, plus inspection visuelle des cinq plans de chaque définition. Ce contrôle est échantillonné, pas une reconnaissance de chacune des 1 320 images encodées.
- 48 images raster : conversion et OCR individuelles ; inspection des affiches AVIF/WebP/JPEG et couvertures. Les avertissements ffmpeg sur deux WebP n'ont pas empêché l'extraction : chaque entrée possède bien une image analysée.
- 6 SVG : contrôle du texte source.
- 2 PDF publics : rendu et OCR des 8 pages de chaque extrait.
- Total : 152 images OCR, plus 6 SVG. Aucun `199 €` ni ancienne offre de 30 minutes détecté. Aucun nom dans les films et affiches PEAK PITCH.

**Anomalies confirmées visuellement :**

| Fichier | Position | Texte présent | Suite |
|---|---|---|---|
| `public/img/ebook/couverture-fr.webp` | Bas de couverture | `VALENTIN BOURA DEFRANOUX` | Remplacer depuis une couverture source corrigée |
| `public/img/ebook/couverture-en.webp` | Bas de couverture | `VALENTIN BOURA DEFRANOUX` | Remplacer depuis une couverture source corrigée |
| `public/extraits/ebook-fr.pdf` | Page 1, bas de couverture | `VALENTIN BOURA DEFRANOUX` | Réexporter l'extrait depuis le livre corrigé |
| `public/extraits/ebook-en.pdf` | Page 1, bas de couverture | `VALENTIN BOURA DEFRANOUX` | Réexporter l'extrait depuis le livre corrigé |

`scripts/import-ebook-assets.mjs` importe des PDF fournis, sans générer ou modifier leur contenu ; ce n'est pas un générateur de couvertures. `tools/regenerate-pitch-film.py` concerne uniquement le film PEAK PITCH, qui ne présente pas d'anomalie : aucune régénération nécessaire.

## Inventaire fichier par fichier

Les empreintes ci-dessous identifient exactement les médias contrôlés. OCR, images extraites, inventaire JSON et script d'audit sont conservés dans le dossier externe de captures.

| Fichier | Contrôle | Résultat | SHA-256 |
|---|---|---|---|
| `public/extraits/ebook-en.pdf` | 8 images OCR | Ancien nom en couverture | `f1eac52adfd660e0c0b85a7d2a2be9f5b9a0342d4a7b821c133e9d817d4804c9` |
| `public/extraits/ebook-fr.pdf` | 8 images OCR | Ancien nom en couverture | `27970ebbd10567cc6e0b3fd57148c89a33c9e2c936b4a7280e43bf011b3c015a` |
| `public/img/ambiance-estate.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `b11a086e1211caded7a2722bf45edc06e455c3de5468984975c9fa581d059b8d` |
| `public/img/ambiance-insure.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `ea4f9c3534f34ed1c173db5d3e7dab766221933890f9cf27e189144bb1df45f1` |
| `public/img/ambiance-pim.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `be23a730a4edcb69f80fa4173127fee01c4c38469e380439db307c7b0ecd8db0` |
| `public/img/ambiance-pro.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `b7b989ccf91074ee7a5375b3b80e8d8b6b988861e6c3d6b824ff388269cadf7c` |
| `public/img/article-v1-assurance-emprunteur-investissement-locatif.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `163c97042379caca7d804b2d7f0a12b92b98ffc39b13a62ca0ef58498e8dce01` |
| `public/img/article-v1-assurance-emprunteur-metiers-sports-risque.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `602d7afb800980812bcb6a451565293d7eed387763b235c11c2c986a9d29aff7` |
| `public/img/article-v1-assurance-emprunteur-sante.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `57d1b402080e487a1640ac31f82b08283ff5002e4064db6385f19345e2e29abf` |
| `public/img/article-v1-assurance-emprunteur-senior.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `cd9cbcfee306c08b261e8e6541a5f4f6773f9346db8ec7f41f817a7e6cf16f92` |
| `public/img/article-v1-capacite-locatif.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `9bf50424cd24f078856e369083813d62ce197fc83080cf96a79100b352b66b4b` |
| `public/img/article-v1-delegation-assurance.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `ac96feacb436e6bffb8e637395f13cf020ff67f08e9314f9475292f97b3c1ccf` |
| `public/img/article-v1-economie-assurance-emprunteur.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `7658e327c32e3993999cd5da0f829b29e73fafabcc04af1e43e4aa49f1ea0b42` |
| `public/img/article-v1-enchainer.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `cbc4200abcb9b5f594169b80a0a01af64bb511ff4b99bfba8f65051c7ddc2b36` |
| `public/img/article-v1-lemoine.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `15c83ccb06ec5eed27cb7f5ffb9d526eefb9a121d5b19ca3e92c94aa9debdc24` |
| `public/img/article-v1-non-resident.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `f50647659fdbfb0e2259561c7b57c8df4dc178f7040eb73eba74231a90dd9ad0` |
| `public/img/article-v1-primo.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `9576d690f3f10e43f1e39ea9f6e9e90b6f3de6f9eb6b16c83fce00521d3a672f` |
| `public/img/article-v1-quotite-assurance-emprunteur.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `4a502dbf18eab1ae38a130422c0a12045eda03c749d4c9f4923838c3a970b2ed` |
| `public/img/article-v1-refus-delegation-banque.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `b7f00b6caebc18d54b79efc10b3513a7b5b93780f716b761985941a299a64786` |
| `public/img/article-v1-sci.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `797628dfba9d77ef275155b9fc8606fa3b88722f67090724d211862ba877120c` |
| `public/img/article-v1-taux.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `44dd70a25437813e87c89757329cf7b9d95f3f50a32228bae68a8160f102834d` |
| `public/img/cabinet-bureau.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `ca43713b26a75dea30535347f9b4e054892ddf04eca8541354af95340a086e97` |
| `public/img/cabinet-travail.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `60916865c091245f4e815cb48eac2de7d1e627ef7aa7f89fc701e5284f44b6b7` |
| `public/img/cover-enchainer.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `34d2711dfdb994357be6e42137d334dc70571ee8b6feb3d9b73c17252ba56799` |
| `public/img/cover-lemoine.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `63c1a99d6c3448b497f4f3991b46182915145fc329458254bc162752cb477c6a` |
| `public/img/cover-non-resident.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `a5e946b3eed6e13667100163d7fd2566c178437e53b6c6886ffc81cbc0a47423` |
| `public/img/cover-sci.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `fa733790486119b68eb6f265ed9f41b26b734b51fc4610d6e921a4c91507ec28` |
| `public/img/ebook/couverture-en.webp` | 1 images OCR | Ancien nom en couverture | `7659cb3a13f198bd51a2a8dc04b74d8435077f829e84929b3c24230282c566ee` |
| `public/img/ebook/couverture-fr.webp` | 1 images OCR | Ancien nom en couverture | `7f4ca0442cc19b498b6fe215e0499e8002ab2d1e763fea4d04bab225f510384e` |
| `public/img/edilos-logo.svg` | Source SVG | Aucune anomalie ciblée détectée | `abfe5c14b2783fc35ad2378c54da81c4f811d528f537a8b7ca1f6568089f16a4` |
| `public/img/hero-1200.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `a22d2a797c5aeb4215b9d1fb8f6048bcd43e94226f6c1298cd00da47013bf4ba` |
| `public/img/hero-1600.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `931ef8affa09d88f493bd1536b5dbcac20617c00b5375a1ffcb8727e5b2f8081` |
| `public/img/hero-2400.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `20f880a39918a20063855eca91527ef977b9e6b425bd1ad9955712f25a1c4278` |
| `public/img/hero-mobile-1200.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `5accf6f3373bd5d167a79acfd3f4dd20fcb7b295cbf3a5a9a73d21dcbf48d791` |
| `public/img/icon-estate.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `502614851206fa9d316096549078a047c5a5b0067f2c5a5e9714fdd19bd6de30` |
| `public/img/icon-insure.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `327a009d7100def33d0ecd37fb2e4a32b2e20dc7277ba8cdf11f8308a436fe1a` |
| `public/img/icon-pim.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `f6443a51656dc23bf582e899321ffd6317d0fa26d069af434168b2ff7443639e` |
| `public/img/icon-pro.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `6620408fd5b8dde1d937574c0685b7b3234216e9fcee8e1059816887d279dc79` |
| `public/img/logo-peak-funding-ivoire.svg` | Source SVG | Aucune anomalie ciblée détectée | `f4af7917d5dbfc590fe66565dee036cb4b4e61e6398e1908c99a8eaa4d706d47` |
| `public/img/logo-peak-funding.png` | 1 images OCR | Aucune anomalie ciblée détectée | `5e58c9317eb425e4c3ba917dca620850cfa03deee3678b6d8faa20da4e2d3ae1` |
| `public/img/logo-peak-funding.svg` | Source SVG | Aucune anomalie ciblée détectée | `b2ee34a90be01bfe7415fdb59259ed3e8213409ecd4bcb043c349d56e9ae6973` |
| `public/img/macro-calculatrice.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `4ecf83cabef277943df1754cbd0371a56635d8458dc0ec472d31b694a2438970` |
| `public/img/macro-cles.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `14b863db833fab4436bf3454f574ed72402def6583ff2f945cd9ca9a05ba8236` |
| `public/img/macro-stylo.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `43d6f450c68c4fae96851c95d6eb8dcd6bf20a27a8857b4dd137127e64767e35` |
| `public/img/maxime-nb.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `d0984398d75eb7288ca356797aae82a7308d8ec41bd1cb93c9821f88bfc039a8` |
| `public/img/portrait-maxime.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `5a4a76e1592910ee01850c9fac288a804010ee3bd25cf0c1a296fc1fd4be8e8b` |
| `public/img/portrait-valentin.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `22dde64c63f6c06957d7ab92e250bd5d0f3500e76a0a26354f680d3931c38d59` |
| `public/img/portrait-yves.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `d2d7075bcdefa000116dafce66a88ea36772cd5a78e114e764c5761d70a06147` |
| `public/img/priveos-logo.svg` | Source SVG | Aucune anomalie ciblée détectée | `d6cdc90ee53c25159eee9ceca62a31779060891d276d1ac2e2fbcdea54429f4c` |
| `public/img/symbole-montagne-cuivre.svg` | Source SVG | Aucune anomalie ciblée détectée | `c01de50d90015bea79ac70ee4faf0aa19b1c7373b9efde64bf958a9d1a82a7eb` |
| `public/img/symbole-montagne-ivoire.svg` | Source SVG | Aucune anomalie ciblée détectée | `6b8f3a7e3080711e2e27bf94a3f4fb0df53b103f0cedb8ca2132b9f083ab594d` |
| `public/img/valentin-nb.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `a2f0f5095c9544821d906b192a3470550706d0bbd6d2386291735438f0316b8b` |
| `public/img/yves-nb.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `1d99cb47865c555bb8342f87423f3b1d20004792a3bf7ec0579d37516cdeeb1a` |
| `public/peak-pitch/pitch-hero-hd.mp4` | 44 images OCR | Aucune anomalie ciblée détectée | `3a8c7457b2e9b1f0dbc65c53b2452d3d047a8d0805c10476f7a433cca3edd614` |
| `public/peak-pitch/pitch-hero-poster.avif` | 1 images OCR | Aucune anomalie ciblée détectée | `896f79f7055a6e5a43c653937d0c9ce5b9ceb328411022dfd935e3c763805e35` |
| `public/peak-pitch/pitch-hero-poster.jpg` | 1 images OCR | Aucune anomalie ciblée détectée | `249357f6d3014a23b2e6527ad0cc03b97316060acb5b29fb5d5e1560817dd02c` |
| `public/peak-pitch/pitch-hero-poster.webp` | 1 images OCR | Aucune anomalie ciblée détectée | `b3e3e285e4cd780b39a399f929b133d240b8850c2652238e3434c17d828a8961` |
| `public/peak-pitch/pitch-hero-uhd.mp4` | 44 images OCR | Aucune anomalie ciblée détectée | `5e331a819a35ce1443c472cd2fb87e34f82679d83ba3ee8252277dca5b552325` |
