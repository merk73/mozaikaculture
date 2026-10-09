(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet(), images = new WeakSet(), pending = new Set();
  const selector = '.statement-copy,.section-head,.learn-aside,.partner,.article-note,.person-copy,.immersion-head,.section-heading,.library-copy,.materials-copy,.gallery-heading,.footer-brand,.footer-nav,.sources-list>a,.quiz-surface,.upcoming-heading,.report-heading,.files li,.people-card,.upcoming-card,.event-card,.gallery-tile,.materials-preview,.event-photo,.story-heading,.people-story';
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('soft-entered');
      pending.delete(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px 160px 0px' }) : null;

  function bindImage(img) {
    if (images.has(img) || img.closest('.photo-dialog,.site-loader,.brand,.report-brand')) return;
    images.add(img);
    // Native lazy images must not be decoded until their request has finished.
    // Decoding them in advance defeats lazy loading and competes with the cover.
    if (img.complete) return;
    img.classList.add('media-image', 'media-pending');
    const reveal = async () => {
      if (img.naturalWidth) try { await img.decode(); } catch {}
      img.classList.remove('media-pending');
    };
    img.addEventListener('load', reveal, { once: true });
    img.addEventListener('error', reveal, { once: true });
    if (img.complete) void reveal();
  }
  function bind(root) {
    const media = [...root.querySelectorAll('img')];
    if (root instanceof HTMLImageElement) media.unshift(root);
    media.forEach(bindImage);
    if (reduced.matches || !observer) return;
    const nodes = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) nodes.unshift(root);
    const candidates = nodes.filter(node => !seen.has(node));
    const positions = candidates.map(node => node.getBoundingClientRect());
    candidates.forEach((node, i) => {
      seen.add(node);
      if (!positions[i].height || positions[i].top < innerHeight + 160) return;
      // Reveal a row in reading order; nested elements share the parent's entrance.
      if (node.parentElement.closest('.soft-enter')) return;
      const siblings = [...node.parentElement.children].filter(child => child.matches(selector));
      const columns = innerWidth <= 760 ? 2 : 4;
      node.style.setProperty('--enter-delay', (siblings.indexOf(node) % columns) * 65 + 'ms');
      node.classList.add('soft-enter');
      pending.add(node);
      observer.observe(node);
    });
  }
  bind(document);
  const main = document.querySelector('main');
  if (main) new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node instanceof Element) bind(node);
    }));
  }).observe(main, { childList: true, subtree: true });

  // Keep content present throughout closing and allow rapid reversals.
  const controls = new Map();
  document.querySelectorAll('.event-card,.footer-disclosure,.article-toc').forEach(card => {
    const summary = card.querySelector(':scope > summary');
    if (!summary) return;
    let animation, desired = card.open;
    async function toggle(open) {
      if (!animation) desired = card.open;
      if (desired === open && !animation) return;
      desired = open;
      const start = card.getBoundingClientRect().height;
      animation?.cancel();
      animation = null;
      card.style.height = '';
      card.style.overflow = '';
      card.open = open;
      if (reduced.matches) return;
      const end = card.getBoundingClientRect().height;
      // Opening a desktop event also changes its grid span; only animate height.
      card.open = true;
      card.style.height = start + 'px';
      card.style.overflow = 'hidden';
      const next = card.animate([{ height: start + 'px' }, { height: end + 'px' }], {
        duration: open ? 340 : 240, easing: 'cubic-bezier(.22,1,.36,1)'
      });
      animation = next;
      try { await next.finished; } catch { return; }
      if (animation !== next) return;
      card.open = desired;
      card.style.height = '';
      card.style.overflow = '';
      animation = null;
    }
    controls.set(card, toggle);
    summary.addEventListener('click', event => {
      if (event.target.closest('a,button,input,select,textarea')) return;
      event.preventDefault();
      if (!animation) desired = card.open;
      void toggle(!desired);
    });
    const settle = () => {
      if (!animation) return;
      animation.cancel(); animation = null;
      card.open = desired; card.style.height = ''; card.style.overflow = '';
    };
    window.addEventListener('resize', settle, { passive: true });
    reduced.addEventListener('change', settle);
  });
  window.mozaikaToggleEvent = (card, open) => {
    if (controls.has(card)) return controls.get(card)(open);
    card.open = open;
    return Promise.resolve();
  };
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer?.disconnect();
    pending.forEach(node => node.classList.add('soft-entered'));
    pending.clear();
  });
})();

// Move only visible editorial images; preserve their independent hover transform.
(() => {
  if (!('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const images = [...document.querySelectorAll('.event-cover img,.materials-preview img,.people-story-image img')];
  let frame = 0;
  function draw() {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    const limit = innerWidth <= 760 ? 6 : 12;
    visible.forEach(img => {
      const rect = img.parentElement.closest('figure,summary,.materials-preview')?.getBoundingClientRect() || img.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
      img.style.setProperty('--media-parallax-y', (progress * limit).toFixed(2) + 'px');
    });
  }
  function schedule() { if (!frame && visible.size && !reduced.matches && !document.hidden) frame = requestAnimationFrame(draw); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    schedule();
  }, {rootMargin:'80px'});
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    images.forEach(img => {
      if (reduced.matches) { observer.unobserve(img); img.classList.remove('media-parallax'); img.style.removeProperty('--media-parallax-y'); }
      else { img.classList.add('media-parallax'); observer.observe(img); }
    });
    if (reduced.matches) visible.clear();
    schedule();
  }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', sync);
  sync();
})();
