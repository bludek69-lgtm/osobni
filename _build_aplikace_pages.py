"""Generate Moje aplikace section: hub index + sub-pages in CS/EN/IT.

DATOVÉ ZDROJE (oprava 2026-06-12):
  • Verze + download soubory: ŽIVÝ latest.json repa bludek69-lgtm/aplikace
    (fetch při buildu; offline fallback = _data/latest_cache.json).
    Žádné verze už nejsou natvrdo v tomto skriptu.
  • Checksum odkazy: ODSTRANĚNY (politika webu 2026-06-12 — download bez
    viditelných CHECKSUMS odkazů; mechanismus v repu aplikace netknut).
  • Zápis: MERGE-MODE — u existující stránky se vymění JEN obsah <main>;
    head (SEO tagy), header (lang-switcher) a footer zůstávají ze živé stránky.
    Nová stránka se založí minimálním wrapperem (pak spusť _build_pages.py).
  • Ručně udržované stránky (budline, sbirka, tenispark detail, app-tester,
    resident-auditor, meal-planner stub) tento builder NEgeneruje.

Run from osobni root:
    py -3 _build_aplikace_pages.py
"""
from __future__ import annotations
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

LATEST_URL = "https://raw.githubusercontent.com/bludek69-lgtm/aplikace/main/latest.json"
LATEST_CACHE = Path(__file__).resolve().parent / "_data" / "latest_cache.json"


