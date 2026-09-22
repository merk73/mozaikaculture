(() => {
  const mobile = matchMedia('(max-width: 760px)');
  if (!mobile.matches) return;
  const root = document.documentElement;
  root.classList.add('site-loading');
  let finished = false;
  let stopped = false;
  let timer;
  let regions = [];
  let animations = [];
  let movingStatus;
  function release() {
    root.classList.remove('site-loading', 'loader-morphing');
    animations.forEach(animation => animation.cancel());
    movingStatus?.remove();
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
        animations = [overlay.animate([{opacity:1},{opacity:0}],{duration:160})];
      } else {
        const source = logo.getBoundingClientRect();
        const destination = target.getBoundingClientRect();
        const bounds = header.getBoundingClientRect();
        const finalStyle = getComputedStyle(header);
        const final = {top:bounds.top+'px',left:bounds.left+'px',width:bounds.width+'px',height:bounds.height+'px',borderRadius:finalStyle.borderRadius,backgroundColor:finalStyle.backgroundColor,borderColor:finalStyle.borderColor,boxShadow:finalStyle.boxShadow,backdropFilter:finalStyle.backdropFilter};
        const duration = 560;
        const motion = {duration,easing:'cubic-bezier(.22,.9,.3,1)',fill:'both'};
        // The real header is the loading surface: there is no replacement at landing.
        root.classList.add('loader-morphing');
        movingStatus = overlay.querySelector('p').cloneNode(true);
        movingStatus.className = 'loader-moving-status';
        movingStatus.style.marginTop = (source.height / 2 + 26) + 'px';
        movingStatus.setAttribute('aria-hidden', 'true');
        header.append(movingStatus);
        animations = [
          movingStatus.animate([{opacity:1,offset:0},{opacity:0,offset:.2},{opacity:0,offset:1}],{duration,fill:'both'}),
          header.animate([
            {top:'0px',left:'0px',width:innerWidth+'px',height:innerHeight+'px',borderRadius:'0px',transform:'none'},
            {top:final.top,left:final.left,width:final.width,height:final.height,borderRadius:final.borderRadius,transform:'none'}
          ],motion),
          header.animate([
            {backgroundColor:'#000',borderColor:'transparent',boxShadow:'inset 0 1px 0 transparent',backdropFilter:'blur(0px)',offset:0},
            {backgroundColor:'#000',borderColor:'transparent',boxShadow:'inset 0 1px 0 transparent',backdropFilter:'blur(0px)',offset:.55},
            {backgroundColor:final.backgroundColor,borderColor:final.borderColor,boxShadow:final.boxShadow,backdropFilter:final.backdropFilter,offset:1}
          ],{duration,easing:'linear',fill:'both'}),
          target.animate([{transform:'scale('+source.width/destination.width+')'},{transform:'scale(1)'}],motion),
          ...[...header.querySelectorAll('.mobile-header-button')].map(button => button.animate([
            {opacity:0,offset:0},
            {opacity:0,offset:.4,easing:'cubic-bezier(.22,1,.36,1)'},
            {opacity:1,offset:.9},
            {opacity:1,offset:1}
          ],{duration,easing:'linear',fill:'both'}))
        ];
        // Keep all pieces on exactly the same animation clock.
        const start = document.timeline.currentTime;
        animations.forEach(animation => { animation.startTime = start; });
      }
      await Promise.all(animations.map(animation => animation.finished));
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    } finally { release(); }
  }
  // A failed script, stalled connection or missing image must never lock the page.
  timer = setTimeout(() => finish(false), 45000);
  mobile.addEventListener('change', () => { if (!mobile.matches) finish(false); });
  window.addEventListener('resize', () => {
    if (root.classList.contains('loader-morphing')) release();
  });
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
