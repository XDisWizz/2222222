"use strict";

const FLAG_PATH = "M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z";
const FLAG_FILLED = "M64 32V64 352v128c0 17.7-14.3 32-32 32S0 497.7 0 480V352 64 32C0 14.3 14.3 0 32 0S64 14.3 64 32zm0 0l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13C455.5 13.5 480 30.4 480 56V334.7c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4c-37.9-19-81.3-23.7-122.5-13.4L64 384V64z";
const QUIZ_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h12l4 4v14H4V3zm2 2v14h12V8h-3V5H6zm2 5h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>';
const LETTERS = "abcdefgh";
const DEFAULTS = { perAttempt: 5, points: 2, timeLimit: 10 };

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const fmtNum = n => n.toFixed(2).replace(".", ",");
const fmtInt = n => Number.isInteger(n) ? String(n) : fmtNum(n);
const MONTHS = ["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince"];
const DAYS = ["neděle","pondělí","úterý","středa","čtvrtek","pátek","sobota"];
const fmtDate = d => `${DAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
const fmtDateReview = d => `${DAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
const fmtDateShort = d => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;

function fmtDur(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  const sw = s === 1 ? "sekunda" : (s >= 2 && s <= 4 ? "sekundy" : "sekund");
  if (m === 0) return `${s} ${sw}`;
  return `${m} min.` + (s ? ` ${s} ${sw}` : "");
}
function fmtClock(sec) {
  sec = Math.max(0, sec);
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function typeset(el) {
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]).catch(() => {});
  else setTimeout(() => typeset(el), 150);
}

let T = null;
let Q = [];
let deck = [];
let history = [];
let attempt = null;
let timerId = null;
let timerHidden = false;
let bankRenderedFor = null;
let modalAction = null;

const storeKey = test => test.storageKey || `kviz-historie-${test.id}`;
const maxGrade = test => test.perAttempt * test.points;

const qType = q => q.type || "single";
const nOpts = q => qType(q) === "gap" ? q.choices.length : q.o.length;
const gapKeys = q => [...q.q.matchAll(/\[\[(\d+)\]\]/g)].map(m => +m[1] - 1);
const isMulti = q => qType(q) !== "single";

function emptyPick(q) {
  const t = qType(q);
  return t === "multi" ? [] : t === "gap" ? gapKeys(q).map(() => null) : null;
}
function answered(it) {
  const p = it.picked;
  return Array.isArray(p) ? p.some(x => x !== null) : p !== null && p !== undefined;
}
function fraction(it, qs = Q) {
  const q = qs[it.qi], p = it.picked, t = qType(q);
  if (t === "multi") {
    if (!Array.isArray(p)) return 0;
    const nC = q.c.length, nW = q.o.length - nC;
    let f = 0;
    for (const i of p) f += q.c.includes(i) ? 1 / nC : -(nW ? 1 / nW : 1);
    return Math.max(0, Math.min(1, f));
  }
  if (t === "gap") {
    if (!Array.isArray(p)) return 0;
    const keys = gapKeys(q);
    return keys.filter((k, g) => p[g] === k).length / keys.length;
  }
  return p === q.c ? 1 : 0;
}
const isRight = (it, qs = Q) => fraction(it, qs) > 0.999;
const fmtPts = x => fmtInt(Math.round(x * 100) / 100);

function readStore(test) {
  const out = { deck: [], history: [] };
  try {
    const raw = localStorage.getItem(storeKey(test));
    if (!raw) return out;
    const data = JSON.parse(raw);
    const qs = test.questions;
    if (Array.isArray(data.deck)) out.deck = data.deck.filter(i => Number.isInteger(i) && i >= 0 && i < qs.length);
    for (const h of data.history || []) {
      if (!h.items || h.items.some(it => !qs[it.qi] || !Array.isArray(it.order) || it.order.length !== nOpts(qs[it.qi]) ||
          Array.isArray(it.picked) !== isMulti(qs[it.qi]))) continue;
      const a = {
        items: h.items.map(it => ({ ...it })),
        start: new Date(h.start), end: new Date(h.end),
        timed: !!h.timed, deadline: null, finished: true,
        score: h.score, max: h.max
      };
      out.history.push({ attempt: a, end: a.end, score: h.score, grade: h.score / h.max * 100 });
    }
  } catch (e) {}
  return out;
}

