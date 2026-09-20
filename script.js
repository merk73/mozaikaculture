const peoples = window.MOZAIKA_PEOPLES || [];

const grid = document.querySelector("[data-people-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const tabs = document.querySelector("[data-people-tabs]");
const peopleSelect = document.querySelector("[data-people-select]");
const panel = {
  region: document.querySelector("[data-panel-region]"),
  type: document.querySelector("[data-panel-type]"),
  title: document.querySelector("[data-panel-title]"),
  text: document.querySelector("[data-panel-text]"),
  facts: document.querySelector("[data-panel-facts]"),
  quizQuestion: document.querySelector("[data-quiz-question]"),
  quizOptions: document.querySelector("[data-quiz-options]"),
  quizResult: document.querySelector("[data-quiz-result]"),
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");
const isHomePage = document.body.classList.contains("home-page");
let motionObserver = null;

function shuffleOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function addMotionTargets(root = document) {
  const targets = [
    ".statement-copy",
    ".statement-visual",
    ".section-head",
    ".atlas-tools",
    ".people-grid",
    ".learn-grid",
    ".learn-aside",
    ".knowledge-panel",
    ".quiz-cta-shell",
    ".online-quiz-cta",
    ".articles .section-head",
    ".article-preview",
    ".article-hero-copy",
    ".article-body > p",
    ".article-body h2",
    ".article-image",
    ".article-image-grid",
    ".article-note",
    ".article-sources",
    ".article-source-list a",
    ".event-feature",
    ".event-story",
    ".event-gallery",
    ".event-program article",
    ".event-photo",
    ".feedback-grid",
    ".feedback-grid > div",
    ".feedback-form",
    ".sources-layout",
    ".sources-heading",
    ".sources-list a",
    ".site-footer",
    ".fact-list div",
    ".quiz-options button",
  ];

  root.querySelectorAll(targets.join(",")).forEach((node, index) => {
    node.classList.add("motion-reveal");
    if (!node.style.getPropertyValue("--motion-delay")) {
      node.style.setProperty("--motion-delay", `${Math.min(index * 24, 180)}ms`);
    }
  });
}

function hydrateMotion(root = document) {
  // Keep the home page in normal document flow without nested reveal effects.
  if (document.body.classList.contains("site-refresh")) return;
  addMotionTargets(root);
  root.querySelectorAll([
    ".article-preview",
    ".online-quiz-cta",
    ".knowledge-panel",
    ".event-program article",
    ".event-photo",
    ".photo-placeholder.has-image",
  ].join(",")).forEach((node) => {
    node.classList.add("tilt-card");
  });

  const items = root.querySelectorAll(".motion-reveal:not([data-motion-bound])");

  items.forEach((item) => {
    item.dataset.motionBound = "true";
    if (prefersReducedMotion.matches || !motionObserver) {
      item.classList.add("is-visible");
      return;
    }
    motionObserver.observe(item);
  });
}

function initTiltCards(root = document) {
  if (document.body.classList.contains("site-refresh")) return;
  if (prefersReducedMotion.matches || coarsePointer.matches) return;
  const cards = root.querySelectorAll(".tilt-card:not([data-tilt-bound])");

  cards.forEach((card) => {
    card.dataset.tiltBound = "true";
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    let tiltFrame = 0;

    card.addEventListener("pointermove", (event) => {
      const { clientX, clientY } = event;

      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
      }

      tiltFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${x * 4.4}deg`);
        card.style.setProperty("--tilt-y", `${y * -4.4}deg`);
        tiltFrame = 0;
      });
    });
    card.addEventListener("pointerleave", () => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
      }

      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion.matches || coarsePointer.matches) return;
  let heroFrame = 0;

  hero.addEventListener("pointermove", (event) => {
    const { clientX, clientY } = event;

    if (heroFrame) {
      cancelAnimationFrame(heroFrame);
    }

    heroFrame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--hero-shift-x", `${x * -28}px`);
      hero.style.setProperty("--hero-shift-y", `${y * -18}px`);
      hero.style.setProperty("--hero-tilt-x", `${y * 3.4}deg`);
      hero.style.setProperty("--hero-tilt-y", `${x * -4.8}deg`);
      heroFrame = 0;
    });
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    if (heroFrame) {
      cancelAnimationFrame(heroFrame);
      heroFrame = 0;
    }

    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
    hero.style.setProperty("--hero-tilt-x", "0deg");
    hero.style.setProperty("--hero-tilt-y", "0deg");
  });
}

function initMobileHeaderCollapse() {
  if (document.body.classList.contains("site-refresh")) return;
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY + 4;
    const scrollingUp = currentY < lastScrollY - 4;
    const collapseStart = 150;

    if (!mobileQuery.matches || currentY < collapseStart || scrollingUp) {
      document.documentElement.classList.remove("mobile-header-condensed");
    } else if (scrollingDown) {
      document.documentElement.classList.add("mobile-header-condensed");
    }

    lastScrollY = currentY;
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  mobileQuery.addEventListener?.("change", requestUpdate);
  requestUpdate();
}

function initMotion() {
  if (document.body.classList.contains("site-refresh")) return;
  document.documentElement.classList.add("motion-ready");

  if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
    motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            motionObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 48% 0px", threshold: 0.01 },
    );
  }

  hydrateMotion(document);
  initTiltCards(document);
  initHeroParallax();
  initMobileHeaderCollapse();
}

function renderCards(filter = "all") {
  if (!grid) return;
  const visible = filter === "all" ? peoples : peoples.filter((item) => item.area === filter);

  grid.innerHTML = visible
    .map(
      (person, index) => `
        <a class="people-card motion-reveal tilt-card" href="peoples/${person.slug}.html" style="--motion-delay: ${Math.min(index * 30, 210)}ms">
          <span class="card-hover-art" aria-hidden="true"></span><figure class="card-portrait" aria-hidden="true">
            <img src="${person.image}" alt="" loading="lazy" decoding="async" />
          </figure>
          <div class="card-meta">
            <span>${person.areaLabel}</span>
            <span>${person.region}</span>
          </div>
          <div class="card-body">
            <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${person.name}</h3>
            <p>${person.cardText || person.summary}</p>
          </div>
          <span class="card-link">Открыть страницу</span>
        </a>
      `,
    )
    .join("");

  hydrateMotion(grid);
  initTiltCards(grid);
}

function renderTabs() {
  if (peopleSelect) {
    peopleSelect.replaceChildren(...peoples.map((person) => new Option(person.name, person.name)));
  }
  if (!tabs) return;
  tabs.innerHTML = peoples
    .map(
      (person, index) => `
        <button class="${index === 0 ? "is-active" : ""}" type="button" data-person="${person.name}">
          ${person.name}
        </button>
      `,
    )
    .join("");
}

function setKnowledge(personName) {
  if (!panel.title || !peoples.length) return;
  const person = peoples.find((item) => item.name === personName) || peoples[0];

  panel.region.textContent = person.region;
  panel.type.textContent = person.language;
  panel.title.textContent = person.name;
  panel.text.textContent = person.summary;
  panel.facts.innerHTML = [
    ["Среда", person.areaLabel],
    ["Фокус", person.focus],
    ["Важно", person.facts.join(" · ")],
  ]
    .map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`)
    .join("");

  panel.quizQuestion.textContent = person.quiz.question;
  panel.quizResult.textContent = "";
  panel.quizOptions.innerHTML = shuffleOptions(person.quiz.options)
    .map((option) => `<button type="button" data-answer="${option}">${option}</button>`)
    .join("");

  panel.quizOptions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.answer === person.quiz.answer;
      panel.quizOptions.querySelectorAll("button").forEach((item) => {
        item.classList.remove("is-correct", "is-wrong");
        item.disabled = true;
      });
      button.classList.add(isCorrect ? "is-correct" : "is-wrong");
      panel.quizResult.textContent = isCorrect
        ? "Верно. Это хороший вход в тему."
        : `Почти. Правильный ответ: ${person.quiz.answer}.`;
    });
  });

  tabs?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.person === person.name);
  });

  if (peopleSelect) peopleSelect.value = person.name;

  hydrateMotion(panel.facts);
  hydrateMotion(panel.quizOptions);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCards(button.dataset.filter);
  });
});

