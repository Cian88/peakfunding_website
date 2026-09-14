import { useEffect, useState } from 'react';
import initial from '../../../public/api/observatoire-seed.json';
import { observationValide, libellePeriode } from '../../lib/observatoire.mjs';
import { useMesuresAnimees } from './useMesuresAnimees';
import type { Lang } from '../../i18n';

type Observation = { period:string; rate:number; durationMonths:number; sourceUrl:string; checkedAt:string|null; stale:boolean };

/* Le site est statique (GitHub Pages) : la source à jour est le fichier
   public/api/observatoire.json, mis à jour par commit ; à défaut, la copie
   embarquée au build (observatoire-seed.json) reste affichée sans message d'échec. */
const SOURCE = '/api/observatoire.json';
const MOIS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const periodeEn = (p:string) => { const m = /^(\d{4})-(\d{2})/.exec(p); return m ? `${MOIS_EN[+m[2]-1] ?? ''} ${m[1]}` : p; };

const TX = {
  fr: { titre:'Le marché du crédit', taux:'Taux moyen', duree:'Durée moyenne', mois:'mois',
        note:'Repères de marché, pas une offre de prêt. Le simulateur part d’un taux de 3,5 %, que vous pouvez ajuster ci-dessous.',
        source:'Observatoire Crédit Logement / CSA', mensuel:'Publication mensuelle', onglet:' (nouvel onglet)',
        copie:(d:string)=>`Dernière copie vérifiée le ${d}`, verifie:(d:string)=>`Source vérifiée le ${d}`, locale:'fr-FR' },
  en: { titre:'The credit market', taux:'Average rate', duree:'Average term', mois:'months',
        note:'Market benchmarks, not a loan offer. The calculator starts from a 3.5% rate, which you can adjust below.',
        source:'Observatoire Crédit Logement / CSA', mensuel:'Monthly publication', onglet:' (new tab)',
        copie:(d:string)=>`Last verified copy: ${d}`, verifie:(d:string)=>`Source verified on ${d}`, locale:'en-GB' },
} as const;

export default function ObservatoireWidget({ lang = 'fr' }: { lang?: Lang }) {
  const T = TX[lang];
  const dateLoc = (iso:string|null) => iso ? new Date(iso).toLocaleDateString(T.locale) : '';
  const [data,setData] = useState<Observation>(initial);
  const [status,setStatus] = useState(T.copie(dateLoc(initial.checkedAt) || '12/09/2026'));
  const { mesuresRef, valeurs } = useMesuresAnimees(data.rate, data.durationMonths);
  const taux = (valeur:number) => valeur.toLocaleString(T.locale,{minimumFractionDigits:2,maximumFractionDigits:2});
  useEffect(() => {
    const controller = new AbortController();
    let lastAttempt = 0, busy = false;
    const refresh = async () => {
      if (document.hidden || busy || Date.now()-lastAttempt < 60*60*1000) return;
      busy = true; lastAttempt = Date.now();
      const timeout = AbortSignal.timeout(12000);
      try {
        const response = await fetch(SOURCE, { cache:'no-store', credentials:'omit', signal:AbortSignal.any([controller.signal,timeout]) });
        if (!response.ok) throw new Error('indisponible');
        const fresh = await response.json();
        if (!observationValide(fresh) || fresh.period < initial.period) throw new Error('invalide');
        if (!controller.signal.aborted) { setData(fresh); setStatus(T.verifie(dateLoc(fresh.checkedAt))); }
      } catch { /* copie embarquée conservée, sans message d'échec */ }
      finally { busy = false; }
    };
    void refresh();
    const interval = window.setInterval(refresh,60*60*1000);
    document.addEventListener('visibilitychange',refresh);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener('visibilitychange',refresh); };
  },[]);
  return <aside className="observatoire-widget" aria-label={T.titre}>
    <div className="observatoire-entete"><span className="eyebrow">{T.titre}</span><time dateTime={data.period}>{lang === 'fr' ? libellePeriode(data.period) : periodeEn(data.period)}</time></div>
    <dl className="observatoire-mesures" ref={mesuresRef}>
      <div><dt>{T.taux}</dt><dd><span className="sr-only">{taux(data.rate)} %</span><span className="observatoire-valeur" aria-hidden="true">{taux(valeurs.rate)}<span className="observatoire-unite"> %</span></span></dd></div>
      <div><dt>{T.duree}</dt><dd><span className="sr-only">{data.durationMonths} {T.mois}</span><span className="observatoire-valeur" aria-hidden="true">{Math.round(valeurs.durationMonths)}<span className="observatoire-unite"> {T.mois}</span></span></dd></div>
    </dl>
    <p className="observatoire-note">{T.note}</p>
    <div className="observatoire-source"><a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">{T.source} <span aria-hidden="true">↗</span><span className="sr-only">{T.onglet}</span></a><p>{T.mensuel}</p><p role="status">{status}</p></div>
  </aside>;
}
