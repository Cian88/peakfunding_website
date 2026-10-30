/** PEAK PITCH (préparation du dossier, 99 €) et PEAK EXCHANGE (échange courtier, 199 €).
    Source unique des textes de la page, de sa FAQ et de ses données structurées :
    les moteurs et assistants IA lisent exactement ce que lit le visiteur.
    Chaque affirmation décrit ce que fait réellement le module PEAK DOSSIER (~/dev/peak-dossier). */
import type { Lang } from '../i18n';
import type { QR } from './textes';

/** Adresse publique du service PEAK PITCH. L'offre n'est « ouverte » que lorsqu'elle est définie au build
    (PUBLIC_PEAK_PITCH_URL) : avant cela, la page reste en noindex et l'offre n'apparaît ni dans le catalogue
    du cabinet, ni dans llms.txt, ni dans les renvois des guides. */
export const SERVICE_URL = String(import.meta.env.PUBLIC_PEAK_PITCH_URL || import.meta.env.PUBLIC_PEAK_DOSSIER_URL || '').replace(/\/$/, '');
export const PEAK_PITCH_OUVERT = SERVICE_URL !== '';
/** Service local en développement (même port que `npm run dev` de ~/dev/peak-dossier). */
export const SERVICE_URL_LOCAL = 'http://127.0.0.1:8767';

export const PRIX_PITCH = 99;
export const PRIX_EXCHANGE = 199;

type Bloc = { titre: string; texte: string };
export type PeakPitch = {
  titre: string; description: string; eyebrow: string; h1: string; intro: string;
  promesse: { main: Bloc[]; cabinet: Bloc[]; titreMain: string; titreCabinet: string };
  livrables: Bloc[]; pourQui: Bloc[]; etapes: Bloc[]; limites: string[];
  offre: { eyebrow: string; titre: string; mentions: string[]; points: string[]; bouton: string; ouverture: string; secondaire: string };
  exchange: { eyebrow: string; titre: string; texte: string; points: string[]; prix: string };
  film: { eyebrow: string; titre: string; aria: string };
  faq: QR[];
  service: { nom: string; description: string; offre: string };
  serviceExchange: { nom: string; description: string };
  libelles: { promesse: string; livrables: string; pourQui: string; etapes: string; limites: string; faq: string; faqTitre: string; guides: string; accueil: string };
};

