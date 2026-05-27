"""Generate Moje aplikace section: hub index + 6 sub-pages in CS/EN/IT.

Each sub-page is built from a structured spec (Python dict) — text + asset
paths + tech badges. Output: <main> blocks ready to be wrapped by _build_pages.py.

Run from osobni root:
    py -3 _build_aplikace_pages.py
"""
from __future__ import annotations
import io
import sys
from pathlib import Path

try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent

# ────────────────────────────────────────────────────────────
# Per-language string table
# ────────────────────────────────────────────────────────────
I18N = {
    "cs": {
        "hub_title":    "Moje aplikace — Luděk Budínský",
        "hub_h1":       "Moje aplikace",
        "hub_intro":    "Šest vlastních aplikací co jsem si postavil, abych si zjednodušil život s Homey, financemi, cestováním do Itálie a jídlem. Žádný cloud, žádná telemetrie — všechno běží lokálně u mě doma nebo na malém serveru.",
        "live":         "Funkční",
        "internal":     "Soukromé",
        "stack":        "Stack",
        "what":         "Co to dělá",
        "features":     "Klíčové funkce",
        "screens":      "Náhledy",
        "status":       "Stav",
        "open_card":    "Otevřít stránku",
        "back_to_hub":  "← Zpět na Moje aplikace",
    },
    "en": {
        "hub_title":    "My apps — Luděk Budínský",
        "hub_h1":       "My apps",
        "hub_intro":    "Six custom apps I built to make life with Homey, finances, travel to Italy and meals easier. No cloud, no telemetry — everything runs locally at home or on a small server.",
        "live":         "Working",
        "internal":     "Private",
        "stack":        "Stack",
        "what":         "What it does",
        "features":     "Key features",
        "screens":      "Screenshots",
        "status":       "Status",
        "open_card":    "Open page",
        "back_to_hub":  "← Back to My apps",
    },
    "it": {
        "hub_title":    "Le mie app — Luděk Budínský",
        "hub_h1":       "Le mie app",
        "hub_intro":    "Sei applicazioni che mi sono costruito per semplificare la vita con Homey, le finanze personali, i viaggi in Italia e i pasti. Niente cloud, niente telemetria — tutto gira in locale a casa mia o su un piccolo server.",
        "live":         "Funzionante",
        "internal":     "Privata",
        "stack":        "Stack",
        "what":         "Cosa fa",
        "features":     "Funzioni principali",
        "screens":      "Anteprime",
        "status":       "Stato",
        "open_card":    "Apri scheda",
        "back_to_hub":  "← Torna alle Mie app",
    },
}

