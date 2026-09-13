/* Génère src/data/france-departements.json : contours des départements
   métropolitains projetés en tracés SVG compacts + paramètres de projection
   (réutilisés par MurAvis pour placer les villes). Source : gregoiredavid/france-geojson.
   Usage : node scripts/generer-carte-france.mjs chemin/vers/departements-version-simplifiee.geojson */
import { readFileSync, writeFileSync } from 'node:fs';
const src = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const lat0 = (46.5 * Math.PI) / 180, cos = Math.cos(lat0);          // équirectangulaire corrigée
const code = (f) => String(f.properties.code ?? f.properties.CODE_DEPT ?? '');
const feats = src.features.filter((f) => /^(0?[1-9]|[1-8]\d|9[0-5]|2[AB])$/.test(code(f)));
const rings = (geom, fn) => { const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates; for (const p of polys) for (const r of p) fn(r); };
let minLng = 1e9, maxLng = -1e9, minLat = 1e9, maxLat = -1e9;
for (const f of feats) rings(f.geometry, (r) => { for (const [x, y] of r) { minLng = Math.min(minLng, x); maxLng = Math.max(maxLng, x); minLat = Math.min(minLat, y); maxLat = Math.max(maxLat, y); } });
const pad = 0.12; minLng -= pad; maxLng += pad; minLat -= pad; maxLat += pad;
const w = 1000, s = w / ((maxLng - minLng) * cos), h = Math.round((maxLat - minLat) * s);
const proj = (lng, lat) => [(lng - minLng) * cos * s, (maxLat - lat) * s];
const departements = feats.map((f) => {
  let d = '';
  rings(f.geometry, (r) => {
    let lx = null, ly = null, first = true;
    for (const [lng, lat] of r) {
      const [x, y] = proj(lng, lat);
      if (!first && Math.abs(x - lx) + Math.abs(y - ly) < 1.2) continue;   // décimation légère
      d += (first ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1); lx = x; ly = y; first = false;
    }
    d += 'Z';
  });
  return { code: code(f), nom: f.properties.nom ?? f.properties.NOM_DEPT ?? '', d };
}).sort((a, b) => a.code.localeCompare(b.code));
const out = { projection: { minLng, maxLat, cos, s, w, h }, departements };
writeFileSync('src/data/france-departements.json', JSON.stringify(out));
console.log(`OK : ${departements.length} départements, viewBox ${w}×${h}, ${(JSON.stringify(out).length / 1024).toFixed(0)} Ko`);
