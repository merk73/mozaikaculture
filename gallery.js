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
  function show(index) {
    current = (index + tiles.length) % tiles.length;
    const tile = tiles[current];
    const image = tile.querySelector('img');
    full.src = image.src;
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
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-photo-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-photo-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      show(current + (e.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-photo-open');
    full.removeAttribute('src');
    opener?.focus({preventScroll:true});
  });
})();
