/* Visuels verticaux pour les réseaux sociaux — série « assurance emprunteur » (2026-10-14).
   Charte Altitude du site : fond abîme ou cendre, cuivre pour les chiffres et les traits, Geist / Geist Mono.
   Chaque visuel existe en 1080 × 1350 (post LinkedIn / Instagram) et 1080 × 1920 (story, reel).
   Les chiffres viennent des guides publiés sur peakfunding.eu et restent présentés comme des exemples.
   Usage (depuis la racine du dépôt) : node communication/reseaux-sociaux/generer.mjs
   Rendu : Edge headless (chemin Windows standard), PNG dans communication/reseaux-sociaux/png/. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ici = resolve('communication/reseaux-sociaux');
const sortie = join(ici, 'png');
const tmp = join(ici, '.rendu');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const b64 = (p) => readFileSync(p).toString('base64');
const geist = b64('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
const geistMono = b64('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2');
const logo = { sombre: b64('public/img/logo-peak-funding-ivoire.svg'), clair: b64('public/img/logo-peak-funding.svg') };
const symbole = { sombre: b64('public/img/symbole-montagne-ivoire.svg'), clair: b64('public/img/symbole-montagne-cuivre.svg') };

const formats = {
  post: { w: 1080, h: 1350, haut: 88, bas: 80, titre: 84, chiffre: 210 },
  story: { w: 1080, h: 1920, haut: 230, bas: 280, titre: 96, chiffre: 240 },
};

const ORIAS = 'PEAK FUNDING · Courtier en assurance emprunteur · ORIAS n° 24002546';

/* Contenus : un objet par visuel. `ton` alterne sombre / clair comme le site. */
const visuels = [
  {
    slug: '01-loi-lemoine', ton: 'sombre', eyebrow: 'Assurance emprunteur',
    corps: `<h1 class="titre">Votre assurance de prêt n'est pas figée.</h1>
      <p class="sous">Depuis la loi Lemoine, vous pouvez en changer <b>à tout moment</b>, sans frais, pour un contrat à garanties équivalentes.</p>
      <ul class="puces"><li>Prêt en cours ou à signer</li><li>Le prêt lui-même ne change pas</li><li>Couverture continue</li></ul>`,
    note: '',
  },
  {
    slug: '02-exemple-28800', ton: 'clair', eyebrow: 'Exemple chiffré',
    corps: `<p class="chiffre long">28&nbsp;800&nbsp;€</p>
      <p class="legende">d'économie pour un couple de 32 ans qui change d'assurance de prêt après un an.</p>
      <div class="donnees"><span>300 000 € sur 25 ans</span><span>100 % chacun</span><span>0,30 % → 0,10 % du capital initial</span></div>`,
    note: 'Exemple illustratif, non contractuel : le tarif réel dépend de l\'âge, de la santé, de la profession et des garanties retenues.',
  },
  {
    slug: '03-refus-banque', ton: 'sombre', eyebrow: 'Délégation d\'assurance',
    corps: `<h1 class="titre">Votre banque <span class="insecable">peut-elle</span> refuser&nbsp;?</h1>
      <p class="sous">Une seule raison valable : un critère de sa fiche standardisée d'information (FSI) n'est pas rempli.</p>
      <ol class="etapes"><li><i>10 j</i>Réponse sous dix jours ouvrés</li><li><i>1×</i>Refus écrit, motivé, tous les critères listés</li><li><i>0 €</i>Ni frais, ni changement des conditions de taux</li></ol>`,
    note: '',
  },
  {
    slug: '04-questionnaire-sante', ton: 'clair', eyebrow: 'Loi Lemoine · depuis le 1er juin 2022',
    corps: `<h1 class="titre">Pas de questionnaire de santé si&nbsp;:</h1>
      <ol class="conditions"><li><i>≤ 200 000 €</i><span>assurés par personne, tous prêts immobiliers confondus</span></li><li class="et">et</li><li><i>&lt; 60 ans</i><span>à la fin du remboursement du prêt</span></li></ol>`,
    note: 'Au-delà de l\'un des deux seuils, l\'assureur peut demander un questionnaire.',
  },
  {
    slug: '05-droit-oubli', ton: 'sombre', eyebrow: 'Droit à l\'oubli',
    corps: `<p class="chiffre">5 ans</p>
      <p class="legende">après la fin du protocole thérapeutique, sans rechute, un cancer ou une hépatite C n'a plus à être déclaré à l'assureur.</p>
      <p class="sous petit">Pour les autres pathologies, la convention AERAS encadre l'examen des dossiers.</p>`,
    note: '',
  },
  {
    slug: '06-quotite', ton: 'clair', eyebrow: 'Quotité d\'assurance',
    corps: `<h1 class="titre moyen">Si l'un des deux décède, que <span class="insecable">reste-t-il</span> à payer au survivant&nbsp;?</h1>
      <div class="barres">
        <div class="barre"><span class="nom">50 / 50</span><span class="piste"><span style="width:100%"></span></span><span class="val">≈ 751 €/mois</span></div>
        <div class="barre"><span class="nom">60 / 40</span><span class="piste"><span style="width:80%"></span></span><span class="val">≈ 601 €/mois</span></div>
        <div class="barre accent"><span class="nom">100 / 100</span><span class="piste"><span style="width:0%"></span></span><span class="val">0 €</span></div>
      </div>`,
    note: 'Exemple illustratif : 300 000 € sur 25 ans à 3,5 %, mensualité hors assurance ≈ 1 502 €. Décès de l\'emprunteur assuré à 60 % ou 50 %.',
  },
  {
    slug: '07-locatif-cash-flow', ton: 'sombre', eyebrow: 'Investissement locatif',
    corps: `<p class="chiffre">+30 €<small>/mois</small></p>
      <p class="legende">de cash-flow en passant d'une assurance à 0,30 % à 0,12 % du capital initial, soit 7 200 € sur la durée du prêt.</p>
      <div class="donnees"><span>200 000 € sur 20 ans</span><span>38 ans, non-fumeur</span><span>assuré à 100 %</span></div>`,
    note: 'Exemple illustratif, non contractuel : le tarif réel dépend de l\'âge, de la santé, de la profession et des garanties retenues.',
  },
  {
    slug: '08-quatre-etapes', ton: 'clair', eyebrow: 'Comment ça se passe',
    corps: `<h1 class="titre">Changer d'assurance de prêt en 4 étapes.</h1>
      <ol class="etapes"><li><i>01</i>Analyse de votre contrat et de la FSI de la banque</li><li><i>02</i>Comparaison de plusieurs assureurs, garanties équivalentes</li><li><i>03</i>Demande de substitution adressée à la banque</li><li><i>04</i>Avenant gratuit, sans interruption de couverture</li></ol>
      <p class="cta">Étude gratuite et sans engagement</p>`,
    note: '',
  },
];

