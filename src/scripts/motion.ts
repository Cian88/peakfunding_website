/** Progressive enhancement: visible HTML first, one disposable controller per page. */
import { tonaliteAuScroll, paletteFond, couleurCSS } from '../lib/fond-scroll.mjs';
let disposePage: (() => void) | undefined;

export function demarrerMouvement() {
  disposePage?.();
  const controller = new AbortController();
  const { signal } = controller;
  const observers: IntersectionObserver[] = [];
  const frames = new Set<number>();
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const statique = new URLSearchParams(location.search).has('statique');
  const animate = !preference.matches && !statique && 'IntersectionObserver' in window;
  const toile = document.querySelector<HTMLElement>('main');
  const hero = toile?.querySelector<HTMLElement>(':scope > .heros');
  const sections = hero ? [...toile!.querySelectorAll<HTMLElement>(':scope > section:not(.heros)')] : [];
  let derniereCouleur = '';
  const actualiserFond = () => {
    if (!toile || !hero || !animate || preference.matches) { toile?.classList.remove('fond-scroll'); return; }
    const reperes = sections.map(section => ({ top: section.getBoundingClientRect().top + scrollY, clair: section.classList.contains('clair') }));
    const p = tonaliteAuScroll(reperes, scrollY, innerHeight, hero.getBoundingClientRect().bottom + scrollY);
    const palette = paletteFond(p);
    const couleur = couleurCSS(palette.fond);
    if (couleur !== derniereCouleur) {
      toile.style.setProperty('--fond-scroll', couleur);
      toile.style.setProperty('--texte-fond', couleurCSS(palette.texte));
      toile.style.setProperty('--secondaire-fond', couleurCSS(palette.secondaire));
      toile.style.setProperty('--accent-fond', couleurCSS(palette.accent));
      toile.style.setProperty('--bordure-fond', palette.bordure);
      derniereCouleur = couleur;
    }
    toile.classList.add('fond-scroll');
  };
  const cibles = [...document.querySelectorAll<HTMLElement>('.reveal, .reveal-groupe > *, .trace')];
  const compteurs = [...document.querySelectorAll<HTMLElement>('[data-compte]')];
  const afficher = (el: HTMLElement) => { el.classList.remove('reveal-pending'); el.classList.add('in'); };
  const final = (el: HTMLElement) => { el.textContent = `${el.dataset.compte || ''}${el.dataset.suffixe || ''}`; };
  const frame = (fn: FrameRequestCallback) => {
    const id = requestAnimationFrame(t => { frames.delete(id); fn(t); });
    frames.add(id);
  };
  document.documentElement.classList.toggle('mouvement', animate);
  if (animate) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { afficher(entry.target as HTMLElement); io.unobserve(entry.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    observers.push(io);
    cibles.forEach(el => {
      // Never hide content that was already visible, including on history restoration.
      if (el.getBoundingClientRect().top >= innerHeight) { el.classList.add('reveal-pending'); io.observe(el); }
      else afficher(el);
    });
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        counterObserver.unobserve(el);
        const start = performance.now();
        const target = Number(el.dataset.compte) || 0;
        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / 850);
          el.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${el.dataset.suffixe || ''}`;
          if (progress < 1) frame(tick); else final(el);
        };
        frame(tick);
      });
    }, { threshold: 0.5 });
    observers.push(counterObserver);
    compteurs.forEach(el => counterObserver.observe(el));
  } else { cibles.forEach(afficher); compteurs.forEach(final); }

  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    document.documentElement.classList.remove('mouvement');
    toile?.classList.remove('fond-scroll');
    observers.forEach(io => io.disconnect());
    frames.forEach(cancelAnimationFrame);
    frames.clear();
    queued = false;
    cibles.forEach(afficher);
    compteurs.forEach(final);
  }, { signal });

  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  const menus = [...document.querySelectorAll<HTMLDetailsElement>('[data-menu], [data-espaces]')];
  const arrierePlan = [...document.querySelectorAll<HTMLElement>('#contenu, body > footer')];
  const synchroniserMenu = () => arrierePlan.forEach(el => { el.inert = !!menu?.open && innerWidth < 1280; });
  menus.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) menus.forEach(other => { if (other !== item) other.open = false; });
    synchroniserMenu();
  }, { signal }));
  /* Défilement animé vers une ancre : courbe expo-out, durée selon la distance,
     interrompu par le moindre geste de l'utilisateur, instantané en mouvement réduit.
     (Animation maîtrisée plutôt que scrollIntoView({behavior:'smooth'}), que
     certains navigateurs n'animent pas de façon fiable.) */
  let annulerDefilement: (() => void) | null = null;
  const defilerVers = (cible: HTMLElement) => {
    annulerDefilement?.();
    const marge = parseFloat(getComputedStyle(cible).scrollMarginTop) || 0;
    const depart = scrollY;
    const arrivee = Math.max(0, Math.min(cible.getBoundingClientRect().top + depart - marge, document.documentElement.scrollHeight - innerHeight));
    const distance = arrivee - depart;
    if (Math.abs(distance) < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) { scrollTo(0, arrivee); return; }
    const duree = Math.min(900, Math.max(450, Math.abs(distance) * 0.35));
    const debut = performance.now();
    let frame = 0;
    const stop = () => { cancelAnimationFrame(frame); ['wheel', 'touchstart', 'keydown'].forEach(t => removeEventListener(t, stop)); annulerDefilement = null; };
    ['wheel', 'touchstart', 'keydown'].forEach(t => addEventListener(t, stop, { passive: true, once: true }));
    annulerDefilement = stop;
    const etape = (t: number) => {
      const p = Math.min(1, (t - debut) / duree);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);   // expo-out, comme --ease-expo
      scrollTo(0, depart + distance * e);
      if (p < 1) frame = requestAnimationFrame(etape); else stop();
    };
    frame = requestAnimationFrame(etape);
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLAnchorElement>('a[href$="#rdv"], [data-rdv]');
    if (trigger && !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {
      event.preventDefault();
      // The hydrated dialog acknowledges the event; a hash keeps early clicks usable.
      const unhandled = window.dispatchEvent(new CustomEvent('ouvrir-rdv', { cancelable: true, detail: trigger }));
      if (unhandled) location.hash = 'rdv';
    }
    // Défilement fluide réservé aux clics sur une ancre de la page courante.
    // (Pas de scroll-behavior:smooth sur <html> : il animait aussi les
    // restaurations de position du navigateur, d'où des glissades sans action.)
    const ancre = trigger ? null : event.target.closest<HTMLAnchorElement>('a[href*="#"]');
    if (ancre && event.button === 0 && !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {
      const url = new URL(ancre.href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.hash.length > 1) {
        const cible = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (cible) {
          event.preventDefault();
          defilerVers(cible);
          history.pushState(null, '', url.hash);
        }
      }
    }
    menus.forEach(item => { if (item.open && (!item.contains(event.target as Node) || (event.target as Element).closest('a, [data-rdv]'))) item.open = false; });
  }, { signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') menus.forEach(item => { if (item.open) { item.open = false; item.querySelector('summary')?.focus(); } });
    if (event.key === 'Tab' && menu?.open) {
      const controls = [...menu.querySelectorAll<HTMLElement>('summary, a, button')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }, { signal });

  const entete = document.querySelector<HTMLElement>('[data-entete]');
  const progress = document.querySelector<HTMLElement>('[data-page-progress]');
  const etapes = [...document.querySelectorAll<HTMLElement>('[data-etape]')];
  const onglets = [...document.querySelectorAll<HTMLElement>('[data-onglet]')];
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  let previous = -1;
  const update = () => {
    actualiserFond();
    if (innerWidth >= 1280 && menu?.open) { menu.open = false; synchroniserMenu(); }
    entete?.classList.toggle('givre', scrollY > 40);
    const length = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${length > 0 ? Math.min(1, Math.max(0, scrollY / length)) : 0})`;
    if (!etapes.length) return;
    let active = 0;
    etapes.forEach((el, index) => { if (el.getBoundingClientRect().top <= innerHeight * 0.45) active = index; });
    if (active === previous) return;
    previous = active;
    etapes.forEach((el, index) => el.classList.toggle('active', index === active));
    onglets.forEach((el, index) => {
      el.classList.toggle('active', index === active);
      if (index === active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    if (rail) rail.style.transform = `scaleY(${(active + 1) / etapes.length})`;
  };
  let queued = false;
  const schedule = () => { if (!queued) { queued = true; frame(() => { queued = false; update(); }); } };
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', schedule, { signal });
  update();
  disposePage = () => {
    controller.abort();
    arrierePlan.forEach(el => { el.inert = false; });
    observers.forEach(io => io.disconnect());
    frames.forEach(cancelAnimationFrame);
    cibles.forEach(afficher);
    compteurs.forEach(final);
    toile?.classList.remove('fond-scroll');
    ['--fond-scroll', '--texte-fond', '--secondaire-fond', '--accent-fond', '--bordure-fond'].forEach(prop => toile?.style.removeProperty(prop));
  };
}
