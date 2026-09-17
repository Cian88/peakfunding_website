import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { extraireObservation } from '../src/server/observatoire.mjs';
import { OBSERVATOIRE_ORIGIN, OBSERVATOIRE_SEMAINE, observationValide } from '../src/lib/observatoire.mjs';

const fichiers = ['observatoire.json', 'observatoire-seed.json'];
const directory = fileURLToPath(new URL('../public/api/', import.meta.url));

// Source fixe, pas de redirection, cookie ou secret transmis.
export async function verifierSource({ fetcher = fetch, now = new Date() } = {}) {
  const response = await fetcher(`${OBSERVATOIRE_ORIGIN}/`, {
    signal:AbortSignal.timeout(15000), redirect:'error',
    headers:{Accept:'text/html','User-Agent':'PEAK-FUNDING-Observatoire/1.0 (+https://peakfunding.eu)'},
  });
  if (!response.ok) throw new Error(`Source indisponible (HTTP ${response.status})`);
  if (!response.body) throw new Error('Réponse vide');
  const chunks = []; let size = 0;
  const reader = response.body.getReader();
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2000000) { await reader.cancel(); throw new Error('Réponse trop volumineuse'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return extraireObservation(Buffer.concat(chunks).toString('utf8'), now);
}

export function controleNecessaire(data, now = new Date()) {
  const checked = typeof data.checkedAt === 'string' ? Date.parse(data.checkedAt) : NaN;
  return data.stale || !Number.isFinite(checked) || +now < checked || +now-checked >= OBSERVATOIRE_SEMAINE;
}

export async function actualiserObservatoire({ dossier = directory, fetcher = fetch, now = new Date(), force = false, dryRun = false } = {}) {
  const paths = fichiers.map(name => resolve(dossier, name));
  const originals = await Promise.all(paths.map(path => readFile(path, 'utf8')));
  const saved = originals.map(text => JSON.parse(text));
  if (saved.some(data => !observationValide(data, now))) throw new Error('Copie locale invalide : contrôle manuel requis');
  const latest = [...saved].sort((a,b) => b.period.localeCompare(a.period) ||
    (Date.parse(b.checkedAt ?? '') || 0)-(Date.parse(a.checkedAt ?? '') || 0))[0];
  const due = force || controleNecessaire(latest, now);
  const next = due ? await verifierSource({fetcher,now}) : latest;
  if (next.period < latest.period) throw new Error('Publication plus ancienne : dernière copie conservée');
  const serialized = JSON.stringify(next, null, 2)+'\n';
  const changed = originals.some(text => text !== serialized);
  if (changed && !dryRun) {
    // Validation et préparation intégrales avant remplacement ; aucun commit en cas d'échec.
    const temps = paths.map(path => `${path}.${process.pid}.tmp`);
    try {
      for (const path of temps) await writeFile(path,serialized,{flag:'wx'});
      for (let i=0;i<paths.length;i++) await rename(temps[i],paths[i]);
    } finally { await Promise.all(temps.map(path => unlink(path).catch(error => { if(error.code !== 'ENOENT') throw error; }))); }
  }
  return {checked:due,changed,data:next,dryRun};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => !['--force','--dry-run'].includes(arg))) throw new Error('Options : --force, --dry-run');
    const result = await actualiserObservatoire({force:args.includes('--force'),dryRun:args.includes('--dry-run')});
    console.log(JSON.stringify(result,null,2));
  } catch (error) {
    console.error(`Observatoire : ${error.message}. Aucune donnée amont invalide publiée.`);
    process.exitCode = 1;
  }
}
