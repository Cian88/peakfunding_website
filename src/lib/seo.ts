/** Données structurées (schema.org, JSON-LD) et faits de référence sur le cabinet.
    Une seule source pour ce que les moteurs classiques et les assistants IA lisent :
    identité, immatriculation, adresse, services, FAQ, articles. Tout ici reprend
    des faits déjà publiés sur le site (mentions légales, pages d'expertise). */
import type { Lang } from '../i18n';
import { localiser } from '../i18n';
import type { QR } from '../data/textes';
import type { Expertise } from '../data/expertises';
import { equipe } from '../data/site';

export const SITE = 'https://peakfunding.eu';
const ID_ORGANISATION = `${SITE}/#organisation`;
const ID_SITE = `${SITE}/#site`;

export const cabinet = {
  nom: 'PEAK FUNDING',
  email: 'contact@peakfunding.eu',
  orias: '24002546',
  siren: '987 461 787',
  ape: '6619B',
  adresse: { rue: '99 avenue Achille Peretti', codePostal: '92200', ville: 'Neuilly-sur-Seine', pays: 'FR' },
  fondateur: 'Valentin Boura-Defranoux',
  logo: `${SITE}/img/logo-peak-funding.png`,
  image: `${SITE}/img/hero-1600.webp`,
};

const descriptions: Record<Lang, string> = {
  fr: 'Cabinet de courtage indépendant en financement (IOBSP) et en assurance emprunteur, immatriculé à l’ORIAS sous le n° 24002546 et supervisé par l’ACPR. Crédit immobilier (résidence principale, investissement locatif, SCI, non-résidents), financement professionnel (reprise d’entreprise, LBO, trésorerie, crédit-bail), lignes pour marchands de biens et promoteurs, délégation d’assurance emprunteur (loi Lemoine). Plus de trente banques partenaires, intervention dans toute la France, premier échange gratuit et sans engagement.',
  en: 'Independent financing broker (IOBSP) and borrower-insurance intermediary registered with ORIAS under no. 24002546 and supervised by the ACPR. Mortgages (primary residence, buy-to-let, SCI, non-residents), business financing (buyouts, LBO, working capital, leasing), credit lines for property traders and developers, borrower-insurance delegation (Lemoine law). More than thirty partner banks, coverage across France, free first consultation with no obligation.',
};

const domaines: Record<Lang, string[]> = {
  fr: ['Courtage en crédit immobilier', 'Financement professionnel', 'Reprise d’entreprise et LBO', 'Crédit marchand de biens', 'Financement de promotion immobilière', 'Assurance emprunteur', 'Délégation d’assurance emprunteur', 'Loi Lemoine', 'Financement des non-résidents et expatriés', 'SCI et montage patrimonial'],
  en: ['Mortgage brokerage', 'Business financing', 'Business buyouts and LBO', 'Property-trader credit lines', 'Real-estate development financing', 'Borrower insurance', 'Borrower-insurance delegation', 'Lemoine law', 'Financing for non-residents and expatriates', 'SCI and wealth structuring'],
};

/** Services affichés dans le catalogue de l'organisation (une entrée par pôle). */
const catalogue: Record<Lang, { slug: Expertise['slug']; nom: string; description: string }[]> = {
  fr: [
    { slug: 'estate', nom: 'Courtage en crédit immobilier', description: 'Résidence principale, investissement locatif, SCI, démembrement, primo-accédants, non-résidents et expatriés : montage, négociation auprès de plus de trente banques et suivi jusqu’au déblocage des fonds.' },
    { slug: 'pro', nom: 'Financement professionnel et reprise d’entreprise', description: 'Création, reprise (LBO/OBO), trésorerie, crédit-bail immobilier et mobilier, structuration dette / fonds propres pour dirigeants, repreneurs et professions libérales.' },
    { slug: 'pim', nom: 'Financement des professionnels de l’immobilier', description: 'Lignes de crédit marchand de biens, financement de programmes de promotion, structuration holding / SPV, refinancement de stock pour marchands de biens, promoteurs et foncières.' },
    { slug: 'insure', nom: 'Délégation d’assurance emprunteur', description: 'Comparaison multi-assureurs à garanties équivalentes, changement d’assurance de prêt à tout moment (loi Lemoine), profils spécifiques, gestion des formalités de substitution auprès de la banque.' },
  ],
  en: [
    { slug: 'estate', nom: 'Mortgage brokerage', description: 'Primary residence, buy-to-let, SCI, dismemberment, first-time buyers, non-residents and expatriates: structuring, negotiation with more than thirty banks and support until the funds are released.' },
    { slug: 'pro', nom: 'Business financing and buyouts', description: 'Start-ups, buyouts (LBO/OBO), working capital, property and equipment leasing, debt / equity structuring for executives, acquirers and liberal professions.' },
    { slug: 'pim', nom: 'Financing for real-estate professionals', description: 'Property-trader credit lines, development-programme financing, holding / SPV structuring, stock refinancing for traders, developers and property companies.' },
    { slug: 'insure', nom: 'Borrower-insurance delegation', description: 'Multi-insurer comparison with equivalent cover, switching loan insurance at any time (Lemoine law), specific profiles, handling of the substitution formalities with the bank.' },
  ],
};

export const catalogueServices = (lang: Lang) => catalogue[lang];

