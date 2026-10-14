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
  // Guides assurance ajoutés le 2026-10-14 (hors V1) : illustrations de scripts/generer-visuels-assurance.mjs.
  'economie-assurance-emprunteur': { slot: undefined, width: 1200, height: 900, alt: 'Graphique en baisse, bouclier et pièces : l’économie sur l’assurance de prêt — illustration.' },
  'refus-delegation-banque': { slot: undefined, width: 1200, height: 900, alt: 'Banque, courrier de refus et balance : contester un refus de délégation — illustration.' },
  'assurance-emprunteur-sante': { slot: undefined, width: 1200, height: 900, alt: 'Bouclier médical, questionnaire et stéthoscope : assurance de prêt et santé — illustration.' },
  'assurance-emprunteur-senior': { slot: undefined, width: 1200, height: 900, alt: 'Maison, sablier et bouclier : assurance de prêt après 60 ans — illustration.' },
  'assurance-emprunteur-metiers-sports-risque': { slot: undefined, width: 1200, height: 900, alt: 'Casque de chantier, sommet et bouclier : métiers et sports à risque — illustration.' },
  'quotite-assurance-emprunteur': { slot: undefined, width: 1200, height: 900, alt: 'Deux emprunteurs et une répartition 60 / 40 : la quotité d’assurance — illustration.' },
  'assurance-emprunteur-investissement-locatif': { slot: undefined, width: 1200, height: 900, alt: 'Immeuble, clé et bouclier : assurance de prêt en investissement locatif — illustration.' },
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
  'economie-assurance-emprunteur': 'Falling chart, shield and coins: the saving on loan insurance — illustration.',
  'refus-delegation-banque': 'Bank, refusal letter and scales: challenging a delegation refusal — illustration.',
  'assurance-emprunteur-sante': 'Medical shield, questionnaire and stethoscope: loan insurance and health — illustration.',
  'assurance-emprunteur-senior': 'House, hourglass and shield: loan insurance after 60 — illustration.',
  'assurance-emprunteur-metiers-sports-risque': 'Hard hat, summit and shield: high-risk jobs and sports — illustration.',
  'quotite-assurance-emprunteur': 'Two borrowers and a 60/40 split: insurance coverage share — illustration.',
  'assurance-emprunteur-investissement-locatif': 'Apartment building, key and shield: loan insurance for buy-to-let — illustration.',
};
