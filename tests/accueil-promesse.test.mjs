import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';

test('Accueil FR/EN : repères sans statistiques ni compteurs', () => {
  for (const [file, label, titles] of [
    ['dist/index.html', 'Votre accompagnement', ['Expertises complémentaires', 'Un interlocuteur dédié', 'Analyse avec PEAK EXCHANGE', 'Partout en France']],
    ['dist/en/index.html', 'Your support', ['Complementary expertise', 'A dedicated contact', 'Analysis with PEAK EXCHANGE', 'Throughout France']],
  ]) {
    const $ = load(readFileSync(file, 'utf8'));
    const band = $('#accompagnement');
    assert.equal(band.length, 1);
    assert.equal(band.attr('aria-label'), label);
    assert.equal(band.find('li').length, 4);
    assert.deepEqual(band.find('h2').toArray().map(el => $(el).text()), titles);
    assert.equal(band.find('[data-compte]').length, 0);
    assert.doesNotMatch(band.text(), /\b(?:500|95|72)\b|%/);
    assert.match(band.text(), /299/);
    assert.ok(band.find('a[href="#simulateur"]').length);
  }
});

test('Accueil FR/EN : le courtage, les publics et les deux parcours sont explicites', () => {
  for (const [prefix, title, audience] of [
    ['', 'Financement & assurance emprunteur.', /particuliers.*dirigeants.*investisseurs/],
    ['en/', 'Financing & borrower insurance.', /individuals.*business owners.*investors/],
  ]) {
    const $ = load(readFileSync(`dist/${prefix}index.html`, 'utf8'));
    const hero = $('.atlas-cover');
    assert.equal(hero.find('h1').text().replace(/\s+/g, ' ').trim(), title);
    assert.match(hero.find('.cover-lead').text(), audience);
    assert.equal(hero.find('.cover-actions a').first().attr('href'), '#simulateur');
    assert.equal(hero.find('.cover-actions a').last().attr('href'), `/${prefix}peak-exchange/`);
    assert.match(hero.text(), /ORIAS.*24002546.*ACPR/);
    assert.equal(hero.find('.map-body img').attr('src'), '/cartographie/relief.svg');
    assert.equal($('#expertises [data-assurance]').attr('target'), '_blank');
  }
});
