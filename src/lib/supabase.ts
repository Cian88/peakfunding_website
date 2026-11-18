/* Client Supabase, créé paresseusement côté navigateur uniquement (les îlots
   React sont aussi rendus côté serveur au build : on n'y touche pas là). */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../data/integrations';

let client: SupabaseClient | null = null;

/* La session de connexion reste en mémoire, jamais dans le stockage du navigateur :
   un script tiers chargé sur une autre page du domaine (espace client Actelo) ne
   peut donc pas la relire. Contrepartie : une nouvelle connexion Google après
   rechargement de la page. Le retour Google (flux implicite) est lu dans l'URL. */
const CLE_ANCIENNE_SESSION = /^sb-.*-auth-token/;

export function supabase(): SupabaseClient {
  if (!client) {
    try {
      for (const cle of Object.keys(localStorage)) if (CLE_ANCIENNE_SESSION.test(cle)) localStorage.removeItem(cle);
    } catch { /* stockage indisponible : rien à purger */ }
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
    });
  }
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
