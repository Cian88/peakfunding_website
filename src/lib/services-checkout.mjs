// La validation Stancer et l’ouverture de chaque offre sont deux réglages distincts.
const salesSettings = new Map([
  ['pitch', ['PUBLIC_PEAK_PITCH_ENABLED', 'PUBLIC_PEAK_PITCH_URL']],
  ['exchange', ['PUBLIC_PEAK_EXCHANGE_ENABLED', 'PUBLIC_PEAK_EXCHANGE_URL']],
]);

export function stancerServiceURL(env, service) {
  const settings = salesSettings.get(service);
  if (!settings || env.PUBLIC_STANCER_READY !== 'true') return null;
  const [enabled, address] = settings;
  if (env[enabled] !== 'true') return null;
  try {
    const url = new URL(env[address] || '');
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) return null;
    return url.href.replace(/\/$/, '');
  } catch {
    return null;
  }
}
