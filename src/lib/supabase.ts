/* Client Supabase, créé paresseusement côté navigateur uniquement (les îlots
   React sont aussi rendus côté serveur au build : on n'y touche pas là). */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../data/integrations';

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

/** Ligne de la vue publique `avis_publics`. */
export type AvisPublic = {
  id: string;
  prenom: string;
  initiale: string;
  photo: string | null;
  note: number;
  projet: string;
  montant: number;
  ville: string;
  lat: number | null;
  lng: number | null;
  date: string;
  texte: string;
};

export async function chargerAvisPublics(): Promise<AvisPublic[]> {
  const { data, error } = await supabase().from('avis_publics').select('*').order('date', { ascending: false }).limit(60);
  if (error) throw error;
  return (data ?? []) as AvisPublic[];
}