# ────────────────────────────────────────────────────────────
# App spec — per app, per language
# ────────────────────────────────────────────────────────────
APPS = [
    {
        "slug": "config-center",
        "icon": "⚙️",
        "color": "#4a8fd0",
        "asset_dir": "config-center",
        "screens": [
            ("live_overview.png",  "Přihlášení tokenem — token zůstává jen v prohlížeči (localStorage)"),
            ("overview.png",       "Přehled — všechny módy a parametry na jednom místě"),
            ("heating.png",        "Topení — TRV zóny, hystereze, boost, pre-wake plán"),
            ("zones.png",          "Zóny — světla, motion sensors, audio per místnost"),
            ("morning_params.png", "Ranní rutina — wake window, ramp delay, briefing"),
            ("lights_rules.png",   "Pravidla světel — lux thresholdy, denní/večerní cíle"),
            ("toggles.png",        "AI toggles — autonomy, intent engine, health monitor"),
        ],
        "stack": ["HTML", "Vanilla JS", "Homey REST API"],
        "i18n": {
            "cs": {
                "name":       "Config Center",
                "lead":       "Webová správa všech parametrů mého smart home — místo lezení do telefonu mám jednu stránku, kde si nastavím všechno najednou.",
                "what": "<p>Smart home Homey Pro 2026 má desítky proměnných: kdy začíná ranní rutina, jak rychle nabíhá světlo, na jakou teplotu topí ložnice, kdy se má vypnout audio. Config Center to všechno sjednocuje do <strong>22 přehledných stránek</strong> — místo lovení v telefonu mám jednu stránku, kde si všechno upravím a uložím jedním kliknutím.</p><p>Sám si hlídá, co se mění (preview mode), umí 10-minutový auto-revert kdyby něco bylo špatně, a chrání citlivá zařízení před omylem.</p>",
                "features": [
                    ("22 mode pages", "Ranní / denní / večerní / noční / pryč / doma / spánek — TTS hlášky + cíle světel/topení per mód."),
                    ("4 TRV zóny",    "Plán topení per den s hodinovými okny, hystereze, anti-cycling, boost button."),
                    ("Preview mode",  "Změna se nejprve ukáže na zařízení, 10 minut na test, pak commit nebo automatický revert."),
                    ("100+ vars",     "Lux thresholdy, ramp delays, briefing window, AI toggles, rate limits, weekly schedules."),
                    ("Safety guards", "Bedroom hard-block pro audio test, protected device guard pro citlivá zařízení."),
                ],
                "status": "Funkční, denně používané. Verze v1.7.5 (květen 2026), 100+ proměnných editovatelných, deployed na PC i RPi kiosk.",
            },
            "en": {
                "name":       "Config Center",
                "lead":       "Web admin for every parameter of my smart home — one page instead of digging through the phone app.",
                "what": "<p>The Homey Pro 2026 smart home has dozens of variables: when the morning routine starts, how fast lights ramp up, what temperature the bedroom is heated to, when audio should stop. Config Center unifies it all in <strong>22 clean pages</strong> — one URL where I tune everything and save with a single click.</p><p>It watches what changes (preview mode), can auto-revert after 10 minutes if something's wrong, and protects sensitive devices from accidents.</p>",
                "features": [
                    ("22 mode pages", "Morning / day / evening / night / away / home / sleep — TTS lines + light/heating goals per mode."),
                    ("4 TRV zones",   "Per-day heating schedule with hour windows, hysteresis, anti-cycling, boost button."),
                    ("Preview mode",  "Changes first apply to the device, 10 min for testing, then commit or auto-revert."),
                    ("100+ vars",     "Lux thresholds, ramp delays, briefing window, AI toggles, rate limits, weekly schedules."),
                    ("Safety guards", "Bedroom hard-block for audio test, protected device guard for sensitive equipment."),
                ],
                "status": "Working, used daily. Version v1.7.5 (May 2026), 100+ editable variables, deployed on PC and the RPi kiosk.",
            },
            "it": {
                "name":       "Config Center",
                "lead":       "Pannello web per ogni parametro della mia smart home — una pagina invece di scavare nell'app del telefono.",
                "what": "<p>La casa Homey Pro 2026 ha decine di variabili: quando inizia la routine mattutina, quanto velocemente le luci salgono, a che temperatura riscaldare la camera, quando spegnere l'audio. Config Center le riunisce tutte in <strong>22 pagine ordinate</strong> — un URL dove regolo tutto e salvo con un click.</p><p>Sorveglia ciò che cambia (preview mode), può fare auto-revert dopo 10 minuti se qualcosa va storto e protegge i dispositivi delicati dagli errori.</p>",
                "features": [
                    ("22 pagine mode", "Mattina / giorno / sera / notte / via / casa / sonno — frasi TTS + obiettivi luci/riscaldamento per mode."),
                    ("4 zone TRV",    "Programma riscaldamento giornaliero con finestre orarie, isteresi, anti-cycling, pulsante boost."),
                    ("Preview mode",  "Le modifiche si applicano prima al dispositivo, 10 min per il test, poi commit o auto-revert."),
                    ("100+ variabili", "Soglie lux, ramp delay, finestra briefing, toggle AI, rate limits, piani settimanali."),
                    ("Safety guards", "Hard-block camera per test audio, protected device guard per apparecchi delicati."),
                ],
                "status": "Funzionante, in uso quotidiano. Versione v1.7.5 (maggio 2026), 100+ variabili modificabili, distribuita su PC e kiosk RPi.",
            },
        },
    },
    {
        "slug": "italia-travel",
        "icon": "🇮🇹",
        "color": "#008c45",
        "asset_dir": "italia-travel",
        "screens": [
            ("home.png", "Domovská obrazovka aplikace"),
        ],
        "stack": ["React", "Vite", "PWA", "Tailwind"],
        "i18n": {
            "cs": {
                "name":  "Italia Travel Planner",
                "lead":  "Plánovač cest po Itálii — denní itinerář, fronty na atrakce, rezervace, vlaky, pasta vocabulary.",
                "what":  "<p>Když plánuju další výlet do Itálie, potřebuju na jednom místě <strong>kde, kdy, jak dlouho, kolik to stojí</strong>. Italia Travel Planner mi spojuje denní itinerář (po hodinách), seznam atrakcí s tipy pro fronty, místa kde se najíst, vlakové trasy a slovník italských jídel + frází.</p><p>PWA — funguje offline (cache uložená na telefonu / v Edge app modu), nepotřebuje internet když jsem v Itálii a roaming je drahý.</p>",
                "features": [
                    ("Denní itinerář",   "Po-hodinové bloky s mapou, dobou přesunu, otevíracími dobami."),
                    ("Fronty & rezervace", "Doporučené časy návštěvy, tipy na předkup vstupenek, alternativy pokud je zavřeno."),
                    ("Pasta & menu",     "Italský slovník jídel + frází co potřebuju v restauraci."),
                    ("Vlaky & autobusy", "Reálné trasy s časy a alternativami, integrace s Trenitalia."),
                    ("Offline-first PWA", "Cache funguje bez sítě, ideální pro Itálii s drahým roamingem."),
                ],
                "status": "Funkční, používané pro vlastní plánování. Windows installer + PWA verze.",
            },
            "en": {
                "name":  "Italia Travel Planner",
                "lead":  "Italy trip planner — daily itinerary, queue tips, reservations, trains, pasta vocabulary.",
                "what":  "<p>When I plan another Italy trip I need <strong>where, when, how long, how much</strong> in one place. Italia Travel Planner combines hour-by-hour daily itinerary, attractions with queue tips, food spots, train routes, and an Italian dictionary of dishes + phrases.</p><p>It's a PWA — works offline (cache stored on the phone or in Edge app mode), no need for internet when roaming in Italy is expensive.</p>",
                "features": [
                    ("Daily itinerary",   "Hourly blocks with map, transit time, opening hours."),
                    ("Queues & reservations", "Recommended visit times, pre-booking tips, alternatives when closed."),
                    ("Pasta & menu",     "Italian food + phrase dictionary needed at restaurants."),
                    ("Trains & buses",   "Real routes with times and alternatives, Trenitalia integration."),
                    ("Offline-first PWA", "Cache works without net, perfect for Italy with pricey roaming."),
                ],
                "status": "Working, used for my own planning. Windows installer + PWA build.",
            },
            "it": {
                "name":  "Italia Travel Planner",
                "lead":  "Pianificatore di viaggi in Italia — itinerario giornaliero, consigli code, prenotazioni, treni, vocabolario pasta.",
                "what":  "<p>Quando pianifico un altro viaggio in Italia mi serve <strong>dove, quando, quanto dura, quanto costa</strong> tutto in un posto. Italia Travel Planner unisce itinerario orario, attrazioni con consigli sulle code, posti dove mangiare, treni e dizionario di piatti e frasi italiane.</p><p>È una PWA — funziona offline (cache sul telefono o in modalità app Edge), non serve internet quando il roaming in Italia è caro.</p>",
                "features": [
                    ("Itinerario giornaliero", "Blocchi orari con mappa, tempo di transito, orari di apertura."),
                    ("Code e prenotazioni",    "Orari consigliati, consigli per biglietti, alternative se chiuso."),
                    ("Pasta & menu",           "Dizionario di piatti e frasi per il ristorante."),
                    ("Treni e bus",            "Tratte reali con orari e alternative, integrazione Trenitalia."),
                    ("PWA offline-first",      "Cache funziona senza rete, ideale per Italia con roaming caro."),
                ],
                "status": "Funzionante, usata per la mia pianificazione. Installer Windows + build PWA.",
            },
        },
    },
    {
        "slug": "ucetni-kniha",
        "icon": "📒",
        "color": "#4a8fd0",
        "asset_dir": "ucetni-kniha",
        "screens": [
            ("01_hero.png",        "Dashboard — kolik mám teď, kolik chci mít, jak jsem na cestě (data jsou rozostřena)"),
            ("02_goal.png",        "Cíl 3,1 milionu — pokrok do důchodu v %, tempo měsíčně, plánovaný horizont"),
            ("03_cashflow.png",    "Cash Flow — kolik měsíčně přijde a kolik odejde, čistá změna majetku"),
            ("04_predictions.png", "8letá predikce — kam mě dovede současné tempo do roku 2034"),
            ("05_investments.png", "Investice — 17 brokerských účtů a krypto v jednom přehledu, P/L per pozice"),
            ("06_krypto.png",      "Krypto — BTC + ETH držené pozice, hodnota dnes vs nákupní cena"),
            ("07_pending.png",     "Čekající fronta — automaticky extrahované faktury čekají na schválení"),
            ("08_inbox.png",       "Inbox — faktury z Gmailu (energie, telekom, pojistky) stahované každou hodinu"),
        ],
        "stack": ["React", "Vite", "Tailwind", "Python", "Šifrovaný GitHub mirror"],
        "i18n": {
            "cs": {
                "name":  "Finance — Účetní kniha",
                "lead":  "Domácí účetní kniha — všechny peníze (banky, brokeři, krypto, penzijko), faktury z Gmailu a plán do důchodu v jedné aplikaci. Bez cloudu, bez registrace, vše šifrované.",
                "what":  "<p>Postavil jsem si ji, protože mě omrzelo přepínat mezi internetbankou, brokerskými webovkami a Excelem. Mám <strong>17 platforem</strong> kde mi něco leží — XTB, Trading 212, eToro, Interactive Brokers, TastyTrade, Investown, Fingood, Wise, Revolut, krypto burzy, dvě banky, penzijko, zlato. Než jsem věděl kolik mám celkem, musel jsem se všude přihlásit a sčítat. Teď se podívám do jedné stránky.</p>"
                         "<p><strong>Faktury chodí samy.</strong> Z Gmailu se přes malý server doma (Home Assistant) každou hodinu stáhnou nové faktury (energie, telefon, pojistky, výplata) a aplikace mi je nabídne s návrhem do jaké kategorie patří. Já jen kliknu „zaúčtovat\" — žádné přepisování čísel z papíru.</p>"
                         "<p><strong>Plánuju s ní důchod.</strong> Spočítá kolik mi přijde z ČSSZ podle dat která už platím, kolik si musím sám doplnit, jestli stačí současné tempo k cíli 3,1 milionu, a kdy přesně budu mít na účtu daňově osvobozenou částku (Česká republika má 3letý časový test — když držíš akcii 3+ roky, neplatíš z prodeje daň).</p>"
                         "<p><strong>Žádný cloud, žádná data ven.</strong> Všechno běží lokálně u mě na Windows. Pokud se něco synchronizuje mezi PC a serverem doma (Excel + faktury), je to šifrované standardní vojenskou silou (AES-256) — i kdyby někdo dostal soubor, nepřečte ho. GitHub slouží jen jako šifrované úložiště pro přenos mezi zařízeními.</p>",
                "features": [
                    ("Všechny peníze na jednom místě", "17 broker platforem + 2 banky + krypto + penzijko + zlato v jednom přehledu. Jeden klik a vidím kolik mám celkem."),
                    ("Faktury z e-mailu samy",          "Energie, telekom, pojistky, výplaty — automaticky stažené z Gmailu každou hodinu. Aplikace navrhne kategorii, já jen schválím."),
                    ("Cíl a plán do důchodu",           "Cíl 3,1 milionu Kč v progress baru. 8letá predikce kam mě dovede současné tempo. Kalkulačka ČSSZ důchodu podle reálných limitů 2026."),
                    ("Daně 2025 hned hotové",           "Vygeneruje XML přímo pro Finanční úřad. Hlídá 3letý časový test — kdy akcie přestanou podléhat dani."),
                    ("26 stránek pro každý detail",     "Cash Flow, Cíl, Predikce, Investice, Krypto, Dividendy, Daně, Důchod, Knowledge Base, Lock-in counter — pro každou otázku jedna stránka."),
                    ("Šifrované, lokální, žádný cloud", "Žádná data nikam neutíkají. Šifrování AES-256-CBC. Github jen jako šifrovaný transport, ne plaintext. Žádný měsíční poplatek nikomu."),
                ],
                "status": "Funkční verze v0.6.0 (květen 2026). Lokální Windows aplikace, ~5 měsíců aktivního vývoje. Soukromá — žádné public hosting, žádné API pro cizí.",
            },
            "en": {
                "name":  "Finance — Ledger",
                "lead":  "Personal finance app — all my money (banks, brokers, crypto, pension), invoices from Gmail, and a retirement plan in one place. No cloud, no signup, fully encrypted.",
                "what":  "<p>Built because I got tired of switching between bank apps, broker websites, and Excel. I have <strong>17 platforms</strong> where I keep money — XTB, Trading 212, eToro, Interactive Brokers, TastyTrade, Investown, Fingood, Wise, Revolut, crypto exchanges, two banks, pension, gold. To know my total I used to log in everywhere and add it up. Now I just open one page.</p>"
                         "<p><strong>Invoices arrive on their own.</strong> A small home server (Home Assistant) pulls new invoices from Gmail every hour (utilities, telecom, insurance, payslips). The app suggests a category and I just click \"post\". No manual transcription.</p>"
                         "<p><strong>Helps me plan retirement.</strong> Calculates expected state pension from real Czech Social Security data, how much I need to save myself, whether the current pace hits the 3.1M goal, and when exactly a position becomes tax-exempt under the Czech 3-year time test.</p>"
                         "<p><strong>No cloud, no data leaving.</strong> Runs locally on Windows. Anything that syncs between PC and home server (Excel + invoices) is encrypted with military-grade AES-256 — even if someone got the file, they can't read it. GitHub is only encrypted transport, never plaintext.</p>",
                "features": [
                    ("All money in one place",         "17 broker platforms + 2 banks + crypto + pension + gold in one overview. One click, total visible."),
                    ("Invoices from email automatic", "Utilities, telecom, insurance, payslips — pulled from Gmail hourly. App suggests category, I just approve."),
                    ("Retirement goal and plan",       "3.1M CZK goal progress bar. 8-year projection of current pace. Pension calculator with real 2026 limits."),
                    ("2025 tax filing ready",          "Generates XML for the Czech tax office. Tracks 3-year time test — when shares become tax-exempt."),
                    ("26 pages for every detail",      "Cash Flow, Goal, Predictions, Investments, Crypto, Dividends, Tax, Pension, Knowledge Base, Lock-in counter — one page per question."),
                    ("Encrypted, local, no cloud",     "No data leaves the machine. AES-256-CBC encryption. GitHub as encrypted transport only. Zero monthly fees."),
                ],
                "status": "Working v0.6.0 (May 2026). Local Windows app, ~5 months of active development. Private — no public hosting, no third-party API.",
            },
            "it": {
                "name":  "Finance — Libro contabile",
                "lead":  "App per le finanze personali — tutti i miei soldi (banche, broker, crypto, pensione), fatture dalla Gmail e piano per la pensione in un posto. Niente cloud, niente registrazione, tutto crittografato.",
                "what":  "<p>L'ho costruita perché ero stanco di passare tra app bancarie, siti broker e Excel. Ho <strong>17 piattaforme</strong> dove tengo soldi — XTB, Trading 212, eToro, Interactive Brokers, TastyTrade, Investown, Fingood, Wise, Revolut, exchange crypto, due banche, pensione, oro. Per sapere il totale dovevo loggare ovunque e sommare. Ora apro una pagina.</p>"
                         "<p><strong>Le fatture arrivano da sole.</strong> Un piccolo server di casa (Home Assistant) tira nuove fatture dalla Gmail ogni ora (utenze, telefono, assicurazioni, busta paga). L'app suggerisce una categoria, io clicco „contabilizza\". Niente trascrizione a mano.</p>"
                         "<p><strong>Pianifica la pensione.</strong> Calcola la pensione attesa dai dati reali della Previdenza Sociale ceca, quanto serve risparmiare, se il ritmo attuale arriva a 3,1M, e quando una posizione diventa esente da tasse (Repubblica Ceca ha il test 3 anni — possiedi un'azione 3+ anni, niente tasse sulla vendita).</p>"
                         "<p><strong>Niente cloud, niente dati fuori.</strong> Gira in locale su Windows. Quello che si sincronizza tra PC e server casa (Excel + fatture) è crittografato AES-256 — anche se qualcuno avesse il file, non lo legge. GitHub solo come trasporto crittografato.</p>",
                "features": [
                    ("Tutti i soldi in un posto",     "17 broker + 2 banche + crypto + pensione + oro in una vista. Un click, totale visibile."),
                    ("Fatture da email automatiche",  "Utenze, telefono, assicurazioni, buste paga — tirate dalla Gmail ogni ora. App suggerisce categoria, io approvo."),
                    ("Obiettivo e piano pensione",    "Barra di progresso obiettivo 3,1M CZK. Proiezione 8 anni del ritmo attuale. Calcolatore pensione con limiti reali 2026."),
                    ("Dichiarazione 2025 pronta",     "Genera XML per il fisco ceco. Traccia il test 3 anni — quando le azioni diventano esenti."),
                    ("26 pagine per ogni dettaglio",  "Cash Flow, Obiettivo, Previsioni, Investimenti, Crypto, Dividendi, Tasse, Pensione, Knowledge Base, Lock-in — una pagina per domanda."),
                    ("Crittografata, locale, no cloud", "Nessun dato lascia il computer. Crittografia AES-256-CBC. GitHub solo trasporto crittografato. Zero costi mensili."),
                ],
                "status": "Funzionante v0.6.0 (maggio 2026). App Windows locale, ~5 mesi di sviluppo attivo. Privata — niente hosting pubblico.",
            },
        },
    },
    {
        "slug": "finance-analytik",
        "icon": "📈",
        "color": "#5b8c9f",
        "asset_dir": "finance-analytik",
        "screens": [
            ("01_hero.png",        "Dashboard — přehled portfolia + signál distribuce (BUY/HOLD/SELL, data rozostřena)"),
            ("02_portfolio.png",   "Portfolio — 96 akcií + ETF s vlastním doporučením (kup/drž/prodej) a bezpečnostní rezervou v %"),
            ("03_fair_value.png",  "Férová cena — kolik akcie podle mě skutečně stojí (4 metody výpočtu)"),
            ("04_cost_basis.png",  "Pořizovací ceny — kolik a kdy jsem nakupoval, jak daleko k daňovému osvobození"),
            ("05_transactions.png", "Transakce — sjednocené výpisy od 5 brokerů (XTB, T212, IB, eToro, TastyTrade)"),
            ("06_dividends.png",   "Dividendy — roční přehled, hrubý + čistý, sražená daň"),
            ("07_data_sources.png", "Zdroje dat — odkud beru ceny (Stooq, Yahoo, TwelveData, manuální)"),
            ("08_import.png",      "Import výpisů — drag-and-drop PDF/XLSX, aplikace pozná brokera sama"),
        ],
        "stack": ["React", "TypeScript", "Tailwind", "Python", "DCF + REIT FFO modely"],
        "i18n": {
            "cs": {
                "name":  "Finance Analytik",
                "lead":  "Vlastní pomocník pro rozhodování o akciích — místo cizích doporučení si aplikace lokálně spočítá, kolik akcie podle mě skutečně stojí, a řekne mi: kup / drž / prodej. 96 pozic z 5 brokerů, bez API klíčů, bez cloudu.",
                "what":  "<p>Postavil jsem si ji vedle účetní knihy, protože ta jen <em>eviduje</em> co mám. Tahle aplikace <em>radí, co s tím</em>. Funguje takhle: aplikace si stáhne aktuální ceny akcií, lokálně spočítá svou vlastní „férovou cenu\" čtyřmi různými způsoby a porovná ji s tržní cenou. Pokud je tržní cena výrazně nižší než moje férová → <strong>doporučení BUY</strong> (= levně, zvážit nákup). Pokud výrazně vyšší → <strong>SELL</strong> (= drahé, zvážit prodej). Mezi tím HOLD, ADD nebo TRIM podle bezpečnostní rezervy.</p>"
                         "<p><strong>Čtyři způsoby výpočtu férové ceny</strong> — protože jeden vzorec nefunguje na všechno. Pro 20 velkých firem (Apple, Microsoft typu) používá <strong>DCF</strong> — diskontuje budoucí zisky firmy zpět do dneška. Pro 6 realitních fondů (Realty Income, Simon Property atd.) <strong>REIT FFO</strong> — standard pro REIT podle „funds from operations\". Pro 30 dalších akcií <strong>Multiples</strong> — porovnání s historickým a sektorovým průměrem (P/E ratio). 28 ETF se ocenit přesně nedá, držím podle indexu (= „pasivní HOLD\"). Krypto a opce vědomě vynechávám — pro ně neexistuje spolehlivý model.</p>"
                         "<p><strong>Čte výpisy od brokerů sama.</strong> Stáhnu PDF nebo XLSX z XTB, Trading 212, Interactive Brokers, eToro nebo TastyTrade, přetáhnu do aplikace, ta pozná brokera a normalizuje formát. Plus crypto výpisy z Anycoin a Trezoru. Cross-broker duplicate detection — když mám stejnou akcii na dvou účtech, sečte je správně.</p>"
                         "<p><strong>Hlídá český 3letý časový test pro daně.</strong> Když držíš akcii v ČR 3+ roky, prodej je daňově osvobozený. Aplikace pro každou pozici sleduje pořizovací data v pořadí jak jsi kupoval (FIFO), počítá zbývající dny do osvobození, a řadí pozice podle „kdo je první u brány\". Daňový kalkulátor produkuje výstup hotový do daňového přiznání.</p>"
                         "<p><strong>Žádné API klíče, žádný cloud.</strong> Aplikace nepotřebuje login do brokera ani jeho API token. Stačí jí výpisy které ti broker sám pošle. Ceny si bere z veřejných zdrojů (Stooq, Yahoo Finance). Vše běží lokálně. Žádné riziko že tvé pozice někdo uvidí.</p>",
                "features": [
                    ("Vlastní doporučení kup/drž/prodej", "Pro každou pozici aplikace spočítá svou férovou cenu a srovná s tržní. Vrátí signál BUY/HOLD/SELL/ADD/TRIM/WATCH podle bezpečnostní rezervy. Není to investiční rada — je to analytická pomůcka."),
                    ("4 různé metody pro 4 typy aktiv",  "DCF pro velké firmy podle budoucích zisků, REIT FFO pro realitní fondy, P/E multiples pro střední akcie, pasivní hold pro ETF. Žádné krypto a opce (těm chybí spolehlivý model)."),
                    ("Čte výpisy 5 brokerů + krypto",     "XTB, Trading 212, Interactive Brokers, eToro, TastyTrade + Anycoin + Trezor. Drag-and-drop PDF nebo XLSX, aplikace pozná brokera sama."),
                    ("Sleduje 3letý daňový test",         "Pro každou pozici vidíš kolik dní zbývá do daňového osvobození. Při prodeji vygeneruje podklad pro daňové přiznání."),
                    ("Bez API klíčů, bez cloudu",         "Aplikace nepotřebuje login do brokera. Ceny z veřejných zdrojů. Vše lokálně. Žádné riziko že pozice někdo uvidí."),
                    ("96 pozic, 444 testů",               "Aktuálně sleduje 96 akcií a ETF. Pod kapotou 444 automatických testů zajišťuje že parsery výpisů a fair-value engine fungují správně i po update."),
                ],
                "status": "Funkční MVP v0.3 (květen 2026), 8 rounds vývoje, ~3 měsíce aktivního vývoje. Lokální Windows aplikace přes Chrome --app launcher. Soukromá — žádné public hosting. Cíl: rozhodovací podpora pro mě, ne SaaS pro veřejnost.",
            },
            "en": {
                "name":  "Finance Analytik",
                "lead":  "Personal stock decision helper — instead of trusting third-party ratings, the app locally computes its own fair value and tells me: buy / hold / sell. 96 positions across 5 brokers, no API keys, no cloud.",
                "what":  "<p>Built alongside the ledger because that one just <em>records</em> what I own. This app <em>advises what to do with it</em>. The flow: app fetches current stock prices, locally computes its own \"fair value\" using four different methods, and compares it to the market price. If market is significantly below my fair → <strong>BUY signal</strong> (cheap, worth considering). If significantly above → <strong>SELL</strong> (expensive, consider exit). In between: HOLD, ADD, or TRIM depending on margin of safety.</p>"
                         "<p><strong>Four ways to compute fair value</strong> — one formula doesn't fit all. For 20 large firms (Apple, Microsoft type) it uses <strong>DCF</strong> — discounts future earnings back to today. For 6 REITs (Realty Income, Simon Property, etc.) <strong>REIT FFO</strong> — the standard \"funds from operations\" method. For 30 other stocks <strong>Multiples</strong> — historical and sector P/E comparison. 28 ETFs can't be precisely valued — held passively (\"passive HOLD\"). Crypto and options are intentionally excluded — no reliable model.</p>"
                         "<p><strong>Reads broker statements automatically.</strong> Drop a PDF or XLSX from XTB, Trading 212, Interactive Brokers, eToro, or TastyTrade — the app detects the broker and normalizes the format. Plus crypto from Anycoin and Trezor. Cross-broker duplicate detection — same stock on two accounts is summed correctly.</p>"
                         "<p><strong>Tracks the Czech 3-year tax exemption.</strong> Hold a stock in Czechia for 3+ years and the sale is tax-exempt. The app tracks acquisition dates in purchase order (FIFO), counts remaining days to exemption, sorts positions by \"who's first at the gate\". The tax calculator produces output ready for the annual filing.</p>"
                         "<p><strong>No API keys, no cloud.</strong> The app doesn't need broker login or API token — just the statements the broker emails you. Prices from public sources (Stooq, Yahoo Finance). Everything local. Zero risk of someone seeing the positions.</p>",
                "features": [
                    ("Own buy/hold/sell signal",        "For each position the app computes its own fair value and compares to market. Returns BUY/HOLD/SELL/ADD/TRIM/WATCH based on margin of safety. Not investment advice — an analytical tool."),
                    ("4 methods for 4 asset types",     "DCF for large firms by future earnings, REIT FFO for real-estate funds, P/E multiples for mid-cap, passive hold for ETFs. No crypto or options (lacks reliable model)."),
                    ("Reads statements from 5 brokers + crypto", "XTB, Trading 212, Interactive Brokers, eToro, TastyTrade + Anycoin + Trezor. Drag-and-drop PDF or XLSX, app detects broker."),
                    ("Tracks 3-year tax exemption",     "For each position you see days remaining until tax exemption. On sale, generates tax filing draft."),
                    ("No API keys, no cloud",           "App doesn't need broker login. Prices from public sources. All local. No risk of position disclosure."),
                    ("96 positions, 444 tests",         "Currently tracks 96 stocks and ETFs. Under the hood 444 automated tests ensure parsers and fair-value engine stay correct after updates."),
                ],
                "status": "Working MVP v0.3 (May 2026), 8 rounds of development, ~3 months active. Local Windows app via Chrome --app launcher. Private — no public hosting. Goal: decision support for myself, not a SaaS for the public.",
            },
            "it": {
                "name":  "Finance Analytik",
                "lead":  "Assistente personale per decisioni sulle azioni — invece di fidarmi di rating di terzi, l'app calcola in locale la propria fair value e mi dice: compra / tieni / vendi. 96 posizioni su 5 broker, niente API key, niente cloud.",
                "what":  "<p>Costruita accanto al libro contabile perché quello solo <em>registra</em> cosa ho. Questa app <em>consiglia cosa farci</em>. Il flusso: l'app scarica prezzi azioni attuali, calcola in locale la propria \"fair value\" con quattro metodi, e la confronta col prezzo di mercato. Se il mercato è molto sotto la mia fair → <strong>segnale BUY</strong> (economico, valutare acquisto). Se molto sopra → <strong>SELL</strong> (caro, valutare uscita). In mezzo HOLD, ADD, o TRIM secondo margine di sicurezza.</p>"
                         "<p><strong>Quattro modi di calcolare fair value</strong> — una formula non vale per tutto. Per 20 grandi aziende (tipo Apple, Microsoft) usa <strong>DCF</strong> — sconta utili futuri ad oggi. Per 6 REIT (Realty Income, Simon Property, ecc.) <strong>REIT FFO</strong> — standard \"funds from operations\". Per 30 altre azioni <strong>Multiples</strong> — confronto P/E storico e settoriale. 28 ETF non valutabili — tenuti passivamente. Crypto e opzioni esclusi (nessun modello affidabile).</p>"
                         "<p><strong>Legge estratti broker automaticamente.</strong> Trascina un PDF o XLSX da XTB, Trading 212, Interactive Brokers, eToro, TastyTrade — l'app riconosce il broker e normalizza il formato. Più crypto da Anycoin e Trezor. Rilevamento duplicati cross-broker.</p>"
                         "<p><strong>Traccia l'esenzione fiscale ceca dei 3 anni.</strong> Tieni un'azione in Cechia 3+ anni e la vendita è esente. L'app traccia date di acquisto (FIFO), conta giorni rimanenti, ordina per \"chi arriva prima al traguardo\". Il calcolatore tasse produce output pronto per la dichiarazione.</p>"
                         "<p><strong>Niente API key, niente cloud.</strong> L'app non ha bisogno di login broker o token. Bastano gli estratti che il broker manda via email. Prezzi da fonti pubbliche. Tutto in locale. Zero rischio di esposizione posizioni.</p>",
                "features": [
                    ("Segnale proprio compra/tieni/vendi", "Per ogni posizione l'app calcola fair value propria e confronta col mercato. Segnale BUY/HOLD/SELL/ADD/TRIM/WATCH per margine. Non consulenza — strumento analitico."),
                    ("4 metodi per 4 tipi di asset",       "DCF per grandi aziende per utili futuri, REIT FFO per fondi immobiliari, P/E multiples per mid-cap, hold passivo per ETF."),
                    ("Legge estratti da 5 broker + crypto", "XTB, Trading 212, Interactive Brokers, eToro, TastyTrade + Anycoin + Trezor. Drag-and-drop PDF o XLSX."),
                    ("Traccia esenzione fiscale 3 anni",   "Per ogni posizione vedi giorni rimanenti all'esenzione. Alla vendita genera bozza dichiarazione."),
                    ("Niente API key, niente cloud",       "App senza login broker. Prezzi da fonti pubbliche. Tutto in locale. Zero rischio."),
                    ("96 posizioni, 444 test",             "Traccia 96 azioni e ETF. Sotto il cofano 444 test automatici per parser e fair-value engine."),
                ],
                "status": "MVP funzionante v0.3 (maggio 2026), 8 round di sviluppo, ~3 mesi attivi. App Windows locale via Chrome --app. Privata — niente hosting pubblico. Obiettivo: supporto decisionale per me, non SaaS pubblica.",
            },
        },
    },
    {
        "slug": "krabickova-dieta",
        "icon": "🥗",
        "color": "#2e7d32",
        "asset_dir": "krabickova-dieta",
        "screens": [
            ("home.png", "Meal Planner — denní bowls"),
        ],
        "stack": ["React", "Vite", "PWA", "Tailwind"],
        "i18n": {
            "cs": {
                "name":  "Krabičková dieta",
                "lead":  "Meal planner — denní jídelníček s makro-cíli, BMR/TDEE a nákupní seznam.",
                "what":  "<p>Vařím si dopředu krabičky na týden. Potřebuju vědět <strong>kolik mám sníst kalorií, bílkovin, sacharidů</strong> a jaký recept se trefuje do mého denního cíle. Meal Planner mi to spočítá: BMR/TDEE z profilu, plán na 7 dní s recepty (kuřecí bowl, ryžovky, ...), automatický nákupní seznam.</p><p>Lokální PWA — funguje offline, recepty + nutrition databáze v IndexedDB.</p>",
                "features": [
                    ("Profil & metriky", "BMR + TDEE z věku/výšky/váhy/aktivity, denní cíle kcal a makro."),
                    ("Týdenní plán",     "7-denní jídelníček s recepty a celkovými makro per den."),
                    ("Recepty",          "Vlastní databáze receptů s gramy, makra, instrukcemi."),
                    ("Nákupní seznam",   "Automaticky sečtené ingredience pro celý týden."),
                    ("Profile export/import", "JSON export profilu pro backup."),
                ],
                "status": "Funkční, Phase 2.8 (květen 2026). Lokální PWA, žádný cloud.",
            },
            "en": {
                "name":  "Meal Planner",
                "lead":  "Meal planner — daily menu with macro targets, BMR/TDEE and a shopping list.",
                "what":  "<p>I cook meal boxes for the week in advance. I need to know <strong>how many calories, protein, carbs</strong> to eat and which recipe hits my daily target. Meal Planner computes it: BMR/TDEE from profile, 7-day plan with recipes (chicken bowl, rice bowl, ...), automatic shopping list.</p><p>Local PWA — works offline, recipes + nutrition DB in IndexedDB.</p>",
                "features": [
                    ("Profile & metrics", "BMR + TDEE from age/height/weight/activity, daily kcal and macro targets."),
                    ("Weekly plan",       "7-day menu with recipes and total macros per day."),
                    ("Recipes",           "Own recipe DB with grams, macros, instructions."),
                    ("Shopping list",     "Auto-sum of ingredients for the whole week."),
                    ("Profile export/import", "JSON profile export for backup."),
                ],
                "status": "Working, Phase 2.8 (May 2026). Local PWA, no cloud.",
            },
            "it": {
                "name":  "Meal Planner",
                "lead":  "Pianificatore pasti — menu giornaliero con obiettivi macro, BMR/TDEE e lista della spesa.",
                "what":  "<p>Mi preparo le porzioni per la settimana. Devo sapere <strong>quante calorie, proteine, carboidrati</strong> mangiare e quale ricetta centra il mio obiettivo. Meal Planner lo calcola: BMR/TDEE dal profilo, piano 7 giorni con ricette (bowl pollo, riso, ...), lista della spesa automatica.</p><p>PWA locale — funziona offline, ricette + DB nutrizione in IndexedDB.</p>",
                "features": [
                    ("Profilo e metriche", "BMR + TDEE da età/altezza/peso/attività, obiettivi kcal e macro."),
                    ("Piano settimanale", "Menu 7 giorni con ricette e macro totali per giorno."),
                    ("Ricette",           "DB ricette personale con grammi, macro, istruzioni."),
                    ("Lista spesa",       "Somma automatica ingredienti per tutta la settimana."),
                    ("Export/import",     "Export profilo in JSON per backup."),
                ],
                "status": "Funzionante, Phase 2.8 (maggio 2026). PWA locale, niente cloud.",
            },
        },
    },
    {
        "slug": "dashboardy",
        "icon": "📊",
        "color": "#7cd6ff",
        "asset_dir": "dashboardy",
        "screens": [
            ("energy_pc.png",      "Energy Dashboard — PC verze (Edge app-mode, DEMO snapshot)"),
            ("rpi_audio.png",      "RPi kiosk — audio + scény"),
            ("rpi_energy.png",     "RPi kiosk — energie & topení"),
            ("rpi_scenes.png",     "RPi kiosk — scény (Loxone-style)"),
            ("rpi_settings.png",   "RPi kiosk — nastavení"),
        ],
        "stack": ["HTML", "Vanilla JS", "Python proxy", "HA REST", "Homey REST"],
        "i18n": {
            "cs": {
                "name":  "Dashboardy",
                "lead":  "Dvě informační obrazovky: Energy na PC s živým odběrem z HA RPi, RPi kiosk jako ovládací centrum bytu.",
                "what":  "<p>Místo apky na telefonu mám dvě věci na stěně:</p><p><strong>1) Energy Dashboard na PC</strong> — kolik teď bere dům, co stojí dnes, prognóza na měsíc, který spotřebič bere nejvíc. Edge app-mode, žádné menu, žádné okno — jen čistý dashboard.</p><p><strong>2) RPi kiosk</strong> — Raspberry Pi 4 s 7\" displayem na zdi, ovládá světla, audio, topení, scény. Stránka home + audio + energy + scény + settings, vše bez kliknutí dál — všechno na první obrazovce.</p><p>Oba čtou data z HA RPi (192.168.1.241), který agreguje vše ze Smart Home (Homey + 3EM měření + Shelly + heating data).</p>",
                "features": [
                    ("Energy Dashboard PC", "Aktuální W, dnes kWh, cena s/bez POZE, měsíční prognóza, top spotřebič."),
                    ("Tarif NT/VT",         "Vizuální badge pro nízký/vysoký tarif, HDO kód, jistič."),
                    ("RPi kiosk home",      "Status domu (kdo je doma, kdo spí, kde je motion), rychlé akce."),
                    ("RPi audio + scény",   "Spuštění radia, scény (relax, kino, vaření, večeře)."),
                    ("Energy + topení",     "Topení runtime, runtime today, kotel stav, TRV zóny."),
                    ("Settings",            "Pinned overview pro provoz domu — bez nutnosti otevřít telefon."),
                ],
                "status": "Funkční. Energy běží lokálně na PC (proxy → HA RPi). RPi kiosk běží 24/7 na Raspberry Pi 4 v chodbě.",
            },
            "en": {
                "name":  "Dashboards",
                "lead":  "Two info screens: Energy on the PC with live consumption from HA RPi, and a RPi kiosk as the home control panel.",
                "what":  "<p>Instead of a phone app I have two things on the wall:</p><p><strong>1) Energy Dashboard on the PC</strong> — current draw, today's kWh, monthly forecast, top consumer. Edge app-mode, no menus, no windows — just a clean dashboard.</p><p><strong>2) RPi kiosk</strong> — Raspberry Pi 4 with 7\" wall display, controls lights, audio, heating, scenes. Home + audio + energy + scenes + settings — everything on the first screen.</p><p>Both read from HA RPi (192.168.1.241), which aggregates smart-home data (Homey + 3EM meter + Shelly + heating).</p>",
                "features": [
                    ("Energy Dashboard PC", "Live W, today kWh, cost with/without POZE, monthly forecast, top consumer."),
                    ("NT/VT tariff",        "Visual badge for low/high tariff, HDO code, breaker."),
                    ("RPi kiosk home",      "House status (who's home, who's asleep, where's motion), quick actions."),
                    ("RPi audio + scenes",  "Radio start, scenes (relax, cinema, cooking, dinner)."),
                    ("Energy + heating",    "Heating runtime, today's runtime, boiler state, TRV zones."),
                    ("Settings",            "Pinned home operation overview — no phone needed."),
                ],
                "status": "Working. Energy runs locally on the PC (proxy → HA RPi). RPi kiosk runs 24/7 on a Raspberry Pi 4 in the hallway.",
            },
            "it": {
                "name":  "Dashboard",
                "lead":  "Due schermi info: Energy sul PC con consumo live da HA RPi, e un kiosk RPi come pannello di controllo casa.",
                "what":  "<p>Invece di un'app sul telefono ho due cose sul muro:</p><p><strong>1) Energy Dashboard su PC</strong> — consumo attuale, kWh oggi, previsione mensile, top consumer. Edge app-mode, niente menu, niente finestre — solo dashboard pulita.</p><p><strong>2) Kiosk RPi</strong> — Raspberry Pi 4 con display 7\" a muro, controlla luci, audio, riscaldamento, scene. Home + audio + energia + scene + impostazioni — tutto sulla prima schermata.</p><p>Entrambi leggono da HA RPi (192.168.1.241), che aggrega dati smart-home (Homey + 3EM + Shelly + riscaldamento).</p>",
                "features": [
                    ("Energy Dashboard PC", "W attuali, kWh oggi, costo con/senza POZE, previsione mensile, top consumer."),
                    ("Tariffa NT/VT",       "Badge visuale per tariffa bassa/alta, codice HDO, interruttore."),
                    ("Home kiosk RPi",      "Stato casa (chi è in casa, chi dorme, dov'è motion), azioni rapide."),
                    ("Audio + scene RPi",   "Avvio radio, scene (relax, cinema, cucina, cena)."),
                    ("Energia + riscaldamento", "Runtime riscaldamento, oggi runtime, stato caldaia, zone TRV."),
                    ("Impostazioni",        "Vista operativa casa fissa — niente telefono."),
                ],
                "status": "Funzionante. Energy gira in locale sul PC (proxy → HA RPi). Kiosk RPi gira 24/7 su Raspberry Pi 4 nel corridoio.",
            },
        },
    },
]


