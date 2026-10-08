(() => {
  const grid = document.querySelector('[data-people-grid]');
  const peoples = window.MOZAIKA_PEOPLES || [];
  if (!grid || !peoples.length) return;
  const buttons = document.querySelectorAll('[data-filter]');
  const preloadPortraits = matchMedia('(max-width: 760px)').matches && document.documentElement.classList.contains('site-loading');
  const cards = new Map();
  let currentFilter;

  function render(filter = 'all') {
    if (filter === currentFilter) return;
    currentFilter = filter;
    const visible = filter === 'all' ? peoples : peoples.filter(person => person.area === filter);
    const nodes = visible.map((person, index) => {
      if (!cards.has(person.slug)) {
      const imageBase = person.image.replace(/-1024\.webp$/, '');
      const mobileImage = imageBase.replace('assets/site-images-v1/people/', 'assets/home-mobile-v1/people/');
      const template = document.createElement('template');
      template.innerHTML = `
        <a class="people-card motion-reveal tilt-card" href="peoples/${person.slug}.html" style="--motion-delay: ${Math.min(index * 30, 210)}ms">
          <span class="card-hover-art" aria-hidden="true" data-card-background-mobile="${person.cardBackgroundMobile}" style="--card-background: url('${person.cardBackground}'); --card-background-mobile: url('${person.cardBackgroundMobile}')"></span><figure class="card-portrait" aria-hidden="true">
            <picture>
              <source media="(max-width: 760px)" type="image/webp" srcset="${mobileImage}-320.webp 320w, ${mobileImage}-512.webp 512w, ${mobileImage}-768.webp 768w" sizes="calc(72vw - 36px)" />
              <source type="image/webp" srcset="${imageBase}-320.webp 320w, ${imageBase}-512.webp 512w, ${imageBase}-768.webp 768w, ${imageBase}-1024.webp 1024w" sizes="(min-width: 1200px) 25vw, (min-width: 761px) 33vw, 72vw" />
              <img src="${person.image}" alt="" width="1254" height="1254" loading="${preloadPortraits ? 'eager' : 'lazy'}" decoding="async" />
            </picture>
          </figure>
          <div class="card-meta"><span>${person.areaLabel}</span><span>${person.region}</span></div>
          <div class="card-body">
            <div class="card-title"><span class="card-number" aria-hidden="true">${String(peoples.indexOf(person) + 1).padStart(2, '0')}</span>
            <h3>${person.name}</h3></div><p>${person.cardText || person.summary}</p>
          </div>
          <span class="card-link">Открыть страницу</span>
        </a>`;
      cards.set(person.slug, template.content.firstElementChild);
      }
      const card = cards.get(person.slug);
      return card;
    });
    // Retain decoded images when changing filters.
    grid.replaceChildren(...nodes);
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
