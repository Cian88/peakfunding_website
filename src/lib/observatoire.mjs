export const OBSERVATOIRE_ORIGIN = 'https://lobservatoire.creditlogement.fr';
export const OBSERVATOIRE_TTL = 6 * 60 * 60 * 1000;

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
