import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {load} from 'cheerio';
import {salesIndexable} from '../src/lib/sales-indexing.mjs';
const read=p=>readFileSync(p,'utf8');
const routes=['/peak-pitch/','/en/peak-pitch/','/livre/','/peak-exchange/','/contact/','/en/livre/','/en/peak-exchange/','/en/contact/'];
const open={PUBLIC_PEAK_PITCH_ENABLED:'true',PUBLIC_PEAK_PITCH_URL:'https://pitch.example.test',PUBLIC_STANCER_READY:'true',PUBLIC_EBOOK_SALES_ENABLED:'true',PUBLIC_EBOOK_SERVICE_URL:'https://books.example.test',PUBLIC_PEAK_EXCHANGE_ENABLED:'true',PUBLIC_PEAK_EXCHANGE_URL:'https://consult.example.test'};
test('Indexation : chaque vente reste fermée sans activation et URL valide',()=>{
 for(const route of routes){
  for(const env of [{},{...open,PUBLIC_STANCER_READY:'false'}])assert.equal(salesIndexable(route,env),false,route);
  assert.equal(salesIndexable(route,open),true,route);
  assert.equal(salesIndexable(route.replace(/\/$/,''),open),true,route);
 }
 for(const route of routes.filter(r=>r.includes('livre'))){
  assert.equal(salesIndexable(route,{...open,PUBLIC_EBOOK_SALES_ENABLED:'false'}),false);
  assert.equal(salesIndexable(route,{...open,PUBLIC_EBOOK_SERVICE_URL:'http://unsafe.test'}),false);
  assert.equal(salesIndexable(route,{...open,PUBLIC_PEAK_EXCHANGE_URL:''}),true);
 }
 for(const route of routes.filter(r=>!r.includes('livre')&&!r.includes('peak-pitch'))){
  assert.equal(salesIndexable(route,{...open,PUBLIC_PEAK_EXCHANGE_URL:''}),false);
  assert.equal(salesIndexable(route,{...open,PUBLIC_PEAK_EXCHANGE_ENABLED:'false'}),false);
  assert.equal(salesIndexable(route,{...open,PUBLIC_PEAK_EXCHANGE_URL:'https://user:pass@unsafe.test'}),false);
  assert.equal(salesIndexable(route,{...open,PUBLIC_EBOOK_SALES_ENABLED:'false'}),true);
 }
 for(const route of routes.filter(r=>r.includes('peak-pitch'))){
  for(const env of [{...open,PUBLIC_PEAK_PITCH_ENABLED:'false'},{...open,PUBLIC_PEAK_PITCH_URL:''},{...open,PUBLIC_PEAK_PITCH_URL:'http://unsafe.test'}])assert.equal(salesIndexable(route,env),false);
 }
 assert.equal(salesIndexable('/expertises/insure/',{}),true);
});
test('Build fermé : huit pages noindex, absentes du sitemap, sans PreOrder',()=>{
 const sitemap=read('dist/sitemap-0.xml');
 for(const route of routes){
  const html=read('dist'+route+'index.html'),$=load(html);
  assert.match($('meta[name="robots"]').attr('content'),/noindex/);
  assert.ok(!sitemap.includes('https://peakfunding.eu'+route),route);
  assert.doesNotMatch(html,/schema.org\/PreOrder/);
 }
});
test('Contenus : aucun ancien tarif EXCHANGE ni ancienne promesse de durée dans le site livré',()=>{
 const crawl=p=>readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?crawl(p+'/'+f.name):[p+'/'+f.name]);
 for(const file of crawl('dist').filter(p=>p.endsWith('.html')||p.endsWith('.txt'))){
  const text=file.endsWith('.html')?load(read(file))('body').text()+' '+load(read(file))('meta[name="description"]').attr('content'):read(file);
  assert.doesNotMatch(text,/(?<!\d)199(?!\d)|trente minutes|thirty.minute/i,file);
 }
});
test('Lecture : aucun signet global, composants RDV morts supprimés et titre du cabinet visible',()=>{
 for(const prefix of ['','en/']){
  const $=load(read('dist/'+prefix+'index.html'));
  assert.equal($('[data-reading-progress]').length,0);
  assert.equal($('[data-pitch-cinema] h1.sr-only').length,0);
 }
 assert.ok(!existsSync('src/components/ProgressionLecture.astro'));
 assert.ok(!existsSync('src/scripts/lecture.ts'));
 assert.ok(!existsSync('src/components/react/PriseRendezVous.tsx'));
 assert.ok(!existsSync('src/components/react/RendezVousModal.tsx'));
});
test('Assurance : les guides renvoient vers PEAK INSURE et le service vers ses guides',()=>{
 for(const prefix of ['','en/']){
  const insure=load(read('dist/'+prefix+'expertises/insure/index.html'));
  assert.equal(insure('main a[href="/'+prefix+'peak-exchange/"]').length,0);
  assert.ok(insure('a[href="#guides-expertise"]').length);
  for(const slug of ['delegation-assurance','lemoine','economie-assurance-emprunteur','refus-delegation-banque','assurance-emprunteur-sante','assurance-emprunteur-senior','assurance-emprunteur-metiers-sports-risque','quotite-assurance-emprunteur','assurance-emprunteur-investissement-locatif']){
   const $=load(read('dist/'+prefix+'actualites/'+slug+'/index.html'));
   assert.equal($('main a[href="/'+prefix+'peak-exchange/"]').length,0,slug);
   assert.ok($('main a[href="/'+prefix+'expertises/insure/"]').length,slug);
  }
 }
});
test('Données structurées : contactPoint localisé et nom du dirigeant harmonisé',()=>{
 for(const prefix of ['','en/']){
  const $=load(read('dist/'+prefix+'index.html')),graph=JSON.parse($('script[type="application/ld+json"]').html())['@graph'];
  const org=graph.find(n=>n['@id']==='https://peakfunding.eu/#organisation');
  assert.equal(org.contactPoint.url,'https://peakfunding.eu/'+prefix+'contact/');
  assert.equal(org.founder.name,'Valentin Boura--Defranoux');
 }
});
