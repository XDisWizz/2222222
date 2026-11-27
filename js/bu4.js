"use strict";

const $ = id => document.getElementById(id);
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const VETY = [
  "KDO JINEMU JAMU KOPA SAM DO NI PADA",
  "BEZ PRACE NEJSOU KOLACE",
  "LEPSI VRABEC V HRSTI NEZ HOLUB NA STRESE",
  "CO MUZES UDELAT DNES NEODKLADEJ NA ZITRA",
  "DVAKRAT MER JEDNOU RIZNI",
  "ZADARMO ANI KURE NEHRABE",
  "RANNI PTACE DAL DOSKACE",
  "TICHA VODA BREHY MELE",
  "HLAD JE NEJLEPSI KUCHAR",
  "MLUVIT STRIBRO MLCETI ZLATO",
  "KURVA TO JE ALE TEZKA SIFRA",
  "DO PRDELE UZ ZASE TEST",
  "ZASE JSEM TO PODELAL",
  "HOVNO VIM ALE VYPADA TO DOBRE",
  "RSA MI MUZE POLIBIT PRDEL",
  "CAESAR BYL STEJNE KOKOT",
  "DOPICE TO SNAD NENI MOZNY",
  "PADESAT JEDNA BODU A JDU DOMU",
  "ZAPOCET NEBUDE A JE MI TO JEDNO",
  "UZ ABY BYL PATEK A PIVO"
];

const SLOVA = [
  "CHLEBA", "JABLKO", "HRUSKA", "VODA", "KAVA", "MASLO", "VEJCE", "RYBA", "SALAT", "POLEVKA",
  "ROHLIK", "KNIHA", "STUL", "OKNO", "DVERE", "AUTO", "VLAK", "KOLO", "LAMPA", "SKOLA",
  "TABULE", "PERO", "SESIT", "SIFRA", "KLIC", "ZAMEK", "HESLO", "DATA", "KABEL", "MODEM"
];

const caesar = (t, k) => [...t].map(c => ABC[(ABC.indexOf(c) + k + 26) % 26]).join("");
const powmod = (b, e, m) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; } return r; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;

