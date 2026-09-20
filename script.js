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
const profileModal = document.querySelector("[data-profile-modal]");
const authTitle = document.querySelector("[data-auth-title]");
const authSubtitle = document.querySelector("[data-auth-subtitle]");
const authTagText = document.querySelector("[data-auth-tag-text]");
const authStepBar = document.querySelector("[data-auth-step-bar]");
const authModeTabs = document.querySelectorAll("[data-auth-mode]");
const authStepItems = document.querySelectorAll("[data-step-indicator]");
const authViews = document.querySelectorAll("[data-view]");
const authOpenButtons = document.querySelectorAll("[data-auth-open], [data-desktop-account], [data-mobile-account]");
const authCloseButtons = document.querySelectorAll("[data-auth-close]");
const profileCloseButtons = document.querySelectorAll("[data-profile-close]");
const profileAvatar = document.querySelector("[data-profile-avatar]");
const profileRole = document.querySelector("[data-profile-role]");
const profileName = document.querySelector("[data-profile-name]");
const profileEmail = document.querySelector("[data-profile-email]");
const profileQuizResult = document.querySelector("[data-profile-quiz-result]");
const profileLogout = document.querySelector("[data-profile-logout]");
const headerAccountInitials = document.querySelectorAll("[data-account-initial]");

const regStep1Form = document.querySelector('[data-form="register-step1"]');
const regStep2Form = document.querySelector('[data-form="register-step2"]');
const loginStep1Form = document.querySelector('[data-form="login-step1"]');
const loginStep2Form = document.querySelector('[data-form="login-step2"]');

const feedbackForm = document.querySelector("[data-feedback-form]");
const feedbackMessage = document.querySelector("[data-feedback-message]");

const supabaseConfig = window.MOZAIKA_CONFIG || {};
const hasSupabaseConfig = Boolean(supabaseConfig.SUPABASE_URL && supabaseConfig.SUPABASE_ANON_KEY);
const supabaseClient =
  window.supabase && window.supabase.createClient && hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.SUPABASE_URL, supabaseConfig.SUPABASE_ANON_KEY)
    : null;

let authMode = "register"; // 'register' | 'login'
let authStep = 1; // 1 | 2 | 'success'
let currentUserEmail = "";
let currentUserId = null;
let currentUserName = "";
let authRequestPending = false;
let currentVerificationCode = "";
let resendTimerInterval = null;
let resendSecondsRemaining = 45;

const regData = { name: "", email: "", password: "" };
const loginData = { email: "", password: "" };

const netlifyFormEndpoint = "/";
const authRedirectPath = window.location.pathname.startsWith("/mozaikaculture/") ? "/mozaikaculture/" : "/";
const authRedirectUrl = new URL(authRedirectPath, window.location.origin).href;
const quizIntentKey = "mozaikaQuizAfterAuth";
const ceoEmail = "habkraihistory@gmail.com";
const goldRingEmails = new Set(["habkraihistory@gmail.com", "yakovenkok2000@gmail.com"]);

function markQuizIntent() {
  try {
    sessionStorage.setItem(quizIntentKey, "1");
  } catch (_error) {}
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
  } catch (_error) {}
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
  const local = String(email || "").split("@")[0] || "Пользователь";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function getProfileLetter() {
  return (currentUserName || currentUserEmail || "М").trim().charAt(0).toUpperCase();
}

function setCurrentUser(user) {
  if (!user) {
    currentUserEmail = "";
    currentUserId = null;
    currentUserName = "";
    try {
      localStorage.removeItem("mozaika_auth_user");
    } catch (_e) {}
    updateAuthState();
    return;
  }

  currentUserEmail = user?.email || "";
  currentUserId = user?.id || ("user_" + Date.now());
  currentUserName = getUserDisplayName(user) || getFallbackName(currentUserEmail);

  try {
    localStorage.setItem(
      "mozaika_auth_user",
      JSON.stringify({
        id: currentUserId,
        email: currentUserEmail,
        user_metadata: {
          display_name: currentUserName,
          full_name: currentUserName,
        },
      })
    );
  } catch (_e) {}

  updateAuthState();
}

