# IndexNow

IndexNow prévient immédiatement Bing (et Yandex, Seznam, Naver) qu'une page est nouvelle ou modifiée. L'index de Bing alimente la recherche de ChatGPT et de Copilot : c'est le moyen le plus rapide d'y faire apparaître une page.

- Clé : `cb099be1da4dbcd43da885ad30aa0fe4`, servie par `public/cb099be1da4dbcd43da885ad30aa0fe4.txt` (https://peakfunding.eu/cb099be1da4dbcd43da885ad30aa0fe4.txt). Ne pas la supprimer ni la renommer ; le test `tests/indexnow.test.mjs` vérifie qu'elle correspond au script.
- Envoi complet, **après** une mise en ligne : `npm run build && npm run indexnow`. Cela envoie les URL des sitemaps et `llms.txt`.
- Envoi ciblé après une modification : `npm run indexnow -- /expertises/assurance/ /en/expertises/assurance/`. Sous Git Bash, préfixer avec `MSYS_NO_PATHCONV=1`, sinon les chemins sont convertis en chemins Windows.
- Essai sans envoi : ajouter `--essai`.
- Réponses : 200 ou 202 = reçu ; 403 = clé introuvable en ligne (pas encore déployée) ; 422 = URL hors du domaine.

Ne pas renvoyer tout le site à chaque reconstruction quotidienne : IndexNow sert aux changements réels. Bing Webmaster Tools affiche les envois reçus (Paramètres → IndexNow).
