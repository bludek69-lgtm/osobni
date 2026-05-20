"""Batch-translate 19 country travel galleries (Wave 3) — EN + IT.

Strategy: parse CS HTML structure (hero + "Pár slov" intro + h2 region sections + photo galleries),
translate hero/intro/section descriptions, preserve photo src paths (point back to original CS photos),
translate month names in alt texts.

For h2 sections we keep CS title (often Czech-specific place name with emoji) but translate
the description text. For section descriptions and intros, we use per-country translation table.

Marker: WX_COUNTRY_I18N_2026-05-20
"""
import re, pathlib, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

MONTHS = {
    'leden': ('January', 'gennaio'), 'únor': ('February', 'febbraio'),
    'březen': ('March', 'marzo'), 'duben': ('April', 'aprile'),
    'květen': ('May', 'maggio'), 'červen': ('June', 'giugno'),
    'červenec': ('July', 'luglio'), 'srpen': ('August', 'agosto'),
    'září': ('September', 'settembre'), 'říjen': ('October', 'ottobre'),
    'listopad': ('November', 'novembre'), 'prosinec': ('December', 'dicembre'),
}

# Country slug → (CS country name, EN, IT, theme accent emoji, hero title CS→EN→IT, hero sub CS→EN→IT,
#                 "Pár slov" intro paragraph CS→EN→IT)
COUNTRIES = {
    'bosna': {
        'cs_name': 'Bosna a Hercegovina', 'en_name': 'Bosnia and Herzegovina', 'it_name': 'Bosnia ed Erzegovina',
        'flag': '🇧🇦',
        'hero_h1_en': 'Mostar and the Neretva valley', 'hero_h1_it': 'Mostar e la valle della Neretva',
        'hero_sub_en': 'September 2016. A stop on the way to the sea — Mostar with its famous Stari Most bridge, the turquoise Neretva river, and the old town.',
        'hero_sub_it': 'Settembre 2016. Tappa sulla strada per il mare — Mostar col suo famoso ponte Stari Most, il fiume turchese della Neretva e la città vecchia.',
    },
    'cesko': {
        'cs_name': 'Česká republika', 'en_name': 'Czech Republic', 'it_name': 'Repubblica Ceca',
        'flag': '🇨🇿',
        'hero_h1_en': 'Home, mountains, water &amp; cities', 'hero_h1_it': 'Casa, montagne, acqua e città',
        'hero_sub_en': 'Krkonoše, Lipno, Český Krumlov, Prague, southern Bohemia — places I keep coming back to. Years 2016–2019.',
        'hero_sub_it': 'Krkonoše, Lipno, Český Krumlov, Praga, Boemia meridionale — luoghi dove torno sempre. Anni 2016–2019.',
    },
    'chorvatsko': {
        'cs_name': 'Chorvatsko', 'en_name': 'Croatia', 'it_name': 'Croazia',
        'flag': '🇭🇷',
        'hero_h1_en': 'Dubrovnik and the Adriatic coast', 'hero_h1_it': 'Dubrovnik e la costa adriatica',
        'hero_sub_en': 'Regular summer trips for clients. UNESCO Dubrovnik, the coast and islands of the Adriatic.',
        'hero_sub_it': 'Viaggi estivi regolari per clienti. UNESCO Dubrovnik, la costa e le isole dell\'Adriatico.',
    },
    'estonsko': {
        'cs_name': 'Estonsko', 'en_name': 'Estonia', 'it_name': 'Estonia',
        'flag': '🇪🇪',
        'hero_h1_en': 'Tallinn — medieval jewel by the Baltic', 'hero_h1_it': 'Tallinn — gioiello medievale sul Baltico',
        'hero_sub_en': 'Tallinn — UNESCO medieval core, Hanseatic merchant city. Northern Europe with character.',
        'hero_sub_it': 'Tallinn — nucleo medievale UNESCO, città mercantile anseatica. Nord Europa con carattere.',
    },
    'finsko': {
        'cs_name': 'Finsko', 'en_name': 'Finland', 'it_name': 'Finlandia',
        'flag': '🇫🇮',
        'hero_h1_en': 'Helsinki and Finnish landscape', 'hero_h1_it': 'Helsinki e il paesaggio finlandese',
        'hero_sub_en': 'Helsinki, Finnish nature. Silence you can hear. Summer 2018.',
        'hero_sub_it': 'Helsinki, la natura finlandese. Silenzio che si sente. Estate 2018.',
    },
    'francie': {
        'cs_name': 'Francie', 'en_name': 'France', 'it_name': 'Francia',
        'flag': '🇫🇷',
        'hero_h1_en': 'Alsace and Chamonix-Mont-Blanc', 'hero_h1_it': 'Alsazia e Chamonix-Mont-Blanc',
        'hero_sub_en': 'Vineyards, castles, the Alps. Summer 2019.',
        'hero_sub_it': 'Vigneti, castelli, Alpi. Estate 2019.',
    },
    'holansko': {
        'cs_name': 'Nizozemsko', 'en_name': 'Netherlands', 'it_name': 'Paesi Bassi',
        'flag': '🇳🇱',
        'hero_h1_en': 'Amsterdam and tulip country', 'hero_h1_it': 'Amsterdam e il paese dei tulipani',
        'hero_sub_en': 'Amsterdam, tulip fields, windmills. April 2018.',
        'hero_sub_it': 'Amsterdam, campi di tulipani, mulini a vento. Aprile 2018.',
    },
    'irsko': {
        'cs_name': 'Irsko', 'en_name': 'Ireland', 'it_name': 'Irlanda',
        'flag': '🇮🇪',
        'hero_h1_en': 'The Emerald Isle', 'hero_h1_it': 'L\'Isola di Smeraldo',
        'hero_sub_en': 'Ferry, pastures, stone walls, ever-changing sky. A different Europe.',
        'hero_sub_it': 'Traghetto, pascoli, muretti di pietra, cielo cangiante. Un\'Europa diversa.',
    },
    'lotyssko': {
        'cs_name': 'Lotyšsko', 'en_name': 'Latvia', 'it_name': 'Lettonia',
        'flag': '🇱🇻',
        'hero_h1_en': 'Riga — Art Nouveau capital', 'hero_h1_it': 'Riga — capitale dell\'Art Nouveau',
        'hero_sub_en': 'Riga — UNESCO old town and the largest collection of Art Nouveau buildings in Europe.',
        'hero_sub_it': 'Riga — centro storico UNESCO e la più grande collezione di edifici Art Nouveau in Europa.',
    },
    'madarsko': {
        'cs_name': 'Maďarsko', 'en_name': 'Hungary', 'it_name': 'Ungheria',
        'flag': '🇭🇺',
        'hero_h1_en': 'Budapest on both banks of the Danube', 'hero_h1_it': 'Budapest sulle due sponde del Danubio',
        'hero_sub_en': 'Buda and Pest — two cities, one Danube. Spring 2018.',
        'hero_sub_it': 'Buda e Pest — due città, un Danubio. Primavera 2018.',
    },
    'nemecko': {
        'cs_name': 'Německo', 'en_name': 'Germany', 'it_name': 'Germania',
        'flag': '🇩🇪',
        'hero_h1_en': 'Berlin, Dresden, Wolfsburg, Baden-Baden', 'hero_h1_it': 'Berlino, Dresda, Wolfsburg, Baden-Baden',
        'hero_sub_en': 'Six places — capital, baroque cathedral city, car manufacturing, spa town, Dachau memorial, Hombroich rocket museum. 2018–2019.',
        'hero_sub_it': 'Sei luoghi — capitale, città barocca della cattedrale, manifattura auto, città termale, memoriale di Dachau, museo dei razzi a Hombroich. 2018–2019.',
    },
    'norsko': {
        'cs_name': 'Norsko', 'en_name': 'Norway', 'it_name': 'Norvegia',
        'flag': '🇳🇴',
        'hero_h1_en': 'Beyond the Arctic Circle — Lofoten, fjords, midnight sun', 'hero_h1_it': 'Oltre il Circolo Polare — Lofoten, fiordi, sole di mezzanotte',
        'hero_sub_en': 'Lillehammer, Lofoten, Vesterålen, Helgeland coastal route, the far north, Oslo. A working tour summer 2017.',
        'hero_sub_it': 'Lillehammer, Lofoten, Vesterålen, strada costiera dell\'Helgeland, l\'estremo nord, Oslo. Un tour di lavoro estate 2017.',
    },
    'rakousko': {
        'cs_name': 'Rakousko', 'en_name': 'Austria', 'it_name': 'Austria',
        'flag': '🇦🇹',
        'hero_h1_en': 'Vienna, Söll, Pinzgau', 'hero_h1_it': 'Vienna, Söll, Pinzgau',
        'hero_sub_en': 'Culture, mountains, skiing. Multiple visits 2018–2019.',
        'hero_sub_it': 'Cultura, montagne, sci. Più visite 2018–2019.',
    },
    'rusko': {
        'cs_name': 'Rusko', 'en_name': 'Russia', 'it_name': 'Russia',
        'flag': '🇷🇺',
        'hero_h1_en': 'St Petersburg and Peterhof', 'hero_h1_it': 'San Pietroburgo e Peterhof',
        'hero_sub_en': 'White nights, the Hermitage, the fountain cascades of Peterhof.',
        'hero_sub_it': 'Notti bianche, l\'Ermitage, le cascate di fontane di Peterhof.',
    },
    'slovensko': {
        'cs_name': 'Slovensko', 'en_name': 'Slovakia', 'it_name': 'Slovacchia',
        'flag': '🇸🇰',
        'hero_h1_en': 'Through Slovakia from the bus', 'hero_h1_it': 'Attraverso la Slovacchia dall\'autobus',
        'hero_sub_en': 'Trips through Slovakia from the driver\'s seat. March 2022.',
        'hero_sub_it': 'Viaggi attraverso la Slovacchia dal posto di guida. Marzo 2022.',
    },
    'slovinsko': {
        'cs_name': 'Slovinsko', 'en_name': 'Slovenia', 'it_name': 'Slovenia',
        'flag': '🇸🇮',
        'hero_h1_en': 'Lipica — oldest stud farm in Europe', 'hero_h1_it': 'Lipica — il più antico allevamento di cavalli d\'Europa',
        'hero_sub_en': 'Lipica stud farm — the oldest still-active stud farm in Europe, home of the Lipizzaner horses.',
        'hero_sub_it': 'Allevamento di Lipica — il più antico allevamento ancora attivo in Europa, casa dei cavalli Lipizzani.',
    },
    'svedsko': {
        'cs_name': 'Švédsko', 'en_name': 'Sweden', 'it_name': 'Svezia',
        'flag': '🇸🇪',
        'hero_h1_en': 'Stockholm and Uppsala', 'hero_h1_it': 'Stoccolma e Uppsala',
        'hero_sub_en': 'The "Venice of the North" on its islands and the historic university town.',
        'hero_sub_it': 'La "Venezia del Nord" sulle sue isole e la storica città universitaria.',
    },
    'svycarsko': {
        'cs_name': 'Švýcarsko', 'en_name': 'Switzerland', 'it_name': 'Svizzera',
        'flag': '🇨🇭',
        'hero_h1_en': 'Bernese Alps, Geneva, Lac Léman', 'hero_h1_it': 'Alpi Bernesi, Ginevra, Lago di Ginevra',
        'hero_sub_en': 'Multiple visits 2018–2019. Each canton its own landscape — Alps, lakes, vineyards.',
        'hero_sub_it': 'Più visite 2018–2019. Ogni cantone un paesaggio proprio — Alpi, laghi, vigneti.',
    },
    'uk': {
        'cs_name': 'Velká Británie', 'en_name': 'United Kingdom', 'it_name': 'Regno Unito',
        'flag': '🇬🇧',
        'hero_h1_en': 'Scotland, London, Birmingham', 'hero_h1_it': 'Scozia, Londra, Birmingham',
        'hero_sub_en': 'Three different worlds in which I traveled both for work and personally — wild Scotland, the world\'s London, and the industrial Midlands.',
        'hero_sub_it': 'Tre mondi diversi in cui ho viaggiato per lavoro e personalmente — la Scozia selvaggia, la Londra cosmopolita e le Midlands industriali.',
    },
}

