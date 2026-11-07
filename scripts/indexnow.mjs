// Signale les URL du site à IndexNow (Bing, Yandex, Seznam, Naver…). Bing alimente la recherche de ChatGPT
// et de Copilot : c'est le moyen le plus rapide d'y faire (ré)indexer une page. À lancer APRÈS une mise en
// ligne effective (le fichier de clé doit être servi par https://peakfunding.eu) :
//   npm run build && npm run indexnow                       → toutes les URL des sitemaps + llms.txt
//   npm run indexnow -- /expertises/ /en/actualites/x/      → seulement ces pages (après une modification ciblée)
//   npm run indexnow -- --essai                             → affiche la liste sans rien envoyer
import { readFileSync, readdirSync } from 'node:fs';

export const CLE = 'cb099be1da4dbcd43da885ad30aa0fe4'; // servie par public/cb099be1da4dbcd43da885ad30aa0fe4.txt
const site = new URL('https://peakfunding.eu');
const args = process.argv.slice(2);
const essai = args.includes('--essai');
const chemins = args.filter((a) => !a.startsWith('--'));

let urls;
if (chemins.length) {
  urls = chemins.map((c) => new URL(c, site).href);
} else {
  const dist = new URL('../dist/', import.meta.url);
  const sitemaps = readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (!sitemaps.length) throw new Error('Aucun sitemap dans dist/ : lancer « npm run build » d’abord.');
  urls = sitemaps.flatMap((f) => [...readFileSync(new URL(f, dist), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  urls.push(new URL('/llms.txt', site).href);
}
urls = [...new Set(urls)].filter((u) => new URL(u).host === site.host);

if (essai) {
  console.log(urls.join('\n'));
  console.log(`${urls.length} URL (essai, rien n'a été envoyé)`);
} else {
  const reponse = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: site.host, key: CLE, keyLocation: new URL(`/${CLE}.txt`, site).href, urlList: urls }),
  });
  // 200 = reçu ; 202 = reçu, clé en cours de validation ; 403 = clé introuvable en ligne ; 422 = URL hors du domaine.
  console.log(`IndexNow : ${reponse.status} ${reponse.statusText} — ${urls.length} URL envoyées`);
  if (!reponse.ok) process.exitCode = 1;
}
