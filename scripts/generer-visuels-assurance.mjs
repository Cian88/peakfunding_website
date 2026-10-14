/* Illustrations des guides « assurance emprunteur » ajoutés le 2026-10-14 (hors V1).
   Dessinées en SVG dans la palette des visuels d'origine (pêche, cuivre, crème), puis
   converties en WebP 1200 × 900 dans public/img/article-v1-<slug>.webp.
   Usage : node scripts/generer-visuels-assurance.mjs */
import sharp from 'sharp';

const W = 1200, H = 900;
const c = {
  fond1: '#fbf1e8', fond2: '#f3dcc8', colline: '#f0d3bb', colline2: '#ead0b8',
  cuivre: '#c8794a', orange: '#e07a45', profond: '#9c5534', creme: '#fffaf5',
  sable: '#f6e3d3', trait: '#e7c9b0', gris: '#b9a394', vert: '#6aa77a', rouge: '#d4583c',
};

/* Primitives */
const cercleIcone = (x, y, r, inner) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${c.creme}" stroke="${c.trait}" stroke-width="3"/>${inner(r)}</g>`;
const coche = (r) => `<path d="M${-r * 0.38} 0 L${-r * 0.1} ${r * 0.3} L${r * 0.42} ${-r * 0.32}" fill="none" stroke="${c.vert}" stroke-width="${r * 0.16}" stroke-linecap="round" stroke-linejoin="round"/>`;
const croix = (r) => `<path d="M${-r * 0.32} ${-r * 0.32} L${r * 0.32} ${r * 0.32} M${r * 0.32} ${-r * 0.32} L${-r * 0.32} ${r * 0.32}" stroke="${c.rouge}" stroke-width="${r * 0.15}" stroke-linecap="round"/>`;
const euro = (r) => `<text y="${r * 0.36}" text-anchor="middle" font-family="Georgia, serif" font-size="${r * 1.1}" fill="${c.cuivre}">€</text>`;
const etoile = (r) => `<path d="M0 ${-r * 0.45} L${r * 0.13} ${-r * 0.13} L${r * 0.45} ${-r * 0.1} L${r * 0.2} ${r * 0.12} L${r * 0.28} ${r * 0.45} L0 ${r * 0.27} L${-r * 0.28} ${r * 0.45} L${-r * 0.2} ${r * 0.12} L${-r * 0.45} ${-r * 0.1} L${-r * 0.13} ${-r * 0.13} Z" fill="${c.orange}"/>`;
const coeur = (r) => `<path d="M0 ${r * 0.38} C ${-r * 0.6} ${-r * 0.02} ${-r * 0.45} ${-r * 0.55} 0 ${-r * 0.22} C ${r * 0.45} ${-r * 0.55} ${r * 0.6} ${-r * 0.02} 0 ${r * 0.38} Z" fill="${c.rouge}"/>`;

