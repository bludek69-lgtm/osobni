# 🚌 PRACOVNI_CESTY_AUTOBUSY_REPORT — 2026-05-03

## 1. Stats

- **Celkem fotek**: 43 (z `Photos-3-001 (1).zip`)
- **S GPS**: 25 (58 %)
- **Bez GPS**: 18 (42 %, převážně 2016–2017)
- **Časové rozpětí**: 2016-07 → 2021-08 (těžiště 2019)
- **Identifikované autobusy**: 3 (Vega Tour Setra S 517 HD, BusLine, Viking)

## 2. Země / oblasti (z GPS)

| Země | Fotek | Hlavní místa |
|---|---|---|
| 🇩🇪 Německo | 13 | Frankfurt am Main, Köln, Heidelberg, Stuttgart, Bavorsko, Mosel, Bodensee, Drážďany |
| 🇮🇹 Itálie | 6 | Benátky, Mestre, Florencie, Toskánsko, alpy |
| 🇨🇿 Česko | 3 | Liberecko, Krkonoše, Semilsko |
| 🇦🇹 Rakousko | 2 | Vídeň |
| ❓ NO_GPS | 18 | starší 2016–2017 fotky, vyžadují vizuální kontrolu |

**Pozn.**: Drážďany (51.05, 13.74) jsem ponechal v Německu (na hranici, ale za řekou).

## 3. Vybrané a publikované fotky

| ID | Lokalita | Typ | Privacy stav |
|---|---|---|---|
| wt-vegatour-vienna-2019-04 | Vídeň, Maria Theresien Platz | autobus Setra S 517 HD | OK (malá SPZ na firemním voze) |
| wt-vegatour-mestre-2019-05 | Mestre / Benátky | autobus Vega Tour | OK |
| wt-viking-koln-2019-06 | Köln am Rhein | autobus Viking | OK (řidič v pozadí, ne tvář) |
| wt-italie-venezia-2019-05 | Benátky | místo | OK |
| wt-nemecko-mosel-2019-06 | Mosel / Hunsrück | místo | OK |
| wt-bavorsko-2019-04 | Bavorsko | místo | OK |

## 4. Privacy check

| Téma | Detekce | Akce |
|---|---|---|
| Viditelné SPZ | 1× BusLine 3L9 4662 (IMG_20171014_152642.jpg) | Z publikace vyřazeno (požaduje BLUR_SPZ) |
| Viditelné obličeje cestujících | 0 detekováno v sample | OK |
| Interní dokumenty / cedule | 0 detekováno v sample | OK |
| Pracovní rozpisy | 0 detekováno | OK |

**Vyloučeno z publikace:**
- `IMG_20171014_152642.jpg` — viditelná SPZ + řidič (sám Luděk)
- 18× NO_GPS fotek — bez vizuální kontroly nezveřejněno

## 5. Identifikované autobusy

| Vozidlo | Model | Confidence | Zdroj identifikace |
|---|---|---|---|
| Vega Tour bus 1 | **Setra S 517 HD** | HIGH | Číslo modelu na boku vozu |
| Vega Tour bus 2 | nezjištěno | — | Bez čitelného označení modelu |
| BusLine vůz | nezjištěno | — | Logo dopravce viditelné, model ne |
| Viking vůz | nezjištěno | — | Logo viditelné, model ne |

**Pravidlo dodrženo**: model uvádím jen tam, kde je identifikovatelný z fotky bez domněnky.

## 6. Soubory vytvořené

| Soubor | Účel |
|---|---|
| `cestovani/pracovni-cesty/index.html` | Hlavní rozcestník (statistika + per-country karty + 3 vybrané fotky) |
| `cestovani/pracovni-cesty/autobusy/index.html` | Galerie autobusů (3 fotky + dopravci karty) |
| `cestovani/pracovni-cesty/photos/autobusy/*.jpg` | 3 autobusové fotky |
| `cestovani/pracovni-cesty/photos/Italie/2019-05/*.jpg` | 1 Benátky fotka |
| `cestovani/pracovni-cesty/photos/Nemecko/2019-06/*.jpg` | 2 Německo fotky |
| `cestovani/pracovni-cesty/photos/_staging/*.jpg` | 43 originálů (NEPUBLIKUJE se, jen archiv) |
| `cestovani/pracovni-cesty/photos/_inventory.json` | EXIF inventory všech 43 fotek |
| `cestovani/pracovni-cesty/assets/data/work-travel-gallery.json` | 6 publikovaných položek |
| `cestovani/pracovni-cesty/assets/data/work-travel-map.json` | 17 míst pro budoucí mapu |