initMotion();
renderCards();
renderTabs();
setKnowledge(peoples[0]?.name);
peopleSelect?.addEventListener("change", () => setKnowledge(peopleSelect.value));

if (tabs) {
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-person]");
    if (!button) return;
    setKnowledge(button.dataset.person);
  });
}

const authModal = document.querySelector("[data-auth-modal]");
const authCard = authModal?.querySelector(".auth-card") || null;
const authSteps = authModal ? Array.from(authModal.querySelectorAll("[data-auth-step]")) : [];
const authTitle = authModal?.querySelector("[data-auth-title]") || null;
const authNote = authModal?.querySelector("[data-auth-note]") || null;
const authProgress = authModal?.querySelector("[data-auth-progress]") || null;
const authProgressDots = authModal?.querySelector("[data-auth-progress-dots]") || null;
const authProgressLabel = authModal?.querySelector("[data-auth-progress-label]") || null;
const authBackButton = authModal?.querySelector("[data-auth-back]") || null;
const authChooseButtons = document.querySelectorAll("[data-auth-choose]");
const authMessage = document.querySelector("[data-auth-message]");
const authOpenButtons = document.querySelectorAll("[data-auth-open]");
const authCloseButtons = document.querySelectorAll("[data-auth-close]");
const authNameForm = authModal?.querySelector('[data-auth-step="name"]') || null;
const authEmailForm = authModal?.querySelector('[data-auth-step="email"]') || null;
const authPasswordForm = authModal?.querySelector('[data-auth-step="password"]') || null;
const authCodeForm = authModal?.querySelector('[data-auth-step="code"]') || null;
const authCodeInputs = authCodeForm ? Array.from(authCodeForm.querySelectorAll(".auth-code input")) : [];
const authResendButton = authCodeForm?.querySelector("[data-auth-resend]") || null;
const passwordCaption = authModal?.querySelector("[data-password-caption]") || null;
const passwordSubmit = authModal?.querySelector("[data-password-submit]") || null;
const authDoneTitle = authModal?.querySelector("[data-auth-done-title]") || null;
const authDoneText = authModal?.querySelector("[data-auth-done-text]") || null;
const profileModal = document.querySelector("[data-profile-modal]");
const profileCloseButtons = document.querySelectorAll("[data-profile-close]");
const profileAvatar = document.querySelector("[data-profile-avatar]");
const profileRole = document.querySelector("[data-profile-role]");
const profileName = document.querySelector("[data-profile-name]");
const profileEmail = document.querySelector("[data-profile-email]");
const profileQuizResult = document.querySelector("[data-profile-quiz-result]");
const profileLogout = document.querySelector("[data-profile-logout]");
const quizGateLinks = document.querySelectorAll("[data-quiz-gate]");
const passwordToggle = document.querySelector("[data-password-toggle]");
const feedbackForm = document.querySelector("[data-feedback-form]");
const feedbackMessage = document.querySelector("[data-feedback-message]");
const supabaseConfig = window.MOZAIKA_CONFIG || {};
const hasSupabaseConfig = Boolean(supabaseConfig.SUPABASE_URL && supabaseConfig.SUPABASE_ANON_KEY);
// UI preview mode (?auth-demo=1): walks through the auth flow without a backend.
const authDemoMode = new URLSearchParams(window.location.search).get("auth-demo") === "1";

