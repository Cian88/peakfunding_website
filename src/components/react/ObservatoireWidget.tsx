import { useEffect, useState } from 'react';
import initial from '../../../public/api/observatoire-seed.json';
import { observationValide, libellePeriode } from '../../lib/observatoire.mjs';
import { useMesuresAnimees } from './useMesuresAnimees';

type Observation = { period:string; rate:number; durationMonths:number; sourceUrl:string; checkedAt:string|null; stale:boolean };

export default function ObservatoireWidget() {
  const [data,setData] = useState<Observation>(initial);
  const [status,setStatus] = useState('Dernière copie vérifiée le 12/09/2026');
  const { mesuresRef, valeurs } = useMesuresAnimees(data.rate, data.durationMonths);
  const taux = (valeur:number) => valeur.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
  useEffect(() => {
    const controller = new AbortController();
    let lastAttempt = 0, busy = false;
    const refresh = async () => {
      if (document.hidden || busy || Date.now()-lastAttempt < 60*60*1000) return;
      busy = true; lastAttempt = Date.now();
      const timeout = AbortSignal.timeout(12000);
      try {
        const response = await fetch('/api/observatoire.php', { cache:'no-store', credentials:'omit', signal:AbortSignal.any([controller.signal,timeout]) });
        if (!response.ok) throw new Error('indisponible');
        const fresh = await response.json();
        if (!observationValide(fresh) || fresh.period < initial.period) throw new Error('invalide');
        if (!controller.signal.aborted) {
          setData(fresh);
          setStatus(fresh.stale ? 'Actualisation indisponible · dernière copie conservée' : `Source vérifiée le ${new Date(fresh.checkedAt).toLocaleDateString('fr-FR')}`);
        }
      } catch { if (!controller.signal.aborted) setStatus('Actualisation indisponible · dernière copie conservée'); }
      finally { busy = false; }
    };
    void refresh();
    const interval = window.setInterval(refresh,60*60*1000);
    document.addEventListener('visibilitychange',refresh);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener('visibilitychange',refresh); };
  },[]);
  return <aside className="observatoire-widget" aria-label="Indicateurs du crédit immobilier">
    <div className="observatoire-entete"><span className="eyebrow">Le marché du crédit</span><time dateTime={data.period}>{libellePeriode(data.period)}</time></div>
    <dl className="observatoire-mesures" ref={mesuresRef}>
      <div><dt>Taux moyen</dt><dd><span className="sr-only">{taux(data.rate)} %</span><span className="observatoire-valeur" aria-hidden="true">{taux(valeurs.rate)}<span className="observatoire-unite"> %</span></span></dd></div>
      <div><dt>Durée moyenne</dt><dd><span className="sr-only">{data.durationMonths} mois</span><span className="observatoire-valeur" aria-hidden="true">{Math.round(valeurs.durationMonths)}<span className="observatoire-unite"> mois</span></span></dd></div>
    </dl>
    <p className="observatoire-note">Repères de marché, pas une offre de prêt. Le simulateur conserve son hypothèse de taux à 3,5 %.</p>
    <div className="observatoire-source"><a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">Observatoire Crédit Logement / CSA <span aria-hidden="true">↗</span><span className="sr-only"> (nouvel onglet)</span></a><p>Publication mensuelle</p><p role="status">{status}</p></div>
  </aside>;
}