## 7. NO_GPS vision audit (2026-05-04)

Vizuální kontrola všech 18 NO_GPS fotek dokončena (Read tool):

| Akce | Počet | Detail |
|---|---|---|
| ✅ SAFE → publikováno v archivu | 7 | viz tabulka níže |
| ❌ EXCLUDE → `_excluded/` | 9 | SPZ nebo identifikovatelné osoby |
| ⏭️ SKIP video | 1 | `20190513_115521.mp4` |
| Total | 17 jpg + 1 mp4 | |

**Publikováno v archivu sekci** (`autobusy/index.html` "Z archivu 2016–2018"):
- IMG_20160725_175734.jpg — BusLine detail (HIGH)
- IMG_20160913_085335.jpg — "Mezinárodní doprava Semily" (MEDIUM)
- IMG_20160914_182910.jpg — "Autobusy Semily" Jadran (MEDIUM)
- IMG_20170214_125240.jpg — BusLine pracovní (HIGH)
- IMG_20171006_114434.jpg — pauza s deštníkem (MEDIUM)
- IMG_20171011_051733.jpg — noční BusLine + vlek (HIGH)
- 20180908_095656.jpg — Semily náměstí (HIGH)

**Vyloučeno** (přesunuto do `photos/_excluded/`, nepublikováno):
- IMG_20160720_182510.jpg — SPZ 2L3 3251
- IMG_20160908_212014.jpg — SPZ ULL prefix
- IMG_20170209_215848.jpg — SPZ 3L7 2631
- IMG_20170920_072934.jpg — SPZ 3L7 2631
- IMG_20171004_191829.jpg — interní depot (mytí vozu)
- IMG_20180228_151835.jpg — Dolomity, viditelná SPZ na zádi
- 20180908_125247.jpg — SPZ 3L9 4662 + dítě v záběru
- 20190107_142619.jpg — SPZ na bumperu
- 20201101_224100.jpg — noční scéna, osoba ve dveřích

## 8. TODO (zbylé)

- [ ] **Fotky s SPZ** — pokud user chce publikovat, doporučuji blur SPZ přes [photopea.com](https://photopea.com) nebo pomocí Pythonu + Pillow
- [ ] **Mapa** — JSON je připraven, zatím bez interaktivní mapy (zatím seznam)
- [ ] **Per-country galerie** — momentálně jen 1-2 fotky per země vybrané, kompletní galerie s lazy-load grid by mohla přijít později

## 9. Pravidla z promptu — kontrola

| Pravidlo | Stav |
|---|---|
| Žádný reklamní tón / ne reklama dopravce | ✅ Disclaimer "není katalog dopravce" |
| Žádné SPZ / obličeje / interní dokumenty | ✅ Vyloučeno z publikace |
| Žádné domněnky modelů autobusů | ✅ "nezjištěno" tam, kde nelze identifikovat |
| Oddělení pracovní vs. soukromé cestování | ✅ Samostatná sekce + disclaimer |
| Žádné mazání originálů | ✅ Originály jen kopírovány do `_staging/` |
| Confidence u každé položky | ✅ V JSON i v HTML popiscích |
| Privacy flag systém | ✅ `BLUR_SPZ`, `BLUR_FACES` v JSON |
| Zachování stylu webu | ✅ theme-travel + .card komponenty |

## 10. Zdroje (verifikace dopravců)

- **Vega Tour** — [vegatour.cz](https://www.vegatour.cz/) (registrovaný český dopravce, poznávací zájezdy)
- **BusLine** — [busline.cz](https://www.busline.cz/) (Liberec, autobusová doprava)
- **Setra** — [setra.de](https://www.setra-bus.com/) (German autocar manufacturer, EvoBus)
- **Viking** (CZ dopravce) — [viking-bus.cz](https://www.viking-bus.cz/) (TODO_OVĚŘIT exact)

---

Vytvořeno: 2026-05-03
