import { useEffect, useState } from 'react';

/**
 * Parcours de prise de rendez-vous — architecture STRICTEMENT identique à la v1 :
 *   étape 1 (identité) → étape 2 (projet, consentement) → envoi JSON à Formspree
 *   (point de terminaison selon le courtier souhaité, repli mailto si l'envoi échoue)
 *   → étape 3 : choix du courtier et ouverture de son agenda Proton.
 * Champs, options, validations, libellés d'erreur et charge utile repris tels quels.
 */
const ENDPOINTS = { valentin: 'https://formspree.io/f/mykrggwk', maxime: 'https://formspree.io/f/xkjnbpod' };
const AGENDAS = {
  valentin: 'https://calendar.proton.me/bookings#2v8n-uO99-wjViHyeCyHos1fTs0zF99J5TaGWewOXmQ=',
  maxime: 'https://calendar.proton.me/bookings#zq6TwUf8IStxgCKqi-oGLxU_L4xZHyGUPnm4UEUmOzk=',
};
const OPTIONS = {
  typeProjet: ['Résidence principale', 'Investissement locatif', 'Rachat de crédit', 'Financement professionnel', 'Autre'],
  statut: ['Primo-accédant', 'Déjà propriétaire', 'Investisseur locatif', 'Non-résident / expatrié', 'Autre'],
  avancement: ['En recherche de bien', 'Offre en cours', 'Offre acceptée', 'Compromis signé', 'Simple renseignement'],
  delai: ['Dès que possible', 'Sous 3 mois', 'Sous 6 mois', 'Pas encore défini'],
  courtier: ['Peu importe', 'Valentin Boura–Defranoux', 'Maxime Pidoux'],
};

const initial = {
  prenom: '', nom: '', email: '', tel: '',
  typeProjet: 'Résidence principale', statut: 'Primo-accédant', budget: '', apport: '', revenus: '', charges: '', ville: '',
  avancement: 'En recherche de bien', delai: 'Dès que possible', tauxSouhaite: '', dureeSouhaitee: '', montantSouhaite: '',
  message: '', courtier: 'Peu importe', rgpd: false,
};
type Form = typeof initial;
const ok = (x: unknown) => !!x && String(x).trim() !== '';

