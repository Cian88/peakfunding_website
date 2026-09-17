import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { actualiserObservatoire, controleNecessaire, verifierSource } from '../scripts/actualiser-observatoire.mjs';

const now = new Date('2026-09-17T06:17:00Z');
const seed = {period:'2026-08',rate:3.31,durationMonths:252,
  sourceUrl:'https://lobservatoire.creditlogement.fr/publications/analyse-marche-immobilier-aout-2026/',
  checkedAt:null,verifiedOn:'2026-09-12',stale:true};
const html = '<div class="last-post-panel"><span class="last-post-date">Août 2026</span><div class="last-post-actions"><a href="'+seed.sourceUrl+'">Détail</a></div><article class="last-post-card--metric"><p class="last-post-value">3,31 <span>%</span></p><h3>Taux moyen</h3></article><article class="last-post-card--metric"><p class="last-post-value">252 <span>mois</span></p><h3>Durée moyenne</h3></article></div>';
const raw = data => JSON.stringify(data,null,2)+'\n';
async function copies(t, data=seed) {
  const dossier = await mkdtemp(join(tmpdir(),'peak-observatoire-test-'));
  t.after(()=>rm(dossier,{recursive:true,force:true}));
  for(const f of ['observatoire.json','observatoire-seed.json']) await writeFile(join(dossier,f),raw(data));
  return dossier;
}
const lire = dossier => Promise.all(['observatoire.json','observatoire-seed.json'].map(f=>readFile(join(dossier,f),'utf8')));

test('Hebdomadaire : les deux copies sont mises à jour ensemble, y compris pour un mois inchangé', async t => {
  const dossier=await copies(t); let count=0;
  const result=await actualiserObservatoire({dossier,now,fetcher:async(url,options)=>{
    count++; assert.equal(url,'https://lobservatoire.creditlogement.fr/');
    assert.equal(options.redirect,'error'); assert.ok(options.signal);
    return new Response(html);
  }});
  assert.equal(count,1); assert.equal(result.checked,true); assert.equal(result.changed,true);
  assert.equal(result.data.checkedAt,now.toISOString()); assert.equal(result.data.stale,false);
  assert.equal(result.data.period,seed.period);
  assert.deepEqual(await lire(dossier),[raw(result.data),raw(result.data)]);
});
test('Hebdomadaire : seuil de sept jours et contrôle forcé du lundi', async t => {
  const recent={...seed,checkedAt:now.toISOString(),stale:false};
  assert.equal(controleNecessaire(recent,new Date(+now+7*86400000-1)),false);
  assert.equal(controleNecessaire(recent,new Date(+now+7*86400000)),true);
  assert.equal(controleNecessaire(seed,now),true);
  const dossier=await copies(t,recent); let count=0;
  const fetcher=async()=>{count++;return new Response(html);};
  assert.equal((await actualiserObservatoire({dossier,now,fetcher})).checked,false);
  assert.equal(count,0);
  await actualiserObservatoire({dossier,now:new Date(+now+1000),fetcher,force:true});
  assert.equal(count,1);
});
test('Hebdomadaire : erreur HTTP, réseau, date future, ancien mois ou HTML invalide ne remplacent rien', async t => {
  for(const fetcher of [
    async()=>new Response('indisponible',{status:503}),
    async()=>{throw Error('réseau');},
    async()=>new Response(html.replace('Août 2026','Juillet 2026')),
    async()=>new Response(html.replace('Août 2026','Août 2099')),
    async()=>new Response('<p>Maintenance</p>'),
  ]) {
    const dossier=await copies(t);
    await assert.rejects(actualiserObservatoire({dossier,now,fetcher}));
    assert.deepEqual(await lire(dossier),[raw(seed),raw(seed)]);
  }
});
test('Hebdomadaire : mode de diagnostic sans écriture et limite de taille', async t => {
  const dossier=await copies(t);
  const result=await actualiserObservatoire({dossier,now,fetcher:async()=>new Response(html),dryRun:true});
  assert.equal(result.data.stale,false); assert.deepEqual(await lire(dossier),[raw(seed),raw(seed)]);
  await assert.rejects(verifierSource({now,fetcher:async()=>new Response('x'.repeat(2000001))}),/volumineuse/);
});
test('Hebdomadaire : une copie embarquée en retard est alignée sans requête superflue', async t => {
  const dossier=await copies(t);
  const recent={...seed,checkedAt:now.toISOString(),stale:false};
  await writeFile(join(dossier,'observatoire.json'),raw(recent));
  const result=await actualiserObservatoire({dossier,now,fetcher:async()=>{throw Error('ne doit pas appeler');}});
  assert.equal(result.checked,false); assert.deepEqual(await lire(dossier),[raw(recent),raw(recent)]);
});
