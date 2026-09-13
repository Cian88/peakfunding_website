/* Pages expertise, reprises mot pour mot de la v1 (_source/site-actuel/expertise-*.html).
   Les questions fréquentes propres à chaque pôle sont dans textes.ts. */

export type Expertise = {
  slug: 'estate' | 'pro' | 'pim' | 'insure';
  nom: string;
  titre: string;
  intro: string;
  ctaPrincipal: string;
  ctaSecondaire: { libelle: string; href: string };
  pourQui: { titre: string; cibles: { titre: string; texte: string }[] } | null;
  reperes: { valeur: string; texte: string }[] | null;
  concretement: { intro: string; points: { titre: string; texte: string }[] };
  comment: { titre: string; etapes: { titre: string; texte: string }[] };
  final: { titre: string; texte: string; bouton: string };
};

export const expertises: Expertise[] = [
  {
    slug: 'estate',
    nom: 'PEAK ESTATE',
    titre: 'Financer votre immobilier, du premier achat au patrimoine.',
    intro: 'Résidence principale, investissement locatif, SCI, démembrement : nous montons le financement adapté à votre situation et à vos objectifs — et non un crédit standardisé.',
    ctaPrincipal: 'Réserver un échange de 30 minutes',
    ctaSecondaire: { libelle: 'Estimer ma capacité', href: '/#simulateur' },
    pourQui: {
      titre: 'Quel que soit votre profil d’emprunteur.',
      cibles: [
        { titre: 'Primo-accédants', texte: 'Premier achat, apport limité, CDI récent : nous défendons votre dossier auprès des établissements capables de regarder au-delà des seuls critères automatiques.' },
        { titre: 'Investisseurs locatifs', texte: 'Premier bien ou dixième lot : nous choisissons la banque et le montage qui préservent votre capacité pour la suite.' },
        { titre: 'Non-résidents & expatriés', texte: 'Vous résidez à l’étranger et les banques françaises écartent votre dossier ? C’est une situation que nous traitons régulièrement.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'Chaque point ci-contre peut faire gagner plusieurs milliers d’euros sur la durée du crédit — ou débloquer un projet que votre banque refusait.',
      points: [
        { titre: 'Négociation du taux et des conditions', texte: 'Taux, frais de dossier, indemnités de remboursement anticipé, modularité des échéances : tout se négocie, pas seulement le taux affiché.' },
        { titre: 'Montage juridique adapté', texte: 'Nom propre, SCI à l’IR ou à l’IS, indivision, démembrement : le bon véhicule change la fiscalité et la capacité d’emprunt.' },
        { titre: 'Optimisation de la capacité d’emprunt', texte: 'Traitement des loyers, différé de remboursement, durée, lissage de prêts : autant de leviers pour faire passer un dossier serré.' },
        { titre: 'Stratégie multi-opérations', texte: 'Si vous comptez enchaîner les achats, on monte le premier crédit pour ne pas bloquer les suivants.' },
      ],
    },
    comment: {
      titre: 'De votre appel au déblocage des fonds.',
      etapes: [
        { titre: 'Audit de votre situation', texte: 'Un premier échange pour comprendre votre situation et votre projet. Gratuit, sans engagement.' },
        { titre: 'Structuration du dossier', texte: 'Choix du montage, calibrage de l’endettement, préparation d’un dossier solide pour les banques.' },
        { titre: 'Négociation bancaire', texte: 'Présentation aux banques les mieux placées et négociation des conditions, taux et assurance compris.' },
        { titre: 'Suivi jusqu’au déblocage', texte: 'Accompagnement jusqu’à la signature chez le notaire et au déblocage des fonds, puis disponibilité pour les opérations suivantes.' },
      ],
    },
    final: { titre: 'Un projet immobilier en tête ?', texte: '30 minutes pour en parler et savoir où vous en êtes, sans engagement.', bouton: 'Réserver un échange de 30 minutes' },
  },
  {
    slug: 'pro',
    nom: 'PEAK PRO',
    titre: 'Financer l’entreprise, sa reprise et son développement.',
    intro: 'Création, reprise (LBO), trésorerie, crédit-bail : nous structurons le financement professionnel qui tient la route sur la durée — dette, fonds propres et fiscalité pensés ensemble.',
    ctaPrincipal: 'Réserver un échange de 30 minutes',
    ctaSecondaire: { libelle: 'Voir les autres pôles', href: '/#expertises' },
    pourQui: {
      titre: 'Dirigeants, repreneurs et entreprises en croissance.',
      cibles: [
        { titre: 'Repreneurs & investisseurs', texte: 'Rachat de fonds de commerce, de titres ou de parts sociales : nous montons la dette d’acquisition et la structure holding qui va avec.' },
        { titre: 'Dirigeants de PME', texte: 'Besoin de trésorerie, financement d’équipement, locaux professionnels : nous cherchons la solution la moins coûteuse pour votre bilan.' },
        { titre: 'Professions libérales', texte: 'Installation, rachat de patientèle ou de clientèle, murs professionnels : des montages adaptés aux revenus et aux structures d’exercice.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'Un financement professionnel mal structuré pèse sur la trésorerie pendant des années. Nous arbitrons dette et fonds propres avant de solliciter les banques.',
      points: [
        { titre: 'Reprise d’entreprise (LBO)', texte: 'Structuration de la holding de reprise, calibrage de la dette senior, effet de levier et capacité de remboursement par les dividendes de la cible.' },
        { titre: 'Prêt professionnel & trésorerie', texte: 'Financement du besoin en fonds de roulement, prêts d’équipement, lignes de trésorerie et prêts garantis, négociés au bon niveau de taux et de garanties.' },
        { titre: 'Crédit-bail immobilier & mobilier', texte: 'Acquisition de murs, de matériel ou de véhicules en préservant votre trésorerie et en optimisant le traitement comptable et fiscal.' },
        { titre: 'Structuration dette / fonds propres', texte: 'Arbitrage entre dette bancaire, dette privée et apport en capital, en coordination avec votre expert-comptable et vos partenaires financiers.' },
      ],
    },
    comment: {
      titre: 'Du premier échange au décaissement.',
      etapes: [
        { titre: 'Analyse du projet', texte: 'Compréhension de l’opération, des comptes et des objectifs. Premier échange gratuit et sans engagement.' },
        { titre: 'Structuration financière', texte: 'Montage juridique et financier, plan de financement et prévisionnel présentables aux établissements.' },
        { titre: 'Négociation bancaire', texte: 'Mise en concurrence des banques d’entreprise et des partenaires, négociation du taux, des garanties et des covenants.' },
        { titre: 'Closing & suivi', texte: 'Accompagnement jusqu’au décaissement, puis disponibilité pour les opérations et besoins de financement suivants.' },
      ],
    },
    final: { titre: 'Une opération à financer ?', texte: '30 minutes pour en parler et cadrer la faisabilité, sans engagement.', bouton: 'Réserver un échange de 30 minutes' },
  },
  {
    slug: 'pim',
    nom: 'PEAK PIM',
    titre: 'Des lignes de financement pour des opérations qui tournent vite.',
    intro: 'Marchands de biens, promoteurs, foncières : nous mettons en place les crédits marchand de biens, le financement de programmes et les structures holding / SPV adaptés à vos cycles d’opération.',
    ctaPrincipal: 'Réserver un échange de 30 minutes',
    ctaSecondaire: { libelle: 'Voir les autres pôles', href: '/#expertises' },
    pourQui: {
      titre: 'Des acteurs qui financent des opérations, pas une résidence.',
      cibles: [
        { titre: 'Marchands de biens', texte: 'Achat-revente, division, rénovation lourde : des financements courts, calibrés sur la marge et le rythme de revente de vos lots.' },
        { titre: 'Promoteurs', texte: 'Financement de programmes en VEFA, crédit d’accompagnement, GFA : nous structurons la dette autour de votre plan de commercialisation.' },
        { titre: 'Foncières & investisseurs', texte: 'Constitution ou refinancement de portefeuille, montages holding / SPV, effet de levier optimisé sur des actifs de rendement.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'Sur ces opérations, la vitesse d’exécution et la structuration comptent autant que le taux. Nous ciblons les partenaires qui savent financer votre métier.',
      points: [
        { titre: 'Lignes de crédit marchand de biens', texte: 'Financement d’acquisition et de travaux sur des opérations d’achat-revente, avec des durées et un différé adaptés au cycle de commercialisation.' },
        { titre: 'Financement de programmes', texte: 'Crédit d’accompagnement de promotion, financement en VEFA, garantie financière d’achèvement : structuration autour du plan de vente.' },
        { titre: 'Structuration holding / SPV', texte: 'Mise en place de sociétés de projet dédiées, cloisonnement des risques et optimisation du levier opération par opération.' },
        { titre: 'Optimisation des cycles de trésorerie', texte: 'Enchaînement des opérations sans rupture de trésorerie, refinancement de stock et lignes revolving pour maintenir votre capacité d’action.' },
      ],
    },
    comment: {
      titre: 'Une organisation calée sur vos opérations.',
      etapes: [
        { titre: 'Analyse de l’opération', texte: 'Étude du bilan promoteur, du prévisionnel de marge et du plan de commercialisation.' },
        { titre: 'Montage & structure', texte: 'Choix du véhicule (SPV, holding), calibrage de la dette et des garanties adaptés à l’opération.' },
        { titre: 'Mise en concurrence', texte: 'Sollicitation des banques et partenaires spécialisés dans le financement d’opérations immobilières.' },
        { titre: 'Suivi & renouvellement', texte: 'Accompagnement jusqu’au déblocage, puis reconduction des lignes pour les opérations suivantes.' },
      ],
    },
    final: { titre: 'Une opération à structurer ?', texte: '30 minutes pour cadrer le financement de votre prochaine opération.', bouton: 'Réserver un échange de 30 minutes' },
  },
  {
    slug: 'insure',
    nom: 'PEAK INSURE',
    titre: 'L’assurance emprunteur, c’est là que se cachent vos économies.',
    intro: 'L’assurance représente parfois près d’un tiers du coût de votre crédit. Grâce à la loi Lemoine et à la délégation d’assurance, il y a presque toujours mieux à faire — sans changer votre prêt.',
    ctaPrincipal: 'Faire étudier mon assurance',
    ctaSecondaire: { libelle: 'Comprendre la loi Lemoine', href: '/actualites/lemoine' },
    pourQui: null,
    reperes: [
      { valeur: 'Jusqu’à ⅓', texte: 'du coût total du crédit peut provenir de la seule assurance emprunteur.' },
      { valeur: 'À tout moment', texte: 'la loi Lemoine permet de résilier et changer d’assurance quand vous le souhaitez, sans frais.' },
      { valeur: 'Plusieurs milliers €', texte: 'd’économies fréquentes sur la durée du prêt, à garanties équivalentes ou supérieures.' },
    ],
    concretement: {
      intro: 'Nous vérifions l’équivalence des garanties exigée par votre banque, puis nous mettons en concurrence les assureurs pour réduire le coût sans dégrader votre couverture.',
      points: [
        { titre: 'Comparaison multi-assureurs', texte: 'Mise en concurrence de plusieurs assureurs délégués à garanties au moins équivalentes à celles exigées par votre banque.' },
        { titre: 'Délégation loi Lemoine', texte: 'Changement d’assurance à tout moment, sans frais ni pénalité, et sans questionnaire de santé sous conditions de montant et d’âge.' },
        { titre: 'Profils spécifiques', texte: 'Risques aggravés de santé, professions ou sports à risque, emprunteurs seniors : nous cherchons la couverture qui accepte votre profil au juste prix.' },
        { titre: 'Réduction du coût global', texte: 'Analyse du taux annuel effectif d’assurance (TAEA) et du coût total, pour mesurer l’économie réelle sur toute la durée du crédit.' },
      ],
    },
    comment: {
      titre: 'Un changement d’assurance simple et sans risque.',
      etapes: [
        { titre: 'Analyse de votre contrat', texte: 'Nous étudions votre assurance actuelle, ses garanties et son coût réel sur la durée restante.' },
        { titre: 'Recherche d’alternatives', texte: 'Nous comparons les offres déléguées à garanties équivalentes et chiffrons l’économie potentielle.' },
        { titre: 'Formalités de substitution', texte: 'Nous préparons le dossier et gérons la demande de substitution auprès de votre banque.' },
        { titre: 'Mise en place', texte: 'Le nouveau contrat prend le relais sans interruption de couverture ni modification de votre prêt.' },
      ],
    },
    final: { titre: 'Combien pourriez-vous économiser ?', texte: 'Envoyez-nous votre contrat actuel : nous chiffrons l’économie possible, sans engagement.', bouton: 'Comparez votre assurance de prêt' },
  },
];
