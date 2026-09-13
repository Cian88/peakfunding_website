/* Contenu de la page d'accueil par langue. Le français réutilise les données
   existantes (site.ts, textes.ts) — aucune duplication ni risque de régression ;
   l'anglais est défini ici. Les composants de page lisent ce module selon la
   langue courante. */

import { mission as missionFr, expertisesResume as expResumeFr, methode as methodeFr, equipe as equipeFr } from './site';
import { faqAccueil as faqFr, partenaires as partenairesFr, faqExpertises as faqExpFr } from './textes';
import { expertises as expertisesFrData } from './expertises';
import { expertisesEn } from './en/expertises';
import { faqExpertisesEn } from './en/textes';
import type { Lang } from '../i18n';

export function expertisesFor(lang: Lang) {
  return lang === 'en' ? expertisesEn : expertisesFrData;
}
export function faqExpertisesFor(lang: Lang) {
  return lang === 'en' ? faqExpertisesEn : faqExpFr;
}

const expUiFr = {
  fil_expertises: 'Expertises',
  pourQui: 'Pour qui',
  concretement: 'Concrètement',
  concretement_titre: 'La précision fait<br />la différence.',
  comment: 'Comment ça se passe',
  etape: 'Étape',
  faq_eyebrow: 'Questions fréquentes',
  faq_titre: 'Ce qu’on nous demande souvent.',
  final_insure: 'Échanger avec le cabinet',
  final_autre: 'Estimer ma capacité',
  nouvel_onglet: ' (nouvel onglet)',
};
const expUiEn: typeof expUiFr = {
  fil_expertises: 'Expertise',
  pourQui: 'Who it’s for',
  concretement: 'In practice',
  concretement_titre: 'Precision makes<br />the difference.',
  comment: 'How it works',
  etape: 'Step',
  faq_eyebrow: 'Frequently asked',
  faq_titre: 'What we’re often asked.',
  final_insure: 'Talk to the firm',
  final_autre: 'Estimate my capacity',
  nouvel_onglet: ' (new tab)',
};
export function expertiseUi(lang: Lang) {
  return lang === 'en' ? expUiEn : expUiFr;
}
