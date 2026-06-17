const questions = [
  {
    topic: "Амур",
    question: "Какая связка точнее всего описывает нанайский культурный контекст в материалах атласа?",
    options: [
      "Охотское побережье, оленеводство и сезонные переходы",
      "Татарский пролив, морской зверь и язык-изолят",
      "Амур, рыболовство, орнамент и рыбья кожа",
      "Амгунь, верховские группы и близость к эвенкийскому языку",
    ],
    answer: "Амур, рыболовство, орнамент и рыбья кожа",
    note: "Нанайская страница строится вокруг Амура, промысла, орнамента и ремесел, включая работу с рыбьей кожей.",
  },
  {
    topic: "Языки",
    question: "Какой язык в атласе выделен как язык-изолят, а не как часть тунгусо-маньчжурской семьи?",
    options: ["Нанайский", "Орочский", "Нивхский", "Эвенский"],
    answer: "Нивхский",
    note: "Нивхский язык обычно рассматривается отдельно; это одна из причин, почему тема нивхов требует особой точности.",
  },
  {
    topic: "Нижний Амур",
    question: "Какая формула лучше всего отделяет ульчскую тему от удэгейской?",
    options: [
      "Горно-таежные маршруты Хора и Анюя",
      "Оседлые поселения Нижнего Амура и речной промысел",
      "Охотское побережье и кочевое оленеводство",
      "Северный Сахалин и язык-изолят",
    ],
    answer: "Оседлые поселения Нижнего Амура и речной промысел",
    note: "Ульчи связаны с нижним течением Амура, постоянным берегом, рыболовством, лодками и амурским соседством.",
  },
  {
    topic: "Побережье",
    question: "У какого народа территория в атласе соединяет низовья Амура, лиман, Татарский пролив и Сахалин?",
    options: ["Эвенки", "Негидальцы", "Нанайцы", "Нивхи"],
    answer: "Нивхи",
    note: "Нивхская тема соединяет речную и морскую среду: Амурский лиман, побережье, пролив и Сахалин.",
  },
  {
    topic: "Маршруты",
    question: "Для какого народа ключевой образ строится вокруг переходов между Тумнином, тайгой и Татарским проливом?",
    options: ["Ульчи", "Эвены", "Орочи", "Нанайцы"],
    answer: "Орочи",
    note: "Орочская культура описана через побережье, тайгу, реку Тумнин и маршруты между лесом, рекой и морем.",
  },
  {
    topic: "Тайга",
    question: "Какая пара рек в материалах особенно связана с удэгейской темой Хабаровского края?",
    options: ["Амгунь и Амур", "Тумнин и Уссури", "Хор и Анюй", "Лена и Алдан"],
    answer: "Хор и Анюй",
    note: "Для удэгейцев в краевом контексте важны бассейны рек Хор и Анюй, таежные маршруты, дерево и береста.",
  },
  {
    topic: "Амгунь",
    question: "Какое различие внутри народа отдельно подчеркнуто в материалах о негидальцах?",
    options: [
      "Островные и материковые группы",
      "Городские и степные группы",
      "Верховские и низовские группы",
      "Южные и западные группы Кавказа",
    ],
    answer: "Верховские и низовские группы",
    note: "У негидальцев важно различать верховские и низовские группы: у них отличались уклад, мобильность и промысловые акценты.",
  },
  {
    topic: "Север",
    question: "Что в атласе сильнее всего связывает эвенкийскую культуру с северной тайгой?",
    options: [
      "Оседлые поселения Нижнего Амура и юкола",
      "Лиман, язык-изолят и морской промысел",
      "Культура движения, охота, оленеводство и сезонные маршруты",
      "Побережье Татарского пролива и малые стойбища орочей",
    ],
    answer: "Культура движения, охота, оленеводство и сезонные маршруты",
    note: "Эвенкийская страница говорит о мобильности, охоте, оленеводстве, маршрутах и знании тайги.",
  },
  {
    topic: "Охотское море",
    question: "Какой народ в атласе связан с Охотским побережьем, северными маршрутами и оленеводством?",
    options: ["Ульчи", "Нанайцы", "Эвены", "Орочи"],
    answer: "Эвены",
    note: "Эвенская тема соединяет Охотское побережье, северные маршруты, сезонность и оленеводство.",
  },
  {
    topic: "Семьи языков",
    question: "Какая группа в вопросе полностью относится к тунгусо-маньчжурской семье по материалам сайта?",
    options: [
      "Нивхский, нанайский, ульчский, эвенский",
      "Нивхский, орочский, удэгейский, эвенкийский",
      "Нанайский, нивхский, эвенский, негидальский",
      "Нанайский, ульчский, орочский, удэгейский",
    ],
    answer: "Нанайский, ульчский, орочский, удэгейский",
    note: "Нанайский, ульчский, орочский и удэгейский указаны как тунгусо-маньчжурские; нивхский выделен отдельно.",
  },
  {
    topic: "Материальная культура",
    question: "Какая пара точнее всего сопоставляет народ и характерный материал/ремесло из атласа?",
    options: [
      "Нивхи — виноградная лоза",
      "Удэгейцы — береста и дерево",
      "Эвены — кирпичная кладка",
      "Ульчи — каменные крепости",
    ],
    answer: "Удэгейцы — береста и дерево",
    note: "В удэгейской теме отдельно выделены дерево, береста, лодки и знания тайги.",
  },
  {
    topic: "Промысел",
    question: "У какой культуры море и река вместе задают промысловый и пространственный контекст?",
    options: ["Негидальцы", "Удэгейцы", "Эвенки", "Нивхи"],
    answer: "Нивхи",
    note: "Нивхская культура в материалах раскрывается на границе Амура, лимана, морского побережья и Сахалина.",
  },
  {
    topic: "Малочисленность",
    question: "Почему раздел о негидальцах особенно подчеркивает бережность и точность?",
    options: [
      "Потому что народ не связан с Хабаровским краем",
      "Потому что материалы описывают только современный город",
      "Из-за очень малой численности и хрупкости языковой памяти",
      "Из-за отсутствия речного контекста",
    ],
    answer: "Из-за очень малой численности и хрупкости языковой памяти",
    note: "Негидальская тема в атласе связана с малочисленностью, Амгунью и крайне уязвимой языковой памятью.",
  },
  {
    topic: "Орнамент",
    question: "Где в материалах об эвенах орнамент связан с одеждой, бисером, краями и швами?",
    options: [
      "В блоке о рыбьей коже нанайцев",
      "В блоке о языке-изоляте нивхов",
      "В блоке о лодках ульчей",
      "В блоке о защите и форме вещи",
    ],
    answer: "В блоке о защите и форме вещи",
    note: "В эвенской странице орнамент на одежде связывается с краями, швами, формой вещи и защитным смыслом.",
  },
  {
    topic: "Сравнение",
    question: "Какое сопоставление территорий составлено без ошибки?",
    options: [
      "Ульчи — Сахалин; удэгейцы — Амурский лиман; эвены — Нижний Амур",
      "Орочи — Амгунь; негидальцы — Татарский пролив; нанайцы — Охотское море",
      "Ульчи — Нижний Амур; удэгейцы — Хор и Анюй; эвены — Охотское побережье",
      "Нивхи — Хор и Анюй; эвенки — Нижний Амур; ульчи — Сихотэ-Алинь",
    ],
    answer: "Ульчи — Нижний Амур; удэгейцы — Хор и Анюй; эвены — Охотское побережье",
    note: "Эта цепочка совпадает с материалами атласа: ульчи связаны с Нижним Амуром, удэгейцы — с Хором и Анюем, эвены — с Охотским побережьем.",
  },
];

const state = {
  index: 0,
  answers: Array(questions.length).fill(null),
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

  optionsNode.innerHTML = item.options
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

function showResults() {
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

nextButton.addEventListener("click", () => {
  if (!state.answers[state.index]) return;
  if (state.index === questions.length - 1) {
    showResults();
    return;
  }
  state.index += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  state.index = 0;
  state.answers = Array(questions.length).fill(null);
  resultsNode.hidden = true;
  document.querySelector(".quiz-surface").hidden = false;
  renderQuestion();
  root.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderQuestion();