const bouclier = (x, y, s, inner = 'coche') => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 -70 L58 -48 L58 4 C58 44 30 68 0 82 C-30 68 -58 44 -58 4 L-58 -48 Z" fill="${c.orange}" opacity="0.92"/>
  <path d="M0 -56 L45 -39 L45 3 C45 35 23 54 0 66 C-23 54 -45 35 -45 3 L-45 -39 Z" fill="${c.creme}" opacity="0.95"/>
  ${inner === 'coche' ? `<path d="M-20 4 L-5 20 L23 -12" fill="none" stroke="${c.orange}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
  ${inner === 'croix' ? `<path d="M-10 -22 h20 v22 h22 v20 h-22 v22 h-20 v-22 h-22 v-20 h22 Z" fill="${c.orange}"/>` : ''}
</g>`;

const documentPapier = (x, y, w, h, rot = 0, lignes = 6, extra = '') => `<g transform="translate(${x} ${y}) rotate(${rot})">
  <rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="10" fill="${c.trait}" opacity="0.5"/>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#fffdfb" stroke="${c.trait}" stroke-width="3"/>
  ${Array.from({ length: lignes }, (_, i) => `<rect x="${-w / 2 + 26}" y="${-h / 2 + 36 + i * 30}" width="${(i % 3 === 2 ? 0.55 : 0.8) * (w - 52)}" height="9" rx="4.5" fill="${i === 0 ? c.cuivre : c.trait}"/>`).join('')}
  ${extra}
</g>`;

const maison = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-120" y="-40" width="240" height="170" fill="#faf3ec" stroke="${c.trait}" stroke-width="3"/>
  <path d="M-150 -30 L0 -150 L150 -30 Z" fill="${c.cuivre}"/>
  <path d="M-150 -30 L0 -150 L150 -30" fill="none" stroke="${c.profond}" stroke-width="6" stroke-linejoin="round"/>
  <rect x="60" y="-150" width="30" height="60" fill="${c.profond}"/>
  <rect x="-25" y="40" width="50" height="90" rx="4" fill="${c.colline2}"/>
  <rect x="-95" y="0" width="45" height="45" rx="3" fill="${c.sable}" stroke="${c.trait}" stroke-width="3"/>
  <rect x="50" y="0" width="45" height="45" rx="3" fill="${c.sable}" stroke="${c.trait}" stroke-width="3"/>
</g>`;

const immeuble = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-110" y="-200" width="220" height="330" rx="6" fill="#faf3ec" stroke="${c.trait}" stroke-width="3"/>
  <rect x="-110" y="-215" width="220" height="22" rx="4" fill="${c.cuivre}"/>
  ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((k) => `<rect x="${-85 + k * 62}" y="${-170 + r * 62}" width="40" height="40" rx="3" fill="${(r + k) % 3 === 0 ? c.sable : c.colline}"/>`).join('')).join('')}
  <rect x="-24" y="70" width="48" height="60" rx="3" fill="${c.colline2}"/>
</g>`;

const pieces = (x, y, n = 5) => `<g transform="translate(${x} ${y})">${Array.from({ length: n }, (_, i) => `<ellipse cx="0" cy="${-i * 14}" rx="38" ry="12" fill="${i === n - 1 ? '#e8a46c' : c.cuivre}" stroke="${c.profond}" stroke-width="2"/>`).join('')}</g>`;

const graphiqueBaisse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-130" y="-120" width="260" height="210" rx="14" fill="#fffdfb" stroke="${c.trait}" stroke-width="3"/>
  ${[110, 88, 70, 50, 34].map((h, i) => `<rect x="${-100 + i * 44}" y="${70 - h}" width="28" height="${h}" rx="4" fill="${i < 2 ? c.trait : c.cuivre}"/>`).join('')}
  <path d="M-92 -70 L-48 -50 L-4 -30 L40 -8 L84 6" fill="none" stroke="${c.orange}" stroke-width="6" stroke-linecap="round"/>
  <path d="M70 -6 L88 8 L66 18" fill="none" stroke="${c.orange}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

const balance = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c.cuivre}" stroke-width="6" fill="none" stroke-linecap="round">
  <path d="M0 -80 V70 M-50 70 H50 M-90 -60 H90"/>
  <path d="M-90 -60 L-120 10 M-90 -60 L-60 10 M90 -60 L60 10 M90 -60 L120 10"/>
  <path d="M-125 10 Q-90 40 -55 10 Z M55 10 Q90 40 125 10 Z" fill="${c.sable}"/>
  <circle cx="0" cy="-86" r="9" fill="${c.cuivre}"/>
</g>`;

const banque = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-120 -60 L0 -120 L120 -60 Z" fill="${c.cuivre}"/>
  <rect x="-120" y="-60" width="240" height="14" fill="${c.profond}"/>
  ${[-90, -45, 0, 45, 90].map((px) => `<rect x="${px - 11}" y="-40" width="22" height="120" fill="#faf3ec" stroke="${c.trait}" stroke-width="3"/>`).join('')}
  <rect x="-130" y="80" width="260" height="18" fill="${c.colline2}"/>
</g>`;

const sablier = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-60" y="-100" width="120" height="14" rx="6" fill="${c.profond}"/>
  <rect x="-60" y="86" width="120" height="14" rx="6" fill="${c.profond}"/>
  <path d="M-45 -86 H45 C45 -30 8 -14 8 0 C8 14 45 30 45 86 H-45 C-45 30 -8 14 -8 0 C-8 -14 -45 -30 -45 -86 Z" fill="${c.creme}" stroke="${c.cuivre}" stroke-width="5"/>
  <path d="M-28 -50 H28 C20 -30 6 -20 0 -8 C-6 -20 -20 -30 -28 -50 Z" fill="#e8a46c"/>
  <path d="M-34 80 C-20 52 20 52 34 80 Z" fill="#e8a46c"/>