# Generic short intro template per language
def make_intro(cfg, lang):
    if lang == 'en':
        return f'<h2>A few words</h2><p>One of the places I\'ve visited as a bus driver and traveler. Below are selected photos from the trip, organized by region or city. Most images are click-to-enlarge with original resolution.</p>'
    else:
        return f'<h2>Qualche parola</h2><p>Uno dei posti che ho visitato come autista di pullman e viaggiatore. Sotto trovi foto selezionate dal viaggio, organizzate per regione o città. La maggior parte delle immagini si ingrandisce al clic con la risoluzione originale.</p>'

# Translate the section description for a country page
def translate_section_desc(cs_desc, lang):
    """Translate common phrases in section descriptions."""
    # Translate months
    for cs, (en, it) in MONTHS.items():
        cs_desc = cs_desc.replace(cs, en if lang == 'en' else it)
    # Generic phrase translations (CS → EN / IT)
    if lang == 'en':
        cs_desc = cs_desc.replace('fotek', 'photos').replace('fotky', 'photos').replace('foto', 'photos')
    else:
        cs_desc = cs_desc.replace('fotek', 'foto').replace('fotky', 'foto')
    return cs_desc

def build_html(slug, cfg, lang):
    src_path = pathlib.Path(f'cestovani/{slug}/index.html')
    src = src_path.read_text(encoding='utf-8')

    # UI strings
    if lang == 'en':
        nav = ['Home', 'Finance', 'Travel', 'Italy', 'Fishing', 'Smart Home', 'AI']
        open_menu = 'Open menu'
        main_nav = 'Main navigation'
        lang_label = 'Language'
        copyright_text = '© Luděk · Personal website'
        page_title = f'{cfg["en_name"]} — Travel — Luděk'
    else:
        nav = ['Home', 'Finanza', 'Viaggi', 'Italia', 'Pesca', 'Smart Home', 'AI']
        open_menu = 'Apri menu'
        main_nav = 'Navigazione principale'
        lang_label = 'Lingua'
        copyright_text = '© Luděk · Sito personale'
        page_title = f'{cfg["it_name"]} — Viaggi — Luděk'

    accent = f'{cfg["flag"]} {cfg["en_name"] if lang == "en" else cfg["it_name"]}'
    h1 = cfg[f'hero_h1_{lang}']
    sub = cfg[f'hero_sub_{lang}']

    # Find all <section> blocks with h2 (skipping "Pár slov" intro section)
    # We need: <section>\n<h2>EMOJI Place</h2>\n<p>...</p>\n<div class="cards-grid">...</div>\n</section>
    # Replace each: keep h2 as-is (CS place names), translate description, fix photo src paths
    # Accept h2 with or without id attribute (Phase 3 added IDs to some pages)
    section_pattern = re.compile(
        r'<section>\s*<h2(?:\s+id="[^"]*")?>([^<]+)</h2>\s*<p style="opacity:0\.85; margin-bottom:1rem;">([^<]*?)(<span[^<]*</span>)?</p>\s*(<div class="cards-grid">[\s\S]*?</div>)\s*</section>',
        re.MULTILINE
    )
    section_pattern_b = re.compile(
        r'<section>\s*<h2(?:\s+id="[^"]*")?>([^<]+)</h2>\s*(<p[^>]*>[\s\S]*?</p>)?\s*(<div class="cards-grid">[\s\S]*?</div>)\s*</section>',
        re.MULTILINE
    )
    sections_html = []
    seen_positions = set()
    # First pass: strict pattern with opacity style
    for m in section_pattern.finditer(src):
        if m.start() in seen_positions: continue
        seen_positions.add(m.start())
        cs_title, cs_desc, count_span, gallery = m.group(1), m.group(2), m.group(3) or '', m.group(4)
        desc_trans = translate_section_desc(cs_desc, lang)
        gallery = gallery.replace('src="photos/', f'src="../../../cestovani/{slug}/photos/')
        gallery = re.sub(r'alt="([^"]*?)"', lambda am: f'alt="{translate_section_desc(am.group(1), lang)}"', gallery)
        sections_html.append(f'''<section>
    <h2>{cs_title}</h2>
    <p style="opacity:0.85; margin-bottom:1rem;">{desc_trans} <span style="opacity:0.6;">{count_span}</span></p>
    {gallery}
  </section>''')
    # Second pass: looser pattern (catch sections without opacity-style description)
    for m in section_pattern_b.finditer(src):
        if m.start() in seen_positions: continue
        seen_positions.add(m.start())
        cs_title, p_block, gallery = m.group(1), m.group(2) or '', m.group(3)
        # If p_block exists, translate its inner text content (best-effort)
        if p_block:
            # Simple approach: translate month/foto words inside
            p_block_trans = translate_section_desc(p_block, lang)
        else:
            p_block_trans = ''
        gallery = gallery.replace('src="photos/', f'src="../../../cestovani/{slug}/photos/')
        gallery = re.sub(r'alt="([^"]*?)"', lambda am: f'alt="{translate_section_desc(am.group(1), lang)}"', gallery)
        sections_html.append(f'''<section>
    <h2>{cs_title}</h2>
    {p_block_trans}
    {gallery}
  </section>''')

    intro_html = make_intro(cfg, lang)

    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{page_title}</title>
  <link rel="stylesheet" href="../../../assets/css/style.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E{cfg["flag"]}%3C/text%3E%3C/svg%3E">
  <link rel="canonical" href="https://cestovatel69.cz/{lang}/cestovani/{slug}/">
  <link rel="alternate" hreflang="cs" href="https://cestovatel69.cz/cestovani/{slug}/">
  <link rel="alternate" hreflang="en" href="https://cestovatel69.cz/en/cestovani/{slug}/">
  <link rel="alternate" hreflang="it" href="https://cestovatel69.cz/it/cestovani/{slug}/">
  <link rel="alternate" hreflang="x-default" href="https://cestovatel69.cz/cestovani/{slug}/">
