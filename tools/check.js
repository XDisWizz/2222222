#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="(tests\/[^"]+\.js)"><\/script>/g)].map(m => m[1]);

const errors = [];
const warnings = [];
const tests = [];

const onDisk = fs.readdirSync(path.join(root, "tests")).filter(f => f.endsWith(".js")).map(f => "tests/" + f);
for (const f of onDisk) if (!files.includes(f)) warnings.push(`${f} existuje, ale není načtený v index.html`);

for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { errors.push(`${file}: soubor neexistuje (je odkazovaný v index.html)`); continue; }
  const before = tests.length;
  try {
    vm.runInNewContext(fs.readFileSync(full, "utf8"), { registerTest: t => tests.push({ ...t, _file: file }) }, { filename: file });
  } catch (e) {
    errors.push(`${file}: chyba syntaxe – ${e.message}`);
    continue;
  }
  if (tests.length === before) errors.push(`${file}: nevolá registerTest(...)`);
}

const ids = new Set();
for (const t of tests) {
  const where = `${t._file} (${t.id || "bez id"})`;
  if (!t.id || !/^[a-z0-9-]+$/.test(t.id)) errors.push(`${where}: id musí být malá písmena, číslice a pomlčky`);
  if (ids.has(t.id)) errors.push(`${where}: duplicitní id`);
  ids.add(t.id);
  if (!t.title) errors.push(`${where}: chybí title`);
  if (!Array.isArray(t.questions) || !t.questions.length) { errors.push(`${where}: chybí questions`); continue; }
  const per = t.perAttempt ?? 5;
  if (t.questions.length < per) warnings.push(`${where}: méně otázek (${t.questions.length}) než perAttempt (${per})`);

  const seen = new Map();
  t.questions.forEach((q, i) => {
    const n = `${where} otázka ${i + 1}`;
    const type = q.type || "single";
    if (typeof q.q !== "string" || !q.q.trim()) { errors.push(`${n}: chybí text q`); return; }
    const opts = type === "gap" ? q.choices : q.o;
    const field = type === "gap" ? "choices" : "o";
    if (!["single", "multi", "gap"].includes(type)) errors.push(`${n}: neznámý type "${type}" (single, multi, gap)`);
    else if (!Array.isArray(opts) || opts.length < 2) errors.push(`${n}: ${field} musí mít aspoň 2 možnosti`);
    else {
      const inRange = c => Number.isInteger(c) && c >= 0 && c < opts.length;
      if (type === "single" && !inRange(q.c)) errors.push(`${n}: c=${q.c} je mimo rozsah 0–${opts.length - 1}`);
      if (type === "multi") {
        if (!Array.isArray(q.c) || !q.c.length || !q.c.every(inRange) || new Set(q.c).size !== q.c.length)
          errors.push(`${n}: u multi musí být c pole různých indexů 0–${opts.length - 1}`);
        else if (q.c.length === opts.length) errors.push(`${n}: u multi nesmí být správně všechny možnosti`);
      }
      if (type === "gap") {
        const gaps = [...q.q.matchAll(/\[\[(\d+)\]\]/g)].map(m => +m[1]);
        if (!gaps.length) errors.push(`${n}: gap otázka nemá žádné [[n]]`);
        for (const g of gaps) if (g < 1 || g > opts.length) errors.push(`${n}: [[${g}]] je mimo rozsah 1–${opts.length}`);
      }
      const dup = opts.filter((x, k) => opts.indexOf(x) !== k);
      if (dup.length) errors.push(`${n}: duplicitní možnosti ${JSON.stringify(dup)}`);
      if (opts.length > 8) errors.push(`${n}: víc než 8 možností`);
    }
    if (q.img && !fs.existsSync(path.join(root, q.img))) errors.push(`${n}: obrázek ${q.img} neexistuje`);
    const all = [q.q, ...(opts || [])].join(" ");
    const open = (all.match(/\\\(/g) || []).length, close = (all.match(/\\\)/g) || []).length;
    if (open !== close) errors.push(`${n}: nespárované \\( \\) ve vzorci`);
    const key = q.q + "|" + JSON.stringify(opts);
    if (seen.has(key)) warnings.push(`${n}: stejná jako otázka ${seen.get(key) + 1}`);
    else seen.set(key, i);
  });
  console.log(`✓ ${t.id}: ${t.questions.length} otázek, ${per} v pokusu, ${t.points ?? 2} b. za otázku`);
}

for (const w of warnings) console.log("⚠ " + w);
for (const e of errors) console.log("✗ " + e);
console.log(errors.length ? `\n${errors.length} chyb.` : "\nVše v pořádku.");
process.exit(errors.length ? 1 : 0);
