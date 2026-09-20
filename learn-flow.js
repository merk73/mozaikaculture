(() => {
  const explorer = document.querySelector('[data-story-explorer]');
  if (!explorer) return;
  const people = window.MOZAIKA_PEOPLES || [];
  const select = explorer.querySelector('[data-people-select]');
  const portrait = explorer.querySelector('[data-story-portrait]');
  const question = explorer.querySelector('[data-story-question]');
  function updateStory() {
    const person = people.find(item => item.name === select.value);
    if (!person) return;
    portrait.src = person.image.replace(/^\.\.\//, '');
    portrait.alt = `Иллюстрация к истории народа: ${person.name}`;
    explorer.querySelector('[data-story-area]').textContent = person.areaLabel;
    explorer.querySelector('[data-story-link]').href = `peoples/${person.slug}.html`;
    question.open = false;
  }
  function turn(direction) {
    const index = people.findIndex(item => item.name === select.value);
    select.value = people[(index + direction + people.length) % people.length].name;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
  select.addEventListener('change', updateStory);
  explorer.querySelector('[data-story-prev]').addEventListener('click', () => turn(-1));
  explorer.querySelector('[data-story-next]').addEventListener('click', () => turn(1));
  updateStory();
})();
