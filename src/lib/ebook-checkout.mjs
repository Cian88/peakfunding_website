// Aucune vente avant activation explicite ET raccordement de la livraison privée.
export function ebookCheckoutURL(env, lang) {
  if (env.PUBLIC_EBOOK_SALES_ENABLED !== 'true') return null;
  const raw = lang === 'fr' ? env.PUBLIC_EBOOK_STRIPE_LINK_FR : env.PUBLIC_EBOOK_STRIPE_LINK_EN;
  try {
    const payment = new URL(raw || ''), delivery = new URL(env.PUBLIC_EBOOK_DELIVERY_URL || '');
    if (payment.protocol !== 'https:' || payment.hostname !== 'buy.stripe.com' || payment.username || payment.password || payment.port || !payment.pathname.slice(1)) return null;
    if (delivery.protocol !== 'https:' || delivery.username || delivery.password || delivery.port) return null;
    return payment.href;
  } catch { return null; }
}