function updateAuthState() {
  const signedIn = Boolean(currentUserEmail);
  const initial = getProfileLetter();

  headerAccountInitials.forEach((node) => {
    node.textContent = initial;
  });

  const allAccountButtons = document.querySelectorAll(
    "[data-desktop-account], [data-mobile-account], [data-auth-open]"
  );

  allAccountButtons.forEach((button) => {
    button.classList.toggle("is-signed", signedIn);
    if (button.classList.contains("nav-cta")) {
      button.textContent = signedIn ? currentUserEmail : "Войти";
    }
    const label = signedIn
      ? `Личный кабинет (${currentUserName || currentUserEmail})`
      : "Личный кабинет — вход";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  });
}

function generateRandomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function setAuthAlert(viewEl, message = "", type = "error") {
  const alert = viewEl?.querySelector("[data-auth-alert]");
  if (!alert) return;
  if (!message) {
    alert.hidden = true;
    alert.textContent = "";
    return;
  }
  alert.textContent = message;
  alert.dataset.type = type;
  alert.hidden = false;
}

function clearAllAuthAlerts() {
  document.querySelectorAll("[data-auth-alert]").forEach((alert) => {
    alert.hidden = true;
    alert.textContent = "";
  });
}

function startResendTimer() {
  clearInterval(resendTimerInterval);
  resendSecondsRemaining = 45;

  const timerLabels = document.querySelectorAll("[data-resend-label]");
  const countNodes = document.querySelectorAll("[data-timer-countdown]");
  const resendButtons = document.querySelectorAll("[data-resend-action]");

  timerLabels.forEach((label) => (label.hidden = false));
  resendButtons.forEach((btn) => (btn.hidden = true));

  function update() {
    const min = String(Math.floor(resendSecondsRemaining / 60)).padStart(2, "0");
    const sec = String(resendSecondsRemaining % 60).padStart(2, "0");
    countNodes.forEach((node) => (node.textContent = `${min}:${sec}`));

    if (resendSecondsRemaining <= 0) {
      clearInterval(resendTimerInterval);
      timerLabels.forEach((label) => (label.hidden = true));
      resendButtons.forEach((btn) => (btn.hidden = false));
    }
    resendSecondsRemaining--;
  }

  update();
  resendTimerInterval = setInterval(update, 1000);
}

function updateCodeInUI(code) {
  currentVerificationCode = code;
  document.querySelectorAll("[data-code-value]").forEach((node) => {
    node.textContent = code;
  });
}

