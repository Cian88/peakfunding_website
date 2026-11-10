// Contact administratif accessible sur demande, sans adresse affichée dans le HTML.
export const administrativeEmail = 'Y29udGFjdEBwZWFrZnVuZGluZy5ldQ==';
export function protectPublicEmails(html) {
  const link = `<a href="/contact/#administratif" data-protected-email="${administrativeEmail}">Contacter le cabinet par courriel administratif</a>`;
  return html.replace(/<a\b[^>]*href=["']mailto:[^"']*@peakfunding\.eu[^"']*["'][^>]*>[^<]*<\/a>/gi, link).replace(/[\w.+-]+@peakfunding\.eu/gi, link);
}