# ────────────────────────────────────────────────────────────
# Builders
# ────────────────────────────────────────────────────────────
def lang_prefix(lang: str) -> str:
    return "" if lang == "cs" else f"{lang}/"


def hub_path(lang: str) -> Path:
    return ROOT / lang_prefix(lang) / "aplikace" / "index.html"


def app_path(lang: str, slug: str) -> Path:
    return ROOT / lang_prefix(lang) / "aplikace" / f"{slug}.html"


def img_url(lang: str, sub: str, filename: str) -> str:
    """Relative URL from a page in aplikace/ to assets/img/aplikace/<sub>/<filename>."""
    depth = 2 if lang == "cs" else 3
    return "../" * depth + f"assets/img/aplikace/{sub}/{filename}"


def asset_url_relative_from_hub(lang: str, sub: str, filename: str) -> str:
    return img_url(lang, sub, filename)


def render_hub(lang: str) -> str:
    L = I18N[lang]
    cards = []
    for app in APPS:
        a = app["i18n"][lang]
        slug = app["slug"]
        icon = app["icon"]
        color = app["color"]
        cards.append(
            f'<a href="{slug}.html" class="card card-link" style="border-left:4px solid {color};">'
            f'<div class="card-icon">{icon}</div>'
            f'<h3>{a["name"]}</h3>'
            f'<p>{a["lead"]}</p>'
            f'<div class="card-cta">{L["open_card"]} →</div>'
            "</a>"
        )
    cards_html = "\n      ".join(cards)
    return f"""\
<section class="hero">
  <span class="hero-accent">{L["hub_h1"]}</span>
  <h1>{L["hub_h1"]}</h1>
  <p class="hero-sub">{L["hub_intro"]}</p>
</section>

<section aria-label="{L["hub_h1"]}">
  <div class="cards-grid">
      {cards_html}
  </div>
</section>
"""


