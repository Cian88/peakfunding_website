// Aucune vente avant activation explicite ET raccordement de la livraison privée.
export function ebookCheckoutURL(env, lang) {
  if (env.PUBLIC_EBOOK_SALES_ENABLED !== 'true') return null;
  try {
    const service = new URL(env.PUBLIC_EBOOK_SERVICE_URL || '');
    if (service.protocol !== 'https:' || service.username || service.password || service.port || service.hash || service.search) return null;
    return service.href.replace(/\/$/, '') + (lang === 'en' ? '/ebook-payment.html?edition=en' : '/ebook-paiement.html?edition=fr');
  } catch { return null; }
}