const css = (f, ton) => {
  const s = ton === 'sombre';
  const c = s
    ? { fond: '#0b0d12', texte: '#edeae4', doux: '#a6a9b3', faible: '#7c808a', ligne: 'rgba(237,234,228,0.07)', filet: '#2a2f3a', chiffre: '#d9a47c', puce: '#b87b4f', carte: '#14171e' }
    : { fond: '#f2f0eb', texte: '#111111', doux: '#3d3f46', faible: '#6d7078', ligne: 'rgba(17,17,17,0.05)', filet: '#e2ded7', chiffre: '#9a6b45', puce: '#b87b4f', carte: '#ffffff' };
  return `
@font-face { font-family: 'Geist'; src: url(data:font/woff2;base64,${geist}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Geist Mono'; src: url(data:font/woff2;base64,${geistMono}) format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${f.w}px; height: ${f.h}px; overflow: hidden; }
body { background: ${c.fond}; color: ${c.texte}; font-family: 'Geist', sans-serif; position: relative;
  -webkit-font-smoothing: antialiased; font-feature-settings: 'ss01'; }
.grille { position: absolute; inset: 0; background-image: linear-gradient(${c.ligne} 1px, transparent 1px), linear-gradient(90deg, ${c.ligne} 1px, transparent 1px); background-size: 72px 72px; }
.symbole { position: absolute; right: -120px; bottom: ${f.bas + 120}px; width: 760px; opacity: ${s ? 0.05 : 0.07}; }
.cadre { position: relative; height: 100%; padding: ${f.haut}px 88px ${f.bas}px; display: flex; flex-direction: column; }
.haut { display: flex; justify-content: space-between; align-items: center; font-family: 'Geist Mono', monospace; font-size: 24px; letter-spacing: 0.14em; text-transform: uppercase; color: ${c.chiffre}; }
.haut .num { color: ${c.faible}; }
.haut::after { content: ''; }
.trait { height: 2px; width: 96px; background: ${c.puce}; margin-top: 28px; }
main { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: ${f.h > 1500 ? 56 : 40}px; }
.titre { font-weight: 300; font-size: ${f.titre}px; line-height: 1.04; letter-spacing: -0.035em; }
.titre.moyen { font-size: ${Math.round(f.titre * 0.82)}px; }
.sous { font-size: ${f.h > 1500 ? 40 : 36}px; line-height: 1.32; color: ${c.doux}; font-weight: 350; max-width: 880px; }
.sous.petit { font-size: 30px; color: ${c.faible}; }
.sous b { color: ${c.texte}; font-weight: 500; }
.chiffre { font-family: 'Geist Mono', monospace; white-space: nowrap; font-weight: 400; font-size: ${f.chiffre}px; line-height: 0.95; letter-spacing: -0.05em; color: ${c.chiffre}; }
.chiffre.long { font-size: ${Math.round(f.chiffre * 0.74)}px; }
.insecable { white-space: nowrap; }
.chiffre small { font-size: 0.32em; letter-spacing: -0.01em; margin-left: 12px; color: ${c.doux}; }
.legende { font-size: ${f.h > 1500 ? 50 : 46}px; line-height: 1.18; font-weight: 300; letter-spacing: -0.02em; max-width: 880px; }
.donnees { display: flex; flex-wrap: wrap; gap: 14px; }
.donnees span { font-family: 'Geist Mono', monospace; font-size: 24px; padding: 14px 22px; border: 1.5px solid ${c.filet}; border-radius: 40px; color: ${c.doux}; }
.puces { list-style: none; display: flex; flex-direction: column; gap: 18px; }
.puces li { font-size: 32px; color: ${c.texte}; padding-left: 44px; position: relative; }
.puces li::before { content: ''; position: absolute; left: 0; top: 18px; width: 22px; height: 2px; background: ${c.puce}; }
.etapes { list-style: none; display: flex; flex-direction: column; border-top: 1.5px solid ${c.filet}; }
.etapes li { display: flex; align-items: baseline; gap: 32px; font-size: ${f.h > 1500 ? 36 : 33}px; line-height: 1.25; padding: ${f.h > 1500 ? 34 : 26}px 0; border-bottom: 1.5px solid ${c.filet}; }
.etapes i { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 30px; color: ${c.chiffre}; min-width: 84px; }
.conditions { list-style: none; display: flex; flex-direction: column; gap: 22px; }
.conditions li { display: flex; flex-direction: column; gap: 10px; padding: 36px 40px; border-radius: 16px; background: ${c.carte}; border: 1.5px solid ${c.filet}; }
.conditions li.et { background: none; border: none; padding: 0 40px; font-family: 'Geist Mono', monospace; font-size: 26px; text-transform: uppercase; letter-spacing: 0.14em; color: ${c.faible}; }
.conditions i { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 72px; letter-spacing: -0.04em; color: ${c.chiffre}; }
.conditions span { font-size: 32px; line-height: 1.3; color: ${c.doux}; }
.barres { display: flex; flex-direction: column; gap: 34px; }
.barre { display: grid; grid-template-columns: 170px 1fr; grid-template-rows: auto auto; column-gap: 24px; row-gap: 10px; align-items: center; }
.barre .nom { font-family: 'Geist Mono', monospace; font-size: 30px; color: ${c.doux}; grid-row: 1 / 3; }
.barre .piste { height: 28px; border-radius: 8px; background: ${s ? '#1e222b' : '#e2ded7'}; overflow: hidden; display: block; }
.barre .piste span { display: block; height: 100%; background: ${c.faible}; border-radius: 8px; }
.barre .val { font-family: 'Geist Mono', monospace; font-size: 34px; color: ${c.texte}; }
.barre.accent .val { color: ${c.chiffre}; }
.cta { font-family: 'Geist Mono', monospace; font-size: 26px; letter-spacing: 0.08em; text-transform: uppercase; color: ${c.chiffre}; }
.note { font-size: 22px; line-height: 1.4; color: ${c.faible}; max-width: 900px; margin-bottom: 36px; }
.bas { border-top: 1.5px solid ${c.filet}; padding-top: 32px; display: flex; flex-direction: column; gap: 18px; }
.bas .ligne { display: flex; justify-content: space-between; align-items: center; }
.bas img { height: 40px; }
.bas .site { font-family: 'Geist Mono', monospace; font-size: 28px; color: ${c.texte}; }
.bas .orias { font-family: 'Geist Mono', monospace; font-size: 18px; letter-spacing: 0.02em; color: ${c.faible}; }
`;
};