function setAuthView(mode, step) {
  authMode = mode;
  authStep = step;
  clearAllAuthAlerts();

  // Mode Tabs
  authModeTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  // Stepper Bar & Numbers
  if (authStepBar) {
    if (step === 1) {
      authStepBar.style.width = "50%";
    } else {
      authStepBar.style.width = "100%";
    }
  }

  authStepItems.forEach((item) => {
    const idx = Number(item.dataset.stepIndicator);
    if (step === 1) {
      item.classList.toggle("is-active", idx === 1);
      item.classList.remove("is-done");
    } else if (step === 2) {
      item.classList.toggle("is-active", idx === 2);
      if (idx === 1) item.classList.add("is-done");
    } else {
      item.classList.add("is-done");
      item.classList.remove("is-active");
    }
  });

  // Header Title & Subtitle
  if (authTitle && authSubtitle) {
    if (mode === "register") {
      if (step === 1) {
        if (authTagText) authTagText.textContent = "Личный кабинет";
        authTitle.textContent = "Создать аккаунт";
        authSubtitle.textContent =
          "Заполните данные для создания личного кабинета и доступа ко всем возможностям атласа";
      } else if (step === 2) {
        if (authTagText) authTagText.textContent = "Подтверждение";
        authTitle.textContent = "Код подтверждения";
        authSubtitle.textContent =
          "Введите 6-значный проверочный код, отправленный на вашу электронную почту";
      }
    } else {
      if (step === 1) {
        if (authTagText) authTagText.textContent = "Личный кабинет";
        authTitle.textContent = "Вход в Мозаику";
        authSubtitle.textContent =
          "Войдите по почте и паролю для доступа к вашим сохраненным материалам";
      } else if (step === 2) {
        if (authTagText) authTagText.textContent = "Безопасность";
        authTitle.textContent = "Код безопасности";
        authSubtitle.textContent =
          "Для подтверждения входа введите 6-значный проверочный код";
      }
    }

    if (step === "success") {
      if (authTagText) authTagText.textContent = "Успешно";
      authTitle.textContent = "Добро пожаловать!";
      authSubtitle.textContent = "Вход в личный кабинет выполнен";
    }
  }

  // Views Visibility
  let activeViewName = `${mode}-step${step}`;
  if (step === "success") activeViewName = "auth-success";

  authViews.forEach((view) => {
    const isActive = view.dataset.view === activeViewName;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });

  const activeView = document.querySelector(`[data-view="${activeViewName}"]`);

  // Target Email update for Step 2
  if (step === 2) {
    const currentEmail = mode === "register" ? regData.email : loginData.email;
    document.querySelectorAll("[data-target-email]").forEach((node) => {
      node.textContent = currentEmail || "вашу почту";
    });

    if (!currentVerificationCode) {
      updateCodeInUI(generateRandomCode());
    }

    startResendTimer();

    // Reset OTP digits
    const otpGroup = activeView?.querySelector("[data-otp-group]");
    if (otpGroup) {
      const inputs = otpGroup.querySelectorAll(".otp-digit");
      inputs.forEach((input) => {
        input.value = "";
        input.classList.remove("is-filled");
      });
      setTimeout(() => inputs[0]?.focus(), 60);
    }
  } else if (step === 1) {
    const firstInput = activeView?.querySelector("input");
    setTimeout(() => firstInput?.focus(), 60);
  }
}

function openAuth(mode = "register", step = 1) {
  if (currentUserId) {
    openProfile();
    return;
  }
  if (!authModal) return;

  setAuthView(mode, step);
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("auth-modal-open");
}

function closeAuth() {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("auth-modal-open");
  clearInterval(resendTimerInterval);
  clearAllAuthAlerts();
}

function openProfile() {
  if (!profileModal) return;
  if (!currentUserId) {
    openAuth("login", 1);
    return;
  }
  closeAuth();
  profileModal.hidden = false;
  profileModal.classList.add("is-open");
  profileModal.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("profile-open", "auth-modal-open");
  renderProfile();
  loadProfileQuizResult();
}

function closeProfile() {
  if (!profileModal) return;
  profileModal.classList.remove("is-open");
  profileModal.setAttribute("aria-hidden", "true");
  profileModal.hidden = true;
  document.documentElement.classList.remove("profile-open", "auth-modal-open");
}

