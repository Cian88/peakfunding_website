// Validation de saisie, indépendante des règles de financement et de Formspree.
const texte = v => String(v ?? '').trim();
export function validerRdv(f, etape) {
  const erreurs = {};
  if (etape === 1) {
    for (const k of ['prenom','nom','email','tel']) if (!texte(f[k])) erreurs[k] = 'requis';
    if (texte(f.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texte(f.email))) erreurs.email = 'email';
    const tel = texte(f.tel);
    const chiffres = tel.replace(/\D/g, '');
    if (tel && (!/^\+?[\d\s().-]+$/.test(tel) || chiffres.length < 8 || chiffres.length > 15)) erreurs.tel = 'tel';
  } else {
    if (!texte(f.ville)) erreurs.ville = 'requis';
    for (const k of ['budget','apport','revenus','charges','tauxSouhaite','dureeSouhaitee','montantSouhaite']) {
      const v = texte(f[k]).replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
      if (!v) erreurs[k] = 'requis';
      else if (!/^\d+(?:\.\d+)?$/.test(v) || !Number.isFinite(Number(v))) erreurs[k] = 'nombre';
      else if (['budget','dureeSouhaitee','montantSouhaite'].includes(k) && Number(v) <= 0) erreurs[k] = 'positif';
    }
    if (!f.rgpd) erreurs.rgpd = 'consentement';
  }
  return erreurs;
}
export function messageErreurRdv(code, lang='fr') {
  const textes = lang === 'en' ? {
    requis:'Please fill in this field.', email:'Enter a valid email, e.g. name@example.com.',
    tel:'Enter a phone number with 8 to 15 digits, including the country code if needed.',
    nombre:'Enter a positive number or zero, without a currency symbol.', positif:'Enter a number greater than zero.',
    consentement:'Please give your consent before sending your request.',
  } : {
    requis:'Renseignez ce champ.', email:'Saisissez un e-mail valide, par exemple nom@exemple.fr.',
    tel:'Saisissez un numéro de 8 à 15 chiffres, avec l’indicatif du pays si nécessaire.',
    nombre:'Saisissez un nombre positif ou nul, sans symbole monétaire.', positif:'Saisissez un nombre supérieur à zéro.',
    consentement:'Votre accord est nécessaire avant l’envoi de la demande.',
  };
  return textes[code] ?? textes.requis;
}
