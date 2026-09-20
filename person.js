(() => {
  const people = window.MOZAIKA_PEOPLES || [];
  const person = people.find(item => item.slug === document.body.dataset.personSlug);
  const research = window.MOZAIKA_RESEARCH?.[person?.slug];
  if (!person || !research) return;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  const sources = {
    people: {title: `${person.name}: история и культура`, publisher: 'Интерактивный атлас КМНС · научный коллектив', url: `https://www.atlaskmns.ru/page/ru/people_${research.atlas}.html`},
    language: {title: 'Язык и его современное состояние', publisher: 'Интерактивный атлас КМНС · лингвистический раздел', url: `https://www.atlaskmns.ru/page/ru/lang_${research.languageAtlas || research.atlas}.html`},
    festival: {title: 'Экспедиция Н. Б. Марголиной в Хабаровский край, 1990', publisher: 'Российский этнографический музей · экспедиционный архив', url: 'https://collection.ethnomuseum.ru/entity/ETNOEXP/30522'},
    sakhalin: {title: 'Нивхи и уйльта: единство людей и природы', publisher: 'Российский этнографический музей · музейный альбом', url: 'https://collection.ethnomuseum.ru/entity/ARTICLE/2250643'}
  };
  const sourceKeys = [...new Set(research.sections.map(section => section[2]))];
  const illustrations = (person.immersion || []).filter(item => item.image);
  const sections = research.sections.map(([title, text, source], i) => `
    <section class="people-chapter" id="chapter-${i + 1}" aria-labelledby="chapter-title-${i + 1}">
      <span class="chapter-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <div><h2 id="chapter-title-${i + 1}">${escape(title)}</h2><p>${escape(text)}</p>
      <a class="chapter-source" href="#source-${source}">Источник ${sourceKeys.indexOf(source) + 1} ${arrow}</a></div>
    </section>${illustrations[i] ? `<figure class="people-story-image"><img src="${escape(illustrations[i].image)}" alt="${escape(illustrations[i].title)}" loading="lazy" decoding="async" /><figcaption><span>${escape(illustrations[i].title)}</span><span>Иллюстрация проекта</span></figcaption></figure>` : ''}`).join('');
  const next = people[(people.indexOf(person) + 1) % people.length];
  const words = research.sections.reduce((sum, [, text]) => sum + text.split(/\s+/).length, 0) + person.summary.split(/\s+/).length;
  document.title = `${person.name}: история, язык и культура · Мозаика культур`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${person.name}: территория, история, традиции и язык. Материалы с научными и музейными источниками.`);
  document.querySelector('main').innerHTML = `
    <section class="people-intro" aria-labelledby="people-title">
      <div class="people-intro-copy">
        <a class="people-back" href="../index.html#atlas">${arrow} Все народы атласа</a>
        <p class="overline">${escape(person.region)}</p>
        <h1 id="people-title">${escape(person.name)}</h1>
        <p class="people-lead">${escape(person.lead)}</p>
        <div class="people-meta"><span>История · язык · культура</span><span>${Math.max(2, Math.ceil(words / 150))} мин чтения</span></div>
      </div>
      <figure class="people-intro-art"><img src="${escape(person.image)}" alt="Иллюстрация к материалу: ${escape(person.name)}" width="600" height="800" decoding="async" /><figcaption>Иллюстрация проекта</figcaption></figure>
    </section>
    <div class="people-reading">
      <aside class="people-index"><nav aria-label="Содержание статьи"><p class="overline">В этой истории</p>
        <a href="#overview">Коротко о народе</a>
        ${research.sections.map(([title], i) => `<a href="#chapter-${i + 1}"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${escape(title)}</a>`).join('')}
        <a href="#people-sources">Источники</a>
      </nav></aside>
      <div class="people-article">
        <section class="people-overview" id="overview" aria-labelledby="overview-title"><p class="overline">Знакомство</p><h2 id="overview-title">Коротко о народе</h2><p>${escape(person.summary)}</p>
          <dl><div><dt>Территория</dt><dd>${escape(person.region)}</dd></div><div><dt>Язык</dt><dd>${escape(person.language)}</dd></div></dl>
        </section>
        ${sections}
        <section class="people-references" id="people-sources" aria-labelledby="sources-title"><p class="overline">Читать дальше</p><h2 id="sources-title">Источники и материалы</h2>
          <p class="people-source-note">Исторические описания относятся к указанным в источниках эпохам. Переписная численность народа и число говорящих на его языке — разные показатели.</p>
          <ol>${sourceKeys.map(key => `<li id="source-${key}"><a href="${sources[key].url}" target="_blank" rel="noopener noreferrer"><span><strong>${escape(sources[key].title)}</strong><small>${escape(sources[key].publisher)}</small></span>${arrow}<span class="visually-hidden"> (в новой вкладке)</span></a></li>`).join('')}</ol>
          <p class="people-reviewed">Сверено по указанным материалам · 20 сентября 2026</p>
        </section>
      </div>
    </div>
    <footer class="people-next"><div><p class="overline">Продолжить знакомство</p><h2>${escape(next.name)}</h2><p>${escape(next.region)}</p></div><a class="button" href="${escape(next.slug)}.html">Следующая история ${arrow}</a><a class="people-return" href="../index.html#atlas">Вернуться в атлас</a></footer>`;
})();