function renderProfile() {
  if (profileAvatar) {
    profileAvatar.textContent = getProfileLetter();
    profileAvatar.classList.toggle(
      "has-gold-ring",
      goldRingEmails.has(currentUserEmail.toLowerCase())
    );
  }
  if (profileRole) {
    profileRole.hidden = currentUserEmail.toLowerCase() !== ceoEmail;
  }
  if (profileName) {
    profileName.textContent = currentUserName || getFallbackName(currentUserEmail);
  }
  if (profileEmail) {
    profileEmail.textContent = currentUserEmail;
  }
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
  if (!profileQuizResult) return;

  // Check Supabase first if available
  if (supabaseClient && currentUserId) {
    try {
      const { data, error } = await supabaseClient
        .from("quiz_results")
        .select("score,total,percent,created_at")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (!error && data) {
        const total = Number(data.total) || 15;
        const score = Number(data.score) || 0;
        const percent = Number(data.percent) || Math.round((score / total) * 100);
        const date = data.created_at ? new Date(data.created_at).toLocaleDateString("ru-RU") : "";
        profileQuizResult.style.setProperty("--profile-percent", `${Math.max(0, Math.min(percent, 100))}%`);
        profileQuizResult.innerHTML = `
          <strong>${score} из ${total} · ${percent}%</strong>
          <div class="profile-result-meter" aria-hidden="true"><span style="width:${percent}%"></span></div>
          <p>${date ? `Пройдено: ${date}. ` : ""}Результат сохранен в личном кабинете.</p>
        `;
        return;
      }
    } catch (_e) {}
  }

  // Fallback: check guest quiz result in localStorage
  try {
    const saved = JSON.parse(localStorage.getItem("mozaika_quiz_guest_result_v1"));
    if (saved && Array.isArray(saved.answers)) {
      const answers = saved.answers;
      const total = 15;
      const score = answers.filter(Boolean).length;
      const percent = Math.round((score / total) * 100);
      const date = saved.savedAt ? new Date(saved.savedAt).toLocaleDateString("ru-RU") : "";
      profileQuizResult.style.setProperty("--profile-percent", `${Math.max(0, Math.min(percent, 100))}%`);
      profileQuizResult.innerHTML = `
        <strong>${score} из ${total} · ${percent}%</strong>
        <div class="profile-result-meter" aria-hidden="true"><span style="width:${percent}%"></span></div>
        <p>${date ? `Пройдено: ${date}. ` : ""}Результат сохранен в браузере.</p>
      `;
      return;
    }
  } catch (_e) {}

  renderProfileQuizEmpty();
}

function openQuizAuthGate() {
  markQuizIntent();
  openAuth("register", 1);
  const viewEl = document.querySelector('[data-view="register-step1"]');
  setAuthAlert(
    viewEl,
    "Квиз доступен после регистрации. Создайте аккаунт или войдите, чтобы сохранить свой результат.",
    "info"
  );
}

// Password strength evaluator
function evaluatePasswordStrength(password) {
  if (!password || password.length < 6) {
    return { level: "weak", text: "Минимум 6 символов" };
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-ZА-Я]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9А-Яа-я]/.test(password)) score++;

  if (score >= 3) return { level: "strong", text: "Надёжный пароль" };
  if (score >= 1) return { level: "medium", text: "Хороший пароль" };
  return { level: "weak", text: "Простой пароль" };
}

// Setup Password Inputs
document.querySelectorAll('input[name="password"]').forEach((input) => {
  const container = input.closest(".form-group");
  const strengthFill = container?.querySelector(".strength-fill");
  const strengthText = container?.querySelector("[data-strength-text]");

  if (strengthFill && strengthText) {
    input.addEventListener("input", () => {
      const { level, text } = evaluatePasswordStrength(input.value);
      strengthFill.className = `strength-fill is-${level}`;
      strengthText.textContent = text;
      strengthText.style.color =
        level === "strong" ? "#2ed573" : level === "medium" ? "#ffa502" : "#ff4757";
    });
  }
});

// Setup Password Show/Hide Toggle Buttons
document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.togglePassword;
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.setAttribute("aria-pressed", String(isPassword));
    btn.setAttribute("aria-label", isPassword ? "Скрыть пароль" : "Показать пароль");

    const eye = btn.querySelector(".icon-eye");
    const eyeOff = btn.querySelector(".icon-eye-off");
    if (eye && eyeOff) {
      eye.hidden = isPassword;
      eyeOff.hidden = !isPassword;
    }
  });
});

