export function protectPublicEmails(html) {
  const link = `<a href="/contact/#administratif">Contacter le cabinet</a>`;
  return html.replace(/<a\b[^>]*href=["']mailto:[^"']*@peakfunding\.eu[^"']*["'][^>]*>[^<]*<\/a>/gi, link).replace(/[\w.+-]+@peakfunding\.eu/gi, link);
}
