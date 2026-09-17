import { useEffect, useState } from 'react';
import initial from '../../../public/api/observatoire-seed.json';
import { observationValide, libellePeriode, statutObservation } from '../../lib/observatoire.mjs';
import { useMesuresAnimees } from './useMesuresAnimees';
import type { Lang } from '../../i18n';

type Observation = { period:string; rate:number; durationMonths:number; sourceUrl:string; checkedAt:string|null; verifiedOn?:string; stale:boolean };

/* Déploiement statique actuel : le fichier JSON doit être actualisé séparément.
   Le rechargement navigateur ne consulte pas à lui seul la source officielle.
   En secours, conserver la copie datée sans prétendre à un contrôle récent. */
const SOURCE = '/api/observatoire.json';
const MOIS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const periodeEn = (p:string) => { const m = /^(\d{4})-(\d{2})/.exec(p); return m ? `${MOIS_EN[+m[2]-1] ?? ''} ${m[1]}` : p; };

const TX = {
  fr: { titre:'Le marché du crédit', taux:'Taux moyen', duree:'Durée moyenne', mois:'mois',
        note:'Repères de marché, pas une offre de prêt. Le simulateur part d’un taux de 3,5 %, que vous pouvez ajuster ci-dessous.',
        source:'Observatoire Crédit Logement / CSA', mensuel:'Publication mensuelle', onglet:' (nouvel onglet)',
        locale:'fr-FR' },
  en: { titre:'The credit market', taux:'Average rate', duree:'Average term', mois:'months',
        note:'Market benchmarks, not a loan offer. The calculator starts from a 3.5% rate, which you can adjust below.',
        source:'Observatoire Crédit Logement / CSA', mensuel:'Monthly publication', onglet:' (new tab)',
        locale:'en-GB' },
} as const;

export default function ObservatoireWidget({ lang = 'fr' }: { lang?: Lang }) {
  const T = TX[lang];
  const [data,setData] = useState<Observation>(initial);
  const status = statutObservation(data, lang);
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
        if (!controller.signal.aborted) setData(current => fresh.period >= current.period ? fresh : {...current, stale:true});
      } catch { if (!controller.signal.aborted) setData(current => ({...current, stale:true})); }
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
