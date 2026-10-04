const STORAGE_KEY = "trading-mastery-coach-v1";

const defaultState = {
  completedConcepts: [],
  mistakes: [],
  reviews: [],
  reviewStats: {},
};

const concepts = [
  { id: "symbol-anatomy", title: "Symbol anatomy", source: "Part I · pp. 13–14", available: true, lesson: "part1" },
  { id: "month-codes", title: "Contract-month codes", source: "Part I · p. 14" },
  { id: "participants", title: "Hedgers and speculators", source: "Part I · p. 12" },
  { id: "contracts-ticks", title: "Contracts and ticks", source: "Part I · p. 22" },
  { id: "expiry-settlement", title: "Expiration and settlement", source: "Part I · p. 22" },
  { id: "rollover", title: "Front month and rollover", source: "Part II · pp. 6–8", available: true, lesson: "part2" },
  { id: "chart-gaps", title: "Chart types and gaps", source: "Part II · pp. 8–13", available: true, lesson: "part2" },
  { id: "timeframe-roles", title: "Futures timeframe roles", source: "Part III · pp. 3–4", available: true, lesson: "part3" },
  { id: "globex-traps", title: "Globex trap map", source: "Part III · pp. 7–12", available: true, lesson: "part3" },
  { id: "strategy-boundary", title: "Evidence boundary", source: "Parts I–III" },
  { id: "mes-risk", title: "MES risk arithmetic", source: "CME contract specifications", available: true },
  { id: "order-safety", title: "Order and position safety", source: "CME order-type education", available: true },
];

