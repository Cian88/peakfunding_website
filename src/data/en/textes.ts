/* English FAQs per expertise — mirrors faqExpertises in ../textes.ts. */
import type { QR } from '../textes';

export const faqExpertisesEn: Record<'estate' | 'pro' | 'pim' | 'insure', QR[]> = {
  estate: [
    { q: 'Do you always need a down payment to invest in buy-to-let?', r: 'Not systematically. On a rental project, most banks today expect a down payment covering at least the notary and guarantee fees. Some, however, agree to finance these fees — or even part of the works — when the yield and the rest of the file justify it. Full “turnkey” financing remains mainly reserved for buying a primary residence.' },
    { q: 'SCI or personal name: which to choose?', r: 'It depends on your tax position, your goals and how the acquisition is structured. We discuss it at the first meeting and, if needed, involve your notary or accountant before any decision.' },
    { q: 'I am a non-resident — can you help me?', r: 'Yes, this is a significant part of our work. Not every bank accepts non-residents, but we know which ones to approach and how to present the file. It is all handled remotely.' },
  ],
  pro: [
    { q: 'Do you finance buyouts without a large personal contribution?', r: 'On a buyout, banks generally expect a down payment of around 20 to 30% of the price, but this level is negotiable depending on the target’s strength and its ability to repay the debt. A holding structure, a seller’s loan or equity partners can reduce the contribution required.' },
    { q: 'Do you work with my accountant?', r: 'Yes, systematically when it is useful. We coordinate our work with your accountant and, where relevant, your lawyer, so that the financial, legal and tax structure is consistent.' },
    { q: 'How long does business financing take?', r: 'Allow on average 6 to 10 weeks between submitting a complete file and the agreement, depending on the complexity of the deal and the number of institutions approached. A first feasibility read is given within a few days.' },
  ],
  pim: [
    { q: 'Do you finance a first property-trading operation?', r: 'Yes, it is possible, even if banks are more demanding on a first file. The quality of the operation, the forecast margin, your contribution and possibly a guarantee or co-investor make the difference. We point you to the partners most open to new operators.' },
    { q: 'How much equity is expected on an operation?', r: 'In property trading as in development, expect generally 15 to 25% equity on the cost price of the operation, varying with risk, location and your track record. Some structures allow this level to be optimised.' },
    { q: 'Do you handle recurring lines or only one-off deals?', r: 'Both. We arrange one-off financing as well as a lasting relationship with renewable lines, so you can chain operations without starting from scratch each time.' },
  ],
  insure: [
    { q: 'Can I really switch insurance at any time?', r: 'Yes. Since the Lemoine law, you can cancel and replace the insurance on your mortgage at any time, free of charge, provided you present cover that is at least equivalent. The bank cannot object if the equivalence of cover is respected.' },
    { q: 'Will I lose cover?', r: 'No — that is precisely our point of vigilance. We only offer contracts whose cover is at least equivalent to that required by your bank. Often, the saving even comes with better cover.' },
    { q: 'Is it worthwhile even if my loan is already under way?', r: 'Often, yes. The more capital and years you have left to repay, the greater the saving. Even halfway through, switching insurance can represent several thousand euros. We quantify the gain before any steps.' },
    { q: 'Can I choose my insurance as soon as I sign my loan?', r: 'Yes. Since the Lagarde law, you can present a policy from another insurer from the loan application onwards, provided it offers cover at least equivalent to that listed in the bank’s standardised information sheet (FSI). It is the best moment: the bank can neither change the loan rate nor charge fees in return.' },
    { q: 'Can my bank refuse my new policy?', r: 'Only if an equivalence criterion required in its FSI is not met. It must reply within ten working days of receiving the complete file and, if it refuses, give its reasons in writing, listing every missing criterion. The policy can then be adjusted and submitted again.' },
    { q: 'Will I have to fill in a health questionnaire?', r: 'No, if the insured share does not exceed €200,000 per person, across all property loans, and the loan ends before your 60th birthday (Lemoine law). Above that, a questionnaire may be required; the right to be forgotten and the AERAS convention then govern how past health conditions are assessed.' },
    { q: 'I have a health condition, a high-risk job or a high-risk sport: is it possible?', r: 'Yes, and this is often where delegation helps most. The bank’s group policy applies uniform rules, whereas an individual policy is priced on your actual situation. We look for the insurer that accepts your profile at a fair price, checking exclusions and any extra premiums.' },
    { q: 'How long does switching loan insurance take?', r: 'The timing depends mainly on the new insurer’s underwriting formalities. Once the complete file is sent, the bank has ten working days to reply, then issues a free amendment. The old policy ends on the start date of the new one, with no gap in cover.' },
  ],
};