function saveStore() {
  if (!T) return;
  try {
    localStorage.setItem(storeKey(T), JSON.stringify({
      deck,
      history: history.map(h => ({
        start: h.attempt.start.getTime(), end: h.attempt.end.getTime(),
        timed: h.attempt.timed, score: h.score, max: h.attempt.max,
        items: h.attempt.items.map(it => ({ qi: it.qi, order: it.order, picked: it.picked, flagged: it.flagged }))
      }))
    }));
  } catch (e) {}
}

function draw(n) {
  const out = [];
  while (out.length < n) {
    if (!deck.length) {
      deck = shuffle(Q.map((_, i) => i)).filter(i => !out.includes(i));
      if (!deck.length) break;
    }
    out.push(deck.pop());
  }
  saveStore();
  return out;
}

const VIEWS = ["course", "view", "attempt", "summary", "review", "bank"];
let shown = null;
function show(view) {
  shown = view;
  for (const v of VIEWS) $(v).hidden = v !== view;
  $("navblock").hidden = !["attempt", "summary", "review"].includes(view);
  $("breadcrumb").hidden = view !== "view" && view !== "bank";
  window.scrollTo(0, 0);
}

function selectTest(test) {
  stopTimer();
  attempt = null;
  T = { ...DEFAULTS, ...test };
  Q = T.questions;
  const st = readStore(T);
  deck = st.deck;
  history = st.history;
  document.title = `${T.title} (procvičování)`;
  $("pageTitle").textContent = `${T.title} (procvičování)`;
}

const BH = window.history;
let lastKey = null;
let pushed = 0;
let pendingScroll = null;

const navKey = () => `${location.hash}|${(BH.state && BH.state.sub) || ""}|${(BH.state && BH.state.h) ?? ""}`;
function pushSub(sub, extra) { BH.pushState({ sub, ...extra }, ""); pushed++; lastKey = navKey(); }
function replaceSub(sub, extra) { BH.replaceState(sub ? { sub, ...extra } : null, ""); lastKey = navKey(); }
function goBack() {
  if (pushed > 0) BH.back();
  else { replaceSub(null); renderView(); }
}

function scrollToQuestion(idx) {
  const el = $(`question-${idx}`);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140 });
}
function showAttempt(scrollIdx) {
  show("attempt");
  renderNav("attempt");
  if (scrollIdx != null) scrollToQuestion(scrollIdx);
}

function navigate() {
  const key = navKey();
  if (key === lastKey) return;
  const st = BH.state || {};
  const inProgress = attempt && !attempt.finished;

  if (!$("modal").hidden) {
    closeModal();
    if (inProgress) { pushSub(shown === "summary" ? "summary" : "attempt"); return; }
  }
  if (inProgress && st.sub !== "attempt" && st.sub !== "summary") {
    if (shown === "summary") { pushSub("attempt"); showAttempt(); return; }
    pushSub("attempt");
    openModal("Opustit pokus?",
      `<p style="margin:0">Rozpracovaný pokus se neuloží a odpovědi se ztratí.</p>`,
      "Opustit pokus", () => { stopTimer(); attempt = null; BH.back(); });
    return;
  }

  lastKey = key;
  const id = decodeURIComponent(location.hash.slice(1));
  const test = TESTS.find(t => t.id === id);
  if (!test) { renderCourse(); return; }
  if (!T || T.id !== test.id) selectTest(test);

  if (st.sub === "bank") return renderBank();
  if (st.sub === "attempt" && inProgress) {
    showAttempt(pendingScroll); pendingScroll = null; return;
  }
  if (st.sub === "summary" && inProgress) return renderSummary();
  if (st.sub === "review" && Number.isInteger(st.h) && history[st.h]) {
    attempt = history[st.h].attempt;
    return renderReview();
  }
  if (st.sub) replaceSub(null);
  renderView();
}

