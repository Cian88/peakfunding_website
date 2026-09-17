import { useEffect, useMemo, useRef, useState } from 'react';
import { simulateurTextes } from './textes-react';
import type { Lang } from '../../i18n';

/**
 * Simulateur de capacité d'emprunt — mécanique héritée de la v1 (effort 35 % HCSF,
 * loyers et autres revenus pondérés 70/90 %, capacité = emprunt + apport arrondie
 * aux 5 000 €, endettement et reste à vivre sur les revenus retenus), étendue le
 * 2026-09-14 à la demande du cabinet :
 *   · nombre d'emprunteurs (1–6), taux du prêt (curseur 0–15 %, défaut 3,5 %) ;
 *   · assurance emprunteur : taux annuel (0–1 %), base linéaire (capital initial)
 *     ou sur capital restant dû, garanties complètes (DC/PTIA/ITT/IPP) ou DC/PTIA
 *     (retenues à 60 % du taux de référence), quotité par emprunteur (0–100 %).
 * La norme HCSF incluant l'assurance, la mensualité maximale couvre crédit +
 * assurance du 1er mois : emprunt = mensualité max / (facteur d'annuité + a),
 * avec a = taux effectif × quotité totale / 12.
 */
/* Règle HCSF : 35 % d'effort maximal assurance emprunteur incluse ;
   sans assurance prise en compte, le plafond retenu est de 33 %. */
const TAUX_ENDETTEMENT_AVEC_ASSURANCE = 35;
const TAUX_ENDETTEMENT_SANS_ASSURANCE = 33;
const TAUX_DEFAUT = 3.5;
const TAUX_ASSURANCE_DEFAUT = 0.3;
const COEF_GARANTIES = { complete: 1, minimale: 0.6 } as const;
type Garanties = keyof typeof COEF_GARANTIES;
type ModeAssurance = 'lineaire' | 'crd';
type Projet = 'rp' | 'loc';

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
/** Répartit 100 % de quotité entre n emprunteurs (le minimum exigé par les banques). */
const repartir = (n: number) => { const base = Math.floor(100 / n); const reste = 100 - base * n; return Array.from({ length: n }, (_, i) => base + (i < reste ? 1 : 0)); };

