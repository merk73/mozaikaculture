(() => {
  const flow = document.querySelector('[data-learn-flow]');
  if (!flow) return;
  const select = flow.querySelector('[data-people-select]');
  const stages = [...flow.querySelectorAll('[data-learn-stage]')];
  const navigation = [...flow.querySelectorAll('[data-learn-nav]')];
  const firstNext = stages[0].querySelector('[data-learn-next]');
  let step = 0, reached = 0;
  const placeholder = new Option('Выберите народ из списка', '', true, true);
  placeholder.disabled = true;
  select.prepend(placeholder);
  select.value = '';
  function show(index, focus = true) {
    step = index;
    reached = Math.max(reached, index);
    stages.forEach((stage, i) => stage.hidden = i !== index);
    navigation.forEach((button, i) => {
      button.disabled = i > reached;
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    if (focus) stages[index].querySelector('h3').focus({preventScroll:true});
  }
  select.addEventListener('change', () => {
    reached = 0;
    firstNext.disabled = !select.value;
    flow.querySelector('[data-learn-selected]').textContent = select.value;
    show(0, false);
  });
  flow.addEventListener('click', event => {
    const next = event.target.closest('[data-learn-next]');
    const back = event.target.closest('[data-learn-back]');
    const nav = event.target.closest('[data-learn-nav]');
    if (next && select.value) show(Math.min(2, step + 1));
    if (back) show(Math.max(0, step - 1));
    if (nav && !nav.disabled) show(Number(nav.dataset.learnNav));
    if (event.target.closest('[data-learn-restart]')) {
      select.value = '';
      firstNext.disabled = true;
      reached = 0;
      show(0);
    }
  });
  show(0, false);
})();
