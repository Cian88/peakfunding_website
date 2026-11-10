import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { load } from 'cheerio';

const read = file => readFileSync(file, 'utf8');
const built = route => load(read(`dist/${route ? route + '/' : ''}index.html`));

test('Sept visuels V1 exacts, utilisés dans la liste ET dans chaque article', {skip: !existsSync('_source/site-actuel/image-slots-state.json') && 'Archive V1 locale non versionnée absente ; liens et images contrôlés par site.test.mjs'}, () => {
  const slots = JSON.parse(read('_source/site-actuel/image-slots-state.json'));
  const listing = built('actualites');
  // Quinze articles : les sept visuels V1 (avec emplacement d'origine) + les illustrations propres des
  // guides d'assurance ajoutés depuis (2026-09-16 et 2026-10-14), hors V1 donc sans data-v1-slot.
  assert.equal(listing('[data-article-visual]').length, 15);
  for (const slug of ['delegation-assurance', 'economie-assurance-emprunteur', 'refus-delegation-banque', 'assurance-emprunteur-sante', 'assurance-emprunteur-senior', 'assurance-emprunteur-metiers-sports-risque', 'quotite-assurance-emprunteur', 'assurance-emprunteur-investissement-locatif']) {
    assert.equal(listing(`[data-article-visual="${slug}"]`).attr('src'), `/img/article-v1-${slug}.webp`);
  }
  const images = listing('[data-article-visual][data-v1-slot]');
  assert.equal(images.length, 7);
  images.each((_, node) => {
    const image = listing(node);
    const slug = image.attr('data-article-visual');
    const slot = image.attr('data-v1-slot');
    const path = image.attr('src');
    assert.ok(readFileSync(`public${path}`).equals(Buffer.from(slots[slot].u.split(',')[1], 'base64')), slug);
    assert.doesNotMatch(image.attr('class'), /visuel-biton|visuel-traits-cuivre|grayscale|sepia/);
    assert.ok(image.attr('width') && image.attr('height'), slug);
    const article = built(`actualites/${slug}`);
    assert.equal(article('[data-article-visual]').attr('src'), path);
    assert.equal(article('#traits-cuivre, #biton-cuivre').length, 0);
    assert.doesNotMatch(article('[data-article-visual]').attr('class'), /visuel-biton|visuel-traits-cuivre|grayscale|sepia/);
  });
});

test('Assurance : même simulateur V1 ouvert dans un nouvel onglet, sans fenêtre intégrée', () => {
  const archive = '_source/site-actuel/expertise-insure.html';
  const url = 'https://www.magnolia.fr/comparer-assurance-pret-immobilier?utm_source=33656&whiteLabel=true&platform=direct';
  if (existsSync(archive)) assert.equal(load(read(archive))('iframe[src*="magnolia.fr"]').attr('src'), url);
  assert.ok(url);
  assert.equal(new URL(url).searchParams.get('utm_source'), '33656');
  for (const route of ['', 'expertises/insure', 'actualites/lemoine', 'actualites/delegation-assurance', 'actualites/refus-delegation-banque']) {
    const page = built(route);
    assert.ok(page('a[data-assurance]').length > 0, route);
    page('a[data-assurance]').each((_, node) => {
      assert.equal(page(node).attr('href'), url);
      assert.equal(page(node).attr('target'), '_blank');
      assert.equal(page(node).attr('rel'), 'noopener');
    });
    assert.equal(page('[data-assurance-frame], [data-assurance-dialog]').length, 0);
  }
});

test('Annotations : cartes uniformes, méthode illustrée, héros et simulateur responsive', () => {
  const home = built('');
  const listing = built('actualites');
  assert.equal(listing('.article-vedette').length, 0);
  assert.equal(listing('.article-carte .article-image.h-\\[180px\\]').length, 15);
  assert.equal(home('#methode .methode-schema').length, 4);
  assert.equal(home('[data-espaces] .espace-lien').length, 2);
  assert.equal(home('#simulateur form').length, 1);
  assert.equal(home('#simulateur [aria-live]').length, 1);
  assert.match(read('src/components/pages/AccueilCorps.astro'), /min-height: 100dvh/);
  assert.match(read('src/styles/global.css'), /grid-row:1 \/ -1/);
  assert.match(read('src/scripts/motion.ts'), /--fond-scroll/);
  assert.doesNotMatch(read('src/styles/global.css'), /data-fond-raccord/);
});

