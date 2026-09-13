# Modèle d'e-mail — invitation à déposer un avis

Envoyé par le courtier après le déblocage des fonds. Remplacer `{Prénom}`, `{Courtier}` et
`{Lien}` (issu de `insert into invitations (email_client, dossier) values (...) returning jeton;`
→ `https://peakfunding.eu/avis/deposer?jeton=<jeton>` ; version anglaise : `/en/avis/deposer?jeton=…`).

---

## Version française

**Objet :** Votre avis sur votre financement — 2 minutes, sur invitation

Bonjour {Prénom},

Vos fonds sont débloqués : félicitations pour cette étape, et merci de votre confiance tout au long du dossier.

Si vous en avez le temps, votre retour nous serait précieux. Il aide les futurs clients à se faire une idée juste de notre accompagnement, et il nous aide à progresser.

**Déposer mon avis** → {Lien}

Concrètement :
- Le lien est personnel et valable 60 jours. Il ne peut servir qu'une fois.
- Vous vous identifiez avec votre compte Google : c'est ce qui garantit que chaque avis publié est authentique.
- Seuls votre prénom, l'initiale de votre nom et la photo de votre compte apparaissent, avec le type de projet, le montant financé et la ville. Votre adresse e-mail et votre nom complet ne sont jamais publiés.
- Votre avis est relu avant mise en ligne, et vous pouvez en demander le retrait à tout moment.

Un mot sincère, positif ou critique, vaut mieux qu'un long texte. Et si vous préférez ne pas laisser d'avis, cela ne change rien à notre relation.

Bien à vous,

{Courtier}
PEAK FUNDING — Courtage en financement
ORIAS n° 24002546 · peakfunding.eu

---

## English version

**Subject:** Your feedback on your financing — 2 minutes, by invitation

Hello {Prénom},

Your funds have been released — congratulations on this milestone, and thank you for your trust throughout the process.

If you have a moment, your feedback would mean a lot. It helps future clients get an accurate picture of how we work, and it helps us improve.

**Leave my review** → {Lien}

In practice:
- The link is personal, valid for 60 days, and can only be used once.
- You sign in with your Google account: this is what guarantees that every published review is genuine.
- Only your first name, the initial of your last name and your account photo appear, along with the project type, the amount financed and the city. Your e-mail address and full name are never published.
- Your review is checked before going live, and you can ask for it to be removed at any time.

A few sincere words, positive or critical, are worth more than a long text. And if you would rather not leave a review, it changes nothing between us.

Kind regards,

{Courtier}
PEAK FUNDING — Financing brokerage
ORIAS no. 24002546 · peakfunding.eu

---

## Rappel opérationnel

1. Après déblocage : `insert into invitations (email_client, dossier) values ('client@mail.fr', 'réf.') returning jeton;`
2. Composer le lien avec le jeton, envoyer l'e-mail ci-dessus.
3. À réception de l'avis (statut `en_attente`) : relire, puis passer `statut` à `publie` (ou `refuse`).
