{
const DOPLNENO = "V originále je jen správná odpověď – ostatní možnosti jsou doplněné.";
const RETEZEC = ["vysílací", "přijímací"];

registerTest({
  id: "test-3",
  title: "Test č. 3 - Přístupové sítě a počítačové sítě",
  perAttempt: 5,
  points: 2,
  timeLimit: 10,
  questions: [
    { q: "Má dle radiokomunikační rovnice <b>vlnová délka</b> vliv na hodnotu přijímací výkonové úrovně?",
      o: ["ano, ale jen při konstantní vysílací úrovni", "ne, nikdy", "ano, vždy",
          "ano, ale jen při konstantním zisku antén"], c: 2 },

    { q: "Má zisk vysílací antény vliv na hodnotu přijímací výkonové úrovně?",
      note: DOPLNENO,
      o: ["ano, vždy", "ne, nikdy", "ano, ale jen při konstantní vysílací úrovni",
          "ano, ale jen při konstantní vlnové délce"], c: 0 },

    { type: "gap",
      q: "<b>Koncový stupeň (např. reproduktor)</b> je funkční blok radiokomunikačního řetězce, který patří do [[2]] části přenosového řetězce.",
      choices: RETEZEC },

    { type: "gap",
      q: "<b>Zdrojový kodér</b> je funkční blok radiokomunikačního řetězce, který patří do [[1]] části přenosového řetězce.",
      choices: RETEZEC },

    { type: "gap",
      q: "<b>Demodulátor</b> je funkční blok radiokomunikačního řetězce, který patří do [[2]] části přenosového řetězce.",
      choices: RETEZEC },

    { type: "gap",
      q: "<b>Modulátor</b> je funkční blok radiokomunikačního řetězce, který patří do [[1]] části přenosového řetězce.",
      choices: RETEZEC },

    { type: "gap",
      q: "<b>Zdroj signálu</b> je funkční blok radiokomunikačního řetězce, který patří do [[1]] části přenosového řetězce.",
      choices: RETEZEC },

    { type: "gap",
      q: "Seřaďte kmitočtové rozsahy od nejnižšího kmitočtu po nejvyšší kmitočet:<ol><li>[[1]] vlny</li><li>[[2]] vlny</li><li>[[3]] vlny</li></ol>",
      choices: ["Dlouhé", "Střední", "Krátké"] },

    { type: "gap",
      q: "Seřaďte kmitočtové rozsahy od nejkratší vlnové délky po nejdelší vlnovou délku:<ol><li>[[1]] vlny</li><li>[[2]] vlny</li><li>[[3]] vlny</li></ol>",
      choices: ["Ultra Krátké", "Velmi Krátké", "Krátké"] },

    { q: "Většina moderních rádiových technologií pracuje v kmitočtovém pásmu?", noPrompt: true,
      o: ["UHF (Ultra High Frequency)", "infračervených vln", "VHF (Very High Frequency)",
          "odpovídající vysokorychlostním datovým přenosům"], c: 0 },

    { type: "multi",
      q: "Kmitočtová pásma užívaná v ČR pro technologii WLAN (WiFi) jsou?", noPrompt: true,
      o: ["2,4 kHz", "ani jedno z uvedených", "5 GHz", "868 MHz", "6 GHz", "2,4 GHz"], c: [2, 4, 5] },

    { q: "Jak se nazývá organizace, která spravuje kmitočtové spektrum v ČR?",
      o: ["Ministerstvo průmyslu a obchodu", "Český telekomunikační úřad", "Asociace mobilních operátorů",
          "Ministerstvo pro místní rozvoj"], c: 1 },

    { q: "Maximální povolený vysílací výkon v pásmu ISM 2,4 GHz pro technologii WLAN IEEE 802.11 je?",
      note: DOPLNENO,
      o: ["100 mW", "10 mW", "25 mW", "1 W"], c: 0 },

    { type: "gap",
      q: "Frekvenční spektra sousedních kanálů technologie 802.11g WiFi se vzájemně [[1]].",
      note: DOPLNENO,
      choices: ["překrývají", "nepřekrývají"] },

    { q: "Může u technologie 802.11g WiFi komunikovat bez vzájemného rušení na všech 13 kanálech současně?",
      note: DOPLNENO,
      o: ["Ne, nikdy", "Ano, vždy", "Ano, ale jen při nízkém vysílacím výkonu", "Ano, ale jen v pásmu 5 GHz"], c: 0 },

    { type: "gap",
      q: "<b>Bluetooth</b> je bezdrátová technologie určená pro komunikaci na [[1]] vzdálenosti.",
      note: DOPLNENO,
      choices: ["malé", "střední", "velké"] },

    { q: "Zigbee je bezdrátová technologie určená zejména pro:",
      note: DOPLNENO,
      o: ["senzorické sítě", "přenos videa ve vysokém rozlišení", "mobilní telefonii", "satelitní komunikaci"], c: 0 },

    { q: "Vlastnosti rádiové technologie pro internet věcí jako např. LoRa či Narrow Band IoT jsou?",
      o: ["velký dosah, velké přenosové rychlosti, velká spotřeba", "velký dosah, nízké přenosové rychlosti, malá spotřeba",
          "velký dosah, velké přenosové rychlosti, malá spotřeba", "malý dosah, velké přenosové rychlosti, velká spotřeba"], c: 1 },

    { q: "Jaký je hlavní úkol pozemních stanic (gateway) systému Starlink?", noPrompt: true,
      o: ["zajišťovat ochranu satelitů před vesmírným odpadem", "slouží jako záložní napájecí stanice pro satelity",
          "posílat povely pro stabilizaci družic na oběžné dráze", "přijímat signál od satelitů a připojovat je k Internetu"], c: 3 },

    { q: "BER (Bit error ratio) je poměr chybně přijatých bitů vůči celkovému počtu přijatých bitů.",
      note: DOPLNENO,
      o: ["Pravda", "Nepravda"], c: 0 },

    { q: "Pokud bude SNR = 0 dB, tak kapacita kanálu bude?",
      note: DOPLNENO,
      o: ["Rovna šířce pásma B", "Nulová", "Nekonečná", "Rovna dvojnásobku šířky pásma B"], c: 0 },

    { q: "Co je přístupová síť?", upper: true,
      o: ["síť s přístupovým mechanismem", "je to síť bezprostředně spojující zákazníka s poskytovatelem služby (např. Internetu)",
          "síť s podmíněným přístupem", "je vždy počítačová síť"], c: 1 },

    { q: "Mezi přístupové sítě můžeme řadit?",
      note: DOPLNENO,
      o: ["Technologie xDSL", "Páteřní sítě operátorů", "Mezikontinentální podmořské kabely",
          "Internetové výměnné uzly (IXP)"], c: 0 },

    { q: "Zařízení splitter u systému xDSL slouží?",
      note: DOPLNENO,
      o: ["k oddělení datového a hovorového kmitočtového pásma", "k rozdělení optického signálu do více vláken",
          "k zesílení signálu na dlouhých vedeních", "k připojení více účastníků na jedno vedení"], c: 0 },

    { q: "U systému xDSL se vzrůstající délkou připojeného vedení?",
      note: DOPLNENO,
      o: ["Útlum vedení vzrůstá", "Útlum vedení klesá", "Útlum vedení se nemění", "Přenosová rychlost vzrůstá"], c: 0 },

    { q: "Limitujícím faktorem pro zavádění vysokorychlostních přípojek typu xDSL v ČR je?",
      note: DOPLNENO,
      o: ["Délka současného (účastnického vedení) vedení", "Počet účastníků v lokalitě",
          "Nedostatek kmitočtového spektra", "Cena koncových zařízení"], c: 0 },

    { q: "Přípojky typu xDSL jsou citlivé?",
      note: DOPLNENO,
      o: ["na nízké hodnoty odstupu signálu od šumu", "na vysoké hodnoty odstupu signálu od šumu",
          "na změny okolní teploty", "na rušení od optických kabelů"], c: 0 },

    { q: "Jaká je hlavní přednost systému ADSL2+?",
      note: DOPLNENO,
      o: ["zvýšení dostupné přenosové rychlosti díky rozšíření pásma", "symetrická přenosová rychlost v obou směrech",
          "nezávislost na délce účastnického vedení", "přenos po optickém vlákně"], c: 0 },

    { q: "U systému ADSL?",
      note: DOPLNENO,
      o: ["se směr uplink přenáší na nižších kmitočtech než downlink", "se směr uplink přenáší na vyšších kmitočtech než downlink",
          "jsou uplink i downlink na stejných kmitočtech", "je přenosová rychlost v obou směrech stejná"], c: 0 },

    { q: "ADSL znamená?",
      note: DOPLNENO,
      o: ["Asymetrická digitální účastnická přípojka", "Analogová digitální sériová linka",
          "Asynchronní datová síťová linka", "Automatická digitální spojovací linka"], c: 0 },

    { q: "Tzv. rDSLAM je?",
      note: DOPLNENO,
      o: ["tzv. předsunutý rozvaděč pro technologii xDSL", "optický rozbočovač pro sítě PON",
          "domácí modem pro připojení k Internetu", "ústředna mobilní sítě"], c: 0 },

    { q: "Typ optické přípojky FTTdp?", upper: true,
      o: ["označuje zavedení optického vlákna v distančním prvku",
          "označuje ukončení optického vlákna v distribučním bodě, kde je např. umístěn rDSLAM",
          "označuje stav, kdy optickou přípojku nelze vybudovat",
          "označuje speciální typ optického vlákna dle normy \"dp\""], c: 1 },

    { q: "Co je úkolem splitteru v pasivní optické síti?", noPrompt: true,
      o: ["Rozdělit rychlost přenosu dat v optických kabelech", "Rozdělit směrování paketů mezi zařízeními",
          "Rozdělit optický signál na více optických vláken", "Rozdělit směr uplink a downlink"], c: 2 },

    { q: "Co obsahuje PON (Pasivní Optická Síť)?", upper: true,
      o: ["jen aktivní prvky", "pasivní přístup", "pasivní optická vlákna", "rozbočovače a optická vlákna"], c: 3 },

    { q: "K jakému účelu se používá zafukování optických vláken?", noPrompt: true,
      o: ["Ke zvýšení pevnosti optického vlákna", "K instalaci optických vláken do předem připravených trubek nebo chrániček",
          "K přímému svařování konců optických vláken", "Ke chlazení optických vláken",
          "K odstranění optických poruch ve vlákně"], c: 1 },

    { q: "Co je peering v kontextu Internetu?", noPrompt: true,
      o: ["proces připojování klientů na internetové stránky poskytovatele",
          "systém pro měření rychlosti přenosu dat mezi různými síťovými prvky",
          "dohoda mezi dvěma poskytovateli internetových služeb o výměně dat přímo mezi jejich sítěmi",
          "šifrovací metoda používaná při přenosu dat sítěmi poskytovatelů"], c: 2 },

    { q: "Jaký je hlavní důvod, proč poskytovatelé internetových služeb uzavírají peeringové dohody?", noPrompt: true,
      o: ["snížení latence a nákladů na přenos dat", "vylepšení webových služeb pro koncové uživatele",
          "zvýšení zabezpečení přenosu dat", "posílení marketingových kampaní"], c: 0 },

    { q: "Co označuje číslo před slovem \"Base\" u ethernetových standardů?", upper: true,
      o: ["Počet kabelů potřebných k připojení", "Maximální počet zařízení v síti",
          "Maximální délku kabelu v metrech", "Maximální přenosovou rychlost"], c: 3 },

    { q: "Twisted pair?", upper: true,
      o: ["maximální přenosová rychlost je 10 Mb/s.", "je zastaralé",
          "se používá jako přenosové médium v počítačových sítích", "kroucení se používá pro zvýšení mechanické odolnosti kabelu"], c: 2 },

    { q: "U topologie hvězda v počítačových sítích?", upper: true,
      o: ["se nepoužívá žádný prvek", "se používá switch jako aktivní prvek",
          "se používá společné přenosové médium, na které jsou napojeny všechny stanice",
          "je Ethernet standard označen symbolem \"*\""], c: 1 },

    { q: "Architektura TCP/IP je rozdělena?", upper: true,
      o: ["Do 4 vrstev.", "Do 2 vrstev.", "Do 7 vrstev."], c: 0 },

    { q: "Aplikační vrstva architektury TCP/IP.", upper: true,
      o: ["Realizuje a zajišťuje komunikaci koncových uzlů.", "Zajišťuje především síťovou adresaci.",
          "Umožňuje přístup k fyzickému přenosovému médiu.",
          "Obsahuje protokoly nejčastěji používaných služeb, např. HTTP (Hypertext Transfer Protocol)."], c: 3 },

    { q: "Co je MAC adresa?", noPrompt: true,
      o: ["Adresa specifická pro aplikační vrstvu", "Virtuální adresa serveru", "Fyzická adresa zařízení v síti",
          "Doménové jméno"], c: 2 },

    { q: "Co je maska sítě (v TCP/IP protokolu)?", upper: true,
      o: ["má vždy tvar 255.255.255.0.", "zapisujeme ji pro ulehčení jako prefix",
          "definuje maskování internetového provozu", "má vždy tvar /24"], c: 1 },

    { q: "Nejpoužívanější třídou IP adres je?", upper: true,
      o: ["Třída E.", "Třída C.", "Třída A.", "Třída B."], c: 1 },

    { q: "Jak označujeme třídy IPv4 adres?", noPrompt: true,
      o: ["čísly 1, 2, 3, 4, 5, 6", "čtyřmi čísly oddělené tečkou, např. 255.255.255.0", "písmeny A, B, C, D, E",
          "římskými čísly I., II., III., IV., V., VI."], c: 2 }
  ]
});
}
