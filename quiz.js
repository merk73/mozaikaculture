const questions = [
  {
    topic: "Амур",
    question: "Какая связка точнее всего различает нанайскую и ульчскую темы внутри общего амурского контекста?",
    options: [
      "Нанайцы — Амур, орнамент и рыбья кожа; ульчи — Нижний Амур и оседлые речные поселения",
      "Нанайцы — Командоры и алеутский язык; ульчи — Берингоморское побережье и юпикские языки",
      "Нанайцы — Колыма и юкагирские языки; ульчи — север Камчатки и корякский контекст",
      "Нанайцы — Сахалин и ульта; ульчи — Уссурийская тайга и история тазов",
    ],
    answer: "Нанайцы — Амур, орнамент и рыбья кожа; ульчи — Нижний Амур и оседлые речные поселения",
    note: "Обе страницы связаны с Амуром, но акценты разные: у нанайцев важны Амур, орнамент и рыбья кожа, у ульчей — Нижний Амур и оседлый речной уклад.",
  },
  {
    topic: "Языки",
    question: "Какая пара верно указывает языковые исключения, которые нельзя сводить к тунгусо-маньчжурской группе?",
    options: [
      "Нивхский — язык-изолят; юкагирские языки — отдельная языковая линия",
      "Нанайский — эскимосско-алеутская семья; ульчский — чукотско-камчатская семья",
      "Орокский — юпикская группа; эвенский — язык-изолят",
      "Корякский — тунгусо-маньчжурская семья; алеутский — юкагирская группа",
    ],
    answer: "Нивхский — язык-изолят; юкагирские языки — отдельная языковая линия",
    note: "Нивхский и юкагирские языки требуют отдельного объяснения, потому что они не укладываются в основные семьи соседних страниц.",
  },
  {
    topic: "Чукотка",
    question: "Какой набор точнее всего относится к чукотско-камчатскому языковому и культурному ареалу?",
    options: [
      "Чукчи, коряки, ительмены, кереки и алюторцы",
      "Нанайцы, ульчи, орочи, удэгейцы и негидальцы",
      "Алеуты, эскимосы, тазы, ороки и нивхи",
      "Юкагиры, камчадалы, эвенки, эвены и тазы",
    ],
    answer: "Чукчи, коряки, ительмены, кереки и алюторцы",
    note: "Эти страницы связаны с чукотско-камчатским ареалом, хотя каждая имеет свой локальный контекст.",
  },
  {
    topic: "Море",
    question: "Какая пара относится к эскимосско-алеутской линии в материалах атласа?",
    options: [
      "Алеуты Командор и эскимосы Чукотки",
      "Нивхи Сахалина и ороки-ульта",
      "Тазы Приморья и удэгейцы Сихотэ-Алиня",
      "Негидальцы Амгуни и эвенки северной тайги",
    ],
    answer: "Алеуты Командор и эскимосы Чукотки",
    note: "Алеутская и эскимосская страницы связаны с эскимосско-алеутской языковой семьей и морской средой.",
  },
  {
    topic: "Сахалин",
    question: "Какая формула правильно разводит нивхскую и орокскую страницы?",
    options: [
      "Нивхи — Амурский лиман, Сахалин и язык-изолят; ороки/ульта — Сахалин, оленеводство и тунгусо-маньчжурский язык",
      "Нивхи — Уссурийская тайга и смешанная история; ороки/ульта — Командоры и алеутский язык",
      "Нивхи — Олюторский район и корякский контекст; ороки/ульта — Колыма и юкагирские языки",
      "Нивхи — Чукотка и юпикские языки; ороки/ульта — Нижний Амур и ульчские поселения",
    ],
    answer: "Нивхи — Амурский лиман, Сахалин и язык-изолят; ороки/ульта — Сахалин, оленеводство и тунгусо-маньчжурский язык",
    note: "Обе темы могут быть связаны с Сахалином, но языковая и хозяйственная логика у них разная.",
  },
  {
    topic: "Камчатка",
    question: "Какая связка точнее всего показывает разные камчатские страницы атласа?",
    options: [
      "Ительмены — реки и лососевый промысел; коряки — север Камчатки и оленеводство; камчадалы — смешанная история региона",
      "Ительмены — Командоры; коряки — Уссурийская тайга; камчадалы — Амурский лиман",
      "Ительмены — Нижний Амур; коряки — Сахалин; камчадалы — Берингоморские юпикские языки",
      "Ительмены — юкагирские языки; коряки — алеутский язык; камчадалы — орокский язык",
    ],
    answer: "Ительмены — реки и лососевый промысел; коряки — север Камчатки и оленеводство; камчадалы — смешанная история региона",
    note: "Камчатка в атласе не одна тема: у ительменов, коряков и камчадалов разные исторические и культурные акценты.",
  },
  {
    topic: "Север",
    question: "Какая пара лучше всего различает эвенкийскую и эвенскую страницы?",
    options: [
      "Эвенки — северная тайга, охота и широкие маршруты; эвены — Охотское побережье, северные переходы и оленеводство",
      "Эвенки — Командоры и островной промысел; эвены — Нижний Амур и оседлые поселения",
      "Эвенки — юпикские языки Чукотки; эвены — язык-изолят Сахалина",
      "Эвенки — смешанная история Приморья; эвены — Олюторское побережье и корякский контекст",
    ],
    answer: "Эвенки — северная тайга, охота и широкие маршруты; эвены — Охотское побережье, северные переходы и оленеводство",
    note: "Оба народа связаны с севером и оленеводческой темой, но в атласе акценты разведены через территорию и маршруты.",
  },
  {
    topic: "Приморье",
    question: "Какая пара верно относится к южной тайге и Приморью?",
    options: [
      "Удэгейцы — Сихотэ-Алинь, Хор и Анюй; тазы — Приморье и сложная история культурных контактов",
      "Удэгейцы — Командоры и алеутский язык; тазы — север Камчатки и корякский контекст",
      "Удэгейцы — Анадырь и чуванская история; тазы — Амурский лиман и язык-изолят",
      "Удэгейцы — Чукотка и морской промысел; тазы — Сахалин и ульта",
    ],
    answer: "Удэгейцы — Сихотэ-Алинь, Хор и Анюй; тазы — Приморье и сложная история культурных контактов",
    note: "Удэгейская и тазская темы помогают показать южный Дальний Восток без смешивания разных историй.",
  },
  {
    topic: "Малочисленность",
    question: "Почему керекская страница требует особенно осторожной подачи?",
    options: [
      "Из-за крайней малочисленности народа и критической хрупкости языка",
      "Потому что кереки являются крупной городской группой без локального ареала",
      "Потому что керекская тема полностью совпадает с нанайской",
      "Потому что кереки относятся к Командорским алеутам",
    ],
    answer: "Из-за крайней малочисленности народа и критической хрупкости языка",
    note: "Для кереков особенно важны точность, локальный контекст южной Чукотки и отсутствие грубых обобщений.",
  },
  {
    topic: "Контакты",
    question: "Какая страница атласа специально показывает сложную историю формирования на пересечении культурных влияний Приморья?",
    options: ["Тазы", "Алеуты", "Негидальцы", "Ительмены"],
    answer: "Тазы",
    note: "Тазская тема связана с Приморьем, Уссурийской тайгой и сложной историей контактов местной, китайской, тунгусо-маньчжурской и русской сред.",
  },
  {
    topic: "Анадырь",
    question: "Какой нюанс важен для понимания чуванцев?",
    options: [
      "Связь с бассейном Анадыря и сложная история языковой ассимиляции",
      "Островная жизнь на Командорах и алеутский язык",
      "Сахалинское оленеводство и самоназвание ульта",
      "Нижний Амур, речные поселения и ульчский язык",
    ],
    answer: "Связь с бассейном Анадыря и сложная история языковой ассимиляции",
    note: "Чуванская тема важна как пример сложной истории идентичности, соседства и языковых изменений.",
  },
  {
    topic: "Амгунь",
    question: "Какое различие внутри народа отдельно подчеркнуто в материалах о негидальцах?",
    options: [
      "Верховские и низовские группы в бассейне Амгуни",
      "Островные и командорские группы",
      "Приморские и юпикские группы Берингова пролива",
      "Олюторские и алеутские группы Камчатки",
    ],
    answer: "Верховские и низовские группы в бассейне Амгуни",
    note: "У негидальцев важно различать локальные группы, потому что их уклад и промысловые акценты не полностью совпадали.",
  },
  {
    topic: "Алюторцы",
    question: "Почему алюторская страница помечает близость к корякскому контексту?",
    options: [
      "Алюторская традиция локальна для северо-восточной Камчатки и близка к корякскому ареалу",
      "Алюторцы относятся к амурским речным народам Нижнего Амура",
      "Алюторский язык входит в эскимосско-алеутскую семью",
      "Алюторская тема описывает только острова Командор",
    ],
    answer: "Алюторская традиция локальна для северо-восточной Камчатки и близка к корякскому ареалу",
    note: "Алюторская тема сложная: ее важно показать как локальную традицию, связанную с корякским миром, а не растворить в общей схеме.",
  },
  {
    topic: "Острова",
    question: "Какой народ в российском контексте прежде всего связан с Командорскими островами?",
    options: ["Алеуты", "Ороки (ульта)", "Орочи", "Камчадалы"],
    answer: "Алеуты",
    note: "Алеутская страница раскрывает островную культуру Командор, морской промысел и уязвимое языковое наследие.",
  },
  {
    topic: "Метод",
    question: "Какой принцип лучше всего подходит для образовательного атласа о 20 народах Дальнего Востока?",
    options: [
      "Сопоставлять территории, языки и практики, не сводя разные культуры к одному образу",
      "Оставлять только праздничные костюмы и не объяснять территорию",
      "Заменять источники случайными пересказами без проверки",
      "Считать все северные народы одной культурной группой",
    ],
    answer: "Сопоставлять территории, языки и практики, не сводя разные культуры к одному образу",
    note: "Для такого сайта важны точность, источники, локальные различия и уважительное объяснение сложных случаев.",
  },
];

