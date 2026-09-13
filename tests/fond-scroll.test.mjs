import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { paletteFond, contraste, tonaliteAuScroll } from '../src/lib/fond-scroll.mjs';

test('Fond uni : extrémités exactes et contraste >= 4,5 pendant toute la transition', () => {
  assert.deepEqual(paletteFond(0).fond, [11,13,18]);
  assert.deepEqual(paletteFond(1).fond, [242,240,235]);
  for (let i=0; i<=1000; i++) {
    const palette = paletteFond(i/1000);
    for (const role of ['texte','secondaire','accent']) assert.ok(contraste(palette[role],palette.fond)>=4.5, `${role}, étape ${i}`);
  }
});

test('La couleur dépend du scroll et revient exactement en arrière, sans saut de section', () => {
  const reperes = [{top:800,clair:false},{top:1050,clair:true},{top:2500,clair:false}];
  assert.equal(tonaliteAuScroll(reperes,0,800,800),0);
  assert.equal(tonaliteAuScroll(reperes,1300,800,800),1);
  assert.equal(tonaliteAuScroll(reperes,2600,800,800),0);
  const progression = Array.from({length:3000},(_,i)=>tonaliteAuScroll(reperes,i,800,800));
  for (let i=1;i<progression.length;i++) assert.ok(Math.abs(progression[i]-progression[i-1])<.01);
  for (let i=2999;i>=0;i--) assert.equal(tonaliteAuScroll(reperes,i,800,800),progression[i]);
});

test('Actelo utilise le conteneur élargi sans changement du script fournisseur', () => {
  const page = readFileSync('src/pages/espace-client.astro','utf8');
  assert.equal((page.match(/class="espace-large /g)||[]).length,2);
  assert.match(page,/max-width:1840px/);
  assert.match(page,/id="actelo-espace-client"/);
});
