import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Lang } from '../../i18n';
import { projetsLibelles } from './textes-avis';

/**
 * Page privée du cabinet : génère les invitations à déposer un avis (jeton + lien
 * + e-mail prêt à envoyer), suit leur état, et modère les avis en attente.
 * Accès : connexion Google + compte présent dans la table `administrateurs`
 * (règles RLS « admin_* », voir docs/avis-clients-supabase.md).
 * Interface FR ou EN selon la page ; l'e-mail généré suit la langue du client.
 */
type Etape = 'chargement' | 'auth' | 'refuse' | 'ok';
type Invitation = { jeton: string; email_client: string; dossier: string | null; cree_le: string; expire_le: string; utilise_le: string | null };
type AvisAttente = { id: string; prenom: string; initiale: string; note: number; projet: string; montant: number; ville: string; texte: string; cree_le: string };

const COURTIERS = ['Valentin Boura–Defranoux', 'Maxime Pidoux'];
const SITE = 'https://peakfunding.eu';

const UI = {
  fr: {
    chargement: 'Chargement…',
    reserve: 'Page réservée au cabinet. Connectez-vous avec le compte Google déclaré comme administrateur.',
    google: 'Continuer avec Google', auth_erreur: 'La connexion Google a échoué.',
    refuse: (e: string) => `Le compte ${e} n’est pas administrateur. Ajoutez-le dans la table administrateurs (Supabase) ou changez de compte.`,
    changer: 'Changer de compte', admin: 'Administrateur', deconnexion: 'Déconnexion',
    nouvelle: 'Nouvelle invitation', l_prenom: 'Prénom du client', l_email: 'E-mail du client', n_email: '(suivi interne, jamais publié)',
    l_dossier: 'Référence dossier', n_dossier: '(optionnel)', ph_dossier: 'RP Lyon — Dupont', l_langue: 'Langue du client', l_courtier: 'Courtier signataire', l_validite: 'Validité (jours)',
    err_champs: 'Prénom et e-mail du client sont requis.', creation: 'Création…', generer: 'Générer l’invitation', err_creation: 'Création impossible',
    prete: 'Invitation prête', l_lien: 'Lien à envoyer', copier_lien: 'Copier le lien', l_objet: 'Objet', l_corps: 'Corps de l’e-mail',
    ouvrir: 'Ouvrir dans ma messagerie', copier_objet: 'Copier l’objet', copier_corps: 'Copier le corps',
    copie: (q: string) => `${q} copié.`, copie_impossible: 'Copie impossible : sélectionnez le texte et copiez-le manuellement.', q_lien: 'Lien', q_objet: 'Objet', q_corps: 'Corps',
    recentes: 'Invitations récentes', aucune_inv: 'Aucune invitation pour l’instant.',
    th: ['Client', 'Dossier', 'Créée', 'Expire', 'État', 'Actions'], etats: { utilise: 'utilisé', expire: 'expiré', attente: 'en attente' },
    lien_fr: 'Copier lien FR', lien_en: 'Copier lien EN', annuler: 'Annuler', prolonger: 'Prolonger 60 j',
    confirm_annuler: 'Annuler cette invitation ? Le lien ne fonctionnera plus.',
    attente: 'Avis en attente de validation', aucun_avis: 'Aucun avis à modérer.', publier: 'Publier', refuser: 'Refuser', err_moderation: 'Modération impossible',
    locale: 'fr-FR',
  },
  en: {
    chargement: 'Loading…',
    reserve: 'Reserved for the firm. Sign in with the Google account registered as an administrator.',
    google: 'Continue with Google', auth_erreur: 'Google sign-in failed.',
    refuse: (e: string) => `The account ${e} is not an administrator. Add it to the administrateurs table (Supabase) or switch account.`,
    changer: 'Switch account', admin: 'Administrator', deconnexion: 'Sign out',
    nouvelle: 'New invitation', l_prenom: 'Client first name', l_email: 'Client e-mail', n_email: '(internal tracking, never published)',
    l_dossier: 'File reference', n_dossier: '(optional)', ph_dossier: 'Primary residence Lyon — Dupont', l_langue: 'Client language', l_courtier: 'Signing broker', l_validite: 'Validity (days)',
    err_champs: 'Client first name and e-mail are required.', creation: 'Creating…', generer: 'Generate invitation', err_creation: 'Could not create',
    prete: 'Invitation ready', l_lien: 'Link to send', copier_lien: 'Copy link', l_objet: 'Subject', l_corps: 'E-mail body',
    ouvrir: 'Open in my e-mail app', copier_objet: 'Copy subject', copier_corps: 'Copy body',
    copie: (q: string) => `${q} copied.`, copie_impossible: 'Copy failed: select the text and copy it manually.', q_lien: 'Link', q_objet: 'Subject', q_corps: 'Body',
    recentes: 'Recent invitations', aucune_inv: 'No invitations yet.',
    th: ['Client', 'File', 'Created', 'Expires', 'Status', 'Actions'], etats: { utilise: 'used', expire: 'expired', attente: 'pending' },
    lien_fr: 'Copy FR link', lien_en: 'Copy EN link', annuler: 'Cancel', prolonger: 'Extend 60 days',
    confirm_annuler: 'Cancel this invitation? The link will stop working.',
    attente: 'Reviews awaiting validation', aucun_avis: 'No reviews to moderate.', publier: 'Publish', refuser: 'Reject', err_moderation: 'Moderation failed',
    locale: 'en-GB',
  },
} as const;

