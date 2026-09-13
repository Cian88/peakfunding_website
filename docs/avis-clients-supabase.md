# Avis clients — activation du dépôt avec Supabase

État (2026-09-13) : le site est **branché sur Supabase** (projet `cuzermbffitfuoknrmca`,
constantes dans `src/data/integrations.ts`). La section d'accueil lit la vue `avis_publics`
en direct (îlot `MurAvis`) et affiche l'état « à venir » tant qu'aucun avis n'est publié.
Pages de dépôt sur invitation : `/avis/deposer` et `/en/avis/deposer`.
Ce document décrit la configuration côté Supabase et le flux d'invitation.

## 1. Ce que porte Supabase (le site reste statique)

| Besoin | Réponse |
|---|---|
| Identifier l'auteur | **Supabase Auth, fournisseur Google** → prénom, nom, photo, e-mail (jamais affiché) |
| Garantir un vrai client | **Lien d'invitation personnel** (jeton unique) envoyé après le déblocage des fonds |
| Stocker les avis | table `avis` avec statut de modération |
| Afficher publiquement | lecture anonyme **uniquement** des avis `publie` |

## 2. À faire côté compte (une seule fois)

1. Créer un projet sur <https://supabase.com> (région EU — Francfort ou Paris).
2. **Authentication → Providers → Google** : activer.
   - Dans Google Cloud Console : *APIs & Services → Credentials → OAuth client ID (Web)*.
   - Origine autorisée : `https://peakfunding.eu` ; URI de redirection : celle affichée par Supabase
     (`https://<projet>.supabase.co/auth/v1/callback`).
   - Coller *Client ID* / *Client secret* dans Supabase.
3. **Authentication → URL configuration** : Site URL `https://peakfunding.eu`,
   Redirect URLs `https://peakfunding.eu/**` (couvre `/avis/deposer` et `/en/avis/deposer`,
   ainsi que `http://localhost:4321/**` pour tester en local).
4. Exécuter le SQL du §3 dans **SQL Editor**.
5. Me transmettre **Project URL** et **anon public key** (Settings → API). La clé *anon* est
   publique par conception ; la sécurité repose sur les règles RLS ci-dessous.

## 3. Schéma SQL (à coller tel quel)

```sql
-- Types de projet, valeurs exactes utilisées par le site
create type type_projet as enum (
  'Résidence Principale', 'Appartement Locatif', 'Immeuble Locatif',
  'Immobilier Pro', 'Mobilier Pro', 'LBO/OBO', 'Restructuration de dette'
);

-- Invitations : un jeton par client, généré par le cabinet après déblocage
create table invitations (
  jeton        uuid primary key default gen_random_uuid(),
  email_client text not null,            -- pour votre suivi ; jamais affiché
  dossier      text,                     -- référence interne facultative
  cree_le      timestamptz not null default now(),
  expire_le    timestamptz not null default now() + interval '60 days',
  utilise_le   timestamptz               -- renseigné à la publication
);

-- Avis
create table avis (
  id           uuid primary key default gen_random_uuid(),
  jeton        uuid not null unique references invitations(jeton),
  auteur_uid   uuid not null references auth.users(id),
  prenom       text not null,
  initiale     text not null check (char_length(initiale) = 1),
  photo        text,                     -- URL avatar Google
  note         smallint not null check (note between 1 and 5),
  projet       type_projet not null,
  montant      integer not null check (montant > 0),   -- en euros
  ville        text not null,            -- ville seulement, jamais l'adresse
  lat          double precision,
  lng          double precision,
  texte        text not null check (char_length(texte) between 40 and 1200),
  statut       text not null default 'en_attente'
               check (statut in ('en_attente', 'publie', 'refuse')),
  cree_le      timestamptz not null default now(),
  publie_le    timestamptz
);

alter table invitations enable row level security;
alter table avis        enable row level security;

-- Lecture publique : uniquement les avis publiés, sans colonnes sensibles
create view avis_publics as
  select id, prenom, initiale, photo, note, projet, montant, ville, lat, lng,
         coalesce(publie_le, cree_le)::date as date, texte
  from avis where statut = 'publie';
grant select on avis_publics to anon, authenticated;

-- Vérification d'un jeton (security definer : lit `invitations` malgré le RLS,
-- et ne révèle que la validité — jamais l'e-mail)
create or replace function jeton_valide(j uuid) returns boolean
language sql security definer stable as $$
  select exists (select 1 from invitations where jeton = j and utilise_le is null and expire_le > now());
$$;
grant execute on function jeton_valide(uuid) to anon, authenticated;

-- Dépôt : un utilisateur connecté, avec un jeton valide et non utilisé.
-- Passe obligatoirement par jeton_valide() : une sous-requête directe sur
-- `invitations` verrait 0 ligne (RLS activé, aucune règle de lecture) et
-- refuserait tout dépôt.
create policy "depot_avec_invitation" on avis
  for insert to authenticated
  with check (auth.uid() = auteur_uid and jeton_valide(jeton));

-- Marquer l'invitation utilisée à l'insertion
create or replace function marquer_invitation() returns trigger
language plpgsql security definer as $$
begin
  update invitations set utilise_le = now() where jeton = new.jeton;
  return new;
end $$;
create trigger t_marquer_invitation after insert on avis
  for each row execute function marquer_invitation();
```

Modération : dans le tableau `avis` (Supabase Studio), passer `statut` de `en_attente` à `publie`
(ou `refuse`). Seuls les avis `publie` apparaissent sur le site.

## 4. Flux du lien d'invitation

1. Après déblocage des fonds, le cabinet insère une ligne dans `invitations`
   (Studio, ou bouton à ajouter au back-office) et envoie au client :
   `https://peakfunding.eu/avis/deposer?jeton=<uuid>`.
2. La page vérifie le jeton (`jeton_valide`), puis propose **Continuer avec Google**.
3. Une fois connecté, le formulaire (note 1–5, type de projet, montant, ville, texte) est
   pré-rempli avec prénom + initiale + photo issus du compte Google.
4. À l'envoi, l'avis est inséré `en_attente` ; l'invitation est marquée utilisée
   (un jeton = un avis). Vous validez, il rejoint le mur.

## 5. Ce que je coderai à l'activation

- `npm install @supabase/supabase-js` et variables `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`
  (secrets GitHub Actions + `.env` local).
- Un îlot React `AvisClients` qui lit `avis_publics` au chargement et alimente le mur existant
  (même rendu, même composant de carte) ; repli sur l'état « à venir » si aucun avis.
- Pages `/avis/deposer` et `/en/reviews/submit` : jeton → Google → formulaire → confirmation
  (reprise à l'identique de la maquette validée).
- Géocodage de la ville (Nominatim, côté navigateur, ville uniquement) pour placer le pin.

## 6. Points RGPD à conserver

- Affichage public limité à **prénom + initiale + photo Google + ville** ; e-mail et nom
  complet ne quittent jamais la base.
- Case de consentement explicite avant publication ; droit de retrait → passer `statut='refuse'`.
- Mentionner Supabase (sous-traitant, hébergement UE) dans la politique de confidentialité.
