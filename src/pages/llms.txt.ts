import type { APIRoute } from 'astro';
import base from '../contenu-llms/llms.txt?raw';
import { checkoutURL, ebook, ebookPrice } from '../data/ebook';
import { exchangeCredit, exchangeFirstConsultation } from '../data/peak-exchange';
import { guidesPeakPitch, peakPitch, PEAK_PITCH_OUVERT, PRIX_PITCH } from '../data/peak-pitch';
import articlesFr from '../data/articles.json';
import articlesEn from '../data/en/articles.json';
import { stancerServiceURL } from '../lib/services-checkout.mjs';
import { SITE } from '../lib/seo';

const exchangeOuvert = Boolean(stancerServiceURL(import.meta.env, 'exchange'));

export const GET: APIRoute = () => {
  const sections = [base.trimEnd()
    .replace('{{EXCHANGE_FR}}', exchangeOuvert ? exchangeFirstConsultation.fr : '')
    .replace('{{EXCHANGE_EN}}', exchangeOuvert ? exchangeFirstConsultation.en : '')];

  for (const lang of ['fr', 'en'] as const) {
    const en = lang === 'en', langue = en ? 'English' : 'Français', prefix = en ? '/en' : '';
    const articles = en ? articlesEn : articlesFr;
    const lien = (chemin: string) => SITE + prefix + chemin;
    const pitch = peakPitch(lang), livre = ebook(lang);
    const items = [
      ...(PEAK_PITCH_OUVERT ? [
        `- [PEAK PITCH](${lien('/peak-pitch/')}): ${pitch.intro} ${en ? `€${PRIX_PITCH} per project, one-off payment; the questionnaire and PDFs are in French.` : `${PRIX_PITCH} € par projet, paiement unique. Questionnaire et PDF en français.`}`,
        `  ${pitch.livrables.map((l) => l.titre).join(' · ')}. ${pitch.limites.join(' ')}`,
      ] : []),
      ...(exchangeOuvert ? [
        `- [PEAK EXCHANGE](${lien('/peak-exchange/')}): ${exchangeFirstConsultation[lang]} ${en ? 'Up to one hour. The note is sent within 24 hours. Available separately from PEAK PITCH.' : 'Un échange d’une heure maximum, avec remise de la note sous 24 heures. Prestation accessible séparément de PEAK PITCH.'} ${exchangeCredit[lang]}`,
      ] : []),
      ...(checkoutURL(lang) ? [
        `- [${livre.title}](${lien('/livre/')}): ${livre.introduction} ${ebookPrice(lang)}. PDF · 26 ${en ? 'chapters' : 'chapitres'}. [${en ? 'Free extract' : 'Extrait gratuit'}](${lien('/livre/#extrait')}).`,
      ] : []),
    ];
    if (items.length) sections.push(`## ${en ? 'Online offers' : 'Offres en ligne'} · ${langue}\n\n${items.join('\n')}`);
    const guides = articles.filter((a) => guidesPeakPitch.some((slug) => slug === a.slug));
    sections.push(`## ${en ? 'French mortgage application guides' : 'Guides du dossier de prêt immobilier'} · ${langue}\n\n${guides.map((a) => `- [${a.title}](${lien(`/actualites/${a.slug}/`)}): ${a.description}`).join('\n')}`);
  }

  return new Response(sections.join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
