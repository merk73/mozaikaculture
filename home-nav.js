(() => {
  const header = document.querySelector(".site-refresh .site-header");
  if (!header) return;

  const toggle = header.querySelector("[data-menu-toggle]");
  const nav = header.querySelector(".main-nav");
  const account = header.querySelector("[data-mobile-account]");
  const desktopAccount = header.querySelector("[data-desktop-account]");
  const notice = header.querySelector("[data-account-notice]");
  const authButton = header.querySelector("[data-auth-open]");
  const mobile = window.matchMedia("(max-width: 760px)");

  const authModal = document.querySelector('[data-auth-modal]');
  const authHome = authModal?.parentElement;
  const authCard = authModal?.querySelector('.auth-card');
  if (authModal) {
    authModal.id = 'header-auth';
    account.setAttribute('aria-controls', 'header-auth');
    account.setAttribute('aria-expanded', 'false');
  }
  function placeAuth() {
    if (!authModal) return;
    (mobile.matches ? header : authHome).append(authModal);
    authCard.setAttribute('role', mobile.matches ? 'region' : 'dialog');
    if (mobile.matches) authCard.removeAttribute('aria-modal');
    else authCard.setAttribute('aria-modal', 'true');
  }
  placeAuth();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...nav.querySelectorAll('a')];
  const closeIcon = toggle.querySelector('svg').cloneNode(true);
  closeIcon.classList.add('menu-close-icon');
  closeIcon.querySelector('path').setAttribute('d', 'M6 6l12 12M6 18L18 6');
  toggle.append(closeIcon);
  let menuAnimation;
  let linkAnimations = [];

  function cancelMenuMotion() {
    menuAnimation?.cancel();
    menuAnimation = null;
    linkAnimations.forEach(animation => animation.cancel());
    linkAnimations = [];
    header.classList.remove('is-menu-closing');
  }
  function syncNavAccess() {
    nav.inert = mobile.matches && !header.classList.contains('is-menu-open');
  }
  syncNavAccess();
  function animateHeader(before, duration = 360) {
    cancelMenuMotion();
    if (!mobile.matches || !Number.isFinite(before) || reducedMotion.matches) return;
    const after = header.getBoundingClientRect().height;
    menuAnimation = header.animate(
      [{ height: before + 'px', overflow: 'clip' }, { height: after + 'px', overflow: 'clip' }],
      { duration, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
  }
  function closeAccount() { document.dispatchEvent(new Event('mozaika:auth-close')); }
  document.addEventListener('mozaika:auth-change', event => {
    if (event.detail.open) setMenu(false);
    header.classList.toggle('is-account-open', event.detail.open);
    account.setAttribute('aria-expanded', String(event.detail.open));
    animateHeader(event.detail.headerHeight);
  });
  function setMenu(open) {
    if (header.classList.contains('is-menu-open') === open) return;
    const before = header.getBoundingClientRect().height;
    const wasVisible = getComputedStyle(nav).display !== 'none';
    const previous = links.map(link => {
      const style = getComputedStyle(link);
      return { opacity: style.opacity, transform: style.transform };
    });
    cancelMenuMotion();
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    syncNavAccess();
    if (!mobile.matches || reducedMotion.matches) return;
    const after = header.getBoundingClientRect().height;
    // Retain the closing content for its exit; inert removes it from interaction immediately.
    header.classList.toggle('is-menu-closing', !open);
    const animation = header.animate(
      [{ height: before + 'px', overflow: 'clip' }, { height: after + 'px', overflow: 'clip' }],
      { duration: open ? 440 : 260, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
    menuAnimation = animation;
    linkAnimations = links.map((link, index) => link.animate([
      open && !wasVisible ? { opacity: 0, transform: 'translateY(8px)' } : previous[index],
      { opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(-4px)' }
    ], {
      duration: open ? 260 : 140,
      delay: open && !wasVisible ? 55 + index * 25 : 0,
      easing: 'cubic-bezier(.2, 0, 0, 1)', fill: 'both'
    }));
    animation.onfinish = () => {
      if (menuAnimation === animation) cancelMenuMotion();
    };
  }
  reducedMotion.addEventListener('change', () => {
    cancelMenuMotion();
    syncNavAccess();
  });

  toggle.addEventListener("click", () => {
    closeAccount();
    notice.hidden = true;
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
      if (mobile.matches) toggle.focus({ preventScroll: true });
    }
  });

  header.querySelector(".brand").addEventListener("click", () => { closeAccount(); setMenu(false); });

  function openAccount() {
    if (authModal?.classList.contains("is-open")) { closeAccount(); return; }
    setMenu(false);
    if (!authButton && desktopAccount.dataset.authUrl) {
      window.location.href = desktopAccount.dataset.authUrl;
      return;
    }
    // Reuse the existing authentication entry point when it is available.
    if (authButton && !authButton.hidden) {
      notice.hidden = true;
      authButton.click();
    } else {
      notice.hidden = !notice.hidden;
    }
  }
  account.addEventListener("click", openAccount);
  desktopAccount.addEventListener("click", openAccount);

  function syncAccountLabel() {
    const signedIn = authButton?.classList.contains("is-signed");
    desktopAccount.setAttribute("aria-label", signedIn ? "Открыть личный кабинет" : "Личный кабинет — вход");
    account.setAttribute("aria-label", signedIn ? "Открыть личный кабинет" : "Личный кабинет — вход");
  }
  if (authButton) new MutationObserver(syncAccountLabel).observe(authButton, { attributes: true, attributeFilter: ["class"] });
  syncAccountLabel();

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      setMenu(false);
      if (mobile.matches) closeAccount();
      notice.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
    notice.hidden = true;
  });

  header.addEventListener("focusout", (event) => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });

  mobile.addEventListener("change", () => {
    closeAccount();
    placeAuth();
    setMenu(false);
    cancelMenuMotion();
    syncNavAccess();
    notice.hidden = true;
  });

  document.querySelectorAll("[data-event-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("details");
      card.open = false;
      card.querySelector("summary").focus({ preventScroll: true });
      card.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  });

  function revealAnchor() {
    const id = window.location.hash.slice(1);
    const target = document.getElementById(id);
    const disclosure = target?.querySelector(".footer-disclosure");
    if (disclosure) disclosure.open = true;
  }
  window.addEventListener("hashchange", revealAnchor);
  revealAnchor();

  if (new URLSearchParams(window.location.search).get("auth") === "login" && authButton?.hidden) notice.hidden = false;
})();


