(() => {
  const grid = document.querySelector('[data-people-grid]');
  const peoples = window.MOZAIKA_PEOPLES || [];
  if (!grid || !peoples.length) return;
  const buttons = document.querySelectorAll('[data-filter]');
  const preloadPortraits = matchMedia('(max-width: 760px)').matches && document.documentElement.classList.contains('site-loading');

  function render(filter = 'all') {
    const visible = filter === 'all' ? peoples : peoples.filter(person => person.area === filter);
    grid.innerHTML = visible.map((person, index) => {
      const mobileImage = person.image.replace('assets/people/', 'assets/home-mobile-v1/people/').replace(/\.png$/, '');
      return `
        <a class="people-card motion-reveal tilt-card" href="peoples/${person.slug}.html" style="--motion-delay: ${Math.min(index * 30, 210)}ms">
          <span class="card-hover-art" aria-hidden="true"></span><figure class="card-portrait" aria-hidden="true">
            <picture>
              <source media="(max-width: 760px)" type="image/webp" srcset="${mobileImage}-320.webp 320w, ${mobileImage}-512.webp 512w, ${mobileImage}-768.webp 768w" sizes="calc(72vw - 36px)" />
              <img src="${person.image}" alt="" width="1254" height="1254" loading="${preloadPortraits ? 'eager' : 'lazy'}" decoding="async" />
            </picture>
          </figure>
          <div class="card-meta"><span>${person.areaLabel}</span><span>${person.region}</span></div>
          <div class="card-body">
            <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
            <h3>${person.name}</h3><p>${person.cardText || person.summary}</p>
          </div>
          <span class="card-link">Открыть страницу</span>
        </a>`;
    }).join('');
    buttons.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const count = document.querySelector('[data-atlas-count]');
    if (count) count.textContent = `Показано ${visible.length} из ${peoples.length} народов`;
  }

  buttons.forEach(button => button.addEventListener('click', () => render(button.dataset.filter)));
  render();
  // Shared account code must not re-render the atlas when the external SDK arrives.
  grid.dataset.atlasReady = 'true';
  document.dispatchEvent(new Event('mozaika:atlas-ready'));
})();