function createDemoSupabaseClient() {
  const demoUser = () => ({
    id: "demo-user",
    email: authFormEmail || "student@example.ru",
    user_metadata: { display_name: authFormName || "Студент" },
  });
  const emptyTable = () => ({
    select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
    insert: async () => ({ error: null }),
  });
  return {
    from: emptyTable,
    auth: {
      async getSession() { return { data: { session: null }, error: null }; },
      async onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
      async signUp({ email }) { return { data: { session: null, user: { id: "demo-user", email } }, error: null }; },
      async signInWithPassword() { return { data: {}, error: { message: "Email not confirmed" } }; },
      async verifyOtp() { return { data: { session: { user: demoUser() }, user: demoUser() }, error: null }; },
      async resend() { return { data: {}, error: null }; },
      async signOut() { return { error: null }; },
    },
  };
}

const supabaseClient =
  window.supabase && window.supabase.createClient && hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.SUPABASE_URL, supabaseConfig.SUPABASE_ANON_KEY)
    : authDemoMode
      ? createDemoSupabaseClient()
      : null;
let authMode = null;
let authStep = "choice";
let loginNeedsCode = false;
let authFormEmail = "";
let authFormName = "";
let currentUserEmail = "";
let currentUserId = null;
let currentUserName = "";
let authRequestPending = false;
let resendAvailableAt = 0;
let resendTimerId = 0;
const AUTH_STEP_ORDER = {
  register: ["name", "email", "password", "code"],
  login: ["email", "password"],
};
const RESEND_COOLDOWN_SECONDS = 30;
const netlifyFormEndpoint = "/";
const authRedirectPath = window.location.pathname.startsWith("/mozaikaculture/") ? "/mozaikaculture/" : "/";
const authRedirectUrl = new URL(authRedirectPath, window.location.origin).href;
const quizIntentKey = "mozaikaQuizAfterAuth";
const ceoEmail = "habkraihistory@gmail.com";
const goldRingEmails = new Set(["habkraihistory@gmail.com", "yakovenkok2000@gmail.com"]);

