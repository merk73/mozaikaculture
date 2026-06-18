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
let motionObserver = null;

function addMotionTargets(root = document) {
  const targets = [
    ".statement-copy",
    ".statement-visual",
    ".section-head",
    ".atlas-tools",
    ".learn-aside",
    ".knowledge-panel",
    ".online-quiz-cta",
    ".event-story",
    ".event-program article",
    ".event-photo",
    ".feedback-grid > div",
    ".feedback-form",
    ".sources-heading",
    ".sources-list a",
    ".site-footer",
    ".fact-list div",
    ".quiz-options button",
  ];

  root.querySelectorAll(targets.join(",")).forEach((node, index) => {
    node.classList.add("motion-reveal");
    if (!node.style.getPropertyValue("--motion-delay")) {
      node.style.setProperty("--motion-delay", `${Math.min(index * 28, 220)}ms`);
    }
  });
}

function hydrateMotion(root = document) {
  addMotionTargets(root);
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
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 8}deg`);
      card.style.setProperty("--tilt-y", `${y * -8}deg`);
      card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    });
  });
}

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion.matches) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--hero-shift-x", `${x * -34}px`);
    hero.style.setProperty("--hero-shift-y", `${y * -22}px`);
    hero.style.setProperty("--hero-tilt-x", `${y * 4}deg`);
    hero.style.setProperty("--hero-tilt-y", `${x * -6}deg`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
    hero.style.setProperty("--hero-tilt-x", "0deg");
    hero.style.setProperty("--hero-tilt-y", "0deg");
  });
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
      { rootMargin: "0px 0px 30% 0px", threshold: 0.02 },
    );
  }

  hydrateMotion(document);
  initTiltCards(document);
  initHeroParallax();
}

function renderCards(filter = "all") {
  if (!grid) return;
  const visible = filter === "all" ? peoples : peoples.filter((item) => item.area === filter);

  grid.innerHTML = visible
    .map(
      (person, index) => `
        <a class="people-card motion-reveal tilt-card" href="peoples/${person.slug}.html" style="--motion-delay: ${index * 34}ms">
          <div class="card-meta">
            <span>${person.areaLabel}</span>
            <span>${person.region}</span>
          </div>
          <div>
            <h3>${person.name}</h3>
            <p>${person.summary}</p>
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
  panel.quizOptions.innerHTML = person.quiz.options
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
const netlifyFormEndpoint = "/";

async function requestAuth(mode, email, password) {
  if (!supabaseClient) {
    throw new Error("Supabase не настроен. Добавьте SUPABASE_URL и SUPABASE_ANON_KEY.");
  }

  if (mode === "register") {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/index.html`,
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

function openAuth() {
  if (!supabaseClient || !authModal || !authForm) return;
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  setTimeout(() => authForm.email.focus(), 30);
}

function closeAuth() {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
}

function setAuthMode(mode) {
  authMode = mode;
  authModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });
  if (authSubmit) authSubmit.textContent = mode === "register" ? "Создать аккаунт" : "Войти";
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

async function loadAuthSession() {
  if (!supabaseClient) {
    updateAuthState();
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    currentUserEmail = "";
    currentUserId = null;
  } else {
    currentUserEmail = data.session?.user?.email || "";
    currentUserId = data.session?.user?.id || null;
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
      throw new Error("Сообщение не отправилось. На Netlify форма начнет работать после публикации сайта.");
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

authOpenButtons.forEach((button) => button.addEventListener("click", openAuth));
authCloseButtons.forEach((button) => button.addEventListener("click", closeAuth));
authModeButtons.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});

if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(authForm);
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password"));

    if (password.length < 6) {
      setAuthMessage("Пароль должен быть не короче 6 символов.", "error");
      return;
    }

    if (!email.includes("@")) {
      setAuthMessage("Введите корректную почту.", "error");
      return;
    }

    try {
      const result = await requestAuth(authMode, email, password);

      if (authMode === "register" && !result.session) {
        currentUserEmail = "";
        currentUserId = null;
        updateAuthState();
        setAuthMessage("Аккаунт создан. Проверьте почту и подтвердите регистрацию.", "success");
        return;
      }

      currentUserEmail = result.session?.user?.email || "";
      currentUserId = result.session?.user?.id || null;
      updateAuthState();
      setAuthMessage(authMode === "register" ? "Аккаунт создан. Вход выполнен." : "Готово. Вы вошли в личный кабинет.", "success");
      setTimeout(closeAuth, 700);
    } catch (error) {
      setAuthMessage(error.message || "Не удалось выполнить вход.", "error");
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
      const feedbackTarget = await submitFeedback(payload);
      feedbackForm.reset();
      const successMessages = {
        netlify: "Сообщение отправлено. Оно появится в Netlify Forms.",
        supabase: "Сообщение отправлено. Оно сохранено в Supabase.",
      };
      feedbackMessage.textContent = successMessages[feedbackTarget] || "Сообщение отправлено.";
      feedbackMessage.dataset.type = "success";
    } catch (error) {
      feedbackMessage.textContent = error.message || "Сообщение не отправилось. Проверьте настройки Supabase.";
      feedbackMessage.dataset.type = "error";
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAuth();
});

setAuthMode("register");
updateAuthAvailability();

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUserEmail = session?.user?.email || "";
    currentUserId = session?.user?.id || null;
    updateAuthState();
  });
}

loadAuthSession();