export default function PriseRendezVous() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [f, setF] = useState<Form>(initial);
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);
  const set = <K extends keyof Form>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: k === 'rgpd' ? (e.target as HTMLInputElement).checked : e.target.value }));

  // Comme en v1 : un lien vers #rdv ramène à l'étape 1.
  useEffect(() => {
    const check = () => { if ((location.hash || '').toLowerCase().includes('rdv')) { setStep(1); setErr1(false); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);

  const nextStep = () => {
    if (!ok(f.prenom) || !ok(f.nom) || !ok(f.email) || !ok(f.tel)) { setErr1(true); return; }
    setErr1(false); setStep(2);
  };

  const submit = () => {
    if (!ok(f.budget) || !ok(f.apport) || !ok(f.revenus) || !ok(f.charges) || !ok(f.ville) || !ok(f.tauxSouhaite) || !ok(f.dureeSouhaitee) || !ok(f.montantSouhaite) || !f.rgpd) { setErr2(true); return; }
    const data = {
      _subject: 'Recueil de besoins — ' + (f.prenom || '') + ' ' + (f.nom || '') + (f.typeProjet ? ' (' + f.typeProjet + ')' : ''),
      email: f.email,
      'Prénom': f.prenom, 'Nom': f.nom, 'Téléphone': f.tel,
      'Type de projet': f.typeProjet, 'Situation': f.statut,
      'Budget / prix du bien': f.budget, 'Apport disponible': f.apport,
      'Revenus nets du foyer': f.revenus, 'Charges de prêt en cours': f.charges,
      'Localisation': f.ville, 'Avancement': f.avancement, 'Délai souhaité': f.delai,
      'Taux souhaité': f.tauxSouhaite, 'Durée souhaitée': f.dureeSouhaitee, "Montant d'emprunt souhaité": f.montantSouhaite,
      'Courtier souhaité': f.courtier, 'Message': f.message || '—',
    };
    const sendMail = () => {
      const L: [string, string][] = [['Prénom', f.prenom], ['Nom', f.nom], ['Email', f.email], ['Téléphone', f.tel], ['Type de projet', f.typeProjet], ['Statut', f.statut], ['Budget / prix du bien', f.budget], ['Apport disponible', f.apport], ['Revenus nets mensuels du foyer', f.revenus], ['Charges de prêt en cours', f.charges], ['Localisation', f.ville], ['Avancement du projet', f.avancement], ['Délai souhaité', f.delai], ['Taux souhaité', f.tauxSouhaite], ['Durée souhaitée', f.dureeSouhaitee], ["Montant d'emprunt souhaité", f.montantSouhaite], ['Courtier souhaité', f.courtier], ['Message', f.message]];
      const body = L.map((x) => x[0] + ' : ' + (x[1] || '—')).join('\n');
      const mail = 'mailto:' + (/Maxime/.test(f.courtier || '') ? 'mpidoux@peakfunding.eu' : 'vboura@peakfunding.eu') + '?subject=' + encodeURIComponent('Recueil de besoins — ' + (f.prenom || '') + ' ' + (f.nom || '')) + '&body=' + encodeURIComponent(body);
      try { window.location.href = mail; } catch {}
    };
    const endpoint = /Maxime/.test(f.courtier || '') ? ENDPOINTS.maxime : ENDPOINTS.valentin;
    try {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then((r) => { if (!r.ok) sendMail(); }).catch(() => sendMail());
    } catch { sendMail(); }
    setStep(3); setErr2(false);
  };

  const ouvrir = (u: string) => { try { window.open(u, '_blank'); } catch {} };

  const sel = (k: keyof typeof OPTIONS, libelle: string) => (
    <label className="grid gap-2"><span className="libelle">{libelle}</span>
      <select className="champ appearance-none" value={f[k] as string} onChange={set(k)}>{OPTIONS[k].map((o) => <option key={o}>{o}</option>)}</select>
    </label>
  );
  const inp = (k: keyof Form, libelle: string, placeholder: string, type = 'text') => (
    <label className="grid gap-2"><span className="libelle">{libelle}</span>
      <input className="champ font-sans" type={type} placeholder={placeholder} value={f[k] as string} onChange={set(k)} />
    </label>
  );

  return (
    <div className="carte-donnee grid gap-5" id="rdv-parcours">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="eyebrow">{step === 1 ? 'Étape 1 sur 2 — Vous' : step === 2 ? 'Étape 2 sur 2 — Votre projet' : 'Merci, c’est noté.'}</span>
          <span className="font-mono text-[12px] text-argent">{step === 2 ? 'Vos attentes de financement' : step === 1 ? '2 minutes — pour préparer au mieux notre échange.' : ''}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5" aria-hidden="true">
          <div className="h-[3px] rounded-full bg-cuivre" /><div className={`h-[3px] rounded-full ${step >= 2 ? 'bg-cuivre' : 'bg-filet'}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">{inp('prenom', 'Prénom', 'Prénom')}{inp('nom', 'Nom', 'Nom')}</div>
          <div className="grid gap-3 sm:grid-cols-2">{inp('email', 'E-mail', 'vous@exemple.fr', 'email')}{inp('tel', 'Téléphone', '06 00 00 00 00', 'tel')}</div>
          {err1 && <p className="rounded-donnee border border-cuivre/50 px-4 py-3 text-[13.5px] text-cuivre-clair">Merci de renseigner votre prénom, votre nom, votre email et votre téléphone.</p>}
          <button type="button" className="btn-cuivre justify-self-end" onClick={nextStep}>Continuer →</button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {sel('typeProjet', 'Type de projet')}{sel('statut', 'Votre situation')}
            {inp('budget', 'Budget / prix du bien', 'ex. 320 000 €')}{inp('apport', 'Apport disponible', 'ex. 40 000 €')}
            {inp('revenus', 'Revenus nets mensuels du foyer', '€ / mois')}{inp('charges', 'Charges de prêt en cours', '€ / mois')}
            {inp('ville', 'Localisation du bien', 'Ville')}{sel('avancement', 'Avancement du projet')}
            {sel('delai', 'Délai souhaité')}{inp('tauxSouhaite', 'Taux souhaité', 'ex. 3,5 %')}
            {inp('dureeSouhaitee', 'Durée souhaitée', 'ex. 25 ans')}{inp('montantSouhaite', 'Montant d’emprunt souhaité', 'ex. 300 000 €')}
            {sel('courtier', 'Courtier souhaité')}
          </div>
          <label className="grid gap-2"><span className="libelle">Un point à préciser ? <span className="font-normal text-argent">(optionnel)</span></span>
            <textarea className="champ h-24 py-3 font-sans" value={f.message} onChange={set('message')} placeholder="Votre message" />
          </label>
          <label className="flex items-start gap-3 rounded-donnee border border-filet bg-abime px-4 py-3">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[#b87b4f]" checked={f.rgpd} onChange={set('rgpd')} />
            <span className="text-[13px] leading-relaxed text-argent">Vos informations sont transmises au cabinet pour préparer le rendez-vous. Aucune donnée n’est partagée avec des tiers.</span>
          </label>
          {err2 && <p className="rounded-donnee border border-cuivre/50 px-4 py-3 text-[13.5px] text-cuivre-clair">Merci de compléter tous les champs et de cocher la case de consentement. Seul le message est optionnel.</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="text-[14px] text-argent hover:text-etoile" onClick={() => setStep(1)}>← Étape 1</button>
            <button type="button" className="btn-cuivre" onClick={submit}>Envoyer et choisir un créneau</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4">
          <p className="text-[18px] text-etoile">Votre récapitulatif a été préparé pour le cabinet. Choisissez maintenant le créneau qui vous convient pour votre premier rendez-vous.</p>
          <span className="eyebrow">Choisissez votre courtier :</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-cuivre" onClick={() => ouvrir(AGENDAS.valentin)}>Valentin Boura–Defranoux</button>
            <button type="button" className="btn-fantome" onClick={() => ouvrir(AGENDAS.maxime)}>Maxime Pidoux</button>
          </div>
        </div>
      )}
    </div>
  );
}
