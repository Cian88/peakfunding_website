import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

// Binary extraction only: retain the seven original V1 WebP images byte for byte.
const slots = JSON.parse(readFileSync(new URL('../_source/site-actuel/image-slots-state.json', import.meta.url), 'utf8'));
const mapping = { 'capacite-locatif': 'cover-capacite', sci: 'cover-sci', primo: 'cover-primo', taux: 'cover-taux', enchainer: 'cover-enchainer', lemoine: 'cover-lemoine', 'non-resident': 'cover-nonresident' };
for (const [slug, slot] of Object.entries(mapping)) {
  const source = slots[slot].u;
  if (!source.startsWith('data:image/webp;base64,')) throw new Error(`Unexpected image format: ${slot}`);
  const bytes = Buffer.from(source.split(',')[1], 'base64');
  const output = new URL(`../public/img/article-v1-${slug}.webp`, import.meta.url);
  if (existsSync(output) && !readFileSync(output).equals(bytes)) throw new Error(`Refusing to replace a different existing asset: ${slug}`);
  if (!existsSync(output)) writeFileSync(output, bytes);
  const { width, height } = await sharp(bytes).metadata();
  console.log(`${slug}: ${width} x ${height}; original crop x=${slots[slot].x}, y=${slots[slot].y}`);
}
