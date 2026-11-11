import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {stancerServiceURL} from '../src/lib/services-checkout.mjs';
import {ebookCheckoutURL} from '../src/lib/ebook-checkout.mjs';
const read=p=>readFileSync(p,'utf8');

test('Services : trois offres regroupées avant Vos espaces, liens FR/EN et vente fermée',()=>{
 for(const prefix of ['', 'en/']){
  const html=load(read('dist/'+prefix+'index.html'));
  const services=html('header [data-services]');assert.equal(services.length,1);
  assert.equal(services.next('[data-espaces]').length,1);
  assert.equal(services.find('a').length,3);
  assert.deepEqual(services.find('a').toArray().map(a=>html(a).attr('href')),[`/${prefix}livre/`,`/${prefix}peak-pitch/`,`/${prefix}peak-exchange/`]);
  assert.equal(html('header nav[aria-label="Navigation principale"] a[href$="/livre/"]').length,0);
  for(const slug of ['livre','peak-pitch','peak-exchange'])assert.equal(html(`header [data-services-mobile] a[href="/${prefix}${slug}/"]`).length,1);
  for(const slug of ['livre','peak-pitch','peak-exchange']){
   const page=load(read(`dist/${prefix}${slug}/index.html`));
   assert.equal(page('main a[href*="/paiement.html"], main a[href*="/exchange-paiement.html"], main [data-ebook-buy]').length,0,slug);
  }
  const pitch=load(read(`dist/${prefix}peak-pitch/index.html`));
  assert.equal(pitch('main #peak-exchange').length,0);assert.doesNotMatch(pitch('main').text(),/199|298|PEAK EXCHANGE/);
 }
});

test('Stancer : aucune des trois offres ne peut ouvrir sans validation explicite',()=>{
 const env={PUBLIC_STANCER_READY:'false',PUBLIC_PEAK_PITCH_ENABLED:'true',PUBLIC_PEAK_PITCH_URL:'https://checkout.example.test',PUBLIC_PEAK_EXCHANGE_URL:'https://checkout.example.test',PUBLIC_EBOOK_SALES_ENABLED:'true',PUBLIC_EBOOK_SERVICE_URL:'https://checkout.example.test'};
 assert.equal(stancerServiceURL(env,'pitch'),null);assert.equal(stancerServiceURL(env,'exchange'),null);assert.equal(ebookCheckoutURL(env,'fr'),null);
 assert.equal(stancerServiceURL({...env,PUBLIC_STANCER_READY:'true'},'pitch'),'https://checkout.example.test');
 assert.equal(stancerServiceURL({...env,PUBLIC_STANCER_READY:'true',PUBLIC_PEAK_PITCH_ENABLED:'false'},'pitch'),null);
 for(const url of ['http://example.test','https://user:password@example.test','javascript:alert(1)'])assert.equal(stancerServiceURL({...env,PUBLIC_STANCER_READY:'true',PUBLIC_PEAK_EXCHANGE_URL:url},'exchange'),null);
});

test('Accueil vidéo : fichier propre, lecture automatique sans boucle, découverte et réservation séparées',()=>{
 for(const prefix of ['', 'en/']){
  const html=load(read('dist/'+prefix+'index.html'));const hero=html('[data-pitch-cinema]');
  if(!hero.length)continue; // La vidéo est un réglage explicite du clone local.
  const film=hero.find('video');assert.notEqual(film.attr('autoplay'),undefined);assert.notEqual(film.attr('muted'),undefined);assert.equal(film.attr('controls'),undefined);assert.equal(film.attr('loop'),undefined);
  assert.equal(film.attr('poster'),'/peak-pitch/pitch-hero-poster.jpg');
  assert.equal(hero.find('[data-pitch-discover]').attr('href'),`/${prefix}peak-pitch/`);
  assert.ok(hero.find(`a[href="/${prefix}peak-exchange/"]`).length);
  assert.equal(hero.find('a[href="#rdv"],.heros-photo').length,0);
 }
 const source=read('src/components/PeakPitchHero.astro');assert.match(source,/finished = true; video\.pause/);assert.ok(source.includes('header [data-services]'));
});