def load_latest() -> dict:
    """Verze/URL instalátorů: živý latest.json, fallback lokální cache."""
    try:
        # firemní síť / AV TLS interception → systémové certifikáty Windows
        import truststore
        truststore.inject_into_ssl()
    except ImportError:
        pass
    try:
        with urllib.request.urlopen(LATEST_URL, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
        LATEST_CACHE.parent.mkdir(exist_ok=True)
        LATEST_CACHE.write_text(json.dumps(data, indent=1), encoding="utf-8")
        versions = ", ".join(f"{k} {v['version']}" for k, v in data.items())
        print(f"latest.json: live ({versions})")
        return data
    except Exception as e:
        if LATEST_CACHE.exists():
            print(f"latest.json: OFFLINE — používám cache {LATEST_CACHE.name} ({e})")
            return json.loads(LATEST_CACHE.read_text(encoding="utf-8"))
        sys.exit(f"⛔ latest.json nedostupný a cache neexistuje — nelze bezpečně generovat verze. ({e})")

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
        "hub_intro":    "Osm vlastních aplikací co jsem si postavil (nebo postavit chystám), abych si zjednodušil život s Homey, financemi, cestováním do Itálie, jídlem a prací. Žádný cloud, žádná telemetrie — všechno běží lokálně u mě doma nebo na malém serveru.",
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
        "hub_intro":    "Eight custom apps I built (or am building) to make life with Homey, finances, travel to Italy, meals and work easier. No cloud, no telemetry — everything runs locally at home or on a small server.",
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
        "hub_intro":    "Otto applicazioni che mi sono costruito (o che sto costruendo) per semplificare la vita con Homey, le finanze personali, i viaggi in Italia, i pasti e il lavoro. Niente cloud, niente telemetria — tutto gira in locale a casa mia o su un piccolo server.",
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
                "lead":       "Ovládací panel pro celou chytrou domácnost — místo aby měl člověk pro každou věc vlastní appku, mám jednu stránku v prohlížeči, kde si nastavím všechno: kdy začíná ranní rutina, jak teple se topí, kdy se vypne audio, co dělají světla když přijdu domů.",
                "what":       "<p>Mám doma cca 60 zařízení (světla, motion senzory, termostatické hlavice, reproduktory, čistička, roleta, …) řízených systémem Homey Pro 2026. Ten umí spoustu věcí — má vlastní mobilní apku, web rozhraní, scripty, automatizace — ale je v něm strašně moc šuplíčků a nastavení je rozházené.</p>"
                              "<p><strong>Config Center to sjednocuje na jedno místo.</strong> Otevřu web v prohlížeči, přihlásím se vlastním tokenem (token zůstane jen v mém prohlížeči, nikam se neposílá), a vidím 22 přehledných stránek: pro každý &bdquo;režim domu&ldquo; jednu (ráno / den / večer / noc / pryč / doma / spánek), zvlášť topení, zvlášť světla, zvlášť audio, atd. Klikání po telefonu nikoho nebaví — tady je všechno na čtyřech sloupcích vidět najednou.</p>"
                              "<p><strong>Preview režim = bezpečná zkouška.</strong> Když chci něco vyzkoušet (např. teplejší světlo v kuchyni večer), aplikace to nejprve nastaví, dá mi 10 minut na test, a pokud do té doby neřeknu &bdquo;tak jo, ulož to&ldquo;, samo se to vrátí zpátky. Takže když omylem zadám blbost, dům se sám opraví.</p>"
                              "<p><strong>Chrání před omyly.</strong> Některá zařízení (audio v ložnici, citlivé senzory) mají &bdquo;hard-block&ldquo; — ani omylem se nedá zapnout když by to vadilo. Třeba reproduktor v ložnici se nesmí přehrát test, kdyby tam zrovna někdo spal.</p>"
                              "<p><strong>Lokální, vlastní, žádný cloud.</strong> Aplikace je jen HTML+CSS+JS soubor co se otevře v Edge nebo Chrome. Komunikuje přímo s Homey hubem doma, nic se neposílá na cizí server. Žádné předplatné, žádná závislost na cloudu výrobce.</p>",
                "features": [
                    ("22 stránek pro každý režim",        "Ranní / denní / večerní / noční / pryč / doma / spánek — pro každý mám zvlášť hlasové zprávy (TTS), cíle pro světla, cíle pro topení. Nemusím si pamatovat kde co je."),
                    ("Plán topení po dnech a hodinách",   "Pro každou ze 4 zón (jídelna, ložnice, koupelna, toaleta) den po dni, hodina po hodině jakou teplotu chci. Boost knoflík když potřebuju rychle přitopit."),
                    ("Bezpečná zkouška se 10min navrácením", "Než se změna potvrdí, mám 10 minut na test. Pokud do té doby neřeknu &bdquo;OK&ldquo;, samo se to vrátí. Nedá se rozbít dům jedním překlepem."),
                    ("100+ věcí které si můžu doladit",   "Kdy začíná ranní rutina, jak rychle nabíhá světlo (ramp), za jak dlouho se vypne audio, jak silné má být ráno briefing, …"),
                    ("Token v prohlížeči, nikde jinde",   "Přístup do Homey hubu se uloží jen do localStorage tohoto prohlížeče. Žádný server, žádné cloudy, žádné &bdquo;přihlášení přes Google&ldquo;."),
                    ("Hard-block pro citlivá zařízení",   "Některá zařízení nemůžou být omylem zapnutá. Třeba audio v ložnici během spánku, čistička přes plíseň, atd."),
                ],
                "status": "Denně používané. Verze v1.7.5 (květen 2026). Běží lokálně v prohlížeči na PC i na malém panelu na zdi (RPi kiosk). 100+ proměnných je živě editovatelných.",
            },
            "en": {
                "name":       "Config Center",
                "lead":       "Control panel for the whole smart home — instead of one app per gadget, I have a single web page where I tune everything: when the morning routine starts, how warm the heating is, when audio stops, what lights do when I come home.",
                "what":       "<p>I have about 60 devices at home (lights, motion sensors, TRV heads, speakers, air purifier, blind, …) running on Homey Pro 2026. It can do a lot — has its own mobile app, web UI, scripts, automations — but there are far too many drawers and the settings are scattered.</p>"
                              "<p><strong>Config Center unifies everything in one place.</strong> Open the web in a browser, log in with my token (the token stays only in this browser, nothing is sent anywhere), and see 22 clean pages: one per &bdquo;house mode&ldquo; (morning / day / evening / night / away / home / sleep), separate for heating, lights, audio, etc.</p>"
                              "<p><strong>Preview mode = safe test.</strong> When I want to try something, the app applies it first, gives me 10 minutes to test, and if I don't say &bdquo;OK, save it&ldquo; in that window, it reverts itself. So even if I make a mistake, the house heals itself.</p>"
                              "<p><strong>Protects from mistakes.</strong> Some devices (bedroom audio, sensitive sensors) have a hard-block — they cannot be turned on accidentally. The bedroom speaker can't play a test if someone's sleeping there.</p>"
                              "<p><strong>Local, mine, no cloud.</strong> The app is just an HTML+CSS+JS file opened in Edge or Chrome. It talks directly to the Homey hub at home, nothing goes to a third-party server. No subscription, no vendor cloud dependency.</p>",
                "features": [
                    ("22 pages per mode",                 "Morning / day / evening / night / away / home / sleep — each with its own voice messages (TTS), light goals, heating goals."),
                    ("Per-day, per-hour heating plan",    "For each of 4 zones (dining, bedroom, bathroom, toilet) day by day, hour by hour what temp I want. Boost button for quick heating."),
                    ("10-min preview safety",             "Change applies first, 10 min to test, auto-reverts if I don't confirm. Can't break the house with one typo."),
                    ("100+ knobs to tune",                "When morning starts, how fast lights ramp up, how long audio stays on, how loud the morning briefing is, …"),
                    ("Token in browser only",             "Hub access stored only in this browser's localStorage. No server, no clouds, no &bdquo;sign in with Google&ldquo;."),
                    ("Hard-block for sensitive gear",     "Some devices can't be accidentally on. E.g. bedroom audio while sleeping, purifier during mold treatment, etc."),
                ],
                "status": "In daily use. Version v1.7.5 (May 2026). Runs locally in a browser on PC and on a small wall panel (RPi kiosk). 100+ variables editable live.",
            },
            "it": {
                "name":       "Config Center",
                "lead":       "Pannello di controllo per tutta la casa intelligente — invece di un'app per gadget, una pagina web dove regolo tutto: quando inizia la routine mattutina, quanto caldo riscalda, quando si spegne l'audio, cosa fanno le luci quando torno a casa.",
                "what":       "<p>Ho circa 60 dispositivi a casa (luci, sensori movimento, teste TRV, altoparlanti, purificatore, tapparella, …) gestiti da Homey Pro 2026. Sa fare molto — app mobile, UI web, script, automazioni — ma c'è troppi cassetti e impostazioni sparpagliate.</p>"
                              "<p><strong>Config Center unifica tutto in un posto.</strong> Apro il web nel browser, login col mio token (resta solo qui, niente esce), e vedo 22 pagine ordinate: una per ogni &bdquo;modalità casa&ldquo;, separate per riscaldamento, luci, audio, ecc.</p>"
                              "<p><strong>Preview mode = test sicuro.</strong> Quando voglio provare qualcosa, l'app la applica prima, 10 minuti per test, e se non dico &bdquo;OK&ldquo; si ripristina da sola. La casa si auto-corregge.</p>"
                              "<p><strong>Protegge dagli errori.</strong> Alcuni dispositivi (audio camera, sensori delicati) hanno hard-block — non si accendono per errore.</p>"
                              "<p><strong>Locale, mio, niente cloud.</strong> L'app è solo un file HTML+CSS+JS aperto in Edge o Chrome. Parla direttamente con l'hub Homey a casa, niente va a server terzi. Niente abbonamento.</p>",
                "features": [
                    ("22 pagine per modalità",            "Mattina / giorno / sera / notte / via / casa / sonno — ognuna con messaggi vocali, obiettivi luci, obiettivi riscaldamento."),
                    ("Piano riscaldamento per giorno/ora", "Per ognuna delle 4 zone giorno per giorno, ora per ora la temperatura. Pulsante boost."),
                    ("Sicurezza preview 10 min",          "Modifica applica prima, 10 min di test, auto-ripristino se non confermo."),
                    ("100+ parametri regolabili",         "Quando inizia il mattino, velocità ramp luci, durata audio, volume briefing, …"),
                    ("Token solo nel browser",            "Accesso hub solo in localStorage del browser. Niente server, niente cloud."),
                    ("Hard-block per attrezzature delicate", "Alcuni dispositivi non si accendono per sbaglio. Es. audio camera durante il sonno."),
                ],
                "status": "Uso quotidiano. Versione v1.7.5 (maggio 2026). Gira in locale nel browser su PC e su un piccolo pannello a muro (kiosk RPi). 100+ variabili modificabili live.",
            },
        },
    },
    {
        "slug": "italia-travel",
        "icon": "🇮🇹",
        "icon_html": '<svg width="30" height="20" viewBox="0 0 3 2" style="border-radius:3px;vertical-align:middle"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#f4f5f0"/><rect x="2" width="1" height="2" fill="#ce2b37"/></svg>',
        "color": "#008c45",
        "asset_dir": "italia-travel",
        "screens": [
            ("01_hero.png",            "Přehled cest — 4 testovací výlety (Bergamo, kemper roadtrip, Řím, Toskánsko) v jednom dashboardu, italský tricolore proužek"),
            ("02_nova_cesta.png",      "Nová cesta — formulář s názvem, regionem, datem, počtem osob, rozpočtem a stylem (městský pobyt / roadtrip / lake / coast / hory / food & wine)"),
            ("03_doprava.png",         "Doprava — 4 záložky (Letadlo / Auto / Vlak / Kombinace), deeplinky na Kiwi a Trenitalia, žádné automatické rezervace"),
            ("04_roadtrip.png",        "Roadtrip plánovač — výběr země odjezdu/cíle s vlajkami 10 zemí, autocomplete měst, styl trasy, počet zastávek, multi-select zájmů (UNESCO, víno, gastronomie)"),
            ("05_camper.png",          "Camper režim — profil obytného auta (rozměry, hmotnost), 10 typů stopů (Stellplatz, Area sosta, …), 11 facility chipů (voda, WC, sprcha, …), warning badges ZTL"),
            ("06_ubytovani.png",       "Ubytování — hotely / Airbnb / agriturismi s hodnocením, cenou, výhodami/nevýhodami (parking, ZTL), deeplink na Booking"),
            ("07_mapa.png",            "Mapa POI — všechny body zájmu vizualizované, barevné ikony (hotel, restaurace, vstupenky, ZTL warning), export do Google My Maps CSV"),
            ("08_itinerar.png",        "Itinerář den po dni — Ráno / Odpoledne / Večer s časy + jídlo + doprava + záložní plán pro déšť, plně offline"),
            ("09_vstupenky.png",       "Vstupenky — Vatikán/Uffizi/Koloseum na konkrétní čas + alternativy z GetYourGuide a Big Bus jako manual deeplinky se statusem 'unknown' / 'pending user confirmation'"),
            ("10_rozpocet.png",        "Rozpočet — 9 položek pro camper roadtrip v kategoriích (Palivo, Mýtné, Camping, Service, …), cap utilization bar, povinné vs volitelné vs zaplaceno"),
            ("11_export.png",          "Export — 5 formátů: Google Calendar ICS, Google My Maps CSV, Markdown itinerář, Rozpočet CSV, Trip JSON záloha"),
            ("12_dark_mode.png",       "Dark mode — kompletně čitelný v tmavém režimu, italian green akcent, kontrast textu WCAG AAA"),
            ("13_mobil_dnes.png",      "Mobilní 'Dnes' (414×896) — kompaktní topbar, smart view podle data (před cestou / během / po), spodní 6-ikona navigace"),
            ("14_mobil_checklist.png", "Mobilní checklist — 18 položek v 5 kategoriích (Doklady, Elektronika, Balení, Ubytování, Doprava), progress bar, lokální uložení"),
        ],
        "stack": ["React", "TypeScript", "Vite", "Tauri (Windows)", "PWA"],
        "i18n": {
            "cs": {
                "name":  "Italia Travel Planner",
                "lead":  "Cestovní plánovač po Itálii pro lidi co tam jezdí často nebo dlouho. Sestaví itinerář, hlídá vstupenky, kreslí mapu, dělá rozpočet, varuje před ZTL zónami (kde dostaneš pokutu 80–200 € za vjezd autem). Funguje offline, žádné účty, žádné platby přes aplikaci.",
                "what":  "<p><strong>Proč to vzniklo:</strong> cestování po Itálii má vlastní pravidla. Historická centra mají <strong>ZTL zóny</strong> (Zona Traffico Limitato) — když do nich vjedeš autem, dostaneš pokutu 80–200 €. Vstupenky do Vatikánu, Uffizi a Kolosea se kupují měsíc dopředu na konkrétní čas a den, jinak se nedostaneš. Obytné auto má jiné potřeby než osobák — potřebuješ Stellplatzy, area sosta, dump stations. A klasické cestovní appky to neřeší — buď tě nutí mít účet a kupovat všechno přes ně, nebo jsou pro Itálii naprosto slepé.</p>"
                         "<p><strong>Jeden uživatel, všechno lokálně:</strong> aplikace patří mně, běží u mě v počítači, na telefonu jako PWA, nebo jako Windows desktop apka (Tauri). Žádný backend, žádný cloud, žádné API klíče. Plánuje cestu — itinerář, vstupenky, rozpočet, trasu. Skutečné nákupy (letenky, hotely, vstupenky) si potom kupuju sám na oficiálních stránkách — aplikace mi je jen otevře v prohlížeči přes deeplink. Žádná smlouva, žádná provize, žádný vendor lock-in.</p>"
                         "<p><strong>Plánování od nuly:</strong> Zadám novou cestu (název, region, datum, počet osob, rozpočet, styl — městský pobyt / roadtrip / pobřeží / hory / víno & jídlo / camper). Aplikace mi pak nabídne čtyři způsoby dopravy s deeplinky (Kiwi pro letenky, Booking pro auto, Trenitalia pro vlaky). Pro roadtrip má samostatný plánovač s výběrem 10 zemí, autocomplete měst (cca 100 evropských destinací) a stylem trasy (Rychlá / Vyvážená / Zážitková).</p>"
                         "<p><strong>Itinerář a vstupenky:</strong> Pro každý den 3 sekce (Ráno / Odpoledne / Večer) s konkrétními aktivitami a časy, plus tipy na jídlo, poznámky o dopravě, záložní plán pro déšť. Vstupenky se evidují s konkrétním datem, časem a confirmation kódem. Alternativní nabídky z GetYourGuide a Big Bus jsou pouze deeplinky se statusem &bdquo;unknown&ldquo; nebo &bdquo;pending user confirmation&ldquo; — aplikace je <em>nikdy</em> automaticky nepředpokládá jako zaplacené.</p>"
                         "<p><strong>Camper režim:</strong> Unikátní feature, co většina cestovních appek nemá. Vytvořím profil mého obytného auta (rozměry, hmotnost, spotřeba, vybavení). Aplikace pak filtruje stopy podle typu (Stellplatz, Area sosta, Camping, Agriturismo, Service point, Free wild, …) a podle vybavení (voda, elektřina, WC, sprcha, černá voda, …). Varuje když místo nemá dostatečnou výšku/délku pro můj kemper, nebo když je v ZTL zóně. Plus camper-specific rozpočet (palivo + mýtné + camping + service).</p>"
                         "<p><strong>Export do reálných nástrojů:</strong> Itinerář → Google Calendar (ICS), POI → Google My Maps (CSV), rozpočet → Excel, kompletní trip → JSON pro zálohu. Žádný proprietary formát, vše standardní.</p>"
                         "<p><strong>Funguje úplně offline:</strong> Po prvním načtení je aplikace v cache prohlížeče nebo nainstalovaná jako desktop apka (Tauri NSIS installer, 1.4 MB). Když jsem v Itálii a roaming stojí 1 €/den, neplatím za žádný internet — apka mi všechno ukáže lokálně z paměti.</p>",
                "features": [
                    ("Plánování od nuly s deeplinky",      "Nová cesta s rozpočtem a stylem, 4 záložky dopravy s deeplinky na Kiwi / Booking / Trenitalia. Aplikace nákupy nezprostředkovává — otevře oficiální stránku v prohlížeči."),
                    ("Roadtrip plánovač pro 10 zemí",      "Výběr země odjezdu a cíle (CZ/IT/AT/SI/DE/SK/HR/PL/FR/CH), autocomplete měst (~100 destinací), styl trasy, počet zastávek, multi-select zájmů."),
                    ("Itinerář den po dni",                "Ráno / Odpoledne / Večer s časy + jídlo + záložní plán pro déšť. Pro každou cestu samostatně, plně offline."),
                    ("Vstupenky s alternativami",          "Hlavní rezervace (Vatikán, Uffizi, Koloseum) s konkrétním datem + 7 alternativ z GetYourGuide a Big Bus jako manual deeplinky se statusem 'unknown'."),
                    ("Rozpočet s cap utilization",         "12 kategorií (doprava, ubytování, jídlo, vstupenky, parkování, mýto, camping, …), vizuální bar kolik % je zaplaceno, povinné vs volitelné."),
                    ("Mapa POI + Google My Maps export",   "Body zájmu vizualizované barevnými ikonami, export CSV jedním klikem importovatelné do Google My Maps."),
                    ("Camper režim s ZTL warningy",        "Profil obytného auta (rozměry, hmotnost), 10 typů stopů, 11 facility chipů, warning badges když je místo v ZTL zóně nebo malé pro tvůj kemper."),
                    ("Funguje offline, multi-platform",    "Web PWA + Windows desktop (Tauri NSIS, 1.4 MB) + portable web launcher — všechno z jednoho codebase. V Itálii nepotřebuje roaming."),
                ],
                "status": "<strong>Verze 1.0.1 — beta</strong> (červen 2026). 11 exportů (PDF, Word, KML/GPX, checklist, sdílení odkazem…), itinerář s kontrolou konfliktů, zálohy s kontrolním součtem, offline režim, AI asistent. Windows installer + PWA + web launcher. Soukromé pro vlastní cesty — žádné public hosting, žádné účty, žádné platby přes aplikaci.",
            },
            "en": {
                "name":  "Italia Travel Planner",
                "lead":  "Italy trip planner for people who travel there often or long. Builds an itinerary, tracks tickets, draws a map, manages a budget, warns about ZTL zones (where a car drive-in costs 80–200 €). Works offline, no accounts, no payments through the app.",
                "what":  "<p><strong>Why it exists:</strong> Italy travel has its own rules. Historic centers have <strong>ZTL zones</strong> (Zona Traffico Limitato) — drive in by car and you get an 80–200 € fine. Tickets for the Vatican, Uffizi, and Colosseum sell out a month ahead for specific time slots. Motorhomes need different infrastructure than cars — Stellplatzy, area sosta, dump stations. Mainstream travel apps don't handle this — either they force an account and try to sell everything, or they're Italy-blind.</p>"
                         "<p><strong>One user, everything local:</strong> the app is mine, runs on my computer, on my phone as PWA, or as a Windows desktop app (Tauri). No backend, no cloud, no API keys. Plans the trip — itinerary, tickets, budget, route. Actual purchases (flights, hotels, tickets) I make myself on official sites — the app just opens them in the browser via deeplink. No contract, no commission, no vendor lock-in.</p>"
                         "<p><strong>Planning from scratch:</strong> New trip (name, region, dates, party size, budget, style — city / roadtrip / coast / mountains / wine & food / camper). The app offers four transport modes with deeplinks (Kiwi for flights, Booking for car, Trenitalia for trains). For roadtrips there's a dedicated planner with 10 country picker, ~100 city autocomplete, and route style (Fast / Balanced / Experience).</p>"
                         "<p><strong>Itinerary and tickets:</strong> Each day three sections (Morning / Afternoon / Evening) with specific activities and times, plus food tips, transport notes, rain backup plan. Tickets tracked with date, time, confirmation code. Alternatives from GetYourGuide and Big Bus are manual deeplinks with status &bdquo;unknown&ldquo; or &bdquo;pending user confirmation&ldquo; — the app <em>never</em> assumes they're paid.</p>"
                         "<p><strong>Camper mode:</strong> Unique feature most travel apps lack. Create a profile for my motorhome (dimensions, weight, fuel, equipment). The app then filters stops by type (Stellplatz, Area sosta, Camping, Agriturismo, Service point, Free wild, …) and by facility (water, electricity, toilet, shower, black water, …). Warns when a spot doesn't have enough height/length for my camper, or is inside a ZTL zone. Plus camper-specific budget (fuel + tolls + camping + service).</p>"
                         "<p><strong>Export to real tools:</strong> Itinerary → Google Calendar (ICS), POI → Google My Maps (CSV), budget → Excel, full trip → JSON for backup. No proprietary format.</p>"
                         "<p><strong>Fully offline:</strong> After first load the app is in browser cache or installed as desktop (Tauri NSIS installer, 1.4 MB). When I'm in Italy and roaming costs €1/day, I pay zero for internet — app shows everything locally from memory.</p>",
                "features": [
                    ("Planning from scratch with deeplinks", "New trip with budget and style, 4 transport tabs with deeplinks to Kiwi / Booking / Trenitalia. App doesn't broker purchases — opens the official site in the browser."),
                    ("Roadtrip planner for 10 countries",    "Pick origin/destination country, ~100 city autocomplete, route style, stop count, multi-select interests."),
                    ("Day-by-day itinerary",                  "Morning / Afternoon / Evening with times + food + rain backup. Per trip, fully offline."),
                    ("Tickets with alternatives",             "Main reservations (Vatican, Uffizi, Colosseum) with specific date + 7 GetYourGuide / Big Bus alternatives as manual deeplinks, status 'unknown'."),
                    ("Budget with cap utilization",           "12 categories, visual bar of % paid, mandatory vs optional vs paid."),
                    ("POI map + Google My Maps export",       "POIs visualized with color icons, one-click CSV importable to Google My Maps."),
                    ("Camper mode with ZTL warnings",         "Motorhome profile, 10 stop types, 11 facility chips, warnings when spot is in ZTL or too small for your camper."),
                    ("Works offline, multi-platform",         "Web PWA + Windows desktop (Tauri NSIS, 1.4 MB) + portable web launcher from one codebase. No roaming needed in Italy."),
                ],
                "status": "<strong>Version 1.0.1 — beta</strong> (June 2026). 11 exports (PDF, Word, KML/GPX, checklist, share link…), itinerary with conflict checking, checksummed backups, offline mode, AI assistant. Windows installer + PWA + web launcher. Private, for my own trips — no public hosting, no accounts, no payments.",
            },
            "it": {
                "name":  "Italia Travel Planner",
                "lead":  "Pianificatore di viaggi in Italia per chi ci va spesso o a lungo. Costruisce l'itinerario, traccia i biglietti, disegna la mappa, gestisce il budget, avverte sulle ZTL (dove l'auto costa multe 80–200 €). Funziona offline, niente account, niente pagamenti tramite l'app.",
                "what":  "<p><strong>Perché esiste:</strong> viaggiare in Italia ha regole proprie. I centri storici hanno <strong>ZTL</strong> (Zona Traffico Limitato) — entri in auto e prendi multa 80–200 €. Biglietti per Vaticano, Uffizi, Colosseo si comprano un mese prima per orari specifici. I camper hanno bisogno di infrastruttura diversa — Stellplatzy, aree sosta, service point. Le app mainstream non gestiscono questo — o forzano un account e vendono tutto, o sono Italia-blind.</p>"
                         "<p><strong>Un utente, tutto in locale:</strong> l'app è mia, gira sul mio computer, sul telefono come PWA, o come app desktop Windows (Tauri). Niente backend, niente cloud, niente API key. Pianifica il viaggio — itinerario, biglietti, budget, percorso. Gli acquisti veri (voli, hotel, biglietti) li faccio io sui siti ufficiali — l'app li apre nel browser via deeplink. Niente contratto, niente commissione, niente lock-in.</p>"
                         "<p><strong>Pianificazione da zero:</strong> Nuovo viaggio con budget e stile (città / roadtrip / costa / montagna / vino & cibo / camper). L'app offre 4 modalità trasporto con deeplink (Kiwi voli, Booking auto, Trenitalia treni). Per roadtrip c'è un pianificatore con selettore di 10 paesi, autocompletamento ~100 città, stile percorso.</p>"
                         "<p><strong>Itinerario e biglietti:</strong> Per ogni giorno tre sezioni (Mattino / Pomeriggio / Sera) con attività e orari, più consigli cibo, note trasporto, piano B per pioggia. Biglietti tracciati con data, ora, codice. Alternative da GetYourGuide e Big Bus sono deeplink manuali con stato &bdquo;unknown&ldquo; — l'app <em>mai</em> li assume come pagati.</p>"
                         "<p><strong>Modalità camper:</strong> Feature unica che la maggior parte delle app non ha. Profilo del camper (dimensioni, peso, consumo, dotazione). L'app filtra le tappe per tipo (Stellplatz, Area sosta, Camping, Agriturismo, …) e per dotazione (acqua, elettricità, WC, doccia, …). Avverte quando un posto non ha altezza/lunghezza per il camper o è in ZTL. Più budget camper-specifico (carburante + pedaggi + camping + service).</p>"
                         "<p><strong>Export su strumenti reali:</strong> Itinerario → Google Calendar (ICS), POI → Google My Maps (CSV), budget → Excel, viaggio completo → JSON backup. Nessun formato proprietario.</p>"
                         "<p><strong>Completamente offline:</strong> Dopo primo caricamento l'app è in cache o installata come desktop (Tauri NSIS, 1.4 MB). In Italia con roaming 1 €/giorno non pago internet — l'app mostra tutto in locale.</p>",
                "features": [
                    ("Pianificazione con deeplink",   "Nuovo viaggio con budget e stile, 4 tab trasporto con deeplink a Kiwi / Booking / Trenitalia. L'app non fa da broker — apre il sito ufficiale."),
                    ("Pianificatore roadtrip 10 paesi", "Selezione paese origine/destinazione, autocomplete ~100 città, stile percorso, multi-select interessi."),
                    ("Itinerario giorno per giorno",  "Mattino / Pomeriggio / Sera con orari + cibo + piano pioggia. Per viaggio, totalmente offline."),
                    ("Biglietti con alternative",     "Prenotazioni principali (Vaticano, Uffizi, Colosseo) + 7 alternative GetYourGuide / Big Bus come deeplink manuali."),
                    ("Budget con cap utilization",    "12 categorie, barra visuale % pagato, obbligatorio vs opzionale vs pagato."),
                    ("Mappa POI + Google My Maps",    "POI visualizzati con icone colorate, export CSV un click importabile in Google My Maps."),
                    ("Modalità camper con avvisi ZTL", "Profilo camper, 10 tipi di sosta, 11 chip dotazione, avvisi quando il posto è in ZTL o piccolo per il camper."),
                    ("Funziona offline, multi-platform", "Web PWA + Desktop Windows (Tauri NSIS, 1.4 MB) + portable web launcher da un codice. Niente roaming serve in Italia."),
                ],
                "status": "<strong>Versione 1.0.1 — beta</strong> (giugno 2026). 11 export (PDF, Word, KML/GPX, checklist, link di condivisione…), itinerario con controllo conflitti, backup con checksum, modalità offline, assistente AI. Installer Windows + PWA + web launcher. Privata, per i miei viaggi — niente hosting pubblico, account o pagamenti.",
            },
        },
    },
    {
        "slug": "ucetni-kniha",
        "icon": "📒",
        "color": "#4a8fd0",
        "asset_dir": "ucetni-kniha",
        "screens": [
            ("01_hero.png",        "Dashboard — kolik mám teď, kolik chci mít, jak jsem na cestě (ilustrativní náhled)"),
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
            ("01_hero.png",        "Dashboard — přehled portfolia + signál distribuce (BUY/HOLD/SELL, ilustrativní náhled)"),
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
                "status": "Funkční MVP v0.3.0 BETA (červen 2026), 8 kol vývoje, ~3 měsíce aktivního vývoje. Lokální Windows aplikace přes Chrome --app launcher. Soukromá — žádné public hosting. Cíl: rozhodovací podpora pro mě, ne SaaS pro veřejnost.",
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
                "status": "Working MVP v0.3.0 BETA (June 2026), 8 rounds of development, ~3 months active. Local Windows app via Chrome --app launcher. Private — no public hosting. Goal: decision support for myself, not a SaaS for the public.",
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
                "status": "MVP funzionante v0.3.0 BETA (giugno 2026), 8 round di sviluppo, ~3 mesi attivi. App Windows locale via Chrome --app. Privata — niente hosting pubblico. Obiettivo: supporto decisionale per me, non SaaS pubblica.",
            },
        },
    },
    {
        "slug": "krabickova-dieta",
        "icon": "🥗",
        "color": "#2e7d32",
        "asset_dir": "krabickova-dieta",
        "screens": [
            ("01_hero.png",        "Dashboard — denní rozpis 5 jídel, sledování váhy, doporučený kalorický cíl (DEMO data)"),
            ("02_week.png",        "Týdenní jídelníček — 7 dní × 5 jídel, každá krabička s názvem receptu a kcal"),
            ("03_day.png",         "Den v detailu — 5 krabiček s makronutrienty a postupem přípravy"),
            ("04_shopping.png",    "Nákupní seznam — agregovaný z celého týdne, rozdělený do kategorií, export do CSV"),
            ("05_settings.png",    "Nastavení — BMR/TDEE kalkulačka, doporučený kcal cíl podle váhy a aktivity"),
            ("06_rohlik_live.png", "Rohlík košík — preview ceny vs minimum objednávky (objednávku potvrzuje user ručně)"),
            ("07_weight_chart.png", "Vývoj váhy — vlastní SVG sparkline, osobní tracking v localStorage prohlížeče"),
            ("08_analytics.png",   "Analytika — read-only přehled spending, typical order, recipe search"),
        ],
        "stack": ["React", "TypeScript", "Vite", "PWA", "Tailwind"],
        "i18n": {
            "cs": {
                "name":  "Krabičková dieta",
                "lead":  "Vlastní plánovač jídelníčku — místo přihlašování do dietních aplikací co tě sledují má svojí aplikaci co běží jen u mě v prohlížeči. Sestaví si týdenní plán krabiček podle mého kalorického cíle, spočítá nákupní seznam, hlídá makro. Bez účtu, bez cloudu.",
                "what":  "<p><strong>Proč vznikl:</strong> zkoušel jsem několik dietních aplikací (MyFitnessPal, Yazio, Lifesum…) a všechny mě naštvaly. Buď chtěly účet a posílaly mi reklamy, nebo neuměly česká jídla, nebo tlačily konkrétní výživovou filozofii. Tahle aplikace běží <strong>jen u mě v prohlížeči</strong> — profil žije v localStorage (paměti prohlížeče), žádný server nevidí moji váhu, kalorie, ani co dnes jím.</p>"
                         "<p><strong>Jak funguje:</strong> Zadám svoji výšku, váhu, věk, aktivitu. Aplikace spočítá kolik kalorií denně potřebuju (vzorec Mifflin-St Jeor pro klidový metabolismus + multiplier podle aktivity). Pokud chci zhubnout, doporučí asymetrický deficit (lehčí o pár stovek kcal). Pokud nabrat svaly, navíc se snaží vybírat recepty s vyšším protein ratio.</p>"
                         "<p><strong>Týdenní plán krabiček:</strong> Aplikace projde databázi cca 21 receptů a sestaví 7 dní × 5 jídel (snídaně, svačina, oběd, svačina, večeře) tak, aby denní suma kcal padla do ±10 % cíle. Pak vygeneruje nákupní seznam — sečte všechny ingredience za týden a rozdělí do kategorií (masa, mléčné, zelenina, …). Export do CSV nebo tisku.</p>"
                         "<p><strong>Volitelně Rohlík:</strong> Pokud mám zákazníka u Rohlíka, můžu si nechat agentem (Claude) připravit návrh košíku z týdenního plánu, vložit JSON do Nastavení a aplikace zobrazí cenu vs minimum objednávky vs cenu doručení. <em>Objednávku ale vždy potvrzuji ručně v Rohlík UI</em> — aplikace fyzicky neumí objednat ani zaplatit (defense-in-depth, 5 vrstev ochrany, 14 PII blacklist pravidel).</p>"
                         "<p><strong>PWA = funguje offline:</strong> Po prvním otevření se uloží do prohlížeče a funguje i bez internetu. Můžu si ji nainstalovat jako desktopovou aplikaci na Windows přes Edge. Žádné aktualizace přes app store, žádné notifikace, žádná telemetrie.</p>",
                "features": [
                    ("Auto-generovaný týdenní plán",      "Combo search algoritmus pro 7×5 jídel, denní kcal v ±10 % cíle. Penalizace opakování receptů pro pestrost."),
                    ("BMR/TDEE kalkulačka",               "Mifflin-St Jeor vzorec pro klidový metabolismus + activity multiplier. Asymetrický deficit/surplus podle týdenní změny váhy."),
                    ("Doporučený cíl + banner",           "Když se podle metrik posune doporučený kcal cíl, aplikace nabídne &bdquo;Použít doporučený&ldquo; (nikdy tichá změna bez vědomí uživatele)."),
                    ("Tracking váhy",                     "Vlastní SVG graf bez externí knihovny, historie v localStorage prohlížeče. Žádné zdravotnické claims."),
                    ("Optimizer pro hubnutí/nabírání",   "Pokud chceš zhubnout, vybírá recepty s vyšším protein ratio. Pokud nabrat svaly, totéž + těsnější dodržení kcal targetu."),
                    ("Rohlík integrace (volitelná)",      "Agent připraví návrh košíku jako JSON, ty vidíš cenu vs minimum vs doručení. Objednávku potvrzuješ vždy ručně v Rohlíku."),
                    ("Nákupní seznam s exportem",         "Z týdenního plánu agreguje ingredience, rozdělí do kategorií, export CSV nebo tisk."),
                    ("PWA + offline",                     "Funguje bez internetu po prvním načtení. Nainstalovatelná jako desktop app přes Edge / Chrome."),
                ],
                "status": "Funkční, Phase 4C + 5A + 5B + 5C + 6 (květen 2026). Lokální PWA, 21 receptů, 157 unit testů, 8 architektonických ADR. Bez cloudu, bez účtu, bez telemetrie.",
            },
            "en": {
                "name":  "Meal Planner",
                "lead":  "My own meal planner — instead of signing up to diet apps that track me, I have my own that runs only in my browser. Generates a weekly meal-box plan based on my calorie target, computes a shopping list, tracks macros. No account, no cloud.",
                "what":  "<p><strong>Why it exists:</strong> I tried several mainstream diet apps (MyFitnessPal, Yazio, Lifesum…) and they all annoyed me. Either they wanted an account and pushed ads, or didn't know Czech meals, or forced a specific nutrition ideology. This one runs <strong>only in my browser</strong> — profile lives in localStorage, no server sees my weight, calories, or what I'm eating today.</p>"
                         "<p><strong>How it works:</strong> I enter my height, weight, age, activity. The app computes my daily calorie need (Mifflin-St Jeor for resting metabolism + activity multiplier). For weight loss it recommends an asymmetric deficit. For muscle gain it also prioritizes higher-protein recipes.</p>"
                         "<p><strong>Weekly meal-box plan:</strong> The app searches a database of ~21 recipes and builds 7 days × 5 meals (breakfast, snack, lunch, snack, dinner) so the daily kcal lands within ±10% of target. Then it generates a shopping list — sums all ingredients for the week and groups them by category. Export to CSV or print.</p>"
                         "<p><strong>Optional Rohlík:</strong> If I'm a Rohlík customer, I can have an agent (Claude) prepare a cart proposal from the weekly plan, paste JSON into Settings and see the cart preview with totals vs minimum vs delivery price. <em>The order is always confirmed manually in Rohlík UI</em> — the app physically cannot order or pay (5-layer defense-in-depth).</p>"
                         "<p><strong>PWA = works offline:</strong> After first load it caches and works without internet. Installable as a desktop app on Windows via Edge. No app store updates, no notifications, no telemetry.</p>",
                "features": [
                    ("Auto-generated weekly plan",     "Combo search for 7×5 meals, daily kcal within ±10% target. Repeat-recipe penalty for variety."),
                    ("BMR/TDEE calculator",            "Mifflin-St Jeor formula + activity multiplier. Asymmetric deficit/surplus by weekly weight change."),
                    ("Recommended target banner",      "When metrics shift the recommended kcal, app offers &bdquo;Use recommended&ldquo; (never a silent change)."),
                    ("Weight tracking",                "Own SVG chart without external library, history in localStorage. No medical claims."),
                    ("Loss/gain optimizer",            "Weight loss → prefers higher-protein recipes. Muscle gain → same plus tighter kcal target."),
                    ("Rohlík integration (optional)",  "Agent prepares cart JSON, you see total vs minimum vs delivery price. Order always confirmed manually."),
                    ("Shopping list with export",      "Aggregates ingredients from weekly plan, groups by category, CSV or print."),
                    ("PWA + offline",                  "Works without internet after first load. Installable as desktop app via Edge/Chrome."),
                ],
                "status": "Working, Phase 4C + 5A + 5B + 5C + 6 (May 2026). Local PWA, 21 recipes, 157 unit tests, 8 architecture ADRs. No cloud, no account, no telemetry.",
            },
            "it": {
                "name":  "Meal Planner",
                "lead":  "Pianificatore pasti mio — invece di iscrivermi ad app dietetiche che mi tracciano, ho la mia che gira solo nel browser. Genera piano settimanale di porzioni secondo l'obiettivo calorico, calcola lista spesa, traccia macro. Niente account, niente cloud.",
                "what":  "<p><strong>Perché esiste:</strong> ho provato diverse app dietetiche mainstream (MyFitnessPal, Yazio, Lifesum…) e tutte mi hanno infastidito. O volevano un account e mostravano pubblicità, o non conoscevano piatti cechi, o forzavano un'ideologia nutrizionale. Questa gira <strong>solo nel browser</strong> — il profilo vive in localStorage, nessun server vede peso, calorie, o cosa mangio oggi.</p>"
                         "<p><strong>Come funziona:</strong> inserisco altezza, peso, età, attività. L'app calcola il fabbisogno calorico (Mifflin-St Jeor + moltiplicatore attività). Per perdere peso raccomanda un deficit asimmetrico. Per massa muscolare privilegia ricette ad alta proteina.</p>"
                         "<p><strong>Piano settimanale di porzioni:</strong> Cerca tra ~21 ricette e costruisce 7 giorni × 5 pasti così che le kcal giornaliere stiano entro ±10% dell'obiettivo. Genera la lista della spesa — somma tutti gli ingredienti per la settimana, divide per categorie. Esporta in CSV o stampa.</p>"
                         "<p><strong>Rohlík opzionale:</strong> Se sono cliente Rohlík, un agente può preparare proposta carrello dal piano settimanale, incollo JSON in Impostazioni e vedo prezzo vs minimo vs spedizione. <em>L'ordine si conferma sempre manualmente in Rohlík UI</em> — l'app non può fisicamente ordinare o pagare (5 strati di difesa).</p>"
                         "<p><strong>PWA = funziona offline:</strong> Dopo il primo caricamento è in cache e funziona senza internet. Installabile come app desktop su Windows via Edge. Niente aggiornamenti app store, niente notifiche, niente telemetria.</p>",
                "features": [
                    ("Piano settimanale auto-generato",   "Combo search per 7×5 pasti, kcal giornaliere entro ±10% obiettivo. Penalità ripetizione per varietà."),
                    ("Calcolatore BMR/TDEE",              "Formula Mifflin-St Jeor + moltiplicatore attività. Deficit/surplus asimmetrico per cambio peso."),
                    ("Banner obiettivo raccomandato",     "Quando metriche cambiano l'obiettivo kcal, app propone &bdquo;Usa raccomandato&ldquo; (mai cambio silenzioso)."),
                    ("Tracking peso",                     "Grafico SVG proprio senza libreria esterna, storia in localStorage. Niente claim medici."),
                    ("Ottimizzatore perdita/massa",       "Perdita → ricette ad alta proteina. Massa → stesso + obiettivo kcal stretto."),
                    ("Integrazione Rohlík (opzionale)",   "Agente prepara JSON carrello, vedi totale vs minimo vs spedizione. Ordine sempre manuale."),
                    ("Lista spesa con esportazione",     "Aggrega ingredienti dal piano settimanale, divide per categoria, CSV o stampa."),
                    ("PWA + offline",                     "Funziona senza internet dopo primo caricamento. Installabile come app desktop via Edge/Chrome."),
                ],
                "status": "Funzionante, Phase 4C + 5A + 5B + 5C + 6 (maggio 2026). PWA locale, 21 ricette, 157 test unitari, 8 ADR. Niente cloud, niente account, niente telemetria.",
            },
        },
    },
    {
        "slug": "energy-dashboard",
        "icon": "⚡",
        "color": "#7cd6ff",
        "asset_dir": "energy-dashboard",
        "screens": [
            ("01_overview.png", "Hlavní pohled — kolik dům teď bere, dnes spotřeboval, kolik to stojí (data jsou DEMO snapshot)"),
        ],
        "stack": ["HTML", "Vanilla JS", "Python proxy", "HA REST"],
        "i18n": {
            "cs": {
                "name":  "Energy Dashboard (PC)",
                "lead":  "Jednoduché okno na monitoru, kde vidím v reálném čase kolik dům spotřebovává proudu, co to stojí dnes, a co odhaduji za celý měsíc. Nemusím nikam klikat — visí to celý den otevřené.",
                "what":  "<p><strong>Proč to existuje:</strong> mít elektřinu pod kontrolou znamená vědět co kolik bere. Aplikace mi řekne kolik <em>teď</em> beru (v W), kolik <em>dnes</em> (v kWh), kolik to <em>dnes stojí</em>, kolik <em>očekávám za měsíc</em>, a který spotřebič právě teď tahá nejvíc (typicky lednice, vařič, sušička).</p>"
                         "<p><strong>Jak to funguje:</strong> doma mám malý server (Raspberry Pi s Home Assistant), který sbírá data ze 3-fázového měřiče (Shelly Pro 3EM) a z jednotlivých chytrých zásuvek. Aplikace se ho ptá každých 30 sekund a překresluje hodnoty. Na PC to běží jako samostatné okno v Edge — žádný taskbar, žádné menu, prostě dashboard.</p>"
                         "<p><strong>Tarif NT/VT visible:</strong> mám distribuční tarif D57D — nízký tarif (NT, levný proud) v určitých hodinách, vysoký tarif (VT) zbytek. Velký badge nahoře jasně ukazuje který je teď a podle toho můžu rozhodnout jestli si pustit pračku.</p>"
                         "<p><strong>Když je RPi nedostupný</strong> (např. internet doma vypadne), aplikace zobrazí poslední uložená data + výrazné upozornění &bdquo;cached-stale&ldquo;. Nikdy nezobrazuje falešná data jako kdyby byla čerstvá.</p>",
                "features": [
                    ("Aktuální spotřeba v reálném čase",  "Co teď dům bere (W), rozpis po 3 fázích, top spotřebič právě teď. Updatuje se každých 30 sekund."),
                    ("Dnes a měsíc v Kč",                 "Kolik kWh dnes, kolik to stojí (s POZE i bez), odhad za celý měsíc na základě dosavadního průměru."),
                    ("Tarif NT/VT badge",                 "Vizuální označení který tarif je teď aktivní — pomáhá rozhodnout kdy zapnout energeticky náročné spotřebiče."),
                    ("Top spotřebiče",                    "Která chytrá zásuvka právě teď tahá nejvíc — užitečné když člověk něco zapomene zapnutého."),
                    ("Topení & kotel",                    "Stav režimu topení, doba běhu kotle za dnešek, jestli souhlasí stav s požadavkem."),
                    ("Offline fallback s upozorněním",    "Když je server doma nedostupný, ukáže poslední data + jasnou hlášku že nejsou čerstvá. Nelze přehlédnout."),
                ],
                "status": "Denně používané na PC. Verze v1.0.1 (květen 2026). Spouští se jednoklikem ze zástupce na ploše (Edge app-mode).",
            },
            "en": {
                "name":  "Energy Dashboard (PC)",
                "lead":  "A simple monitor window where I see in real-time how much power the house consumes, today's cost, and the estimate for the whole month. No clicking — it's open all day.",
                "what":  "<p><strong>Why it exists:</strong> to know what consumes what. The app shows <em>current</em> draw (W), <em>today's</em> usage (kWh), <em>today's cost</em>, <em>monthly estimate</em>, and which appliance is pulling the most right now (typically fridge, stove, dryer).</p>"
                         "<p><strong>How it works:</strong> at home there's a small server (Raspberry Pi running Home Assistant) collecting data from a 3-phase meter (Shelly Pro 3EM) and individual smart plugs. The app polls it every 30 seconds and redraws. On the PC it runs as a standalone Edge window — no taskbar, no menu, just a dashboard.</p>"
                         "<p><strong>NT/VT tariff visible:</strong> Czech distribution tariff D57D — low tariff (NT, cheap power) at specific hours, high (VT) the rest. A big top badge clearly shows which is active so I can decide whether to run the washer.</p>"
                         "<p><strong>When RPi is unreachable</strong> (e.g. home internet drops), the app shows the last saved data with a clear &bdquo;cached-stale&ldquo; warning. Never shows stale data as if it were live.</p>",
                "features": [
                    ("Real-time consumption",        "Current draw (W), 3-phase split, top consumer right now. Updates every 30 s."),
                    ("Today and month in CZK",       "kWh today, cost (with and without POZE fee), monthly estimate based on running average."),
                    ("NT/VT tariff badge",           "Visual flag of which tariff is active — helps decide when to run heavy appliances."),
                    ("Top consumers",                "Which smart plug is currently pulling the most — useful when something was left on."),
                    ("Heating & boiler",             "Heating mode, today's boiler runtime, whether state matches the request."),
                    ("Offline fallback with notice", "When server is unreachable, shows last data with clear stale warning. Can't be missed."),
                ],
                "status": "Used daily on PC. Version v1.0.1 (May 2026). One-click launch from desktop shortcut (Edge app-mode).",
            },
            "it": {
                "name":  "Energy Dashboard (PC)",
                "lead":  "Una finestra semplice sul monitor dove vedo in tempo reale quanto consuma la casa, quanto costa oggi e la stima per il mese. Niente click — sta aperta tutto il giorno.",
                "what":  "<p><strong>Perché esiste:</strong> sapere cosa consuma. L'app mostra il consumo <em>attuale</em> (W), il <em>giornaliero</em> (kWh), il <em>costo di oggi</em>, la <em>stima mensile</em>, e quale elettrodomestico sta tirando di più adesso.</p>"
                         "<p><strong>Come funziona:</strong> a casa c'è un piccolo server (Raspberry Pi con Home Assistant) che raccoglie dati da un contatore trifase (Shelly Pro 3EM) e dalle prese smart. L'app lo interroga ogni 30 secondi. Sul PC gira come finestra Edge dedicata.</p>"
                         "<p><strong>Tariffa NT/VT visibile:</strong> tariffa ceca D57D — bassa in certe ore, alta nel resto. Badge in alto mostra quale è attiva.</p>"
                         "<p><strong>Quando il RPi è irraggiungibile</strong> mostra l'ultimo dato salvato con avviso chiaro &bdquo;cached-stale&ldquo;. Mai dati vecchi mascherati da freschi.</p>",
                "features": [
                    ("Consumo in tempo reale",       "W attuali, split su 3 fasi, top consumer ora. Update ogni 30 s."),
                    ("Oggi e mese in CZK",           "kWh oggi, costo (con e senza POZE), stima mensile."),
                    ("Badge tariffa NT/VT",          "Indica quale tariffa è attiva — utile per decidere quando avviare elettrodomestici pesanti."),
                    ("Top consumer",                 "Quale presa smart tira di più ora — utile quando si è dimenticato qualcosa acceso."),
                    ("Riscaldamento e caldaia",     "Modalità, runtime caldaia oggi, stato vs richiesta."),
                    ("Fallback offline con avviso", "Quando il server è irraggiungibile, mostra ultimo dato con avviso chiaro."),
                ],
                "status": "Uso quotidiano sul PC. Versione v1.0.1 (maggio 2026). Avvio one-click da shortcut desktop (Edge app-mode).",
            },
        },
    },
    {
        "slug": "rpi-kiosk",
        "icon": "🖥️",
        "color": "#9cf2a6",
        "asset_dir": "rpi-kiosk",
        "screens": [
            ("01_audio.png",    "Audio a scény — spuštění rádia, scénář pro relax / kino / vaření / večeři"),
            ("02_energy.png",   "Energie a topení — runtime kotle dnes, stav TRV zón, aktuální odběr"),
            ("03_scenes.png",   "Scény (styl Loxone) — jeden velký dotyk a celá místnost se přestaví"),
            ("04_settings.png", "Nastavení — rychlý přehled provozu domu bez nutnosti otevřít telefon"),
        ],
        "stack": ["HTML", "Vanilla JS", "Raspberry Pi 4", "Chromium kiosk"],
        "i18n": {
            "cs": {
                "name":  "Domácí panel na zdi",
                "lead":  "Malý dotykový displej na zdi v chodbě, kde ovládám celý byt — světla, audio, topení, scény. Žádné odemykání telefonu, žádné hledání aplikace. Stačí přijít, jeden dotyk a hotovo.",
                "what":  "<p><strong>Proč to existuje:</strong> ovládání chytré domácnosti přes telefon je rychlé jen vzhledem k tomu, jak je pomalé. Než člověk odemkne telefon, najde appku, klikne na správnou ikonu, scrolluje — to si může rovnou jít rozsvítit ručně. <strong>Wall panel řeší přesně tohle.</strong> Je vždy zapnutý, vždy připravený, na první obrazovce má všechno důležité.</p>"
                         "<p><strong>Hardware:</strong> Raspberry Pi 4 (malý počítač velikosti krabičky od žvýkaček) + 7&quot; dotykový displej, přišroubovaný na zdi v chodbě. Stojí dohromady asi 2500 Kč. Žije v Chromium browseru spuštěném v &bdquo;kiosk mode&ldquo; — žádný systém, žádná nabídka, jen plné okno aplikace.</p>"
                         "<p><strong>Co umí:</strong> ovládat všechna světla, spustit/zastavit rádio, přepnout scénu (relax / kino / vaření / večeře / příchod / odchod), upravit topení, vidět co je v ledničce (ne fakt — ale vidět co dům spotřebovává v reálu, kdo je doma, kdo spí, kde se zrovna pohybuje motion senzor).</p>"
                         "<p><strong>Scény ve stylu Loxone:</strong> velké dlaždice, palcem se zmáčkne &bdquo;Kino&ldquo; a celý byt se přestaví — světla na 30 %, hudba se ztiší, roleta zaslepí ulici, topení o stupeň víc. Jeden dotyk místo deseti.</p>",
                "features": [
                    ("Dotykový displej v chodbě",     "Raspberry Pi 4 + 7&quot; touch displej na zdi. Vždy zapnutý, vždy připravený."),
                    ("Scény jedním palcem",           "Relax, Kino, Vaření, Večeře, Romantika, Práce, Příchod, Odchod — každá scéna nastaví všechno najednou."),
                    ("Ovládání světel",               "Všechny místnosti, dim, barva, scény. Žádné hledání v telefonu."),
                    ("Audio z rádia",                 "Spuštění/zastavení internetových rádií, volba reproduktoru, hlasitost."),
                    ("Topení a energie",              "Runtime kotle, TRV zóny, aktuální odběr, který spotřebič tahá."),
                    ("Bez telefonu, bez login",       "Nemusí se nikdo přihlašovat, nemusí se nic hledat. Otevři dveře — panel ti to ukáže."),
                ],
                "status": "Běží 24/7 na Raspberry Pi 4 v chodbě. Auto-restart při výpadku proudu. Cca rok bez problémů.",
            },
            "en": {
                "name":  "Home wall panel",
                "lead":  "A small touchscreen on the hallway wall where I control the whole flat — lights, audio, heating, scenes. No phone unlock, no app hunting. Walk up, one touch, done.",
                "what":  "<p><strong>Why it exists:</strong> phone control of a smart home is fast only relative to how slow it is. By the time you unlock the phone, find the app, tap the right icon, scroll — you could've just turned the lights on by hand. <strong>A wall panel solves this exactly.</strong> Always on, always ready, everything important on the first screen.</p>"
                         "<p><strong>Hardware:</strong> Raspberry Pi 4 (small computer the size of a deck of cards) + 7&quot; touch display, screwed to the hallway wall. About €100 total. Lives in a Chromium browser launched in &bdquo;kiosk mode&ldquo; — no OS UI, no menu, just the full-window app.</p>"
                         "<p><strong>What it does:</strong> control all lights, start/stop radio, switch scene (relax / cinema / cooking / dinner / arriving / leaving), adjust heating, see what the house is consuming in real time, who's home, who's asleep, where motion was last detected.</p>"
                         "<p><strong>Scenes Loxone-style:</strong> big tiles, tap &bdquo;Cinema&ldquo; with a thumb and the whole flat reconfigures — lights to 30%, music quietens, blind blocks the street, heating up one degree. One touch instead of ten.</p>",
                "features": [
                    ("Touchscreen in hallway",      "Raspberry Pi 4 + 7&quot; touch on wall. Always on, always ready."),
                    ("Scenes with one thumb",       "Relax, Cinema, Cooking, Dinner, Romance, Work, Arrive, Leave — one tap configures everything."),
                    ("Light control",               "All rooms, dim, color, scenes. No phone hunting."),
                    ("Radio audio",                 "Start/stop internet radios, choose speaker, volume."),
                    ("Heating & energy",            "Boiler runtime, TRV zones, current draw, top consumer."),
                    ("No phone, no login",          "No sign-in needed, nothing to search for. Open the door — panel shows it."),
                ],
                "status": "Runs 24/7 on Raspberry Pi 4 in the hallway. Auto-restart on power loss. About a year without issues.",
            },
            "it": {
                "name":  "Pannello a muro",
                "lead":  "Un piccolo touchscreen sul muro del corridoio dove controllo tutto l'appartamento — luci, audio, riscaldamento, scene. Niente sblocco telefono, niente caccia all'app. Passi, un tocco, fatto.",
                "what":  "<p><strong>Perché esiste:</strong> il controllo via telefono è veloce solo in relativo. Tra sblocco, ricerca app, tap, scroll — si fa prima a accendere a mano. <strong>Il pannello a muro risolve esattamente questo.</strong> Sempre acceso, sempre pronto, tutto sulla prima schermata.</p>"
                         "<p><strong>Hardware:</strong> Raspberry Pi 4 + display touch 7&quot;, avvitato al muro. Circa 100 €. Gira in Chromium &bdquo;kiosk mode&ldquo;.</p>"
                         "<p><strong>Cosa fa:</strong> controllo luci, avvio radio, scene (relax / cinema / cucina / cena / arrivo / uscita), riscaldamento, vede chi è in casa, chi dorme, dove c'è movimento.</p>"
                         "<p><strong>Scene stile Loxone:</strong> mattonelle grandi, premi &bdquo;Cinema&ldquo; e tutto si riconfigura.</p>",
                "features": [
                    ("Touchscreen nel corridoio",  "Raspberry Pi 4 + touch 7&quot; a muro. Sempre acceso."),
                    ("Scene con un pollice",       "Relax, Cinema, Cucina, Cena, Romanza, Lavoro, Arrivo, Uscita — un tap configura tutto."),
                    ("Controllo luci",             "Tutte le stanze, dim, colore, scene."),
                    ("Audio radio",                "Avvio/stop radio, scelta altoparlante, volume."),
                    ("Riscaldamento e energia",    "Runtime caldaia, zone TRV, consumo attuale."),
                    ("No telefono, no login",      "Niente accesso. Apri la porta — il pannello mostra."),
                ],
                "status": "Gira 24/7 su Raspberry Pi 4 nel corridoio. Auto-restart su mancanza corrente. Circa un anno senza problemi.",
            },
        },
    },
    {
        "slug": "ridic-turnusy-mzdy",
        "wip": True,                  # hub badge Ve vyvoji i kdyz ma demo nahledy
        "screens_langs": ["cs"],      # zivy stav: demo galerie jen na CS strance
        "screens_h2": {"cs": "Náhledy (ukázková data)"},
        "screens_note": {"cs": "⚠️ Všechny náhledy ukazují <strong>demo data</strong> — žádná skutečná výplata, směny ani osobní údaje. Skutečné screenshoty budou doplněny po veřejném demo režimu aplikace."},
        "icon": "🚌",
        "color": "#e8a317",
        "asset_dir": "ridic-turnusy-mzdy",
        "screens": [
            ("img/budline-demo/budline-demo-dashboard.png", "Přehled — měsíční souhrn (demo data)", "BudLine — Přehled (ukázková demo data, žádná skutečná výplata)"),
            ("img/budline-demo/budline-demo-kontrola-vyplaty.png", "Kontrola výplat — spočítané vs. vyplacené (demo data)", "BudLine — Kontrola výplat (ukázková demo data)"),
            ("img/budline-demo/budline-demo-porovnani-pasek.png", "Porovnání pásek (demo data)", "BudLine — Porovnání pásek (ukázková demo data)"),
            ("img/budline-demo/budline-demo-nova-smena.png", "Nová směna (demo data)", "BudLine — Nová směna (ukázková demo data)"),
            ("img/budline-demo/budline-demo-vlastni-paska.png", "Vlastní páska (demo data)", "BudLine — Vlastní páska (ukázková demo data)"),
            ("img/budline-demo/budline-demo-legislativa-aetr.png", "Legislativa / AETR — kontrolní pomůcka (demo data)", "BudLine — Legislativa / AETR (ukázková demo data)"),
            ("img/budline-demo/budline-demo-dane.png", "Daně / náhrady (demo data)", "BudLine — Daně a náhrady (ukázková demo data)"),
            ("img/budline-demo/budline-demo-ridici.png", "Řidiči — ukázkový profil (demo data)", "BudLine — Řidiči (ukázkový demo profil)"),
            ("img/budline-demo/budline-demo-pruvodce.png", "Průvodce prvním spuštěním (demo data)", "BudLine — Průvodce prvním spuštěním (ukázková demo data)"),
            ("img/budline-demo/budline-demo-nastaveni.png", "Nastavení (demo data)", "BudLine — Nastavení (ukázková demo data)"),
        ],  # ještě nejsou — aplikace ve vývoji
        "stack": ["Python", "Excel / XLSX parser", "PDF parser (turnusy)", "Lokální Windows app"],
        "i18n": {
            "cs": {
                "name":  "Práce řidiče — turnusy a mzdy",
                "lead":  "Pracovní aplikace pro řidiče autobusu — automatické zpracování turnusů (rozpisů směn) a výpočet měsíční mzdy podle skutečně odjetých hodin, příplatků a kategorií. Ve vývoji.",
                "what":  "<p><strong>Proč vzniká:</strong> každý měsíc dostávám rozpis turnusů (kdy a kde mám jet) a výplatní pásku. Ručně si počítám jestli sedí hodiny, příplatky za noční, víkend, svátky, příplatky za přesčas, stravenky. Excel tabulka by stačila, ale chci to mít automatické — nahraju PDF turnusu, aplikace mi vyplivne kolik to vyjde a kde se případně rozchází s výplatou.</p>"
                         "<p><strong>Co bude umět:</strong> načte PDF rozpis turnusů od regionálního dopravce (parsuje jednotlivé směny — kdy začátek, kdy konec, který spoj), spočítá pracovní hodiny + přestávky + příplatky (noční 22-6, víkend, svátky, přesčas přes základní úvazek). Pak importuje výplatní pásku (XLSX/PDF) a porovná: aplikace řekne &bdquo;za tento měsíc očekávám X Kč hrubého&ldquo;, páska říká Y Kč — pokud se to liší, vyhodí seznam položek na ověření s mistrem.</p>"
                         "<p><strong>Stav:</strong> Ve vývoji. Plán Phase 1 = PDF parser turnusů, Phase 2 = mzdová kalkulačka, Phase 3 = porovnání s výplatou, Phase 4 = UI dashboard. Bez cloudu, bez účtu — všechno lokálně.</p>",
                "features": [
                    ("Import PDF turnusu",         "Načte měsíční rozpis směn z PDF od regionálního dopravce, rozparsuje jednotlivé spoje, časy a místa."),
                    ("Výpočet hodin a příplatků",  "Pracovní hodiny + přestávky + noční (22-6) + víkend + svátky + přesčas přes základní úvazek."),
                    ("Porovnání s výplatou",       "Import výplatní pásky a křížová kontrola: očekávané vs reálné Kč hrubého. Rozdíly vyhodí jako seznam k ověření."),
                    ("Měsíční přehled",            "Kolik odjeto hodin, kolik příplatků, kolik stravenek, kolik dovolené zbývá."),
                    ("Lokální, bez cloudu",        "Žádný účet, žádné API. Výplata a turnusy zůstávají u mě v PC."),
                ],
                "status": "<strong>Ve vývoji.</strong> Phase 1 (PDF parser) skeleton, Phase 2-4 plánované. Žádné public hosting plánované — privátní pomůcka pro vlastní mzdové sebekontrolu.",
            },
            "en": {
                "name":  "Driver work — shifts & salary",
                "lead":  "Work app for a bus driver — automatic parsing of shift schedules and computing monthly salary from actually-driven hours, bonuses and categories. In development.",
                "what":  "<p><strong>Why it is being built:</strong> every month I get a shift schedule (when and where to drive) and a payslip. I manually verify whether the hours match, bonuses for night, weekend, holidays, overtime, meal vouchers. An Excel sheet would do, but I want it automatic — drop a shift-schedule PDF in, the app spits out what to expect and where it differs from payroll.</p>"
                         "<p><strong>What it will do:</strong> read shift-schedule PDF from the regional carrier (parse each shift — start, end, route), compute work hours + breaks + bonuses (night 22-6, weekend, holidays, overtime over the base contract). Then import the payslip (XLSX/PDF) and compare: app says &bdquo;for this month I expect X CZK gross&ldquo;, payslip says Y CZK — if they differ, output the line items to verify with the supervisor.</p>"
                         "<p><strong>Status:</strong> In development. Plan: Phase 1 = PDF shift parser, Phase 2 = salary calculator, Phase 3 = payslip comparison, Phase 4 = UI dashboard. No cloud, no account — everything local.</p>",
                "features": [
                    ("PDF shift import",          "Reads the monthly regional-carrier schedule PDF, parses individual runs, times and locations."),
                    ("Hours & bonus computation", "Work hours + breaks + night (22-6) + weekend + holidays + overtime over base contract."),
                    ("Payslip cross-check",       "Imports payslip and cross-verifies: expected vs actual gross CZK. Diffs output as a verification list."),
                    ("Monthly overview",          "Hours driven, bonuses, meal vouchers, vacation days left."),
                    ("Local, no cloud",           "No account, no API. Payslip and schedules stay on my PC."),
                ],
                "status": "<strong>In development.</strong> Phase 1 (PDF parser) skeleton, Phase 2-4 planned. No public hosting planned — private payroll self-check tool.",
            },
            "it": {
                "name":  "Lavoro autista — turni e stipendio",
                "lead":  "App di lavoro per un autista di autobus — parsing automatico dei turni e calcolo dello stipendio mensile dalle ore effettivamente guidate, indennità e categorie. In sviluppo.",
                "what":  "<p><strong>Perché nasce:</strong> ogni mese ricevo un piano turni (quando e dove guidare) e una busta paga. Verifico a mano se le ore tornano, indennità per notte, weekend, festivi, straordinario, buoni pasto. Un Excel basterebbe, ma voglio l&rsquo;automatico — trascino il PDF dei turni, l&rsquo;app dice cosa aspettarsi e dove diverge dalla busta.</p>"
                         "<p><strong>Cosa farà:</strong> legge il PDF turni del vettore regionale (parsa ogni turno — inizio, fine, linea), calcola ore + pause + indennità (notte 22-6, weekend, festivi, straordinario). Poi importa la busta paga (XLSX/PDF) e confronta: l&rsquo;app dice &bdquo;questo mese aspetto X CZK lordo&ldquo;, la busta dice Y CZK — se diversi, lista voci da verificare con il caporeparto.</p>"
                         "<p><strong>Stato:</strong> In sviluppo. Piano: Phase 1 = PDF parser turni, Phase 2 = calcolatore stipendio, Phase 3 = confronto busta, Phase 4 = UI dashboard. Niente cloud, niente account — tutto in locale.</p>",
                "features": [
                    ("Import PDF turni",          "Legge il piano mensile PDF del vettore regionale, parsa singoli turni, orari e località."),
                    ("Calcolo ore e indennità",  "Ore + pause + notte (22-6) + weekend + festivi + straordinario oltre contratto base."),
                    ("Confronto con busta paga", "Importa busta e verifica: lordo atteso vs reale CZK. Differenze come lista da verificare."),
                    ("Riepilogo mensile",        "Ore guidate, indennità, buoni pasto, giorni ferie rimanenti."),
                    ("Locale, niente cloud",     "Niente account, niente API. Busta e turni restano sul PC."),
                ],
                "status": "<strong>In sviluppo.</strong> Phase 1 (PDF parser) skeleton, Phase 2-4 pianificate. Nessun hosting pubblico previsto — strumento privato di auto-verifica stipendio.",
            },
        },
    },
]


