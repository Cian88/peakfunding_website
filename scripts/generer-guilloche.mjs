// Une seule courbe de chaque famille est échantillonnée. Les rotations en
// décalent la phase pour former deux couronnes entrelacées.
import { writeFileSync } from "node:fs";
const tour = 2 * Math.PI;
function courbe(rayon, amplitude, lobes) {
  return (
    Array.from({ length: 721 }, (_, i) => {
      const t = (tour * i) / 720;
      const r = rayon + amplitude * Math.cos(lobes * t);
      return (
        (i ? "L" : "M") +
        (300 + r * Math.cos(t)).toFixed(2) +
        "," +
        (300 + r * Math.sin(t)).toFixed(2)
      );
    }).join("") + "Z"
  );
}
function couronne(id, copies, angle) {
  return Array.from(
    { length: copies },
    (_, i) => `<use href="#${id}" transform="rotate(${i * angle} 300 300)"/>`,
  ).join("\n");
}
const cercles = [139, 143, 149, 155, 162, 218, 223, 228, 273, 278, 286]
  .map((r) => `<circle cx="300" cy="300" r="${r}"/>`)
  .join("");
const reperes = Array.from(
  { length: 120 },
  (_, i) =>
    `<path d="M300 16v${i % 5 ? 3 : 7}" transform="rotate(${3 * i} 300 300)"/>`,
).join("");
writeFileSync(
  new URL("../public/img/guilloche.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none" stroke="#d8c598" stroke-width=".7"><defs><path id="a" d="${courbe(239, 30, 12)}"/><path id="b" d="${courbe(190, 30, 18)}"/></defs>${couronne("a", 24, 0.57)}${couronne("b", 18, 0.65)}${cercles}${reperes}</svg>\n`,
);
