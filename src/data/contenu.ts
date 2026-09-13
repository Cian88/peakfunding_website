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

const chiffresFr = [
  { valeur: 500, suffixe: '+', libelle: 'Projets financés' },
  { valeur: 95, suffixe: ' %', libelle: 'Taux d’obtention' },
  { valeur: 30, suffixe: '+', libelle: 'Partenaires bancaires' },
  { valeur: 72, suffixe: ' h', libelle: 'Première réponse' },
];
const chiffresEn = [
  { valeur: 500, suffixe: '+', libelle: 'Financed projects' },
  { valeur: 95, suffixe: ' %', libelle: 'Approval rate' },
  { valeur: 30, suffixe: '+', libelle: 'Banking partners' },
  { valeur: 72, suffixe: ' h', libelle: 'First response' },
];

const missionEn = {
  intro: 'A poorly structured loan is paid for over twenty years. Before negotiating anything, we take the time to understand your situation, your tax position and what you want to do next.',
  cartes: [
    { titre: 'A global approach', texte: 'Financing, taxation, wealth: everything is connected. We look at the whole picture before choosing a structure.' },
    { titre: 'Expert coordination', texte: 'We work alongside your accountant, your notary or your tax adviser, and we steer the whole process.' },
    { titre: 'A broad banking network', texte: 'More than thirty partner banks. They don’t all share the same criteria: we know which one to approach, and how.' },
    { titre: 'A long-term view', texte: 'Your first loan should not block the second. We structure every file with what comes next in mind.' },
  ],
};

const expResumeEn = [
  { slug: 'estate', icone: 'estate', nom: 'PEAK ESTATE', accroche: 'Buy-to-let & wealth property', texte: 'Primary residence, rental investment, SCI: we look for the structure suited to your situation — not the other way round.' },
  { slug: 'pro', icone: 'pro', nom: 'PEAK PRO', accroche: 'Business financing & LBO', texte: 'Starting, buying or growing a business? We structure the financing that goes with it.' },
  { slug: 'pim', icone: 'pim', nom: 'PEAK PIM', accroche: 'Real-estate professionals', texte: 'Property traders, developers, holding companies: financing lines designed for fast-moving operations.' },
  { slug: 'insure', icone: 'insure', nom: 'PEAK INSURE', accroche: 'Borrower insurance delegation', texte: 'Insurance can account for up to a third of the cost of your loan. There is almost always a better option.' },
] as const;

const methodeEn = [
  { titre: 'Reviewing your situation', texte: 'A full review of your situation: income, assets, taxation, projects. That is often where the room to manoeuvre lies.' },
  { titre: 'Structuring the file', texte: 'Personal name or company, which term, which down payment, which debt level: we define the structure with you.' },
  { titre: 'Bank negotiation', texte: 'We present your file to the banks best placed for your profile, and negotiate the rate, guarantees and terms.' },
  { titre: 'Follow-up to disbursement', texte: 'We stay mobilised until the funds are released, and remain available afterwards for a renegotiation or your next deal.' },
];

const equipeEn = {
  intro: 'You speak to the person who actually builds your file, from the first call to the release of funds. No call centre, no file that changes hands.',
  membres: equipeFr.membres.map((m) => ({
    ...m,
    role: m.role === 'Dirigeant' ? 'Managing Partner' : 'Associate broker',
    domaine:
      m.domaine === 'Financement professionnel & PIM'
        ? 'Business & real-estate developer financing'
        : 'Buy-to-let property financing',
  })),
};

const faqEn = [
  { q: 'How much does your service cost?', r: 'The first conversation and the eligibility review cost you nothing. Our fees are stated from the outset and are only due if the financing succeeds, when the funds are released.' },
  { q: 'My bank has already refused my file — is that final?', r: 'No, and it is a common case. Criteria vary significantly from one bank to another: a file refused by one may be accepted by another, especially once reworked. We rebuild the structure and target the institutions suited to your profile.' },
  { q: 'How long does it take to get an agreement?', r: 'You get a first response within 72 hours. Then allow on average 6 to 8 weeks between submitting the file and the agreement — longer when the structure is complex.' },
  { q: 'Do you work throughout France?', r: 'Yes, throughout France, including for expatriates and non-residents. All exchanges can take place remotely, by video call or by phone, with the same contact from start to finish.' },
  { q: 'Can I borrow for a rental property if I already have a loan?', r: 'Often, yes. Not every bank treats rent the same way when calculating your debt ratio. With the right institution and the right structure (SCI, deferral, term), it is common to unlock a capacity that your current bank refuses.' },
];

const partenairesEn = [
  { nom: 'PRIVEOS', url: 'https://priveos.io/', logo: '/img/logo-priveos.png', texte: 'Independent wealth-engineering firm in Paris. PRIVEOS supports executives, investors and demanding private clients with a full wealth review: taxation, transmission, protection and investment strategy.' },
  { nom: 'EDILOS', url: 'https://edilos.fr/', logo: '/img/logo-edilos.png', texte: 'Specialist in turnkey buy-to-let investment in renovated older property. As a general contractor with an obligation of result, EDILOS manages every step: sourcing, renovation, tax optimisation and letting.' },
];