function renderCourse() {
  stopTimer();
  T = null; attempt = null;
  document.title = "Cvičné testy";
  $("pageTitle").textContent = "Cvičné testy";
  $("activityList").innerHTML = TESTS.map(test => {
    const t = { ...DEFAULTS, ...test };
    const h = readStore(t).history;
    let meta = `${t.questions.length} otázek v bance · ${t.perAttempt} v pokusu`;
    if (h.length) {
      const best = Math.max(...h.map(x => x.grade)) / 100 * maxGrade(t);
      meta += ` · pokusů: ${h.length} · nejlepší ${fmtInt(Math.round(best * 100) / 100)} / ${maxGrade(t)}`;
    }
    return `<li class="activity-item">
      <div class="activity-icon">${QUIZ_ICON}</div>
      <div class="activity-body">
        <div class="activity-type">Test</div>
        <div class="activity-name"><a href="#${encodeURIComponent(t.id)}">${t.title}</a></div>
        <div class="activity-meta">${meta}</div>
      </div>
    </li>`;
  }).join("") || `<li>Zatím tu nejsou žádné testy.</li>`;
  show("course");
}

function renderView() {
  stopTimer();
  attempt = null;
  $("bankSize").textContent = Q.length;
  $("perAttempt").textContent = Math.min(T.perAttempt, Q.length);
  $$(".limitMin").forEach(el => el.textContent = T.timeLimit);
  $$(".maxGrade").forEach(el => el.textContent = maxGrade(T));
  $("startBtn").textContent = history.length ? "Zkusit test znovu" : "Zahájit pokus";
  $("limitInfo").hidden = !$("useTimer").checked;
  $("prevAttempts").hidden = !history.length;
  if (history.length) {
    const mg = maxGrade(T);
    const toGrade = pct => Math.round(pct / 100 * mg * 100) / 100;
    $("prevBody").innerHTML = history.map((h, i) =>
      `<tr><td>${i + 1}</td><td>Dokončeno<br><span style="font-size:14px">${fmtDateShort(h.end)}</span></td>` +
      `<td>${fmtInt(toGrade(h.grade))}</td><td>${Math.round(h.grade)} %</td><td><a data-rev="${i}">Revize</a></td></tr>`
    ).join("");
    $("prevBody").querySelectorAll("a[data-rev]").forEach(a =>
      a.addEventListener("click", () => { attempt = history[+a.dataset.rev].attempt; pushSub("review", { h: +a.dataset.rev }); renderReview(); }));
    const avg = history.reduce((s, h) => s + h.grade, 0) / history.length;
    const last = history.slice(-10);
    const avgLast = last.reduce((s, h) => s + h.grade, 0) / last.length;
    const totalQ = history.reduce((s, h) => s + h.attempt.items.length, 0);
    const totalOk = history.reduce((s, h) => s + h.attempt.items.filter(it => isRight(it)).length, 0);
    $("bestGrade").textContent = fmtInt(toGrade(Math.max(...history.map(h => h.grade))));
    $("avgGrade").textContent = fmtNum(avg / 100 * mg);
    $("avgLast").textContent = fmtNum(avgLast / 100 * mg);
    $("lastN").textContent = last.length;
    $("totalStats").textContent = `${totalOk} z ${totalQ}`;
  }
  show("view");
}

function startAttempt() {
  const timed = $("useTimer").checked;
  const now = new Date();
  attempt = {
    items: draw(Math.min(T.perAttempt, Q.length)).map(qi => ({
      qi, order: shuffle([...Array(nOpts(Q[qi])).keys()]), picked: emptyPick(Q[qi]), flagged: false
    })),
    start: now, end: null, timed,
    deadline: timed ? new Date(now.getTime() + T.timeLimit * 60 * 1000) : null,
    finished: false
  };
  renderAttempt();
  $("quiz-timer-wrapper").hidden = !timed;
  timerHidden = false;
  $("quiz-timer").classList.remove("hidden-time");
  $("toggle-timer").textContent = "Skrýt";
  if (timed) startTimer();
}

