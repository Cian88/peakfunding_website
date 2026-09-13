const clamp = value => Math.max(0, Math.min(1, value));
const sombre = [11, 13, 18];
const clair = [242, 240, 235];
const blanc = [255, 255, 255];
const noir = [0, 0, 0];

export function luminance(rgb) {
  const c = rgb.map(v => { const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
}
export function contraste(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export const couleurCSS = rgb => `rgb(${rgb.join(', ')})`;

// A single solid canvas. Progress is reversible and determined only by scroll position.
export function tonaliteAuScroll(reperes, scroll, hauteur, finHero = 0) {
  if (!reperes.length) return 0;
  let valeur = reperes[0].clair ? 1 : 0;
  for (let i = 1; i < reperes.length; i++) {
    const avant = reperes[i - 1].clair ? 1 : 0;
    const apres = reperes[i].clair ? 1 : 0;
    if (avant === apres) continue;
    const debut = Math.max(reperes[i].top - hauteur * .7, i === 1 ? finHero - 76 : 0);
    const fin = Math.max(reperes[i].top - hauteur * .15, debut + hauteur * .4);
    if (scroll < debut) break;
    const p = clamp((scroll - debut) / (fin - debut));
    const doux = p * p * (3 - 2 * p);
    valeur = avant + (apres - avant) * doux;
    if (p < 1) break;
  }
  return valeur;
}

export function paletteFond(progression) {
  const p = clamp(progression);
  const fond = sombre.map((v, i) => Math.round(v + (clair[i] - v) * p));
  const base = contraste(noir, fond) >= contraste(blanc, fond) ? noir : blanc;
  const estClair = base === noir;
  const lisible = prefere => {
    if (contraste(prefere, fond) >= 4.5) return prefere;
    for (let i = 1; i <= 20; i++) {
      const candidat = prefere.map((v, j) => Math.round(v + (base[j] - v) * i / 20));
      if (contraste(candidat, fond) >= 4.5) return candidat;
    }
    return base;
  };
  return {
    fond,
    texte: lisible(estClair ? [17,17,17] : [237,234,228]),
    secondaire: lisible(estClair ? [61,63,70] : [166,169,179]),
    accent: lisible(estClair ? [154,107,69] : [217,164,124]),
    bordure: estClair ? 'rgba(17,17,17,.22)' : 'rgba(237,234,228,.25)',
  };
}
