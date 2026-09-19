(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const selector = [
    '.hero-copy', '.statement-copy', '.culture-divider', '.section-head',
    '.people-card', '.learn-card', '.atlas-quiz-cta', '.event-card',
    '.materials-grid', '.footer-disclosure', '.partner',
    '.article-hero-copy', '.article-hero-image', '.article-toc',
    '.article-image', '.article-image-grid', '.article-note', '.article-sources', '.article-next',
    '.person-copy', '.photo-placeholder', '.person-info aside', '.person-section-grid article',
    '.immersion-head', '.immersion-step', '.person-sources', '.quiz-surface', '.quiz-lock',
    '.section-heading', '.map-layout', '.library-copy', '.library-route'
  ].join(',');
  const seen = new WeakSet();
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduced.matches) return;
      const animation = entry.target.animate([
        { opacity: .35, transform: 'translate3d(0, 14px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], { duration: 820, delay: Math.min(index * 35, 105), easing: 'cubic-bezier(.22, 1, .36, 1)' });
      running.add(animation);
      animation.onfinish = animation.oncancel = () => running.delete(animation);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  function bind(root) {
    const nodes = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) nodes.unshift(root);
    nodes.forEach((node) => {
      // A group enters once, without stacking motion on its children.
      if (seen.has(node) || node.parentElement?.closest(selector)) return;
      seen.add(node);
      observer.observe(node);
    });
  }
  bind(document);
  const main = document.querySelector('main');
  if (main) new MutationObserver((records) => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node instanceof Element) bind(node);
    }));
  }).observe(main, { childList: true, subtree: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) running.forEach(animation => animation.cancel());
  });
})();
