(() => {
  const mobile = matchMedia('(max-width: 760px)');
  const activate = node => node.classList.add('is-media-near');
  // CSS backgrounds do not support native loading="lazy".
  const targets = document.querySelectorAll('.atlas-quiz-cta,.event-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '400px' });
    targets.forEach(node => observer.observe(node));
  } else targets.forEach(activate);

  // Even inside a closed <details>, video posters trigger downloads.
  document.querySelectorAll('.event-card').forEach(card => {
    function loadPosters() {
      if (!card.open) return;
      card.querySelectorAll('video[data-poster]').forEach(video => {
        if (!video.hasAttribute('poster')) video.poster = mobile.matches ? video.dataset.mobilePoster : video.dataset.poster;
      });
    }
    card.addEventListener('toggle', loadPosters);
    loadPosters();
  });
})();
