import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '../../i18n';
import type { AvisPublic } from '../../lib/supabase';
import { murTextes, projetsLibelles } from './textes-avis';

/**
 * Section « Avis clients » — mur vivant.
 * Rendu côté serveur en état « à venir » (aucun avis fictif), puis, au chargement,
 * lecture de la vue publique Supabase `avis_publics` : dès qu'il y a des avis,
 * l'agrégat, la bande-carte à pins et le mur défilant prennent le relais.
 */
const ETOILE = 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z';
const GOOGLE = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z"/></svg>
);
const BBOX = { latMin: 41.3, latMax: 51.2, lngMin: -5.2, lngMax: 9.6 };
const borne = (v: number) => Math.min(86, Math.max(14, v));
const teintes = ['#8a5a3c', '#3c5a8a', '#5a8a3c', '#8a3c5a', '#3c8a7a', '#7a3c8a'];
const teinte = (s: string) => teintes[[...s].reduce((n, c) => n + c.charCodeAt(0), 0) % teintes.length];

function Etoiles({ n, lg = false }: { n: number; lg?: boolean }) {
  return (
    <span className={`etoiles${lg ? ' lg' : ''}`} aria-label={`${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => <svg key={i} className={i <= Math.round(n) ? '' : 'vide'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={ETOILE} /></svg>)}
    </span>
  );
}

function Chip({ a, lang }: { a: AvisPublic; lang: Lang }) {
  const t = murTextes(lang);
  const montant = lang === 'fr' ? `${a.montant.toLocaleString('fr-FR')} €` : `€${a.montant.toLocaleString('en-GB')}`;
  const date = new Date(`${a.date}T00:00:00Z`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <article className="chip">
      <div className="chip-tete">
        <span className="avatar" style={a.photo ? undefined : { background: teinte(a.prenom) }}>
          {a.photo ? <img src={a.photo} alt="" width={38} height={38} loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : a.prenom.charAt(0).toUpperCase()}
          <span className="g" aria-hidden="true">{GOOGLE}</span>
        </span>
        <div className="min-w-0">
          <div className="chip-nom">{a.prenom} {a.initiale.charAt(0).toUpperCase()}.</div>
          <div className="chip-meta"><span className="v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>{t.verifie}</span> · {date}</div>
        </div>
      </div>
      <Etoiles n={a.note} />
      <p className="chip-txt">{a.texte}</p>
      <div className="chip-bas">
        <span className="tag projet">{(projetsLibelles[lang] as Record<string, string>)[a.projet] ?? a.projet}</span>
        <span className="tag donnee">{montant}</span>
        <span className="tag">{a.ville}</span>
      </div>
    </article>
  );
}

export default function MurAvis({ lang = 'fr', rdvHref }: { lang?: Lang; rdvHref: string }) {
  const t = murTextes(lang);
  const [avis, setAvis] = useState<AvisPublic[] | null>(null);

  useEffect(() => {
    let actif = true;
    import('../../lib/supabase')
      .then((m) => m.chargerAvisPublics())
      .then((rows) => { if (actif) setAvis(rows); })
      .catch(() => { if (actif) setAvis([]); });
    return () => { actif = false; };
  }, []);

  const liste = avis ?? [];
  const total = liste.length;

  const { moyenne, distribution, pins, colonnes, defile } = useMemo(() => {
    const moyenne = total ? liste.reduce((s, a) => s + a.note, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map((n) => ({ n, pct: total ? Math.round((liste.filter((a) => a.note === n).length / total) * 100) : 0 }));
    const parVille: Record<string, { ville: string; n: number; x: number; y: number }> = {};
    for (const a of liste) {
      if (a.lat == null || a.lng == null) continue;
      parVille[a.ville] ??= { ville: a.ville, n: 0, x: borne(((a.lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * 100), y: borne(((BBOX.latMax - a.lat) / (BBOX.latMax - BBOX.latMin)) * 100) };
      parVille[a.ville].n += 1;
    }
    const colonnes: AvisPublic[][] = [[], [], []];
    liste.forEach((a, i) => colonnes[i % 3].push(a));
    return { moyenne, distribution, pins: Object.values(parVille), colonnes, defile: total >= 6 };
  }, [liste, total]);

  const moyenneTexte = moyenne.toFixed(1).replace('.', lang === 'fr' ? ',' : '.');
  const durees = ['52s', '64s', '58s'];

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-end">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          {total > 0
            ? <h2 className="titre mt-4">{t.titre_plein[0]}<br />{t.titre_plein[1]}</h2>
            : <h2 className="titre mt-4">{t.titre_vide}</h2>}
        </div>
        <p className="corps text-[18px]">{t.sous}</p>
      </div>

      {total === 0 ? (
        <div className="carte-donnee avenir mt-14">
          <div>
            <span className="etoiles-contour" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d={ETOILE} /></svg>)}
            </span>
            <h3 className="avenir-titre">{t.avenir_titre}</h3>
            <p className="corps mt-3 max-w-md text-[15px]">{t.avenir_texte}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="pill-invitation">{t.invitation}</span>
              <a href={rdvHref} className="btn-fantome">{t.parler} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <ol className="avenir-etapes">
            {t.etapes.map((e, i) => (
              <li key={e.titre}>
                <span className="donnee text-[12px] text-cuivre-clair">0{i + 1}</span>
                <h4 className="mt-2 text-[16px] font-medium text-etoile">{e.titre}</h4>
                <p className="corps mt-1.5 text-[13.5px]">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="plein">
          <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="carte-donnee agregat">
              <div className="flex items-baseline gap-4">
                <span className="donnee agregat-note">{moyenneTexte}</span>
                <div className="grid gap-1.5">
                  <Etoiles n={moyenne} lg />
                  <span className="donnee text-[12px] text-argent">{total} {t.avis_verifies}</span>
                </div>
              </div>
              <div className="grid gap-1.5">
                {distribution.map((d) => (
                  <div className="barre" key={d.n}><span>{d.n}★</span><span className="piste-barre"><span className="rempli" style={{ transform: `scaleX(${d.pct / 100})` }} /></span><span>{d.pct}%</span></div>
                ))}
              </div>
              <span className="marque"><span className="puce-verifie"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg></span>{t.authentifies}</span>
            </div>
            <div className="bande-carte" aria-label={t.carte_legende}>
              <span className="carte-legende">{t.carte_legende}</span>
              {pins.map((p) => (
                <div className="pin" key={p.ville} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  <span className="halo" /><span className="noyau" />
                  <span className="lab">{p.ville} · {p.n}</span>
                </div>
              ))}
              <span className="carte-note">{t.carte_note}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <span className="pill-invitation">{t.invitation}</span>
            {defile && <span className="donnee text-[11px] text-brume">↕ {t.astuce}</span>}
          </div>
          <div className={`mur mt-6${defile ? ' defile' : ''}`}>
            {colonnes.map((col, ci) => col.length > 0 && (
              <div className="colonne" key={ci}>
                <div className="piste" style={{ ['--duree' as string]: durees[ci] }}>
                  {col.map((a) => <Chip key={a.id} a={a} lang={lang} />)}
                  {defile && <div className="doublon contents" aria-hidden="true">{col.map((a) => <Chip key={`d-${a.id}`} a={a} lang={lang} />)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
