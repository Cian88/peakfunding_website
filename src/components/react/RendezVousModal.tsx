import { useEffect, useRef, useState } from 'react';
import PriseRendezVous from './PriseRendezVous';
import { ui, type Lang } from '../../i18n';

/**
 * Fenêtre modale de prise de rendez-vous — comme en v1, tout bouton « rendez-vous »
 * l'ouvre (délégation dans motion.ts : clic sur a[href="#rdv"] ou [data-rdv]),
 * ainsi qu'un lien entrant portant #rdv. Le parcours en deux étapes puis les
 * agendas Proton vivent dedans, inchangés.
 */
export default function RendezVousModal({ lang = 'fr' }: { lang?: Lang }) {
  const m = ui[lang].modale;
  const ref = useRef<HTMLDialogElement>(null);
  const retourFocus = useRef<HTMLElement | null>(null);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const ouvrir = (trigger?: HTMLElement) => {
      const d = ref.current;
      if (!d || d.open) return;
      retourFocus.current = trigger || (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : document.querySelector<HTMLElement>('#contenu'));
      setOuvert(true);
      d.showModal();
      d.scrollTop = 0;
      document.documentElement.style.overflow = 'hidden';
    };
    const fermer = () => { setOuvert(false); ref.current?.close(); document.documentElement.style.overflow = ''; };
    const surEvenement = (event: Event) => { event.preventDefault(); const trigger = (event as CustomEvent).detail; ouvrir(trigger instanceof HTMLElement ? trigger : undefined); };
    const surHash = () => { if (location.hash.toLowerCase() === '#rdv') ouvrir(); };
    window.addEventListener('ouvrir-rdv', surEvenement);
    window.addEventListener('hashchange', surHash);
    surHash();
    const d = ref.current;
    const surClose = () => {
      setOuvert(false);
      document.documentElement.style.overflow = '';
      if (location.hash.toLowerCase() === '#rdv') history.replaceState(history.state, '', location.pathname + location.search);
      const trigger = retourFocus.current;
      const destination = trigger?.isConnected && trigger.getClientRects().length
        ? trigger
        : document.querySelector<HTMLElement>('[data-menu] summary')?.getClientRects().length
          ? document.querySelector<HTMLElement>('[data-menu] summary')
          : document.querySelector<HTMLElement>('#contenu');
      destination?.focus({ preventScroll: true });
    };
    d?.addEventListener('close', surClose);
    return () => { window.removeEventListener('ouvrir-rdv', surEvenement); window.removeEventListener('hashchange', surHash); d?.removeEventListener('close', surClose); fermer(); };
  }, []);

  return (
    <dialog ref={ref} aria-labelledby="rdv-titre" aria-describedby="rdv-description" className="sombre rdv-dialog m-auto w-[min(880px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-donnee border border-filet bg-abime p-0 text-etoile backdrop:bg-[rgba(11,13,18,0.72)] backdrop:backdrop-blur-sm"
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
      <div className="relative p-6 sm:p-8">
        <button type="button" onClick={() => ref.current?.close()} aria-label={m.fermer} className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-pill border border-filet text-argent hover:bg-graphite hover:text-etoile">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
        <p className="eyebrow pr-10 text-cuivre-clair">{m.surtitre}</p>
        <h2 id="rdv-titre" className="mt-3 pr-4 text-[28px] leading-[1.1] font-light tracking-[-0.03em] text-etoile sm:text-[36px]">{m.titre}</h2>
        <p id="rdv-description" className="mt-3 max-w-xl text-[15px] text-argent">{m.description}</p>
        <div className="mt-6">{ouvert && <PriseRendezVous lang={lang} />}</div>
      </div>
    </dialog>
  );
}
