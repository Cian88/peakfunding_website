import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { projetsLibelles } from './textes-avis';

/**
 * Page privée du cabinet : génère les invitations à déposer un avis (jeton + lien
 * + e-mail prêt à envoyer), suit leur état, et modère les avis en attente.
 * Accès : connexion Google + compte présent dans la table `administrateurs`
 * (règles RLS « admin_* », voir docs/avis-clients-supabase.md).
 */
type Etape = 'chargement' | 'auth' | 'refuse' | 'ok';
type Invitation = { jeton: string; email_client: string; dossier: string | null; cree_le: string; expire_le: string; utilise_le: string | null };
type AvisAttente = { id: string; prenom: string; initiale: string; note: number; projet: string; montant: number; ville: string; texte: string; cree_le: string };

const COURTIERS = ['Valentin Boura–Defranoux', 'Maxime Pidoux'];
const SITE = 'https://peakfunding.eu';

const modele = (lang: 'fr' | 'en', prenom: string, courtier: string, lien: string) => lang === 'fr'
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

const lienDe = (lang: 'fr' | 'en', jeton: string) => `${SITE}${lang === 'en' ? '/en' : ''}/avis/deposer?jeton=${jeton}`;
const dateFr = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const etatDe = (i: Invitation) => i.utilise_le ? 'utilisé' : new Date(i.expire_le) < new Date() ? 'expiré' : 'en attente';
const copier = async (txt: string) => { try { await navigator.clipboard.writeText(txt); return true; } catch { return false; } };

