/** Les liens et les menus restent utilisables en HTML seul. */
let dispose: (() => void) | undefined;

export function demarrerMouvement() {
  dispose?.();
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const staticMode = new URLSearchParams(location.search).has('statique');
  const mouvement = () => {
    root.toggleAttribute('data-static', staticMode || preference.matches);
    root.classList.toggle('mouvement', !staticMode && !preference.matches);
  };
  mouvement();
  preference.addEventListener('change', mouvement, { signal });
  const menus = [...document.querySelectorAll<HTMLDetailsElement>('.mast details')];
  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  const background = document.querySelectorAll<HTMLElement>('#contenu, body > footer');
  const sync = () =>
    background.forEach((el) => {
      el.inert = !!menu?.open && innerWidth < 1180;
    });
  const close = (focus = false) =>
    menus.forEach((item) => {
      if (!item.open) return;
      item.open = false;
      if (focus) item.querySelector('summary')?.focus();
    });
  menus.forEach((item) =>
    item.addEventListener(
      'toggle',
      () => {
        if (item.open) menus.filter((other) => other !== item).forEach((other) => (other.open = false));
        sync();
      },
      { signal },
    ),
  );
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (target instanceof Element && (!target.closest('.mast details') || target.closest('a'))) close();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close(true);
      if (event.key !== 'Tab' || !menu?.open) return;
      const links = menu.querySelectorAll<HTMLElement>('summary,a');
      const next = event.shiftKey ? links[links.length - 1] : links[0];
      if (document.activeElement === (event.shiftKey ? links[0] : links[links.length - 1])) {
        event.preventDefault();
        next.focus();
      }
    },
    { signal },
  );
  const breakpoint = matchMedia('(min-width:1180px)');
  breakpoint.addEventListener(
    'change',
    () => {
      close();
      sync();
    },
    { signal },
  );
  const steps = [...document.querySelectorAll('[data-etape]')];
  const points = [...document.querySelectorAll('[data-waypoint]')];
  const update = () => {
    let index = 0;
    steps.forEach((step, i) => {
      if (step.getBoundingClientRect().top < innerHeight * 0.55) index = i;
    });
    points.forEach((point, i) => point.classList.toggle('current', i === index));
    steps.forEach((step, i) => step.classList.toggle('current', i === index));
  };
  let observer: IntersectionObserver | undefined;
  if (steps.length && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(update, { rootMargin: '-54% 0px -45% 0px' });
    steps.forEach((step) => observer!.observe(step));
    update();
  }
  dispose = () => {
    controller.abort();
    observer?.disconnect();
    background.forEach((el) => (el.inert = false));
  };
}
