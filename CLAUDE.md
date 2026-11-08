# Cvičné testy (Moodle styl)

Statický web s cvičnými verzemi testů z VŠB. Vypadá jako Moodle test, aby student nebyl na ostrém testu
překvapený prostředím. Běží na GitHub Pages, žádný build, žádné závislosti. Komunikuj česky.

## Struktura

- `index.html` – kostra stránky. **Seznam testů = řádky `<script src="tests/…js">` v `<head>`.**
- `js/app.js` – celá logika: seznam testů, úvodní stránka testu, pokus, souhrn, revize, banka otázek, časovač, historie v localStorage.
- `css/style.css` – vzhled převzatý z Moodle (barvy, rozměry, radio kolečka, časovač, navigace). Neměnit bez důvodu.
- `tests/<id>.js` – data jednoho testu (viz formát níže).
- `img/<id>/` – obrázky k otázkám daného testu.
- `tools/check.js` – kontrola dat: `node tools/check.js`.

Routing přes hash: `index.html` = seznam testů, `index.html#test-2` = konkrétní test.
Obrazovky uvnitř testu (banka, pokus, souhrn, revize) mají vlastní záznam v historii prohlížeče (`history.state.sub`),
takže tlačítko Zpět (hlavně na mobilu) vrací o krok v aplikaci; z rozpracovaného pokusu se nejdřív ptá.
V `app.js` je historie prohlížeče `BH` – proměnná `history` je tam historie pokusů.

## Formát testu

```js
registerTest({
  id: "test-3",                 // malá písmena, číslice, pomlčky; je i v URL (#test-3)
  title: "Test č. 3 - Název",   // přesně jako v Moodlu; bez „(procvičování)“, to se doplní samo
  perAttempt: 5,                // otázek v jednom pokusu (výchozí 5)
  points: 2,                    // bodů za otázku (výchozí 2)
  timeLimit: 10,                // minut pro volitelný časovač (výchozí 10)
  questions: [
    { q: "Text otázky:", o: ["možnost a", "možnost b", "možnost c"], c: 1 },
    { q: "Snellův zákon …:", img: "img/test-3/obrazek.jpg", o: ["…", "…"], c: 0 },
    { q: "…", note: "Poznámka zobrazená kurzívou nad otázkou", o: ["…", "…"], c: 0 }
  ]
});
```

- `c` = index správné odpovědi v `o` (0 = první). Pořadí možností se při pokusu míchá, takže na něm nezáleží.
- `noPrompt: true` skryje „Vyberte jednu z nabízených možností:“ (v Moodlu to u některých otázek chybí),
  `upper: true` čísluje možnosti `A.`, `B.`… místo `a.`, `b.`. Obojí nastav podle fotky originálu.

### Další typy otázek (`type`)

```js
// víc správných odpovědí (zaškrtávátka): c je pole indexů.
// Body jako v Moodlu: každá správná +1/počet správných, každá špatná −1/počet špatných, min. 0.
{ type: "multi", q: "Kmitočtová pásma … jsou?", o: ["2,4 kHz", "5 GHz", "6 GHz", "2,4 GHz"], c: [1, 2, 3] },

// rozbalovací seznamy v textu (Moodle „Vyberte chybějící slova“): [[n]] = správná je choices[n-1].
// Každý seznam nabízí všechny choices; body po částech podle počtu správně vybraných mezer.
{ type: "gap", q: "<b>Demodulátor</b> … patří do [[2]] části přenosového řetězce.", choices: ["vysílací", "přijímací"] },
{ type: "gap", q: "Seřaďte …:<ol><li>[[1]] vlny</li><li>[[2]] vlny</li><li>[[3]] vlny</li></ol>",
  choices: ["Dlouhé", "Střední", "Krátké"] }
```

- Sdílené konstanty v souboru testu (např. text `note`) obal do bloku `{ … }`, ať se nehádají s jinými testy (viz `tests/test-3.js`).
- Pro náhled v prohlížeči stačí dvojklik na `index.html`, nebo `python -m http.server` v této složce.
- Vzorce piš v MathJax: `\\(P_{out} = P_{in}10^{-\\frac{A}{10}}\\)` (v JS stringu dvojité zpětné lomítko).
- Max. 8 možností na otázku.
- `storageKey` nepoužívej u nových testů (je jen u test-2 kvůli zachování historie uživatelů).

## Pravidla pro obsah

- **Znění 1:1 podle ostrého testu.** Má-li uživatel fotky/screenshoty z ostrého testu, ty mají přednost před PDF/Word přepisy:
  stejná slova, interpunkce (dvojtečka na konci jen tam, kde je v originále), velká/malá písmena u možností,
  stejné značení proměnných (např. měrný útlum je v testu `a`, ne `α`).
- Správnou odpověď vždy ověř: z označení v podkladech, a pokud chybí nebo odporuje fyzice, **zeptej se uživatele** – nehádej.
- Když v originále chybí špatné možnosti, doplň věrohodné a přidej `note`, že jsou doplněné.
- Nesrovnalosti v podkladech (překlepy, chybné zadání) **nahlas uživateli** a oprav jen to, co schválí.
- Obrázky vkládej tak, jak jsou v originále (nepřekreslovat). Z JPEGů odstraň metadata (EXIF).
- Do repozitáře nedávej nic, co identifikuje uživatele (jméno, login, e-mail, URL Moodlu, ID pokusů) ani komentáře s takovými údaji.

## Postup přidání testu

Když uživatel chce přidat test (nebo opravit znění podle originálu), postupuj takto:

1. **Podklady.** Zjisti, co uživatel dodal (PDF/DOCX přepis, fotky z ostrého testu, screenshoty). Fotky z ostrého testu
   mají přednost – jsou zdrojem přesného znění. Pokud podklady nemáš, zeptej se, kde jsou.
2. **Přečti všechno.** Text z PDF/DOCX vytáhni, fotky si prohlédni (u malého písma si výřez zvětši).
   Správná odpověď je v podkladech typicky zvýrazněná (barva, tučně) nebo na fotce revize označená ✓.
   Pozor: na fotce revize ✗ znamená jen špatnou volbu studenta, ne nutně, která je správná.
3. **Vytvoř `tests/<id>.js`** podle formátu v CLAUDE.md. `id` vymysli krátké (`test-3`, `zele-test-1`…),
   `title` podle názvu testu. Zeptej se na `perAttempt`, `points` a `timeLimit`, pokud nejsou z podkladů jasné
   (z fotek revize jde vyčíst body za úlohu a „Známka X z možných Y“).
4. **Obrázky** ulož do `img/<id>/` v původní podobě, bez EXIF, a odkazuj relativní cestou.
5. **Zaregistruj test**: přidej `<script src="tests/<id>.js"></script>` do `<head>` v `index.html` (pod ostatní testy).
6. **Zkontroluj**: `node tools/check.js` → musí projít. Pak otevři `index.html` a jeden pokus projdi.
7. **Report uživateli**: kolik otázek, odkud je znění, které odpovědi nešly ověřit a jaké nesrovnalosti v podkladech jsi našel
   (bez zásahu do nich, pokud je neschválil). Nabídni commit + push.

## Kontrola po každé změně

1. `node tools/check.js` musí skončit „Vše v pořádku.“
2. Otevři `index.html` v prohlížeči (stačí dvojklik, funguje i z disku) a projdi: seznam testů → test → pokus → odeslání → revize → banka otázek.

## Nasazení

Obsah této složky patří do kořene GitHub repozitáře s GitHub Pages (větev `main`, složka `/`).
Po `git push` se web do pár minut aktualizuje.
