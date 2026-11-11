import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {ebookCheckoutURL} from '../src/lib/ebook-checkout.mjs';
const read=p=>readFileSync(p,'utf8');
test('Livre : titre, édition, prix, couverture et chapitres localisés',()=>{
 for(const [prefix,lang,pages,title]of [['','fr',80,'Financer son projet en France'],['en/','en',78,'Financing Your Project in France']]){
  const $=load(read(`dist/${prefix}livre/index.html`));
  assert.equal($('h1').text(),title);assert.equal($('.contents-parts details').length,4);assert.equal($('.contents-parts li').length,26);
  assert.match($('main').text(),/24[,.]90/);assert.match($('main').text(),new RegExp(pages+' pages|'+pages+'pages'));
  assert.equal($('.book-stage img').attr('src'),`/img/ebook/couverture-${lang}.webp`);
  assert.equal($('[data-ebook-buy]').length,0,'vente non activée');assert.ok($('[data-ebook-buy-disabled]').length>0);
  const graph=JSON.parse($('script[type="application/ld+json"]').html())['@graph'];const book=graph.find(n=>n['@type']==='Book');assert.equal(book.inLanguage,lang);assert.equal(book.numberOfPages,pages);assert.equal(book.offers.price,'24.90');
  const home=load(read(`dist/${prefix}index.html`));assert.ok(home(`a[href="/${prefix}livre/"]`).length>=4);assert.equal(home('#livre .teaser-cover img').length,1);
 }
});
test('Stripe : domaine officiel, langue et livraison protégée requis avant activation',()=>{
 const env={PUBLIC_EBOOK_SALES_ENABLED:'true',PUBLIC_EBOOK_STRIPE_LINK_FR:'https://buy.stripe.com/test_fr',PUBLIC_EBOOK_STRIPE_LINK_EN:'https://buy.stripe.com/test_en',PUBLIC_EBOOK_DELIVERY_URL:'https://livres.example.test/'};
 assert.equal(ebookCheckoutURL(env,'fr'),env.PUBLIC_EBOOK_STRIPE_LINK_FR);assert.equal(ebookCheckoutURL(env,'en'),env.PUBLIC_EBOOK_STRIPE_LINK_EN);
 for(const patch of [{PUBLIC_EBOOK_SALES_ENABLED:'false'},{PUBLIC_EBOOK_DELIVERY_URL:''},{PUBLIC_EBOOK_DELIVERY_URL:'http://example.test'},{PUBLIC_EBOOK_STRIPE_LINK_FR:'https://buy.stripe.com.evil.test/pay'},{PUBLIC_EBOOK_STRIPE_LINK_FR:'javascript:alert(1)'},{PUBLIC_EBOOK_STRIPE_LINK_FR:'https://user:pass@buy.stripe.com/pay'}])assert.equal(ebookCheckoutURL({...env,...patch},'fr'),null);
});
test('Extraits : aucun lien mort, seuls les PDF explicitement importés peuvent être publics',()=>{
 const assets=JSON.parse(read('src/data/ebook-assets.json'));
 for(const [lang,prefix]of [['fr',''],['en','en/']]){
  const $=load(read(`dist/${prefix}livre/index.html`));
  if(!assets[lang].excerpt){assert.equal($('[data-ebook-excerpt]').length,0);assert.ok($('.sample-pending').length);continue;}
  assert.equal(assets[lang].excerpt,`/extraits/ebook-${lang}.pdf`);assert.ok(existsSync('public'+assets[lang].excerpt));
  $('[data-ebook-excerpt]').each((_,a)=>assert.equal($(a).attr('href'),assets[lang].excerpt));
 }
});
test('Éditions intégrales : aucun répertoire privé dans le site exporté',()=>{
 const crawl=p=>readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?crawl(p+'/'+f.name):[p+'/'+f.name]);
 const files=crawl('dist');assert.equal(files.filter(p=>/\/private\//.test(p)).length,0);
 const manifest='private/ebook/manifest.json';
 if(existsSync(manifest)){
  const hashes=Object.values(JSON.parse(read(manifest))).map(x=>x.sha256);
  for(const p of files.filter(p=>p.endsWith('.pdf')))assert.ok(!hashes.includes(crypto.createHash('sha256').update(readFileSync(p)).digest('hex')),p);
 }
 for(const p of files.filter(p=>/\.(html|js)$/.test(p)))assert.doesNotMatch(read(p),/href=["'][^"']*private\/ebook|(?:sk_live_|sk_test_)[A-Za-z0-9]{12,}/,p);
});
