import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extraireObservation, creerLecteur } from '../src/server/observatoire.mjs';
import { observationValide, OBSERVATOIRE_TTL } from '../src/lib/observatoire.mjs';
const now = new Date('2026-09-12T14:00:00Z');
// Minimal representative fixture: no remote HTML or third-party scripts in the client.
const html = `<div class="last-post-panel"><span class="last-post-date">Août 2026</span><div class="last-post-actions"><a href="https://lobservatoire.creditlogement.fr/publications/analyse-marche-immobilier-aout-2026/">Détail</a></div><article class="last-post-card--metric"><p class="last-post-value">3,31 <span>%</span></p><h3>Taux moyen</h3></article><article class="last-post-card--metric"><p class="last-post-value">252 <span>mois</span></p><h3>Durée moyenne</h3></article></div>`;
test('Observatoire : extraction typée et datée des deux indicateurs officiels', () => {
  const d = extraireObservation(html,now);
  assert.equal(d.rate,3.31); assert.equal(d.durationMonths,252); assert.equal(d.period,'2026-08'); assert.equal(d.stale,false); assert.equal(d.checkedAt,now.toISOString());
});
test('Observatoire : refus des incohérences, dates futures et sources étrangères', () => {
  for (const bad of [html.replace('3,31','99,99'), html.replace('Août 2026','Août 2099'), html.replace('lobservatoire.creditlogement.fr','evil.example'), html.replace('Durée moyenne','Taux moyen'),'<p>Maintenance</p>']) assert.throws(()=>extraireObservation(bad,now));
  assert.equal(observationValide({...extraireObservation(html,now), rate:'3.31'},now),false);
  assert.equal(observationValide({...extraireObservation(html,now), checkedAt:'not-a-date'},now),false);
  assert.equal(observationValide({...extraireObservation(html,now), checkedAt:null},now),false);
});
test('Observatoire : cache six heures et mutualisation des requêtes', async () => {
  let count=0, time=now.getTime();
  const read = creerLecteur({fetcher:async()=>{count++; return {ok:true,text:async()=>html};},clock:()=>new Date(time)});
  await Promise.all([read(),read(),read()]); assert.equal(count,1);
  time+=OBSERVATOIRE_TTL-1; await read(); assert.equal(count,1);
  time+=2; await read(); assert.equal(count,2);
});
test('Observatoire : conservation datée en erreur, reprise et refus de régression', async () => {
  let time=now.getTime(), value=html;
  const read=creerLecteur({fetcher:async()=>({ok:true,text:async()=>value}),clock:()=>new Date(time)});
  const good=await read(); time+=OBSERVATOIRE_TTL; value='<p>Erreur</p>';
  const failed=await read(); assert.equal(failed.stale,true); assert.equal(failed.checkedAt,good.checkedAt); assert.equal(failed.rate,3.31);
  time+=600001; value=html.replaceAll('Août 2026','Juillet 2026'); assert.equal((await read()).period,'2026-08');
  time+=600001; value=html; assert.equal((await read()).stale,false);
});
test('Observatoire : copie de secours et relais PHP inclus dans la livraison', () => {
  assert.equal(readFileSync('dist/api/observatoire.php','utf8'),readFileSync('public/api/observatoire.php','utf8'));
  assert.ok(observationValide(JSON.parse(readFileSync('dist/api/observatoire-seed.json','utf8')),now));
  assert.match(readFileSync('dist/index.html','utf8'), /Publication mensuelle/);
});