function counts(t) {
  const c = {};
  for (const ch of t) c[ch] = (c[ch] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
}

function rsaKeys() {
  const P = [11, 13, 17, 19, 23];
  for (;;) {
    const p = pick(P), q = pick(P);
    if (p === q) continue;
    const n = p * q, f = (p - 1) * (q - 1);
    const e = pick([3, 5, 7, 11, 13, 17, 19, 23]);
    if (gcd(e, f) !== 1) continue;
    let d = 2;
    while ((e * d) % f !== 1) d++;
    if (d === e) continue;
    return { e, d, n };
  }
}

function generate() {
  let plain, top;
  for (;;) {
    plain = pick(VETY).replace(/ /g, "");
    top = counts(plain);
    if (top[0][1] > top[1][1]) break;
  }
  const k = 1 + rnd(25);
  const enc = caesar(plain, k);
  const word = pick(SLOVA);
  const keys = rsaKeys();
  const codes = [...word].map(c => c.charCodeAt(0));
  const cips = codes.map(m => powmod(m, keys.e, keys.n));
  return {
    plain, k, enc, mostCipher: caesar(top[0][0], k), mostPlain: top[0][0], mostCount: top[0][1],
    exLetter: pick(ABC.replace(caesar(top[0][0], k), "")), exShift: 1 + rnd(25),
    exText: enc.slice(5, 25),
    word, keys, codes, cips
  };
}

let task = null, done = false;

const FIELDS = [
  { id: "f1a", q: 1, pts: 1, key: t => t.mostCipher, norm: "text" },
  { id: "f1b", q: 1, pts: 3, key: t => t.plain, norm: "text" },
  { id: "f1c", q: 1, pts: 1, key: t => String(t.k), norm: "num" },
  { id: "f2a", q: 2, pts: 2, key: t => t.codes.join(""), norm: "num" },
  { id: "f2b", q: 2, pts: 3, key: t => t.cips.join(""), norm: "num" }
];
const norm = (v, how) => how === "num" ? v.replace(/\s+/g, "") : v.toUpperCase().replace(/\s+/g, "");
const fmt = x => String(x).replace(".", ",");

function field(id, pts, label) {
  return `<label class="cloze-row" for="${id}"><span>${label}</span>
    <span class="cloze-input"><input type="text" class="form-control" id="${id}" autocomplete="off" autocapitalize="characters" spellcheck="false"> <span class="cloze-pts">(${pts}b)</span><span class="cloze-icon" id="${id}-icon"></span></span></label>
    <div class="cloze-right" id="${id}-right" hidden></div>`;
}

function render() {
  const t = task;
  $("buQuestions").innerHTML = `
  <div class="que" id="bq1">
    <div class="info"><h3 class="no">Úloha <span class="qno">1</span></h3><div class="state" id="bq1-state">Dosud nezodpovězeno</div><div class="grade" id="bq1-grade">Počet bodů z 5</div></div>
    <div class="content"><div class="formulation"><div class="qtext">
      <p>Dešifrujte následující text pomocí frekvenční analýzy. Text byl zašifrován pomocí Caesarovy substituční šifry posunem vpravo.</p>
      <p><b>TEXT:</b> <span class="cipher">${t.enc}</span></p>
      <p><b>Poznámka: Dešifrovaný text dává smysl!!!</b></p>
      <p><b>Výsledky:</b></p>
      ${field("f1a", 1, `Jaký znak se v zašifrovaném textu vyskytuje nejčastěji? (např. ${t.exLetter}):`)}
      ${field("f1b", 3, `Napište dešifrovaný text (např. ${t.exText}):`)}
      ${field("f1c", 1, `O kolik znaků byl proveden posun? (např. ${t.exShift}):`)}
    </div></div><div class="solution" id="bq1-sol" hidden></div></div>
  </div>
  <div class="que" id="bq2">
    <div class="info"><h3 class="no">Úloha <span class="qno">2</span></h3><div class="state" id="bq2-state">Dosud nezodpovězeno</div><div class="grade" id="bq2-grade">Počet bodů z 5</div></div>
    <div class="content"><div class="formulation"><div class="qtext">
      <p>Zašifrujte následující text pomocí RSA po jednotlivých znacích.<br>
      Veřejný klíč (e,n) = (${t.keys.e},${t.keys.n})<br>
      Privátní klíč (d,n) = (${t.keys.d},${t.keys.n})</p>
      <p><b>TEXT:</b> <span class="cipher">${t.word}</span></p>
      <p><b>Výsledky:</b></p>
      ${field("f2a", 2, "Uveďte číselné vyjádření textu pomocí UTF-8. (např. 65727974):")}
      ${field("f2b", 3, "Napište zašifrovaný text (např. 14230139167):")}
    </div></div><div class="solution" id="bq2-sol" hidden></div></div>
  </div>`;
  $("buSummaryWrap").hidden = true;
  $("buSubmit").hidden = false;
  $("buNew").hidden = true;
  done = false;
  startTime = Date.now();
  startTimer();
}

let startTime = 0, timerId = null, timerHidden = false;
const LIMIT = 20 * 60;

function clock(sec) {
  sec = Math.max(0, sec);
  return `${Math.floor(sec / 3600)}:${String(Math.floor(sec % 3600 / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
function startTimer() {
  stopTimer();
  const deadline = Date.now() + LIMIT * 1000;
  const el = $("quiz-timer");
  const tick = () => {
    const left = Math.round((deadline - Date.now()) / 1000);
    $("quiz-time-left").textContent = clock(left);
    for (let i = 0; i <= 10; i++) el.classList.remove("t" + i);
    if (left <= 100) el.classList.add("t" + Math.max(0, Math.min(10, Math.floor(left / 10))));
    if (left <= 0) submit();
  };
  tick();
  timerId = setInterval(tick, 1000);
  $("quiz-timer-wrapper").hidden = false;
}

function solutionHTML(q) {
  const t = task;
  if (q === 1) {
    const top = counts(t.enc).slice(0, 3).map(([c, n]) => `${c} ${n}×`).join(", ");
    return `<b>Řešení:</b><ol>
      <li>Četnosti v šifře: ${top} → nejčastější <b>${t.mostCipher}</b>.</li>
      <li>${t.mostCipher} odpovídá v původním textu písmenu <b>${t.mostPlain}</b> → posun = ${t.mostCipher}(${ABC.indexOf(t.mostCipher)}) − ${t.mostPlain}(${ABC.indexOf(t.mostPlain)}) = <b>${t.k}</b> (mod 26).</li>
      <li>Cryptii: DECODE, TEXT do levého okna, SHIFT ${t.k} → vpravo <b>${t.plain}</b>.</li></ol>`;
  }
  const rows = [...t.word].map((c, i) => `<tr><td>${c}</td><td>${t.codes[i]}</td><td>${t.codes[i]}<sup>${t.keys.e}</sup> mod ${t.keys.n}</td><td><b>${t.cips[i]}</b></td></tr>`).join("");
  return `<b>Řešení:</b> c = m<sup>e</sup> mod n
    <div class="table-wrap"><table class="generaltable sol-table"><thead><tr><th>znak</th><th>m (ASCII)</th><th>výpočet</th><th>c</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p>WolframAlpha: <code>PowerMod[{${t.codes.join(",")}},${t.keys.e},${t.keys.n}]</code> → {${t.cips.join(", ")}}</p>`;
}

function submit() {
  if (done) return;
  done = true;
  stopTimer();
  $("quiz-timer-wrapper").hidden = true;
  const score = { 1: 0, 2: 0 };
  for (const f of FIELDS) {
    const inp = $(f.id);
    const ok = norm(inp.value, f.norm) === f.key(task) && inp.value.trim() !== "";
    if (ok) score[f.q] += f.pts;
    inp.disabled = true;
    inp.classList.add(ok ? "correct" : "incorrect");
    $(`${f.id}-icon`).innerHTML = ok ? `<span class="icon ok">✔</span>` : `<span class="icon bad">✖</span>`;
    const r = $(`${f.id}-right`);
    r.textContent = `Správná odpověď: ${f.key(task)}`;
    r.hidden = ok;
  }
  for (const q of [1, 2]) {
    const st = score[q] === 5 ? "correct" : score[q] > 0 ? "partiallycorrect" : "incorrect";
    $(`bq${q}`).classList.add(st);
    $(`bq${q}-state`).textContent = { correct: "Správně", partiallycorrect: "Částečně správně", incorrect: "Nesprávně" }[st];
    $(`bq${q}-grade`).textContent = `Bodů ${score[q]} / 5`;
    const sol = $(`bq${q}-sol`);
    sol.innerHTML = solutionHTML(q);
    sol.hidden = false;
  }
  const total = score[1] + score[2];
  const sec = Math.round((Date.now() - startTime) / 1000);
  $("buSummary").innerHTML = [
    ["Stav", "Dokončeno"],
    ["Trvání", `${Math.floor(sec / 60)} min. ${sec % 60} s`],
    ["Známka", `${fmt(total)} z možných 10 (<b>${total * 10}%</b>)`]
  ].map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("");
  $("buSummaryWrap").hidden = false;
  $("buSubmit").hidden = true;
  $("buNew").hidden = false;
  window.scrollTo(0, 0);
}

$("buSubmit").addEventListener("click", submit);
$("toggle-timer").addEventListener("click", () => {
  timerHidden = !timerHidden;
  $("quiz-timer").classList.toggle("hidden-time", timerHidden);
  $("toggle-timer").textContent = timerHidden ? "Zobrazit" : "Skrýt";
});
$("buNew").addEventListener("click", () => { task = generate(); render(); window.scrollTo(0, 0); });
task = generate();
render();
