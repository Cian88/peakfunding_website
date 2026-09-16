/* English expertise pages — mirrors the shape of ../expertises.ts.
   Internal links (ctaSecondaire.href) stay in their raw French-route form and
   are localised (/en prefix) by the shared page component. */

import type { Expertise } from '../expertises';

export const expertisesEn: Expertise[] = [
  {
    slug: 'estate',
    nom: 'PEAK ESTATE',
    titre: 'Financing your property, from first purchase to lasting wealth.',
    intro: 'Primary residence, rental investment, SCI, dismemberment: we build the financing suited to your situation and your goals — not a standardised loan.',
    ctaPrincipal: 'Book a 30-minute conversation',
    ctaSecondaire: { libelle: 'Estimate my capacity', href: '/#simulateur' },
    pourQui: {
      titre: 'Whatever your borrower profile.',
      cibles: [
        { titre: 'First-time buyers', texte: 'First purchase, limited down payment, a recent permanent contract: we defend your file with the institutions able to look beyond automatic criteria.' },
        { titre: 'Buy-to-let investors', texte: 'First property or tenth unit: we choose the bank and the structure that preserve your capacity for what comes next.' },
        { titre: 'Non-residents & expatriates', texte: 'You live abroad and French banks turn your file away? This is a situation we handle regularly.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'Each point opposite can save several thousand euros over the life of the loan — or unlock a project your bank was refusing.',
      points: [
        { titre: 'Negotiating the rate and terms', texte: 'Rate, arrangement fees, early-repayment penalties, flexible instalments: everything is negotiable, not just the headline rate.' },
        { titre: 'A suitable legal structure', texte: 'Personal name, SCI taxed on income or corporate tax, joint ownership, dismemberment: the right vehicle changes both taxation and borrowing capacity.' },
        { titre: 'Optimising borrowing capacity', texte: 'Treatment of rent, repayment deferral, term, loan smoothing: as many levers to get a tight file through.' },
        { titre: 'A multi-deal strategy', texte: 'If you plan to buy again, we structure the first loan so it doesn’t block the next ones.' },
      ],
    },
    comment: {
      titre: 'From your call to the release of funds.',
      etapes: [
        { titre: 'Reviewing your situation', texte: 'A first conversation to understand your situation and your project. Free, with no commitment.' },
        { titre: 'Structuring the file', texte: 'Choice of structure, debt calibration, preparation of a solid file for the banks.' },
        { titre: 'Bank negotiation', texte: 'Presentation to the best-placed banks and negotiation of terms, rate and insurance included.' },
        { titre: 'Follow-up to disbursement', texte: 'Support through to signing at the notary and the release of funds, then availability for your next deals.' },
      ],
    },
    final: { titre: 'A property project in mind?', texte: '30 minutes to talk it through and see where you stand, with no commitment.', bouton: 'Book a 30-minute conversation' },
  },
  {
    slug: 'pro',
    nom: 'PEAK PRO',
    titre: 'Financing a business, its acquisition and its growth.',
    intro: 'Start-up, buyout (LBO), cash flow, leasing: we structure business financing that holds up over time — debt, equity and taxation thought through together.',
    ctaPrincipal: 'Book a 30-minute conversation',
    ctaSecondaire: { libelle: 'See the other areas', href: '/#expertises' },
    pourQui: {
      titre: 'Executives, buyers and growing businesses.',
      cibles: [
        { titre: 'Buyers & investors', texte: 'Acquiring a business, shares or equity stakes: we structure the acquisition debt and the holding structure that goes with it.' },
        { titre: 'SME executives', texte: 'Cash-flow needs, equipment financing, business premises: we look for the least costly solution for your balance sheet.' },
        { titre: 'Independent professionals', texte: 'Setting up, buying a patient or client base, professional premises: structures suited to your income and practice.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'Poorly structured business financing weighs on cash flow for years. We balance debt and equity before approaching the banks.',
      points: [
        { titre: 'Business buyout (LBO)', texte: 'Structuring the acquisition holding, calibrating senior debt, leverage and repayment capacity from the target’s dividends.' },
        { titre: 'Business loan & cash flow', texte: 'Working-capital financing, equipment loans, cash lines and guaranteed loans, negotiated at the right level of rate and guarantees.' },
        { titre: 'Property & equipment leasing', texte: 'Acquiring premises, equipment or vehicles while preserving your cash flow and optimising the accounting and tax treatment.' },
        { titre: 'Debt / equity structuring', texte: 'Balancing bank debt, private debt and equity, in coordination with your accountant and financial partners.' },
      ],
    },
    comment: {
      titre: 'From the first conversation to the disbursement.',
      etapes: [
        { titre: 'Analysing the project', texte: 'Understanding the deal, the accounts and the objectives. First conversation free and with no commitment.' },
        { titre: 'Financial structuring', texte: 'Legal and financial structure, financing plan and forecast ready to present to institutions.' },
        { titre: 'Bank negotiation', texte: 'Putting business banks and partners in competition, negotiating the rate, guarantees and covenants.' },
        { titre: 'Closing & follow-up', texte: 'Support through to disbursement, then availability for your next deals and financing needs.' },
      ],
    },
    final: { titre: 'A deal to finance?', texte: '30 minutes to talk it through and frame its feasibility, with no commitment.', bouton: 'Book a 30-minute conversation' },
  },
  {
    slug: 'pim',
    nom: 'PEAK PIM',
    titre: 'Financing lines for fast-moving operations.',
    intro: 'Property traders, developers, holding companies: we set up property-trader loans, programme financing and the holding / SPV structures suited to your operating cycles.',
    ctaPrincipal: 'Book a 30-minute conversation',
    ctaSecondaire: { libelle: 'See the other areas', href: '/#expertises' },
    pourQui: {
      titre: 'Players who finance operations, not a home.',
      cibles: [
        { titre: 'Property traders', texte: 'Buy-and-sell, subdivision, heavy renovation: short financing calibrated on margin and the pace at which you resell your units.' },
        { titre: 'Developers', texte: 'Off-plan (VEFA) programme financing, development facility, completion guarantee: we structure the debt around your sales plan.' },
        { titre: 'Property companies & investors', texte: 'Building or refinancing a portfolio, holding / SPV structures, leverage optimised on income-producing assets.' },
      ],
    },
    reperes: null,
    concretement: {
      intro: 'On these operations, speed of execution and structuring matter as much as the rate. We target the partners who know how to finance your business.',
      points: [
        { titre: 'Property-trader credit lines', texte: 'Financing acquisition and works on buy-and-sell operations, with terms and a deferral suited to the sales cycle.' },
        { titre: 'Programme financing', texte: 'Development facility, off-plan financing, financial completion guarantee: structured around the sales plan.' },
        { titre: 'Holding / SPV structuring', texte: 'Setting up dedicated project companies, ring-fencing risk and optimising leverage deal by deal.' },
        { titre: 'Optimising cash-flow cycles', texte: 'Chaining operations without a cash-flow break, stock refinancing and revolving lines to keep your capacity to act.' },
      ],
    },
    comment: {
      titre: 'An organisation tuned to your operations.',
      etapes: [
        { titre: 'Analysing the operation', texte: 'Study of the developer’s balance sheet, the margin forecast and the sales plan.' },
        { titre: 'Structure & vehicle', texte: 'Choice of vehicle (SPV, holding), calibration of debt and guarantees suited to the operation.' },
        { titre: 'Competitive tender', texte: 'Approaching banks and partners specialised in financing real-estate operations.' },
        { titre: 'Follow-up & renewal', texte: 'Support through to disbursement, then renewal of the lines for your next operations.' },
      ],
    },
    final: { titre: 'An operation to structure?', texte: '30 minutes to frame the financing of your next operation.', bouton: 'Book a 30-minute conversation' },
  },
  {
    slug: 'insure',
    nom: 'PEAK INSURE',
    titre: 'Borrower insurance is where your savings hide.',
    intro: 'Insurance can account for nearly a third of the cost of your loan. Thanks to the Lemoine law and insurance delegation, there is almost always a better option — without changing your loan.',
    ctaPrincipal: 'Have my insurance reviewed',
    ctaSecondaire: { libelle: 'Understand insurance delegation', href: '/actualites/delegation-assurance' },
    pourQui: null,
    reperes: [
      { valeur: 'Up to ⅓', texte: 'of the total cost of the loan can come from borrower insurance alone.' },
      { valeur: 'At any time', texte: 'the Lemoine law lets you cancel and switch insurance whenever you wish, free of charge.' },
      { valeur: 'Several thousand €', texte: 'in frequent savings over the life of the loan, at equal or better cover.' },
    ],
    concretement: {
      intro: 'We check the equivalence of cover required by your bank, then put insurers in competition to cut the cost without weakening your protection.',
      points: [
        { titre: 'Multi-insurer comparison', texte: 'Putting several delegated insurers in competition, with cover at least equivalent to that required by your bank.' },
        { titre: 'Lemoine-law delegation', texte: 'Switching insurance at any time, free of charge, and with no health questionnaire under conditions of amount and age.' },
        { titre: 'Specific profiles', texte: 'Aggravated health risks, high-risk jobs or sports, senior borrowers: we find cover that accepts your profile at a fair price.' },
        { titre: 'Reducing the overall cost', texte: 'Analysis of the annual effective insurance rate (TAEA) and total cost, to measure the real saving over the whole loan.' },
      ],
    },
    comment: {
      titre: 'A simple, risk-free insurance switch.',
      etapes: [
        { titre: 'Analysing your contract', texte: 'We review your current insurance, its cover and its real cost over the remaining term.' },
        { titre: 'Finding alternatives', texte: 'We compare delegated offers at equivalent cover and quantify the potential saving.' },
        { titre: 'Substitution formalities', texte: 'We prepare the file and handle the substitution request with your bank.' },
        { titre: 'Setting it up', texte: 'The new contract takes over with no interruption of cover and no change to your loan.' },
      ],
    },
    final: { titre: 'How much could you save?', texte: 'Send us your current contract: we quantify the possible saving, with no commitment.', bouton: 'Compare your loan insurance' },
  },
];
