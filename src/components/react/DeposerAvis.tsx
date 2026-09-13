import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Lang } from '../../i18n';
import { typesProjet } from '../../data/avis';
import { depotTextes, projetsLibelles } from './textes-avis';

/**
 * Page de dépôt d'un avis, sur invitation :
 *   jeton (?jeton=uuid) vérifié via la fonction SQL `jeton_valide`
 *   → connexion Google (Supabase Auth) → formulaire → insertion `avis` (statut en_attente).
 * Les règles RLS garantissent : un utilisateur connecté, un jeton valide, un seul avis par jeton.
 */
const ETOILE = 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z';
type Etape = 'verif' | 'absent' | 'invalide' | 'auth' | 'form' | 'succes';

const nomsDepuis = (u: User) => {
  const complet = String(u.user_metadata?.full_name || u.user_metadata?.name || '').trim();
  const parts = complet.split(/\s+/).filter(Boolean);
  return { prenom: parts[0] || '', initiale: (parts.length > 1 ? parts[parts.length - 1] : '').charAt(0).toUpperCase(), photo: String(u.user_metadata?.avatar_url || u.user_metadata?.picture || '') || null };
};

async function geocoder(ville: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fr&q=${encodeURIComponent(ville)}`, { headers: { Accept: 'application/json' } });
    const j = (await r.json()) as { lat: string; lon: string }[];
    return j[0] ? { lat: +j[0].lat, lng: +j[0].lon } : null;
  } catch { return null; }
}

export default function DeposerAvis({ lang = 'fr', accueilHref }: { lang?: Lang; accueilHref: string }) {
  const T = depotTextes(lang);
  const [etape, setEtape] = useState<Etape>('verif');
  const [jeton, setJeton] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState(0);
  const [survol, setSurvol] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [initiale, setInitiale] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [projet, setProjet] = useState<string>(typesProjet[0]);
  const [montant, setMontant] = useState('');
  const [ville, setVille] = useState('');
  const [texte, setTexte] = useState('');
  const [consent, setConsent] = useState(false);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    let actif = true;
    (async () => {
      const j = new URLSearchParams(location.search).get('jeton') || '';
      if (!j) { setEtape('absent'); return; }
      setJeton(j);
      const { supabase } = await import('../../lib/supabase');
      const sb = supabase();
      const { data: valide, error } = await sb.rpc('jeton_valide', { j });
      if (!actif) return;
      if (error || !valide) { setEtape('invalide'); return; }
      const appliquer = (u: User | null) => {
        setUser(u);
        if (u) { const n = nomsDepuis(u); setPrenom(n.prenom); setInitiale(n.initiale); setPhoto(n.photo); setEtape('form'); }
        else setEtape('auth');
      };
      const { data: { session } } = await sb.auth.getSession();
      if (actif) appliquer(session?.user ?? null);
      const { data: sub } = sb.auth.onAuthStateChange((_e, s) => { if (actif) appliquer(s?.user ?? null); });
      return () => sub.subscription.unsubscribe();
    })();
    return () => { actif = false; };
  }, []);

  const google = async () => {
    setErreur('');
    const { supabase } = await import('../../lib/supabase');
    const redirectTo = `${location.origin}${location.pathname}?jeton=${encodeURIComponent(jeton)}`;
    const { error } = await supabase().auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) setErreur(T.auth_erreur);
  };
  const changerCompte = async () => { const { supabase } = await import('../../lib/supabase'); await supabase().auth.signOut(); setEtape('auth'); };

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = Number(montant.replace(/\D/g, ''));
    if (!user || note < 1 || !m || !ville.trim() || texte.trim().length < 40 || !consent || !prenom.trim()) { setErreur(T.err_champs); return; }
    setErreur(''); setEnvoi(true);
    const pos = await geocoder(ville.trim());
    const { supabase } = await import('../../lib/supabase');
    const { error } = await supabase().from('avis').insert({
      jeton, auteur_uid: user.id, prenom: prenom.trim(), initiale: (initiale || prenom).charAt(0).toUpperCase(), photo,
      note, projet, montant: m, ville: ville.trim(), lat: pos?.lat ?? null, lng: pos?.lng ?? null, texte: texte.trim(),
    });
    setEnvoi(false);
    if (error) { setErreur(`${T.err_envoi} — ${[error.code, error.message].filter(Boolean).join(' · ')}`); return; }
    setEtape('succes');
  };

  const message = (txt: string) => <p className="corps text-[15px]">{txt}</p>;
  if (etape === 'verif') return message(T.verif_jeton);
  if (etape === 'absent') return message(T.jeton_absent);
  if (etape === 'invalide') return message(T.jeton_invalide);

  if (etape === 'succes') return (
    <div className="depot"><div className="succes">
      <div className="rond"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 12l5 5L20 6" /></svg></div>
      <h2 className="text-[24px] font-light text-etoile">{T.succes_titre}</h2>
      <p className="corps max-w-md">{T.succes_texte}</p>
      <a href={accueilHref} className="btn-cuivre mt-2">{T.retour}</a>
    </div></div>
  );

  const tete = (eyebrow: string, titre: string, sur: 1 | 2) => (
    <div className="grid gap-3">
      <div className="etape-tete"><span className="eyebrow">{eyebrow}</span></div>
      <div className="progression" aria-hidden="true"><span className="on" /><span className={sur === 2 ? 'on' : ''} /></div>
      <h2 className="mt-2 text-[26px] leading-tight font-light text-etoile">{titre}</h2>
    </div>
  );

  if (etape === 'auth') return (
    <div className="depot">
      {tete(T.etape_auth, T.auth_titre, 1)}
      <p className="corps text-[14.5px]">{T.auth_texte}</p>
      <button type="button" className="btn-google" onClick={google}>
        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z"/></svg>
        {T.auth_bouton}
      </button>
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  );

  const libelles = projetsLibelles[lang] as Record<string, string>;
  const affiche = survol || note;
  return (
    <form className="depot" onSubmit={envoyer} noValidate>
      {tete(T.etape_form, T.form_titre, 2)}
      <div className="compte">
        {photo ? <img src={photo} alt="" referrerPolicy="no-referrer" /> : <span className="pastille">{prenom.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0"><div className="text-[14px] font-medium text-etoile">{prenom} {initiale && `${initiale}.`}</div><div className="font-mono text-[11px] text-argent">Google · {T.connecte}</div></div>
        <button type="button" className="ml-auto font-mono text-[11px] text-cuivre-clair underline underline-offset-4" onClick={changerCompte}>{T.changer}</button>
      </div>

      <div className="grid gap-2">
        <span className="libelle">{T.l_note}</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="etoiles-saisie" role="radiogroup" aria-label={T.l_note} onMouseLeave={() => setSurvol(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" role="radio" aria-checked={note === i} aria-label={`${i}/5`} className={i <= affiche ? 'on' : ''} onMouseEnter={() => setSurvol(i)} onClick={() => setNote(i)}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d={ETOILE} /></svg>
              </button>
            ))}
          </div>
          <span className="font-mono text-[12px] text-argent">{note ? <><b className="text-cuivre-clair">{note}/5</b> · {T.notes[note]}</> : T.note_vide}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2"><span className="libelle">{T.l_prenom}</span><input className="champ font-sans" value={prenom} onChange={(e) => setPrenom(e.target.value)} /></label>
        <label className="grid gap-2"><span className="libelle">{T.l_projet}</span>
          <select className="champ appearance-none" value={projet} onChange={(e) => setProjet(e.target.value)}>{typesProjet.map((p) => <option key={p} value={p}>{libelles[p]}</option>)}</select>
        </label>
        <label className="grid gap-2"><span className="libelle">{T.l_montant}</span>
          <span className="relative"><input className="champ pr-10 font-sans" inputMode="numeric" placeholder={T.ph_montant} value={montant} onChange={(e) => setMontant(e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€</span></span>
        </label>
        <label className="grid gap-2"><span className="libelle">{T.l_ville} <span className="font-normal text-argent">{T.note_ville}</span></span><input className="champ font-sans" placeholder={T.ph_ville} value={ville} onChange={(e) => setVille(e.target.value)} /></label>
      </div>

      <label className="grid gap-2"><span className="libelle">{T.l_texte}</span>
        <textarea className="champ h-32 py-3 font-sans" placeholder={T.ph_texte} maxLength={1200} value={texte} onChange={(e) => setTexte(e.target.value)} />
        <span className="font-mono text-[11px] text-argent">{texte.trim().length} {T.compteur}</span>
      </label>

      <label className="flex items-start gap-3 rounded-donnee border border-filet bg-abime px-4 py-3">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[#b87b4f]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span className="text-[13px] leading-relaxed text-argent">{T.consent}</span>
      </label>

      {erreur && <p className="erreur">{erreur}</p>}
      <div className="flex justify-end"><button type="submit" className="btn-cuivre" disabled={envoi}>{envoi ? T.envoi : T.envoyer}</button></div>
    </form>
  );
}