def render_app(lang: str, app: dict) -> str:
    L = I18N[lang]
    a = app["i18n"][lang]
    icon = app["icon"]
    color = app["color"]
    stack_chips = " ".join(
        f'<span class="pill" style="background:{color}1a;color:{color};border:1px solid {color}40;'
        f'padding:.2rem .6rem;border-radius:6px;font-size:.78rem;margin-right:.3rem">{s}</span>'
        for s in app["stack"]
    )
    features = "\n      ".join(
        f"<li><strong>{title}</strong> — {body}</li>"
        for title, body in a["features"]
    )
    screen_cards = []
    for filename, caption in app["screens"]:
        url = img_url(lang, app["asset_dir"], filename)
        screen_cards.append(
            f'<figure style="margin:0">'
            f'<img src="{url}" alt="{caption}" loading="lazy" '
            f'style="width:100%;height:auto;border-radius:8px;border:1px solid var(--border,#0001);display:block">'
            f'<figcaption style="font-size:.85rem;color:var(--txt-muted,#666);margin-top:.4rem">{caption}</figcaption>'
            "</figure>"
        )
    screens_block = ""
    if screen_cards:
        screens_block = (
            f'<section><h2>{L["screens"]}</h2>'
            f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-top:.6rem">'
            + "\n      ".join(screen_cards)
            + "</div></section>"
        )
    back = "../index.html"
    return f"""\
<section class="hero" style="border-left:4px solid {color};padding-left:1.2rem">
  <span class="hero-accent" style="color:{color}">{a["name"]}</span>
  <h1><span style="margin-right:.4rem">{icon}</span>{a["name"]}</h1>
  <p class="hero-sub">{a["lead"]}</p>
  <p style="margin-top:.6rem">{stack_chips}</p>
  <p style="margin-top:.8rem"><a href="{back}">{L["back_to_hub"]}</a></p>
</section>

<section>
  <h2>{L["what"]}</h2>
  {a["what"]}
</section>

<section>
  <h2>{L["features"]}</h2>
  <ul style="line-height:1.7">
      {features}
  </ul>
</section>

{screens_block}

<section>
  <h2>{L["status"]}</h2>
  <p>{a["status"]}</p>
</section>
"""


