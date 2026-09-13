// Interpolation bornée : aucune oscillation ni dépassement de la publication.
export function valeurComptee(depart, cible, progression) {
  const p = Math.min(1, Math.max(0, progression));
  if (p === 1) return cible;
  return depart + (cible - depart) * (1 - (1 - p) ** 3);
}
