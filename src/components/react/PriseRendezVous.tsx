import { useEffect, useRef, useState } from 'react';
import { rdvTextes, type Option } from './textes-react';
import type { Lang } from '../../i18n';
import { validerRdv, messageErreurRdv } from '../../lib/validation-rdv.mjs';

/**
 * Parcours de prise de rendez-vous — architecture STRICTEMENT identique à la v1 :
 *   étape 1 (identité) → étape 2 (projet, consentement) → envoi JSON à Formspree
 *   (point de terminaison selon le courtier souhaité, repli mailto si l'envoi échoue)
 *   → étape 3 : choix du courtier et ouverture de son agenda Proton.
 * Champs, options et charge utile conservés ; validations et états d’envoi améliorés. Les VALEURS
 * envoyées restent en français (boîte de réception homogène) ; seuls les
 * libellés affichés suivent la langue.
 */
const ENDPOINTS = { valentin: 'https://formspree.io/f/mykrggwk', maxime: 'https://formspree.io/f/xkjnbpod' };
const AGENDAS = {
  valentin: 'https://calendar.proton.me/bookings#2v8n-uO99-wjViHyeCyHos1fTs0zF99J5TaGWewOXmQ=',
  maxime: 'https://calendar.proton.me/bookings#zq6TwUf8IStxgCKqi-oGLxU_L4xZHyGUPnm4UEUmOzk=',
};

const initial = {
  prenom: '', nom: '', email: '', tel: '',
  typeProjet: 'Résidence principale', statut: 'Primo-accédant', budget: '', apport: '', revenus: '', charges: '', ville: '',
  avancement: 'En recherche de bien', delai: 'Dès que possible', tauxSouhaite: '', dureeSouhaitee: '', montantSouhaite: '',
  message: '', courtier: 'Peu importe', rgpd: false,
};
type Form = typeof initial;


