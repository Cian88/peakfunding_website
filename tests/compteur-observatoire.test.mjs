import test from 'node:test';
import assert from 'node:assert/strict';
import { valeurComptee } from '../src/lib/compteur-observatoire.mjs';

test('Comptage CSA : départ et arrivée exacts, progression bornée', () => {
  assert.equal(valeurComptee(0,3.31,-.1),0);
  assert.equal(valeurComptee(0,3.31,0),0);
  assert.equal(valeurComptee(0,3.31,1),3.31);
  assert.equal(valeurComptee(0,252,2),252);
  for(let i=0;i<=100;i++) {
    const n=valeurComptee(0,3.31,i/100);
    assert.ok(n>=0 && n<=3.31);
    if(i) assert.ok(n>=valeurComptee(0,3.31,(i-1)/100));
  }
});
test('Comptage CSA : ralentissement progressif sans oscillation', () => {
  const deltas=Array.from({length:10},(_,i)=>valeurComptee(0,252,(i+1)/10)-valeurComptee(0,252,i/10));
  assert.ok(deltas.every((n,i)=>i===0 || n<deltas[i-1]));
});
test('Comptage CSA : mise à jour à la baisse, valeurs inchangées et interruption', () => {
  const interrompue=valeurComptee(3.31,3.5,.4);
  assert.equal(valeurComptee(interrompue,3.2,0),interrompue);
  for(let i=0;i<=100;i++) {
    const n=valeurComptee(interrompue,3.2,i/100);
    assert.ok(n>=3.2 && n<=interrompue);
    assert.equal(valeurComptee(252,252,i/100),252);
  }
  assert.equal(valeurComptee(interrompue,3.2,1),3.2);
});
