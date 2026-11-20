import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, join } from 'node:path';
import { load } from 'cheerio';
import { cleTheme, dateISO, trierArticles } from '../src/lib/editorial.mjs';
import { documentAvecSommaire } from '../src/lib/document.mjs';
import { protectPublicEmails } from '../src/lib/public-contact.mjs';

const read = file => readFileSync(file, 'utf8');
const articles = JSON.parse(read('src/data/articles.json'));
const normalize = value => value.replace(/\s+/g, ' ').trim();
const protectedFiles = {
  'src/contenu-legal/mentions-legales.html': '3CEF26FF077336B147EB9537FD27F7989DB4367DCA649B94FCCF6F53731EC9D2',
  'src/contenu-legal/politique-de-confidentialite.html': '5E3C978D53BAF8F9B6CB8C340B225C064350ECB9CA06E017A654852DDB4EFD38',
  'src/contenu-legal/cgu.html': 'B07104AAE69BD8BEA3F2822E26364AF0FF34C24B31064CE3BC4C1099233CE881',
  // Les interfaces évoluent ; calculs et charge utile sont protégés dans ergonomie.test.mjs.
};

test('Les sources légales approuvées restent identiques hors fins de ligne Windows', () => {
  for (const [file, hash] of Object.entries(protectedFiles)) assert.equal(createHash('sha256').update(read(file).replace(/\r\n/g, '\n')).digest('hex').toUpperCase(), hash, file);
});
test('Les thèmes accentués correspondent aux filtres CSS', () => {
  assert.equal(cleTheme('RÉSIDENCE PRINCIPALE'), 'residence-principale');
  assert.equal(cleTheme('TAUX & MARCHÉ'), 'taux-marche');
  assert.equal(cleTheme('INVESTISSEMENT LOCATIF'), 'investissement-locatif');
  assert.equal(cleTheme('ASSURANCE EMPRUNTEUR'), 'assurance-emprunteur');
});
test('Tri chronologique réel, sans mutation des données source', () => {
  assert.equal(dateISO('1er juillet 2026'), '2026-07-01');
  assert.equal(dateISO('28 février 2026'), '2026-02-28');
  assert.equal(dateISO('31 février 2026'), '');
  assert.equal(dateISO('inconnue'), '');
  const before = JSON.stringify(articles);
  assert.deepEqual(trierArticles(articles).map(a => a.slug), ['preparer-dossier-pret-immobilier', 'pieces-dossier-pret-immobilier', 'economie-assurance-emprunteur', 'refus-delegation-banque', 'assurance-emprunteur-sante', 'assurance-emprunteur-senior', 'assurance-emprunteur-metiers-sports-risque', 'quotite-assurance-emprunteur', 'assurance-emprunteur-investissement-locatif', 'delegation-assurance', 'capacite-locatif', 'taux', 'sci', 'primo', 'enchainer', 'lemoine', 'non-resident']);
  assert.equal(JSON.stringify(articles), before);
});
test('Le sommaire ne réécrit pas le HTML source et produit des ancres uniques', () => {
  const source = '<p>Texte &amp; espaces.</p>\n<h2>Échéances</h2><p>Un crédit.</p><h2>Échéances</h2><h2 id="original">Déjà ancré</h2>';
  const doc = documentAvecSommaire(source);
  assert.equal(doc.html.replace(/ id="lecture-[^"]+"/g, ''), source);
  assert.deepEqual(doc.headings.map(h => h.id), ['lecture-echeances', 'lecture-echeances-2', 'original']);
});
test('Les textes légaux et les articles rendus conservent chaque mot et la ponctuation', () => {
  for (const file of Object.keys(protectedFiles).filter(f => f.endsWith('.html'))) {
    const slug = file.split('/').pop().replace('.html', '');
    const built = load(read(`dist/${slug}/index.html`));
    assert.equal(normalize(built('.legal-content').text()), normalize(load(protectPublicEmails(read(file)), null, false).text()), slug);
  }
  for (const article of articles) {
    const built = load(read(`dist/actualites/${article.slug}/index.html`));
    assert.equal(normalize(built('.article-content').text()), normalize(load(read(`src/contenu-articles/${article.slug}.html`), null, false).text()), article.slug);
  }
});
test('Les 76 pages construites (FR + EN) ont leurs liens, images, titres et ancres', () => {
  const crawl = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? crawl(join(dir, entry.name)) : [join(dir, entry.name)]);
  const pages = crawl('dist').filter(file => file.endsWith('.html'));
  assert.equal(pages.length, 76);
  const failures = [];
  for (const file of pages) {
    const $ = load(read(file));
    const route = '/' + relative('dist', file).replaceAll('\\', '/').replace(/index\.html$/, '');
    assert.equal($('h1').length, 1, `${route}: un seul h1`);
    assert.equal($('main').length, 1, `${route}: un seul main`);
    assert.ok($('title').text().length > 5, route);
    assert.ok($('meta[name="description"]').attr('content'), route);
    const ids = $('[id]').map((_, el) => $(el).attr('id')).get();
    assert.equal(new Set(ids).size, ids.length, `${route}: IDs uniques`);
    $('a[href], img[src]').each((_, node) => {
      const value = $(node).attr(node.name === 'img' ? 'src' : 'href');
      const url = new URL(value, `https://peakfunding.eu${route}`);
      if (url.origin !== 'https://peakfunding.eu') return;
      // La page 404 française est servie depuis dist/404.html (convention GitHub Pages), pas depuis un dossier.
      const target = url.pathname === '/404/' ? resolve('dist', '404.html') : resolve('dist', '.' + decodeURIComponent(url.pathname));
      const destination = existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target;
      if (!existsSync(destination)) { failures.push(`${route} -> ${value}`); return; }
      if (url.hash && url.hash !== '#rdv' && destination.endsWith('.html')) {
        const doc = load(read(destination));
        if (!doc('[id]').toArray().some(el => doc(el).attr('id') === decodeURIComponent(url.hash.slice(1)))) failures.push(`${route} -> ${value}: ancre absente`);
      }
      if (node.name === 'img') assert.notEqual($(node).attr('alt'), undefined, `${route}: alt absent`);
    });
  }
  assert.deepEqual(failures, []);
});
