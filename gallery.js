(() => {
  const tiles = [...document.querySelectorAll('.gallery-tile')];
  const dialog = document.querySelector('.photo-dialog');
  const full = dialog.querySelector('.photo-full');
  const caption = document.querySelector('#photo-caption');
  const event = document.querySelector('#photo-event');
  const download = dialog.querySelector('.photo-download');
  const count = dialog.querySelector('.photo-count');
  const stage = dialog.querySelector('.photo-stage');
  const status = document.querySelector('[data-photo-status]');
  let current = 0;
  let opener;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false, photoAnimation, photoVersion = 0;
  reduced.addEventListener('change', () => { if (reduced.matches) photoAnimation?.cancel(); });
  function show(index) {
    current = (index + tiles.length) % tiles.length;
    const tile = tiles[current];
    const image = tile.querySelector('img');
    full.src = image.src;
    const version = ++photoVersion;
    stage.setAttribute('aria-busy','true');
    status.textContent = 'Загружаем фото…';
    full.decode().then(() => {
      if (version !== photoVersion) return;
      stage.removeAttribute('aria-busy'); status.textContent = '';
      if (reduced.matches || !dialog.open) return;
      photoAnimation?.cancel();
      photoAnimation = full.animate([{opacity:.35},{opacity:1}],{duration:240,easing:'ease-out'});
    }).catch(() => {
      if (version !== photoVersion) return;
      stage.removeAttribute('aria-busy');
      status.textContent = 'Не удалось загрузить фото. Перейдите к следующему или попробуйте ещё раз.';
    });
    full.alt = image.alt;
    caption.textContent = tile.dataset.caption;
    event.textContent = tile.dataset.event;
    const original = image.dataset.originalSrc || image.getAttribute('src');
    download.href = original;
    download.download = original.replace('assets/events/', '').replaceAll('/', '-');
    count.textContent = `${current + 1} / ${tiles.length}`;
  }
  tiles.forEach((tile, index) => tile.addEventListener('click', () => {
    if (closing) return;
    opener = tile;
    show(index);
    dialog.showModal();
    document.body.classList.add('has-photo-open');
  }));
  async function closePhoto() {
    if (closing || !dialog.open) return;
    closing = true;
    try {
      if (!reduced.matches) {
        const animation = dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(6px)'}],{duration:160,easing:'ease-out'});
        await animation.finished;
      }
    } catch {} finally { dialog.close(); closing = false; }
  }
  dialog.querySelector('.photo-close').addEventListener('click', closePhoto);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePhoto(); });
  dialog.querySelector('[data-photo-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-photo-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      show(current + (e.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) closePhoto(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-photo-open');
    full.removeAttribute('src');
    photoVersion++; photoAnimation?.cancel();
    stage.removeAttribute('aria-busy'); status.textContent = '';
    opener?.focus({preventScroll:true});
  });
  let touch;
  stage.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && e.isPrimary) touch = {id:e.pointerId,x:e.clientX,y:e.clientY};
  });
  stage.addEventListener('pointerup', e => {
    if (touch?.id !== e.pointerId) return;
    const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
    touch = null;
    if (!closing && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { touch = null; });
})();
