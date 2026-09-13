/* Socle i18n : deux langues, le français à la racine et l'anglais sous /en/.
   Ce module centralise le type de langue, la localisation des liens internes,
   le calcul de l'URL équivalente dans l'autre langue et le dictionnaire des
   textes récurrents (header, footer, éléments partagés). */

export const langues = ['fr', 'en'] as const;
export type Lang = (typeof langues)[number];

/** Langue courante à partir de Astro.currentLocale (repli sur le français). */
export function langCourante(courant: string | undefined): Lang {
  return courant === 'en' ? 'en' : 'fr';
}

/** Localise un lien interne : en anglais, préfixe /en (les ancres, liens
    externes, mailto et tel restent inchangés). */
export function localiser(chemin: string, lang: Lang): string {
  if (lang === 'fr') return chemin;
  if (/^(https?:|mailto:|tel:|#)/.test(chemin)) return chemin;
  if (chemin === '/') return '/en/';
  if (chemin.startsWith('/#')) return '/en/' + chemin.slice(1);
  return '/en' + chemin;
}

/** URL équivalente dans l'autre langue, à partir du chemin courant. */
export function urlAutreLangue(pathname: string, lang: Lang): string {
  if (lang === 'fr') {
    return pathname === '/' ? '/en/' : '/en' + pathname;
  }
  const sans = pathname.replace(/^\/en(?=\/|$)/, '');
  return sans === '' ? '/' : sans;
}

export const drapeaux: Record<Lang, { code: string; libelle: string }> = {
  fr: { code: 'FR', libelle: 'Français' },
  en: { code: 'EN', libelle: 'English' },
};

/* ── Textes récurrents ─────────────────────────────────────────────── */

export const ui = {
  fr: {
    aller_contenu: 'Aller au contenu',
    nav: {
      expertises: 'Expertises',
      methode: 'Notre méthode',
      simulateur: 'Simulateur',
      cabinet: 'Le cabinet',
      analyses: 'Analyses',
    },
    espaces: {
      declencheur: 'Vos espaces',
      surtitre: 'Vos accès PEAK FUNDING',
      client: 'Espace client',
      client_desc: 'Votre dossier, vos documents.',
      mandataire: 'Espace mandataire',
      mandataire_desc: 'Votre activité, vos financements.',
      pied: 'Des espaces dédiés, connectés à Actelo.',
    },
    cta_entete: 'Parlons de votre projet',
    menu: 'Menu de navigation',
    prendre_rdv: 'Prendre rendez-vous',
    choisir_langue: 'Choisir la langue',
    footer: {
      accroche:
        'Cabinet de courtage en financement stratégique. Immobilier, professionnel, assurance emprunteur. France entière.',
      col_expertises: 'Expertises',
      col_cabinet: 'Cabinet',
      col_espaces: 'Espaces',
      col_reglementaire: 'Réglementaire',
      methode: 'Méthode',
      equipe: 'Équipe',
      partenaires: 'Partenaires',
      actualites: 'Actualités',
      client: 'Espace client',
      mandataire: 'Espace mandataire',
      prendre_rdv: 'Prendre rendez-vous',
      mentions: 'Mentions légales',
      confidentialite: 'Politique de confidentialité & RGPD',
      cgu: 'Conditions générales d’utilisation',
      orias:
        'PEAK FUNDING — ORIAS n° 24002546 — Sous supervision de l’ACPR, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09.',
      credit:
        'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.',
    },
    fil_accueil: 'Accueil',
    sommaire: 'Sommaire',
    legal_surtitre: 'Informations réglementaires',
    legal_langue:
      'Ces informations réglementaires sont fournies en français, seule version juridiquement opposable.',
    modale: {
      surtitre: 'Avant votre rendez-vous',
      titre: 'Parlez-nous de votre projet',
      description:
        '2 minutes pour préparer notre échange : vos coordonnées, votre projet, puis le choix de votre créneau.',
      fermer: 'Fermer',
    },
  },
  en: {
    aller_contenu: 'Skip to content',
    nav: {
      expertises: 'Expertise',
      methode: 'Our method',
      simulateur: 'Calculator',
      cabinet: 'The firm',
      analyses: 'Insights',
    },
    espaces: {
      declencheur: 'Your portals',
      surtitre: 'Your PEAK FUNDING access',
      client: 'Client portal',
      client_desc: 'Your file, your documents.',
      mandataire: 'Partner portal',
      mandataire_desc: 'Your business, your financing.',
      pied: 'Dedicated portals, connected to Actelo.',
    },
    cta_entete: 'Let’s discuss your project',
    menu: 'Navigation menu',
    prendre_rdv: 'Book a meeting',
    choisir_langue: 'Choose language',
    footer: {
      accroche:
        'Strategic financing brokerage. Real estate, business, borrower insurance. Throughout France.',
      col_expertises: 'Expertise',
      col_cabinet: 'Firm',
      col_espaces: 'Portals',
      col_reglementaire: 'Regulatory',
      methode: 'Method',
      equipe: 'Team',
      partenaires: 'Partners',
      actualites: 'Insights',
      client: 'Client portal',
      mandataire: 'Partner portal',
      prendre_rdv: 'Book a meeting',
      mentions: 'Legal notice',
      confidentialite: 'Privacy policy & GDPR',
      cgu: 'Terms of use',
      orias:
        'PEAK FUNDING — ORIAS no. 24002546 — Supervised by the ACPR, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09.',
      credit:
        'A loan commits you and must be repaid. Check your repayment capacity before committing.',
    },
    fil_accueil: 'Home',
    sommaire: 'Contents',
    legal_surtitre: 'Regulatory information',
    legal_langue:
      'These regulatory notices are provided in French, the only legally binding version.',
    modale: {
      surtitre: 'Before your meeting',
      titre: 'Tell us about your project',
      description:
        '2 minutes to prepare our conversation: your details, your project, then your preferred time slot.',
      fermer: 'Close',
    },
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
