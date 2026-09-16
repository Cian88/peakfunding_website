/** Images extracted unchanged from the V1 image-slots-state.json. */
export const visuelsArticles = {
  'capacite-locatif': { slot: 'cover-capacite', width: 1200, height: 670, alt: 'Immeuble, clé et schéma de capacité d’emprunt — illustration.' },
  sci: { slot: 'cover-sci', width: 900, height: 900, alt: 'Illustration du choix de financement en SCI.' },
  primo: { slot: 'cover-primo', width: 900, height: 900, alt: 'Couple de primo-accédants et dispositifs de financement — illustration.' },
  taux: { slot: 'cover-taux', width: 900, height: 900, alt: 'Illustration du marché des taux immobiliers.' },
  enchainer: { slot: 'cover-enchainer', width: 900, height: 900, alt: 'Illustration de plusieurs investissements immobiliers successifs.' },
  lemoine: { slot: 'cover-lemoine', width: 1108, height: 827, alt: 'Illustration de l’assurance emprunteur et de la loi Lemoine.' },
  'non-resident': { slot: 'cover-nonresident', width: 900, height: 900, alt: 'Illustration d’un investissement immobilier en France depuis l’étranger.' },
  // Article ajouté le 2026-09-16 (hors V1) : illustration générée dans le style des sept visuels d'origine.
  'delegation-assurance': { slot: undefined, width: 1200, height: 900, alt: 'Couple comparant deux contrats d’assurance emprunteur devant une maison — illustration.' },
} as const;

/** English alternative text for the same article cover images. */
export const altArticlesEn: Record<keyof typeof visuelsArticles, string> = {
  'capacite-locatif': 'Building, key and borrowing-capacity diagram — illustration.',
  sci: 'Illustration of the SCI financing choice.',
  primo: 'First-time buyers and financing schemes — illustration.',
  taux: 'Illustration of the mortgage-rate market.',
  enchainer: 'Illustration of several successive property investments.',
  lemoine: 'Illustration of borrower insurance and the Lemoine law.',
  'non-resident': 'Illustration of investing in French property from abroad.',
  'delegation-assurance': 'Couple comparing two borrower-insurance policies in front of a house — illustration.',
};