function itemState(it) {
  if (attempt && attempt.finished) {
    if (!answered(it)) return "notanswered";
    const f = fraction(it);
    return f > 0.999 ? "correct" : f > 0 ? "partiallycorrect" : "incorrect";
  }
  return answered(it) ? "answersaved" : "notyetanswered";
}
function stateText(st) {
  return { notyetanswered: "Dosud nezodpovězeno", answersaved: "Odpověď uložena",
           correct: "Správně", partiallycorrect: "Částečně správně", incorrect: "Nesprávně",
           notanswered: "Nezodpovězeno" }[st];
}
function gradeText(st, it) {
  if (["correct", "partiallycorrect", "incorrect", "notanswered"].includes(st))
    return `Bodů ${fmtPts(fraction(it) * T.points)} / ${T.points}`;
  return `Počet bodů z ${T.points}`;
}
const ICON_OK = `<span class="icon ok" title="Správně">✔</span>`;
const ICON_BAD = `<span class="icon bad" title="Nesprávně">✖</span>`;

function gapHTML(q, it, name, mode) {
  const bank = mode === "bank", locked = mode !== "attempt";
  let g = -1;
  return q.q.replace(/\[\[(\d+)\]\]/g, (_, n) => {
    g++;
    const key = +n - 1;
    const val = bank ? key : it.picked[g];
    const opts = `<option value=""${val === null ? " selected" : ""}></option>` +
      it.order.map(ci => `<option value="${ci}"${val === ci ? " selected" : ""}>${q.choices[ci]}</option>`).join("");
    let cls = "", icon = "";
    if (locked && val !== null) {
      cls = val === key ? " correct" : " incorrect";
      icon = val === key ? ICON_OK : ICON_BAD;
    }
    return `<span class="control"><select class="custom-select${cls}" name="${name}_g${g}" data-gap="${g}" aria-label="Mezera ${g + 1}"${locked ? " disabled" : ""}>${opts}</select>${icon}</span>`;
  });
}
function rightAnswerText(q) {
  const t = qType(q);
  if (t === "multi") return `Správné odpovědi jsou: ${q.c.map(i => q.o[i]).join(", ")}`;
  if (t === "gap") return `Správná odpověď je: ${q.q.replace(/\[\[(\d+)\]\]/g, (_, n) => `[${q.choices[n - 1]}]`)}`;
  return `Správná odpověď je: ${q.o[q.c]}`;
}