export default function PriseRendezVous({ lang = 'fr' }: { lang?: Lang }) {
  const T = rdvTextes(lang);
  const OPTIONS: Record<'typeProjet' | 'statut' | 'avancement' | 'delai' | 'courtier', Option[]> = {
    typeProjet: T.typeProjet, statut: T.statut, avancement: T.avancement, delai: T.delai, courtier: T.courtier,
  };
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [f, setF] = useState<Form>(initial);
  const [erreurs, setErreurs] = useState<Record<string,string>>({});
  const [envoi, setEnvoi] = useState(false);
  const [mailSecours, setMailSecours] = useState('');
  const formulaire = useRef<HTMLFormElement>(null);
  const requete = useRef<AbortController | null>(null);
  const actif = useRef(true);
  const etapePrecedente = useRef(step);
  useEffect(() => { actif.current = true; return () => { actif.current = false; requete.current?.abort(); }; }, []);
  useEffect(() => {
    if (Object.keys(erreurs).length) formulaire.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [erreurs]);
  useEffect(() => {
    if (step !== etapePrecedente.current) formulaire.current?.querySelector<HTMLElement>('[data-etape-titre]')?.focus();
    etapePrecedente.current = step;
  }, [step]);
  const erreur = (k:keyof Form) => erreurs[k]
    ? <span id={`rdv-erreur-${k}`} className="rdv-erreur">{messageErreurRdv(erreurs[k], lang)}</span> : null;
  const valider = (etape:1|2) => {
    const result = validerRdv(f, etape);
    setErreurs(result);
    return Object.keys(result).length === 0;
  };
  const set = <K extends keyof Form>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: k === 'rgpd' ? (e.target as HTMLInputElement).checked : e.target.value }));

  // Comme en v1 : un lien vers #rdv ramène à l'étape 1.
  useEffect(() => {
    const check = () => { if ((location.hash || '').toLowerCase().includes('rdv')) { setStep(1); setErreurs({}); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);

  const nextStep = () => {
    if (valider(1)) setStep(2);
  };

  const submit = async () => {
    if (requete.current || !valider(2)) return;
    const controller = new AbortController();
    requete.current = controller;
    setEnvoi(true); setMailSecours('');
    const timeout = window.setTimeout(() => controller.abort(), 12000);
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
      'Langue du visiteur': lang.toUpperCase(),
    };
    const sendMail = () => {
      const L: [string, string][] = [['Prénom', f.prenom], ['Nom', f.nom], ['Email', f.email], ['Téléphone', f.tel], ['Type de projet', f.typeProjet], ['Statut', f.statut], ['Budget / prix du bien', f.budget], ['Apport disponible', f.apport], ['Revenus nets mensuels du foyer', f.revenus], ['Charges de prêt en cours', f.charges], ['Localisation', f.ville], ['Avancement du projet', f.avancement], ['Délai souhaité', f.delai], ['Taux souhaité', f.tauxSouhaite], ['Durée souhaitée', f.dureeSouhaitee], ["Montant d'emprunt souhaité", f.montantSouhaite], ['Courtier souhaité', f.courtier], ['Message', f.message]];
      const body = L.map((x) => x[0] + ' : ' + (x[1] || '—')).join('\n');
      const mail = 'mailto:' + (/Maxime/.test(f.courtier || '') ? 'mpidoux@peakfunding.eu' : 'vboura@peakfunding.eu') + '?subject=' + encodeURIComponent('Recueil de besoins — ' + (f.prenom || '') + ' ' + (f.nom || '')) + '&body=' + encodeURIComponent(body);
      if (actif.current) setMailSecours(mail);
    };
    const endpoint = /Maxime/.test(f.courtier || '') ? ENDPOINTS.maxime : ENDPOINTS.valentin;
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal:controller.signal });
      if (!r.ok) sendMail();
      else if (actif.current) { setStep(3); setErreurs({}); }
    } catch { sendMail(); }
    finally { window.clearTimeout(timeout); requete.current = null; if (actif.current) setEnvoi(false); }
  };

  const ouvrir = (u: string) => { try { window.open(u, '_blank'); } catch {} };

  const sel = (k: keyof typeof OPTIONS, libelle: string) => (
    <label className="grid gap-2"><span className="libelle">{libelle}</span>
      <select className="champ appearance-none" value={f[k] as string} onChange={set(k)}>{OPTIONS[k].map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
    </label>
  );
  const inp = (k: keyof Form, libelle: string, placeholder: string, type = 'text') => (
    <label className="grid gap-2"><span className="libelle">{libelle}</span>
      <input className="champ font-sans" id={`rdv-${k}`} name={k} type={type} required
        autoComplete={({prenom:'given-name',nom:'family-name',email:'email',tel:'tel'} as Record<string,string>)[k]}
        inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : ['budget','apport','revenus','charges','tauxSouhaite','dureeSouhaitee','montantSouhaite'].includes(k) ? 'decimal' : undefined}
        aria-invalid={!!erreurs[k]} aria-describedby={erreurs[k] ? `rdv-erreur-${k}` : undefined}
        placeholder={placeholder} value={f[k] as string} onChange={set(k)} />
      {erreur(k)}
    </label>
  );

  return (
    <form ref={formulaire} noValidate onSubmit={(e) => { e.preventDefault(); if (step === 1) nextStep(); else if (step === 2) void submit(); }} className="carte-donnee grid gap-5" id="rdv-parcours" aria-busy={envoi}>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="eyebrow" tabIndex={-1} data-etape-titre>{step === 1 ? T.etape1 : step === 2 ? T.etape2 : T.merci}</span>
          <span className="font-mono text-[12px] text-argent">{step === 2 ? T.aparte2 : step === 1 ? T.aparte1 : ''}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5" aria-hidden="true">
          <div className="h-[3px] rounded-full bg-cuivre" /><div className={`h-[3px] rounded-full ${step >= 2 ? 'bg-cuivre' : 'bg-filet'}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">{inp('prenom', T.prenom, T.prenom)}{inp('nom', T.nom, T.nom)}</div>
          <div className="grid gap-3 sm:grid-cols-2">{inp('email', T.email, T.ph_email, 'email')}{inp('tel', T.tel, T.ph_tel, 'tel')}</div>

          <button type="submit" className="btn-cuivre justify-self-end">{T.continuer}</button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5">
          <fieldset disabled={envoi} className="rdv-groupe">
            <legend>{lang === 'fr' ? 'Votre projet' : 'Your project'}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {sel('typeProjet', T.l_typeProjet)}{sel('statut', T.l_statut)}
              {inp('ville', T.l_ville, T.ph_ville)}{sel('avancement', T.l_avancement)}
            </div>
          </fieldset>
          <fieldset disabled={envoi} className="rdv-groupe">
            <legend>{lang === 'fr' ? 'Votre situation financière' : 'Your finances'}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {inp('budget', T.l_budget, T.ph_budget)}{inp('apport', T.l_apport, T.ph_apport)}
              {inp('revenus', T.l_revenus, T.ph_mois)}{inp('charges', T.l_charges, T.ph_mois)}
            </div>
          </fieldset>
          <fieldset disabled={envoi} className="rdv-groupe">
            <legend>{lang === 'fr' ? 'Vos préférences' : 'Your preferences'}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {sel('delai', T.l_delai)}{inp('tauxSouhaite', T.l_taux, T.ph_taux)}
              {inp('dureeSouhaitee', T.l_duree, T.ph_duree)}{inp('montantSouhaite', T.l_montant, T.ph_montant)}
              {sel('courtier', T.l_courtier)}
            </div>
          </fieldset>
          <label className="grid gap-2"><span className="libelle">{T.l_message} <span className="font-normal text-argent">{T.optionnel}</span></span>
            <textarea disabled={envoi} name="message" className="champ h-24 py-3 font-sans" value={f.message} onChange={set('message')} placeholder={T.ph_message} />
          </label>
          <label className="flex items-start gap-3 rounded-donnee border border-filet bg-abime px-4 py-3">
            <input disabled={envoi} name="rgpd" type="checkbox" aria-invalid={!!erreurs.rgpd} aria-describedby={erreurs.rgpd ? 'rdv-erreur-rgpd' : undefined} className="mt-1 h-4 w-4 accent-[#b87b4f]" checked={f.rgpd} onChange={set('rgpd')} />
            <span className="text-[13px] leading-relaxed text-argent">{T.consentement}</span>
          </label>
          {erreur('rgpd')}
          {mailSecours && <div className="rdv-secours" role="alert">
            <p>{lang === 'fr' ? 'Le formulaire n’a pas pu être transmis. Réessayez ou envoyez votre demande par e-mail.' : 'The form could not be sent. Try again or send your request by email.'}</p>
            <a href={mailSecours} className="btn-fantome">{lang === 'fr' ? 'Ouvrir l’e-mail prérempli' : 'Open the pre-filled email'}</a>
            <p>{lang === 'fr' ? 'L’ouverture de votre messagerie ne confirme pas l’envoi. Envoyez l’e-mail avant de continuer.' : 'Opening your email app does not confirm delivery. Send the email before continuing.'}</p>
            <button type="button" className="btn-fantome" onClick={() => { setMailSecours(''); setStep(3); }}>{lang === 'fr' ? 'J’ai envoyé l’e-mail — choisir un créneau' : 'I sent the email — choose a time'}</button>
          </div>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button disabled={envoi} type="button" className="text-[14px] text-argent hover:text-etoile" onClick={() => { setErreurs({}); setStep(1); }}>{T.retour1}</button>
            <button disabled={envoi} type="submit" className="btn-cuivre">{envoi ? (lang === 'fr' ? 'Envoi en cours…' : 'Sending…') : T.envoyer}</button>
          </div>
          <p className="sr-only" role="status">{envoi ? (lang === 'fr' ? 'Envoi en cours, veuillez patienter.' : 'Sending, please wait.') : ''}</p>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4">
          <p className="text-[18px] text-etoile">{T.recap}</p>
          <span className="eyebrow">{T.choisir}</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-cuivre" onClick={() => ouvrir(AGENDAS.valentin)}>Valentin Boura–Defranoux</button>
            <button type="button" className="btn-fantome" onClick={() => ouvrir(AGENDAS.maxime)}>Maxime Pidoux</button>
          </div>
        </div>
      )}
    </form>
  );
}
