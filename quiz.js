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

const state = { index: 0, answers: Array(questions.length).fill(null), optionOrders: questions.map(item => shuffleOptions(item.options)) };
const root = document.querySelector('[data-online-quiz]');
const stepNode = document.querySelector('[data-quiz-step]');
const scoreNode = document.querySelector('[data-quiz-score]');
const progressNode = document.querySelector('[data-quiz-progress]');
const kickerNode = document.querySelector('[data-quiz-kicker]');
const questionNode = document.querySelector('[data-quiz-question]');
const optionsNode = document.querySelector('[data-quiz-options]');
const prevButton = document.querySelector('[data-quiz-prev]');
const nextButton = document.querySelector('[data-quiz-next]');
const resultsNode = document.querySelector('[data-quiz-results]');
const resultTitle = document.querySelector('[data-result-title]');
const resultSummary = document.querySelector('[data-result-summary]');
const resultList = document.querySelector('[data-result-list]');
const restartButton = document.querySelector('[data-quiz-restart]');
const quizSurface = document.querySelector('.quiz-surface');
const quizLock = document.querySelector('[data-quiz-lock]');
const storageNotice = document.querySelector('[data-quiz-storage]');
const modeNode = document.querySelector('[data-quiz-mode]');
const resultStorage = document.querySelector('[data-result-storage]');
const config = window.MOZAIKA_CONFIG || {};
const supabaseClient = window.supabase?.createClient && config.SUPABASE_URL && config.SUPABASE_ANON_KEY
  ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY) : null;