function markQuizIntent() {
  try {
    sessionStorage.setItem(quizIntentKey, "1");
  } catch (_error) {
    // Session storage can be unavailable in strict privacy modes.
  }
}

function hasQuizIntent() {
  try {
    return sessionStorage.getItem(quizIntentKey) === "1";
  } catch (_error) {
    return false;
  }
}

function clearQuizIntent() {
  try {
    sessionStorage.removeItem(quizIntentKey);
  } catch (_error) {
    // No-op.
  }
}

function redirectToQuizIfRequested() {
  if (!currentUserId || !hasQuizIntent()) return false;
  clearQuizIntent();
  window.location.href = "quiz.html";
  return true;
}

function getUserDisplayName(user) {
  const metadata = user?.user_metadata || {};
  const name = metadata.display_name || metadata.full_name || metadata.name || "";
  return String(name).trim();
}

function getFallbackName(email) {
  return String(email || "").split("@")[0] || "Пользователь";
}

function setCurrentUser(user) {
  if (!user) {
    currentUserEmail = "";
    currentUserId = null;
    currentUserName = "";
    return;
  }

  currentUserEmail = user?.email || "";
  currentUserId = user?.id || null;
  currentUserName = getUserDisplayName(user) || getFallbackName(currentUserEmail);
}

function getProfileLetter() {
  return (currentUserName || currentUserEmail || "М").trim().charAt(0).toUpperCase();
}

async function requestAuth(mode, email, password, name = "") {
  if (!supabaseClient) {
    throw new Error("Регистрация временно недоступна. Попробуйте позже.");
  }

  if (mode === "register") {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: authRedirectUrl,
        data: {
          display_name: name,
          full_name: name,
        },
      },
    });
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

function setAuthMessage(text, type = "info") {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.dataset.type = type;
}

function getFriendlyAuthError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("rate limit") || message.includes("too many") || message.includes("email")) {
    return "Слишком много попыток регистрации. Подождите немного и попробуйте снова.";
  }

  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return "Неверная почта или пароль.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Не удалось подключиться к серверу регистрации. Проверьте интернет или попробуйте позже.";
  }

  return error?.message || "Не удалось выполнить вход.";
}

function getAuthSteps() {
  const steps = [...(AUTH_STEP_ORDER[authMode] || [])];
  if (authMode === "login" && loginNeedsCode) steps.push("code");
  return steps;
}

function getAuthStepCopy() {
  switch (authStep) {
    case "choice":
      return {
        title: "Мозаика зовёт",
        note: "Войдите или создайте кабинет, чтобы сохранять материалы, возвращаться к изучению и получать обновления проекта.",
      };
    case "name":
      return {
        title: "Как вас зовут?",
        note: "Представьтесь — так к вам будет обращаться личный кабинет.",
      };
    case "email":
      return authMode === "register"
        ? {
            title: "Ваша почта",
            note: "На неё мы отправим код подтверждения, чтобы защитить аккаунт.",
          }
        : {
            title: "С возвращением!",
            note: "Укажите почту, с которой вы регистрировались в «Мозаике».",
          };
    case "password":
      return authMode === "register"
        ? {
            title: "Придумайте пароль",
            note: `Минимум 6 символов. Код подтверждения прилетит на ${authFormEmail}.`,
          }
        : {
            title: "Введите пароль",
            note: `Пароль от аккаунта ${authFormEmail}.`,
          };
    case "code":
      return {
        title: "Код из письма",
        note: `Мы отправили шестизначный код на ${authFormEmail}. Введите его, чтобы ${authMode === "register" ? "завершить регистрацию" : "подтвердить вход"}.`,
      };
    case "done":
      return { title: "Готово!", note: "" };
    default:
      return { title: "", note: "" };
  }
}

