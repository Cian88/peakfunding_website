// IndexNow : la clé du script doit être servie telle quelle à la racine du site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('la clé IndexNow du script est publiée dans public/<clé>.txt', () => {
  const script = readFileSync(new URL('../scripts/indexnow.mjs', import.meta.url), 'utf8');
  const cle = script.match(/export const CLE = '([0-9a-f]{32})'/)?.[1];
  assert.ok(cle, 'clé de 32 caractères hexadécimaux');
  const fichier = new URL(`../public/${cle}.txt`, import.meta.url);
  assert.ok(existsSync(fichier), 'fichier de clé présent');
  assert.equal(readFileSync(fichier, 'utf8').trim(), cle);
});