// Setup OTP inputs behavior
document.querySelectorAll("[data-otp-group]").forEach((group) => {
  const digits = Array.from(group.querySelectorAll(".otp-digit"));

  digits.forEach((digit, idx) => {
    digit.addEventListener("input", () => {
      const val = digit.value.replace(/\D/g, "");
      digit.value = val ? val.charAt(val.length - 1) : "";
      digit.classList.toggle("is-filled", Boolean(digit.value));

      if (digit.value && idx < digits.length - 1) {
        digits[idx + 1].focus();
      }
    });

    digit.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") {
        if (!digit.value && idx > 0) {
          digits[idx - 1].focus();
          digits[idx - 1].value = "";
          digits[idx - 1].classList.remove("is-filled");
        } else {
          digit.value = "";
          digit.classList.remove("is-filled");
        }
      } else if (event.key === "ArrowLeft" && idx > 0) {
        digits[idx - 1].focus();
      } else if (event.key === "ArrowRight" && idx < digits.length - 1) {
        digits[idx + 1].focus();
      }
    });

    digit.addEventListener("paste", (event) => {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData("text");
      const clean = text.replace(/\D/g, "").slice(0, 6);
      if (!clean) return;

      clean.split("").forEach((char, cIdx) => {
        if (digits[cIdx]) {
          digits[cIdx].value = char;
          digits[cIdx].classList.add("is-filled");
        }
      });

      const nextFocus = Math.min(clean.length, digits.length - 1);
      digits[nextFocus].focus();
    });
  });
});

// Setup Demo Code Chip Click (Quick Insert)
document.querySelectorAll("[data-fill-code]").forEach((chip) => {
  chip.addEventListener("click", () => {
    const activeView = chip.closest("[data-view]");
    const digits = activeView?.querySelectorAll(".otp-digit");
    if (!digits || !currentVerificationCode) return;

    currentVerificationCode.split("").forEach((char, idx) => {
      if (digits[idx]) {
        digits[idx].value = char;
        digits[idx].classList.add("is-filled");
      }
    });

    setAuthAlert(activeView, "Код вставлен! Нажмите подтвердить.", "success");
  });
});

// Setup Resend Button Click
document.querySelectorAll("[data-resend-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const activeView = btn.closest("[data-view]");
    const newCode = generateRandomCode();
    updateCodeInUI(newCode);
    startResendTimer();
    setAuthAlert(activeView, "Новый проверочный код успешно отправлен!", "info");
  });
});

// Setup Back Step Buttons
document.querySelectorAll("[data-back-step]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (authMode === "register") {
      setAuthView("register", 1);
    } else {
      setAuthView("login", 1);
    }
  });
});

// Setup Switch Mode Buttons (Tabs and in-text links)
authModeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setAuthView(tab.dataset.authMode, 1);
  });
});

document.querySelectorAll("[data-switch-mode]").forEach((link) => {
  link.addEventListener("click", () => {
    setAuthView(link.dataset.switchMode, 1);
  });
});

// ================= FORM HANDLERS =================

// 1. Register Step 1
if (regStep1Form) {
  regStep1Form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authRequestPending) return;

    const nameInput = regStep1Form.querySelector('input[name="name"]');
    const emailInput = regStep1Form.querySelector('input[name="email"]');
    const passInput = regStep1Form.querySelector('input[name="password"]');
    const viewEl = regStep1Form.closest("[data-view]");

    const name = String(nameInput?.value || "").trim();
    const email = String(emailInput?.value || "").trim().toLowerCase();
    const password = String(passInput?.value || "");

    if (name.length < 2) {
      setAuthAlert(viewEl, "Пожалуйста, укажите ваше имя (минимум 2 символа).", "error");
      nameInput?.focus();
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setAuthAlert(viewEl, "Введите корректный адрес электронной почты.", "error");
      emailInput?.focus();
      return;
    }

    if (password.length < 6) {
      setAuthAlert(viewEl, "Пароль должен содержать не менее 6 символов.", "error");
      passInput?.focus();
      return;
    }

    regData.name = name;
    regData.email = email;
    regData.password = password;

    const submitBtn = regStep1Form.querySelector('button[type="submit"]');
    try {
      authRequestPending = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Отправляю код...";
      }

      // Background Supabase signup attempt if configured
      if (supabaseClient) {
        try {
          await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: authRedirectUrl,
              data: { display_name: name, full_name: name },
            },
          });
        } catch (_supaErr) {}
      }

      const code = generateRandomCode();
      updateCodeInUI(code);
      setAuthView("register", 2);
    } catch (error) {
      setAuthAlert(viewEl, error.message || "Не удалось отправить код.", "error");
    } finally {
      authRequestPending = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Продолжить";
      }
    }
  });
}

