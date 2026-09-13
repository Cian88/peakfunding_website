import { load } from 'cheerio';
import seed from '../../public/api/observatoire-seed.json' with { type: 'json' };
import { OBSERVATOIRE_ORIGIN, OBSERVATOIRE_TTL, observationValide } from '../lib/observatoire.mjs';

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const months = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];

export function extraireObservation(html, now = new Date()) {
  const $ = load(html);
  const panel = $('.last-post-panel');
  if (panel.length !== 1) throw new Error('Publication mensuelle introuvable');
  const date = normalize(panel.find('.last-post-date').text()).match(/^([a-z]+) (\d{4})$/);
  if (!date || !months.includes(date[1])) throw new Error('Période invalide');
  const period = `${date[2]}-${String(months.indexOf(date[1])+1).padStart(2,'0')}`;
  const metric = (label, expression) => {
    const cards = panel.find('.last-post-card--metric').filter((_,el) => normalize($(el).find('h3').text()) === label);
    if (cards.length !== 1) throw new Error('Indicateur absent ou ambigu');
    const value = cards.find('.last-post-value').text().replace(/\s+/g,' ').trim().match(expression);
    if (!value) throw new Error('Valeur invalide');
    return Number(value[1].replace(',','.'));
  };
  const sourceUrl = panel.find('.last-post-actions a[href*="/publications/"]').first().attr('href');
  const data = { period, rate:metric('taux moyen', /^(\d{1,2}[,.]\d{1,2})\s*%$/), durationMonths:metric('duree moyenne', /^(\d{2,3})\s*mois$/), sourceUrl, checkedAt:now.toISOString(), stale:false };
  if (!observationValide(data, now)) throw new Error('Données incohérentes');
  return data;
}

export function creerLecteur({ fetcher = fetch, clock = () => new Date() } = {}) {
  let saved = seed, retryAt = 0, pending;
  return async () => {
    const now = clock();
    if (now.getTime() < retryAt) return saved;
    if (pending) return pending;
    pending = (async () => {
      try {
        const response = await fetcher(`${OBSERVATOIRE_ORIGIN}/`, { signal:AbortSignal.timeout(8000), redirect:'error', headers:{ Accept:'text/html' } });
        if (!response.ok) throw new Error('Source indisponible');
        const html = await response.text();
        if (html.length > 2000000) throw new Error('Réponse trop volumineuse');
        const data = extraireObservation(html, now);
        if (data.period < saved.period) throw new Error('Publication plus ancienne');
        saved = data;
        retryAt = now.getTime() + OBSERVATOIRE_TTL;
      } catch {
        saved = { ...saved, stale:true };
        retryAt = now.getTime() + 10 * 60 * 1000;
      }
      return saved;
    })();
    try { return await pending; } finally { pending = undefined; }
  };
}
export const lireObservatoire = creerLecteur();

// Same URL as the Hostinger PHP relay, for Astro development and local preview.
export function observatoireDevPlugin() {
  const attach = server => { server.middlewares.use('/api/observatoire.php', async (req,res) => {
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    if (!['GET','HEAD'].includes(req.method)) { res.statusCode=405; res.setHeader('Allow','GET, HEAD'); res.end(); return; }
    const data = await lireObservatoire();
    res.end(req.method === 'HEAD' ? '' : JSON.stringify(data));
  }); };
  return { name:'peak-observatoire', configureServer:attach, configurePreviewServer:attach };
}
