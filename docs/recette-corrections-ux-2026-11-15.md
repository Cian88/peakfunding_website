# Vérification des corrections UX

15 novembre 2026. Voir [l’audit initial](audit-ux-2026-11-14/Audit-UX-PEAK-FUNDING.md).

- Une saisie financière invalide conserve la dernière valeur valide dans le simulateur et dans sa version embarquée PEAK PITCH. Les formules de calcul sont conservées.
- Sur un écran de 390 × 844 px, le tarif PEAK PITCH commence à 350 px et l’action PEAK EXCHANGE à 436 px. Sur un écran de 320 × 568 px, leurs bas atteignent respectivement 471 et 558 px. Le lien de la vidéo reste visible à 844 × 390 px et 2 560 × 1 080 px.
- Le film se lance automatiquement en mode standard. L’affiche reste fixe en mouvement réduit. Le contrôle de pause, la fermeture clavier du menu et la destination du lien ont été vérifiés avec Chromium, Firefox et WebKit. Les quatre premiers écrans en français contrôlés à 390 px passent les règles Axe exécutées.
- Le livre propose l’édition et l’extrait près du prix. Le formulaire administratif peut être raccordé avec `PUBLIC_ADMIN_CONTACT_FORM`, une URL Formspree dédiée. Le clone propose le courrier postal en attendant cette configuration. L’adresse e-mail du cabinet ne figure plus sous forme encodée dans les pages.
- La branche serveur `codex/ebook-stancer-2490` contient la reprise d’achat EXCHANGE et livre. Le test ouvre la confirmation dans un deuxième navigateur, en utilisant des données et un envoi fictifs. La signature accepte une clé serveur `PEAK_PURCHASE_RECOVERY_KEY` à garder stable, avec repli sur la clé Stancer. Vérifier l’envoi transactionnel et conserver le suivi des clics désactivé pour les liens d’accès.
- La vitrine anglophone annonce la langue des formulaires PITCH et EXCHANGE. EXCHANGE transporte le choix de langue jusqu’à la confirmation. Le formulaire et le questionnaire PITCH restent en français.
- Avant mise en ligne, vérifier en environnement de test les retours réels Stancer, la livraison des messages Resend et l’agenda Proton. Proton demande le nom et l’e-mail sur sa page standard, et indique l’adresse du calendrier aux participants. Le téléphone reste dans la commande EXCHANGE. [Documentation Proton](https://proton.me/support/calendar-appointment-scheduling)
