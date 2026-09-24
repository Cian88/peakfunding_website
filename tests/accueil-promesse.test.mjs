import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';

test('Accueil FR/EN : spécialités explicites, signature et actions conservées', () => {
  for (const [file, title, description] of [
    ['dist/index.html', 'Votre financement, pensé dans son ensemble.', 'Investissement locatif, SCI, reprise d’entreprise, opérations de marchands de biens : PEAK FUNDING structure et négocie votre financement, partout en France.'],
    ['dist/en/index.html', 'Your financing, thought through as a whole.', 'Buy-to-let investments, French property companies (SCI), business acquisitions and property trading projects: PEAK FUNDING structures and negotiates your financing throughout France.'],
  ]) {
    const $ = load(readFileSync(file, 'utf8'));
    const hero = $('.heros');
    assert.equal(hero.find('h1').text().replace(/\s+/g, ' ').trim(), title);
    assert.ok(hero.find('.heros-texte > p').toArray().some(el => $(el).text() === description));
    assert.equal(hero.find('.heros-photo').attr('src'), '/img/hero-1600.webp');
    assert.equal(hero.find('.btn-cuivre').attr('href'), '#rdv');
    assert.equal(hero.find('.btn-fantome').attr('href'), '#simulateur');
    assert.equal(hero.find('[data-assurance]').attr('target'), '_blank');
  }
});