const GUEST_KEY = 'mozaika.quiz.guest.v1';
let currentUser = null;
let quizSaving = false;
function shuffleOptions(options) {
  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function validAnswers(answers) {
  return Array.isArray(answers) && answers.length === questions.length && answers.every((answer, index) => questions[index].options.includes(answer));
}
function readGuestResult() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_KEY));
    if (saved?.version !== 1 || !validAnswers(saved.answers) || !Number.isFinite(Date.parse(saved.savedAt))) return null;
    return saved;
  } catch { return null; }
}
function writeGuestResult() {
  const savedAt = new Date().toISOString();
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify({version: 1, answers: state.answers, savedAt}));
    return savedAt;
  } catch { return null; }
}
function updateMode() {
  modeNode.textContent = currentUser ? 'В аккаунте' : 'Без регистрации';
  storageNotice.textContent = currentUser
    ? 'Результат этой попытки сохранится в вашем аккаунте.'
    : 'Результат сохранится только в этом браузере. При очистке данных сайта он удалится.';
}
function renderQuestion(moveFocus = false) {
  const item = questions[state.index];
  stepNode.textContent = `Вопрос ${state.index + 1} из ${questions.length}`;
  scoreNode.textContent = `Отвечено: ${state.answers.filter(Boolean).length}`;
  progressNode.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  kickerNode.textContent = item.topic;
  questionNode.textContent = item.question;
  optionsNode.replaceChildren(...state.optionOrders[state.index].map((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.answer = option;
    button.setAttribute('aria-pressed', String(state.answers[state.index] === option));
    button.classList.toggle('is-selected', state.answers[state.index] === option);
    const number = document.createElement('span'); number.className = 'answer-number'; number.textContent = String(index + 1).padStart(2,'0'); number.setAttribute('aria-hidden','true');
    const text = document.createElement('span'); text.textContent = option;
    button.append(number, text);
    return button;
  }));
  prevButton.disabled = state.index === 0;
  nextButton.textContent = state.index === questions.length - 1 ? 'Узнать результат' : 'Следующий вопрос';
  nextButton.disabled = !state.answers[state.index];
  if (moveFocus) questionNode.focus({preventScroll:true});
}
function buildResultDetails() {
  const details = questions.map((item,index) => ({topic:item.topic,question:item.question,answer:state.answers[index],correctAnswer:item.answer,isCorrect:state.answers[index]===item.answer}));
  const correct = details.filter(item=>item.isCorrect).length;
  return { correct, percent: Math.round(correct/questions.length*100), details };
}
function renderSavedResults({correct,percent,details,savedAt,alreadyPassed=false}, storage='guest') {
  quizSurface.hidden = true; quizLock.hidden = true; resultsNode.hidden = false;
  resultTitle.textContent = `${correct} из ${questions.length}`;
  resultSummary.textContent = alreadyPassed ? 'Ваш сохранённый результат. Откройте любой вопрос, чтобы посмотреть разбор.'
    : percent>=80 ? 'Вы хорошо знаете народы Дальнего Востока. Посмотрите, какие темы удалось разобрать точнее всего.'
    : percent>=55 ? 'Хорошее начало. Разбор ответов поможет закрепить знания.' : 'Каждый вопрос — повод узнать больше. Посмотрите объяснения и вернитесь к атласу.';
  resultStorage.textContent = savedAt ? `${storage==='account'?'Сохранено в аккаунте':'Сохранено только в этом браузере'} · ${new Date(savedAt).toLocaleDateString('ru-RU')}` : 'Сохраняем результат…';
  resultList.innerHTML = questions.map((item,index)=>{
    const detail=details[index] || {};
    return `<details class="quiz-review-item ${detail.isCorrect?'is-correct':'is-wrong'}"><summary><span class="review-number">${String(index+1).padStart(2,'0')}</span><span>${escapeHtml(item.topic)}<strong>${escapeHtml(item.question)}</strong></span><span class="review-status">${detail.isCorrect?'Верно':'Разобрать'}</span></summary><div class="review-explanation"><p><strong>Ваш ответ:</strong> ${escapeHtml(detail.answer || 'Нет ответа')}</p><p><strong>Правильный ответ:</strong> ${escapeHtml(item.answer)}</p><p>${escapeHtml(item.note)}</p></div></details>`;
  }).join('');
  restartButton.hidden = Boolean(currentUser);
  resultTitle.focus({preventScroll:true});
  resultsNode.scrollIntoView({behavior:'auto',block:'start'});
}
async function saveQuizResult(result) {
  // A guest attempt never writes to Supabase, even if another tab signs in.
  if (!currentUser) return {storage:'guest', savedAt:writeGuestResult()};
  const {data,error:sessionError}=await supabaseClient.auth.getSession();
  if (sessionError || data.session?.user?.id !== currentUser.id) throw new Error('Сессия изменилась. Войдите в тот же аккаунт, чтобы сохранить результат.');
  const {error}=await supabaseClient.from('quiz_results').insert({user_id:currentUser.id,email:currentUser.email,score:result.correct,total:questions.length,percent:result.percent,answers:state.answers,details:result.details});
  if(error) throw error;
  return {storage:'account', savedAt:new Date().toISOString()};
}
async function showResults() {
  const result=buildResultDetails();
  renderSavedResults(result);
  try {
    const saved=await saveQuizResult(result);
    resultStorage.textContent = saved.savedAt ? (saved.storage==='guest'?'Сохранено только в этом браузере. В аккаунт результат не отправлялся.':'Результат сохранён в аккаунте.') : 'Браузер не разрешил сохранить данные. Результат доступен до закрытия страницы.';
  } catch(error) {
    resultStorage.textContent = String(error?.code)==='23505' ? 'В аккаунте уже есть результат. Эта попытка его не заменяет.' : 'Результат показан, но сохранить его в аккаунте не удалось. Проверьте соединение и вход в аккаунт.';
  }
}
function startGuest() {
  currentUser=null; updateMode(); quizLock.hidden=true;
  const saved=readGuestResult();
  if(saved) {
    state.answers=saved.answers;
    renderSavedResults({...buildResultDetails(),savedAt:saved.savedAt,alreadyPassed:true});
  } else { quizSurface.hidden=false; resultsNode.hidden=true; renderQuestion(); }
}
async function initQuiz() {
  quizSurface.hidden=true; resultsNode.hidden=true;
  if(!supabaseClient) { startGuest(); return; }
  try {
    const {data,error}=await supabaseClient.auth.getSession();
    if(error || !data.session?.user) { startGuest(); return; }
    currentUser=data.session.user; updateMode();
    const {data:existing,error:loadError}=await supabaseClient.from('quiz_results').select('score,total,percent,answers,details,created_at').eq('user_id',currentUser.id).maybeSingle();
    if(loadError) {
      quizLock.hidden=false;
      document.querySelector('[data-quiz-lock-title]').textContent='Не удалось загрузить результат аккаунта';
      document.querySelector('[data-quiz-lock-text]').textContent='Можно пройти квиз в гостевом режиме — результат останется в этом браузере.';
      return;
    }
    if(existing) {
      const details=Array.isArray(existing.details)?existing.details:[];
      renderSavedResults({correct:existing.score,percent:existing.percent,details,savedAt:existing.created_at,alreadyPassed:true},'account');
    } else { quizLock.hidden=true; quizSurface.hidden=false; renderQuestion(); }
  } catch { startGuest(); }
}
optionsNode.addEventListener('click',event=>{
  const button=event.target.closest('[data-answer]'); if(!button) return;
  state.answers[state.index]=button.dataset.answer;
  optionsNode.querySelectorAll('button').forEach(item=>{const selected=item===button;item.classList.toggle('is-selected',selected);item.setAttribute('aria-pressed',String(selected));});
  scoreNode.textContent=`Отвечено: ${state.answers.filter(Boolean).length}`;
  nextButton.disabled=false;
});
prevButton.addEventListener('click',()=>{if(state.index>0){state.index--;renderQuestion(true);}});
nextButton.addEventListener('click',async()=>{
  if(!state.answers[state.index] || quizSaving)return;
  if(state.index<questions.length-1){state.index++;renderQuestion(true);return;}
  quizSaving=true; nextButton.disabled=true;
  try {await showResults();} finally {quizSaving=false;}
});
restartButton.addEventListener('click',()=>{
  if(currentUser)return;
  try{localStorage.removeItem(GUEST_KEY);}catch{}
  state.index=0;state.answers=Array(questions.length).fill(null);state.optionOrders=questions.map(item=>shuffleOptions(item.options));
  resultsNode.hidden=true;quizSurface.hidden=false;renderQuestion(true);
  quizSurface.scrollIntoView({behavior:'auto',block:'start'});
});
document.querySelector('[data-start-guest]').addEventListener('click',startGuest);
initQuiz();
