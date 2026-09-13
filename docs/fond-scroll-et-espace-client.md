# Correction du fond et largeur Actelo

Cible : demande explicite utilisateur. Le raccord en dégradé du précédent lot
ne correspondait pas à la transition attendue. Il est remplacé par un fond uni
commun aux sections de l'accueil, dont la couleur est interpolée selon le scroll.

Direction Altitude/Mercury conservée : #0b0d12 ↔ #f2f0eb, pas de nouvelle palette,
pas de filtre sur les photos. Référence craft Refero couleur : contraste des textes
à chaque étape, surfaces des composants isolées. La demande utilisateur prime sur
les anciens raccords décoratifs. Le héros et les panneaux de formulaire restent
dans leur registre initial ; le menu mobile conserve son flou demandé précédemment.

| Choix | Raison |
|---|---|
| Fond uni partagé | Aucune bande floue ni dégradé entre sections |
| Couleur pilotée par la position | Effet réellement réversible au scroll, pas d'animation autonome |
| Contraste recalculé | Titres, corps et accents lisibles pendant les couleurs intermédiaires |
| Cartes isolées | Ne pas recolorer formulaire, images, schémas ou cartes partenaires |
| Actelo sur une largeur maximale de 1840 px | Utiliser davantage les grands écrans, avec marges fluides |

Sans JavaScript, en mode statique ou avec mouvement réduit, les fonds de sections
originaux sont conservés. Script, conteneur et URL Actelo inchangés.

## Vérification

- À scrollY=746 : fond uni rgb(76,77,79) ; à scrollY=916 : rgb(240,238,233).
  Retour à 746 : même rgb(76,77,79). Pseudo-élément de raccord : absent.
- Les tests couvrent 1 001 valeurs de palette (contraste texte/corps/accent ≥4,5),
  la continuité et la réversibilité de la progression sur 3 000 positions.
- Capture grand écran 1934 × 1272 : cadre Actelo 1685 px, contre environ 1136 px
  auparavant ; conteneur externe 1840 px. Contrôle mobile sans débordement horizontal.
- Le simulateur conserve son fond de panneau rgb(20,23,30) et ses couleurs propres.
- Build de 19 pages ; 16 tests, sources protégées et images inchangées.
- Contrôles dimensionnels en iframe locale temporaire, retirée avant le build final.
  Aucun envoi de formulaire, accès à un dossier privé ni déploiement.
