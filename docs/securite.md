# Sécurité du site — règles de maintenance

## Politique de sécurité du contenu (CSP)

GitHub Pages ne permet pas d'envoyer d'en-têtes HTTP : la CSP est émise en `<meta>` par Astro
(`security.csp` dans `astro.config.mjs`). Astro y ajoute l'empreinte SHA-256 de chacun de ses
scripts et styles intégrés ; aucun script intégré n'est autorisé sans empreinte.

- **Toute nouvelle intégration tierce** (script, iframe, API appelée depuis le navigateur, police,
  image distante) doit être ajoutée à la directive correspondante, puis vérifiée dans un navigateur
  (événements `securitypolicyviolation`) avant fusion.
- Domaines autorisés aujourd'hui : Supabase (avis), Nominatim (géocodage des villes), avatars
  Google, Actelo (espace client, avec son suivi d'erreurs Sentry), Formspree (formulaires).
  Les liens sortants (Magnolia, Stancer, agendas Proton) ne sont pas concernés : ce sont des navigations.
- Limites d'une CSP en `<meta>` : `frame-ancestors` (protection contre l'intégration du site
  dans un cadre) et HSTS exigent de vrais en-têtes, donc un intermédiaire devant GitHub Pages.
- `tests/securite.test.mjs` vérifie la présence et la rigueur de la CSP sur chaque page.

## Sessions Supabase

Le client (`src/lib/supabase.ts`) garde la session en mémoire (`persistSession: false`) et
efface les anciennes sessions du stockage local : un script tiers chargé sur une autre page du
domaine ne peut pas la relire. Conséquence : une nouvelle connexion Google après rechargement
des pages `/avis/deposer` et `/avis/inviter`.

La sécurité des avis repose sur les règles RLS côté Supabase (`docs/avis-clients-supabase.md`).

## Chaîne de publication

- Actions GitHub figées par empreinte de commit (`deploy.yml`) ; pour les mettre à jour,
  remplacer l'empreinte par celle de la nouvelle version et garder le commentaire de version.
- Le relais PHP de l'Observatoire n'est pas publié sur GitHub Pages (il y serait servi en texte).
- Dépendances : `npm audit fix` sans `--force` ; les alertes restantes ne concernent que les
  outils de build et de développement (le site livré est statique).
