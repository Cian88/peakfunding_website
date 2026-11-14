import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {load} from 'cheerio';
import {protectPublicEmails} from '../src/lib/public-contact.mjs';
import {rdvDestination,isLegacyRdvHash} from '../src/lib/rdv-route.mjs';
const read=p=>readFileSync(p,'utf8');
test('EXCHANGE : liens FR/EN, prix autonome, page sans agenda ni ancienne offre',()=>{
 for(const prefix of ['','en/']){
  const home=load(read(`dist/${prefix}index.html`)),page=load(read(`dist/${prefix}peak-exchange/index.html`));
  assert.ok(home(`a[href="/${prefix}peak-exchange/"]`).length>=4);
  assert.match(page('main').text(),/299/);assert.doesNotMatch(page('main').text(),/199|PEAK PITCH|298/);
  assert.equal(page('main a[href*="calendar.proton"]').length,0);
  assert.ok(page('main a[href="#reservation"]').length,'mode préouverture sans URL du serveur');
  assert.match(page('main').text(),/politique|political/);
 }
});
test('RDV : aucune page livrée ne mène à l’ancien formulaire ou à un agenda gratuit',()=>{
 const crawl=p=>readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?crawl(p+'/'+f.name):[p+'/'+f.name]);
 for(const file of crawl('dist').filter(p=>/\.(html|js)$/.test(p))){
  const text=read(file);
  assert.doesNotMatch(text,/calendar\.proton\.me\/bookings|formspree\.io\/f\//,file);
  if(!file.endsWith('.html'))continue;
  const $=load(text);
  assert.equal($('a[href$="#rdv"],button[data-rdv],dialog.rdv-dialog,form#rdv-parcours').length,0,file);
  const publishedCopy = `${$('body').text()} ${$('meta[name="description"]').attr('content') ?? ''}`;
  assert.doesNotMatch(publishedCopy,/premier échange gratuit|free first consultation|free 30-minute|ne vous coûtent rien|eligibility review cost you nothing/i,file);
 }
 assert.equal(rdvDestination('/'),'/peak-exchange/');assert.equal(rdvDestination('/actualites/sci/'),'/peak-exchange/');assert.equal(rdvDestination('/en/actualites/sci/'),'/en/peak-exchange/');
 assert.equal(isLegacyRdvHash('#RDV'),true);assert.equal(isLegacyRdvHash('#simulateur'),false);
});
test('EXCHANGE : déduction conditionnelle expliquée sur l’offre, l’accueil et les conditions',()=>{
 for(const prefix of ['','en/']){
  const offer=load(read(`dist/${prefix}peak-exchange/index.html`));
  const credit=offer('.exchange-credit').text();assert.match(credit,/299/);assert.match(credit,prefix?/deducted/i:/déduits/);assert.match(credit,prefix?/agrees to support|viable/:/accepte|défendable/);
  const home = load(read(`dist/${prefix}index.html`));
  const faq = home('main details').filter((_, item) => /Combien coûte votre intervention|How much does your service cost/.test(home(item).find('summary').text()));
  assert.match(faq.text(), /PEAK EXCHANGE.*299/);
  assert.match(faq.text(), prefix ? /comprehensive.*on your own.*another brokerage firm.*deducted.*funds are released/ : /note de conseil exhaustive.*poursuivre votre projet seul.*autre cabinet de courtage.*déduits.*déblocage des fonds/);
  assert.match(offer('.exchange-note').text(), prefix ? /another brokerage firm/ : /autre cabinet de courtage/);
 }
 assert.match(load(read('dist/conditions-peak-exchange/index.html'))('main').text(),/défendable/);
});
test('Contact : aucun e-mail du cabinet en clair dans les pages, JS et JSON-LD distribués',()=>{
 const crawl=p=>readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?crawl(p+'/'+f.name):[p+'/'+f.name]);
 for(const file of crawl('dist').filter(p=>/\.(html|js|json|txt)$/.test(p)))assert.doesNotMatch(read(file),/[\w.+-]+@peakfunding\.eu/i,file);
 const $=load(read('dist/mentions-legales/index.html'));assert.ok($('[data-protected-email]').length>=2);assert.ok($('a[href="/contact/#administratif"]').length>=2);
});
test('Contact : transformation conserve les autres adresses et enlève le mailto public du cabinet',()=>{
 const html=protectPublicEmails('<p>contact@peakfunding.eu</p><a href="mailto:contact@peakfunding.eu">contact@peakfunding.eu</a><p>mediateur@example.test</p>');
 assert.doesNotMatch(html,/@peakfunding\.eu|mailto:/);assert.match(html,/mediateur@example.test/);assert.equal(load(html)('[data-protected-email]').length,2);
});
