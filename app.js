const STORAGE_KEY = "trading-mastery-coach-v1";

const defaultState = {
  completedConcepts: [],
  mistakes: [],
  reviews: [],
  reviewStats: {},
};

const concepts = [
  { id: "symbol-anatomy", title: "Symbol anatomy", source: "Pages 13–14", available: true },
  { id: "month-codes", title: "Contract-month codes", source: "Page 14" },
  { id: "participants", title: "Hedgers and speculators", source: "Page 12" },
  { id: "contracts-ticks", title: "Contracts and ticks", source: "Page 22" },
  { id: "expiry-settlement", title: "Expiration and settlement", source: "Page 22" },
  { id: "strategy-boundary", title: "Evidence boundary", source: "Pages 1–23" },
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
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const reviewStats = Object.fromEntries(Object.entries(saved.reviewStats || {}).map(([conceptId, stats]) => [conceptId, {
      attempts: Number(stats?.attempts) || 0,
      correct: Number(stats?.correct) || 0,
      correctQuestionIds: Array.from(new Set(Array.isArray(stats?.correctQuestionIds) ? stats.correctQuestionIds : [])),
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
let deferredInstallPrompt = null;

const viewRoot = document.querySelector("#view-root");
const pageTitle = document.querySelector("#page-title");

const titles = {
  today: "Today’s study",
  learn: "Learn",
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
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  viewRoot.replaceChildren();
  if (view === "learn") renderLearn();
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
  content.querySelector("#due-count").textContent = String(getDueReviewCount());
  content.querySelector('[data-action="start-learning"]').addEventListener("click", () => setView("practice"));
  viewRoot.append(content);
}

function conceptStatus(conceptId) {
  if (state.mistakes.some((item) => item.conceptId === conceptId && !item.resolved)) return "NEEDS REVIEW";
  const stats = state.reviewStats[conceptId] || { correct: 0, attempts: 0, correctQuestionIds: [] };
  if ((stats.correctQuestionIds || []).length >= 2) return "MASTERED";
  if (state.completedConcepts.includes(conceptId) || stats.attempts > 0) return "LEARNING";
  return "NOT STARTED";
}

function getDueReviewCount() {
  const dueNow = state.reviews.filter((review) => review.due <= Date.now()).length;
  if (dueNow > 0) return dueNow;
  const practicedConcepts = Object.values(state.reviewStats).filter((stats) => stats.attempts > 0).length;
  return Math.max(3 - practicedConcepts, 0);
}

function scheduleReview(conceptId, rating) {
  const delays = { again: 10 * 60 * 1000, hard: 24 * 60 * 60 * 1000, good: 3 * 24 * 60 * 60 * 1000 };
  state.reviews = state.reviews.filter((item) => item.concept !== conceptId);
  state.reviews.push({ concept: conceptId, due: Date.now() + delays[rating] });
}

function recordAnswer(question, correct) {
  const stats = state.reviewStats[question.concept] || { correct: 0, attempts: 0, correctQuestionIds: [] };
  if (!Array.isArray(stats.correctQuestionIds)) stats.correctQuestionIds = [];
  stats.attempts += 1;
  if (correct) {
    stats.correct += 1;
    if (!stats.correctQuestionIds.includes(question.id)) stats.correctQuestionIds.push(question.id);
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
  const content = cloneTemplate("#learn-template");
  const completeButton = content.querySelector('[data-action="complete-concept"]');
  const feedback = content.querySelector("#answer-feedback");

  content.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      content.querySelectorAll("[data-answer]").forEach((item) => item.classList.remove("correct", "wrong"));
      const correct = button.dataset.answer === "correct";
      button.classList.add(correct ? "correct" : "wrong");
      feedback.textContent = correct
        ? "Correct. Q is the August contract-month code."
        : "Not yet. Q identifies the August contract month; the root and year carry the other information.";
      completeButton.disabled = !correct;

      if (!correct) {
        const existing = state.mistakes.find((item) => item.questionId === "month-q" && !item.resolved);
        if (!existing) state.mistakes.unshift({ questionId: "month-q", conceptId: "symbol-anatomy", concept: "Symbol anatomy", note: "Q identifies the August contract month.", at: Date.now(), resolved: false });
        saveState();
      }
    });
  });

  content.querySelector('[data-action="back-today"]').addEventListener("click", () => setView("today"));
  completeButton.addEventListener("click", () => {
    if (!state.completedConcepts.includes("symbol-anatomy")) state.completedConcepts.push("symbol-anatomy");
    scheduleReview("symbol-anatomy", "hard");
    saveState();
    setView("today");
  });

  viewRoot.append(content);
}

let practiceIndex = 0;

function renderPractice() {
  const question = practiceQuestions[practiceIndex % practiceQuestions.length];
  viewRoot.innerHTML = `
    <div class="practice-layout">
      <section class="practice-card">
        <div class="lesson-meta"><span>ACTIVE RECALL</span><span>${practiceIndex + 1} / ${practiceQuestions.length}</span></div>
        <div class="practice-progress" aria-hidden="true"><span style="width:${((practiceIndex + 1) / practiceQuestions.length) * 100}%"></span></div>
        <span class="status-chip confirmed">CONFIRMED MATERIAL</span>
        <h2>${question.prompt}</h2>
        <div class="practice-options" role="group" aria-label="Answer choices">
          ${question.options.map((option, index) => `<button type="button" data-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("")}
        </div>
        <div class="practice-feedback" aria-live="polite"></div>
        <div class="practice-actions hidden">
          <button class="button button-ghost" type="button" data-rating="again">Again · 10 min</button>
          <button class="button button-ghost" type="button" data-rating="hard">Hard · tomorrow</button>
          <button class="button button-primary" type="button" data-rating="good">Good · 3 days</button>
        </div>
      </section>
      <aside class="lesson-rail">
        <h3>How to answer</h3>
        <p class="rail-copy">Commit to an answer before checking. Effortful retrieval strengthens memory more than rereading the note.</p>
        <div class="source-proof"><span class="status-chip not-shown">NO GUESSING</span><p>If the source does not establish the answer, the correct response is UNKNOWN.</p></div>
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
    });
  });

  actions.querySelectorAll("[data-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      scheduleReview(question.concept, button.dataset.rating);
      saveState();
      practiceIndex = (practiceIndex + 1) % practiceQuestions.length;
      renderPractice();
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
      if (targetIndex >= 0) practiceIndex = targetIndex;
      setView("practice");
    });
  });
  viewRoot.querySelector("[data-go-practice]")?.addEventListener("click", () => setView("practice"));
}

