import { stancerServiceURL } from './services-checkout.mjs';
import { ebookCheckoutURL } from './ebook-checkout.mjs';

// Même décision que les boutons de paiement : indexation à l'ouverture effective.
export function salesIndexable(pathname, env) {
  const route = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '');
  if (route === '/livre') return Boolean(ebookCheckoutURL(env, 'fr'));
  if (route === '/peak-exchange' || route === '/contact') return Boolean(stancerServiceURL(env, 'exchange'));
  return true;
}