test('Espaces : widget client et portail mandataire conformes à la V1', () => {
  const archiveClient = '_source/site-actuel/espace-client.html';
  const client = built('espace-client');
  const clientURL = 'https://peakfunding.actelo.app/espace-client.js';
  assert.equal(client('[data-actelo-script]').attr('src'), clientURL);
  if (existsSync(archiveClient)) assert.equal(load(read(archiveClient))('script[src*="actelo.app"]').attr('src'), clientURL);
  assert.equal(client('#actelo-espace-client').length, 1);
  assert.equal(client('body').attr('data-page-navigation'), 'document');
  const archiveMandataire = '_source/site-actuel/espace-mandataire.html';
  const portal = 'https://peakfunding.actelo.fr/';
  if (existsSync(archiveMandataire)) assert.equal(load(read(archiveMandataire))('a[href*="actelo.fr"]').attr('href'), portal);
  assert.equal(built('espace-mandataire')('a[href*="actelo.fr"]').attr('href'), portal);
  const home = built('');
  assert.equal(home('[data-espaces] a[href="/espace-mandataire"]').length, 1);
  assert.equal(home('[data-menu] a[href="/espace-mandataire"]').length, 1);
  home('a[href="/espace-client"]').each((_, node) => assert.notEqual(home(node).attr('data-astro-reload'), undefined));
});

test('RDV : formulaire et agendas directs retirés du bundle livré, redirection de compatibilité présente', () => {
  const base = read('src/layouts/Base.astro');
  const scripts = readdirSync('dist/_astro').filter(f => f.endsWith('.js')).map(f => read(`dist/_astro/${f}`)).join('\n');
  assert.doesNotMatch(base, /import RendezVousModal|<RendezVousModal/);
  assert.match(base, /<AncienRdvRedirect/);
  assert.doesNotMatch(scripts, /formspree\.io\/f\/|calendar\.proton\.me\/bookings/);
  assert.ok(scripts.includes('/peak-exchange/'));
});

test('Homogénéité : une image de travail dans Mission, zones partenaires et voile mobile', () => {
  const home = built('');
  assert.equal(home('#mission img').length, 1);
  assert.equal(home('#mission img').attr('src'), '/img/cabinet-travail.webp');
  assert.equal(home('.partenaire-marque').length, 2);
  assert.equal(home('[data-menu-voile]').length, 1);
  assert.match(read('src/styles/global.css'), /backdrop-filter: blur\(10px\)/);
  assert.match(read('src/scripts/motion.ts'), /el\.inert = !!menu\?\.open/);
});

test('Accueil : ouverture et fin sombres, méthode sombre entre les sections claires', () => {
  const home = built('');
  const sections = home('main > section');
  // Depuis la section avis (2026-09-13), le fond reste sombre jusqu'au pied de page : FAQ et bandeau final sombres.
  assert.equal(sections.filter('.clair').length, 3);
  assert.deepEqual(sections.filter('.clair').toArray().map(node => home(node).attr('id')), ['expertises', 'simulateur', 'equipe']);
  const tones = sections.toArray().map(node => home(node).hasClass('clair'));
  assert.deepEqual(tones, [false, false, false, false, true, true, false, true, false, false, false]);
  assert.equal(tones.slice(1).filter((tone, i) => tone !== tones[i]).length, 4);
  assert.equal(home('footer.sombre').length, 1);
  assert.equal(home('#simulateur .surface-claire').length, 1);
  assert.equal(home('#methode .surface-claire').length, 0);
  assert.equal(home('.heros .observatoire-widget').length, 0);
  assert.equal(home('#simulateur .simulator-panel .observatoire-widget').length, 1);
  assert.equal(home('[data-expertise-reveal]').length, 4);
  assert.equal(home('#expertises .carte-claire').length, 0);
  assert.equal(home('#expertises .expertise-lien').length, 4);
  assert.equal(home('.chapitre-filet[aria-hidden="true"]').length, 4); // + filet d'entrée de la section avis
});

test('CSA : valeurs exactes sans JavaScript, copie accessible indépendante du comptage', () => {
  const home = built('');
  const mesures = home('#simulateur .observatoire-mesures');
  const data = JSON.parse(readFileSync('dist/api/observatoire-seed.json','utf8'));
  const attendu = [data.rate.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' %',data.durationMonths+' mois'];
  assert.deepEqual(mesures.find('dd > .sr-only').toArray().map(el=>home(el).text()), attendu);
  assert.deepEqual(mesures.find('.observatoire-valeur[aria-hidden="true"]').toArray().map(el=>home(el).text()), attendu);
  assert.equal(mesures.find('[aria-live], [role="status"]').length,0);
});

test('Les quatre expertises conservent leurs images sans filtre ni voile coloré', () => {
  const home = built('');
  for (const slug of ['estate', 'pro', 'pim', 'insure']) {
    for (const page of [home, built(`expertises/${slug}`)]) {
      const image = page(`img[src="/img/ambiance-${slug}.webp"]`);
      assert.equal(image.length, 1);
      assert.doesNotMatch(image.attr('class'), /visuel-biton|visuel-traits-cuivre|grayscale|sepia/);
      assert.equal(image.parent().find('.mix-blend-multiply').length, 0);
    }
  }
});
