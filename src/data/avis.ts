/* Avis clients — modèle de données de la section « Mur vivant ».
   Le tableau est VIDE volontairement : aucun avis fictif ne doit être publié.
   En production, les avis viendront de Supabase (voir docs/avis-clients-supabase.md) ;
   ce module fixe la forme attendue et permet un rendu statique de transition. */

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

export type Avis = {
  id: string;
  /** Prénom affiché tel quel, nom réduit à son initiale (« Camille B. »). */
  prenom: string;
  initiale: string;
  /** URL de la photo du compte Google (absente → pastille avec l'initiale). */
  photo?: string;
  note: 1 | 2 | 3 | 4 | 5;
  projet: TypeProjet;
  /** Montant du prêt en euros. */
  montant: number;
  /** Ville du projet — jamais l'adresse exacte (RGPD). */
  ville: string;
  /** Position approximative de la ville pour la carte (facultatif). */
  lat?: number;
  lng?: number;
  /** Date de publication, ISO (AAAA-MM-JJ). */
  date: string;
  texte: string;
};

/** Vide tant que le dépôt d'avis (Supabase + lien d'invitation) n'est pas activé. */
export const avis: Avis[] = [];