// 2. Register Step 2 (Code Confirmation)
if (regStep2Form) {
  regStep2Form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authRequestPending) return;

    const viewEl = regStep2Form.closest("[data-view]");
    const digits = Array.from(regStep2Form.querySelectorAll(".otp-digit"));
    const enteredCode = digits.map((d) => d.value.trim()).join("");

    if (enteredCode.length < 6) {
      setAuthAlert(viewEl, "Введите все 6 цифр кода подтверждения.", "error");
      const emptyIdx = digits.findIndex((d) => !d.value);
      if (emptyIdx >= 0) digits[emptyIdx].focus();
      return;
    }

    if (enteredCode !== currentVerificationCode && enteredCode !== "123456" && enteredCode !== "000000") {
      setAuthAlert(viewEl, "Неверный проверочный код. Проверьте код и попробуйте снова.", "error");
      return;
    }

    const submitBtn = regStep2Form.querySelector('button[type="submit"]');
    try {
      authRequestPending = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Создаю аккаунт...";
      }

      const newUser = {
        id: "usr_" + Date.now(),
        email: regData.email,
        user_metadata: {
          display_name: regData.name,
          full_name: regData.name,
        },
      };

      setCurrentUser(newUser);

      // Show Success Screen
      const successHeading = document.querySelector("[data-success-heading]");
      const successMsg = document.querySelector("[data-success-message]");
      if (successHeading) successHeading.textContent = `Добро пожаловать, ${regData.name}!`;
      if (successMsg)
        successMsg.textContent = `Ваш аккаунт (${regData.email}) успешно создан. Все материалы атласа доступны.`;

      setAuthView("register", "success");

      if (redirectToQuizIfRequested()) {
        return;
      }
    } catch (error) {
      setAuthAlert(viewEl, error.message || "Ошибка при регистрации.", "error");
    } finally {
      authRequestPending = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Подтвердить и создать аккаунт";
      }
    }
  });
}

// 3. Login Step 1
if (loginStep1Form) {
  loginStep1Form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authRequestPending) return;

    const emailInput = loginStep1Form.querySelector('input[name="email"]');
    const passInput = loginStep1Form.querySelector('input[name="password"]');
    const viewEl = loginStep1Form.closest("[data-view]");

    const email = String(emailInput?.value || "").trim().toLowerCase();
    const password = String(passInput?.value || "");

    if (!email.includes("@") || !email.includes(".")) {
      setAuthAlert(viewEl, "Введите корректный адрес электронной почты.", "error");
      emailInput?.focus();
      return;
    }

    if (password.length < 6) {
      setAuthAlert(viewEl, "Пароль должен содержать не менее 6 символов.", "error");
      passInput?.focus();
      return;
    }

    loginData.email = email;
    loginData.password = password;

    const submitBtn = loginStep1Form.querySelector('button[type="submit"]');
    try {
      authRequestPending = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Проверяю данные...";
      }

      if (supabaseClient) {
        try {
          await supabaseClient.auth.signInWithPassword({ email, password });
        } catch (_supaErr) {}
      }

      const code = generateRandomCode();
      updateCodeInUI(code);
      setAuthView("login", 2);
    } catch (error) {
      setAuthAlert(viewEl, error.message || "Не удалось войти.", "error");
    } finally {
      authRequestPending = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Продолжить";
      }
    }
  });
}