function questionHTML(it, idx, mode, domId) {
  const q = Q[it.qi];
  const t = qType(q);
  const bank = mode === "bank";
  const locked = mode !== "attempt";
  const st = bank ? "bank" : itemState(it);
  const name = `${mode}-q${idx}`;
  const flagSvg = `<svg viewBox="0 0 ${it.flagged ? 512 : 448} 512" aria-hidden="true"><path d="${it.flagged ? FLAG_FILLED : FLAG_PATH}"/></svg>`;
  let flagHTML = "";
  if (mode === "attempt") {
    flagHTML = `<div class="questionflag${it.flagged ? " flagged" : ""}"><a role="button" tabindex="0" data-flag="${idx}" title="Označení testové úlohy vlaječkou pro další použití">${flagSvg}${it.flagged ? "Odebrat vlaječku" : "Úloha s vlaječkou"}</a></div>`;
  } else if (mode === "review" && it.flagged) {
    flagHTML = `<div class="questionflag flagged"><a>${flagSvg}Úloha s vlaječkou</a></div>`;
  }

  const note = q.note ? `<p class="note-orig">${q.note}</p>` : "";
  const img = q.img ? `<img src="${q.img}" alt="">` : "";
  let html = `<div class="que ${t === "gap" ? "gapselect" : "multichoice"} ${st}" id="${domId}">
    <div class="info">
      <h3 class="no">Úloha <span class="qno">${idx + 1}</span></h3>
      ${bank ? "" : `<div class="state">${stateText(st)}</div><div class="grade">${gradeText(st, it)}</div>`}
      ${flagHTML}
    </div>
    <div class="content">
      <div class="formulation">`;

  if (t === "gap") {
    html += `<div class="qtext">${note}<div class="gaptext">${gapHTML(q, it, name, mode)}</div>${img}</div></div>`;
  } else {
    const multi = t === "multi";
    const letters = q.upper ? LETTERS.toUpperCase() : LETTERS;
    const isKey = oi => multi ? q.c.includes(oi) : oi === q.c;
    const isPicked = oi => multi ? it.picked.includes(oi) : it.picked === oi;
    const prompt = multi ? "Vyberte jednu nebo více možností:" : "Vyberte jednu z nabízených možností:";
    html += `<div class="qtext">${note}<p>${q.q}</p>${img}</div>
        <fieldset class="ablock">
          ${bank || q.noPrompt ? "" : `<legend>${prompt}</legend>`}
          <div class="answer">`;
    it.order.forEach((oi, k) => {
      const picked = isPicked(oi), key = isKey(oi);
      let cls = `r${k % 2}`, icon = "";
      if (locked && picked) {
        cls += key ? " correct" : " incorrect";
        icon = key ? ICON_OK : ICON_BAD;
      } else if (locked && key) {
        cls += " correct";
        icon = `<span class="icon ok" title="Správná odpověď">✔</span>`;
      }
      const id = `${name}_a${oi}`;
      html += `<div class="${cls}">
      <input type="${multi ? "checkbox" : "radio"}" name="${name}" id="${id}" value="${oi}" ${picked ? "checked" : ""} ${locked ? "disabled" : ""}>
      <label class="lbl" for="${id}"><span class="answernumber">${letters[k]}. </span><div class="flex-fill">${q.o[oi]}</div></label>${icon}
    </div>`;
    });
    html += `</div>`;
    if (!locked && !multi && it.picked !== null) html += `<div class="clearchoice"><a data-clear="${idx}">Zrušit mou volbu</a></div>`;
    html += `</fieldset></div>`;
  }

  if (mode === "review") {
    const fb = { correct: "Vaše odpověď je správná.", partiallycorrect: "Vaše odpověď je částečně správná.",
                 incorrect: "Vaše odpověď je nesprávná." }[st];
    html += `<div class="outcome"><div class="feedback">${fb ? `<div>${fb}</div>` : ""}<div class="rightanswer">${rightAnswerText(q)}</div></div></div>`;
  }
  return html + `</div></div>`;
}

function bindQuestion(root, idx) {
  const it = attempt.items[idx];
  root.querySelectorAll("input[type=radio]").forEach(inp =>
    inp.addEventListener("change", () => { it.picked = +inp.value; rerenderQuestion(idx, `#${inp.id}`); }));
  root.querySelectorAll("input[type=checkbox]").forEach(inp =>
    inp.addEventListener("change", () => {
      const v = +inp.value;
      it.picked = inp.checked ? [...new Set([...it.picked, v])] : it.picked.filter(x => x !== v);
      rerenderQuestion(idx, `#${inp.id}`);
    }));
  root.querySelectorAll("select[data-gap]").forEach(sel =>
    sel.addEventListener("change", () => {
      it.picked = it.picked.slice();
      it.picked[+sel.dataset.gap] = sel.value === "" ? null : +sel.value;
      rerenderQuestion(idx, `select[name="${sel.name}"]`);
    }));
  const clr = root.querySelector("[data-clear]");
  if (clr) clr.addEventListener("click", () => { it.picked = null; rerenderQuestion(idx); });
  const fl = root.querySelector("[data-flag]");
  if (fl) {
    const toggle = () => { it.flagged = !it.flagged; rerenderQuestion(idx); };
    fl.addEventListener("click", toggle);
    fl.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  }
}

