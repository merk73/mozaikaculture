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

  let menuAnimation;
  function setMenu(open) {
    if (header.classList.contains("is-menu-open") === open) return;
    const before = header.getBoundingClientRect().height;
    menuAnimation?.cancel();
    header.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    if (mobile.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const after = header.getBoundingClientRect().height;
      menuAnimation = header.animate([{ height: `${before}px`, overflow: 'clip' }, { height: `${after}px`, overflow: 'clip' }], { duration: 380, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
  }

  toggle.addEventListener("click", () => {
    notice.hidden = true;
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
      if (mobile.matches) toggle.focus({ preventScroll: true });
    }
  });

  header.querySelector(".brand").addEventListener("click", () => setMenu(false));

  function openAccount() {
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
    desktopAccount.textContent = signedIn ? "Кабинет" : "Войти";
    account.setAttribute("aria-label", signedIn ? "Открыть личный кабинет" : "Личный кабинет — вход");
  }
  if (authButton) new MutationObserver(syncAccountLabel).observe(authButton, { attributes: true, attributeFilter: ["class"] });
  syncAccountLabel();

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      setMenu(false);
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
    setMenu(false);
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


// Only the desktop cover image moves; the page retains native scrolling.
(() => {
  const portrait = document.querySelector('[data-hero-portrait]');
  if (!portrait) return;
  const hero = portrait.closest('.hero');
  const enabled = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
  let frame = 0;
  function render() {
    frame = 0;
    const y = Math.max(0, -hero.getBoundingClientRect().top);
    portrait.style.setProperty('--portrait-shift', `${enabled.matches ? Math.min(y * .16, 100) : 0}px`);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function configure() {
    window.removeEventListener('scroll', schedule);
    if (enabled.matches) window.addEventListener('scroll', schedule, { passive: true });
    schedule();
  }
  enabled.addEventListener('change', configure);
  configure();
})();
