/* Avis clients — types partagés. Les données vivent dans Supabase
   (vue `avis_publics`, voir docs/avis-clients-supabase.md) ; aucun avis
   n'est stocké dans le code source. */

export const typesProjet = [
  'Résidence Principale',
  'Appartement Locatif',
  'Immeuble Locatif',
  'Immobilier Pro',
  'Mobilier Pro',
  'LBO/OBO',
  'Restructuration de dette',
] as const;
export type TypeProjet = (typeof typesProjet)[number];