const fr: PeakPitch = {
  titre: 'PEAK PITCH | L’outil pour préparer son dossier de prêt immobilier comme un courtier',
  description: 'PEAK PITCH, l’outil innovant de PEAK FUNDING : préparez votre dossier de prêt immobilier avec l’expertise d’un cabinet de courtage et mettez toutes les chances de votre côté auprès des banques. 99 € (TVA non applicable), sans mandat.',
  eyebrow: 'PEAK PITCH / PRÉPARATION DU DOSSIER BANCAIRE',
  h1: 'Votre dossier.<br/>Présenté comme<br/>la banque l’attend.',
  intro: 'PEAK PITCH est un outil innovant conçu par PEAK FUNDING, cabinet de courtage, pour les porteurs d’un projet immobilier qui veulent mettre toutes les chances de leur côté auprès des banques. Vous gardez la main sur votre dossier ; l’outil y applique l’expertise métier du cabinet, la façon dont ses courtiers structurent et présentent un dossier à un comité de crédit, et vous remet trois documents prêts à présenter. Pour 99 €, une fraction du coût d’un accompagnement complet.',
  promesse: {
    titreMain: 'Vous gardez la main',
    main: [
      { titre: 'Aucun mandat', texte: 'Vous ne confiez pas votre dossier à un intermédiaire. Vous choisissez les banques que vous sollicitez, quand et comment.' },
      { titre: 'Aucun dépôt de pièces', texte: 'Vous ne téléversez aucun justificatif. Vous recevez la liste exacte de ce qu’il faut réunir, et vous gardez vos documents.' },
      { titre: 'Des livrables qui vous appartiennent', texte: 'Les trois documents se téléchargent en PDF. Vous les présentez vous-même à votre banque, à plusieurs banques, ou à un courtier de votre choix.' },
    ],
    titreCabinet: 'Le cabinet vous apporte la méthode',
    cabinet: [
      { titre: 'La structure d’un dossier de courtier', texte: 'Les livrables reprennent l’ordre de lecture d’un comité de crédit : la demande, les emprunteurs, le bien, les revenus, le plan de financement, l’analyse, la synthèse.' },
      { titre: 'Des chiffres cohérents et sourcés', texte: 'Le budget, l’apport et le prêt demandé sont rapprochés. Chaque chiffre est indiqué comme déclaré, calculé ou issu du simulateur, et rien n’est inventé : sans les informations nécessaires, une mensualité ou un TAEG n’est pas affiché.' },
      { titre: 'Une pièce par personne et par société', texte: 'Chaque emprunteur, co-emprunteur, caution ou société concernée reçoit sa propre liste selon son rôle, son statut professionnel et la situation de la société, existante ou à créer.' },
      { titre: 'Une expertise métier, à un coût accessible', texte: 'La méthode de travail des courtiers PEAK FUNDING, appliquée à votre projet pour 99 € : sans honoraires de succès, sans abonnement, sans rendez-vous à caler.' },
    ],
  },
  livrables: [
    { titre: 'Note de synthèse et annexe exhaustive', texte: 'Votre situation, votre projet et vos chiffres clés en quelques pages, les points d’attention identifiés, les informations encore manquantes, puis l’annexe de toutes les réponses déclarées.' },
    { titre: 'Liste des pièces par intervenant', texte: 'Les justificatifs à réunir pour chaque personne physique et chaque société, avec la raison de chaque demande : identité, revenus, avis d’imposition, comptes, épargne, statuts, bilans.' },
    { titre: 'Présentation corporate bancaire', texte: 'Une présentation en sept parties, construite à partir de la note de synthèse : demande, emprunteurs, actif, exploitation, financement, analyse financière, synthèse.' },
  ],
  pourQui: [
    { titre: 'Résidence principale', texte: 'Un premier achat ou une revente-achat, à un ou plusieurs emprunteurs.' },
    { titre: 'Investissement locatif', texte: 'Loyers attendus, charges, revenus fonciers existants et capacité d’emprunt.' },
    { titre: 'SCI et sociétés', texte: 'Une SCI ou une société existante ou à créer qui porte le projet, ses associés et leurs comptes.' },
    { titre: 'Dirigeants et indépendants', texte: 'Revenus de travailleur non salarié, bilans de la société d’activité, patrimoine professionnel.' },
  ],
  etapes: [
    { titre: 'Un questionnaire guidé en 8 étapes', texte: 'Projet, emprunteurs, revenus, patrimoine, sociétés, financement. Seules les questions utiles à votre situation s’affichent.' },
    { titre: 'Vos chiffres mis en perspective', texte: 'Le simulateur de capacité d’emprunt du site, le plan de financement et l’analyse des bilans de vos sociétés.' },
    { titre: 'Trois livrables en quelques minutes', texte: 'Les documents sont rédigés par un modèle d’intelligence artificielle à partir de vos seules réponses, puis contrôlés automatiquement : chaque montant cité doit correspondre à une valeur déclarée ou calculée.' },
    { titre: 'Une reprise à tout moment', texte: 'Un lien personnel permet de reprendre votre dossier ; il est conservé au moins six mois.' },
  ],
  limites: [
    'PEAK PITCH ne donne ni accord ni avis d’éligibilité : seule la banque décide de vous prêter.',
    'Ce n’est pas un conseil personnalisé. Pour l’avis d’un courtier sur votre projet, voyez PEAK EXCHANGE ci-dessous.',
    'Une seule génération des trois livrables est incluse par projet : vos réponses sont figées à son lancement.',
  ],
  offre: {
    eyebrow: '1 PROJET / 3 LIVRABLES',
    titre: 'Votre accès PEAK PITCH',
    mentions: ['Paiement unique. Sans abonnement.'],
    points: ['Questionnaire guidé en 8 étapes', 'Simulations et analyse des bilans', 'Trois livrables distincts en PDF', 'Aucun mandat, aucun dépôt de pièces', 'Reprise par lien personnel'],
    bouton: 'Passer au paiement sécurisé ↗',
    ouverture: 'Le paiement sera disponible à l’ouverture du service.',
    secondaire: 'Le récapitulatif et les conditions de vente sont présentés avant tout paiement.',
  },
  exchange: {
    eyebrow: 'PEAK EXCHANGE / EN OPTION',
    titre: 'Le regard d’un courtier, si vous le souhaitez.',
    texte: 'Une fois vos trois livrables remis, vous pouvez ajouter un échange avec un courtier spécialisé de PEAK FUNDING. Vous restez libre de la suite : l’échange ne vous engage à rien d’autre.',
    points: ['Un échange sur votre projet et le contexte bancaire actuel', 'Les arguments à mettre en avant selon votre profil', 'Une note de conseil personnalisée, remise sur support durable', 'Créneau choisi dans l’agenda du courtier après paiement'],
    prix: '199 € TTC en supplément, soit 298 € au total avec PEAK PITCH (99 €, TVA non applicable).',
  },
  film: { eyebrow: 'DU PROJET AUX LIVRABLES', titre: 'Découvrez le parcours en 22 secondes.', aria: 'Présentation sans son du parcours, avec textes à l’écran' },
  faq: [
    { q: 'Comment maximiser ses chances d’obtenir un prêt immobilier ?', r: 'Une banque se prononce plus facilement sur un dossier clair, cohérent et complet : une demande précise, un plan de financement équilibré, des revenus et des charges justifiés, les pièces de chaque emprunteur et de chaque société réunies. PEAK PITCH, l’outil de PEAK FUNDING, applique cette méthode de courtier à votre projet et vous remet les trois documents qui la mettent en forme, pour 99 €. Aucun outil ne garantit un accord : la décision reste celle de la banque.' },
    { q: 'Comment préparer moi-même mon dossier de prêt immobilier sans le confier à un courtier ?', r: 'PEAK PITCH vous guide en 8 étapes et produit les trois documents qu’attend une banque : une note de synthèse avec annexe, la liste des pièces à réunir pour chaque personne et chaque société, et une présentation bancaire. Vous ne signez aucun mandat et présentez vous-même votre dossier aux banques de votre choix. 99 € par projet, TVA non applicable.' },
    { q: 'Quelle différence avec un courtier ?', r: 'Un courtier monte et présente le dossier à votre place, avec un mandat et des honoraires en cas de succès. PEAK PITCH vous donne la méthode et les documents d’un dossier de courtier, mais c’est vous qui le présentez. Si vous souhaitez ensuite l’avis d’un professionnel, PEAK EXCHANGE ajoute un échange avec un courtier de PEAK FUNDING et une note de conseil personnalisée.' },
    { q: 'Que contiennent les trois livrables ?', r: 'Une note de synthèse (situation, projet, chiffres clés, points d’attention, informations manquantes) suivie d’une annexe de toutes vos réponses ; une liste de pièces distincte pour chaque emprunteur, caution et société ; une présentation bancaire en sept parties construite à partir de la note de synthèse.' },
    { q: 'Les chiffres de mon dossier peuvent-ils être inventés par l’intelligence artificielle ?', r: 'Non. Les documents sont rédigés à partir de vos seules réponses et contrôlés avant remise : un montant ou un pourcentage qui ne correspond à aucune valeur déclarée ou calculée est refusé. Une mensualité, un TAEG ou un différé ne sont jamais présentés sans les informations nécessaires à leur calcul.' },
    { q: 'Dois-je envoyer mes justificatifs ?', r: 'Non. PEAK PITCH ne collecte aucune pièce. Vous recevez la liste des documents à réunir, avec la raison de chaque demande, et vous les transmettez vous-même à la banque.' },
    { q: 'PEAK PITCH convient-il à un achat en SCI ou via une société ?', r: 'Oui. Le questionnaire distingue les personnes et les sociétés, existantes ou à créer, leurs associés, leurs comptes et leurs bilans. Chaque société reçoit sa propre liste de pièces et ses comptes sont analysés dans la présentation.' },
    { q: 'PEAK PITCH garantit-il l’obtention de mon prêt ?', r: 'Non. Aucun outil ni intermédiaire ne peut garantir un accord : la banque décide seule. PEAK PITCH vous aide à présenter un dossier clair, cohérent et documenté, ce qui facilite son analyse.' },
    { q: 'PEAK PITCH est-il moins cher qu’un courtier ?', r: 'PEAK PITCH coûte 99 € par projet, en paiement unique. Un accompagnement complet, où le courtier monte, présente et négocie le dossier à votre place, est rémunéré par des honoraires généralement bien plus élevés, dus en cas de succès. PEAK PITCH s’adresse à ceux qui veulent présenter eux-mêmes leur dossier avec l’expertise d’un courtier ; PEAK EXCHANGE ajoute l’avis personnalisé d’un courtier pour 199 € TTC.' },
    { q: 'Combien coûte PEAK PITCH et que comprend PEAK EXCHANGE ?', r: 'PEAK PITCH coûte 99 € pour un projet (TVA non applicable), en paiement unique : une génération des trois livrables. PEAK EXCHANGE est facultatif, à 199 € TTC en supplément : un échange avec un courtier spécialisé et une note de conseil personnalisée, soit 298 € au total pour les deux.' },
  ],
  service: {
    nom: 'PEAK PITCH — Préparation du dossier de financement bancaire',
    description: 'Outil en ligne innovant qui permet aux porteurs d’un projet immobilier de mettre toutes les chances de leur côté pour obtenir leur financement, en appliquant l’expertise métier d’un cabinet de courtage à un coût accessible. Le client prépare lui-même son dossier, à titre personnel, en SCI ou via une société, et le présente selon la méthode d’un courtier : questionnaire guidé en 8 étapes, simulations, note de synthèse et annexe, liste de pièces par intervenant et présentation corporate bancaire. Sans mandat, sans dépôt de pièces ; le client présente lui-même son dossier.',
    offre: 'Un projet, une génération des trois livrables',
  },
  serviceExchange: {
    nom: 'PEAK EXCHANGE — Échange courtier et note de conseil',
    description: 'Option de PEAK PITCH : échange avec un courtier spécialisé de PEAK FUNDING sur le projet et le contexte bancaire actuel, arguments liés au profil et note de conseil personnalisée sur support durable.',
  },
  libelles: { promesse: 'GARDER LA MAIN, PRÉSENTER AU MIEUX', livrables: 'LES TROIS LIVRABLES', pourQui: 'POUR QUELS PROJETS', etapes: 'COMMENT ÇA MARCHE', limites: 'Ce que PEAK PITCH ne fait pas', faq: 'Questions fréquentes', faqTitre: 'En bref.', guides: 'Pour aller plus loin', accueil: 'Accueil' },
};

