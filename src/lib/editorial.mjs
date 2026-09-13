/** Stable editorial keys: accents and punctuation must not alter filter matching. */
export const cleTheme = value => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const mois = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
export function dateISO(value = '') {
  const normalized = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const match = normalized.match(/(\d{1,2})(?:er)?\s+([a-z]+)\s+(\d{4})/);
  if (!match || !mois.includes(match[2])) return '';
  const month = String(mois.indexOf(match[2]) + 1).padStart(2, '0');
  const iso = `${match[3]}-${month}-${match[1].padStart(2, '0')}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso ? iso : '';
}

export const dateArticle = article => (article.apres[1] || '').split(' · ').pop() || '';
export const trierArticles = articles => [...articles].sort((a, b) => dateISO(dateArticle(b)).localeCompare(dateISO(dateArticle(a))));
