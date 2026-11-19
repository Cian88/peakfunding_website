import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contraste } from '../src/lib/fond-scroll.mjs';

test('Le papier et la trame préservent le contraste du texte et des actions', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const couleur = nom => {
    const hex = css.match(new RegExp('--' + nom + ':\\s*#([0-9a-f]{6})'))?.[1];
    assert.ok(hex, nom);
    return hex.match(/../g).map(valeur => parseInt(valeur, 16));
  };
  for (const fond of ['paper', 'wash']) {
    for (const texte of ['ink', 'muted', 'signal']) {
      assert.ok(contraste(couleur(texte), couleur(fond)) >= 4.5, texte + ' sur ' + fond);
    }
  }
  assert.ok(contraste([255,255,255], couleur('signal')) >= 4.5);
});

test('Actelo utilise le conteneur élargi sans changement du script fournisseur', () => {
  const page = readFileSync('src/pages/espace-client.astro','utf8');
  assert.equal((page.match(/class="espace-large /g)||[]).length,2);
  assert.match(readFileSync('src/styles/feuillets.css','utf8'),/\.espace-large\s*\{[^}]*1840px/);
  assert.match(page,/id="actelo-espace-client"/);
});