</g>`;

const casque = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-90 20 C-90 -60 90 -60 90 20 Z" fill="${c.orange}"/>
  <rect x="-110" y="14" width="220" height="22" rx="11" fill="${c.profond}"/>
  <rect x="-12" y="-62" width="24" height="70" rx="8" fill="#e8a46c"/>
</g>`;

const montagne = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-170 90 L-50 -90 L20 10 L70 -40 L170 90 Z" fill="${c.colline2}"/>
  <path d="M-50 -90 L-22 -48 L-40 -40 L-60 -52 L-78 -48 Z" fill="${c.creme}"/>
  <path d="M-50 -90 V-150" stroke="${c.profond}" stroke-width="5"/>
  <path d="M-50 -150 L-5 -136 L-50 -122 Z" fill="${c.orange}"/>
</g>`;

const camembert = (x, y, r) => {
  const a = 0.6 * 2 * Math.PI;
  const ex = Math.sin(a) * r, ey = -Math.cos(a) * r;
  return `<g transform="translate(${x} ${y})">
    <circle r="${r}" fill="${c.trait}"/>
    <path d="M0 0 L0 ${-r} A ${r} ${r} 0 1 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="${c.cuivre}"/>
    <circle r="${r * 0.42}" fill="${c.creme}"/>
    <text y="${-6}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${r * 0.2}" fill="${c.profond}">60 %</text>
    <text y="${r * 0.2}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${r * 0.16}" fill="${c.gris}">40 %</text>
  </g>`;
};

const personne = (x, y, s, pull, cheveux) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-70 160 C-70 70 -40 40 0 40 C40 40 70 70 70 160 Z" fill="${pull}"/>
  <rect x="-14" y="18" width="28" height="30" rx="10" fill="#f1c7a6"/>
  <circle cx="0" cy="-10" r="42" fill="#f6d2b5"/>
  <path d="M-44 -12 C-48 -60 -10 -66 0 -60 C30 -70 50 -40 44 -12 C34 -36 10 -40 -6 -36 C-24 -40 -38 -30 -44 -12 Z" fill="${cheveux}"/>
</g>`;

const cle = (x, y, s, rot = -30) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <circle cx="-60" cy="0" r="34" fill="none" stroke="${c.cuivre}" stroke-width="14"/>
  <rect x="-28" y="-8" width="130" height="16" rx="6" fill="${c.cuivre}"/>
  <rect x="70" y="8" width="14" height="26" rx="3" fill="${c.cuivre}"/><rect x="92" y="8" width="12" height="18" rx="3" fill="${c.cuivre}"/>
</g>`;

const stethoscope = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c.profond}" stroke-width="7" stroke-linecap="round">
  <path d="M-40 -80 V-20 C-40 20 40 20 40 -20 V-80"/>
  <path d="M0 14 V60 C0 100 70 100 70 60 V40"/>
  <circle cx="70" cy="28" r="16" fill="${c.orange}" stroke="${c.profond}"/>
</g>`;

/* Décor commun : fond dégradé, halo, collines et feuillages, comme les visuels d'origine. */
const decor = (contenu) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.fond1}"/><stop offset="1" stop-color="${c.fond2}"/></linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.38" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fond)"/>
  <circle cx="600" cy="330" r="420" fill="url(#halo)"/>
  <path d="M0 640 C 220 560 380 600 600 590 C 820 580 980 540 1200 600 V900 H0 Z" fill="${c.colline}" opacity="0.7"/>
  <path d="M60 700 C 40 600 70 520 120 470 C 150 540 140 630 60 700 Z" fill="#efc7a5" opacity="0.8"/>
  <path d="M1140 700 C 1160 600 1130 520 1080 470 C 1050 540 1060 630 1140 700 Z" fill="#efc7a5" opacity="0.8"/>
  <path d="M90 700 C 130 600 100 520 60 490" fill="none" stroke="#e0aa80" stroke-width="4"/>
  <path d="M1110 700 C 1070 600 1100 520 1140 490" fill="none" stroke="#e0aa80" stroke-width="4"/>
  <path d="M120 120 h60 a20 20 0 0 1 0 40 h-90 a24 24 0 0 1 4 -46 a30 30 0 0 1 26 6 Z" fill="#ffffff" opacity="0.8"/>
  <path d="M0 760 H1200 V900 H0 Z" fill="${c.sable}"/>
  <rect x="0" y="752" width="1200" height="12" fill="${c.trait}"/>
  ${contenu}
