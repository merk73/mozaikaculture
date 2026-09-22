(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  // Reveal small groups before they enter view. Large photos stay stationary.
  const selector = '.statement-copy,.section-head,.people-card,.learn-aside,.partner,.article-toc,.article-body h2,.article-body p,.article-note,.person-info aside,.person-section-grid article,.person-copy,.immersion-head,.section-heading,.library-copy,.event-card,.materials-copy,.materials-preview,.gallery-tile,.gallery-heading,.footer-brand,.footer-nav,.sources-list>a,.feedback-form,.quiz-surface';
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
  document.querySelectorAll('[data-people-grid],.quiz-options,.quiz-answers').forEach(container => {
    new MutationObserver(() => bind(container)).observe(container, { childList: true });
  });
  document.querySelectorAll('.event-card,.footer-disclosure,.article-toc').forEach(disclosure => {
    let animation;
    disclosure.addEventListener('toggle', () => {
      animation?.cancel();
      if (!disclosure.open || reduced.matches) return;
      if (disclosure.matches(".event-card") && matchMedia("(min-width:1024px)").matches) return;
      const content = disclosure.querySelector('.event-expanded,.footer-disclosure-content,nav');
      if (content) animation = content.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
    });
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    pending.forEach(node => node.classList.add('soft-entered'));
    pending.clear();
  });
})();
// Shared entry point for poster links and close controls.
window.mozaikaToggleEvent = async (card, open) => { card.open = open; };
