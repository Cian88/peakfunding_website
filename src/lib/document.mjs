import { load } from 'cheerio';
import { cleTheme } from './editorial.mjs';

/** Add anchors to the rendered copy only. Preserve every source character otherwise. */
export function documentAvecSommaire(source) {
  const $ = load(source, null, false);
  const used = new Set($('[id]').map((_, node) => $(node).attr('id')).get());
  const headings = [];
  const html = source.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    const title = load(inner, null, false).text().trim();
    const existing = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
    if (existing) { headings.push({ id: existing[1], title }); return full; }
    const base = `lecture-${cleTheme(title) || 'section'}`;
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    headings.push({ id, title });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html, headings };
}
