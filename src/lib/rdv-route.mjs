// Compatibilité avec les favoris et liens externes de l'ancien formulaire.
export const rdvDestination = pathname => /^\/en(?:\/|$)/.test(pathname) ? '/en/peak-exchange/' : '/peak-exchange/';
export const isLegacyRdvHash = hash => String(hash).toLowerCase() === '#rdv';
