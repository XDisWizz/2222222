registerTest({
  id: "test-2",
  title: "Test č. 2 - Metalická vedení a optická vlákna",
  storageKey: "kviz-historie-v2",
  perAttempt: 5,
  points: 2,
  timeLimit: 10,
  questions: [
    { q: "Charakteristická impedance \\(Z_c\\) metalického vedení",
      o: ["závisí na délce vedení, závisí na frekvenci přenášeného signálu",
          "nezávisí na délce vedení, nezávisí na frekvenci přenášeného signálu",
          "nezávisí na délce vedení, závisí na frekvenci přenášeného signálu",
          "závisí na délce vedení, nezávisí na frekvenci přenášeného signálu"], c: 2 },
  
    { q: "Přeslech je",
      o: ["přechod části signálu z generátoru do rušeného vedení",
          "přechod části signálu z rušeného do rušicího vedení",
          "přechod části signálu z rušicího do rušeného vedení"], c: 2 },
  
    { q: "Je-li \\(A\\) útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km], \\(P_{in}\\) je výkon navázaný do optického vlákna [W] a \\(P_{out}\\) je výkon detekovaný na výstupu optického vlákna [W], pak délku trasy \\(l\\) [km] lze spočítat jako:",
      o: ["\\(l = \\frac{A}{a}\\)",
          "\\(l = \\frac{1}{A}10\\log(\\frac{P_{in}}{P_{out}})\\)",
          "\\(l = \\frac{a}{A}\\)",
          "\\(l = \\frac{1}{A}10\\log(\\frac{P_{out}}{P_{in}})\\)"], c: 0 },
  
    { q: "Při průchodu světla z prostředí opticky řidšího do prostředí opticky hustšího se světlo láme:",
      o: ["ke kolmici vzhledem k rozhraní optického prostředí",
          "od kolmice vzhledem k rozhraní optického prostředí"], c: 0 },
  
    { q: "Metoda sdílení přenosového média použitím rozdílných vlnových délek pro jednotlivé kanály se označuje:",
      o: ["WDM", "TDM", "FDM"], c: 0 },
  
    { q: "Příčná admitance \\(Y\\) metalického vedení je dána",
      o: ["\\(Y = R + j\\omega L\\)",
          "\\(Y = \\sqrt{G + j\\omega C}\\)",
          "\\(Y = \\sqrt{R + j\\omega L}\\)",
          "\\(Y = G + j\\omega C\\)"], c: 3 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km] a \\(P_{in}\\) [W] je vstupní výkon navázaný do optického vlákna, pak výkon detekovaný na výstupu optického vlákna \\(P_{out}\\) [W] lze spočítat jako:",
      o: ["\\(P_{out} = P_{in}10^{-\\frac{10}{A}}\\)",
          "\\(P_{out} = P_{in}10^{\\frac{A}{10}}\\)",
          "\\(P_{out} = P_{in}10^{-\\frac{A}{10}}\\)",
          "\\(P_{out} = P_{in}10^{\\frac{al}{10}}\\)"], c: 2 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km] a \\(P_{in}\\) [W] je vstupní výkon navázaný do optického vlákna, pak výkon detekovaný na výstupu optického vlákna \\(P_{out}\\) [W] lze spočítat jako:",
      o: ["\\(P_{out} = P_{in}10^{\\frac{A}{10}}\\)",
          "\\(P_{out} = P_{in}10^{\\frac{al}{10}}\\)",
          "\\(P_{out} = P_{in}10^{-\\frac{al}{10}}\\)"], c: 2 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km] a \\(P_{out}\\) [W] je výkon detekovaný na výstupu optického vlákna, pak vstupní výkon navázaný do optického vlákna \\(P_{in}\\) [W] lze spočítat jako:",
      o: ["\\(P_{in} = P_{out}10^{-\\frac{A}{10}}\\)",
          "\\(P_{in} = P_{out}10^{\\frac{10}{A}}\\)",
          "\\(P_{in} = P_{out}10^{\\frac{A}{10}}\\)",
          "\\(P_{in} = P_{out}10^{-\\frac{al}{10}}\\)"], c: 2 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km] a \\(P_{out}\\) [W] je výkon detekovaný na výstupu optického vlákna, pak vstupní výkon navázaný do optického vlákna \\(P_{in}\\) [W] lze spočítat jako:",
      o: ["\\(P_{in} = P_{out}10^{\\frac{al}{10}}\\)",
          "\\(P_{in} = P_{out}10^{-\\frac{al}{10}}\\)",
          "\\(P_{in} = P_{out}10^{-\\frac{A}{10}}\\)"], c: 0 },
  
    { q: "Útlum přeslechu se snažíme",
      o: ["nebrat v úvahu", "minimalizovat", "maximalizovat"], c: 2 },
  
    { q: "Charakteristická impedance metalického vedení \\(Z_c\\) má jednotky",
      o: ["\\(\\sqrt{\\Omega}\\)", "\\(\\Omega/km\\)", "\\(\\sqrt{\\Omega}/km\\)",
          "\\(\\Omega^2\\)", "\\(\\Omega\\)", "\\(\\Omega^2/km\\)"], c: 4 },
  
    { q: "Útlum limituje:",
      o: ["vlnovou délku", "přenosovou rychlost", "překlenutelnou vzdálenost"], c: 2 },
  
    { q: "Módová disperze je způsobena:",
      o: ["Rozdílnými vlnovými délkami jednotlivých módů",
          "Rozdílnými časy šíření jednotlivých módů"], c: 1 },
  
    { q: "Koaxiální kabely se vyznačují symetrií",
      o: ["kapacitní", "impedanční", "napěťovou", "geometrickou", "odporovou"], c: 3 },
  
    { q: "Módovou disperzi lze odstranit použitím:",
      o: ["jiné modulace", "jednomódových vláken", "gradientních vláken",
          "jiné přenosové rychlosti", "jiné vlnové délky"], c: 1 },
  
    { q: "Je-li \\(A\\) útlum optického vlákna [dB], \\(a\\) je měrný útlum optického vlákna [dB/km], \\(P_{in}\\) je výkon navázaný do optického vlákna [W] a \\(P_{out}\\) je výkon detekovaný na výstupu optického vlákna [W], pak délku trasy \\(l\\) [km] lze spočítat jako:",
      o: ["\\(l = \\frac{1}{A}10\\log(\\frac{P_{out}}{P_{in}})\\)",
          "\\(l = \\frac{1}{A}10\\log(\\frac{P_{in}}{P_{out}})\\)",
          "\\(l = \\frac{1}{a}10\\log(\\frac{P_{in}}{P_{out}})\\)"], c: 2 },
  
    { q: "Index lomu prostředí \\(n\\) udává:",
      o: ["kolikrát rychleji se světlo v daném prostředí šíří oproti vákuu",
          "kolikrát pomaleji se světlo v daném prostředí šíří oproti vákuu"], c: 1 },
  
    { q: "Symetrické kabely se vyznačují symetrií",
      o: ["kapacitní", "napěťovou", "odporovou", "geometrickou", "impedanční"], c: 0 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(P_{in}\\) je výkon navázaný do optického vlákna [W] a \\(P_{out}\\) je výkon detekovaný na výstupu optického vlákna [W], pak měrný útlum optického vlákna \\(a\\) [dB/km] lze spočítat jako:",
      o: ["\\(a = \\frac{A}{l}10\\log(\\frac{P_{in}}{P_{out}})\\)",
          "\\(a = \\frac{A}{l}\\)",
          "\\(a = \\frac{l}{A}\\)",
          "\\(a = \\frac{1}{A}10\\log(\\frac{P_{in}}{P_{out}})\\)"], c: 1 },
  
    { q: "Je-li \\(l\\) délka optického vlákna [km], \\(A\\) je útlum optického vlákna [dB], \\(P_{in}\\) je výkon navázaný do optického vlákna [W] a \\(P_{out}\\) je výkon detekovaný na výstupu optického vlákna [W], pak měrný útlum optického vlákna \\(a\\) [dB/km] lze spočítat jako:",
      o: ["\\(a = \\frac{A}{l}10\\log(\\frac{P_{out}}{P_{in}})\\)",
          "\\(a = \\frac{1}{A}10\\log(\\frac{P_{in}}{P_{out}})\\)",
          "\\(a = \\frac{1}{l}10\\log(\\frac{P_{in}}{P_{out}})\\)"], c: 2 },
  
    { q: "Normalizovaná frekvence je definována:",
      o: ["\\(V = \\frac{1}{NA}\\lambda\\)",
          "\\(V = \\pi\\frac{NA}{\\lambda}\\)",
          "\\(V = \\frac{d\\pi}{\\lambda}NA\\)"], c: 2 },
  
    { q: "Rayleighův rozptyl je způsoben nehomogenitami:",
      o: ["většími než je vlnová délka", "srovnatelnými s vlnovou délkou", "menšími než je vlnová délka"], c: 2 },
  
    { q: "Pokud není vedení zakončeno charakteristickou impedancí, dochází k",
      o: ["přeměně signálu v teplo", "odrazům signálu zpět do vedení", "vyzáření signálu do vzduchu"], c: 1 },
  
    { q: "Fermatův princip říká, že světlo se z bodu \\(A\\) do bodu \\(B\\) šíří tak, aby:",
      o: ["čas šíření byl nejmenší", "uražená dráha byla největší"], c: 0 },
  
    { q: "Podélná impedance \\(Z\\) metalického kabelu je dána",
      o: ["\\(Z = R + j\\omega L\\)",
          "\\(Z = \\sqrt{G + j\\omega C}\\)",
          "\\(Z = \\sqrt{R + j\\omega L}\\)",
          "\\(Z = G + j\\omega C\\)"], c: 0 },
  
    { q: "Chromatická disperze je způsobena:",
      o: ["spektrální závislostí relativního rozdílu indexů lomu",
          "spektrální závislostí útlumu vlákna",
          "spektrální závislostí indexu lomu",
          "spektrální závislostí numerické apertury"], c: 2 },
  
    { q: "Světlo se v optickém vlákně šíří na principu:",
      o: ["Snellova zákona", "Totálního vnitřního odrazu", "Fermatova principu"], c: 1 },
  
    { q: "Vlnová délka je vzdálenost:",
      o: ["kterou světlo ve vakuu urazí za dobu jedné periody",
          "mezi dvěma nejbližšími paprsky",
          "mezi body stejné rychlosti"], c: 0 },
  
    { q: "Snellův zákon lomu je v souvislosti s obrázkem definován jako:",
      img: "img/test-2/snell.jpg",
      o: ["\\(n_1sin(\\varphi_2) = n_2sin(\\varphi_1)\\)",
          "\\(n_1cos(\\varphi_1) = n_2cos(\\varphi_2)\\)",
          "\\(n_1sin(\\varphi_1) = n_2sin(\\varphi_2)\\)",
          "\\(n_1cos(\\varphi_2) = n_2cos(\\varphi_1)\\)"], c: 2 },
  
    { q: "Index lomu \\(n\\) je definován jako:",
      o: ["\\(n = vc\\)", "\\(n = \\frac{v}{c}\\)", "\\(n = \\frac{c}{v}\\)"], c: 2 },
  
    { q: "Rayleighův rozptyl je:",
      o: ["směrový", "všesměrový"], c: 1 },
  
    { q: "Normalizovaná frekvence má jednotku",
      o: ["Bezrozměrná", "\\(\\dfrac{1}{\\mathrm{s}}\\)", "\\(\\dfrac{1}{\\mathrm{Hz}}\\)", "\\(\\dfrac{\\mathrm{Hz}}{\\mathrm{km}}\\)"], c: 0 },
  
    { q: "Je-li Z podélná impedance a Y příčná impedance metalického vedení, pak je charakteristická impedance \\(Z_C\\) dána:",
      o: ["\\(Z_C = \\dfrac{Z}{Y}\\)", "\\(Z_C = \\sqrt{\\dfrac{Z}{Y}}\\)",
          "\\(Z_C = \\sqrt{\\dfrac{Y}{Z}}\\)", "\\(Z_C = \\dfrac{Y}{Z}\\)"], c: 1 },
  
    { q: "Numerickou aperturu vypočítáme:",
      note: "V originále je jen správná odpověď – ostatní možnosti jsou doplněné.",
      o: ["\\(NA = \\sqrt{n_1^2 - n_2^2}\\)",
          "\\(NA = \\sqrt{n_1^2 + n_2^2}\\)",
          "\\(NA = n_1^2 - n_2^2\\)",
          "\\(NA = \\dfrac{n_1}{n_2}\\)"], c: 0 }
  ]
});
