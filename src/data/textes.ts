/* Questions fréquentes et partenaires, repris mot pour mot de la v1. */

export type QR = { q: string; r: string };

export const faqAccueil: QR[] = [
  { q: 'Combien coûte votre intervention ?', r: 'Le premier échange et l’étude de solvabilité ne vous coûtent rien. Nos honoraires sont annoncés dès le départ et ne sont dus que si le financement aboutit, au déblocage des fonds.' },
  { q: 'Mon dossier a déjà été refusé par ma banque, est-ce rédhibitoire ?', r: 'Non, et le cas est fréquent. Les critères varient sensiblement d’une banque à l’autre : un dossier refusé par l’une peut être accepté par une autre, en particulier après avoir été retravaillé. Nous reprenons le montage et ciblons les établissements adaptés à votre profil.' },
  { q: 'Quels délais pour obtenir un accord ?', r: 'Vous obtenez une première réponse sous 72 heures. Comptez ensuite en moyenne 6 à 8 semaines entre le dépôt du dossier et l’accord, davantage lorsque le montage est complexe.' },
  { q: 'Travaillez-vous partout en France ?', r: 'Oui, partout en France, y compris pour les expatriés et les non-résidents. L’ensemble des échanges peut se dérouler à distance, en visioconférence ou par téléphone, avec le même interlocuteur du début à la fin.' },
  { q: 'Puis-je emprunter pour du locatif si j’ai déjà un crédit en cours ?', r: 'Souvent, oui. Toutes les banques ne traitent pas les loyers de la même manière dans le calcul de votre taux d’endettement. En retenant le bon établissement et le montage adapté (SCI, différé, durée), il est fréquent de débloquer une capacité que votre banque actuelle vous refuse.' },
];

export const faqExpertises: Record<'estate' | 'pro' | 'pim' | 'insure', QR[]> = {
  estate: [
    { q: 'Faut-il forcément un apport pour investir dans le locatif ?', r: 'Pas systématiquement. Sur un projet locatif, la plupart des banques attendent aujourd’hui un apport couvrant au minimum les frais de notaire et de garantie. Certaines acceptent toutefois de financer ces frais, voire une partie des travaux, lorsque la rentabilité et le reste du dossier le justifient. Le financement intégral « clé en main » reste, lui, principalement réservé à l’achat d’une résidence principale.' },
    { q: 'SCI ou nom propre : que choisir ?', r: 'Cela dépend de votre fiscalité, de vos objectifs et de la composition de l’acquisition. Nous en discutons dès le premier rendez-vous et, si nécessaire, associons votre notaire ou votre expert-comptable avant toute décision.' },
    { q: 'Je suis non-résident, pouvez-vous m’aider ?', r: 'Oui, c’est une partie importante de notre activité. Toutes les banques n’acceptent pas les non-résidents, mais nous savons lesquelles solliciter et comment présenter le dossier. L’ensemble se gère à distance.' },
  ],
  pro: [
    { q: 'Financez-vous les reprises sans apport personnel important ?', r: 'Sur une reprise, les banques attendent généralement un apport de l’ordre de 20 à 30 % du prix, mais ce niveau se négocie selon la solidité de la cible et sa capacité à rembourser la dette. Un montage en holding, un crédit-vendeur ou l’intervention de partenaires en fonds propres peuvent réduire l’apport nécessaire.' },
    { q: 'Travaillez-vous avec mon expert-comptable ?', r: 'Oui, systématiquement lorsque c’est utile. Nous coordonnons notre travail avec votre expert-comptable et, le cas échéant, votre avocat, pour que le montage financier, juridique et fiscal soit cohérent.' },
    { q: 'Quel est le délai pour un financement professionnel ?', r: 'Comptez en moyenne 6 à 10 semaines entre le dépôt d’un dossier complet et l’accord, selon la complexité de l’opération et le nombre d’établissements sollicités. Une première lecture de faisabilité vous est donnée sous quelques jours.' },
  ],
  pim: [
    { q: 'Financez-vous une première opération de marchand de biens ?', r: 'Oui, c’est possible, même si les banques sont plus exigeantes sur un premier dossier. La qualité de l’opération, la marge prévisionnelle, votre apport et éventuellement une caution ou un co-investisseur font la différence. Nous vous orientons vers les partenaires les plus ouverts aux nouveaux opérateurs.' },
    { q: 'Quelle part de fonds propres est attendue sur une opération ?', r: 'En marchand de biens comme en promotion, comptez généralement 15 à 25 % de fonds propres sur le coût de revient de l’opération, variable selon le risque, la localisation et votre historique. Certains montages permettent d’optimiser ce niveau.' },
    { q: 'Intervenez-vous sur des lignes récurrentes ou seulement au coup par coup ?', r: 'Les deux. Nous montons aussi bien un financement ponctuel qu’une relation durable avec des lignes reconductibles, pour que vous puissiez enchaîner les opérations sans repartir de zéro à chaque fois.' },
  ],
  insure: [
    { q: 'Puis-je vraiment changer d’assurance à tout moment ?', r: 'Oui. Depuis la loi Lemoine, vous pouvez résilier et remplacer l’assurance de votre prêt immobilier à n’importe quel moment, sans frais ni pénalité, à condition de présenter une couverture au moins équivalente. La banque ne peut pas s’y opposer si l’équivalence des garanties est respectée.' },
    { q: 'Vais-je perdre en niveau de garanties ?', r: 'Non, c’est justement notre point de vigilance. Nous ne proposons que des contrats dont les garanties sont au moins équivalentes à celles exigées par votre banque. Souvent, l’économie s’accompagne même de garanties supérieures.' },
    { q: 'Est-ce intéressant même si mon prêt est déjà en cours ?', r: 'Souvent, oui. Plus il vous reste de capital et d’années à rembourser, plus l’économie est importante. Même à mi-parcours, un changement d’assurance peut représenter plusieurs milliers d’euros. Nous chiffrons le gain avant toute démarche.' },
  ],
};

export const partenaires = [
  { nom: 'PRIVEOS', url: 'https://priveos.io/', logo: '/img/logo-priveos.png', texte: 'Cabinet d’ingénierie patrimoniale indépendant à Paris. PRIVEOS accompagne dirigeants, investisseurs et particuliers exigeants avec une étude patrimoniale complète : fiscalité, transmission, protection et stratégie d’investissement.' },
  { nom: 'EDILOS', url: 'https://edilos.fr/', logo: '/img/logo-edilos.png', texte: 'Spécialiste de l’investissement locatif clé en main dans l’ancien rénové. Contractant général avec obligation de résultat, EDILOS pilote chaque étape : sourcing du bien, rénovation, optimisation fiscale et mise en location.' },
];