const page = (v, f, i) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css(f, v.ton)}</style></head><body>
<div class="grille"></div>
<img class="symbole" src="data:image/svg+xml;base64,${symbole[v.ton]}" alt="">
<div class="cadre">
  <div><div class="haut"><span>${v.eyebrow}</span><span class="num">${String(i + 1).padStart(2, '0')} / ${String(visuels.length).padStart(2, '0')}</span></div><div class="trait"></div></div>
  <main>${v.corps}</main>
  ${v.note ? `<p class="note">${v.note}</p>` : ''}
  <div class="bas"><div class="ligne"><img src="data:image/svg+xml;base64,${logo[v.ton]}" alt="PEAK FUNDING"><span class="site">peakfunding.eu</span></div><span class="orias">${ORIAS}</span></div>
</div></body></html>`;

rmSync(sortie, { recursive: true, force: true });
mkdirSync(sortie, { recursive: true });
mkdirSync(tmp, { recursive: true });
for (const [nomFormat, f] of Object.entries(formats)) {
  for (const [i, v] of visuels.entries()) {
    const html = join(tmp, `${v.slug}-${nomFormat}.html`);
    const png = join(sortie, `${v.slug}-${nomFormat}.png`);
    writeFileSync(html, page(v, f, i));
    execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=3000',
      `--window-size=${f.w},${f.h}`, `--screenshot=${png}`, pathToFileURL(html).href], { stdio: 'ignore' });
    const m = await sharp(png).metadata();
    if (m.width !== f.w || m.height !== f.h) throw new Error(`${png} : ${m.width}×${m.height}`);
    console.log(`${nomFormat}  ${v.slug}`);
  }
}
rmSync(tmp, { recursive: true, force: true });
