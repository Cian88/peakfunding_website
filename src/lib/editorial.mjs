/** Stable editorial keys: accents and punctuation must not alter filter matching. */
export const cleTheme = value => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const mois = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const monthsEn = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
export function dateISO(value = '') {
  const normalized = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const match = normalized.match(/(\d{1,2})(?:er|st|nd|rd|th)?\s+([a-z]+)\s+(\d{4})/);
  if (!match) return '';
  const index = mois.indexOf(match[2]) >= 0 ? mois.indexOf(match[2]) : monthsEn.indexOf(match[2]);
  if (index < 0) return '';
  const month = String(index + 1).padStart(2, '0');
  const iso = `${match[3]}-${month}-${match[1].padStart(2, '0')}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso ? iso : '';
}

export const dateArticle = article => (article.apres[1] || '').split(' · ').pop() || '';
export const trierArticles = articles => [...articles].sort((a, b) => dateISO(dateArticle(b)).localeCompare(dateISO(dateArticle(a))));