const modele = (lang: Lang, prenom: string, courtier: string, lien: string) => lang === 'fr'
  ? {
      objet: 'Votre avis sur votre financement — 2 minutes, sur invitation',
      corps: `Bonjour ${prenom},

Vos fonds sont débloqués : félicitations pour cette étape, et merci de votre confiance tout au long du dossier.

Si vous en avez le temps, votre retour nous serait précieux. Il aide les futurs clients à se faire une idée juste de notre accompagnement, et il nous aide à progresser.

Déposer mon avis : ${lien}

Concrètement :
- Le lien est personnel et valable 60 jours. Il ne peut servir qu'une fois.
- Vous vous identifiez avec votre compte Google : c'est ce qui garantit que chaque avis publié est authentique.
- Seuls votre prénom, l'initiale de votre nom et la photo de votre compte apparaissent, avec le type de projet, le montant financé et la ville. Votre adresse e-mail et votre nom complet ne sont jamais publiés.
- Votre avis est relu avant mise en ligne, et vous pouvez en demander le retrait à tout moment.

Un mot sincère, positif ou critique, vaut mieux qu'un long texte. Et si vous préférez ne pas laisser d'avis, cela ne change rien à notre relation.

Bien à vous,

${courtier}
PEAK FUNDING — Courtage en financement
ORIAS n° 24002546 · peakfunding.eu`,
    }
  : {
      objet: 'Your feedback on your financing — 2 minutes, by invitation',
      corps: `Hello ${prenom},

Your funds have been released — congratulations on this milestone, and thank you for your trust throughout the process.

If you have a moment, your feedback would mean a lot. It helps future clients get an accurate picture of how we work, and it helps us improve.

Leave my review: ${lien}

In practice:
- The link is personal, valid for 60 days, and can only be used once.
- You sign in with your Google account: this is what guarantees that every published review is genuine.
- Only your first name, the initial of your last name and your account photo appear, along with the project type, the amount financed and the city. Your e-mail address and full name are never published.
- Your review is checked before going live, and you can ask for it to be removed at any time.

A few sincere words, positive or critical, are worth more than a long text. And if you would rather not leave a review, it changes nothing between us.

Kind regards,

${courtier}
PEAK FUNDING — Financing brokerage
ORIAS no. 24002546 · peakfunding.eu`,
    };

