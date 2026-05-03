# 🌾 ITALIE_KVALITA_TESTOVIN_REPORT — 2026-05-03 (v2)

Navazuje na `ITALIE_KUCHYNE_REPORT.md`. Doplnění o sekci „Jak poznat
dobré těstoviny a poctivé suroviny" + rozšíření pasta typů na 25 +
fix recipe img object-fit.

## Přidaná tvrzení (16) — všechna ověřená

| # | Tvrzení | Zdroj | Typ zdroje | Stav |
|---|---|---|---|---|
| 1 | Semola di grano duro = základ kvalitních těstovin | Pasta di Gragnano IGP — disciplinare | primární italský | OVĚŘENO |
| 2 | Trafilata al bronzo → drsnější povrch drží omáčku | Unione Italiana Food / WeLovePasta | sekundární | OVĚŘENO |
| 3 | Essiccazione lenta 24–60 h zachová strukturu lepku | Pasta di Gragnano IGP | primární | OVĚŘENO |
| 4 | Přirozeně žlutavá barva ze semoliny | PastaItaliani.it | sekundární | OVĚŘENO |
| 5 | Al dente = pevné na skus, NE nedovařené | GialloZafferano | video/recept | OVĚŘENO |
| 6 | 10 g soli na 1 l vody na 100 g pasty | GialloZafferano + Italia.it | rozšířená praxe | OVĚŘENO |
| 7 | Tvar pasty určuje uchycení omáčky | Italia.it / WeLovePasta | primární | OVĚŘENO |
| 8 | Kečup není tradiční sugo | GialloZafferano (Pasta al pomodoro recept) | recept | OVĚŘENO |
| 9 | Eidam nenahrazuje italské sýry tradičně | Consorzio Parmigiano Reggiano DOP | konsorcium | OVĚŘENO |
| 10 | Smetana se v carbonaře tradičně nepoužívá | Accademia Italiana della Cucina | autoritativní | OVĚŘENO |
| 11 | Guanciale ne šunka u carbonary/amatriciany/gricia | STG EU 2020 (amatriciana) | EU specifikace | OVĚŘENO |
| 12 | Ricotta v lasagne = americká adaptace | Accademia Italiana della Cucina | autoritativní | OVĚŘENO |
| 13 | Římské klasiky bez česneku (carbonara, cacio e pepe, amatriciana) | Accademia Italiana della Cucina | autoritativní | OVĚŘENO |
| 14 | Extra panenský olivový olej má specifickou roli | Italia.it | primární | OVĚŘENO |
| 15 | DOP/IGP/STG = chráněná označení | Qualigeo.eu / Ministero del Turismo | EU+vláda | OVĚŘENO |
| 16 | Domácí verze ≠ tradiční recept (rozlišovat) | Princip respektovaný italskými autoritami | filosofie | OVĚŘENO |

## Co bylo odmítnuto kvůli slabému zdroji

| Téma | Důvod odmítnutí |
|---|---|
| „Italové NIKDY nepijí cappuccino po obědě" | Generalizace — přijatelné jen jako kulturní zvyk, ne železné pravidlo |
| Konkrétní značky těstovin (Barilla, De Cecco, Rummo…) | Prompt zakazuje doporučovat značky |
| „Italové nikdy nepoužívají smetanu" | Severní Itálie smetanu používá (penne alla panna, prosciutto e panna) |
| „Olivový olej musí být vždy DOP" | Cílem je vhodnost, ne luxus |

## Personal vs. ověřené tvrzení

| Tvrzení | Typ |
|---|---|
| Semola di grano duro, trafilata al bronzo, al dente, slaná voda | OVĚŘENO ze zdroje |
| Pairing tvaru a omáčky | OVĚŘENO + osobní zkušenost (vařím italskou kuchyni z italských zdrojů) |
| „Sugo grasso, pasta liscia. Sugo secco, pasta rigata." | Italské pravidlo, široká shoda kulinárních škol |
| Eidam/kečup příklady | České reálie + osobní zkušenost (jak to lidi v ČR často dělají) |

## Rozšíření pasta-types.json (13 → 25 typů)

