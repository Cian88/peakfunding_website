export const OBSERVATOIRE_ORIGIN = 'https://lobservatoire.creditlogement.fr';
export const OBSERVATOIRE_TTL = 6 * 60 * 60 * 1000;
export const OBSERVATOIRE_SEMAINE = 7 * 24 * 60 * 60 * 1000;

// Ne jamais transformer une copie de secours en contrôle automatique réussi.
export function statutObservation(data, lang = 'fr', now = new Date()) {
  const checked = typeof data.checkedAt === 'string' ? Date.parse(data.checkedAt) : NaN;
  const manual = typeof data.verifiedOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.verifiedOn)
    ? Date.parse(`${data.verifiedOn}T00:00:00Z`) : NaN;
  const controleValide = Number.isFinite(checked) && checked <= now.getTime();
  const stamp = controleValide ? checked : manual;
  if (!Number.isFinite(stamp) || stamp > now.getTime()) return lang === 'en'
    ? 'Backup data — verification date unavailable'
    : 'Données de secours — date de vérification indisponible';
  const date = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', {timeZone:'UTC'}).format(new Date(stamp));
  const recent = now.getTime() - stamp < OBSERVATOIRE_SEMAINE;
  if (!data.stale && controleValide && recent) return lang === 'en'
    ? `Source verified on ${date}` : `Source vérifiée le ${date}`;
  return lang === 'en'
    ? `Last verified copy: ${date}${recent ? '' : ' — update pending'}`
    : `Dernière copie vérifiée le ${date}${recent ? '' : ' — actualisation en attente'}`;
}

export function observationValide(data, now = new Date()) {
  if (!data || !/^\d{4}-(0[1-9]|1[0-2])$/.test(data.period)) return false;
  const current = now.toISOString().slice(0, 7);
  if (data.period < '2000-01' || data.period > current) return false;
  if (!Number.isFinite(data.rate) || data.rate <= 0 || data.rate > 20) return false;
  if (!Number.isInteger(data.durationMonths) || data.durationMonths < 12 || data.durationMonths > 480) return false;
  if (typeof data.stale !== 'boolean') return false;
  if (!data.stale && data.checkedAt === null) return false;
  if (data.checkedAt !== null && (typeof data.checkedAt !== 'string' || !Number.isFinite(Date.parse(data.checkedAt)) || Date.parse(data.checkedAt) > now.getTime() + 60000)) return false;
  try {
    const url = new URL(data.sourceUrl);
    return url.origin === OBSERVATOIRE_ORIGIN && !url.username && !url.password && url.pathname.startsWith('/publications/');
  } catch { return false; }
}

export function libellePeriode(period) {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${period}-01T12:00:00Z`));
}