const lienDe = (lang: Lang, jeton: string) => `${SITE}${lang === 'en' ? '/en' : ''}/avis/deposer?jeton=${jeton}`;
const copier = async (txt: string) => { try { await navigator.clipboard.writeText(txt); return true; } catch { return false; } };

export default function InviterAvis({ lang = 'fr' }: { lang?: Lang }) {
  const T = UI[lang];
  const dateLoc = (iso: string) => new Date(iso).toLocaleDateString(T.locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const montantLoc = (n: number) => lang === 'fr' ? `${n.toLocaleString('fr-FR')} €` : `€${n.toLocaleString('en-GB')}`;
  const etatDe = (i: Invitation): 'utilise' | 'expire' | 'attente' => i.utilise_le ? 'utilise' : new Date(i.expire_le) < new Date() ? 'expire' : 'attente';

  const [etape, setEtape] = useState<Etape>('chargement');
  const [user, setUser] = useState<User | null>(null);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [dossier, setDossier] = useState('');
  const [langueClient, setLangueClient] = useState<Lang>(lang);
  const [courtier, setCourtier] = useState(COURTIERS[0]);
  const [jours, setJours] = useState(60);
  const [envoi, setEnvoi] = useState(false);
  const [resultat, setResultat] = useState<{ lien: string; objet: string; corps: string; email: string } | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [attente, setAttente] = useState<AvisAttente[]>([]);

  const sb = async () => (await import('../../lib/supabase')).supabase();

  const charger = async () => {
    const c = await sb();
    const [{ data: inv }, { data: av }] = await Promise.all([
      c.from('invitations').select('jeton,email_client,dossier,cree_le,expire_le,utilise_le').order('cree_le', { ascending: false }).limit(50),
      c.from('avis').select('id,prenom,initiale,note,projet,montant,ville,texte,cree_le').eq('statut', 'en_attente').order('cree_le', { ascending: true }),
    ]);
    setInvitations((inv ?? []) as Invitation[]); setAttente((av ?? []) as AvisAttente[]);
  };

  useEffect(() => {
    let actif = true;
    (async () => {
      const c = await sb();
      const appliquer = async (u: User | null) => {
        if (!actif) return;
        setUser(u);
        if (!u) { setEtape('auth'); return; }
        const { data: admin } = await c.rpc('est_administrateur');
        if (!actif) return;
        if (!admin) { setEtape('refuse'); return; }
        setEtape('ok'); charger();
      };
      const { data: { session } } = await c.auth.getSession();
      await appliquer(session?.user ?? null);
      const { data: sub } = c.auth.onAuthStateChange((_e, s) => { appliquer(s?.user ?? null); });
      return () => sub.subscription.unsubscribe();
    })();
    return () => { actif = false; };
  }, []);

  const google = async () => { const c = await sb(); const { error } = await c.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}${location.pathname}` } }); if (error) setErreur(T.auth_erreur); };
  const deconnexion = async () => { (await sb()).auth.signOut(); setEtape('auth'); };

  const generer = async (e: React.FormEvent) => {
    e.preventDefault(); setErreur(''); setInfo('');
    if (!prenom.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErreur(T.err_champs); return; }
    setEnvoi(true);
    const c = await sb();
    const expire_le = new Date(Date.now() + Math.max(1, jours) * 86400000).toISOString();
    const { data, error } = await c.from('invitations').insert({ email_client: email.trim(), dossier: dossier.trim() || null, expire_le }).select('jeton').single();
    setEnvoi(false);
    if (error || !data) { setErreur(`${T.err_creation} — ${error?.code ?? ''} ${error?.message ?? ''}`); return; }
    const lien = lienDe(langueClient, data.jeton);
    const m = modele(langueClient, prenom.trim(), courtier, lien);
    setResultat({ lien, objet: m.objet, corps: m.corps, email: email.trim() });
    setPrenom(''); setEmail(''); setDossier('');
    charger();
  };

  const prolonger = async (j: string) => { const c = await sb(); await c.from('invitations').update({ expire_le: new Date(Date.now() + 60 * 86400000).toISOString() }).eq('jeton', j); charger(); };
  const annuler = async (j: string) => { if (!confirm(T.confirm_annuler)) return; const c = await sb(); await c.from('invitations').update({ expire_le: new Date(Date.now() - 60000).toISOString() }).eq('jeton', j); charger(); };
  const moderer = async (id: string, statut: 'publie' | 'refuse') => { const c = await sb(); const { error } = await c.from('avis').update(statut === 'publie' ? { statut, publie_le: new Date().toISOString() } : { statut }).eq('id', id); if (error) setErreur(`${T.err_moderation} — ${error.message}`); charger(); };
  const signaler = (ok: boolean, quoi: string) => setInfo(ok ? T.copie(quoi) : T.copie_impossible);

  if (etape === 'chargement') return <p className="corps">{T.chargement}</p>;
  if (etape === 'auth') return (
    <div className="depot">
      <p className="corps">{T.reserve}</p>
      <button type="button" className="btn-google" onClick={google}>{T.google}</button>
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  );
  if (etape === 'refuse') return (
    <div className="depot">
      <p className="corps">{T.refuse(user?.email ?? '?')}</p>
      <button type="button" className="btn-fantome" onClick={deconnexion}>{T.changer}</button>
    </div>
  );

  const libelles = projetsLibelles[lang] as Record<string, string>;
  return (
    <div className="admin">
      <div className="compte">
        <span className="pastille">{(user?.email ?? '?').charAt(0).toUpperCase()}</span>
        <div className="min-w-0"><div className="text-[14px] font-medium text-etoile">{T.admin}</div><div className="courriel font-mono text-[11px] text-argent">{user?.email}</div></div>
        <button type="button" className="action neutre ml-auto shrink-0" onClick={deconnexion}>{T.deconnexion}</button>
      </div>

      <form className="depot" onSubmit={generer} noValidate>
        <h2 className="text-[22px] font-light text-etoile">{T.nouvelle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2"><span className="libelle">{T.l_prenom}</span><input className="champ font-sans" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Camille" /></label>
          <label className="grid gap-2"><span className="libelle">{T.l_email} <span className="font-normal text-argent">{T.n_email}</span></span><input className="champ font-sans" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@mail.fr" /></label>
          <label className="grid gap-2"><span className="libelle">{T.l_dossier} <span className="font-normal text-argent">{T.n_dossier}</span></span><input className="champ font-sans" value={dossier} onChange={(e) => setDossier(e.target.value)} placeholder={T.ph_dossier} /></label>
          <label className="grid gap-2"><span className="libelle">{T.l_langue}</span><select className="champ appearance-none" value={langueClient} onChange={(e) => setLangueClient(e.target.value as Lang)}><option value="fr">Français</option><option value="en">English</option></select></label>
          <label className="grid gap-2"><span className="libelle">{T.l_courtier}</span><select className="champ appearance-none" value={courtier} onChange={(e) => setCourtier(e.target.value)}>{COURTIERS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="grid gap-2"><span className="libelle">{T.l_validite}</span><input className="champ font-sans" type="number" min={1} max={365} value={jours} onChange={(e) => setJours(+e.target.value)} /></label>
        </div>
        {erreur && <p className="erreur">{erreur}</p>}
        <div className="flex justify-end"><button type="submit" className="btn-cuivre" disabled={envoi}>{envoi ? T.creation : T.generer}</button></div>
      </form>

      {resultat && (
        <div className="depot" aria-live="polite">
          <h2 className="text-[22px] font-light text-etoile">{T.prete}</h2>
          <div className="grid gap-2"><span className="libelle">{T.l_lien}</span><div className="lien">{resultat.lien}</div>
            <div className="flex flex-wrap gap-2"><button type="button" className="btn-cuivre mini" onClick={async () => signaler(await copier(resultat.lien), T.q_lien)}>{T.copier_lien}</button></div></div>
          <div className="grid gap-2"><span className="libelle">{T.l_objet}</span><div className="lien" style={{ color: 'var(--color-etoile)' }}>{resultat.objet}</div></div>
          <div className="grid gap-2"><span className="libelle">{T.l_corps}</span><pre>{resultat.corps}</pre></div>
          <div className="flex flex-wrap gap-2">
            <a className="btn-cuivre mini" href={`mailto:${encodeURIComponent(resultat.email)}?subject=${encodeURIComponent(resultat.objet)}&body=${encodeURIComponent(resultat.corps)}`}>{T.ouvrir}</a>
            <button type="button" className="btn-fantome mini" onClick={async () => signaler(await copier(resultat.objet), T.q_objet)}>{T.copier_objet}</button>
            <button type="button" className="btn-fantome mini" onClick={async () => signaler(await copier(resultat.corps), T.q_corps)}>{T.copier_corps}</button>
          </div>
          {info && <p className="font-mono text-[12px] text-cuivre-clair">{info}</p>}
        </div>
      )}

      <section className="depot">
        <h2 className="text-[22px] font-light text-etoile">{T.recentes} <span className="font-mono text-[12px] text-argent">({invitations.length})</span></h2>
        {invitations.length === 0 ? <p className="corps">{T.aucune_inv}</p> : (
          <div className="tableau"><table>
            <thead><tr>{T.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{invitations.map((i) => { const etat = etatDe(i); return (
              <tr key={i.jeton}>
                <td data-label={T.th[0]}>{i.email_client}</td><td data-label={T.th[1]} className="text-argent">{i.dossier ?? '—'}</td><td data-label={T.th[2]} className="donnee">{dateLoc(i.cree_le)}</td><td data-label={T.th[3]} className="donnee">{dateLoc(i.expire_le)}</td>
                <td data-label={T.th[4]}><span className={`etat ${etat === 'utilise' ? 'ok' : etat === 'attente' ? 'attente' : ''}`}>{T.etats[etat]}</span></td>
                <td data-label={T.th[5]}><div className="actions">{etat === 'attente' && <>
                  <button type="button" className="action" onClick={async () => signaler(await copier(lienDe('fr', i.jeton)), `${T.q_lien} FR`)}>{T.lien_fr}</button>
                  <button type="button" className="action" onClick={async () => signaler(await copier(lienDe('en', i.jeton)), `${T.q_lien} EN`)}>{T.lien_en}</button>
                  <button type="button" className="action neutre" onClick={() => annuler(i.jeton)}>{T.annuler}</button></>}
                  {etat === 'expire' && <button type="button" className="action" onClick={() => prolonger(i.jeton)}>{T.prolonger}</button>}
                </div></td>
              </tr>); })}</tbody>
          </table></div>
        )}
      </section>

      <section className="depot">
        <h2 className="text-[22px] font-light text-etoile">{T.attente} <span className="font-mono text-[12px] text-argent">({attente.length})</span></h2>
        {attente.length === 0 ? <p className="corps">{T.aucun_avis}</p> : attente.map((a) => (
          <article key={a.id} className="grid gap-3 rounded-donnee border border-filet bg-abime p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[15px] font-medium text-etoile">{a.prenom} {a.initiale}. <span className="font-mono text-[12px] text-cuivre-clair">{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span></span>
              <span className="font-mono text-[11px] text-argent">{libelles[a.projet] ?? a.projet} · {montantLoc(a.montant)} · {a.ville} · {dateLoc(a.cree_le)}</span>
            </div>
            <p className="corps text-[14px]">{a.texte}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-cuivre mini" onClick={() => moderer(a.id, 'publie')}>{T.publier}</button>
              <button type="button" className="btn-fantome mini" onClick={() => moderer(a.id, 'refuse')}>{T.refuser}</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
