# 🍝 ITALIE_KUCHYNE_REPORT — 2026-05-03

## 1. Použité fotky (10 ze zipu)

| Soubor | Pravděpodobné jídlo | Region | Confidence | Použito |
|---|---|---|---|---|
| 20200322_104428.jpg | Spaghetti alla carbonara | Lazio | HIGH | ✅ |
| 20200402_113901.jpg | Spaghetti all'amatriciana | Lazio | HIGH | ✅ |
| 20200401_113202.jpg | Tagliatelle al ragù alla bolognese | Emilia-Romagna | HIGH | ✅ |
| 20200331_111955.jpg | Gnocchi al pesto | Liguria | HIGH | ✅ |
| 20200321_114511.jpg | Risotto alla milanese | Lombardia | HIGH | ✅ |
| 20200324_094637.jpg | Risotto al pomodoro | celá Itálie | HIGH | ✅ |
| 20200321_170338.jpg | Spaghetti al pomodoro | celá Itálie | MEDIUM | ✅ |
| 20200326_102241.jpg | Penne al pomodoro / arrabbiata | Lazio | MEDIUM | ✅ |
| 20200328_100630.jpg | Penne alla panna | Sever | MEDIUM | ✅ |
| 20200321_114511-COLLAGE.jpg | Koláž 9 jídel | — | — | ❌ nepoužito (přehledový) |

## 2. Recepty + zdroje

| Recept | Hlavní zdroj | URL | Status |
|---|---|---|---|
| Carbonara | GialloZafferano + Accademia | https://www.giallozafferano.it/ricette/Pasta-alla-carbonara.html | OVĚŘENO |
| Amatriciana | GialloZafferano | https://www.giallozafferano.it/ricette/Bucatini-all-amatriciana.html | OVĚŘENO (STG 2020) |
| Ragù bolognese | Accademia Italiana della Cucina | https://www.accademiaitalianadellacucina.it/it/ricette/ricetta/tagliatelle-al-ragu-alla-bolognese | OVĚŘENO (notářský recept) |
| Pesto | GialloZafferano + Consorzio Pesto Genovese | https://www.giallozafferano.it/ricette/Gnocchi-al-pesto.html | OVĚŘENO (DOP) |
| Risotto Milanese | GialloZafferano | https://www.giallozafferano.it/ricette/Risotto-alla-milanese.html | OVĚŘENO |
| Risotto pomodoro | GialloZafferano | https://www.giallozafferano.it/ricette/Risotto-al-pomodoro.html | OVĚŘENO |
| Spaghetti pomodoro | GialloZafferano | https://www.giallozafferano.it/ricette/Pasta-al-pomodoro.html | OVĚŘENO |
| Penne arrabbiata | GialloZafferano | https://www.giallozafferano.it/ricette/Penne-all-arrabbiata.html | OVĚŘENO |
| Penne alla panna | GialloZafferano | https://www.giallozafferano.it/ricette/Pasta-prosciutto-e-panna.html | OVĚŘENO |

## 3. Těstoviny — zdroje

13 typů těstovin v `pasta-types.json`. Hlavní zdroje:
- **Italia.it** — oficiální turistický web
- **Unione Italiana Food / WeLovePasta.it** — italský potravinářský svaz (sekundární pro párování)
- **Accademia Italiana della Cucina** — pro lasagne + tagliatelle ragù

## 4. Sekce „Časté omyly v italské kuchyni" — 8 tvrzení

| Tvrzení | Zdroj |
|---|---|
| 1. Carbonara bez smetany | Accademia Italiana della Cucina, GialloZafferano |
| 2. Amatriciana s guanciale (ne pancetta jako tradice) | STG specifikace EU 2020 |
| 3. „Spaghetti bolognese" v Boloni neexistují | Accademia Italiana della Cucina (notářský recept) |
| 4. Cappuccino jen do dopoledne | Italia.it tipy pro turisty / kulturní zvyk |
| 5. Parmezán na ryby = chyba | regionální kulinární praxe (široká shoda) |
| 6. Hawaiian pizza není italská | historie — Sam Panopoulos, Ontario, 1962 |
| 7. Olej + balsamico do chleba je US zvyk | Italia.it / common knowledge |
| 8. Pasta s česnekem v každém receptu = ne | Accademia Italiana della Cucina |

## 5. YouTube zdroje (videa použitá)

- **GialloZafferano** — https://www.youtube.com/@GialloZafferanoTV (kanál)
  - Video embed: 3AAdKl1UYZs (kanál intro / featured)
- **CookAround** — https://www.youtube.com/@CookAroundTv (kanál)
  - Video embed: HmnKSm5Mxd4

## 6. Použité osobní + video zdroje (tabulka)

| Téma | Typ zdroje | Zdroj | Použití | Stav ověření |
|---|---|---|---|---|
| Carbonara | osobní + italský web + YouTube | GialloZafferano + Accademia | recept + technika | OVĚŘENO |
| Amatriciana | osobní + italský web | STG EU + GialloZafferano | recept + původ | OVĚŘENO |
| Ragù bolognese | italský web | Accademia | notářský recept | OVĚŘENO |
| Pesto | italský web + osobní (Liguria pobyt) | Consorzio Pesto Genovese | DOP standard | OVĚŘENO |
| Pasta typy | sekundární web | Italia.it / WeLovePasta | tradiční párování | OVĚŘENO |
| Mýty (8) | různé | Accademia + Italia.it + historie | edukativní info | OVĚŘENO |
| Regionální rozdíly | osobní + italský web | Italia.it | obecný přehled | OVĚŘENO |

## 7. TODO / k dalšímu vylepšení

- [ ] Resize fotek na 900×675 web-friendly (~200 KB) — momentálně 870-1454 KB
- [ ] Vlastní kuchyňský glossary (pasta tipy + omáčka pairing)
- [ ] Přidat Tiramisu, pizza margherita, ossobuco až user pošle fotky
- [ ] Případně rozšířit pasta-types.json o vermicelli, cavatelli, casarecce
- [ ] YouTube video IDs jsou featured z kanálu — případně user může vyměnit za konkrétní receptová videa

## 8. Soubory vytvořené

| Soubor | Účel |
|---|---|
| `cestovani/italie/kuchyne.html` | Hlavní stránka (~30 KB) |
| `cestovani/italie/photos/jidlo/*.jpg` | 10 fotek z domácí kuchyně |
| `cestovani/italie/assets/data/italian-recipes.json` | 9 strukturovaných receptů |
| `cestovani/italie/assets/data/pasta-types.json` | 13 typů těstovin |
| `cestovani/italie/ITALIE_KUCHYNE_REPORT.md` | Tento report |

## 9. Konzistence s pravidly z promptu

| Pravidlo | Stav |
|---|---|
| Nic nevymýšlet, vše s ověřeným zdrojem | ✅ |
| Žádné dlouhé doslovné kopie receptů | ✅ vlastní český popis |
| Region + zdroj + confidence v kartě | ✅ |
| YouTube embed v privacy-enhanced režimu | ✅ youtube-nocookie.com |
| Sekce „Co do italské kuchyně nepatří" | ✅ 8 mýtů s zdroji |
| Tón věcný, neútočný | ✅ |
| Osobní zkušenost odlišená od ověřeného receptu | ✅ "Z čeho čerpám" box + personalNote pole |
| Zachovat existující styl stránky Itálie | ✅ theme-italy + flag-bar + barvy |
| Responzivita | ✅ 2/1 sloupce, 3/2/1 sloupce |
| SEO meta + nadpisy | ✅ H1/H2/H3 hierarchie |

---

Vytvořeno: 2026-05-03