# ────────────────────────────────────────────────────────────
# Builders
# ────────────────────────────────────────────────────────────
APPS.append({
    "slug": "tenispark",
    "icon": "🎾",
    "color": "#b04a24",
    "hub_only": True,   # detail tenispark.html je udrzovany rucne (galerie + download)
    "hub_langs": ["cs"],  # zivy stav: karta jen na CS hubu (EN/IT maji tenispark v downloads + detailu)
    "hub_badge": {"cs": "Soukromá beta", "en": "Private beta", "it": "Beta privata"},
    "screens": [],
    "stack": [],
    "i18n": {
        "cs": {"name": "TenisPark", "lead": "Jedna aplikace pro malý tenisový areál — rezervace kurtů bez kolizí, kiosek se skladem a sešitem dlužníků, denní uzávěrka a domácí rozpočet. Všechno lokálně, bez cloudu."},
        "en": {"name": "TenisPark", "lead": "One app for a whole small tennis facility: home budget, court bookings and a snack kiosk. Instead of three notebooks and a calculator — everything in one place, on the computer, offline."},
        "it": {"name": "TenisPark", "lead": "Un'app per un piccolo centro tennis: budget di casa, prenotazioni campi e chiosco. Invece di tre quaderni e una calcolatrice — tutto in un posto, sul computer, offline."},
    },
})