export default function SimulateurCapacite({ lang = 'fr' }: { lang?: Lang }) {
  const S = simulateurTextes(lang);
  const U = lang === 'fr' ? {
    budget:'Budget estimé, apport inclus', emprunt:'Emprunt estimé', apport:'Votre apport',
    arrondi:'Budget arrondi à 5 000 € près, hors frais de notaire et de garantie.',
    affiner:'Affiner les hypothèses', details:'Détail du financement',
    resume:'Budget estimé', voir:'Voir le détail', hypothese:'Hypothèses',
  } : {
    budget:'Estimated budget, down payment included', emprunt:'Estimated loan', apport:'Your down payment',
    arrondi:'Budget rounded to the nearest €5,000, excluding notary and guarantee fees.',
    affiner:'Refine assumptions', details:'Financing breakdown',
    resume:'Estimated budget', voir:'View breakdown', hypothese:'Assumptions',
  };
  const pc = (v: number, d = 2) => (lang === 'fr' ? v.toFixed(d).replace('.', ',') : v.toFixed(d));

  const [projet, setProjet] = useState<Projet>('rp');
  const [revenus, setRevenus] = useState(5200);
  const [apport, setApport] = useState(60000);
  const [loyers, setLoyers] = useState(900);
  const [duree, setDuree] = useState(25);
  const [autresRevenus, setAutresRevenus] = useState(0);
  const [ponderation, setPonderation] = useState(70);
  const [ponderationLoyers, setPonderationLoyers] = useState(70); // norme HCSF : 70 %
  const [charges, setCharges] = useState(0);
  const [emprunteurs, setEmprunteurs] = useState(1);
  const [taux, setTaux] = useState(TAUX_DEFAUT);
  const [tauxAss, setTauxAss] = useState(TAUX_ASSURANCE_DEFAUT);
  const [modeAss, setModeAss] = useState<ModeAssurance>('lineaire');
  const [garanties, setGaranties] = useState<Garanties>('complete');
  const [quotites, setQuotites] = useState<number[]>(repartir(1));

  const changerEmprunteurs = (n: number) => { setEmprunteurs(n); setQuotites(repartir(n)); };
  const changerQuotite = (i: number, v: number) => setQuotites((q) => q.map((x, j) => (j === i ? v : x)));

  const r = useMemo(() => {
    const quotiteTotale = quotites.reduce((s, q) => s + q, 0);           // en %
    const tauxEffectif = tauxAss * COEF_GARANTIES[garanties];            // % annuel
    const a = (tauxEffectif / 100) * (quotiteTotale / 100) / 12;         // prime mensuelle par € emprunté (1er mois)
    const avecAssurance = a > 0;
    const plafond = avecAssurance ? TAUX_ENDETTEMENT_AVEC_ASSURANCE : TAUX_ENDETTEMENT_SANS_ASSURANCE;
    const endett = plafond / 100;
    const loyersRetenus = projet === 'loc' ? (loyers || 0) * (ponderationLoyers / 100) : 0;
    const autresRet = (autresRevenus || 0) * (ponderation / 100);
    const revenusTotaux = (revenus || 0) + loyersRetenus + autresRet;
    const mensuMax = Math.max(0, revenusTotaux * endett - (charges || 0));
    const t = taux / 100 / 12;
    const n = duree * 12;
    const fa = t > 0 ? t / (1 - Math.pow(1 + t, -n)) : 1 / n;            // facteur d'annuité mensuel
    const emprunt = mensuMax / (fa + a);
    const mensuCredit = emprunt * fa;
    const assuranceMois = emprunt * a;
    let coutAssurance = 0;
    if (modeAss === 'lineaire') coutAssurance = assuranceMois * n;
    else { let crd = emprunt; for (let k = 0; k < n; k++) { coutAssurance += crd * a; crd -= mensuCredit - crd * t; } }
    const coutInterets = Math.max(0, mensuCredit * n - emprunt);
    const capacite = Math.round((emprunt + (apport || 0)) / 5000) * 5000;
    const tauxEndet = revenusTotaux > 0 ? (((charges || 0) + mensuMax) / revenusTotaux) * 100 : 0;
    const resteAVivre = Math.max(0, revenusTotaux - (charges || 0) - mensuMax);
    return { emprunt, capacite, mensuMax, mensuCredit, assuranceMois, coutAssurance, coutInterets, tauxEffectif, quotiteTotale, plafond, avecAssurance, tauxEndet: pc(tauxEndet, 1), resteAVivre };
  }, [projet, revenus, apport, loyers, duree, autresRevenus, ponderation, ponderationLoyers, charges, taux, tauxAss, modeAss, garanties, quotites, lang]);

  // La bordure du résultat s'allume à chaque changement (400 ms), puis s'éteint.
  const resultat = useRef<HTMLDivElement>(null);
  const premier = useRef(true);
  useEffect(() => {
    if (premier.current) { premier.current = false; return; }
    const el = resultat.current; if (!el) return;
    el.classList.remove('allume'); void el.offsetWidth; el.classList.add('allume');
  }, [r.capacite, r.coutAssurance, r.coutInterets]);

  const pilule = (actif: boolean) =>
    `inline-flex h-10 items-center rounded-pill px-5 text-[14px] font-medium transition-colors ${actif ? 'bg-etoile text-abime' : 'border border-filet text-etoile hover:bg-graphite'}`;
  const petite = (actif: boolean) =>
    `inline-flex h-8 items-center rounded-pill px-3.5 text-[13px] font-medium transition-colors ${actif ? 'bg-etoile text-abime' : 'border border-filet text-etoile hover:bg-graphite'}`;
  const unite = (txt: string) => <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[12px] text-argent">{txt}</span>;
  const curseur = (libelle: string, valeur: string, props: React.InputHTMLAttributes<HTMLInputElement>, note?: string) => (
    <label className="grid gap-3">
      <span className="flex flex-wrap justify-between gap-2"><span className="libelle">{libelle} {note && <span className="font-normal text-argent">{note}</span>}</span><span className="font-mono text-[13px] text-cuivre-clair tabular-nums">{valeur}</span></span>
      <input className="w-full accent-[#b87b4f]" type="range" {...props} />
    </label>
  );
  const caseMode = (mode: ModeAssurance, libelle: string) => (
    <label className="flex items-center gap-2 text-[14px]">
      <input type="checkbox" className="h-4 w-4 accent-[#b87b4f]" checked={modeAss === mode} onChange={() => setModeAss(mode)} />
      <span>{libelle}</span>
    </label>
  );

  return (
    <form className="simulateur-form grid gap-5" onSubmit={(e) => e.preventDefault()} aria-labelledby="sim-titre">
      <div className="simulateur-resume-mobile">
        <div><span>{U.resume}</span><strong>≈ {fmt(r.capacite)}</strong><small>{lang === 'fr' ? 'Apport inclus · estimation' : 'Down payment included · estimate'}</small></div>
        <a href="#simulation-resultat">{U.voir} ↓</a>
      </div>
      <div className="simulateur-saisie grid gap-5">
      <fieldset className="grid gap-2">
        <legend className="libelle">{S.projet}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pilule(projet === 'rp')} aria-pressed={projet === 'rp'} onClick={() => setProjet('rp')}>{S.rp}</button>
          <button type="button" className={pilule(projet === 'loc')} aria-pressed={projet === 'loc'} onClick={() => setProjet('loc')}>{S.loc}</button>
        </div>
      </fieldset>

      <label className="grid gap-2"><span className="libelle">{S.revenus}</span>
        <span className="relative"><input className="champ pr-20" type="number" min={0} step={100} value={revenus} onChange={(e) => setRevenus(+e.target.value)} />{unite(S.mois)}</span>
      </label>

      {projet === 'loc' && (
        <div className="grid gap-2">
          <span className="libelle">{S.loyers} <span className="font-normal text-argent">{S.loyers_note}</span></span>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={petite(ponderationLoyers === 70)} aria-pressed={ponderationLoyers === 70} onClick={() => setPonderationLoyers(70)}>70 %</button>
            <button type="button" className={petite(ponderationLoyers === 90)} aria-pressed={ponderationLoyers === 90} onClick={() => setPonderationLoyers(90)}>90 %</button>
            <span className="font-mono text-[11.5px] text-argent">{S.retenus} {ponderationLoyers} % {S.loyers_norme}</span>
          </div>
          <label className="relative"><span className="sr-only">{S.loyers}</span><input className="champ pr-20" type="number" min={0} step={50} value={loyers} onChange={(e) => setLoyers(+e.target.value)} />{unite(S.mois)}</label>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2"><span className="libelle">{S.apport}</span>
          <span className="relative"><input className="champ pr-10" type="number" min={0} step={1000} value={apport} onChange={(e) => setApport(+e.target.value)} />{unite('€')}</span>
        </label>
        <label className="grid gap-2"><span className="libelle">{S.charges}</span>
          <span className="relative"><input className="champ pr-20" type="number" min={0} step={50} value={charges} onChange={(e) => setCharges(+e.target.value)} />{unite(S.mois)}</span>
        </label>
      </div>

      {curseur(S.duree, `${duree} ${S.ans}`, { min: 5, max: 25, step: 1, value: duree, onChange: (e) => setDuree(+e.target.value) })}
      <p id="simulation-hypotheses" className="simulateur-hypotheses">{U.hypothese} : {pc(taux)} % · {S.res_assurance} {pc(tauxAss)} % · {S.quotite_totale} {r.quotiteTotale} %</p>
      <details className="simulateur-avance">
        <summary aria-describedby="simulation-hypotheses"><span>{U.affiner}</span><span aria-hidden="true">+</span></summary>
        <div className="simulateur-avance-contenu grid gap-6">
      <div className="grid gap-2">
        <span className="libelle">{S.autres} <span className="font-normal text-argent">{S.autres_note}</span></span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={petite(ponderation === 70)} aria-pressed={ponderation === 70} onClick={() => setPonderation(70)}>70 %</button>
          <button type="button" className={petite(ponderation === 90)} aria-pressed={ponderation === 90} onClick={() => setPonderation(90)}>90 %</button>
          <span className="font-mono text-[11.5px] text-argent">{S.retenus} {ponderation} %</span>
        </div>
        <label className="relative"><span className="sr-only">{S.autres_sr}</span><input className="champ pr-20" type="number" min={0} step={50} value={autresRevenus} onChange={(e) => setAutresRevenus(+e.target.value)} />{unite(S.mois)}</label>
      </div>


      {/* ── Le prêt ── */}
      <div className="grid gap-4 border-t border-filet pt-5">
        <p className="eyebrow">{S.sec_pret}</p>
        <label className="grid gap-2"><span className="libelle">{S.emprunteurs}</span>
          <select className="champ appearance-none" value={emprunteurs} onChange={(e) => changerEmprunteurs(+e.target.value)}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </label>
        {curseur(S.l_taux, `${pc(taux)} %`, { min: 0, max: 15, step: 0.05, value: taux, onChange: (e) => setTaux(+e.target.value) })}
      </div>

      {/* ── L'assurance emprunteur ── */}
      <div className="grid gap-4 border-t border-filet pt-5">
        <p className="eyebrow">{S.sec_assurance}</p>
        {curseur(S.l_taux_ass, `${pc(tauxAss)} %`, { min: 0, max: 1, step: 0.01, value: tauxAss, onChange: (e) => setTauxAss(+e.target.value) }, S.taux_ass_note)}
        <div className="grid gap-2">
          <span className="libelle">{S.mode}</span>
          <div className="flex flex-wrap gap-5">{caseMode('lineaire', S.lineaire)}{caseMode('crd', S.crd)}</div>
        </div>
        <label className="grid gap-2"><span className="libelle">{S.garanties}</span>
          <select className="champ appearance-none" value={garanties} onChange={(e) => setGaranties(e.target.value as Garanties)}>
            <option value="complete">{S.g_complete}</option>
            <option value="minimale">{S.g_min}</option>
          </select>
          {garanties === 'minimale' && <span className="font-mono text-[11px] text-argent">{S.hypothese}</span>}
        </label>
        <div className="grid gap-3">
          <span className="flex flex-wrap justify-between gap-2"><span className="libelle">{S.quotite}</span><span className="font-mono text-[12px] text-argent">{S.quotite_totale} <span className={r.quotiteTotale < 100 ? 'text-cuivre-clair' : ''}>{r.quotiteTotale} %</span></span></span>
          {quotites.map((q, i) => (
            <label key={i} className="grid gap-1.5">
              <span className="flex justify-between"><span className="text-[13px] text-argent">{S.emprunteur} {i + 1}</span><span className="font-mono text-[12px] text-cuivre-clair tabular-nums">{q} %</span></span>
              <input className="w-full accent-[#b87b4f]" type="range" min={0} max={100} step={5} value={q} onChange={(e) => changerQuotite(i, +e.target.value)} />
            </label>
          ))}
          {r.quotiteTotale < 100 && <span className="font-mono text-[11px] text-cuivre-clair">{S.avert_quotite}</span>}
        </div>
      </div>

        </div>
      </details>
      </div>
      <div ref={resultat} id="simulation-resultat" tabIndex={-1} className="simulateur-resultat grid gap-5 rounded-donnee border border-cuivre bg-abime p-6" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">{U.budget}</span>
        <span className="font-mono text-[40px] leading-none font-medium text-etoile tabular-nums">≈ {fmt(r.capacite)}</span>
        <dl className="simulateur-decomposition">
          <div><dt>{U.emprunt}</dt><dd>{fmt(r.emprunt)}</dd></div>
          <div><dt>{U.apport}</dt><dd>{fmt(apport)}</dd></div>
        </dl>
        <p className="simulateur-arrondi">{U.arrondi}</p>
        <p className="simulateur-mensualite"><strong>{fmt(r.mensuMax)}{S.par_mois}</strong><span>{fmt(r.mensuCredit)} {S.credit_mois} + {fmt(r.assuranceMois)} {S.assurance_mois} · {duree} {S.ans}</span></p>
        <a href="#rdv" className="btn-cuivre mt-2 h-11 justify-self-start px-6 text-[14px]">{S.cta}</a>
        <details className="simulateur-details">
          <summary>{U.details} <span aria-hidden="true">+</span></summary>
          <dl className="simulateur-decomposition">
            <div><dt>{S.res_taux}</dt><dd>{pc(taux)} %</dd></div>
            <div><dt>{S.res_interets}</dt><dd>{fmt(r.coutInterets)}</dd></div>
            <div><dt>{S.res_cout_assurance}</dt><dd>{fmt(r.coutAssurance)}</dd></div>
            <div><dt>{S.endettement}</dt><dd>{r.tauxEndet} %</dd></div>
            <div><dt>{S.reste}</dt><dd>{fmt(r.resteAVivre)}</dd></div>
          </dl>
          <p>{S.res_assurance} {pc(r.tauxEffectif)} % · {garanties === 'complete' ? S.g_complete : S.g_min} · {S.quotite_totale} {r.quotiteTotale} % · {modeAss === 'lineaire' ? S.lineaire_court : S.crd_court}</p>
          <p>{S.max} {r.plafond} % HCSF{r.avecAssurance ? '' : ` ${S.sans_assurance}`}</p>
        </details>
        <p className="simulateur-avertissement">{S.avert}</p>
      </div>
    </form>
  );
}