const practiceQuestions = [
  {
    id: "month-q",
    concept: "symbol-anatomy",
    prompt: "In GCQ23, what does Q identify?",
    options: ["The exchange", "The August contract month", "The tick value"],
    answer: 1,
    explanation: "Q is the standard contract-month code for August.",
  },
  {
    id: "month-m",
    concept: "month-codes",
    prompt: "Which month uses the code M?",
    options: ["March", "May", "June"],
    answer: 2,
    explanation: "M identifies June. March is H and May is K.",
  },
  {
    id: "month-z",
    concept: "month-codes",
    prompt: "Which contract month uses the code Z?",
    options: ["September", "November", "December"],
    answer: 2,
    explanation: "Z is the standard contract-month code for December.",
  },
  {
    id: "missing-piece",
    concept: "symbol-anatomy",
    prompt: "Why is GC23 incomplete as a dated contract symbol?",
    options: ["It lacks a month code", "It lacks a product root", "It lacks a year"],
    answer: 0,
    explanation: "GC provides the product root and 23 provides the year; the contract month is missing.",
  },
  {
    id: "commercial",
    concept: "participants",
    prompt: "An airline locks in future fuel pricing primarily to reduce operating-cost uncertainty. Which role fits?",
    options: ["Commercial hedger", "Retail speculator", "Market-data vendor"],
    answer: 0,
    explanation: "The notes use commercial traders as hedgers who secure prices used in their operations.",
  },
  {
    id: "speculator",
    concept: "participants",
    prompt: "A trader participates to profit from price movement rather than reduce an operating exposure. Which role fits?",
    options: ["Commercial hedger", "Speculator", "Clearing house"],
    answer: 1,
    explanation: "The notes distinguish speculators seeking price-movement opportunity from commercial hedgers reducing business risk.",
  },
  {
    id: "ticks",
    concept: "contracts-ticks",
    prompt: "What extra fact is needed to convert a futures tick move into dollars?",
    options: ["The candle color", "The contract's tick value", "The chart background"],
    answer: 1,
    explanation: "A tick is a price increment; its dollar value comes from the exact contract specification.",
  },
  {
    id: "contracts",
    concept: "contracts-ticks",
    prompt: "What unit is bought or sold in the futures market described in Part I?",
    options: ["Contracts", "Shares", "Currency lots"],
    answer: 0,
    explanation: "Part I describes futures positions in contracts; the exact contract specifications determine tick value and obligations.",
  },
  {
    id: "settlement",
    concept: "expiry-settlement",
    prompt: "What must be checked before holding a futures contract toward expiration?",
    options: ["Only its ticker color", "Its settlement and expiration rules", "Only yesterday's volume"],
    answer: 1,
    explanation: "The exact contract can use physical delivery or cash settlement and has contract-specific deadlines.",
  },
  {
    id: "settlement-types",
    concept: "expiry-settlement",
    prompt: "Which pair of settlement outcomes is identified in the Part I notes?",
    options: ["Physical delivery and cash settlement", "Stock split and dividend", "Limit order and market order"],
    answer: 0,
    explanation: "The notes identify physical delivery and cash settlement as contract-dependent outcomes.",
  },
  {
    id: "rollover-volume",
    concept: "rollover",
    prompt: "According to Part II, when has rollover occurred?",
    options: ["When the back-month volume exceeds the front-month volume", "On the first day of every month", "Whenever price gaps overnight"],
    answer: 0,
    explanation: "Part II defines rollover by the liquidity shift: the back month becomes the new front month when its volume exceeds the old front month.",
  },
  {
    id: "front-month",
    concept: "rollover",
    prompt: "What identifies the front-month contract in the Part II notes?",
    options: ["The farthest expiration", "The contract with the most trading volume", "The contract with the widest spread"],
    answer: 1,
    explanation: "The notes define the front month as the contract with the most volume being traded.",
  },
  {
    id: "gap-chart",
    concept: "chart-gaps",
    prompt: "A gap appears only on an unadjusted continuous chart at the switch between contract months. What is it?",
    options: ["A natural gap", "A rollover gap", "A confirmed entry signal"],
    answer: 1,
    explanation: "Part II says rollover gaps arise from the price difference between contract months and appear on unadjusted continuous charts.",
  },
  {
    id: "natural-gap",
    concept: "chart-gaps",
    prompt: "Where can a natural gap appear according to Part II?",
    options: ["Contract-specific and unadjusted continuous charts", "Only adjusted continuous charts", "Only a DOM ladder"],
    answer: 0,
    explanation: "Natural gaps can appear on contract-specific and unadjusted continuous charts when the asset does not trade continuously or gaps while closed.",
  },
  {
    id: "intraday-timeframes",
    concept: "timeframe-roles",
    prompt: "For short-term/hourly intraday trading, which Part III mapping is shown?",
    options: ["1-hour HTF, 15-minute ITF, 5-minute LTF", "Daily HTF, 1-hour ITF, 1-minute LTF", "Weekly HTF, daily ITF, 4-hour LTF"],
    answer: 0,
    explanation: "Part III maps short-term/hourly intraday work to 1-hour context, 15-minute intermediate structure, and 5-minute lower-timeframe execution work.",
  },
  {
    id: "daily-timeframes",
    concept: "timeframe-roles",
    prompt: "For daily intraday trading, which Part III mapping is shown?",
    options: ["4-hour HTF, 1-hour ITF, 15-minute LTF", "1-hour HTF, 15-minute ITF, 5-minute LTF", "Monthly HTF, weekly ITF, daily LTF"],
    answer: 0,
    explanation: "The daily-intraday mapping shown is 4-hour HTF, 1-hour ITF, and 15-minute LTF.",
  },
  {
    id: "bear-trap",
    concept: "globex-traps",
    prompt: "Which context describes the Part III Globex bear-trap candidate?",
    options: ["Price breaks below the Globex low into institutional demand, especially with an uptrend", "Price breaks above the Globex high into demand", "Any red candle during the overnight session"],
    answer: 0,
    explanation: "The notes pair a downside break of the Globex low with institutional demand, especially in an overall uptrend and consistent range.",
  },
  {
    id: "bull-trap",
    concept: "globex-traps",
    prompt: "Which context describes the Part III Globex bull-trap candidate?",
    options: ["Price breaks above the Globex high into institutional supply, especially with a downtrend", "Price breaks below the Globex low into supply", "Every upside breakout"],
    answer: 0,
    explanation: "The notes pair an upside break of the Globex high with institutional supply, especially in an overall downtrend and consistent range.",
  },
  {
    id: "trap-boundary",
    concept: "strategy-boundary",
    prompt: "Do the Part III class-note slides specify an exact entry trigger, stop price, and target formula for Globex traps?",
    options: ["Yes, all three", "No; those details are not shown on the slides", "Only for MES"],
    answer: 1,
    explanation: "The slides establish context and direction, but the exact trigger, stop placement, target selection, and expiry are not stated there. They remain UNKNOWN unless video evidence confirms them.",
  },
  {
    id: "strategy",
    concept: "strategy-boundary",
    prompt: "Does Futures Focus Part I provide a confirmed entry, stop, and target system?",
    options: ["Yes", "No", "Only for Gold"],
    answer: 1,
    explanation: "Part I is foundational. No executable entry, stop, target, or sizing system is shown in the written notes.",
  },
  {
    id: "performance",
    concept: "strategy-boundary",
    prompt: "Does Part I document a verified win rate or backtest result?",
    options: ["Yes", "No", "Only for Gold"],
    answer: 1,
    explanation: "No verified win rate, backtest, or live-performance record is documented in the Part I written notes.",
  },
  {
    id: "mes-tick",
    concept: "mes-risk",
    prompt: "For one MES futures contract, what is one 0.25-point tick worth?",
    options: ["$1.25", "$5", "$12.50"],
    answer: 0,
    explanation: "CME lists MES at $5 per index point, so 0.25 point is $1.25 per contract.",
  },
  {
    id: "mes-stop-math",
    concept: "mes-risk",
    prompt: "In a practice example, one MES contract has a 10-point entry-to-stop distance. What is the planned price-move loss before costs or slippage?",
    options: ["$12.50", "$50", "$500"],
    answer: 1,
    explanation: "10 index points × $5 per point × 1 contract = $50 before fees and possible slippage. A stop is not a guaranteed fill price.",
  },
  {
    id: "mes-two-contracts",
    concept: "mes-risk",
    prompt: "In that same 10-point practice example, what changes if the position is two MES contracts?",
    options: ["The planned price-move loss doubles to $100", "The tick size doubles", "The risk stays $50"],
    answer: 0,
    explanation: "The contract's tick size does not change. The planned price-move loss is 10 × $5 × 2 = $100 before costs or slippage.",
  },
  {
    id: "sell-while-long",
    concept: "order-safety",
    prompt: "You are long 1 contract. What does a filled Sell 1 normally do?",
    options: ["Closes the long and returns the position to flat", "Adds another long", "Guarantees a profit"],
    answer: 0,
    explanation: "A filled sell offsets one long contract. Always verify the resulting position quantity; an extra sell after flat can open a short.",
  },
  {
    id: "sell-while-flat",
    concept: "order-safety",
    prompt: "You are flat. What can a filled Sell 1 market order do?",
    options: ["Nothing", "Open a short position", "Create a stop automatically"],
    answer: 1,
    explanation: "When flat, a filled sell can establish a short position. The word Sell does not always mean ‘close.’ Position state matters.",
  },
  {
    id: "stop-working",
    concept: "order-safety",
    prompt: "Which evidence best confirms a long position actually has stop protection?",
    options: ["A stop value typed into a form", "A working Sell Stop for the correct quantity below the market", "The trade currently shows a profit"],
    answer: 1,
    explanation: "Typed values are not protection until the order is submitted and accepted. Confirm side, type, quantity, price, and Working status.",
  },
  {
    id: "market-order",
    concept: "order-safety",
    prompt: "What does a market order prioritize?",
    options: ["Execution, not a guaranteed price", "A guaranteed fill price", "Automatic loss protection"],
    answer: 0,
    explanation: "A market order seeks immediate execution, but the exact fill price can differ—especially in fast or thin markets.",
  },
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const reviewStats = Object.fromEntries(Object.entries(saved.reviewStats || {}).map(([conceptId, stats]) => [conceptId, {
      attempts: Number(stats?.attempts) || 0,
      correct: Number(stats?.correct) || 0,
      correctQuestionIds: Array.from(new Set(Array.isArray(stats?.correctQuestionIds) ? stats.correctQuestionIds : [])),
      correctDays: Array.from(new Set(Array.isArray(stats?.correctDays) ? stats.correctDays : [])),
    }]));
    return {
      ...defaultState,
      ...saved,
      completedConcepts: Array.isArray(saved.completedConcepts) ? saved.completedConcepts : [],
      mistakes: Array.isArray(saved.mistakes) ? saved.mistakes : [],
      reviews: Array.isArray(saved.reviews) ? saved.reviews : [],
      reviewStats,
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentView = "today";
let selectedLearnLesson = "part3";
let deferredInstallPrompt = null;

const viewRoot = document.querySelector("#view-root");
const pageTitle = document.querySelector("#page-title");

const titles = {
  today: "Today’s study",
  learn: "Learn",
  risk: "MES risk lab",
  orders: "Order safety lab",
  practice: "Practice",
  mistakes: "Mistake book",
  mastery: "Mastery map",
  evidence: "Evidence",
};

function cloneTemplate(id) {
  return document.querySelector(id).content.cloneNode(true);
}

function setView(view, updateHash = true) {
  currentView = view;
  pageTitle.textContent = titles[view] || titles.today;
  const isCmeLab = view === "risk" || view === "orders";
  document.querySelector("#course-eyebrow").textContent = isCmeLab ? "CME · Futures safety education" : "TradePhantoms · Futures Focus";
  document.querySelector("#course-link").classList.toggle("hidden", isCmeLab);
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  viewRoot.replaceChildren();
  if (view === "learn") renderLearn();
  else if (view === "risk") renderRisk();
  else if (view === "orders") renderOrders();
  else if (view === "practice") renderPractice();
  else if (view === "mistakes") renderMistakes();
  else if (view === "mastery") renderMastery();
  else if (view === "evidence") renderEvidence();
  else renderToday();
  if (updateHash && window.location.hash.slice(1) !== view) window.location.hash = view;
  document.querySelector("#main").focus({ preventScroll: true });
}

function renderToday() {
  const content = cloneTemplate("#today-template");
  const mastered = concepts.filter((concept) => conceptStatus(concept.id) === "MASTERED").length;
  const percent = Math.round((mastered / concepts.length) * 100);
  content.querySelector("#progress-number").textContent = `${percent}%`;
  content.querySelector(".progress-ring").style.background =
    `radial-gradient(circle closest-side, var(--panel-2) 77%, transparent 79% 100%), conic-gradient(var(--blue) ${percent}%, var(--line) 0)`;
  const due = getDueReviewCount();
  const openMistakes = state.mistakes.filter((item) => !item.resolved).length;
  content.querySelector("#due-count").textContent = String(due);
  content.querySelector("#today-focus").textContent = due ? "Review what is due" : openMistakes ? "Repair a missed question" : "Build the Futures Focus cycle";
  content.querySelector("#today-description").textContent = due
    ? `${due} concept${due === 1 ? " is" : "s are"} due. Recall first, then check the explanation.`
    : openMistakes ? `${openMistakes} correction${openMistakes === 1 ? " needs" : "s need"} another attempt.`
      : "Practice a new concept or use the MES risk lab to work through contract-size math.";
  content.querySelector('[data-action="start-learning"]').addEventListener("click", () => startPractice());
  content.querySelector('[data-action="open-risk"]').addEventListener("click", () => setView("risk"));
  viewRoot.append(content);
}

function conceptStatus(conceptId) {
  if (state.mistakes.some((item) => item.conceptId === conceptId && !item.resolved)) return "NEEDS REVIEW";
  const stats = state.reviewStats[conceptId] || { correct: 0, attempts: 0, correctQuestionIds: [] };
  if ((stats.correctQuestionIds || []).length >= 2 && (stats.correctDays || []).length >= 2) return "MASTERED";
  if (state.completedConcepts.includes(conceptId) || stats.attempts > 0) return "LEARNING";
  return "NOT STARTED";
}

function getDueReviewCount() {
  return state.reviews.filter((review) => review.due <= Date.now()).length;
}

function scheduleReview(conceptId, rating) {
  const delays = { again: 10 * 60 * 1000, hard: 24 * 60 * 60 * 1000, good: 3 * 24 * 60 * 60 * 1000 };
  state.reviews = state.reviews.filter((item) => item.concept !== conceptId);
  state.reviews.push({ concept: conceptId, due: Date.now() + delays[rating] });
}

function recordAnswer(question, correct) {
  const stats = state.reviewStats[question.concept] || { correct: 0, attempts: 0, correctQuestionIds: [] };
  if (!Array.isArray(stats.correctQuestionIds)) stats.correctQuestionIds = [];
  if (!Array.isArray(stats.correctDays)) stats.correctDays = [];
  stats.attempts += 1;
  if (correct) {
    stats.correct += 1;
    if (!stats.correctQuestionIds.includes(question.id)) stats.correctQuestionIds.push(question.id);
    const today = new Date().toLocaleDateString("en-CA");
    if (!stats.correctDays.includes(today)) stats.correctDays.push(today);
    state.mistakes
      .filter((item) => item.questionId === question.id && !item.resolved)
      .forEach((item) => { item.resolved = true; });
  }
  state.reviewStats[question.concept] = stats;

  if (!correct) {
    const existing = state.mistakes.find((item) => item.questionId === question.id && !item.resolved);
    if (!existing) {
      state.mistakes.unshift({
        questionId: question.id,
        conceptId: question.concept,
        concept: concepts.find((item) => item.id === question.concept)?.title || "Futures foundations",
        note: question.explanation,
        at: Date.now(),
        resolved: false,
      });
    }
  }

  scheduleReview(question.concept, correct ? "good" : "again");
  saveState();
}

function renderLearn() {
  const lessons = {
    part1: {
      label: "PART I · FOUNDATION",
      duration: "SYMBOL LITERACY",
      title: "Read a dated futures symbol",
      lead: "A dated symbol answers three questions: what is traded, which contract month, and which year.",
      visual: `<div class="symbol-demo" aria-label="GCQ23 symbol breakdown"><div><strong>GC</strong><span>Gold root</span></div><div><strong>Q</strong><span>August</span></div><div><strong>23</strong><span>2023</span></div></div>`,
      goodTitle: "GCQ23",
      goodText: "Gold contract for August 2023. All three required pieces are visible.",
      missTitle: "GC23",
      missText: "The root and year are visible, but the contract-month code is missing.",
      question: "What does Q communicate in GCQ23?",
      options: ["The exchange", "The August contract month", "The tick value"],
      answer: 1,
      explanation: "Q identifies the August contract month.",
      concept: "symbol-anatomy",
      source: "Part I written notes, pp. 13–14.",
      gates: ["Explain all three symbol parts.", "Decode two different symbols.", "Reject an incomplete dated symbol."],
    },
    part2: {
      label: "PART II · CONTRACT MAP",
      duration: "97-MIN SOURCE LESSON",
      title: "Know which chart—and which gap—you are seeing",
      lead: "Rollover is a liquidity change, not merely a calendar date. The back month becomes the new front month when its volume overtakes the old front month.",
      visual: `<div class="cycle-map" aria-label="Futures rollover flow"><div><span>01</span><strong>Compare volume</strong><small>Front month vs back month</small></div><i>→</i><div><span>02</span><strong>Liquidity shifts</strong><small>Back month exceeds front</small></div><i>→</i><div><span>03</span><strong>Roll focus</strong><small>Trade the new front month</small></div></div>`,
      goodTitle: "ROLLOVER GAP",
      goodText: "A price difference between two contract months, visible on an unadjusted continuous chart at rollover.",
      missTitle: "NATURAL GAP",
      missText: "A real market gap while trading is closed. It can appear on contract-specific and unadjusted continuous charts.",
      question: "Back-month volume now exceeds front-month volume. What changed?",
      options: ["A natural gap formed", "Rollover occurred", "The tick value changed"],
      answer: 1,
      explanation: "Correct. Part II uses the volume shift as the rollover test.",
      concept: "rollover",
      source: "Part II written notes, pp. 6–13. Video timestamps remain a separate verification layer.",
      gates: ["Name front month by volume.", "Separate rollover gaps from natural gaps.", "Choose contract-specific vs continuous charts intentionally."],
    },
    part3: {
      label: "PART III · SETUP CONTEXT",
      duration: "64-MIN SOURCE LESSON",
      title: "Map a Globex trap without inventing the trigger",
      lead: "Mark the Globex high and low before regular hours. A valid trap candidate requires a breakout into institutional supply or demand—not a blind fade of every breakout.",
      visual: `<div class="trap-map" aria-label="Globex trap comparison"><article><span>BEAR TRAP · LONG CONTEXT</span><strong>Break below Globex low</strong><p>Into institutional demand; strongest course context is an overall uptrend and consistent range.</p></article><article><span>BULL TRAP · SHORT CONTEXT</span><strong>Break above Globex high</strong><p>Into institutional supply; strongest course context is an overall downtrend and consistent range.</p></article></div>`,
      goodTitle: "QUALIFIED CANDIDATE",
      goodText: "Globex boundary break + high-quality impulse–basing–impulse supply/demand outside the range + higher-timeframe context.",
      missTitle: "BLIND FADE",
      missText: "Shorting every new Globex high or buying every new Globex low. The lesson does not support that rule.",
      question: "Price breaks above the Globex high into institutional supply during an overall downtrend. Which candidate is it?",
      options: ["Bear trap / long context", "Bull trap / short context", "Automatic breakout buy"],
      answer: 1,
      explanation: "Correct. Part III calls this a Globex bull trap: the trapped group is the breakout buyers, while the planned direction is short.",
      concept: "globex-traps",
      source: "Part III notes, pp. 7–12; video confirms the core map at 04:34–36:57, including IBI and trend alignment.",
      gates: ["Map Globex high and low.", "Require supply or demand outside the range.", "State the higher-timeframe trend.", "Say UNKNOWN for trigger, stop, and target until taught."],
    },
  };
  const lesson = lessons[selectedLearnLesson] || lessons.part3;
  const lessonUrls = {
    part1: "https://tradephantoms-s-site.thinkific.com/courses/take/copy-of-tradephantoms-forex-focus-course/lessons/66586089-tradephantoms-futures-focus-part-i",
    part2: "https://tradephantoms-s-site.thinkific.com/courses/take/copy-of-tradephantoms-forex-focus-course/lessons/66586091-tradephantoms-futures-focus-part-ii",
    part3: "https://tradephantoms-s-site.thinkific.com/courses/take/copy-of-tradephantoms-forex-focus-course/lessons/66586092-tradephantoms-futures-focus-part-iii",
  };
  document.querySelector("#course-link").href = lessonUrls[selectedLearnLesson] || lessonUrls.part3;
  viewRoot.innerHTML = `
    <div class="lesson-switcher" role="group" aria-label="Futures Focus lesson selector">
      <button type="button" data-lesson="part1">Part I · Symbols</button>
      <button type="button" data-lesson="part2">Part II · Rollover</button>
      <button type="button" data-lesson="part3">Part III · Globex traps</button>
    </div>
    <div class="lesson-layout">
      <section class="lesson-card">
        <div class="lesson-meta"><span>${lesson.label}</span><span>${lesson.duration}</span></div>
        <h2>${lesson.title}</h2><p class="lesson-lead">${lesson.lead}</p>${lesson.visual}
        <div class="compare-grid"><article class="example good-example"><span class="example-label">CONFIRMED</span><strong>${lesson.goodTitle}</strong><p>${lesson.goodText}</p></article><article class="example near-miss"><span class="example-label">NEAR-MISS</span><strong>${lesson.missTitle}</strong><p>${lesson.missText}</p></article></div>
        ${selectedLearnLesson === "part3" ? `<div class="unknown-strip"><span class="status-chip not-shown">UNKNOWN</span><p>The reviewed class-note slides do not specify the exact entry trigger, stop placement, target formula, setup expiry, or management rule. Do not turn this context map into an automatic live entry.</p></div>` : ""}
        <div class="knowledge-check"><span class="example-label">CHECK YOURSELF</span><h3>${lesson.question}</h3><div class="answer-options" role="group" aria-label="Answer choices">${lesson.options.map((option, index) => `<button type="button" data-answer="${index}">${option}</button>`).join("")}</div><p id="answer-feedback" class="answer-feedback" aria-live="polite"></p></div>
        <div class="lesson-actions"><button class="button button-ghost" data-action="back-today" type="button">← Today</button><button class="button button-primary" data-action="complete-concept" type="button" disabled>Mark concept understood</button></div>
      </section>
      <aside class="lesson-rail"><h3>Mastery gate</h3><ul>${lesson.gates.map((gate) => `<li>${gate}</li>`).join("")}</ul><div class="source-proof"><span class="status-chip confirmed">CONFIRMED</span><p>${lesson.source}</p></div></aside>
    </div>`;

  viewRoot.querySelectorAll("[data-lesson]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lesson === selectedLearnLesson);
    button.addEventListener("click", () => { selectedLearnLesson = button.dataset.lesson; renderLearn(); });
  });
  const completeButton = viewRoot.querySelector('[data-action="complete-concept"]');
  const feedback = viewRoot.querySelector("#answer-feedback");
  viewRoot.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
    viewRoot.querySelectorAll("[data-answer]").forEach((item) => item.classList.remove("correct", "wrong"));
    const correct = Number(button.dataset.answer) === lesson.answer;
    button.classList.add(correct ? "correct" : "wrong");
    feedback.textContent = correct ? lesson.explanation : `Not yet. ${lesson.explanation}`;
    completeButton.disabled = !correct;
  }));
  viewRoot.querySelector('[data-action="back-today"]').addEventListener("click", () => setView("today"));
  completeButton.addEventListener("click", () => {
    if (!state.completedConcepts.includes(lesson.concept)) state.completedConcepts.push(lesson.concept);
    scheduleReview(lesson.concept, "hard"); saveState(); setView("today");
  });
}