function updateAuthChrome() {
  const steps = getAuthSteps();
  const index = steps.indexOf(authStep);
  const onFlowStep = index >= 0;

  if (authBackButton) authBackButton.hidden = !onFlowStep;
  authCard?.classList.toggle("has-back", onFlowStep);

  if (authProgress && authProgressDots && authProgressLabel) {
    authProgress.hidden = !onFlowStep;
    if (onFlowStep) {
      authProgressLabel.textContent = `Шаг ${index + 1} из ${steps.length}`;
      authProgressDots.innerHTML = steps
        .map((stepName, stepIndex) => {
          const state = stepIndex < index ? "is-done" : stepIndex === index ? "is-current" : "";
          return `<span class="auth-progress-dot ${state}"></span>`;
        })
        .join("");
    }
  }

  const copy = getAuthStepCopy();
  if (authTitle) authTitle.textContent = copy.title;
  if (authNote) {
    authNote.textContent = copy.note;
    authNote.hidden = !copy.note;
  }

  const passwordInput = authPasswordForm?.querySelector('input[name="password"]');
  const isRegister = authMode === "register";
  if (passwordInput) {
    passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
    passwordInput.placeholder = isRegister ? "Минимум 6 символов" : "Пароль от аккаунта";
  }
  if (passwordCaption) passwordCaption.textContent = isRegister ? "Придумайте пароль" : "Ваш пароль";
  if (passwordSubmit) {
    delete passwordSubmit.dataset.idleLabel;
    passwordSubmit.textContent = isRegister ? "Создать аккаунт" : "Войти";
  }
}

function setAuthStep(step, options = {}) {
  if (!authModal) return;
  authStep = step;
  let activeStep = null;
  authSteps.forEach((element) => {
    const isActive = element.dataset.authStep === step;
    element.hidden = !isActive;
    element.classList.toggle("is-active", isActive);
    element.classList.remove("is-entering");
    if (isActive) {
      activeStep = element;
      // Restart the entrance animation for the freshly shown step.
      void element.offsetWidth;
      element.classList.add("is-entering");
    }
  });
  updateAuthChrome();
  if (options.message !== undefined) {
    setAuthMessage(options.message.text || "", options.message.type || "info");
  } else {
    setAuthMessage("");
  }
  const focusTarget =
    activeStep?.querySelector("input") ||
    activeStep?.querySelector("button:not([data-auth-close]):not([data-auth-back])");
  window.setTimeout(() => focusTarget?.focus({ preventScroll: true }), authModal.classList.contains("is-open") ? 60 : 430);
}

function startAuthFlow(mode) {
  authMode = mode;
  loginNeedsCode = false;
  setAuthStep(getAuthSteps()[0]);
}

function resetAuthFlow() {
  authMode = null;
  loginNeedsCode = false;
  authFormEmail = "";
  authFormName = "";
  [authNameForm, authEmailForm, authPasswordForm, authCodeForm].forEach((form) => form?.reset());
  clearCodeInputs();
  stopResendCooldown();
  setAuthStep("choice");
}

function goAuthBack() {
  const steps = getAuthSteps();
  const index = steps.indexOf(authStep);
  if (index > 0) {
    setAuthStep(steps[index - 1]);
  } else if (index === 0) {
    authMode = null;
    setAuthStep("choice");
  }
}

function openAuth(startMode = null) {
  if (!supabaseClient || !authModal) return;
  if (currentUserId) {
    openProfile();
    return;
  }
  // The handler may be called directly as a click listener: ignore the event object.
  const mode = startMode === "login" || startMode === "register" ? startMode : null;
  resetAuthFlow();
  if (mode) startAuthFlow(mode);
  if (authDemoMode && !hasSupabaseConfig) {
    setAuthMessage("Демо-режим предпросмотра: данные никуда не отправляются.", "info");
  }
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("modal-open");
  const focusTarget = authStep === "choice"
    ? authModal.querySelector('[data-auth-step="choice"] .auth-option')
    : authModal.querySelector(`[data-auth-step="${authStep}"] input`);
  window.setTimeout(() => focusTarget?.focus({ preventScroll: true }), 430);
}

function closeAuth() {
  if (!authModal) return;
  const wasOpen = authModal.classList.contains("is-open");
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("modal-open");
  if (wasOpen) {
    window.setTimeout(() => {
      if (!authModal.classList.contains("is-open")) resetAuthFlow();
    }, 540);
  }
}

function openProfile() {
  if (!profileModal || !currentUserId) return;
  closeAuth();
  profileModal.hidden = false;
  profileModal.classList.add("is-open");
  profileModal.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("profile-open");
  document.documentElement.classList.add("modal-open");
  renderProfile();
  loadProfileQuizResult();
}

function closeProfile() {
  if (!profileModal) return;
  profileModal.classList.remove("is-open");
  profileModal.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("profile-open");
  document.documentElement.classList.remove("modal-open");
  window.setTimeout(() => {
    if (!profileModal.classList.contains("is-open")) profileModal.hidden = true;
  }, 540);
}

function getCodeValue() {
  return authCodeInputs.map((input) => input.value).join("");
}