# Sbírka (Collection) — detail sbirka.html je udrzovany rucne (aukcni vzhled + galerie);
# zde jen karta v gridu (vsechny 3 jazyky maji sbirka.html). #c9a227 = zlata jako detail.
APPS.append({
    "slug": "sbirka",
    "icon": "🪙",
    "color": "#c9a227",
    "hub_only": True,
    "no_hub_badge": True,
    "hub_langs": ["cs", "en", "it"],
    "screens": [],
    "stack": [],
    "i18n": {
        "cs": {"name": "Sbírka — Numismatika &amp; Filatelie", "lead": "Vlastní katalog mincí, bankovek a známek ve vzhledu aukčního domu. AI rozpozná kus z fotky, pomůže ho ocenit a ukáže, kde se reálně prodává. Lokálně, bez cloudu."},
        "en": {"name": "Collection — Numismatics &amp; Philately", "lead": "A personal catalogue of coins, banknotes and stamps with an auction-house look. AI recognizes an item from a photo, helps value it and shows where it actually sells. Local, no cloud."},
        "it": {"name": "Collezione — Numismatica &amp; Filatelia", "lead": "Catalogo personale di monete, banconote e francobolli in stile casa d'aste. L'AI riconosce il pezzo da una foto, aiuta a valutarlo e mostra dove si vende davvero. In locale, senza cloud."},
    },
})

