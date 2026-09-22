(() => {
  const tiles = [...document.querySelectorAll('.gallery-tile')];
  const dialog = document.querySelector('.photo-dialog');
  const full = dialog.querySelector('.photo-full');
  const caption = document.querySelector('#photo-caption');
  const event = document.querySelector('#photo-event');
  const download = dialog.querySelector('.photo-download');
  const count = dialog.querySelector('.photo-count');
  let current = 0;
  let opener;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false, photoAnimation, photoVersion = 0;
  function show(index) {
    current = (index + tiles.length) % tiles.length;
    const tile = tiles[current];
    const image = tile.querySelector('img');
    full.src = image.src;
    const version = ++photoVersion;
    full.decode().then(() => {
      if (version !== photoVersion || reduced.matches || !dialog.open) return;
      photoAnimation?.cancel();
      photoAnimation = full.animate([{opacity:.35},{opacity:1}],{duration:240,easing:'ease-out'});
    }).catch(() => {});
    full.alt = image.alt;
    caption.textContent = tile.dataset.caption;
    event.textContent = tile.dataset.event;
    download.href = image.src;
    download.download = image.getAttribute('src').replace('assets/events/', '').replaceAll('/', '-');
    count.textContent = `${current + 1} / ${tiles.length}`;
  }
  tiles.forEach((tile, index) => tile.addEventListener('click', () => {
    opener = tile;
    show(index);
    dialog.showModal();
    document.body.classList.add('has-photo-open');
  }));
  async function closePhoto() {
    if (closing) return;
    closing = true;
    if (!reduced.matches) {
      const animation = dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(6px)'}],{duration:160,easing:'ease-in'});
      await animation.finished;
    }
    dialog.close(); closing = false;
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
    opener?.focus({preventScroll:true});
  });
})();
