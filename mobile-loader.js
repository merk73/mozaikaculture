(() => {
  const mobile = matchMedia('(max-width: 760px)');
  if (!mobile.matches) return;
  const root = document.documentElement;
  root.classList.add('site-loading');
  let finished = false;
  let stopped = false;
  let timer;
  let regions = [];
  function release(reveal = false) {
    if (reveal) {
      root.classList.add('loader-menu-reveal');
      setTimeout(() => root.classList.remove('loader-menu-reveal'), 400);
    }
    root.classList.remove('site-loading');
    regions.forEach(([node, previous]) => { node.inert = previous; });
    document.querySelector('.site-loader')?.remove();
  }
  async function finish(animate = true) {
    if (finished) return;
    finished = true;
    stopped = true;
    clearTimeout(timer);
    const overlay = document.querySelector('.site-loader');
    const logo = overlay?.querySelector('img');
    const header = document.querySelector('.site-header');
    const target = header?.querySelector('.brand img');
    if (!overlay || !target || !animate || !mobile.matches) { release(); return; }
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await overlay.animate([{opacity:1},{opacity:0}],{duration:160}).finished;
      } else {
        const a = logo.getBoundingClientRect(), b = target.getBoundingClientRect(), h = header.getBoundingClientRect();
        const options = {duration:480,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'};
        overlay.querySelector('p').animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'});
        await Promise.all([
          logo.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${b.x-a.x}px,${b.y-a.y}px) scale(${b.width/a.width})`}],options).finished,
          overlay.querySelector('.site-loader-surface').animate([
            {clipPath:'inset(0px 0px 0px 0px round 0px)'},
            {clipPath:`inset(${h.top}px ${innerWidth-h.right}px ${innerHeight-h.bottom}px ${h.left}px round 30px)`}
          ],options).finished
        ]);
      }
    } finally { release(true); }
  }
  // A failed script, stalled connection or missing image must never lock the page.
  timer = setTimeout(() => finish(false), 45000);
  mobile.addEventListener('change', () => { if (!mobile.matches) finish(false); });
  document.addEventListener('DOMContentLoaded', async () => {
    if (finished) return;
    regions = [...document.querySelectorAll('body > :not(.site-loader):not(script)')].map(node => [node,node.inert]);
    regions.forEach(([node]) => { node.inert = true; });
    const images = [...document.images];
    const ordered = [
      ...images.filter(img => img.closest('[data-people-grid]') || /\/poster\./.test(img.src)),
      ...images
    ];
    const urls = [...new Set(ordered.map(img => img.currentSrc || img.src).filter(src => src && !src.startsWith('data:')))];
    let next = 0;
    const preload = src => new Promise(resolve => {
      const image = new Image();
      const timeout = setTimeout(done, 20000);
      function done() { clearTimeout(timeout); image.onload = image.onerror = null; resolve(); }
      image.onload = () => { image.decode().catch(() => {}).finally(done); };
      image.onerror = done;
      image.src = src;
    });
    await Promise.all(Array.from({length:6}, async () => {
      while (!stopped && next < urls.length) await preload(urls[next++]);
    }));
    await finish();
  }, {once:true});
})();
