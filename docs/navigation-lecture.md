# Signet de dossier et ouvertures

11 novembre 2026. La première courbe chiffrée a été refusée par Valentin ; elle n’est plus utilisée dans ce clone.

La nouvelle proposition est un signet au bord de la page : **7 × 44 px**, cuivre, petite encoche de marque-page. Il se déplace avec la lecture, sans cadre flottant, graphique ou pourcentage visible. Le titre de la rubrique apparaît uniquement au survol ou au focus. Sur écran tactile, il devient un signe de 4 × 28 px sans zone de capture du toucher.

Référence principale : charte Altitude du cabinet. Le rôle du signet vient du dossier bancaire et du livre ; la référence éditoriale Refero déjà étudiée, **Franco Maria Ricci — the collector’s cabinet**, fournit l’idée d’un repère sur la tranche d’un ouvrage, sans reprendre sa typographie. La nouvelle proposition reste à valider visuellement avec Valentin.

La commande conserve le glisser et le clavier sur ordinateur, sans modifier molette, tactile, ancres ou historique. L’accessibilité donne la position et la rubrique sans annonce permanente. La barre native reste disponible sans JavaScript et en contraste forcé. Les cadres internes gardent leur propre défilement ; le signet ne s’imprime pas.

Le contrôleur `lecture.ts` est indépendant des fondus historiques. Il se nettoie à la navigation Astro et s’actualise lorsque la hauteur change. `motion.ts` reçoit uniquement le nouveau menu Nos services dans la liste des menus exclusifs ; les animations de fond et des avis ne sont pas réécrites.

Les ouvertures livre et EXCHANGE conservent leur hauteur minimale de fenêtre moins les 77 px du menu et du filet, et leur centrage vertical. Le contenu peut grandir plutôt qu’être coupé sur écran court. Les conditions du livre restent dans le bloc sombre final.

Les tests du contrôleur passent. Le moteur d’accès navigateur était indisponible : rendu du signet, glisser réel et formats ordinateur/mobile restent à contrôler avant publication. Aucun changement de calcul, d’API Claude ou du serveur de paiement.
