/* Référencement : données structurées, plan du site, robots et llms.txt sur le build. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';

const dist = 'dist';
const pages = [];
const parcourir = dir => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) parcourir(p); else if (f.endsWith('.html')) pages.push(p); } };
if (existsSync(dist)) parcourir(dist);
const html = p => readFileSync(p, 'utf8');
const privee = p => /[\\/](avis|404)[\\/]|404\.html$/.test(p);
const graphe = p => {
  const scripts = load(html(p))('script[type="application/ld+json"]');
  assert.equal(scripts.length, 1, `${p} : un seul bloc JSON-LD attendu`);
  const doc = JSON.parse(scripts.first().html());
  assert.equal(doc['@context'], 'https://schema.org');
  return doc['@graph'];
};
const types = g => g.flatMap(n => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]));

test('Le build existe', () => { assert.ok(pages.length > 30, 'lancer `npm run build` avant les tests'); });

test('Chaque page publique porte la fiche du cabinet, le site et sa page ; les pages privées rien', () => {
  for (const p of pages) {
    const $ = load(html(p));
    if (privee(p)) { assert.equal($('script[type="application/ld+json"]').length, 0, p); continue; }
    const g = graphe(p);
    const orga = g.find(n => n['@id'] === 'https://peakfunding.eu/#organisation');
    assert.ok(orga, `${p} : organisation absente`);
    assert.equal(orga.identifier.find(i => i.propertyID === 'ORIAS').value, '24002546');
    assert.equal(orga.address.addressLocality, 'Neuilly-sur-Seine');
    assert.equal(orga.hasOfferCatalog.itemListElement.length, 4);
    assert.ok(types(g).includes('WebSite') && types(g).some(t => /Page$/.test(t)), `${p} : WebSite/WebPage absents`);
    assert.equal($('meta[property="og:site_name"]').attr('content'), 'PEAK FUNDING');
    assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
    assert.ok($('link[rel="canonical"]').attr('href')?.startsWith('https://peakfunding.eu/'), `${p} : canonique`);
    assert.equal($('link[rel="alternate"][hreflang]').length, 3, `${p} : hreflang fr/en/x-default`);
  }
});

test('Accueil : FAQ structurée en français et en anglais', () => {
  for (const [p, n] of [['dist/index.html', 5], ['dist/en/index.html', 5]]) {
    const faq = graphe(p).find(x => x['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, n, p);
    assert.ok(faq.mainEntity.every(q => q.name && q.acceptedAnswer.text.length > 40));
  }
});

test('Expertises : service relié au catalogue, FAQ et fil d’Ariane ; l’assurance emprunteur est nommée', () => {
  for (const lang of ['', 'en/']) for (const slug of ['estate', 'pro', 'pim', 'insure']) {
    const p = `dist/${lang}expertises/${slug}/index.html`;
    const g = graphe(p);
    const service = g.find(x => x['@type'] === 'Service');
    assert.equal(service['@id'], `https://peakfunding.eu/${lang}expertises/${slug}/#service`, p);
    assert.equal(service.provider['@id'], 'https://peakfunding.eu/#organisation');
    assert.ok(g.find(x => x['@type'] === 'FAQPage').mainEntity.length >= 3, p);
    assert.equal(g.find(x => x['@type'] === 'BreadcrumbList').itemListElement.length, 2, p);
    assert.ok(/emprunteur|borrower/i.test(load(html(p))('title').text()) === (slug === 'insure'), `${p} : titre`);
  }
});

test('Articles : Article daté, auteur, image dimensionnée, Open Graph article', () => {
  for (const lang of ['', 'en/']) for (const slug of ['lemoine', 'capacite-locatif', 'sci']) {
    const p = `dist/${lang}actualites/${slug}/index.html`;
    const a = graphe(p).find(x => x['@type'] === 'Article');
    assert.match(a.datePublished, /^\d{4}-\d{2}-\d{2}$/, p);
    assert.ok(a.author.name && a.image.width > 0 && a.image.height > 0, p);
    assert.equal(a.publisher['@id'], 'https://peakfunding.eu/#organisation');
    const $ = load(html(p));
    assert.equal($('meta[property="og:type"]').attr('content'), 'article', p);
    assert.equal($('meta[property="article:published_time"]').attr('content'), a.datePublished, p);
  }
  for (const p of ['dist/actualites/index.html', 'dist/en/actualites/index.html']) {
    const g = graphe(p);
    assert.equal(g.find(x => x['@type'] === 'ItemList').itemListElement.length, 7, p);
    assert.ok(types(g).includes('CollectionPage'), p);
  }
});

test('Le plan du site exclut les pages privées et déclare les alternates de langue', () => {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  assert.doesNotMatch(xml, /\/avis\/|\/404\//);
  assert.match(xml, /xhtml:link rel="alternate" hreflang="en-GB" href="https:\/\/peakfunding\.eu\/en\/expertises\/insure\/"/);
  assert.match(xml, /hreflang="fr-FR" href="https:\/\/peakfunding\.eu\/expertises\/insure\/"/);
  assert.match(xml, /<loc>https:\/\/peakfunding\.eu\/actualites\/lemoine\/<\/loc><lastmod>2026-06-05/);
  assert.doesNotMatch(xml, /<loc>https:\/\/peakfunding\.eu\/<\/loc><lastmod>/); // pas de fausse date sur les pages sans historique
  assert.ok(existsSync('dist/sitemap-index.xml'));
});

test('robots.txt ouvre le site aux robots IA et ferme /avis/ ; llms.txt décrit le cabinet', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot']) assert.match(robots, new RegExp(`User-agent: ${bot}`));
  assert.match(robots, /Disallow: \/avis\//);
  assert.match(robots, /Sitemap: https:\/\/peakfunding\.eu\/sitemap-index\.xml/);
  const llms = readFileSync('dist/llms.txt', 'utf8');
  assert.match(llms, /^# PEAK FUNDING/);
  for (const attendu of ['24002546', 'assurance emprunteur', 'loi Lemoine', 'LBO', 'marchands de biens', 'https://peakfunding.eu/expertises/insure/', '## English']) assert.ok(llms.includes(attendu), attendu);
});