APPS.append({
    "slug": "budline", "icon": "🚍", "color": "#2d6ad5",
    "hub_only": True, "no_hub_badge": True, "hub_langs": ["cs", "en", "it"],
    "screens": [], "stack": [],
    "i18n": {
        "cs": {"name": "BudLine Panel", "lead": "Směny, turnusy a podklady pro mzdu řidiče autobusu — a kontrola výplatní pásky."},
        "en": {"name": "BudLine Panel", "lead": "Shifts, rosters and payroll documents for a bus driver — and payslip checking."},
        "it": {"name": "BudLine Panel", "lead": "Turni, rotazioni e documenti per la busta paga di un autista — e verifica dello stipendio."},
    },
})
APPS.append({
    "slug": "app-tester", "icon": "🧪", "color": "#6d6df0",
    "hub_only": True, "no_hub_badge": True, "hub_langs": ["cs", "en", "it"],
    "screens": [], "stack": [],
    "i18n": {
        "cs": {"name": "Univerzální tester aplikací", "lead": "Sám proklikne celou webovou appku, hlídá chyby v konzoli a řekne PASS / WATCH / FAIL."},
        "en": {"name": "Universal app tester", "lead": "Clicks through a whole web app on its own, watches for console errors and reports PASS / WATCH / FAIL."},
        "it": {"name": "Tester universale di app", "lead": "Naviga da solo un'intera app web, controlla gli errori in console e restituisce PASS / WATCH / FAIL."},
    },
})
APPS.append({
    "slug": "resident-auditor", "icon": "🔎", "color": "#2fa39a",
    "hub_only": True, "no_hub_badge": True, "hub_langs": ["cs", "en", "it"],
    "screens": [], "stack": [],
    "i18n": {
        "cs": {"name": "Resident Auditor", "lead": "Hodnotí chytrý byt očima obyvatele z reálných logů — fungovalo ráno tak, jak má?"},
        "en": {"name": "Resident Auditor", "lead": "Judges the smart home through a resident's eyes from real logs — did the morning work as it should?"},
        "it": {"name": "Resident Auditor", "lead": "Valuta la casa intelligente con gli occhi di chi ci vive, dai log reali — la mattina ha funzionato?"},
    },
})


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