let practiceIndex = 0;
let practiceTargetIndex = null;
let lastPracticeQuestionId = null;

function choosePracticeIndex(excludeId = null) {
  const dueConcepts = state.reviews.filter((item) => item.due <= Date.now()).sort((a, b) => a.due - b.due).map((item) => item.concept);
  const openMistakes = state.mistakes.filter((item) => !item.resolved).map((item) => item.questionId);
  const ranked = practiceQuestions.map((question, index) => {
    const stats = state.reviewStats[question.concept] || {};
    const priority = dueConcepts.includes(question.concept) ? 0
      : openMistakes.includes(question.id) ? 1
        : !stats.attempts ? 2
          : !(stats.correctQuestionIds || []).includes(question.id) ? 3 : 4;
    return { index, id: question.id, priority, rotation: (index - practiceIndex + practiceQuestions.length) % practiceQuestions.length };
  }).sort((a, b) => a.priority - b.priority || a.rotation - b.rotation);
  return (ranked.find((item) => item.id !== excludeId) || ranked[0]).index;
}

function startPractice(targetIndex = null) {
  practiceTargetIndex = targetIndex;
  setView("practice");
}

function renderPractice() {
  practiceIndex = practiceTargetIndex ?? choosePracticeIndex(lastPracticeQuestionId);
  practiceTargetIndex = null;
  const question = practiceQuestions[practiceIndex];
  const isCme = question.concept === "mes-risk" || question.concept === "order-safety";
  const part = ["rollover", "chart-gaps"].includes(question.concept) ? "PART II NOTES"
    : ["timeframe-roles", "globex-traps"].includes(question.concept) ? "PART III NOTES"
      : "PART I NOTES";
  viewRoot.innerHTML = `
    <div class="practice-layout">
      <section class="practice-card">
        <div class="lesson-meta"><span>ACTIVE RECALL</span><span>${concepts.find((item) => item.id === question.concept)?.title || "Futures foundations"}</span></div>
        <span class="status-chip confirmed">${isCme ? "CME-SOURCED EDUCATION" : part}</span>
        <h2>${question.prompt}</h2>
        <div class="practice-options" role="group" aria-label="Answer choices">
          ${question.options.map((option, index) => `<button type="button" data-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("")}
        </div>
        <div class="practice-feedback" aria-live="polite"></div>
        <div class="practice-actions hidden">
          <button class="button button-ghost" type="button" data-rating="hard">Hard · tomorrow</button>
          <button class="button button-primary" type="button" data-rating="good">Good · 3 days</button>
          <button class="button button-primary hidden" type="button" data-next>Next question →</button>
        </div>
      </section>
      <aside class="lesson-rail">
        <h3>How to answer</h3>
        <p class="rail-copy">Commit to an answer before checking. Effortful retrieval strengthens memory more than rereading the note.</p>
        <div class="source-proof"><span class="status-chip not-shown">NO GUESSING</span><p>${isCme ? "This is public futures-safety education, not a TradePhantoms entry system. Practice the mechanics in Replay before risking money." : "If the reviewed lesson evidence does not establish an answer, the correct response is UNKNOWN."}</p></div>
      </aside>
    </div>`;

  const feedback = viewRoot.querySelector(".practice-feedback");
  const actions = viewRoot.querySelector(".practice-actions");
  let answeredCorrectly = false;

  viewRoot.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!actions.classList.contains("hidden")) return;
      const selected = Number(button.dataset.option);
      answeredCorrectly = selected === question.answer;
      button.classList.add(answeredCorrectly ? "correct" : "wrong");
      viewRoot.querySelector(`[data-option="${question.answer}"]`).classList.add("correct");
      viewRoot.querySelectorAll("[data-option]").forEach((option) => { option.disabled = true; });
      feedback.innerHTML = `<strong>${answeredCorrectly ? "Correct." : "Repair this one."}</strong><span>${question.explanation}</span>`;
      actions.classList.remove("hidden");
      recordAnswer(question, answeredCorrectly);
      if (!answeredCorrectly) {
        actions.querySelectorAll("[data-rating]").forEach((item) => item.classList.add("hidden"));
        actions.querySelector("[data-next]").classList.remove("hidden");
      }
    });
  });

  function advance() {
    lastPracticeQuestionId = question.id;
    practiceIndex = (practiceIndex + 1) % practiceQuestions.length;
    renderPractice();
  }

  actions.querySelector("[data-next]").addEventListener("click", advance);

  actions.querySelectorAll("[data-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      scheduleReview(question.concept, button.dataset.rating);
      saveState();
      advance();
    });
  });
}

function renderMistakes() {
  const openMistakes = state.mistakes.filter((item) => !item.resolved);
  viewRoot.innerHTML = `
    <section class="workspace-panel">
      <div class="workspace-heading"><div><span class="eyebrow">CORRECTION LOOP</span><h2>Mistake book</h2><p>These are not failures. Each item is the exact gap we repair before adding complexity.</p></div><strong>${openMistakes.length}</strong></div>
      <div class="mistake-list">
        ${openMistakes.length ? openMistakes.map((item) => `
          <article class="mistake-item">
            <div><span class="status-chip not-shown">NEEDS REVIEW</span><h3>${item.concept}</h3><p>${item.note}</p></div>
            <button class="button button-ghost" type="button" data-review-question="${item.questionId}">Retry question</button>
          </article>`).join("") : `
          <div class="empty-state"><span>✓</span><h3>No open corrections</h3><p>Missed questions will appear here with the concept that needs repair.</p><button class="button button-primary" type="button" data-go-practice>Start practice</button></div>`}
      </div>
    </section>`;

  viewRoot.querySelectorAll("[data-review-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetIndex = practiceQuestions.findIndex((question) => question.id === button.dataset.reviewQuestion);
      startPractice(targetIndex >= 0 ? targetIndex : null);
    });
  });
  viewRoot.querySelector("[data-go-practice]")?.addEventListener("click", () => startPractice());
}

function renderMastery() {
  const mastered = concepts.filter((concept) => conceptStatus(concept.id) === "MASTERED").length;
  viewRoot.innerHTML = `
    <section class="workspace-panel">
      <div class="workspace-heading"><div><span class="eyebrow">FUTURES FOCUS I–III · CME LAB</span><h2>Mastery map</h2><p>Completion is not mastery. Mastery requires two varied correct answers on different days, with no open correction for that concept.</p></div><strong>${mastered}/${concepts.length}</strong></div>
      <div class="mastery-grid">
        ${concepts.map((concept, index) => {
          const status = conceptStatus(concept.id);
          return `<article class="mastery-item ${status.toLowerCase().replace(" ", "-")}">
            <span class="mastery-number">0${index + 1}</span>
            <span class="mastery-status">${status}</span>
            <h3>${concept.title}</h3>
            <p>${concept.source}</p>
            ${concept.available ? `<button class="text-button" type="button" data-open-learn="${concept.id}">Open lesson →</button>` : `<button class="text-button" type="button" data-open-practice="${concept.id}">Practice concept →</button>`}
          </article>`;
        }).join("")}
      </div>
    </section>`;
  viewRoot.querySelectorAll("[data-open-learn]").forEach((button) => button.addEventListener("click", () => {
    const concept = concepts.find((item) => item.id === button.dataset.openLearn);
    if (concept?.lesson) selectedLearnLesson = concept.lesson;
    const destination = button.dataset.openLearn === "mes-risk" ? "risk" : button.dataset.openLearn === "order-safety" ? "orders" : "learn";
    setView(destination);
  }));
  viewRoot.querySelectorAll("[data-open-practice]").forEach((button) => button.addEventListener("click", () => {
    const conceptId = button.dataset.openPractice;
    const targetIndex = practiceQuestions.findIndex((question) => question.concept === conceptId);
    startPractice(targetIndex >= 0 ? targetIndex : null);
  }));
}

function renderRisk() {
  viewRoot.innerHTML = `
    <div class="lesson-layout">
      <section class="lesson-card">
        <div class="lesson-meta"><span>FUTURES SAFETY · PUBLIC CME SOURCE</span><span>SIMULATION ONLY</span></div>
        <h2>Know the dollars before the click</h2>
        <p class="lesson-lead">MES is worth <strong>$5 per index point per contract</strong>. Its minimum 0.25-point tick is <strong>$1.25</strong>. This is contract arithmetic, not an entry signal or a stop-placement rule.</p>
        <div class="compare-grid">
          <article class="example good-example"><span class="example-label">WORKED EXAMPLE</span><strong>10 points × 1 MES</strong><p>Planned price-move loss to a hypothetical stop: 10 × $5 × 1 = $50, before fees or slippage.</p></article>
          <article class="example near-miss"><span class="example-label">NEAR-MISS</span><strong>10 points × 2 MES</strong><p>Not still $50. Two contracts double the planned price-move loss to $100.</p></article>
        </div>
        <div class="risk-calculator">
          <h3>Practice the arithmetic</h3>
          <p>Enter a hypothetical stop distance and contract count. This does not place or suggest a trade.</p>
          <div class="risk-inputs">
            <label>Distance in index points<input id="risk-points" type="number" min="0.25" step="0.25" value="10" inputmode="decimal"></label>
            <label>MES contracts<input id="risk-contracts" type="number" min="1" max="100" step="1" value="1" inputmode="numeric"></label>
          </div>
          <output id="risk-result" aria-live="polite"></output>
          <p class="risk-caveat">Actual loss can exceed this figure because of gaps, slippage, fees, or a stop not filling at its trigger price. Check the live contract specification before trading.</p>
        </div>
        <div class="lesson-actions"><button class="button button-ghost" type="button" data-action="back-today">← Today</button><button class="button button-primary" type="button" data-action="practice-risk">Quiz me →</button></div>
      </section>
      <aside class="lesson-rail"><h3>What this does—and does not—teach</h3><ul><li>Calculate MES price-move exposure.</li><li>See how quantity changes the dollars at risk.</li><li>No TradePhantoms setup, target, or stop location is claimed here.</li></ul><div class="source-proof"><span class="status-chip confirmed">CME SOURCES</span><p><a href="https://www.cmegroup.com/markets/equities/sp/micro-e-mini-sandp-500.html" target="_blank" rel="noopener noreferrer">MES contract details ↗</a><br><a href="https://www.cmegroup.com/education/courses/futures-trading-mechanics-and-regulation/futures-order-types" target="_blank" rel="noopener noreferrer">Futures order types ↗</a></p></div></aside>
    </div>`;

  const pointsInput = viewRoot.querySelector("#risk-points");
  const contractsInput = viewRoot.querySelector("#risk-contracts");
  const result = viewRoot.querySelector("#risk-result");
  function updateRisk() {
    const points = Number(pointsInput.value);
    const contracts = Number(contractsInput.value);
    if (!Number.isFinite(points) || points <= 0 || Math.round(points * 4) !== points * 4 || !Number.isInteger(contracts) || contracts < 1 || contracts > 100) {
      result.textContent = "Enter a positive quarter-point distance and 1–100 whole contracts.";
      return;
    }
    const amount = points * 5 * contracts;
    result.textContent = `${points} points × $5 × ${contracts} contract${contracts === 1 ? "" : "s"} = $${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} before costs or slippage`;
  }
  pointsInput.addEventListener("input", updateRisk);
  contractsInput.addEventListener("input", updateRisk);
  updateRisk();
  viewRoot.querySelector('[data-action="back-today"]').addEventListener("click", () => setView("today"));
  viewRoot.querySelector('[data-action="practice-risk"]').addEventListener("click", () => startPractice(practiceQuestions.findIndex((item) => item.concept === "mes-risk")));
}

function renderOrders() {
  viewRoot.innerHTML = `
    <div class="lesson-layout">
      <section class="lesson-card">
        <div class="lesson-meta"><span>ORDER MECHANICS · PUBLIC CME SOURCE</span><span>REPLAY FIRST</span></div>
        <h2>Know your position before pressing Buy or Sell</h2>
        <p class="lesson-lead">An order button does not know your intention. The result depends on your <strong>current position</strong>, the <strong>order side</strong>, the <strong>quantity</strong>, and whether the order fills.</p>

        <div class="compare-grid">
          <article class="example good-example"><span class="example-label">LONG 1 → SELL 1</span><strong>Usually returns to flat</strong><p>The sell offsets the existing long. Verify the position reads 0 after the fill.</p></article>
          <article class="example near-miss"><span class="example-label">FLAT → SELL 1</span><strong>Can open short 1</strong><p>Pressing Sell while flat is not an exit. If filled, it can create a new short position.</p></article>
        </div>

        <div class="risk-calculator order-checklist">
          <h3>Before-any-click checklist</h3>
          <p>Complete this in Replay until you can do it without guessing.</p>
          <label><input type="checkbox" data-order-check> I can see whether the account is Live or Replay.</label>
          <label><input type="checkbox" data-order-check> I read the current position: Long, Flat, or Short—and the quantity.</label>
          <label><input type="checkbox" data-order-check> I checked the exact symbol and contract month.</label>
          <label><input type="checkbox" data-order-check> I know whether this order opens, adds, reduces, or closes.</label>
          <label><input type="checkbox" data-order-check> I checked side, order type, quantity, and price before submitting.</label>
          <label><input type="checkbox" data-order-check> If entering, I know the invalidation and planned dollar risk before the click.</label>
          <output id="order-ready" aria-live="polite">0 of 6 checks complete — do not submit yet.</output>
        </div>

        <div class="compare-grid">
          <article class="example"><span class="example-label">MARKET</span><strong>Execution first</strong><p>Seeks an immediate fill. The execution price is not guaranteed.</p></article>
          <article class="example"><span class="example-label">LIMIT</span><strong>Price boundary</strong><p>Controls the worst acceptable price, but may not fill.</p></article>
          <article class="example"><span class="example-label">STOP</span><strong>Trigger first</strong><p>Becomes eligible after its trigger. A stop does not guarantee the final fill price.</p></article>
          <article class="example"><span class="example-label">BRACKET</span><strong>Verify both sides</strong><p>After entry, confirm the target and protective stop are accepted, Working, and match the open quantity.</p></article>
        </div>

        <div class="source-proof order-warning"><span class="status-chip not-shown">NOT PROTECTED YET</span><p>Typing a stop distance into a ticket is not protection. For a long, verify a submitted and accepted <strong>Sell Stop</strong> for the correct quantity below the market. For a short, verify a <strong>Buy Stop</strong> above it.</p></div>
        <div class="lesson-actions"><button class="button button-ghost" type="button" data-action="back-today">← Today</button><button class="button button-primary" type="button" data-action="practice-orders">Quiz me →</button></div>
      </section>
      <aside class="lesson-rail"><h3>Position-state map</h3><ul><li>Long + Sell same quantity → flat.</li><li>Long + Sell smaller quantity → reduced long.</li><li>Flat + Sell → short if filled.</li><li>Short + Buy same quantity → flat.</li><li>Never assume “rejected,” “submitted,” and “filled” mean the same thing.</li></ul><div class="source-proof"><span class="status-chip confirmed">CME EDUCATION</span><p><a href="https://www.cmegroup.com/education/courses/futures-trading-mechanics-and-regulation/futures-order-types" target="_blank" rel="noopener noreferrer">Futures order types ↗</a></p></div></aside>
    </div>`;

  const checks = [...viewRoot.querySelectorAll("[data-order-check]")];
  const ready = viewRoot.querySelector("#order-ready");
  function updateChecklist() {
    const complete = checks.filter((item) => item.checked).length;
    ready.textContent = complete === checks.length
      ? "6 of 6 checks complete — now explain the intended result out loud before submitting in Replay."
      : `${complete} of ${checks.length} checks complete — do not submit yet.`;
  }
  checks.forEach((item) => item.addEventListener("change", updateChecklist));
  viewRoot.querySelector('[data-action="back-today"]').addEventListener("click", () => setView("today"));
  viewRoot.querySelector('[data-action="practice-orders"]').addEventListener("click", () => startPractice(practiceQuestions.findIndex((item) => item.concept === "order-safety")));
}

function renderEvidence() {
  viewRoot.innerHTML = `
    <div class="evidence-layout">
      <section class="workspace-panel">
        <div class="workspace-heading"><div><span class="eyebrow">SOURCE CONTROL</span><h2>Evidence ledger</h2><p>Every claim is tied to what the source actually shows. Paid course files remain private.</p></div></div>
        <div class="evidence-table" role="table" aria-label="Futures Focus evidence ledger">
          <div class="evidence-row evidence-head" role="row"><span>Topic</span><span>Support</span><span>Status</span></div>
          <div class="evidence-row" role="row"><strong>Symbol anatomy</strong><span>Written notes, pp. 13–14</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Market participants</strong><span>Written notes, p. 12</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Expiration / settlement</strong><span>Written notes, p. 22</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Rollover / chart gaps</strong><span>Part II notes, pp. 6–13</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Timeframe roles</strong><span>Part III notes, pp. 3–4</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Globex trap context</strong><span>Part III notes, pp. 7–12; video 04:34–36:57</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Exact trigger / stop / target</strong><span>Not stated in the reviewed Part III slides</span><span class="status-chip not-shown">UNKNOWN</span></div>
          <div class="evidence-row" role="row"><strong>MES risk arithmetic</strong><span>CME contract specification; separate public lab</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Order and position safety</strong><span>CME order-type education; separate public lab</span><span class="status-chip confirmed">CONFIRMED</span></div>
        </div>
      </section>
      <aside class="evidence-side">
        <article class="source-card evidence-links">
          <span class="metric-label">Public source record</span>
          <h3>Futures Focus Parts I–III</h3>
          <p>Original summaries, page references, timestamped evidence, and explicit unknowns.</p>
          <a class="button button-ghost" href="https://github.com/jaydenwistrom-crypto/trading-mastery-coach/blob/main/evidence/FUTURES_FOCUS_PART_I.md" target="_blank" rel="noopener noreferrer">Open evidence file ↗</a>
          <a class="button button-ghost" href="https://github.com/jaydenwistrom-crypto/trading-mastery-coach/blob/main/evidence/FUTURES_FOCUS_PART_II.md" target="_blank" rel="noopener noreferrer">Part II evidence ↗</a>
          <a class="button button-ghost" href="https://github.com/jaydenwistrom-crypto/trading-mastery-coach/blob/main/evidence/FUTURES_FOCUS_PART_III.md" target="_blank" rel="noopener noreferrer">Part III evidence ↗</a>
        </article>
        <article class="boundary-card"><span class="status-chip not-shown">PRIVATE</span><h3>Course media stays out</h3><p>No paid video, transcript, source PDF, or private screenshot is bundled into this app.</p></article>
      </aside>
    </div>`;
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.querySelector("#install-button").classList.remove("hidden");
});

document.querySelector("#install-button").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.querySelector("#install-button").classList.add("hidden");
});

function registerWebMcpTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const register = (tool) => {
    try { void Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch { /* Unsupported preview context. */ }
  };

  register({
    name: "get_futures_study_status",
    title: "Get futures study status",
    description: "Read the visible Futures Focus Parts I–III study progress, open corrections, and due reviews.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return {
        completedConcepts: state.completedConcepts,
        openMistakes: state.mistakes.filter((item) => !item.resolved).length,
        dueReviews: getDueReviewCount(),
      };
    },
  });

  register({
    name: "open_futures_study_view",
    title: "Open futures study view",
    description: "Navigate the app to Today, Learn, MES risk lab, Order safety lab, Practice, Mistake book, Mastery map, or Evidence.",
    inputSchema: { type: "object", properties: { view: { type: "string", enum: ["today", "learn", "risk", "orders", "practice", "mistakes", "mastery", "evidence"] } }, required: ["view"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !titles[input.view]) throw new Error("Unknown study view");
      setView(input.view);
      return { view: input.view, opened: true };
    },
  });
}

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js?v=7").catch(() => {}));

window.addEventListener("hashchange", () => {
  const requestedView = window.location.hash.slice(1);
  if (titles[requestedView] && requestedView !== currentView) setView(requestedView, false);
});

const initialView = window.location.hash.slice(1);
setView(Object.keys(titles).includes(initialView) ? initialView : "today");
registerWebMcpTools();
