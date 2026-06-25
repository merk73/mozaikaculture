const peoples = window.MOZAIKA_PEOPLES || [];

const grid = document.querySelector("[data-people-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const tabs = document.querySelector("[data-people-tabs]");
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
  if (prefersReducedMotion.matches) return;
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
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY + 4;
    const scrollingUp = currentY < lastScrollY - 4;

    if (!mobileQuery.matches || currentY < 72 || scrollingUp) {
      document.documentElement.classList.remove("mobile-header-condensed");
    } else if (scrollingDown && currentY > 118) {
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
          <div class="card-meta">
            <span>${person.areaLabel}</span>
            <span>${person.region}</span>
          </div>
          <div class="card-body">
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
  if (!tabs || !panel.title) return;
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

  tabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.person === person.name);
  });

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

if (tabs) {
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-person]");
    if (!button) return;
    setKnowledge(button.dataset.person);
  });
}

const authModal = document.querySelector("[data-auth-modal]");
const authForm = document.querySelector("[data-auth-form]");
const authMessage = document.querySelector("[data-auth-message]");
const authSubmit = document.querySelector(".auth-submit");
const authModeButtons = document.querySelectorAll("[data-auth-mode]");
const authOpenButtons = document.querySelectorAll("[data-auth-open]");
const authCloseButtons = document.querySelectorAll("[data-auth-close]");
const authNameField = document.querySelector("[data-auth-name-field]");
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
const supabaseClient =
  window.supabase && window.supabase.createClient && hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.SUPABASE_URL, supabaseConfig.SUPABASE_ANON_KEY)
    : null;
let authMode = "register";
let currentUserEmail = "";
let currentUserId = null;
let currentUserName = "";
let authRequestPending = false;
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

function openAuth() {
  if (!supabaseClient || !authModal || !authForm) return;
  if (currentUserId) {
    openProfile();
    return;
  }
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  const firstInput = authMode === "register"
    ? authForm.querySelector('input[name="name"]')
    : authForm.querySelector('input[name="email"]');
  setTimeout(() => firstInput?.focus(), 30);
}

function closeAuth() {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
}

function openProfile() {
  if (!profileModal || !currentUserId) return;
  closeAuth();
  profileModal.hidden = false;
  profileModal.classList.add("is-open");
  profileModal.setAttribute("aria-hidden", "false");
  renderProfile();
  loadProfileQuizResult();
}

function closeProfile() {
  if (!profileModal) return;
  profileModal.classList.remove("is-open");
  profileModal.setAttribute("aria-hidden", "true");
  profileModal.hidden = true;
}

function setAuthMode(mode) {
  authMode = mode;
  authModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });
  if (authSubmit) authSubmit.textContent = mode === "register" ? "Создать аккаунт" : "Войти";
  if (authNameField) {
    const input = authNameField.querySelector("input");
    const isRegister = mode === "register";
    authNameField.hidden = !isRegister;
    if (input) input.required = isRegister;
  }
  const passwordInput = authForm?.querySelector('input[name="password"]');
  if (passwordInput) {
    passwordInput.autocomplete = mode === "register" ? "new-password" : "current-password";
  }
  setAuthMessage("");
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

  setAuthMode("register");
  openAuth();
  setAuthMessage("Квиз доступен после регистрации. Создайте аккаунт или войдите, чтобы пройти его один раз.", "info");
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

quizGateLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!supabaseClient || currentUserId) return;
    event.preventDefault();
    openQuizAuthGate();
  });
});

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
  const passwordInput = authForm?.querySelector('input[name="password"]');
  if (!passwordInput) return;

  const shouldShow = passwordInput.type === "password";
  passwordInput.type = shouldShow ? "text" : "password";
  passwordToggle.setAttribute("aria-pressed", shouldShow ? "true" : "false");
  passwordToggle.setAttribute("aria-label", shouldShow ? "Скрыть пароль" : "Показать пароль");
});
authModeButtons.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});

if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authRequestPending) return;

    const formData = new FormData(authForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password"));

    if (authMode === "register" && name.length < 2) {
      setAuthMessage("Укажите имя, чтобы создать личный кабинет.", "error");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Пароль должен быть не короче 6 символов.", "error");
      return;
    }

    if (!email.includes("@")) {
      setAuthMessage("Введите корректную почту.", "error");
      return;
    }

    try {
      authRequestPending = true;
      if (authSubmit) {
        authSubmit.disabled = true;
        authSubmit.textContent = authMode === "register" ? "Создаю аккаунт..." : "Вхожу...";
      }

      const result = await requestAuth(authMode, email, password, name);

      if (authMode === "register" && !result.session) {
        currentUserEmail = "";
        currentUserId = null;
        currentUserName = "";
        updateAuthState();
        setAuthMessage("Аккаунт создан. Проверьте почту и подтвердите регистрацию.", "success");
        return;
      }

      setCurrentUser(result.session?.user);
      updateAuthState();
      setAuthMessage(authMode === "register" ? "Аккаунт создан. Вход выполнен." : "Готово. Вы вошли в личный кабинет.", "success");
      if (!redirectToQuizIfRequested()) {
        setTimeout(openProfile, 700);
      }
    } catch (error) {
      setAuthMessage(getFriendlyAuthError(error), "error");
    } finally {
      authRequestPending = false;
      if (authSubmit) {
        authSubmit.disabled = false;
        authSubmit.textContent = authMode === "register" ? "Создать аккаунт" : "Войти";
      }
    }
  });
}

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
  } else {
    redirectToQuizIfRequested();
  }
});
