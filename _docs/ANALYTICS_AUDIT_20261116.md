# Kontrola měření a veřejných stránek – 16. 11. 2026

Rozsah: všech 598 sledovaných veřejných HTML stránek. Interní datové šablony
a adresáře začínající podtržítkem nebo tečkou nejsou veřejné obsahové stránky.
Nejde o ruční kontrolu veškerého textu ani kontrolu všech externích webů.

## Měření

- 519 obsahových stránek má společné měření Google Analytics G-BM11EHQG00.
- 69 pomocných zdrojových/mapových přehledů zůstává bez měření.
- 8 přesměrování, 1 noindex stránka a 1 demo aplikace jsou výjimky.
- V HTML není žádný přímo načítaný, nepodmíněný Google Analytics tag.
- Souhlas se sdílí mezi částmi stejné domény; do jeho udělení se Google nenačítá.

Doplněné mezery:

- smart-home/hardware-komplet.html
- cestovani/pracovni-cesty/prehled-tras.html
- novinky/2026-10-31/index.html
- novinky/2026-11-02/index.html

Hardware používá společný skript Smart Home: zároveň opraveno nereagující
mobilní menu a doplněn automatický rok v patičce. Původní filtry zařízení
zachované. Ostatní tři stránky načítají přímo stávající souhlasový skript.

Lokální Chrome: na každé ze čtyř stránek právě jeden panel souhlasu, při
odmítnutí nula Google tagů. Vyhledání Sonoff zobrazilo 18 z 84 zařízení;
vymazání dotazu obnovilo seznam. Mobil 390 px bez vodorovného přetečení,
menu hardwaru po kliknutí přechází na aria-expanded=true.

Mobilní kontrola hlavních sekcí odhalila přetékající dlouhý odkaz na článek
v Cestování. Opraveno zalamování `.journey-note > a`. Hlavní stránka, Cestování,
Aplikace, Finance, Smart Home, Blog, AI a EN/IT homepage mají jeden souhlasový
panel. Při odmítnutí zůstává měření vypnuté.

Opakovatelná kontrola: `python audit_site_analytics.py`. Podrobný strojový
výstup je lokálně v `_reports/analytics-20261116.json` (nenasazuje se).

## Další kontroly celého webu

- 19 395 místních referencí v HTML: žádný chybějící soubor.
- Žádná chybějící klasická kotva mimo demo. 25 odkazů dema jsou přepínače
  panelů obsluhované JavaScriptem, nejsou běžnými HTML kotvami.
- Sitemap: PASS, se stávajícím upozorněním na veřejné stránky mimo sitemap.
- Test unikátních meta popisů: PASS v rozsahu jeho pravidel.
- Regresní kontrola CSS proti přetékání Smart Home: PASS.

Při širších starších testech zůstávají tato metodická upozornění; nejde
o nově vzniklé vady měření:

- Kontrola obrázků prošla 1399 souborů. Dva SVG sprity nesplňují její pravidlo
  pro samostatný obrázek, ale jsou validní XML se 113 a 12 symboly. Všech
  125 symbolů má vlastní viewBox; soubory nejsou poškozené obrázky.
- Kontrola interních údajů označila 15 veřejných odkazů na dokumentaci
  GitHub a zdroj geografických dat. Žádná jiná kategorie tohoto testu
  nehlásila nález. Tyto veřejné informační/zdrojové odkazy se neodstraňují.
- Starší test číselných tvrzení očekává formulace a selektory, které už
  některé stránky nemají. V nalezených srovnávaných tvrzeních se objevuje
  84 zařízení; výsledek testu kvůli chybějícím očekávaným textům není PASS.

Existující testy nebyly upraveny jen kvůli zelenému výsledku. Tento report
rozlišuje ověřené funkční výsledky od omezení starších kontrol.