const uiFr = {
  hero_eyebrow: 'Courtier indépendant · France entière',
  hero_titre: ['Votre financement, ', 'pensé dans ', 'son ensemble.'],
  hero_texte: 'Immobilier, entreprise, patrimoine. Nous structurons votre dossier, le défendons auprès de plus de trente banques et restons à vos côtés jusqu’au déblocage des fonds.',
  hero_cta1: 'Parlons de votre projet',
  hero_cta2: 'Estimer ma capacité',
  hero_note: 'Un premier échange de 30 minutes, sans engagement.',
  hero_assurance: 'Comparer mon assurance emprunteur ↗',
  hero_nouvel_onglet: ' (nouvel onglet)',
  hero_orias: 'ORIAS n° 24002546 · Supervision ACPR',
  hero_decouvrir: 'Découvrir nos expertises',
  chiffres_aria: 'Nos chiffres',
  mission_eyebrow: 'Notre mission',
  mission_titre: 'Nous ne cherchons pas un taux. Nous construisons une opération.',
  mission_alt: 'Analyse d’un dossier de financement, documents et écran de travail.',
  sim_eyebrow: 'Simulateur',
  sim_titre: 'Combien pouvez-vous emprunter ?',
  sim_texte: 'Revenus, charges, apport, durée : un ordre de grandeur immédiat, calculé avec les règles que les banques appliquent réellement. Nous partons de ce chiffre pour construire l’opération.',
  exp_eyebrow: 'Nos expertises',
  exp_titre: 'Quatre pôles d’expertise, un interlocuteur unique.',
  exp_cta: 'Parler de mon projet →',
  exp_decouvrir: 'Découvrir',
  methode_eyebrow: 'Notre méthode',
  methode_titre: 'De la première question<br />au déblocage des fonds.',
  methode_texte: 'Quatre étapes. Un interlocuteur qui connaît votre dossier, du début à la fin.',
  methode_nav: 'Les étapes de notre accompagnement',
  methode_etape: 'Étape',
  equipe_eyebrow: 'L’équipe',
  equipe_titre: 'Une équipe, pas une plateforme.',
  equipe_portrait: 'Portrait de',
  equipe_rdv: 'Prendre rendez-vous →',
  part_eyebrow: 'Nos partenaires',
  part_titre: 'Un écosystème de confiance, autour de votre projet.',
  part_decouvrir: 'Découvrir',
  faq_eyebrow: 'Questions fréquentes',
  faq_titre: 'Ce qu’on nous demande souvent.',
  faq_texte: 'Votre situation mérite un échange ? Faisons le point ensemble.',
  faq_cta: 'Poser ma question ↗',
  bandeau_eyebrow: 'Prendre rendez-vous',
  bandeau_titre: 'Parlons de votre projet.',
  bandeau_texte: '30 minutes pour faire le point, sans engagement. Vous repartez avec un avis clair sur votre financement, même si vous ne travaillez pas avec nous.',
  bandeau_cta1: 'Planifier un rendez-vous',
  bandeau_cta2: 'Estimer ma capacité',
};

const uiEn: typeof uiFr = {
  hero_eyebrow: 'Independent broker · Throughout France',
  hero_titre: ['Your financing, ', 'thought through ', 'as a whole.'],
  hero_texte: 'Real estate, business, wealth. We structure your file, defend it before more than thirty banks and stay by your side until the funds are released.',
  hero_cta1: 'Let’s discuss your project',
  hero_cta2: 'Estimate my capacity',
  hero_note: 'A first 30-minute conversation, with no commitment.',
  hero_assurance: 'Compare my borrower insurance ↗',
  hero_nouvel_onglet: ' (new tab)',
  hero_orias: 'ORIAS no. 24002546 · Supervised by the ACPR',
  hero_decouvrir: 'Discover our expertise',
  chiffres_aria: 'Our figures',
  mission_eyebrow: 'Our mission',
  mission_titre: 'We don’t chase a rate. We build a deal.',
  mission_alt: 'Reviewing a financing file — documents and a work screen.',
  sim_eyebrow: 'Calculator',
  sim_titre: 'How much can you borrow?',
  sim_texte: 'Income, expenses, down payment, term: an immediate order of magnitude, calculated with the rules banks actually apply. We start from this figure to build the deal.',
  exp_eyebrow: 'Our expertise',
  exp_titre: 'Four areas of expertise, a single point of contact.',
  exp_cta: 'Discuss my project →',
  exp_decouvrir: 'Discover',
  methode_eyebrow: 'Our method',
  methode_titre: 'From the first question<br />to the release of funds.',
  methode_texte: 'Four steps. One contact who knows your file, from start to finish.',
  methode_nav: 'The steps of our support',
  methode_etape: 'Step',
  equipe_eyebrow: 'The team',
  equipe_titre: 'A team, not a platform.',
  equipe_portrait: 'Portrait of',
  equipe_rdv: 'Book a meeting →',
  part_eyebrow: 'Our partners',
  part_titre: 'A trusted ecosystem around your project.',
  part_decouvrir: 'Discover',
  faq_eyebrow: 'Frequently asked',
  faq_titre: 'What we’re often asked.',
  faq_texte: 'Does your situation deserve a conversation? Let’s take stock together.',
  faq_cta: 'Ask my question ↗',
  bandeau_eyebrow: 'Book a meeting',
  bandeau_titre: 'Let’s discuss your project.',
  bandeau_texte: '30 minutes to take stock, with no commitment. You leave with a clear view of your financing, even if you don’t work with us.',
  bandeau_cta1: 'Schedule a meeting',
  bandeau_cta2: 'Estimate my capacity',
};

export function accueil(lang: Lang) {
  return lang === 'en'
    ? { ui: uiEn, chiffres: chiffresEn, mission: missionEn, expertises: expResumeEn, methode: methodeEn, equipe: equipeEn, faq: faqEn, partenaires: partenairesEn }
    : { ui: uiFr, chiffres: chiffresFr, mission: missionFr, expertises: expResumeFr, methode: methodeFr, equipe: equipeFr, faq: faqFr, partenaires: partenairesFr };
}
