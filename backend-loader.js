// Account services must never block navigation or the guest quiz.
(() => {
  const config = window.MOZAIKA_CONFIG || {};
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    window.mozaikaBackendReady = Promise.resolve(null);
    return;
  }
  window.mozaikaBackendLoading = true;
  window.mozaikaBackendReady = new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      script.onload = script.onerror = null;
      window.mozaikaBackendLoading = false;
      resolve(window.supabase || null);
    };
    let timeout, started = false;
    script.onload = script.onerror = finish;
    const start = () => {
      if (started) return;
      started = true;
      document.removeEventListener('mozaika:page-ready', start);
      document.removeEventListener('click', onAccountClick, true);
      timeout = setTimeout(finish, 8000);
      document.head.append(script);
    };
    const onAccountClick = event => {
      if (event.target.closest('[data-auth-open], [data-mobile-account], [data-desktop-account]')) start();
    };
    document.addEventListener('click', onAccountClick, {capture: true});
    if (document.documentElement.classList.contains('site-loading')) {
      document.addEventListener('mozaika:page-ready', start, {once: true});
    } else if (window.requestIdleCallback) requestIdleCallback(start, {timeout: 1200});
    else setTimeout(start, 0);
  });
})();
