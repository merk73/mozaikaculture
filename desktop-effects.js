(() => {
  const desktop = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let cleanup, generation = 0, cancelIdle;
  function sync() {
    const token = ++generation;
    cancelIdle?.(); cancelIdle = null;
    cleanup?.(); cleanup = null;
    if (!desktop.matches || reduced.matches || navigator.connection?.saveData) return;
    const start = async () => {
      if (token !== generation) return;
      try {
        const {mountCulturalLight} = await import('./assets/shaders/cultural-light.js?v=20261009');
        if (token === generation) cleanup = mountCulturalLight(hero);
      } catch { /* The static artwork remains available without GPU support. */ }
    };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, {timeout:2500});
      cancelIdle = () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(start, 700);
      cancelIdle = () => clearTimeout(id);
    }
  }
  desktop.addEventListener('change', sync);
  reduced.addEventListener('change', sync);
  window.addEventListener('pagehide', () => { ++generation; cancelIdle?.(); cleanup?.(); });
  window.addEventListener('pageshow', event => { if (event.persisted) sync(); });
  sync();
})();
