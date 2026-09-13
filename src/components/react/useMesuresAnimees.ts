import { useEffect, useRef, useState } from 'react';
import { valeurComptee } from '../../lib/compteur-observatoire.mjs';

export function useMesuresAnimees(rate:number, durationMonths:number) {
  const mesuresRef = useRef<HTMLDListElement>(null);
  const commence = useRef(false);
  const courantes = useRef({ rate, durationMonths });
  // Le HTML serveur et le premier rendu contiennent toujours les valeurs exactes.
  const [valeurs, setValeurs] = useState(courantes.current);

  useEffect(() => {
    const element = mesuresRef.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const statique = new URLSearchParams(location.search).has('statique');
    let frame = 0, lance = false;
    const publier = (valeur:typeof courantes.current) => {
      courantes.current = valeur;
      setValeurs(valeur);
    };
    const terminer = () => {
      cancelAnimationFrame(frame);
      publier({ rate, durationMonths });
    };
    const demarrer = () => {
      if (lance || document.hidden) return;
      lance = true;
      const premiere = !commence.current;
      commence.current = true;
      const depart = premiere ? { rate:0, durationMonths:0 } : courantes.current;
      if (preference.matches || statique ||
          (depart.rate === rate && depart.durationMonths === durationMonths)) {
        terminer(); return;
      }
      // Première découverte expressive ; actualisations plus courtes et sans retour à zéro.
      const duree = premiere ? 900 : 320;
      const decalage = premiere ? 90 : 0;
      const debut = performance.now();
      publier(depart);
      const compter = (temps:number) => {
        const ecoule = temps - debut;
        publier({
          rate:valeurComptee(depart.rate, rate, ecoule / duree),
          durationMonths:valeurComptee(depart.durationMonths, durationMonths, (ecoule - decalage) / duree),
        });
        if (ecoule < duree + decalage) frame = requestAnimationFrame(compter);
      };
      frame = requestAnimationFrame(compter);
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= .6) demarrer();
      else if (lance) terminer();
    }, { threshold:[0,.6], rootMargin:'0px 0px -24px 0px' }) : null;
    const changerPreference = () => {
      if (preference.matches) { commence.current = true; lance = true; terminer(); }
    };
    const changerVisibilite = () => {
      if (document.hidden) { if (lance) terminer(); }
      else {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight - 24) demarrer();
      }
    };
    if (preference.matches || statique || !('IntersectionObserver' in window)) {
      commence.current = true; terminer();
    } else observer?.observe(element);
    preference.addEventListener('change', changerPreference);
    document.addEventListener('visibilitychange', changerVisibilite);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      preference.removeEventListener('change', changerPreference);
      document.removeEventListener('visibilitychange', changerVisibilite);
    };
  }, [rate, durationMonths]);
  return { mesuresRef, valeurs };
}