function clearCodeInputs() {
  authCodeInputs.forEach((input) => {
    input.value = "";
    input.classList.remove("is-filled");
  });
}

function updateResendButton() {
  if (!authResendButton) return;
  const remaining = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
  if (remaining > 0) {
    authResendButton.disabled = true;
    authResendButton.textContent = `Отправить код повторно можно через ${remaining} c`;
  } else {
    authResendButton.disabled = false;
    authResendButton.textContent = "Отправить код повторно";
  }
}

function startResendCooldown() {
  resendAvailableAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
  window.clearInterval(resendTimerId);
  updateResendButton();
  resendTimerId = window.setInterval(() => {
    updateResendButton();
    if (Date.now() >= resendAvailableAt) {
      window.clearInterval(resendTimerId);
      resendTimerId = 0;
    }
  }, 1000);
}

function stopResendCooldown() {
  window.clearInterval(resendTimerId);
  resendTimerId = 0;
  resendAvailableAt = 0;
  updateResendButton();
}

function setAuthPending(pending, busyText = "") {
  authRequestPending = pending;
  if (!authModal) return;
  const forms = [authNameForm, authEmailForm, authPasswordForm, authCodeForm];
  forms.forEach((form) => {
    const submit = form?.querySelector(".auth-submit");
    if (!submit) return;
    submit.disabled = pending;
    if (!submit.dataset.idleLabel) submit.dataset.idleLabel = submit.textContent;
    if (form.hidden) return;
    submit.textContent = pending && busyText ? busyText : submit.dataset.idleLabel || submit.textContent;
  });
}

function finishAuth(user, mode) {
  setCurrentUser(user);
  updateAuthState();
  stopResendCooldown();
  clearCodeInputs();
  setAuthStep("done", {
    message: { text: mode === "register" ? "Аккаунт создан. Вход выполнен." : "Готово. Вы вошли в личный кабинет.", type: "success" },
  });
  if (authDoneTitle) authDoneTitle.textContent = mode === "register" ? "Аккаунт создан!" : "С возвращением!";
  if (authDoneText) {
    authDoneText.textContent = mode === "register"
      ? "Почта подтверждена — личный кабинет «Мозаики культур» готов к работе."
      : "Вы вошли в личный кабинет «Мозаики культур».";
  }
  window.setTimeout(() => {
    if (!redirectToQuizIfRequested()) openProfile();
  }, 1100);
}

function updateAuthState() {
  const signedIn = Boolean(currentUserEmail);

  authOpenButtons.forEach((button) => {
    button.hidden = !supabaseClient;
    const isHeroButton = button.classList.contains("button");
    button.textContent = signedIn ? currentUserEmail : isHeroButton ? "Зарегистрироваться" : "Войти";
    button.classList.toggle("is-signed", signedIn);
  });
}

function renderProfile() {
  if (profileAvatar) profileAvatar.textContent = getProfileLetter();
  if (profileAvatar) {
    profileAvatar.classList.toggle("has-gold-ring", goldRingEmails.has(currentUserEmail.toLowerCase()));
  }
  if (profileRole) {
    profileRole.hidden = currentUserEmail.toLowerCase() !== ceoEmail;
  }
  if (profileName) profileName.textContent = currentUserName || getFallbackName(currentUserEmail);
  if (profileEmail) profileEmail.textContent = currentUserEmail;
  if (profileQuizResult) {
    profileQuizResult.innerHTML = `
      <strong>Загружаю...</strong>
      <p>Проверяю сохраненный результат квиза.</p>
    `;
  }
}

function renderProfileQuizEmpty(text = "После прохождения квиза здесь появятся баллы и процент.") {
  if (!profileQuizResult) return;
  profileQuizResult.innerHTML = `
    <strong>Пока нет результата</strong>
    <p>${text}</p>
  `;
}

async function loadProfileQuizResult() {
  if (!supabaseClient || !currentUserId || !profileQuizResult) return;

  const { data, error } = await supabaseClient
    .from("quiz_results")
    .select("score,total,percent,created_at")
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (error) {
    renderProfileQuizEmpty("Результат появится здесь после прохождения квиза.");
    return;
  }

  if (!data) {
    renderProfileQuizEmpty();
    return;
  }

  const total = Number(data.total) || 15;
  const score = Number(data.score) || 0;
  const percent = Number(data.percent) || Math.round((score / total) * 100);
  const date = data.created_at ? new Date(data.created_at).toLocaleDateString("ru-RU") : "";

  profileQuizResult.style.setProperty("--profile-percent", `${Math.max(0, Math.min(percent, 100))}%`);
  profileQuizResult.innerHTML = `
    <strong>${score} из ${total} · ${percent}%</strong>
    <div class="profile-result-meter" aria-hidden="true"><span></span></div>
    <p>${date ? `Пройдено: ${date}. ` : ""}Повторное прохождение закрыто, результат сохранен в личном кабинете.</p>
  `;
}