/* Même forme que les canoniques et le plan du site : barre oblique finale. */
const url = (chemin: string, lang: Lang) => { const p = localiser(chemin, lang); return new URL(p.endsWith('/') ? p : `${p}/`, SITE).href; };
const langue = (lang: Lang) => (lang === 'fr' ? 'fr-FR' : 'en-GB');

/** Fiche du cabinet : présente sur toutes les pages, référencée par @id ailleurs. */
export function organisation(lang: Lang) {
  return {
    '@type': ['FinancialService', 'Organization'],
    '@id': ID_ORGANISATION,
    name: cabinet.nom,
    legalName: cabinet.nom,
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: cabinet.logo },
    image: cabinet.image,
    description: descriptions[lang],
    email: cabinet.email,
    address: { '@type': 'PostalAddress', streetAddress: cabinet.adresse.rue, postalCode: cabinet.adresse.codePostal, addressLocality: cabinet.adresse.ville, addressCountry: cabinet.adresse.pays },
    areaServed: { '@type': 'Country', name: 'France' },
    availableLanguage: ['fr', 'en'],
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'ORIAS', value: cabinet.orias },
      { '@type': 'PropertyValue', propertyID: 'SIREN', value: cabinet.siren.replace(/\s/g, '') },
      { '@type': 'PropertyValue', propertyID: 'APE', value: cabinet.ape },
    ],
    founder: { '@type': 'Person', name: cabinet.fondateur, jobTitle: lang === 'fr' ? 'Dirigeant' : 'Managing Partner' },
    employee: equipe.membres.map((m) => ({ '@type': 'Person', name: m.nom.replace('–', '-'), jobTitle: m.role === 'Dirigeant' ? (lang === 'fr' ? 'Dirigeant' : 'Managing Partner') : (lang === 'fr' ? 'Courtier mandataire' : 'Associate broker') })),
    knowsAbout: domaines[lang],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'fr' ? 'Expertises PEAK FUNDING' : 'PEAK FUNDING services',
      itemListElement: catalogue[lang].map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', '@id': `${url(`/expertises/${s.slug}`, lang)}#service`, name: s.nom, description: s.description, url: url(`/expertises/${s.slug}`, lang) } })),
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: cabinet.email, availableLanguage: ['fr', 'en'], areaServed: 'FR' },
  };
}

export function siteWeb(lang: Lang) {
  return { '@type': 'WebSite', '@id': ID_SITE, url: `${SITE}/`, name: cabinet.nom, inLanguage: langue(lang), publisher: { '@id': ID_ORGANISATION } };
}

export function pageWeb(opts: { url: string; titre: string; description: string; lang: Lang; type?: string; image?: string; publie?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': opts.url,
    url: opts.url,
    name: opts.titre,
    description: opts.description,
    inLanguage: langue(opts.lang),
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_ORGANISATION },
    ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: opts.image } } : {}),
    ...(opts.publie ? { datePublished: opts.publie } : {}),
  };
}

export function filAriane(items: { nom: string; url: string }[]) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nom, item: it.url })) };
}

export function faqPage(questions: QR[]) {
  return { '@type': 'FAQPage', mainEntity: questions.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.r } })) };
}

/** Fiche de service d'une page d'expertise, reliée au catalogue de l'organisation. */
export function service(e: Expertise, lang: Lang) {
  const fiche = catalogue[lang].find((s) => s.slug === e.slug)!;
  const page = url(`/expertises/${e.slug}`, lang);
  return {
    '@type': 'Service',
    '@id': `${page}#service`,
    name: fiche.nom,
    alternateName: e.nom,
    serviceType: fiche.nom,
    description: e.intro,
    url: page,
    provider: { '@id': ID_ORGANISATION },
    areaServed: { '@type': 'Country', name: 'France' },
    availableLanguage: ['fr', 'en'],
    ...(e.pourQui ? { audience: e.pourQui.cibles.map((c) => ({ '@type': 'Audience', audienceType: c.titre })) } : {}),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: fiche.nom, itemListElement: e.concretement.points.map((p) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.titre, description: p.texte } })) },
  };
}

export function article(opts: { url: string; titre: string; description: string; auteur: string; publie: string; image: string; largeur: number; hauteur: number; categorie: string; lang: Lang }) {
  const auteur = equipe.membres.find((m) => m.nom.replace('–', '-') === opts.auteur.replace('–', '-'));
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    mainEntityOfPage: opts.url,
    headline: opts.titre,
    description: opts.description,
    image: { '@type': 'ImageObject', url: opts.image, width: opts.largeur, height: opts.hauteur },
    datePublished: opts.publie,
    dateModified: opts.publie,
    inLanguage: langue(opts.lang),
    articleSection: opts.categorie,
    author: { '@type': 'Person', name: opts.auteur, ...(auteur ? { jobTitle: auteur.role === 'Dirigeant' ? (opts.lang === 'fr' ? 'Dirigeant' : 'Managing Partner') : (opts.lang === 'fr' ? 'Courtier mandataire' : 'Associate broker'), worksFor: { '@id': ID_ORGANISATION } } : {}) },
    publisher: { '@id': ID_ORGANISATION },
  };
}

export function listeArticles(opts: { url: string; nom: string; articles: { url: string; titre: string }[] }) {
  return { '@type': 'ItemList', '@id': `${opts.url}#liste`, name: opts.nom, itemListElement: opts.articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: a.url, name: a.titre })) };
}

/** Graphe unique par page ; `<` échappé pour qu'aucun texte ne referme la balise script. */
export function serialiser(graphe: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graphe }).replace(/</g, '\\u003c');
}