</head>
<body class="theme-travel">

<header class="site-header">
  <div class="site-header__inner">
    <a href="../../../" class="brand"><span class="brand-dot"></span>Luděk</a>
    <div class="lang-switcher" aria-label="{lang_label}">
      <a href="../../../cestovani/{slug}/" hreflang="cs">CS</a>
      <a href="{'./' if lang == 'en' else '../../../en/cestovani/' + slug + '/'}" hreflang="en"{' aria-current="page"' if lang == 'en' else ''}>EN</a>
      <a href="{'./' if lang == 'it' else '../../../it/cestovani/' + slug + '/'}" hreflang="it"{' aria-current="page"' if lang == 'it' else ''}>IT</a>
    </div>
    <button class="nav-toggle" aria-label="{open_menu}" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="{main_nav}">
    <a href="../../">{nav[0]}</a>
    <a href="../../finance/">{nav[1]}</a>
    <a href="../" aria-current="page">{nav[2]}</a>
    <a href="../italie/">{nav[3]}</a>
    <a href="../../zaliby/rybareni/">{nav[4]}</a>
    <a href="../../smart-home/">{nav[5]}</a>
    <a href="../../ai.html">{nav[6]}</a>
    </nav>
  </div>
</header>

<main id="main">
  <section class="hero">
    <span class="hero-accent">{accent}</span>
    <h1>{h1}</h1>
    <p class="hero-sub">{sub}</p>
  </section>

  <section class="prose">
    {intro_html}
  </section>

  {''.join(sections_html)}
</main>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div>{copyright_text}</div>
    <div class="footer-links">
      <a href="https://www.youtube.com/@cestovatel69" target="_blank" rel="noopener">YouTube @cestovatel69</a>
      <a href="https://bludek69-lgtm.github.io/smart-home-website/" target="_blank" rel="noopener">Smart Home web</a>
    </div>
  </div>
</footer>

<script src="../../../assets/js/main.js?v=2026-05-20"></script>
</body>
</html>
'''

total = 0
for slug, cfg in COUNTRIES.items():
    for lang in ('en', 'it'):
        out_path = pathlib.Path(f'{lang}/cestovani/{slug}/index.html')
        out_path.parent.mkdir(parents=True, exist_ok=True)
        html = build_html(slug, cfg, lang)
        out_path.write_text(html, encoding='utf-8', newline='')
        total += 1
        print(f'  + {out_path}  ({len(html)} B)')

print(f'\nTotal country pages translated: {total}/38')
