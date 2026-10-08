(() => {
  const mobile = matchMedia('(max-width: 760px)');
  if (!mobile.matches) return;
  const root = document.documentElement;
  const waitForAtlas = root.classList.contains('home-page');
  root.classList.add('site-loading');
  let finished = false;
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
  // The homepage waits for every atlas portrait, even on a slow connection.
  // Other pages keep their existing timeout. Failed atlas scripts release the page.
  if (!waitForAtlas) timer = setTimeout(() => finish(false), 3500);
  else window.addEventListener('error', event => {
    const source = event.filename || event.target?.src || '';
    if (/\/(?:home-peoples|home-atlas)\.js(?:\?|$)/.test(source)) finish(false);
  }, true);
  mobile.addEventListener('change', () => { if (!mobile.matches) finish(false); });
  window.addEventListener('resize', () => {
    if (root.classList.contains('loader-morphing')) release();
  });
  async function ready() {
    if (finished) return;
    regions = [...document.querySelectorAll('body > :not(.site-loader):not(script)')].map(node => [node,node.inert]);
    regions.forEach(([node]) => { node.inert = true; });
    const logosReady = Promise.race([
      Promise.all([...document.querySelectorAll('.site-loader img,.site-header .brand img')].map(img => img.decode().catch(() => {}))),
      new Promise(resolve => setTimeout(resolve, 250)),
    ]);
    const atlas = document.querySelector('[data-people-grid]');
    if (waitForAtlas && atlas) {
      if (!atlas.dataset.atlasReady) await new Promise(resolve => {
        document.addEventListener('mozaika:atlas-ready', resolve, {once:true});
      });
      if (finished) return;
      // Eager loading avoids waiting for a scroll behind the overlay. Decoding
      // ensures all responsive pictures can be painted before the page opens.
      await Promise.all([...atlas.querySelectorAll('.card-portrait img')].map(img => {
        img.loading = 'eager';
        return img.decode().catch(() => {});
      }));
    }
    await logosReady;
    await finish();
  }
  if (document.readyState !== 'loading') ready();
  else document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') ready();
  }, {once:true});
})();