function renderMastery() {
  const mastered = concepts.filter((concept) => conceptStatus(concept.id) === "MASTERED").length;
  viewRoot.innerHTML = `
    <section class="workspace-panel">
      <div class="workspace-heading"><div><span class="eyebrow">PART I · FOUNDATIONS</span><h2>Mastery map</h2><p>Completion is not mastery. A concept moves forward only after explanation, varied application, and correction.</p></div><strong>${mastered}/${concepts.length}</strong></div>
      <div class="mastery-grid">
        ${concepts.map((concept, index) => {
          const status = conceptStatus(concept.id);
          return `<article class="mastery-item ${status.toLowerCase().replace(" ", "-")}">
            <span class="mastery-number">0${index + 1}</span>
            <span class="mastery-status">${status}</span>
            <h3>${concept.title}</h3>
            <p>${concept.source}</p>
            ${concept.available ? `<button class="text-button" type="button" data-open-learn>Open lesson →</button>` : `<button class="text-button" type="button" data-open-practice>Practice concept →</button>`}
          </article>`;
        }).join("")}
      </div>
    </section>`;
  viewRoot.querySelector("[data-open-learn]")?.addEventListener("click", () => setView("learn"));
  viewRoot.querySelectorAll("[data-open-practice]").forEach((button, index) => button.addEventListener("click", () => {
    const conceptId = concepts.filter((concept) => !concept.available)[index]?.id;
    const targetIndex = practiceQuestions.findIndex((question) => question.concept === conceptId);
    if (targetIndex >= 0) practiceIndex = targetIndex;
    setView("practice");
  }));
}

function renderEvidence() {
  viewRoot.innerHTML = `
    <div class="evidence-layout">
      <section class="workspace-panel">
        <div class="workspace-heading"><div><span class="eyebrow">SOURCE CONTROL</span><h2>Evidence ledger</h2><p>Every claim is tied to what the source actually shows. Paid course files remain private.</p></div></div>
        <div class="evidence-table" role="table" aria-label="Part I evidence ledger">
          <div class="evidence-row evidence-head" role="row"><span>Topic</span><span>Support</span><span>Status</span></div>
          <div class="evidence-row" role="row"><strong>Symbol anatomy</strong><span>Written notes, pp. 13–14</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Market participants</strong><span>Written notes, p. 12</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Expiration / settlement</strong><span>Written notes, p. 22</span><span class="status-chip confirmed">CONFIRMED</span></div>
          <div class="evidence-row" role="row"><strong>Exact video timestamps</strong><span>End-to-end review pending</span><span class="status-chip not-shown">UNKNOWN</span></div>
          <div class="evidence-row" role="row"><strong>Entry / stop / target</strong><span>Not present in Part I notes</span><span class="status-chip not-shown">NOT SHOWN</span></div>
        </div>
      </section>
      <aside class="evidence-side">
        <article class="source-card">
          <span class="metric-label">Public source record</span>
          <h3>Futures Focus Part I</h3>
          <p>Original summary, digest, page references, and explicit unknowns.</p>
          <a class="button button-ghost" href="https://github.com/jaydenwistrom-crypto/trading-mastery-coach/blob/main/evidence/FUTURES_FOCUS_PART_I.md" target="_blank" rel="noopener noreferrer">Open evidence file ↗</a>
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
    description: "Read the visible Futures Part I study progress, open corrections, and due reviews.",
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
    description: "Navigate the app to Today, Learn, Practice, Mistake book, Mastery map, or Evidence.",
    inputSchema: { type: "object", properties: { view: { type: "string", enum: ["today", "learn", "practice", "mistakes", "mastery", "evidence"] } }, required: ["view"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !titles[input.view]) throw new Error("Unknown study view");
      setView(input.view);
      return { view: input.view, opened: true };
    },
  });
}

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js?v=4").catch(() => {}));

window.addEventListener("hashchange", () => {
  const requestedView = window.location.hash.slice(1);
  if (titles[requestedView] && requestedView !== currentView) setView(requestedView, false);
});

const initialView = window.location.hash.slice(1);
setView(Object.keys(titles).includes(initialView) ? initialView : "today");
registerWebMcpTools();