function rerenderQuestion(idx, focusSel) {
  const tmp = document.createElement("div");
  tmp.innerHTML = questionHTML(attempt.items[idx], idx, "attempt", `question-${idx}`);
  const fresh = tmp.firstElementChild;
  $(`question-${idx}`).replaceWith(fresh);
  bindQuestion(fresh, idx);
  typeset(fresh);
  renderNav("attempt");
  const el = focusSel && fresh.querySelector(focusSel);
  if (el) el.focus({ preventScroll: true });
}

function renderAttempt() {
  const wrap = $("questions");
  wrap.innerHTML = attempt.items.map((it, i) => questionHTML(it, i, "attempt", `question-${i}`)).join("");
  attempt.items.forEach((_, i) => bindQuestion($(`question-${i}`), i));
  typeset(wrap);
  renderNav("attempt");
  show("attempt");
}

function renderNav(mode) {
  $("qnButtons").innerHTML = attempt.items.map((it, i) => {
    const st = itemState(it);
    const cls = ["qnbutton", st, it.flagged ? "flagged" : "", mode !== "summary" ? "thispage" : ""].join(" ");
    return `<a class="${cls}" data-nav="${i}" title="Úloha ${i + 1} - ${stateText(st)}"><span class="thispageholder"></span><span class="trafficlight"></span><span class="num">${i + 1}</span></a>`;
  }).join("");
  $("qnButtons").querySelectorAll("[data-nav]").forEach(a => a.addEventListener("click", () => {
    if (mode === "summary") { replaceSub("attempt"); show("attempt"); renderNav("attempt"); }
    const el = $((mode === "review" ? "rq-" : "question-") + a.dataset.nav);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90 - (attempt.timed && mode !== "review" ? 50 : 0);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }));
  if (mode === "review") {
    $("othernav").innerHTML = `<a id="navFinishReview">Dokončit revizi</a>`;
    $("navFinishReview").addEventListener("click", goBack);
  } else {
    $("othernav").innerHTML = `<a class="endtestlink" id="endLink">Konec testu…</a>`;
    $("endLink").addEventListener("click", openSummary);
  }
}

function startTimer() {
  stopTimer();
  const tick = () => {
    if (!attempt || !attempt.deadline) return stopTimer();
    const left = Math.round((attempt.deadline - Date.now()) / 1000);
    $("quiz-time-left").textContent = fmtClock(left);
    $("summaryTimeLeft").textContent = fmtClock(left);
    const t = $("quiz-timer");
    for (let i = 0; i <= 10; i++) t.classList.remove("t" + i);
    if (left <= 100) t.classList.add("t" + Math.max(0, Math.min(10, Math.floor(left / 10))));
    if (left <= 0) { stopTimer(); finishAttempt(); }
  };
  tick();
  timerId = setInterval(tick, 1000);
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

function openSummary() { replaceSub("summary"); renderSummary(); }
function renderSummary() {
  $("summaryBody").innerHTML = attempt.items.map((it, i) => {
    const flag = it.flagged ? ` <svg viewBox="0 0 512 512" width="13" height="16" style="vertical-align:-2px"><path fill="#ca3120" d="${FLAG_FILLED}"/></svg>` : "";
    return `<tr><td><a data-go="${i}">${i + 1}</a>${flag}</td><td>${stateText(itemState(it))}</td></tr>`;
  }).join("");
  $("summaryBody").querySelectorAll("[data-go]").forEach(a => a.addEventListener("click", () => {
    replaceSub("attempt"); show("attempt"); renderNav("attempt");
    const el = $(`question-${a.dataset.go}`);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140 });
  }));
  $("summaryTimer").hidden = !attempt.timed;
  $("dueText").textContent = fmtDate(attempt.deadline || new Date(attempt.start.getTime() + 7 * 24 * 3600 * 1000));
  renderNav("summary");
  show("summary");
}

function openModal(title, body, okText, action) {
  $("modalTitle").textContent = title;
  $("modalBody").innerHTML = body;
  $("modalOk").textContent = okText;
  modalAction = action;
  $("modal").hidden = false;
  $("modalOk").focus();
}
function closeModal() { $("modal").hidden = true; }

