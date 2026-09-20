(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  // Reveal small groups before they enter view. Large photos stay stationary.
  const selector = '.statement-copy,.section-head,.people-card,.learn-aside,.partner,.article-toc,.article-body h2,.article-note,.person-info aside,.person-section-grid article,.immersion-head,.section-heading,.library-copy';
  const seen = new WeakSet();
  const pending = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      entry.target.classList.add('soft-entered');
      pending.delete(entry.target);
    });
  }, { rootMargin: '0px 0px 72px 0px', threshold: 0 });
  function bind(root) {
    if (reduced.matches) return;
    const nodes = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) nodes.unshift(root);
    const candidates = nodes.filter(node => !seen.has(node));
    const positions = candidates.map(node => node.getBoundingClientRect());
    candidates.forEach((node, i) => {
      seen.add(node);
      if (positions[i].top < innerHeight + 80 || !positions[i].height) return;
      node.classList.add('soft-enter');
      pending.add(node);
      observer.observe(node);
    });
  }
  bind(document);
  const atlas = document.querySelector('[data-people-grid]');
  if (atlas) new MutationObserver(() => bind(atlas)).observe(atlas, { childList: true });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    pending.forEach(node => node.classList.add('soft-entered'));
    pending.clear();
  });
})();