# ────────────────────────────────────────────────────────────
# Download section ("Moje aplikace ke stažení") — veřejné zaheslované
# instalátory z repa bludek69-lgtm/aplikace. Tlačítko míří PŘÍMO na konkrétní
# .exe (DL_BASE + app["file"], atribut download) → 1 tlačítko = 1 aplikace =
# přímé stažení (NE na releases/tag listing). Verze + název souboru v DL_APPS
# AKTUALIZOVAT při každém vydání (jinak tlačítko stáhne starý installer).
# DL_RELEASE_URL zůstává jen pro referenci (listing všech assetů).
# ────────────────────────────────────────────────────────────
DL_BASE = "https://github.com/bludek69-lgtm/aplikace/releases/download/apps/"
DL_RELEASE_URL = "https://github.com/bludek69-lgtm/aplikace/releases/tag/apps"
DL_CHECKSUMS_URL = "https://github.com/bludek69-lgtm/aplikace/blob/main/CHECKSUMS.txt"

DL_I18N = {
    "cs": {
        "h2": "Moje aplikace ke stažení",
        "intro": "Veřejně stáhnutelné aplikace pro Windows.",
        "btn": "Stáhnout instalátor",
        "via": "přímé stažení .exe",
        "beta": "BETA",
        "verified_title": "✅ Ověřené beta instalátory",
        "verified_text": "Tyto instalátory byly ověřeny ve Windows VM: čistá instalace i upgrade ze starší verze proběhly bez duplicitní instalace. Všechny aplikace jsou beta verze (ne finální vydání).",
        "close_note": "Před instalací zavři běžící aplikaci.",
        "guide_title": "Návod k instalaci",
        "guide": [
            "Zavři aplikaci, pokud už běží.",
            "Stáhni aktuální beta instalátor z této stránky.",
            "Pokud Windows zobrazí SmartScreen nebo bezpečnostní varování, jde o unsigned beta instalátor.",
            "Pokud vidíš starou duplicitní instalaci, nejdřív odinstaluj starou položku v Programs &amp; Features.",
            "Nemazat uživatelská data aplikace, pouze starý program.",
            "Po instalaci zkontroluj verzi v aplikaci.",
        ],
        "warn_title": "Než stáhneš",
        "warn": [
            "🔒 Instalátory jsou zaheslované — <strong>instalační heslo není součástí veřejné stránky a poskytuje se odděleně</strong>.",
            "🛡️ Windows může zobrazit upozornění <strong>SmartScreen</strong> (unsigned beta instalátor). Pokud aplikaci znáš a čekáš ji ode mě, klikni „Další informace“ → „Přesto spustit“.",
        ],
    },
    "en": {
        "h2": "My apps to download",
        "intro": "Publicly downloadable Windows apps.",
        "btn": "Download installer",
        "via": "direct .exe download",
        "beta": "BETA",
        "verified_title": "✅ Verified beta installers",
        "verified_text": "These installers were verified in a Windows VM: both a clean install and an upgrade from an older version completed with no duplicate installation. All apps are beta versions (not final releases).",
        "close_note": "Close the running app before installing.",
        "guide_title": "Installation guide",
        "guide": [
            "Close the app if it is already running.",
            "Download the current beta installer from this page.",
            "If Windows shows SmartScreen or a security warning, it is an unsigned beta installer.",
            "If you see an old duplicate installation, first uninstall the old entry in Programs &amp; Features.",
            "Do not delete the app's user data, only the old program.",
            "After installing, check the version inside the app.",
        ],
        "warn_title": "Before you download",
        "warn": [
            "🔒 Installers are password-protected — <strong>the installation password is not part of this public page and is provided separately</strong>.",
            "🛡️ Windows may show a <strong>SmartScreen</strong> warning (unsigned beta installer). If you know the app and expect it from me, click “More info” → “Run anyway”.",
        ],
    },
    "it": {
        "h2": "Le mie app da scaricare",
        "intro": "App per Windows scaricabili pubblicamente.",
        "btn": "Scarica installer",
        "via": "download .exe diretto",
        "beta": "BETA",
        "verified_title": "✅ Installer beta verificati",
        "verified_text": "Questi installer sono stati verificati in una VM Windows: sia l'installazione pulita sia l'aggiornamento da una versione precedente sono andati a buon fine senza installazioni duplicate. Tutte le app sono versioni beta (non release finali).",
        "close_note": "Chiudi l'app in esecuzione prima di installare.",
        "guide_title": "Guida all'installazione",
        "guide": [
            "Chiudi l'app se è già in esecuzione.",
            "Scarica l'installer beta attuale da questa pagina.",
            "Se Windows mostra SmartScreen o un avviso di sicurezza, è un installer beta non firmato.",
            "Se vedi una vecchia installazione duplicata, disinstalla prima la vecchia voce in Programmi e funzionalità.",
            "Non eliminare i dati utente dell'app, solo il vecchio programma.",
            "Dopo l'installazione, controlla la versione dentro l'app.",
        ],
        "warn_title": "Prima di scaricare",
        "warn": [
            "🔒 Gli installer sono protetti da password — <strong>la password di installazione non è su questa pagina pubblica e viene fornita separatamente</strong>.",
            "🛡️ Windows può mostrare un avviso <strong>SmartScreen</strong> (installer beta non firmato). Se conosci l’app e te l’aspetti da me, clicca “Ulteriori informazioni” → “Esegui comunque”.",
        ],
    },
}