function finishAttempt() {
  if (!attempt || attempt.finished) return;
  stopTimer();
  attempt.finished = true;
  attempt.end = new Date();
  const sum = attempt.items.reduce((s, it) => s + fraction(it), 0);
  attempt.score = Math.round(sum * T.points * 100) / 100;
  attempt.max = attempt.items.length * T.points;
  history.push({ attempt, end: attempt.end, score: attempt.score, grade: attempt.score / attempt.max * 100 });
  saveStore();
  replaceSub("review", { h: history.length - 1 });
  renderReview();
}

function renderReview() {
  const a = attempt;
  $("reviewSummary").innerHTML = [
    ["Stav", "Dokončeno"],
    ["Zahájení", fmtDateReview(a.start)],
    ["Dokončeno", fmtDateReview(a.end)],
    ["Trvání", fmtDur((a.end - a.start) / 1000)],
    ["Známka", `${fmtInt(a.score)} z možných ${fmtInt(a.max)} (<b>${Math.round(a.score / a.max * 100)}%</b>)`]
  ].map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("");
  const wrap = $("reviewQuestions");
  wrap.innerHTML = a.items.map((it, i) => questionHTML(it, i, "review", `rq-${i}`)).join("");
  typeset(wrap);
  renderNav("review");
  show("review");
}

function renderBank() {
  if (bankRenderedFor !== T.id) {
    $("bankCount").textContent = Q.length;
    const wrap = $("bankQuestions");
    const saved = attempt;
    attempt = null;
    wrap.innerHTML = Q.map((q, qi) =>
      questionHTML({ qi, order: [...Array(nOpts(q)).keys()], picked: emptyPick(q), flagged: false }, qi, "bank", `bq-${qi}`)).join("");
    attempt = saved;
    typeset(wrap);
    bankRenderedFor = T.id;
  }
  show("bank");
}

$("startBtn").addEventListener("click", () => { startAttempt(); pushSub("attempt"); });
$("bankBtn").addEventListener("click", () => { pushSub("bank"); renderBank(); });
$$(".backToView").forEach(a => a.addEventListener("click", goBack));
$("useTimer").addEventListener("change", () => { $("limitInfo").hidden = !$("useTimer").checked; });
$("finishBtn").addEventListener("click", openSummary);
$("backToAttempt").addEventListener("click", () => { replaceSub("attempt"); showAttempt(); });
$("submitAll").addEventListener("click", () => {
  const unanswered = attempt.items.filter(it => !answered(it)).length;
  openModal("Odeslat vše a ukončit",
    `<p style="margin:0 0 8px">Jakmile odešlete své odpovědi, již je nebudete moci změnit.</p>` +
    (unanswered ? `<p style="margin:0">Úlohy bez odpovědi: ${unanswered}</p>` : ""),
    "Odeslat vše a ukončit", finishAttempt);
});
$("clearHistory").addEventListener("click", () => {
  openModal("Smazat historii pokusů",
    `<p style="margin:0">Opravdu chcete smazat všechny uložené pokusy tohoto testu? Tuto akci nelze vrátit.</p>`,
    "Smazat", () => {
      history = [];
      try { localStorage.removeItem(storeKey(T)); } catch (e) {}
      renderView();
    });
});
$("modalCancel").addEventListener("click", closeModal);
$("modalX").addEventListener("click", closeModal);
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });
$("modalOk").addEventListener("click", () => { closeModal(); if (modalAction) modalAction(); });
$("toggle-timer").addEventListener("click", () => {
  timerHidden = !timerHidden;
  $("quiz-timer").classList.toggle("hidden-time", timerHidden);
  $("toggle-timer").textContent = timerHidden ? "Zobrazit" : "Skrýt";
});

if ("scrollRestoration" in BH) BH.scrollRestoration = "manual";
window.addEventListener("popstate", () => { pushed = Math.max(0, pushed - 1); navigate(); });
window.addEventListener("hashchange", navigate);
if (location.hash && BH.state === null) {
  const h = location.hash;
  BH.replaceState(null, "", location.pathname + location.search);
  BH.pushState({ t: 1 }, "", h);
}
navigate();
