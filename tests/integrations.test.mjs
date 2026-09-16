import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'cheerio';

const read = file => readFileSync(file, 'utf8');
const built = route => load(read(`dist/${route ? route + '/' : ''}index.html`));

test('Sept visuels V1 exacts, utilisés dans la liste ET dans chaque article', () => {
  const slots = JSON.parse(read('_source/site-actuel/image-slots-state.json'));
  const listing = built('actualites');
  // Huit articles : les sept visuels V1 (avec emplacement d'origine) + l'illustration propre de l'article
  // « délégation d'assurance » (2026-09-16), hors V1 donc sans data-v1-slot.
  assert.equal(listing('[data-article-visual]').length, 8);
  assert.equal(listing('[data-article-visual="delegation-assurance"]').attr('src'), '/img/article-v1-delegation-assurance.webp');
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
  const v1 = load(read('_source/site-actuel/expertise-insure.html'));
  const url = v1('iframe[src*="magnolia.fr"]').attr('src');
  assert.ok(url);
  assert.equal(new URL(url).searchParams.get('utm_source'), '33656');
  for (const route of ['', 'expertises/insure', 'actualites/lemoine']) {
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
  assert.equal(listing('.article-carte .article-image.h-\\[180px\\]').length, 8);
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
  const v1Client = load(read('_source/site-actuel/espace-client.html'));
  const client = built('espace-client');
  assert.equal(client('[data-actelo-script]').attr('src'), v1Client('script[src*="actelo.app"]').attr('src'));
  assert.equal(client('#actelo-espace-client').length, 1);
  assert.equal(client('body').attr('data-page-navigation'), 'document');
  const v1Mandataire = load(read('_source/site-actuel/espace-mandataire.html'));
  const portal = v1Mandataire('a[href*="actelo.fr"]').attr('href');
  assert.equal(built('espace-mandataire')('a[href*="actelo.fr"]').attr('href'), portal);
  const home = built('');
  assert.equal(home('[data-espaces] a[href="/espace-mandataire"]').length, 1);
  assert.equal(home('[data-menu] a[href="/espace-mandataire"]').length, 1);
  home('a[href="/espace-client"]').each((_, node) => assert.notEqual(home(node).attr('data-astro-reload'), undefined));
});

test('Formspree et agendas Proton restent présents dans le code ET le bundle livré', () => {
  const source = read('src/components/react/PriseRendezVous.tsx');
  const scripts = readdirSync('dist/_astro').filter(f => f.endsWith('.js')).map(f => read(`dist/_astro/${f}`)).join('\n');
  for (const endpoint of ['https://formspree.io/f/mykrggwk', 'https://formspree.io/f/xkjnbpod']) {
    assert.ok(source.includes(endpoint));
    assert.ok(scripts.includes(endpoint));
    assert.ok(read('_source/site-actuel/index.html').includes(endpoint));
  }
  assert.match(source, /fetch\(endpoint, \{ method: 'POST'/);
  assert.match(source, /body: JSON\.stringify\(data\)/);
  assert.match(source, /if \(!r\.ok\) sendMail\(\)/);
  assert.ok(scripts.includes('https://calendar.proton.me/bookings'));
  assert.match(source, /setStep\(3\)/);
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
  assert.deepEqual(sections.filter('.clair').toArray().map(node => home(node).attr('id')), ['simulateur', 'expertises', 'equipe']);
  const tones = sections.toArray().map(node => home(node).hasClass('clair'));
  assert.deepEqual(tones, [false, false, false, true, true, false, true, false, false, false]);
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
  assert.deepEqual(mesures.find('dd > .sr-only').toArray().map(el=>home(el).text()), ['3,31 %','252 mois']);
  assert.deepEqual(mesures.find('.observatoire-valeur[aria-hidden="true"]').toArray().map(el=>home(el).text()), ['3,31 %','252 mois']);
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
