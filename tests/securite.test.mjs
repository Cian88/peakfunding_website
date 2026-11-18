import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const pages = (d) => readdirSync(d, { withFileTypes: true }).flatMap((f) => f.isDirectory() ? pages(`${d}/${f.name}`) : f.name.endsWith('.html') ? [`${d}/${f.name}`] : []);

test('Sécurité : chaque page porte une CSP stricte pour les scripts', () => {
  for (const file of pages('dist')) {
    const html = read(file);
    const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]+)"/i)?.[1];
    assert.ok(csp, `CSP absente : ${file}`);
    const scripts = csp.match(/script-src ([^;]+)/)?.[1] ?? '';
    assert.doesNotMatch(scripts, /'unsafe-inline'|'unsafe-eval'|\*(?!\.)/, file);
    for (const d of ["object-src 'none'", "base-uri 'self'", "default-src 'self'"]) assert.ok(csp.includes(d), `${d} : ${file}`);
    // La CSP doit précéder tout script intégré pour s'appliquer à lui
    // (le module ClientRouter, servi par le site lui-même, peut la précéder).
    const inline = html.search(/<script(?![^>]*\b(?:src=|type="application\/ld\+json"))[^>]*>/i);
    assert.ok(inline === -1 || html.search(/content-security-policy/i) < inline, file);
    assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin"/, file);
  }
});

test('Sécurité : la session Supabase n’est jamais conservée dans le stockage du navigateur', () => {
  const source = read('src/lib/supabase.ts');
  assert.match(source, /persistSession:\s*false/);
  assert.match(source, /localStorage\.removeItem/);
});

test('Sécurité : actions GitHub figées par empreinte et relais PHP retiré de Pages', () => {
  const workflow = read('.github/workflows/deploy.yml');
  for (const [, ref] of workflow.matchAll(/uses:\s*\S+@(\S+)/g)) assert.match(ref, /^[0-9a-f]{40}$/);
  assert.match(workflow, /rm -f dist\/api\/observatoire\.php/);
});
