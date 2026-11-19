/** Rebuild the static sharing card from the survey SVG and the local wordmark. */
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const asset = (name) => new URL('../../public/' + name, import.meta.url).pathname;
const paper = '#f7f8f4';
const ink = '#172b32';
const terrain = JSON.parse(await readFile(new URL('./puy-de-dome.json', import.meta.url), 'utf8'));
const map = await sharp(asset('cartographie/relief.svg')).resize(760, 608).png().toBuffer();
const logo = await sharp(asset('img/logo-peak-funding.svg')).resize(350).png().toBuffer();
const labels = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <path d="M30 35H1170M30 594H408M605 594H1170" stroke="${ink}" fill="none"/>
  <path d="M30 245H90" stroke="#b73b1c" stroke-width="4"/>
  <g fill="${ink}" font-family="monospace">
    <text x="30" y="370" font-size="14">45.7724° N / 2.9642° E</text>
    <text x="30" y="404" font-size="12">PUY DE DÔME · FR</text>
    <text x="30" y="615" font-size="11">Source IGN · RGE ALTI® · Licence Ouverte 2.0 · ${terrain.retrieved}</text>
  </g>
</svg>`);

await sharp({ create: { width: 1200, height: 630, channels: 3, background: paper } })
  .composite([
    { input: map, left: 420, top: 11 },
    { input: logo, left: 30, top: 267 },
    { input: labels, left: 0, top: 0 },
  ])
  .jpeg({ quality: 89, mozjpeg: true })
  .toFile(asset('img/releve-partage.jpg'));
