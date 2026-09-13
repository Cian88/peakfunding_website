/* Contenus de l'accueil, repris mot pour mot de la v1 (_source/site-actuel/index.html). */

export const agendas = {
  valentin: 'https://calendar.proton.me/bookings#2v8n-uO99-wjViHyeCyHos1fTs0zF99J5TaGWewOXmQ=',
  maxime: 'https://calendar.proton.me/bookings#zq6TwUf8IStxgCKqi-oGLxU_L4xZHyGUPnm4UEUmOzk=',
};

export const chiffres = [
  { valeur: '500+', libelle: 'Projets financés' },
  { valeur: '95 %', libelle: 'Taux d’obtention' },
  { valeur: '30+', libelle: 'Partenaires bancaires' },
  { valeur: '72 h', libelle: 'Première réponse' },
];

export const mission = {
  intro: 'Un crédit mal monté se paie pendant vingt ans. Avant de négocier quoi que ce soit, nous prenons le temps de comprendre votre situation, votre fiscalité et ce que vous voulez faire ensuite.',
  cartes: [
    { titre: 'Approche globale', texte: 'Financement, fiscalité, patrimoine : tout se tient. Nous regardons l’ensemble avant de choisir un montage.' },
    { titre: 'Coordination d’experts', texte: 'Nous travaillons en coordination avec votre expert-comptable, votre notaire ou votre fiscaliste, et nous pilotons l’ensemble.' },
    { titre: 'Réseau bancaire étendu', texte: 'Plus de trente banques partenaires. Toutes n’ont pas les mêmes critères : nous savons laquelle solliciter, et comment.' },
    { titre: 'Vision long terme', texte: 'Votre premier financement ne doit pas bloquer le deuxième. Nous montons chaque dossier en pensant à la suite.' },
  ],
};

export const expertisesResume = [
  { slug: 'estate', icone: 'estate', nom: 'PEAK ESTATE', accroche: 'Immobilier locatif & patrimonial', texte: 'Résidence principale, locatif, SCI : nous cherchons le montage adapté à votre situation, pas l’inverse.' },
  { slug: 'pro', icone: 'pro', nom: 'PEAK PRO', accroche: 'Financement professionnel & LBO', texte: 'Vous créez, reprenez ou développez une entreprise ? Nous structurons le financement qui va avec.' },
  { slug: 'pim', icone: 'pim', nom: 'PEAK PIM', accroche: 'Professionnels de l’immobilier', texte: 'Marchands de biens, promoteurs, foncières : des lignes de financement pensées pour des opérations qui tournent vite.' },
  { slug: 'insure', icone: 'insure', nom: 'PEAK INSURE', accroche: 'Délégation d’assurance emprunteur', texte: 'L’assurance représente parfois un tiers du coût de votre crédit. Il y a presque toujours mieux à faire.' },
] as const;

export const methode = [
  { titre: 'Audit de votre situation', texte: 'Un point complet sur votre situation : revenus, patrimoine, fiscalité, projets. C’est souvent là que se situent les marges de manœuvre.' },
  { titre: 'Structuration du dossier', texte: 'En nom propre ou en société, quelle durée, quel apport, quel niveau d’endettement : nous définissons le montage avec vous.' },
  { titre: 'Négociation bancaire', texte: 'Nous présentons votre dossier aux banques les mieux placées pour votre profil, et nous négocions le taux, les garanties et les conditions.' },
  { titre: 'Suivi jusqu’au déblocage', texte: 'Nous restons mobilisés jusqu’au déblocage des fonds, et disponibles ensuite pour une renégociation ou l’opération suivante.' },
];

export const equipe = {
  intro: 'Vous parlez à la personne qui monte réellement votre dossier, du premier appel au déblocage des fonds. Pas de call center, pas de dossier qui change de main.',
  membres: [
    { nom: 'Valentin Boura–Defranoux', role: 'Dirigeant', domaine: 'Financement professionnel & PIM', photo: '/img/valentin-nb.jpg', agenda: agendas.valentin },
    { nom: 'Yves Monnier', role: 'Mandataire', domaine: 'Financement immobilier locatif', photo: '/img/yves-nb.jpg' },
    { nom: 'Maxime Pidoux', role: 'Mandataire', domaine: 'Financement immobilier locatif', photo: '/img/maxime-nb.jpg', agenda: agendas.maxime },
  ],
};