# Prezentační metadata download karet. VERZE + SOUBOR se doplní z latest.json
# (load_latest) — klíč = klíč v latest.json. Pořadí = pořadí karet na stránce.
# "more" = odkaz na detail stránku (per-lang href + label), "badge" = override
# beta štítku, "note" = override poznámky pod tlačítkem.
DL_META = [
    {"key": "budline", "icon": "🚍", "color": "#2d6ad5", "name": "BudLine Panel",
     "desc": {"cs": "Evidence směn, turnusů a výplatních podkladů pro řidiče.",
              "en": "Shifts, rosters and payroll documents for drivers.",
              "it": "Turni, rotazioni e documenti per la busta paga degli autisti."},
     "more": {"cs": ("budline.html", "Více o aplikaci →"),
              "en": ("budline.html", "More →"),
              "it": ("budline.html", "Dettagli →")}},
    {"key": "meal-planner", "icon": "🍱", "color": "#e2722e", "name": "Meal Planner",
     "desc": {"cs": "Jídelníček, krabičky a nákupní seznam.",
              "en": "Meal plan, meal-prep boxes and shopping list.",
              "it": "Menù, pasti pronti e lista della spesa."}},
    {"key": "italia", "icon": "🧳", "color": "#1a9c5b", "name": "Italia Travel Planner",
     "desc": {"cs": "Plánování cest do Itálie — itinerář a rozpočet.",
              "en": "Trip planning for Italy — itinerary and budget.",
              "it": "Pianificazione viaggi in Italia — itinerario e budget."}},
    {"key": "tenispark", "icon": "🎾", "color": "#b04a24", "name": "TenisPark",
     "desc": {"cs": "Rezervace tenisových kurtů, kiosek se skladem a dlužníky, domácí rozpočet.",
              "en": "Tennis court bookings, a kiosk with stock and debtors, and a home budget.",
              "it": "Prenotazioni campi da tennis, chiosco con magazzino e debitori, budget di casa."},
     "badge": {"cs": "SOUKROMÁ BETA", "en": "PRIVATE BETA", "it": "BETA PRIVATA"},
     "note": {"cs": "🔒 Instalátor je chráněný heslem — heslo dávám osobně. Windows může ukázat SmartScreen varování (nepodepsáno) — „Další informace → Přesto spustit\".",
              "en": "🔒 The installer is password-protected — I share the password personally. Windows may show a SmartScreen warning (unsigned) — \"More info → Run anyway\".",
              "it": "🔒 L'installer è protetto da password — la condivido personalmente. Windows può mostrare un avviso SmartScreen (non firmato) — \"Ulteriori informazioni → Esegui comunque\"."}},
    {"key": "collection", "icon": "🪙", "color": "#9b59b6", "name": "Collection",
     "desc": {"cs": "Evidence sbírky a popisy přes AI.",
              "en": "Collection catalog with AI descriptions.",
              "it": "Catalogo della collezione con descrizioni AI."},
     "more": {"cs": ("sbirka.html", "Více o aplikaci →"),
              "en": ("sbirka.html", "More →"),
              "it": ("sbirka.html", "Dettagli →")}},
]


def build_dl_apps(latest: dict) -> list[dict]:
    """Spojí DL_META s živými verzemi z latest.json. Chybějící klíč = tvrdá chyba
    (nikdy nemlčet a nepublikovat starou verzi)."""
    out = []
    for meta in DL_META:
        rel = latest.get(meta["key"])
        if not rel:
            sys.exit(f"⛔ latest.json nemá klíč '{meta['key']}' — kartu nelze vygenerovat.")
        app = dict(meta)
        app["version"] = rel["version"]
        app["file"] = rel["url"].rsplit("/", 1)[-1]
        out.append(app)
    return out


def render_downloads(lang: str, dl_apps: list[dict]) -> str:
    D = DL_I18N[lang]
    cards = []
    for app in dl_apps:
        color = app["color"]
        desc = app["desc"][lang]
        if app.get("more"):
            href, label = app["more"][lang]
            desc = f'{desc} <a href="{href}">{label}</a>'
        badge = app.get("badge", {}).get(lang, D["beta"]) if isinstance(app.get("badge"), dict) else D["beta"]
        note = app.get("note", {}).get(lang) if isinstance(app.get("note"), dict) else None
        note_html = (f'<p style="margin:.5rem 0 0;font-size:.78rem;color:var(--txt-muted,#666)">{note}</p>'
                     if note else
                     f'<p style="margin:.5rem 0 0;font-size:.78rem;color:var(--txt-muted,#666)">⚠️ {D["close_note"]}</p>')
        cards.append(
            f'<div class="card" style="border-left:4px solid {color};">'
            f'<div class="card-icon">{app["icon"]}</div>'
            f'<h3>{app["name"]} '
            f'<span style="display:inline-block;background:{color}1f;color:{color};'
            f'border:1px solid {color}55;padding:.1rem .5rem;border-radius:6px;'
            f'font-size:.72rem;font-weight:600;vertical-align:middle">v{app["version"]}</span> '
            f'<span style="display:inline-block;background:#e8731a1f;color:#c25e10;'
            f'border:1px solid #e8731a66;padding:.1rem .5rem;border-radius:6px;'
            f'font-size:.7rem;font-weight:700;letter-spacing:.04em;vertical-align:middle">{badge}</span></h3>'
            f'<p>{desc}</p>'
            f'<div class="card-cta" style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">'
            f'<a href="{DL_BASE}{app["file"]}" download '
            f'style="display:inline-block;background:{color};color:#fff;text-decoration:none;'
            f'padding:.5rem 1rem;border-radius:8px;font-weight:600;white-space:nowrap">⬇ {D["btn"]}</a></div>'
            f'{note_html}'
            "</div>"
        )
    cards_html = "\n      ".join(cards)
    warn_items = "\n        ".join(f"<li>{w}</li>" for w in D["warn"])
    guide_items = "\n        ".join(f"<li>{g}</li>" for g in D["guide"])
    return f"""
<section aria-label="{D["h2"]}" style="margin-top:2.5rem">
  <h2>{D["h2"]}</h2>
  <p class="hero-sub">{D["intro"]}</p>
  <div style="margin:.4rem 0 1.4rem;padding:1rem 1.2rem;border:1px solid #1a9c5b40;border-radius:10px;background:#1a9c5b12">
    <strong>{D["verified_title"]}</strong>
    <p style="margin:.4rem 0 0;line-height:1.6">{D["verified_text"]}</p>
  </div>
  <div class="cards-grid">
      {cards_html}
  </div>
  <div style="margin-top:1.4rem;padding:1rem 1.2rem;border:1px solid var(--border,#0002);border-radius:10px;background:var(--card-bg,#0000000a)">
    <strong>{D["guide_title"]}</strong>
    <ol style="margin:.5rem 0 0;padding-left:1.2rem;line-height:1.7">
        {guide_items}
    </ol>
  </div>
  <div style="margin-top:1rem;padding:1rem 1.2rem;border:1px solid var(--border,#0002);border-radius:10px;background:var(--card-bg,#0000000a)">
    <strong>{D["warn_title"]}</strong>
    <ul style="margin:.5rem 0 0;padding-left:1.2rem;line-height:1.7">
        {warn_items}
    </ul>
  </div>
</section>
"""