function updateAuthAvailability() {
  document.documentElement.classList.toggle("auth-enabled", Boolean(supabaseClient));
  document.documentElement.classList.toggle("auth-disabled", !supabaseClient);

  authOpenButtons.forEach((button) => {
    button.hidden = !supabaseClient;
  });

  if (authModal) {
    authModal.hidden = !supabaseClient;
    if (!supabaseClient) {
      authModal.classList.remove("is-open");
      authModal.setAttribute("aria-hidden", "true");
    }
  }
}

function openQuizAuthGate() {
  markQuizIntent();

  if (!supabaseClient) {
    window.location.href = "quiz.html";
    return;
  }

  openAuth("register");
  setAuthMessage("Квиз доступен после регистрации. Создайте аккаунт или вернитесь назад и войдите.", "info");
}

async function loadAuthSession() {
  if (!supabaseClient) {
    updateAuthState();
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    currentUserEmail = "";
    currentUserId = null;
    currentUserName = "";
  } else {
    setCurrentUser(data.session?.user);
  }
  updateAuthState();
}

async function submitFeedback(payload) {
  if (!supabaseClient) {
    const body = new URLSearchParams({
      "form-name": "feedback",
      name: payload.name,
      email: payload.email,
      message: payload.message,
      page: payload.page,
      "bot-field": payload.botField,
    });

    const response = await fetch(netlifyFormEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error("Сообщение не отправилось. Попробуйте позже.");
    }

    return "netlify";
  }

  const { error } = await supabaseClient.from("feedback_messages").insert({
    name: payload.name,
    email: payload.email,
    message: payload.message,
    page: payload.page,
    user_id: currentUserId,
  });

  if (error) throw error;
  return "supabase";
}

// Quiz links work for guests as ordinary page links.

authOpenButtons.forEach((button) => button.addEventListener("click", openAuth));
authCloseButtons.forEach((button) => button.addEventListener("click", closeAuth));
profileCloseButtons.forEach((button) => button.addEventListener("click", closeProfile));

profileLogout?.addEventListener("click", async () => {
  if (!supabaseClient) return;
  profileLogout.disabled = true;
  profileLogout.textContent = "Выхожу...";
  await supabaseClient.auth.signOut();
  currentUserEmail = "";
  currentUserId = null;
  currentUserName = "";
  updateAuthState();
  closeProfile();
  profileLogout.disabled = false;
  profileLogout.textContent = "Выйти из аккаунта";
});

passwordToggle?.addEventListener("click", () => {
  const passwordInput = authPasswordForm?.querySelector('input[name="password"]');
  if (!passwordInput) return;

  const shouldShow = passwordInput.type === "password";
  passwordInput.type = shouldShow ? "text" : "password";
  passwordToggle.setAttribute("aria-pressed", shouldShow ? "true" : "false");
  passwordToggle.setAttribute("aria-label", shouldShow ? "Скрыть пароль" : "Показать пароль");
});

authChooseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.authChoose === "login" ? "login" : "register";
    startAuthFlow(mode);
  });
});

authBackButton?.addEventListener("click", goAuthBack);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isUnconfirmedEmailError(error) {
  return String(error?.message || "").toLowerCase().includes("not confirmed");
}

authNameForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (authRequestPending) return;
  const name = String(authNameForm.elements.name?.value || "").trim();
  if (name.length < 2) {
    setAuthMessage("Укажите имя, чтобы создать личный кабинет.", "error");
    return;
  }
  authFormName = name;
  setAuthStep("email");
});

authEmailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (authRequestPending) return;
  const email = String(authEmailForm.elements.email?.value || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    setAuthMessage("Введите корректную почту — на неё придёт код подтверждения.", "error");
    return;
  }
  authFormEmail = email;
  setAuthStep("password");
});

authPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authRequestPending) return;
  const password = String(authPasswordForm.elements.password?.value || "");

  if (password.length < 6) {
    setAuthMessage("Пароль должен быть не короче 6 символов.", "error");
    return;
  }

  const busyText = authMode === "register" ? "Создаю аккаунт..." : "Вхожу...";

  try {
    setAuthPending(true, busyText);

    if (authMode === "register") {
      const result = await requestAuth("register", authFormEmail, password, authFormName);

      if (result.session) {
        finishAuth(result.session.user, "register");
        return;
      }

      clearCodeInputs();
      setAuthStep("code", {
        message: { text: "Последний шаг: код уже летит на вашу почту. Проверьте входящие и папку «Спам».", type: "info" },
      });
      startResendCooldown();
      return;
    }

    const result = await requestAuth("login", authFormEmail, password);
    finishAuth(result.session?.user || result.user, "login");
  } catch (error) {
    if (authMode === "login" && isUnconfirmedEmailError(error)) {
      loginNeedsCode = true;
      try {
        await supabaseClient.auth.resend({ type: "signup", email: authFormEmail });
      } catch (_resendError) {
        // The code step will still let the user request another code.
      }
      clearCodeInputs();
      setAuthStep("code", {
        message: { text: "Почта ещё не подтверждена. Мы отправили новый код — введите его, чтобы завершить вход.", type: "info" },
      });
      startResendCooldown();
      return;
    }
    setAuthMessage(getFriendlyAuthError(error), "error");
  } finally {
    setAuthPending(false);
  }
});

authCodeInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(-1);
    input.classList.toggle("is-filled", Boolean(input.value));
    if (input.value && authCodeInputs[index + 1]) {
      authCodeInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value && authCodeInputs[index - 1]) {
      event.preventDefault();
      authCodeInputs[index - 1].focus();
      authCodeInputs[index - 1].value = "";
      authCodeInputs[index - 1].classList.remove("is-filled");
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const digits = (event.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, authCodeInputs.length);
    if (!digits) return;
    digits.split("").forEach((digit, digitIndex) => {
      const target = authCodeInputs[digitIndex];
      if (!target) return;
      target.value = digit;
      target.classList.add("is-filled");
    });
    const nextTarget = authCodeInputs[Math.min(digits.length, authCodeInputs.length - 1)];
    nextTarget?.focus();
  });
});

authCodeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authRequestPending) return;
  const code = getCodeValue();

  if (code.length !== authCodeInputs.length) {
    setAuthMessage("Введите все 6 цифр кода из письма.", "error");
    return;
  }

  try {
    setAuthPending(true, "Проверяю код...");
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email: authFormEmail,
      token: code,
      type: "signup",
    });
    if (error) throw error;
    finishAuth(data.session?.user || data.user, authMode);
  } catch (error) {
    const friendly = getFriendlyAuthError(error);
    const isRawMessage = friendly === error?.message;
    setAuthMessage(
      isRawMessage ? "Код не подходит. Проверьте цифры или отправьте код ещё раз." : friendly,
      "error",
    );
  } finally {
    setAuthPending(false);
  }
});

authResendButton?.addEventListener("click", async () => {
  if (!supabaseClient || authRequestPending || Date.now() < resendAvailableAt) return;
  authResendButton.disabled = true;
  try {
    const { error } = await supabaseClient.auth.resend({ type: "signup", email: authFormEmail });
    if (error) throw error;
    setAuthMessage("Новый код отправлен. Проверьте входящие и папку «Спам».", "success");
    startResendCooldown();
  } catch (error) {
    authResendButton.disabled = false;
    setAuthMessage(getFriendlyAuthError(error), "error");
  }
});

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(feedbackForm);
    const payload = {
      name: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim(),
      message: String(formData.get("message")).trim(),
      page: location.href,
      botField: String(formData.get("bot-field") || "").trim(),
    };

    feedbackMessage.textContent = "Отправляю сообщение...";
    feedbackMessage.dataset.type = "info";

    try {
      await submitFeedback(payload);
      feedbackForm.reset();
      feedbackMessage.textContent = "Сообщение отправлено. Спасибо за обращение.";
      feedbackMessage.dataset.type = "success";
    } catch (error) {
      feedbackMessage.textContent = error.message || "Сообщение не отправилось. Попробуйте позже.";
      feedbackMessage.dataset.type = "error";
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAuth();
    closeProfile();
  }
});

resetAuthFlow();
updateAuthAvailability();

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setCurrentUser(session?.user);
    updateAuthState();
    redirectToQuizIfRequested();
  });
}

loadAuthSession().then(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("auth") === "quiz" && !currentUserId) {
    openQuizAuthGate();
  } else if (params.get("auth") === "login") {
    openAuth("login");
  } else {
    redirectToQuizIfRequested();
  }
});