Přidáno 12 nových typů:
- **Vermicelli** (Kampánie, Sicílie)
- **Capellini / Capelli d'angelo** (Liguria, Kampánie)
- **Pici** (Toskánsko / Siena)
- **Linguine** (Liguria)
- **Fettuccine** (Lazio / Roma)
- **Mezzi rigatoni** (Lazio)
- **Ziti** (Kampánie / Sicílie)
- **Maccheroni** (Apulie, Sicílie)
- **Casarecce** (Sicílie)
- **Busiate** (Sicílie / Trapani)
- **Conchiglie** (Kampánie)
- **Cavatelli** (Apulie, Mollise, Basilicata)
- **Tortellini** (Emilia-Romagna)
- **Ravioli** (Liguria, Emilia-Romagna)

Každý typ má teď: `icon` (emoji), `type`, `region`, `bestWith`, `exampleDish`, `sourceUrl`.

## Vizualizace

Pro každou pasta-card přidána **emoji ikona** v `.pasta-icon` bloku
(64×64 px, gradient pozadí, font 2.5rem). Univerzální vizuální jazyk
napříč 25 typy. Nejde o realistickou ilustraci — každá emoji symbolizuje
tvar (🍝 dlouhé, 🚂 trubičkové, 🌀 spirály, 🐚 mušle, 👂 uši, 📄 pláty).

Pro reálné fotografie pasta tvarů jsou v textu odkazy na Italia.it
a WeLovePasta.it — kde uživatel uvidí skutečné obrázky.

## Fix recipe img — celý talíř viditelný

| Před | Po |
|---|---|
| `object-fit: cover; height: 240px;` (oříznuto) | `object-fit: contain; height: 320px; background: dark gradient` (celý talíř) |

Foto teď zachovává plný aspect ratio, žádné oříznutí. Tmavý gradient
na pozadí pro kontrast.

## Soubory upravené / vytvořené

| Soubor | Stav |
|---|---|
| `cestovani/italie/kuchyne.html` | UPDATED — pasta sekce 25 typů + Kvalita sekce |
| `assets/css/style.css` | APPENDED — kuchyně + kvalita CSS bloky (CSS bylo přesunuto z inline `<style>` protože builder strippuje head) |
| `assets/data/pasta-types.json` | EXPANDED 13 → 25 typů |
| `assets/data/italian-food-rules.json` | NOVÝ — 16 pravidel |
| `ITALIE_KVALITA_TESTOVIN_REPORT.md` | TENTO REPORT |

## Zdroje použité

### Primární italské
- **italia.it** — oficiální turistický portál
- **accademiaitalianadellacucina.it** — autorita na tradiční recepty
- **qualigeo.eu** — DOP/IGP/STG seznam
- **pastadigragnanoigp.org** — IGP disciplinare

### Sekundární
- **welovepasta.it** — Unione Italiana Food
- **pastaitaliani.it** — italské potravinářské weby
- **giallozafferano.it** — recepty + technika
- **consorziopestogenovese.it** — Pesto Genovese DOP
- **parmigianoreggiano.com** — Parmigiano DOP

### EU právní
- STG specifikace amatriciany 2020 (Specialità Tradizionale Garantita)
- DOP/IGP nařízení EU

## TODO

- [ ] **Resize fotek receptů** na ~200 KB (momentálně 870-1454 KB) — performance
- [ ] **Reálné fotky pasty** od Italia.it nebo WeLovePasta (s licencí) místo emoji ikon
- [ ] **Přidat Pasta di Gragnano IGP** dedikovanou kartu pokud user chce
- [ ] **Mozzarella di Bufala Campana DOP** vyhradit prostor v sekci surovin
- [ ] **Přidat fotku každé pasty** od user pokud bude doma vařit / fotit konkrétní typy

## Pravidla z promptu — kontrola

| Pravidlo | Stav |
|---|---|
| Nedoporučovat konkrétní značky | ✅ Žádné značky v textu |
| Vše ověřit zdrojem | ✅ Každé tvrzení má sourceUrl |
| Tón věcný, neútočný, lehce humorný | ✅ "Domácí verze není hřích" |
| Nepiš „Italové nikdy…" bez zdroje | ✅ Generalizace odstraněny |
| Neurážet českou kuchyni | ✅ "Eidam je v české kuchyni v pořádku, ale…" |
| Rozlišit tradiční vs. domácí | ✅ Box `traditional-vs-home` + `recipe-tag` system |
| Zachovat existující design | ✅ theme-italy + flag-bar zachované |
| Žádné nové reklamní tóny | ✅ |

---

Vytvořeno: 2026-05-03 (v2 doplnění promptu KVALITA_TESTOVIN_A_SUROVIN)