// The portrait eases toward the scroll position only while the cover is visible.
(() => {
  const portrait = document.querySelector('[data-hero-portrait]');
  if (!portrait) return;
  const hero = portrait.closest('.hero');
  const enabled = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
  let visible = false, frame = 0, current = 0, target = 0, lastTime = 0, heroTop = 0;
  function render(time) {
    frame = 0;
    const delta = lastTime ? Math.min(time - lastTime, 32) : 16;
    lastTime = time;
    current += (target - current) * (1 - Math.exp(-delta / 85));
    if (Math.abs(target - current) < .05) current = target;
    portrait.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
    if (current !== target && visible && enabled.matches) frame = requestAnimationFrame(render);
    else lastTime = 0;
  }
  function update() {
    target = Math.min(Math.max(0, scrollY - heroTop) * .12, 80);
    if (!frame) frame = requestAnimationFrame(render);
  }
  function configure() {
    window.removeEventListener('scroll', update);
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    const active = visible && enabled.matches;
    portrait.classList.toggle('is-parallax-active', active);
    if (active) {
      heroTop = hero.getBoundingClientRect().top + scrollY;
      window.addEventListener('scroll', update, { passive: true });
      update();
    } else if (!enabled.matches) {
      current = target = 0;
      portrait.style.transform = '';
    }
  }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    configure();
  }).observe(hero);
  enabled.addEventListener('change', configure);
  window.addEventListener('resize', configure, { passive: true });
})();
