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
        "color": "#d49317",
        "asset_dir": "ucetni-kniha",
        "screens": [],
        "stack": ["React", "Vite", "Tailwind", "Python server"],
        "i18n": {
            "cs": {
                "name":  "Finance — Účetní kniha",
                "lead":  "Domácí účetní kniha — všechny peníze v banky, brokerech a kryptu na jednom přehledu.",
                "what":  "<p>Mám 14+ účtů — Fio, Trading 212, XTB, Tasty, eToro, krypto burzy, Trezor wallet, fingood, investown, penzijko, zlato. Bez jediného přehledu se v tom nedá orientovat. Účetní kniha v44 sheetů v Excelu, ale Excel nezvládal navigaci — proto webová appka s filtry, KPI a měsíčním rozkladem.</p><p>Pracuje lokálně, žádná data nikam neutíkají. Šifrováno přes transcrypt v privátním repu.</p>",
                "features": [
                    ("Hub všech účtů", "14+ účtů (banky, brokeri, krypto, zlato, penzijko) v jednom přehledu."),
                    ("KPI dashboard",  "Reálná fiat hodnota, čistá hodnota dnes, P/L proti pořizovací ceně."),
                    ("Filtry transakcí", "1606 řádků s rychlými filtry per měsíc / typ / účet / měna."),
                    ("Krypto sekce",   "BTC, ETH, ADA, SOL, XRP — propojení on-chain s nákupními cenami."),
                    ("NEEDS_REVIEW",   "Položky které chtějí pozornost (chybějící data, nesouhlasné částky)."),
                ],
                "status": "Funkční, v5 (květen 2026). Lokální Windows aplikace + lk-finance privátní repo.",
            },
            "en": {
                "name":  "Finance — Ledger",
                "lead":  "Home ledger — all my money across banks, brokers, and crypto in one view.",
                "what":  "<p>I have 14+ accounts — Fio, Trading 212, XTB, Tasty, eToro, crypto exchanges, Trezor wallet, fingood, investown, pension, gold. There's no orienting without a single view. The ledger is a 44-sheet Excel file but Excel can't navigate that — hence a web app with filters, KPIs and monthly breakdown.</p><p>Local-only, no data leaves the machine. Encrypted via transcrypt in a private repo.</p>",
                "features": [
                    ("Account hub",      "14+ accounts (banks, brokers, crypto, gold, pension) in one view."),
                    ("KPI dashboard",    "Real fiat value, net worth today, P/L vs cost basis."),
                    ("Transaction filters", "1606 rows with quick filters by month / type / account / currency."),
                    ("Crypto section",   "BTC, ETH, ADA, SOL, XRP — on-chain reconciled with purchase prices."),
                    ("NEEDS_REVIEW",     "Items needing attention (missing data, mismatched amounts)."),
                ],
                "status": "Working, v5 (May 2026). Local Windows app + lk-finance private repo.",
            },
            "it": {
                "name":  "Finance — Libro contabile",
                "lead":  "Libro mastro domestico — tutti i miei soldi tra banche, broker e crypto in una vista.",
                "what":  "<p>Ho 14+ conti — Fio, Trading 212, XTB, Tasty, eToro, exchange crypto, wallet Trezor, fingood, investown, pensione, oro. Senza un'unica vista non si capisce niente. Il libro contabile ha 44 fogli Excel ma Excel non ce la fa — da qui una web app con filtri, KPI e split mensile.</p><p>Solo locale, nessun dato lascia il computer. Crittografato via transcrypt in repo privato.</p>",
                "features": [
                    ("Hub conti",         "14+ conti (banche, broker, crypto, oro, pensione) in una vista."),
                    ("Dashboard KPI",     "Valore fiat reale, net worth oggi, P/L sul costo medio."),
                    ("Filtri transazioni", "1606 righe con filtri rapidi per mese / tipo / conto / valuta."),
                    ("Sezione crypto",    "BTC, ETH, ADA, SOL, XRP — on-chain riconciliato con prezzi d'acquisto."),
                    ("NEEDS_REVIEW",      "Voci che richiedono attenzione (dati mancanti, importi non quadrano)."),
                ],
                "status": "Funzionante, v5 (maggio 2026). App Windows locale + repo privato lk-finance.",
            },
        },
    },
    {
        "slug": "finance-analytik",
        "icon": "📈",
        "color": "#d35454",
        "asset_dir": "finance-analytik",
        "screens": [
            ("home.png", "Hlavní obrazovka — portfolio přehled"),
        ],
        "stack": ["React", "TypeScript", "Tailwind", "Python server"],
        "i18n": {
            "cs": {
                "name":  "Finance Analytik",
                "lead":  "Soukromý analyzer akcií, ETF a portfolia — bez brokerského API, ručně importované výpisy.",
                "what":  "<p>Když chci vidět svoje portfolio jako jeden obrázek (akcie, ETF, dividendy, FX dopad), brokerské appky to neumí společně. Analytik to spojuje: importuju výpisy z Trading 212, XTB, Tasty, eToro a aplikace mi spočítá P/L, vážený průměr, sektor exposure, FX risk a daňové podklady.</p><p>Privátní — žádný cloud, žádné OAuth, žádné API klíče k brokerům. Lokální Python server + Edge v app-mode.</p>",
                "features": [
                    ("Import výpisů",     "CSV/XLS z 4 brokerů, automatický normalizér tickerů a měn."),
                    ("Portfolio agregát", "Vážený průměrný kurz, P/L real-time, sektor & geo exposure."),
                    ("Dividendy",         "Roční výnos, gross/net, daň, reinvestice."),
                    ("FX risk",           "USD/EUR/CZK exposure, hedge ratio."),
                    ("Daňové podklady",   "Roční report pro daňové přiznání, FIFO/LIFO matching."),
                ],
                "status": "MVP v0.3 (květen 2026), soukromý. Žádné public hosting.",
            },
            "en": {
                "name":  "Finance Analyst",
                "lead":  "Private analyzer for stocks, ETFs and portfolio — no broker API, manually imported statements.",
                "what":  "<p>When I want to see my portfolio as one picture (stocks, ETFs, dividends, FX impact), broker apps don't combine them. The Analyst does: I import statements from Trading 212, XTB, Tasty, eToro and the app computes P/L, weighted average, sector exposure, FX risk and tax data.</p><p>Private — no cloud, no OAuth, no broker API keys. Local Python server + Edge app-mode.</p>",
                "features": [
                    ("Statement import",  "CSV/XLS from 4 brokers, automatic ticker and currency normalizer."),
                    ("Portfolio aggregate", "Weighted average price, real-time P/L, sector & geo exposure."),
                    ("Dividends",         "Annual yield, gross/net, tax, reinvestment."),
                    ("FX risk",           "USD/EUR/CZK exposure, hedge ratio."),
                    ("Tax data",          "Annual report for tax filing, FIFO/LIFO matching."),
                ],
                "status": "MVP v0.3 (May 2026), private. No public hosting.",
            },
            "it": {
                "name":  "Finance Analyst",
                "lead":  "Analizzatore privato di azioni, ETF e portfolio — niente API broker, estratti importati a mano.",
                "what":  "<p>Quando voglio vedere il portfolio come un'immagine unica (azioni, ETF, dividendi, impatto FX), le app dei broker non le combinano. L'Analyst sì: importo estratti da Trading 212, XTB, Tasty, eToro e l'app calcola P/L, media ponderata, esposizione settoriale, FX risk e dati fiscali.</p><p>Privato — niente cloud, niente OAuth, niente API key broker. Server Python locale + Edge app-mode.</p>",
                "features": [
                    ("Import estratti",   "CSV/XLS da 4 broker, normalizer automatico di ticker e valute."),
                    ("Aggregato portfolio", "Prezzo medio ponderato, P/L real-time, esposizione settori e geo."),
                    ("Dividendi",         "Rendimento annuo, lordo/netto, tasse, reinvestimento."),
                    ("FX risk",           "Esposizione USD/EUR/CZK, hedge ratio."),
                    ("Dati fiscali",      "Report annuale per la dichiarazione, matching FIFO/LIFO."),
                ],
                "status": "MVP v0.3 (maggio 2026), privata. Nessun hosting pubblico.",
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
            ("energy_pc.png",      "Energy Dashboard — PC verze (Edge app-mode)"),
            ("rpi_home.png",       "RPi kiosk — domovská stránka"),
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
