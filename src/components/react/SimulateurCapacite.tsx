import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Simulateur de capacité d'emprunt — mécanique STRICTEMENT identique à la v1
 * (_source/site-actuel/index.html, script data-dc-script) :
 *   taux annuel 3,5 % · taux d'endettement 35 % · loyers retenus à 70 % (projet locatif)
 *   autres revenus pondérés 70 ou 90 % · capacité = emprunt + apport, arrondie aux 5 000 €
 *   taux d'endettement et reste à vivre calculés sur les revenus retenus.
 * Seul l'habillage change.
 */
const TAUX_ANNUEL = 3.5;
const TAUX_ENDETTEMENT = 35;

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';

type Projet = 'rp' | 'loc';

export default function SimulateurCapacite() {
  const [projet, setProjet] = useState<Projet>('rp');
  const [revenus, setRevenus] = useState(5200);
  const [apport, setApport] = useState(60000);
  const [loyers, setLoyers] = useState(900);
  const [duree, setDuree] = useState(25);
  const [autresRevenus, setAutresRevenus] = useState(0);
  const [ponderation, setPonderation] = useState(70);
  const [charges, setCharges] = useState(0);

  const r = useMemo(() => {
    const endett = TAUX_ENDETTEMENT / 100;
    const loyersRetenus = projet === 'loc' ? (loyers || 0) * 0.7 : 0;
    const autresRet = (autresRevenus || 0) * (ponderation / 100);
    const mensuMax = Math.max(0, ((revenus || 0) + loyersRetenus + autresRet) * endett - (charges || 0));
    const t = TAUX_ANNUEL / 100 / 12;
    const n = duree * 12;
    const emprunt = t > 0 ? (mensuMax * (1 - Math.pow(1 + t, -n))) / t : mensuMax * n;
    const capacite = Math.round((emprunt + (apport || 0)) / 5000) * 5000;
    const revenusTotaux = (revenus || 0) + loyersRetenus + autresRet;
    const tauxEndet = revenusTotaux > 0 ? (((charges || 0) + mensuMax) / revenusTotaux) * 100 : 0;
    const resteAVivre = Math.max(0, revenusTotaux - (charges || 0) - mensuMax);
    return { capacite, mensuMax, tauxEndet: tauxEndet.toFixed(1).replace('.', ','), resteAVivre };
  }, [projet, revenus, apport, loyers, duree, autresRevenus, ponderation, charges]);

  // La bordure du résultat s'allume à chaque changement (400 ms), puis s'éteint.
  const resultat = useRef<HTMLDivElement>(null);
  const premier = useRef(true);
  useEffect(() => {
    if (premier.current) { premier.current = false; return; }
    const el = resultat.current; if (!el) return;
    el.classList.remove('allume'); void el.offsetWidth; el.classList.add('allume');
  }, [r.capacite]);

  const pilule = (actif: boolean) =>
    `inline-flex h-10 items-center rounded-pill px-5 text-[14px] font-medium transition-colors ${actif ? 'bg-etoile text-abime' : 'border border-filet text-etoile hover:bg-graphite'}`;
  const petite = (actif: boolean) =>
    `inline-flex h-8 items-center rounded-pill px-3.5 text-[13px] font-medium transition-colors ${actif ? 'bg-etoile text-abime' : 'border border-filet text-etoile hover:bg-graphite'}`;

  return (
    <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-labelledby="sim-titre">
      <fieldset className="grid gap-2">
        <legend className="libelle">Votre projet</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pilule(projet === 'rp')} aria-pressed={projet === 'rp'} onClick={() => setProjet('rp')}>Résidence principale</button>
          <button type="button" className={pilule(projet === 'loc')} aria-pressed={projet === 'loc'} onClick={() => setProjet('loc')}>Investissement locatif</button>
        </div>
      </fieldset>

      <label className="grid gap-2"><span className="libelle">Revenus nets mensuels du foyer</span>
        <span className="relative"><input className="champ pr-20" type="number" min={0} step={100} value={revenus} onChange={(e) => setRevenus(+e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€ / mois</span></span>
      </label>

      {projet === 'loc' && (
        <label className="grid gap-2"><span className="libelle">Loyers attendus <span className="font-normal text-argent">(retenus à 70 % — norme HCSF)</span></span>
          <span className="relative"><input className="champ pr-20" type="number" min={0} step={50} value={loyers} onChange={(e) => setLoyers(+e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€ / mois</span></span>
        </label>
      )}

      <div className="grid gap-2">
        <span className="libelle">Autres revenus <span className="font-normal text-argent">(revenus locatifs hors charges, salaire variable, revenus mobiliers, etc.)</span></span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={petite(ponderation === 70)} aria-pressed={ponderation === 70} onClick={() => setPonderation(70)}>70 %</button>
          <button type="button" className={petite(ponderation === 90)} aria-pressed={ponderation === 90} onClick={() => setPonderation(90)}>90 %</button>
          <span className="font-mono text-[11.5px] text-argent">retenus à {ponderation} %</span>
        </div>
        <label className="relative"><span className="sr-only">Autres revenus mensuels</span><input className="champ pr-20" type="number" min={0} step={50} value={autresRevenus} onChange={(e) => setAutresRevenus(+e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€ / mois</span></label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2"><span className="libelle">Apport disponible</span>
          <span className="relative"><input className="champ pr-10" type="number" min={0} step={1000} value={apport} onChange={(e) => setApport(+e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€</span></span>
        </label>
        <label className="grid gap-2"><span className="libelle">Charge(s) de prêt actuelle(s)</span>
          <span className="relative"><input className="champ pr-20" type="number" min={0} step={50} value={charges} onChange={(e) => setCharges(+e.target.value)} /><span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">€ / mois</span></span>
        </label>
      </div>

      <label className="grid gap-3">
        <span className="flex justify-between"><span className="libelle">Durée</span><span className="font-mono text-[13px] text-cuivre-clair tabular-nums">{duree} ans</span></span>
        <input className="w-full accent-[#b87b4f]" type="range" min={5} max={25} step={1} value={duree} onChange={(e) => setDuree(+e.target.value)} />
      </label>

      <div ref={resultat} className="grid gap-2 rounded-donnee border border-cuivre bg-abime p-6" aria-live="polite" style={{ boxShadow: '0 0 0 4px rgba(184,123,79,0.12)' }}>
        <span className="eyebrow">Capacité estimée</span>
        <span className="font-mono text-[40px] leading-none font-medium text-etoile tabular-nums">≈ {fmt(r.capacite)}</span>
        <span className="text-[14px] text-argent">soit ≈ {fmt(r.mensuMax)} /mois sur {duree} ans</span>
        <span className="font-mono text-[12.5px] text-argent">Endettement : <span className="text-cuivre-clair">{r.tauxEndet} %</span> (max {TAUX_ENDETTEMENT} % HCSF) · Reste à vivre : <span className="text-cuivre-clair">{fmt(r.resteAVivre)}</span></span>
        <a href="#rdv" className="btn-cuivre mt-2 h-11 justify-self-start px-6 text-[14px]">En parler avec un conseiller</a>
        <span className="font-mono text-[11px] leading-relaxed text-argent">Estimation donnée à titre indicatif, hors assurance et frais de notaire. Le chiffre exact dépend de votre dossier. Un crédit vous engage et doit être remboursé.</span>
      </div>
    </form>
  );
}
