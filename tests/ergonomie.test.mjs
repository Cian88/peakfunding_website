import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { validerRdv, messageErreurRdv } from '../src/lib/validation-rdv.mjs';

const read = file => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const sim = read('src/components/react/SimulateurCapacite.tsx');
test('Ergonomie : les calculs financiers et leurs constantes restent identiques', () => {
  const calcul = sim.slice(sim.indexOf('  const r = useMemo'), sim.indexOf('  // La bordure'))
    .replace('return { emprunt, capacite,', 'return { capacite,');
  assert.equal(hash(calcul), '0da24e1d7dfab0133ad71746dfdef32614fd2c7fd2072fc4df0e36b3d2905f71');
  for (const ligne of [
    'const TAUX_ENDETTEMENT_AVEC_ASSURANCE = 35;',
    'const TAUX_ENDETTEMENT_SANS_ASSURANCE = 33;',
    'const TAUX_DEFAUT = 3.5;',
    'const TAUX_ASSURANCE_DEFAUT = 0.3;',
    'const COEF_GARANTIES = { complete: 1, minimale: 0.6 } as const;',
  ]) assert.ok(sim.includes(ligne), ligne);
});

test('Identité : champs vides, e-mail et téléphone invalides bloquent la progression', () => {
  assert.deepEqual(Object.keys(validerRdv({}, 1)), ['prenom','nom','email','tel']);
  const f = { prenom:'Test', nom:'Audit', email:'test', tel:'test' };
  assert.deepEqual(validerRdv(f, 1), { email:'email', tel:'tel' });
  for (const email of ['a@b', 'a b@c.fr', 'a@@b.fr']) assert.equal(validerRdv({...f,email,tel:'0600000000'},1).email,'email');
  for (const tel of ['123','+33123456789012345','06abc00000']) assert.equal(validerRdv({...f,email:'test@example.com',tel},1).tel,'tel');
  for (const tel of ['06 00 00 00 00', '+33 (0)6 00-00-00-00', '+44 20 1234 5678']) {
    assert.deepEqual(validerRdv({...f,email:'test@example.com',tel},1),{});
  }
});

test('Projet : nombres français acceptés, zéro permis pour apport et charges, consentement obligatoire', () => {
  const f = { ville:'Paris', budget:'300 000', apport:'0', revenus:'5 200,50', charges:'0',
    tauxSouhaite:'3,5', dureeSouhaitee:'25', montantSouhaite:'300000', rgpd:true };
  assert.deepEqual(validerRdv(f,2),{});
  assert.equal(validerRdv({...f,rgpd:false},2).rgpd,'consentement');
  for (const k of ['budget','dureeSouhaitee','montantSouhaite']) assert.equal(validerRdv({...f,[k]:'0'},2)[k],'positif');
  for (const value of ['-1','abc','NaN','Infinity','300 €']) assert.equal(validerRdv({...f,budget:value},2).budget,'nombre');
  assert.equal(validerRdv({...f,ville:'  '},2).ville,'requis');
  assert.equal(validerRdv({...f,budget:''},2).budget,'requis');
  assert.match(messageErreurRdv('email','en'), /valid email/);
  assert.match(messageErreurRdv('email','fr'), /e-mail valide/);
});

test('Simulateur rendu FR/EN : hypothèses visibles, contrôles avancés conservés, résultat détaillé', () => {
  for (const file of ['dist/index.html', 'dist/en/index.html']) {
    const $ = load(read(file));
    const form = $('.simulateur-form');
    assert.equal(form.length,1);
    assert.equal(form.find('.simulateur-avance[open]').length,0);
    assert.equal(form.find('.simulateur-avance #simulation-hypotheses').length,0);
    assert.equal(form.find('#simulation-hypotheses').length,1);
    assert.equal(form.find('.simulateur-avance select').length,2);
    assert.equal(form.find('.simulateur-avance input[type=range]').length,3);
    assert.equal(form.find('.simulateur-resume-mobile').length,1);
    assert.equal(form.find('#simulation-resultat > .simulateur-decomposition > div').length,2);
    assert.equal(form.find('[aria-live]').length,1);
  }
});

test('Les animations des avis restent identiques, seule la destination RDV change', () => {
  for (const [file, expected] of [
    ['src/components/react/MurAvis.tsx', '5fb478ad17a20fe771f3f8dea9b9d2903dc836e48e8248d1dcb86f50628dda88'],
    ['src/components/AvisClients.astro', 'afaf05a864d8823ea9b7549efe7ecfd7436b26a05a81c50b6502f8e2478e3839'],
  ]) assert.equal(hash(read(file).replaceAll('/peak-exchange/', '/#rdv').replace('role="img" aria-label={`${n}/5`}', 'aria-label={`${n}/5`}')),expected,file);
});