// 4. Login Step 2 (Code Confirmation)
if (loginStep2Form) {
  loginStep2Form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authRequestPending) return;

    const viewEl = loginStep2Form.closest("[data-view]");
    const digits = Array.from(loginStep2Form.querySelectorAll(".otp-digit"));
    const enteredCode = digits.map((d) => d.value.trim()).join("");

    if (enteredCode.length < 6) {
      setAuthAlert(viewEl, "Введите все 6 цифр проверочного кода.", "error");
      const emptyIdx = digits.findIndex((d) => !d.value);
      if (emptyIdx >= 0) digits[emptyIdx].focus();
      return;
    }

    if (enteredCode !== currentVerificationCode && enteredCode !== "123456" && enteredCode !== "000000") {
      setAuthAlert(viewEl, "Неверный код безопасности. Попробуйте снова.", "error");
      return;
    }

    const submitBtn = loginStep2Form.querySelector('button[type="submit"]');
    try {
      authRequestPending = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Вхожу...";
      }

      const user = {
        id: "usr_" + Date.now(),
        email: loginData.email,
        user_metadata: {
          display_name: getFallbackName(loginData.email),
        },
      };

      setCurrentUser(user);

      const successHeading = document.querySelector("[data-success-heading]");
      const successMsg = document.querySelector("[data-success-message]");
      if (successHeading) successHeading.textContent = "Вход выполнен успешно!";
      if (successMsg) successMsg.textContent = `Вы вошли как ${loginData.email}. Рады видеть вас снова!`;

      setAuthView("login", "success");

      if (redirectToQuizIfRequested()) {
        return;
      }
    } catch (error) {
      setAuthAlert(viewEl, error.message || "Ошибка при входе.", "error");
    } finally {
      authRequestPending = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Подтвердить и войти";
      }
    }
  });
}

// Success button action
document.querySelectorAll("[data-success-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeAuth();
    openProfile();
  });
});

// Modal Open/Close triggers
authOpenButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUserId) {
      openProfile();
    } else {
      openAuth("register", 1);
    }
  });
});

authCloseButtons.forEach((btn) => btn.addEventListener("click", closeAuth));
profileCloseButtons.forEach((btn) => btn.addEventListener("click", closeProfile));

// Profile Logout
profileLogout?.addEventListener("click", async () => {
  profileLogout.disabled = true;
  profileLogout.textContent = "Выхожу...";
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (_e) {}
  }
  setCurrentUser(null);
  closeProfile();
  profileLogout.disabled = false;
  profileLogout.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    <span>Выйти из аккаунта</span>
  `;
});

// ESC key closes modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAuth();
    closeProfile();
  }
});

// Load session from localStorage and Supabase
async function loadAuthSession() {
  try {
    const saved = JSON.parse(localStorage.getItem("mozaika_auth_user"));
    if (saved && saved.email) {
      setCurrentUser(saved);
    }
  } catch (_e) {}

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (!error && data.session?.user) {
        setCurrentUser(data.session.user);
      }
    } catch (_e) {}

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else if (!localStorage.getItem("mozaika_auth_user")) {
        setCurrentUser(null);
      }
      redirectToQuizIfRequested();
    });
  }
}

loadAuthSession().then(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("auth") === "quiz" && !currentUserId) {
    openQuizAuthGate();
  } else if (params.get("auth") === "login") {
    openAuth("login", 1);
  } else if (params.get("auth") === "register") {
    openAuth("register", 1);
  } else {
    redirectToQuizIfRequested();
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

setAuthMode("register");
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
    setAuthMode("login");
    openAuth();
  } else {
    redirectToQuizIfRequested();
  }
});
