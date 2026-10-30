import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';

test('Accueil FR/EN : repères sans statistiques ni compteurs', () => {
  for (const [file, label, titles] of [
    ['dist/index.html', 'Votre accompagnement', ['Expertises complémentaires', 'Un interlocuteur dédié', 'Premier échange sans engagement', 'Partout en France']],
    ['dist/en/index.html', 'Your support', ['Complementary expertise', 'A dedicated contact', 'An initial conversation, no commitment', 'Throughout France']],
  ]) {
    const $ = load(readFileSync(file, 'utf8'));
    const band = $('#accompagnement');
    assert.equal(band.length, 1);
    assert.equal(band.attr('aria-label'), label);
    assert.equal(band.find('li').length, 4);
    assert.deepEqual(band.find('h2').toArray().map(el => $(el).text()), titles);
    assert.equal(band.find('[data-compte]').length, 0);
    assert.doesNotMatch(band.text(), /\d|%/);
    assert.equal($('.heros').nextAll('section').first().attr('id'), 'accompagnement');
  }
});

test('Accueil FR/EN : cinéma cliquable, accès et sections du cabinet conservés', () => {
  for (const [file, destination, title] of [
    ['dist/index.html', '/peak-pitch/', 'PEAK PITCH — Votre projet, prêt à présenter.'],
    ['dist/en/index.html', '/en/peak-pitch/', 'PEAK PITCH — Your project, ready to present.'],
  ]) {
    const $ = load(readFileSync(file, 'utf8'));
    const hero = $('.heros');
    assert.equal(hero.length, 1);
    assert.equal(hero.find('h1').text().trim(), title);
    const action = hero.find('a[data-pitch-discover]');
    assert.equal(action.attr('href'), destination);
    assert.ok(action.find('.pitch-cinema-cta').text().includes('PEAK PITCH'));
    assert.equal(action.find('video source').attr('src'), '/peak-pitch/peak-pitch-publicite-4k-60fps.mp4');
    assert.ok(action.find('video').is('[muted][playsinline]'));
    assert.equal(action.find('video').attr('preload'), 'auto');
    assert.equal(action.find('video').is('[loop], [controls]'), false);
    assert.equal(hero.find('[data-pitch-cinema-toggle]').length, 0);
    for (const anchor of ['#rdv', '#simulateur', '#expertises']) assert.equal(hero.find(`a[href="${anchor}"]`).length, 1);
    assert.equal(hero.find('[data-assurance]').attr('target'), '_blank');
    for (const section of ['accompagnement','mission','expertises','simulateur','methode','equipe','faq']) assert.equal($('#'+section).length,1);
    assert.equal(hero.find('#pitch-film-dialog').length, 0);
  }
});