const en: PeakPitch = {
  titre: 'PEAK PITCH | The tool to prepare your French mortgage application like a broker',
  description: 'PEAK PITCH, PEAK FUNDING’s innovative tool: prepare your French mortgage application with a brokerage firm’s expertise and give yourself the best chance with banks. €99 (VAT not applicable), no broker mandate.',
  eyebrow: 'PEAK PITCH / BANK APPLICATION PREPARATION',
  h1: 'Your application.<br/>Presented the way<br/>banks expect it.',
  intro: 'PEAK PITCH is an innovative tool designed by PEAK FUNDING, a brokerage firm, for people with a property project who want to give themselves the best chance with banks. You stay in control of your application; the tool applies the firm’s professional expertise, the way its brokers structure and present a file to a credit committee, and gives you three documents ready to present. For €99, a fraction of the cost of full brokerage support. The service and its deliverables are currently in French.',
  promesse: {
    titreMain: 'You stay in control',
    main: [
      { titre: 'No mandate', texte: 'You do not hand your application to an intermediary. You choose which banks to approach, when and how.' },
      { titre: 'No document upload', texte: 'You upload nothing. You receive the exact list of what to gather, and your documents stay with you.' },
      { titre: 'Deliverables you own', texte: 'The three documents download as PDFs. You present them yourself to one or several banks, or to a broker of your choice.' },
    ],
    titreCabinet: 'The firm brings the method',
    cabinet: [
      { titre: 'A broker’s file structure', texte: 'The deliverables follow a credit committee’s reading order: the request, the borrowers, the property, income, the financing plan, the analysis, the summary.' },
      { titre: 'Consistent, sourced figures', texte: 'Budget, down payment and requested loan are reconciled. Every figure is labelled as declared, calculated or taken from the simulator, and nothing is invented: without the required data, no monthly payment or APR is shown.' },
      { titre: 'A checklist per person and company', texte: 'Each borrower, co-borrower, guarantor or company involved gets its own list according to its role, employment status and whether the company exists or is yet to be created.' },
      { titre: 'Professional expertise, at an accessible price', texte: 'The working method of PEAK FUNDING’s brokers, applied to your project for €99: no success fee, no subscription, no appointment to schedule.' },
    ],
  },
  livrables: [
    { titre: 'Summary note and full appendix', texte: 'Your situation, project and key figures in a few pages, the points of attention, the information still missing, then an appendix of every answer you declared.' },
    { titre: 'Document checklist per party', texte: 'The supporting documents to gather for each individual and each company, with the reason for each request: identity, income, tax notices, accounts, savings, articles, financial statements.' },
    { titre: 'Corporate bank presentation', texte: 'A seven-part presentation built from the summary note: request, borrowers, asset, operations, financing, financial analysis, summary.' },
  ],
  pourQui: [
    { titre: 'Primary residence', texte: 'A first purchase or a sell-and-buy, with one or several borrowers.' },
    { titre: 'Buy-to-let', texte: 'Expected rent, charges, existing rental income and borrowing capacity.' },
    { titre: 'SCI and companies', texte: 'An SCI or an existing or new company carrying the project, its partners and their accounts.' },
    { titre: 'Executives and self-employed', texte: 'Self-employed income, the operating company’s financial statements, business assets.' },
  ],
  etapes: [
    { titre: 'A guided 8-step questionnaire', texte: 'Project, borrowers, income, assets, companies, financing. Only the questions relevant to your situation are shown.' },
    { titre: 'Your figures in perspective', texte: 'The site’s borrowing-capacity simulator, the financing plan and an analysis of your companies’ accounts.' },
    { titre: 'Three deliverables within minutes', texte: 'The documents are drafted by an artificial-intelligence model from your answers only, then checked automatically: every amount quoted must match a declared or calculated value.' },
    { titre: 'Resume at any time', texte: 'A personal link lets you return to your application; it is kept for at least six months.' },
  ],
  limites: [
    'PEAK PITCH gives no approval or eligibility opinion: only the bank decides to lend.',
    'It is not personalised advice. For a broker’s view on your project, see PEAK EXCHANGE below.',
    'One generation of the three deliverables is included per project: your answers are frozen when it starts.',
  ],
  offre: {
    eyebrow: '1 PROJECT / 3 DELIVERABLES',
    titre: 'Your PEAK PITCH access',
    mentions: ['One-off payment. No subscription.', 'Service and deliverables in French.'],
    points: ['Guided 8-step questionnaire', 'Simulations and accounts analysis', 'Three separate PDF deliverables', 'No mandate, no document upload', 'Resume with a personal link'],
    bouton: 'Go to secure payment (French) ↗',
    ouverture: 'Payment will be available when the service opens.',
    secondaire: 'The summary and terms of sale are shown before any payment.',
  },
  exchange: {
    eyebrow: 'PEAK EXCHANGE / OPTIONAL',
    titre: 'A broker’s view, if you want one.',
    texte: 'Once your three deliverables are issued, you can add a session with a specialised PEAK FUNDING broker. What happens next remains your choice: the session commits you to nothing else.',
    points: ['A discussion of your project and the current banking context', 'The arguments to put forward for your profile', 'A personalised advice note on a durable medium', 'Slot chosen in the broker’s calendar after payment'],
    prix: '€199 incl. tax on top, i.e. €298 in total with PEAK PITCH (€99, VAT not applicable).',
  },
  film: { eyebrow: 'FROM PROJECT TO DELIVERABLES', titre: 'See the journey in 22 seconds (French).', aria: 'Silent presentation of the journey, with on-screen text in French' },
  faq: [
    { q: 'How can I maximise my chances of getting a mortgage in France?', r: 'A bank rules more easily on a clear, consistent and complete application: a precise request, a balanced financing plan, documented income and outgoings, and the documents of every borrower and company gathered. PEAK PITCH, PEAK FUNDING’s tool, applies this broker method to your project and gives you the three documents that put it into shape, for €99. No tool guarantees approval: the decision remains the bank’s.' },
    { q: 'How can I prepare my French mortgage application myself, without a broker?', r: 'PEAK PITCH guides you through 8 steps and produces the three documents a bank expects: a summary note with appendix, the documents to gather for each person and company, and a bank presentation. You sign no mandate and present the application yourself to the banks you choose. €99 per project, VAT not applicable; service in French.' },
    { q: 'How is it different from a broker?', r: 'A broker builds and presents the application for you, under a mandate and with a success fee. PEAK PITCH gives you a broker’s method and documents, but you present the file. If you then want a professional’s view, PEAK EXCHANGE adds a session with a PEAK FUNDING broker and a personalised advice note.' },
    { q: 'What do the three deliverables contain?', r: 'A summary note (situation, project, key figures, points of attention, missing information) followed by an appendix of all your answers; a separate document checklist for each borrower, guarantor and company; a seven-part bank presentation built from the summary note.' },
    { q: 'Can the artificial intelligence invent figures in my application?', r: 'No. The documents are drafted from your answers only and checked before delivery: an amount or percentage that matches no declared or calculated value is rejected. A monthly payment, APR or deferral is never shown without the data needed to calculate it.' },
    { q: 'Do I have to send my supporting documents?', r: 'No. PEAK PITCH collects no documents. You receive the list of what to gather, with the reason for each request, and send them to the bank yourself.' },
    { q: 'Does PEAK PITCH work for a purchase through an SCI or a company?', r: 'Yes. The questionnaire distinguishes individuals and companies, existing or yet to be created, their partners, accounts and financial statements. Each company gets its own checklist and its accounts are analysed in the presentation.' },
    { q: 'Does PEAK PITCH guarantee my loan?', r: 'No. No tool or intermediary can guarantee approval: the bank alone decides. PEAK PITCH helps you present a clear, consistent and documented application, which makes it easier to assess.' },
    { q: 'Is PEAK PITCH cheaper than a broker?', r: 'PEAK PITCH costs €99 per project, as a one-off payment. Full brokerage support, where the broker builds, presents and negotiates the application for you, is paid through fees that are generally much higher and due on success. PEAK PITCH is for people who want to present their own application with a broker’s expertise; PEAK EXCHANGE adds a broker’s personalised advice for €199 incl. tax.' },
    { q: 'How much does PEAK PITCH cost, and what is PEAK EXCHANGE?', r: 'PEAK PITCH costs €99 per project (VAT not applicable), as a one-off payment: one generation of the three deliverables. PEAK EXCHANGE is optional, €199 incl. tax on top: a session with a specialised broker and a personalised advice note, €298 in total for both.' },
  ],
  service: {
    nom: 'PEAK PITCH — Bank financing application preparation',
    description: 'Innovative online tool that helps people with a property project give themselves the best chance of obtaining their financing, by applying a brokerage firm’s professional expertise at an accessible price. The client prepares their own French mortgage application, personally, through an SCI or a company, and presents it with a broker’s method: guided 8-step questionnaire, simulations, summary note and appendix, document checklist per party and corporate bank presentation. No mandate, no document upload; the client presents the application. Service in French.',
    offre: 'One project, one generation of the three deliverables',
  },
  serviceExchange: {
    nom: 'PEAK EXCHANGE — Broker session and advice note',
    description: 'PEAK PITCH option: a session with a specialised PEAK FUNDING broker on the project and the current banking context, profile-specific arguments and a personalised advice note on a durable medium.',
  },
  libelles: { promesse: 'STAY IN CONTROL, PRESENT AT YOUR BEST', livrables: 'THE THREE DELIVERABLES', pourQui: 'WHICH PROJECTS', etapes: 'HOW IT WORKS', limites: 'What PEAK PITCH does not do', faq: 'Frequently asked questions', faqTitre: 'In short.', guides: 'Further reading', accueil: 'Home' },
};

export const peakPitch = (lang: Lang) => (lang === 'fr' ? fr : en);

/** Guides qui renvoient vers PEAK PITCH (même slug en FR et en EN). */
export const guidesPeakPitch = ['preparer-dossier-pret-immobilier', 'pieces-dossier-pret-immobilier'] as const;