def wrap_html(lang: str, title: str, depth: int, body: str) -> str:
    """Minimal full HTML wrapper. _build_pages.py rewraps with shared
    header/nav/footer later, so we just provide a valid <main>."""
    css = ("../" * depth) + "assets/css/style.css"
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="{css}">
</head>
<body>
<main id="main">
{body}
</main>
</body>
</html>
"""


def main() -> int:
    written = []
    for lang in ("cs", "en", "it"):
        # Hub index
        L = I18N[lang]
        depth = 1 if lang == "cs" else 2
        hub_html = wrap_html(lang, L["hub_title"], depth, render_hub(lang))
        p = hub_path(lang)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(hub_html, encoding="utf-8")
        written.append(p)
        # Sub pages
        for app in APPS:
            title = f"{app['i18n'][lang]['name']} — {L['hub_h1']} — Luděk"
            page_html = wrap_html(lang, title, depth, render_app(lang, app))
            p2 = app_path(lang, app["slug"])
            p2.parent.mkdir(parents=True, exist_ok=True)
            p2.write_text(page_html, encoding="utf-8")
            written.append(p2)
    print(f"Wrote {len(written)} files:")
    for w in written:
        try:
            print(f"  - {w.relative_to(ROOT)}")
        except ValueError:
            print(f"  - {w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
