import type { Lang } from '../i18n';
import assets from './ebook-assets.json';
import { ebookCheckoutURL } from '../lib/ebook-checkout.mjs';

export const EBOOK_PRICE = 24.90;
export const EBOOK_AUTHOR = 'Valentin Boura Defranoux';
export const EBOOK_PUBLICATION = 'Novembre 2026';
export const ebookPrice = (lang: Lang) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {style:'currency',currency:'EUR'}).format(EBOOK_PRICE);
export const checkoutURL = (lang: Lang): string | null => ebookCheckoutURL(import.meta.env, lang);
export const excerptURL = (lang: Lang): string | null => {
  const value = assets[lang].excerpt as string | null;
  return value === `/extraits/ebook-${lang}.pdf` ? value : null;
};
const fr = {
  title:'Financer son projet en France', subtitle:'Ce que les banques regardent vraiment', pages:80,
  introduction:'Avant de défendre votre projet, comprenez comment une banque lit votre dossier. Un guide pratique pour préparer votre financement, de la résidence principale aux montages patrimoniaux et professionnels.',
  parts:[
    {title:'Comprendre comment une banque décide',chapters:['Le cadre réglementaire','La lecture du dossier','Les revenus retenus','Le rôle du courtier']},
    {title:'Le crédit immobilier classique',chapters:['Les types de prêt','Prêts aidés et réglementés','Les garanties','L’assurance emprunteur','De la simulation à la signature','Négocier et rebondir après un refus','Renégociation et rachat','Acheter à deux et recevoir un apport']},
    {title:'Investissement locatif et montages patrimoniaux',chapters:['Financer un bien locatif','Emprunter via une SCI','Holding et régime mère-fille','Fiscalité et financement','Résidences mixtes','La location de courte durée','Les profils particuliers','Trois alternatives au crédit']},
    {title:'Les financements atypiques',chapters:['Prêt gigogne et lissage','Le crédit lombard','Le crédit vendeur','Le LBO','L’OBO : céder à sa holding','Marchands de biens et promotion']},
  ],
};
const en = {
  title:'Financing Your Project in France', subtitle:'What lenders really look for', pages:78,
  introduction:'Understand how a French bank assesses an application before presenting your project. A practical guide to preparing your financing, from buying a home to property ownership structures and specialist business finance.',
  parts:[
    {title:'How banks make lending decisions',chapters:['The regulatory framework','Reading the application','Income the bank takes into account','The broker’s role']},
    {title:'Residential mortgages',chapters:['Types of loan','Supported and regulated loans','Security and guarantees','Borrower insurance','From simulation to signing','Negotiating and responding to a refusal','Renegotiation and refinancing','Buying together and receiving a gift']},
    {title:'Rental investment and ownership structures',chapters:['Financing a rental investment','Borrowing through an SCI','Holding companies and SCIs','Tax choices and financing','A home with rental units','Short-term rentals','Borrowers with particular needs','Three alternatives to a loan']},
    {title:'Specialist finance',chapters:['Combining loans','The Lombard loan','Seller financing','Leveraged buyouts','Owner buyouts','Property trading and development']},
  ],
};
export const ebook = (lang: Lang) => lang === 'fr' ? fr : en;
