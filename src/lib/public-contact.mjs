export function protectPublicEmails(html, lang = 'fr') {
  const prefix = lang === 'en' ? '/en' : '';
  const label = lang === 'en' ? 'Contact the firm' : 'Contacter le cabinet';
  const link = `<a href="${prefix}/contact/#administratif">${label}</a>`;
  // Seules les occurrences juridiques explicitement marquées restent lisibles.
  return html.replace(/<span data-legal-email>[\w.+-]+@peakfunding\.eu<\/span>|<a\b[^>]*href=["']mailto:[^"']*@peakfunding\.eu[^"']*["'][^>]*>[^<]*<\/a>|[\w.+-]+@peakfunding\.eu/gi,
    match => match.startsWith('<span data-legal-email>') ? match : link);
}