</svg>`;

const scenes = {
  'economie-assurance-emprunteur': decor(`
    ${graphiqueBaisse(600, 470, 1.25)}
    ${bouclier(330, 300, 1.1)}
    ${pieces(870, 700, 6)}${pieces(960, 720, 4)}
    ${cercleIcone(880, 250, 46, euro)}${cercleIcone(250, 560, 40, euro)}${cercleIcone(1010, 420, 36, coche)}
    ${documentPapier(300, 640, 200, 150, -6, 3)}`),
  'refus-delegation-banque': decor(`
    ${banque(330, 520, 1.25)}
    ${documentPapier(720, 470, 270, 330, 4, 7, `<circle cx="80" cy="110" r="38" fill="none" stroke="${c.rouge}" stroke-width="7"/><path d="M62 92 L98 128 M98 92 L62 128" stroke="${c.rouge}" stroke-width="7" stroke-linecap="round"/>`)}
    ${balance(980, 300, 0.9)}
    ${cercleIcone(560, 200, 44, croix)}${cercleIcone(960, 600, 44, coche)}
    ${bouclier(190, 230, 0.75)}`),
  'assurance-emprunteur-sante': decor(`
    ${bouclier(600, 330, 1.7, 'croix')}
    ${documentPapier(330, 560, 230, 290, -8, 6, `<path d="M-60 100 L-45 115 L-20 88" fill="none" stroke="${c.vert}" stroke-width="7" stroke-linecap="round"/>`)}
    ${stethoscope(860, 560, 1.15)}
    ${cercleIcone(880, 220, 44, coeur)}${cercleIcone(300, 240, 40, coche)}${cercleIcone(1010, 400, 34, etoile)}`),
  'assurance-emprunteur-senior': decor(`
    ${maison(470, 560, 1.1)}
    ${sablier(860, 520, 1.15)}
    ${bouclier(470, 250, 1.0)}
    ${cercleIcone(250, 330, 42, coche)}${cercleIcone(1010, 300, 38, euro)}${cercleIcone(700, 220, 36, etoile)}
    ${documentPapier(760, 690, 180, 110, 5, 2)}`),
  'assurance-emprunteur-metiers-sports-risque': decor(`
    ${montagne(820, 600, 1.35)}
    ${casque(360, 560, 1.15)}
    ${bouclier(600, 300, 1.25)}
    ${cercleIcone(300, 260, 42, etoile)}${cercleIcone(930, 230, 42, coche)}${cercleIcone(1030, 420, 34, croix)}`),
  'quotite-assurance-emprunteur': decor(`
    ${personne(330, 520, 1.1, c.orange, '#7a4a33')}
    ${personne(870, 520, 1.1, c.cuivre, '#4b3328')}
    ${camembert(600, 420, 150)}
    ${bouclier(600, 180, 0.7)}
    ${documentPapier(600, 700, 260, 110, 0, 2)}
    ${cercleIcone(180, 300, 36, coche)}${cercleIcone(1030, 300, 36, coche)}`),
  'assurance-emprunteur-investissement-locatif': decor(`
    ${immeuble(420, 600, 1.15)}
    ${bouclier(740, 300, 1.15)}
    ${cle(820, 560, 1.2)}
    ${pieces(1000, 720, 5)}
    ${cercleIcone(230, 300, 40, euro)}${cercleIcone(980, 230, 40, coche)}${cercleIcone(640, 650, 36, etoile)}`),
};

for (const [slug, svg] of Object.entries(scenes)) {
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(`public/img/article-v1-${slug}.webp`);
  console.log(`public/img/article-v1-${slug}.webp`);
}
