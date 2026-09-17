import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { load } from 'cheerio';
import { validerRdv, messageErreurRdv } from '../src/lib/validation-rdv.mjs';

const read = file => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const sim = read('src/components/react/SimulateurCapacite.tsx');
const rdv = read('src/components/react/PriseRendezVous.tsx');

test('Envoi : attente visible, double clic ignoré, puis accès aux agendas après succès', async () => {
  let terminer;
  const h = transmissionTest(() => new Promise(resolve => { terminer = resolve; }));
  const enCours = h.submit();
  assert.equal(h.etat.envoi, true);
  assert.equal(h.etat.appels.length, 1);
  await h.submit();
  assert.equal(h.etat.appels.length, 1);
  assert.equal(h.etat.step, 2);
  const { url, options } = h.etat.appels[0];
  assert.equal(url, 'https://formspree.io/f/mykrggwk');
  assert.equal(options.method, 'POST');
  assert.equal(JSON.parse(options.body).email, 'test@example.com');
  terminer({ok:true});
  await enCours;
  assert.equal(h.etat.step, 3);
  assert.equal(h.etat.envoi, false);
  assert.equal(h.etat.mail, '');
  assert.equal(h.etat.timerNettoye, true);
});

test('Envoi : erreurs HTTP/réseau gardent le formulaire et proposent un e-mail explicite', async () => {
  for (const fetch of [async () => ({ok:false}), async () => { throw Error('réseau indisponible'); }]) {
    const h = transmissionTest(fetch, {courtier:'Maxime Pidoux'});
    await h.submit();
    assert.equal(h.etat.step, 2);
    assert.equal(h.etat.envoi, false);
    assert.match(h.etat.mail, /^mailto:mpidoux@peakfunding.eu\?/);
    assert.match(decodeURIComponent(h.etat.mail), /Test Audit/);
    assert.equal(h.etat.appels[0].url, 'https://formspree.io/f/xkjnbpod');
    await h.submit();
    assert.equal(h.etat.appels.length, 2, 'nouvel essai autorisé après échec');
  }
});

test('Envoi : délai dépassé interrompu, bouton réactivé et repli disponible', async () => {
  const h = transmissionTest((_url, {signal}) => new Promise((_resolve,reject) => {
    signal.addEventListener('abort', () => reject(Error('aborted')), {once:true});
  }));
  const enCours = h.submit();
  h.etat.timeout();
  await enCours;
  assert.equal(h.etat.appels[0].options.signal.aborted, true);
  assert.equal(h.etat.step, 2);
  assert.equal(h.etat.envoi, false);
  assert.match(h.etat.mail, /^mailto:vboura@peakfunding.eu\?/);
});

test('Envoi : aucune requête si validation refusée ; aucun changement après démontage', async () => {
  const bloque = transmissionTest(async () => ({ok:true}), {}, false);
  await bloque.submit();
  assert.equal(bloque.etat.appels.length,0);
  let terminer;
  const h = transmissionTest(() => new Promise(resolve => { terminer = resolve; }));
  const pending = h.submit();
  h.actif.current = false;
  terminer({ok:true});
  await pending;
  assert.equal(h.etat.step,2);
  assert.equal(h.etat.mail,'');
});

// Exécute le gestionnaire réel avec un fetch factice. Aucune requête réseau.
// Seule l'annotation TypeScript du tableau de repli est retirée pour Node.
function transmissionTest(fetchFactice, changements = {}, valide = true) {
  const etat = {appels:[],envoi:false,step:2,mail:'',timeout:null,timerNettoye:false};
  const actif = {current:true};
  const f = {prenom:'Test',nom:'Audit',email:'test@example.com',tel:'0600000000',
    typeProjet:'Résidence principale',statut:'Primo-accédant',budget:'300000',apport:'60000',
    revenus:'5200',charges:'0',ville:'Paris',avancement:'En recherche de bien',delai:'Dès que possible',
    tauxSouhaite:'3,5',dureeSouhaitee:'25',montantSouhaite:'240000',courtier:'Peu importe',message:'Test local',rgpd:true,...changements};
  const scope = {
    f,lang:'fr',actif,requete:{current:null},valider:()=>valide,AbortController,encodeURIComponent,
    ENDPOINTS:{valentin:'https://formspree.io/f/mykrggwk',maxime:'https://formspree.io/f/xkjnbpod'},
    setEnvoi:v=>{etat.envoi=v;},setMailSecours:v=>{etat.mail=v;},
    setStep:v=>{etat.step=v;},setErreurs:()=>{},
    window:{setTimeout:fn=>{etat.timeout=fn;return 1;},clearTimeout:()=>{etat.timerNettoye=true;}},
    fetch:(url,options)=>{etat.appels.push({url,options});return fetchFactice(url,options);},
  };
  const code = rdv.slice(rdv.indexOf('  const submit = async () => {'), rdv.indexOf('\n  const ouvrir'))
    .replace('  const submit = ', '').trim().replace(/;$/, '')
    .replace('const L: [string, string][]', 'const L');
  return {etat,actif,submit:runInNewContext('(' + code + ')',scope)};
}


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

test('Ergonomie : charge utile Formspree intégralement conservée', () => {
  const payload = rdv.slice(rdv.indexOf('    const data = {'), rdv.indexOf('    const sendMail'));
  assert.equal(hash(payload), 'b99164ad478975e122cd4ba65aab28dee890c2b064fd51e6b635af2693bd8d05');
  assert.match(rdv, /if \(requete.current \|\| !valider\(2\)\) return/);
  assert.match(rdv, /disabled=\{envoi\}/);
  assert.match(rdv, /signal:controller.signal/);
  assert.match(rdv, /controller.abort\(\), 12000/);
  assert.doesNotMatch(rdv, /location.href = mail/);
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

test('Les composants des avis clients sont inchangés octet pour octet', () => {
  for (const [file, expected] of [
    ['src/components/react/MurAvis.tsx', '5fb478ad17a20fe771f3f8dea9b9d2903dc836e48e8248d1dcb86f50628dda88'],
    ['src/components/AvisClients.astro', 'afaf05a864d8823ea9b7549efe7ecfd7436b26a05a81c50b6502f8e2478e3839'],
  ]) assert.equal(hash(readFileSync(file)),expected,file);
});