const state = {
  index: 0,
  answers: Array(questions.length).fill(null),
  optionOrders: questions.map((item) => shuffleOptions(item.options)),
};

const root = document.querySelector("[data-online-quiz]");
const stepNode = document.querySelector("[data-quiz-step]");
const scoreNode = document.querySelector("[data-quiz-score]");
const progressNode = document.querySelector("[data-quiz-progress]");
const kickerNode = document.querySelector("[data-quiz-kicker]");
const questionNode = document.querySelector("[data-quiz-question]");
const optionsNode = document.querySelector("[data-quiz-options]");
const prevButton = document.querySelector("[data-quiz-prev]");
const nextButton = document.querySelector("[data-quiz-next]");
const resultsNode = document.querySelector("[data-quiz-results]");
const resultTitle = document.querySelector("[data-result-title]");
const resultSummary = document.querySelector("[data-result-summary]");
const resultList = document.querySelector("[data-result-list]");
const restartButton = document.querySelector("[data-quiz-restart]");
const quizSurface = document.querySelector(".quiz-surface");
const quizLock = document.querySelector("[data-quiz-lock]");
const quizLockTitle = document.querySelector("[data-quiz-lock-title]");
const quizLockText = document.querySelector("[data-quiz-lock-text]");
const supabaseConfig = window.MOZAIKA_CONFIG || {};
const hasSupabaseConfig = Boolean(supabaseConfig.SUPABASE_URL && supabaseConfig.SUPABASE_ANON_KEY);
const supabaseClient =
  window.supabase && window.supabase.createClient && hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.SUPABASE_URL, supabaseConfig.SUPABASE_ANON_KEY)
    : null;