export default function InviterAvis() {
  const [etape, setEtape] = useState<Etape>('chargement');
  const [user, setUser] = useState<User | null>(null);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [dossier, setDossier] = useState('');
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
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

  const google = async () => { const c = await sb(); const { error } = await c.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}${location.pathname}` } }); if (error) setErreur('La connexion Google a échoué.'); };
  const deconnexion = async () => { (await sb()).auth.signOut(); setEtape('auth'); };

  const generer = async (e: React.FormEvent) => {
    e.preventDefault(); setErreur(''); setInfo('');
    if (!prenom.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErreur('Prénom et e-mail du client sont requis.'); return; }
    setEnvoi(true);
    const c = await sb();
    const expire_le = new Date(Date.now() + Math.max(1, jours) * 86400000).toISOString();
    const { data, error } = await c.from('invitations').insert({ email_client: email.trim(), dossier: dossier.trim() || null, expire_le }).select('jeton').single();
    setEnvoi(false);
    if (error || !data) { setErreur(`Création impossible — ${error?.code ?? ''} ${error?.message ?? ''}`); return; }
    const lien = lienDe(lang, data.jeton);
    const m = modele(lang, prenom.trim(), courtier, lien);
    setResultat({ lien, objet: m.objet, corps: m.corps, email: email.trim() });
    setPrenom(''); setEmail(''); setDossier('');
    charger();
  };

  const prolonger = async (j: string) => { const c = await sb(); await c.from('invitations').update({ expire_le: new Date(Date.now() + 60 * 86400000).toISOString() }).eq('jeton', j); charger(); };
  const annuler = async (j: string) => { if (!confirm('Annuler cette invitation ? Le lien ne fonctionnera plus.')) return; const c = await sb(); await c.from('invitations').update({ expire_le: new Date(Date.now() - 60000).toISOString() }).eq('jeton', j); charger(); };
  const moderer = async (id: string, statut: 'publie' | 'refuse') => { const c = await sb(); const { error } = await c.from('avis').update(statut === 'publie' ? { statut, publie_le: new Date().toISOString() } : { statut }).eq('id', id); if (error) setErreur(`Modération impossible — ${error.message}`); charger(); };
  const signaler = (ok: boolean, quoi: string) => setInfo(ok ? `${quoi} copié.` : 'Copie impossible : sélectionnez le texte et copiez-le manuellement.');

  if (etape === 'chargement') return <p className="corps">Chargement…</p>;
  if (etape === 'auth') return (
    <div className="depot">
      <p className="corps">Page réservée au cabinet. Connectez-vous avec le compte Google déclaré comme administrateur.</p>
      <button type="button" className="btn-google" onClick={google}>Continuer avec Google</button>
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  );
  if (etape === 'refuse') return (
    <div className="depot">
      <p className="corps">Le compte <b className="text-etoile">{user?.email}</b> n'est pas administrateur. Ajoutez-le dans la table <code>administrateurs</code> (Supabase) ou changez de compte.</p>
      <button type="button" className="btn-fantome" onClick={deconnexion}>Changer de compte</button>
    </div>
  );

  const libelles = projetsLibelles.fr as Record<string, string>;
  return (
    <div className="admin">
      <div className="compte">
        <span className="pastille">{(user?.email ?? '?').charAt(0).toUpperCase()}</span>
        <div className="min-w-0"><div className="text-[14px] font-medium text-etoile">Administrateur</div><div className="courriel font-mono text-[11px] text-argent">{user?.email}</div></div>
        <button type="button" className="action neutre ml-auto shrink-0" onClick={deconnexion}>Déconnexion</button>
      </div>

      <form className="depot" onSubmit={generer} noValidate>
        <h2 className="text-[22px] font-light text-etoile">Nouvelle invitation</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2"><span className="libelle">Prénom du client</span><input className="champ font-sans" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Camille" /></label>
          <label className="grid gap-2"><span className="libelle">E-mail du client <span className="font-normal text-argent">(suivi interne, jamais publié)</span></span><input className="champ font-sans" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@mail.fr" /></label>
          <label className="grid gap-2"><span className="libelle">Référence dossier <span className="font-normal text-argent">(optionnel)</span></span><input className="champ font-sans" value={dossier} onChange={(e) => setDossier(e.target.value)} placeholder="RP Lyon — Dupont" /></label>
          <label className="grid gap-2"><span className="libelle">Langue du client</span><select className="champ appearance-none" value={lang} onChange={(e) => setLang(e.target.value as 'fr' | 'en')}><option value="fr">Français</option><option value="en">English</option></select></label>
          <label className="grid gap-2"><span className="libelle">Courtier signataire</span><select className="champ appearance-none" value={courtier} onChange={(e) => setCourtier(e.target.value)}>{COURTIERS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="grid gap-2"><span className="libelle">Validité (jours)</span><input className="champ font-sans" type="number" min={1} max={365} value={jours} onChange={(e) => setJours(+e.target.value)} /></label>
        </div>
        {erreur && <p className="erreur">{erreur}</p>}
        <div className="flex justify-end"><button type="submit" className="btn-cuivre" disabled={envoi}>{envoi ? 'Création…' : 'Générer l’invitation'}</button></div>
      </form>

      {resultat && (
        <div className="depot" aria-live="polite">
          <h2 className="text-[22px] font-light text-etoile">Invitation prête</h2>
          <div className="grid gap-2"><span className="libelle">Lien à envoyer</span><div className="lien">{resultat.lien}</div>
            <div className="flex flex-wrap gap-2"><button type="button" className="btn-cuivre mini" onClick={async () => signaler(await copier(resultat.lien), 'Lien')}>Copier le lien</button></div></div>
          <div className="grid gap-2"><span className="libelle">Objet</span><div className="lien" style={{ color: 'var(--color-etoile)' }}>{resultat.objet}</div></div>
          <div className="grid gap-2"><span className="libelle">Corps de l’e-mail</span><pre>{resultat.corps}</pre></div>
          <div className="flex flex-wrap gap-2">
            <a className="btn-cuivre mini" href={`mailto:${encodeURIComponent(resultat.email)}?subject=${encodeURIComponent(resultat.objet)}&body=${encodeURIComponent(resultat.corps)}`}>Ouvrir dans ma messagerie</a>
            <button type="button" className="btn-fantome mini" onClick={async () => signaler(await copier(resultat.objet), 'Objet')}>Copier l’objet</button>
            <button type="button" className="btn-fantome mini" onClick={async () => signaler(await copier(resultat.corps), 'Corps')}>Copier le corps</button>
          </div>
          {info && <p className="font-mono text-[12px] text-cuivre-clair">{info}</p>}
        </div>
      )}

      <section className="depot">
        <h2 className="text-[22px] font-light text-etoile">Invitations récentes <span className="font-mono text-[12px] text-argent">({invitations.length})</span></h2>
        {invitations.length === 0 ? <p className="corps">Aucune invitation pour l’instant.</p> : (
          <div className="tableau"><table>
            <thead><tr><th>Client</th><th>Dossier</th><th>Créée</th><th>Expire</th><th>État</th><th></th></tr></thead>
            <tbody>{invitations.map((i) => { const etat = etatDe(i); return (
              <tr key={i.jeton}>
                <td data-label="Client">{i.email_client}</td><td data-label="Dossier" className="text-argent">{i.dossier ?? '—'}</td><td data-label="Créée" className="donnee">{dateFr(i.cree_le)}</td><td data-label="Expire" className="donnee">{dateFr(i.expire_le)}</td>
                <td data-label="État"><span className={`etat ${etat === 'utilisé' ? 'ok' : etat === 'en attente' ? 'attente' : ''}`}>{etat}</span></td>
                <td data-label="Actions"><div className="actions">{etat === 'en attente' && <>
                  <button type="button" className="action" onClick={async () => signaler(await copier(lienDe('fr', i.jeton)), 'Lien FR')}>Copier lien FR</button>
                  <button type="button" className="action" onClick={async () => signaler(await copier(lienDe('en', i.jeton)), 'Lien EN')}>Copier lien EN</button>
                  <button type="button" className="action neutre" onClick={() => annuler(i.jeton)}>Annuler</button></>}
                  {etat === 'expiré' && <button type="button" className="action" onClick={() => prolonger(i.jeton)}>Prolonger 60 j</button>}
                </div></td>
              </tr>); })}</tbody>
          </table></div>
        )}
      </section>

      <section className="depot">
        <h2 className="text-[22px] font-light text-etoile">Avis en attente de validation <span className="font-mono text-[12px] text-argent">({attente.length})</span></h2>
        {attente.length === 0 ? <p className="corps">Aucun avis à modérer.</p> : attente.map((a) => (
          <article key={a.id} className="grid gap-3 rounded-donnee border border-filet bg-abime p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[15px] font-medium text-etoile">{a.prenom} {a.initiale}. <span className="font-mono text-[12px] text-cuivre-clair">{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span></span>
              <span className="font-mono text-[11px] text-argent">{libelles[a.projet] ?? a.projet} · {a.montant.toLocaleString('fr-FR')} € · {a.ville} · {dateFr(a.cree_le)}</span>
            </div>
            <p className="corps text-[14px]">{a.texte}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-cuivre mini" onClick={() => moderer(a.id, 'publie')}>Publier</button>
              <button type="button" className="btn-fantome mini" onClick={() => moderer(a.id, 'refuse')}>Refuser</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