HUB_SECTIONS = {
    1: {"cs": ("Aplikace pro lidi", "co používám a sdílím s lidmi"),
        "en": ("Apps for people", "what I use and share"),
        "it": ("App per le persone", "che uso e condivido")},
    2: {"cs": ("Nástroje pro můj ekosystém", "řízení, diagnostika a testování chytré domácnosti a aplikací"),
        "en": ("Tools for my ecosystem", "control, diagnostics and testing of the smart home and apps"),
        "it": ("Strumenti per il mio ecosistema", "controllo, diagnostica e test della casa intelligente e delle app")},
}
HUB_GROUPS = {
    "budline": (1, 10), "krabickova-dieta": (1, 20), "italia-travel": (1, 30),
    "tenispark": (1, 40), "sbirka": (1, 50), "ucetni-kniha": (1, 60),
    "finance-analytik": (1, 70), "ridic-turnusy-mzdy": (1, 80),
    "config-center": (2, 10), "energy-dashboard": (2, 20), "rpi-kiosk": (2, 30),
    "app-tester": (2, 40), "resident-auditor": (2, 50),
}
HUB_CARD_TAG = {
    "ucetni-kniha": {"cs": "jen pro mě", "en": "personal", "it": "solo per me"},
    "finance-analytik": {"cs": "jen pro mě", "en": "personal", "it": "solo per me"},
}


def render_hub(lang: str, dl_apps: list[dict]) -> str:
    L = I18N[lang]
    entries = []
    # "In development" badge texts per language
    WIP_LABEL = {"cs": "Ve vývoji", "en": "In development", "it": "In sviluppo"}[lang]
    for app in APPS:
        if app.get("hub_langs") and lang not in app["hub_langs"]:
            continue
        a = app["i18n"][lang]
        slug = app["slug"]
        icon = app["icon"]
        icon_div = f'<div class="card-icon">{icon}</div>'
        if app.get("icon_html"):
            icon_div = f'<div class="card-icon" aria-hidden="true">{app["icon_html"]}</div>'
        color = app["color"]
        # badge: per-app override (např. "Soukromá beta"), jinak WIP pokud bez screens
        badge = ""
        # no_hub_badge = hotova appka bez screens v gridu, ale NENI ve vyvoji (napr. Sbirka)
        if app.get("no_hub_badge"):
            badge_label = None
        else:
            badge_label = (app.get("hub_badge") or {}).get(lang) if app.get("hub_badge") else (
                WIP_LABEL if (not app.get("screens") or app.get("wip")) else None)
        if badge_label:
            # hub_badge (např. Soukromá beta) = oranžový beta styl jako na živém webu;
            # WIP badge zůstává v barvě aplikace
            if app.get("hub_badge"):
                badge = (
                    f'<span style="display:inline-block;background:#e8731a1f;color:#c25e10;'
                    f'border:1px solid #e8731a66;padding:.15rem .55rem;border-radius:6px;'
                    f'font-size:.72rem;font-weight:700;margin-left:.4rem;vertical-align:middle">'
                    f'{badge_label}</span>'
                )
            else:
                badge = (
                    f'<span style="display:inline-block;background:{color}1f;color:{color};'
                    f'border:1px solid {color}55;padding:.15rem .55rem;border-radius:6px;'
                    f'font-size:.72rem;font-weight:600;margin-left:.4rem;vertical-align:middle">'
                    f'{badge_label}</span>'
                )
        tag = ""
        ct = HUB_CARD_TAG.get(slug, {}).get(lang)
        if ct:
            tag = (
                '<span style="display:inline-block;background:rgba(127,127,127,.12);'
                'color:var(--txt-muted,#777);border:1px solid rgba(127,127,127,.28);'
                'padding:.15rem .55rem;border-radius:6px;font-size:.72rem;font-weight:600;'
                f'margin-left:.4rem;vertical-align:middle">{ct}</span>'
            )
        card_html = (
            f'<a href="{slug}.html" class="card card-link" style="border-left:4px solid {color};">'
            f'{icon_div}'
            f'<h3>{a["name"]}{badge}{tag}</h3>'
            f'<p>{a["lead"]}</p>'
            f'<div class="card-cta">{L["open_card"]} →</div>'
            "</a>"
        )
        grp, order = HUB_GROUPS.get(slug, (1, 999))
        entries.append((grp, order, card_html))

    entries.sort(key=lambda e: (e[0], e[1]))

    def grid(g):
        return "\n      ".join(h for (gg, o, h) in entries if gg == g)

    s1 = HUB_SECTIONS[1][lang]
    s2 = HUB_SECTIONS[2][lang]
    return f"""\
<section class="hero">
  <span class="hero-accent">{L["hub_h1"]}</span>
  <h1>{L["hub_h1"]}</h1>
  <p class="hero-sub">{L["hub_intro"]}</p>
</section>

<section aria-label="{s1[0]}">
  <h2 style="margin-top:1.6rem">{s1[0]}</h2>
  <p class="hero-sub" style="margin-top:-.5rem">{s1[1]}</p>
  <div class="cards-grid">
      {grid(1)}
  </div>
</section>

<section aria-label="{s2[0]}">
  <h2 style="margin-top:2rem">{s2[0]}</h2>
  <p class="hero-sub" style="margin-top:-.5rem">{s2[1]}</p>
  <div class="cards-grid">
      {grid(2)}
  </div>
</section>
{render_downloads(lang, dl_apps)}
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
    show_screens = (not app.get("screens_langs")) or (lang in app["screens_langs"])
    if show_screens:
        for entry in app["screens"]:
            filename, caption = entry[0], entry[1]
            alt = entry[2] if len(entry) > 2 else caption
            # cesta s '/' = relativní k aplikace/ (cs) — passthrough; jinak sdílené assets
            if "/" in filename:
                url = filename if lang == "cs" else f"../../aplikace/{filename}"
            else:
                url = img_url(lang, app["asset_dir"], filename)
            screen_cards.append(
                f'<figure style="margin:0">'
                f'<img src="{url}" alt="{alt}" loading="lazy" '
                f'style="width:100%;height:auto;border-radius:8px;border:1px solid var(--border,#0001);display:block">'
                f'<figcaption style="font-size:.85rem;color:var(--txt-muted,#666);margin-top:.4rem">{caption}</figcaption>'
                "</figure>"
            )
    screens_block = ""
    if screen_cards:
        h2 = (app.get("screens_h2") or {}).get(lang) or L["screens"]
        note = (app.get("screens_note") or {}).get(lang)
        if note:
            # víceřádkový formát s upozorněním (živý vzor: ridic demo galerie)
            screens_block = (
                f'<section>\n  <h2>{h2}</h2>\n'
                f'  <p style="font-size:.9rem;color:var(--txt-muted,#666);margin:.2rem 0 .6rem">{note}</p>\n'
                f'  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-top:.6rem">\n      '
                + "\n      ".join(screen_cards)
                + "\n  </div>\n</section>"
            )
        else:
            # jednolinkový formát (původní generované stránky)
            screens_block = (
                f'<section><h2>{h2}</h2>'
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
    header/nav/footer later, so we just provide a valid <main>.

    Includes vanilla-JS lightbox: click any <main> img → fullscreen overlay,
    click/ESC to close. No dependencies."""
    css = ("../" * depth) + "assets/css/style.css"
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="{css}">
  <style>
    #__lb {{
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.93); cursor:zoom-out;
      align-items:center; justify-content:center; padding:2vh;
    }}
    #__lb.open {{ display:flex }}
    #__lb img {{ max-width:100%; max-height:96vh; object-fit:contain; box-shadow:0 8px 40px rgba(0,0,0,0.6); border-radius:8px }}
    #__lb .__lbhint {{ position:absolute; bottom:1rem; left:50%; transform:translateX(-50%); color:rgba(255,255,255,0.6); font:13px/1 system-ui,sans-serif }}
    main img {{ cursor:zoom-in; transition:transform .15s ease }}
    main img:hover {{ transform:scale(1.005) }}
  </style>
</head>
<body>
<main id="main">
{body}
</main>
<div id="__lb" role="dialog" aria-modal="true" aria-label="Zvětšený obrázek">
  <img id="__lbimg" alt="">
  <span class="__lbhint">Klikni nebo stiskni ESC pro zavření</span>
</div>
<script>
(function(){{
  var lb = document.getElementById('__lb');
  var lbimg = document.getElementById('__lbimg');
  function open(src, alt){{
    lbimg.src = src; lbimg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }}
  function close(){{
    lb.classList.remove('open');
    lbimg.src = '';
    document.body.style.overflow = '';
  }}
  lb.addEventListener('click', close);
  document.addEventListener('keydown', function(e){{ if(e.key === 'Escape') close(); }});
  document.querySelectorAll('main img').forEach(function(img){{
    img.addEventListener('click', function(){{ open(img.src, img.alt); }});
  }});
}})();
</script>
<script>/* BudLine verze dynamicky z latest.json (runtime self-correct, ať web nikdy nedrift) */(function(){{
  fetch("https://raw.githubusercontent.com/bludek69-lgtm/aplikace/main/latest.json",{{cache:"no-store"}})
  .then(function(r){{return r.json();}}).then(function(d){{var b=d&&d.budline;if(!b||!b.version)return;var v=b.version;
  document.querySelectorAll("[data-bl-ver]").forEach(function(el){{el.textContent=el.getAttribute("data-bl-ver").replace("{{v}}",v);}});
  document.querySelectorAll("[data-bl-dl]").forEach(function(a){{if(b.url)a.href=b.url;}});
  }}).catch(function(){{}});}})();</script>
</body>
</html>
"""


def write_page(path: Path, lang: str, title: str, depth: int, body: str) -> str:
    """MERGE-MODE zápis: u existující stránky vymění JEN <main id=\"main\">…</main>
    (head se SEO tagy, header s lang-switcherem i footer zůstávají ze živé stránky).
    Nová stránka → minimální wrapper (pak spusť _build_pages.py na rewrap)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    new_main = f"<main id=\"main\">\n{body}\n</main>"
    if path.exists():
        src = path.read_text(encoding="utf-8")
        merged, n = re.subn(r'<main[^>]*id="main"[^>]*>.*?</main>', lambda m: new_main,
                            src, count=1, flags=re.DOTALL)
        if n == 1:
            if merged != src:
                path.write_text(merged, encoding="utf-8")
                return "merge"
            return "beze změny"
        # existující stránka bez <main id=main> — nepřepisovat naslepo
        return "SKIP (chybí <main id=\"main\">)"
    path.write_text(wrap_html(lang, title, depth, body), encoding="utf-8")
    return "NOVÁ (spusť _build_pages.py)"


def main() -> int:
    latest = load_latest()
    dl_apps = build_dl_apps(latest)
    results = []
    for lang in ("cs", "en", "it"):
        L = I18N[lang]
        depth = 1 if lang == "cs" else 2
        # Hub index
        r = write_page(hub_path(lang), lang, L["hub_title"], depth, render_hub(lang, dl_apps))
        results.append((hub_path(lang), r))
        # Sub pages (hub_only entries mají jen kartu na hubu, detail se negeneruje)
        for app in APPS:
            if app.get("hub_only"):
                continue
            title = f"{app['i18n'][lang]['name']} — {L['hub_h1']} — Luděk"
            r = write_page(app_path(lang, app["slug"]), lang, title, depth, render_app(lang, app))
            results.append((app_path(lang, app["slug"]), r))
    for p, r in results:
        try:
            print(f"  {r:28} {p.relative_to(ROOT)}")
        except ValueError:
            print(f"  {r:28} {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