let currentUser = null;
let quizSaving = false;

function shuffleOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function answeredCount() {
  return state.answers.filter(Boolean).length;
}

function renderQuestion() {
  const item = questions[state.index];
  const selected = state.answers[state.index];
  const isLast = state.index === questions.length - 1;

  stepNode.textContent = `Вопрос ${state.index + 1} из ${questions.length}`;
  scoreNode.textContent = `${answeredCount()} выбрано`;
  progressNode.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  kickerNode.textContent = item.topic;
  questionNode.textContent = item.question;

  optionsNode.innerHTML = state.optionOrders[state.index]
    .map(
      (option) => `
        <button class="${selected === option ? "is-selected" : ""}" type="button" data-answer="${option}">
          ${option}
        </button>
      `,
    )
    .join("");

  prevButton.disabled = state.index === 0;
  nextButton.textContent = isLast ? "Завершить" : "Дальше";
  nextButton.disabled = !selected;
}

function showResultsLegacy() {
  const correct = questions.filter((item, index) => state.answers[index] === item.answer).length;
  const percent = Math.round((correct / questions.length) * 100);

  document.querySelector(".quiz-surface").hidden = true;
  resultsNode.hidden = false;
  resultTitle.textContent = `${correct} из ${questions.length}`;
  resultSummary.textContent =
    percent >= 80
      ? "Сильный результат: ты уверенно различаешь территории, языки и культурные акценты."
      : percent >= 55
        ? "Хорошая база есть. Разбор ниже покажет, где стоит перечитать материалы."
        : "Квиз оказался сложным. Разбор поможет быстро увидеть основные связки атласа.";

  resultList.innerHTML = questions
    .map((item, index) => {
      const userAnswer = state.answers[index];
      const isCorrect = userAnswer === item.answer;
      return `
        <article class="${isCorrect ? "is-correct" : "is-wrong"}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.topic}</span>
          <h3>${item.question}</h3>
          <p><strong>Ваш ответ:</strong> ${userAnswer || "Нет ответа"}</p>
          <p><strong>Правильный ответ:</strong> ${item.answer}</p>
          <p>${item.note}</p>
        </article>
      `;
    })
    .join("");

  resultsNode.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildResultDetails() {
  const correct = questions.filter((item, index) => state.answers[index] === item.answer).length;
  const percent = Math.round((correct / questions.length) * 100);
  const details = questions.map((item, index) => ({
    topic: item.topic,
    question: item.question,
    answer: state.answers[index],
    correctAnswer: item.answer,
    isCorrect: state.answers[index] === item.answer,
  }));

  return { correct, percent, details };
}

function renderSavedResults({ correct, percent, details, savedAt, alreadyPassed = false }) {
  quizSurface.hidden = true;
  if (quizLock) quizLock.hidden = true;
  resultsNode.hidden = false;
  resultTitle.textContent = `${correct} из ${questions.length}`;
  resultSummary.textContent =
    (alreadyPassed
      ? "Вы уже проходили этот квиз. Повторная попытка закрыта, ниже сохранённый разбор ответов."
      : percent >= 80
        ? "Сильный результат: вы уверенно различаете территории, языки и культурные акценты."
        : percent >= 55
          ? "Хорошая база есть. Разбор ниже покажет, где стоит перечитать материалы."
          : "Квиз оказался сложным. Разбор поможет быстро увидеть основные связки атласа.") +
    (savedAt ? ` Результат сохранён: ${new Date(savedAt).toLocaleString("ru-RU")}.` : "");

  resultList.innerHTML = questions
    .map((item, index) => {
      const detail = details[index] || {};
      const userAnswer = detail.answer;
      const isCorrect = Boolean(detail.isCorrect);
      return `
        <article class="${isCorrect ? "is-correct" : "is-wrong"}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.topic}</span>
          <h3>${item.question}</h3>
          <p><strong>Ваш ответ:</strong> ${userAnswer || "Нет ответа"}</p>
          <p><strong>Правильный ответ:</strong> ${detail.correctAnswer || item.answer}</p>
          <p>${item.note}</p>
        </article>
      `;
    })
    .join("");

  restartButton.hidden = true;
  resultsNode.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function saveQuizResult(result) {
  if (!supabaseClient || !currentUser) {
    throw new Error("Для сохранения результата нужно войти в аккаунт.");
  }

  const { error } = await supabaseClient.from("quiz_results").insert({
    user_id: currentUser.id,
    email: currentUser.email,
    score: result.correct,
    total: questions.length,
    percent: result.percent,
    answers: state.answers,
    details: result.details,
  });

  if (error) throw error;
}

async function showResults() {
  const result = buildResultDetails();
  renderSavedResults(result);

  try {
    await saveQuizResult(result);
  } catch (error) {
    if (String(error?.code) === "23505") {
      resultSummary.textContent += " Результат уже был сохранён ранее, повторная попытка не записана.";
      return;
    }

    resultSummary.textContent += " Результат показан на экране, но не сохранился. Проверьте таблицу quiz_results в Supabase.";
  }
}

function showQuizLock(title, text) {
  quizSurface.hidden = true;
  resultsNode.hidden = true;
  if (!quizLock) return;
  quizLock.hidden = false;
  quizLockTitle.textContent = title;
  quizLockText.textContent = text;
}

async function loadExistingResult() {
  const { data, error } = await supabaseClient
    .from("quiz_results")
    .select("score,total,percent,answers,details,created_at")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) throw error;
  return data;
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

async function initQuiz() {
  initMobileHeaderCollapse();
  quizSurface.hidden = true;
  resultsNode.hidden = true;

  if (!supabaseClient) {
    showQuizLock(
      "Регистрация временно недоступна",
      "Для квиза нужна авторизация через Supabase. Проверьте, что SUPABASE_URL и SUPABASE_ANON_KEY указаны в config.js.",
    );
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session?.user) {
    showQuizLock(
      "Квиз доступен после входа",
      "Зарегистрируйтесь или войдите в аккаунт, чтобы пройти квиз. Результат сохраняется один раз.",
    );
    return;
  }

  currentUser = data.session.user;

  try {
    const existing = await loadExistingResult();
    if (existing) {
      state.answers = Array.isArray(existing.answers) ? existing.answers : state.answers;
      renderSavedResults({
        correct: existing.score,
        percent: existing.percent,
        details: Array.isArray(existing.details) ? existing.details : buildResultDetails().details,
        savedAt: existing.created_at,
        alreadyPassed: true,
      });
      return;
    }
  } catch (_error) {
    showQuizLock(
      "Нужна таблица результатов",
      "Создайте таблицу quiz_results в Supabase по инструкции. После этого квиз начнёт сохранять результаты.",
    );
    return;
  }

  if (quizLock) quizLock.hidden = true;
  quizSurface.hidden = false;
  renderQuestion();
}

optionsNode.addEventListener("click", (event) => {
  const button = event.target.closest("[data-answer]");
  if (!button) return;
  state.answers[state.index] = button.dataset.answer;
  renderQuestion();
});

prevButton.addEventListener("click", () => {
  if (state.index === 0) return;
  state.index -= 1;
  renderQuestion();
});

nextButton.addEventListener("click", async () => {
  if (!state.answers[state.index] || quizSaving) return;
  if (state.index === questions.length - 1) {
    quizSaving = true;
    nextButton.disabled = true;
    nextButton.textContent = "Сохраняю...";
    await showResults();
    quizSaving = false;
    return;
  }
  state.index += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  state.index = 0;
  state.answers = Array(questions.length).fill(null);
  state.optionOrders = questions.map((item) => shuffleOptions(item.options));
  resultsNode.hidden = true;
  document.querySelector(".quiz-surface").hidden = false;
  renderQuestion();
  root.scrollIntoView({ behavior: "smooth", block: "start" });
});

initQuiz();
