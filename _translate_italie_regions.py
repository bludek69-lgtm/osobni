"""Batch-generate EN + IT versions of 5 italian region pages from CS sources.

Strategy: parse CS HTML, translate hero/intro/section descriptions (and h2 emoji+name kept),
translate alt text months in image captions. Keep photo gallery structure intact.

Marker for outputs: WX_REGION_I18N_2026-05-20
"""
import re, pathlib, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# CS month → EN, IT translation
MONTHS = {
    'leden': ('January', 'gennaio'), 'únor': ('February', 'febbraio'),
    'březen': ('March', 'marzo'), 'duben': ('April', 'aprile'),
    'květen': ('May', 'maggio'), 'červen': ('June', 'giugno'),
    'červenec': ('July', 'luglio'), 'srpen': ('August', 'agosto'),
    'září': ('September', 'settembre'), 'říjen': ('October', 'ottobre'),
    'listopad': ('November', 'novembre'), 'prosinec': ('December', 'dicembre'),
}

# Page-specific translations
REGIONS = {
    'toskansko': {
        'slug': 'toskansko',
        'depth_extra': '../',  # extra ../ for region subpage
        'hero': {
            'accent_en': '🇮🇹 Italy · Tuscany', 'accent_it': '🇮🇹 Italia · Toscana',
            'h1_en': 'Florence, Val d\'Orcia &amp; Lerici', 'h1_it': 'Firenze, Val d\'Orcia &amp; Lerici',
            'sub_en': 'July 2023. Tuscany — where I lived part of my life. Florence and Siena as the heart of the Renaissance, Val d\'Orcia as a postcard, the thermal springs at Saturnia, and quiet Lerici, where I lived. A home region to me, not just a tourist destination.',
            'sub_it': 'Luglio 2023. Toscana — dove ho vissuto parte della mia vita. Firenze e Siena come cuore del Rinascimento, Val d\'Orcia come una cartolina, le terme a Saturnia, e la tranquilla Lerici dove ho abitato. Una regione di casa per me, non solo una destinazione turistica.',
        },
        'intro_en': '<p>Tuscany is more than hills with cypresses. It\'s a <strong>complete region</strong> where every corner has its own character — Florence looks at prosperity from hundreds of years old, Val d\'Orcia is quiet and rolling, the coast at Spiagge Bianche has white sand like the Caribbean, and in the forest near Saturnia hot water flows freely accessible to everyone.</p><p>This land grew on my heart most through <strong>Lerici</strong> — a small seaside town on the border of Tuscany and Liguria, where I lived. Calm, authentic, no crowds. I always come back here.</p>',
        'intro_it': '<p>La Toscana è più di colline con cipressi. È una <strong>regione completa</strong> dove ogni angolo ha il suo carattere — Firenze guarda la prosperità da centinaia di anni, Val d\'Orcia è tranquilla e ondulata, la costa a Spiagge Bianche ha sabbia bianca come ai Caraibi, e nel bosco vicino a Saturnia scorre acqua calda liberamente accessibile.</p><p>Questa terra mi è entrata nel cuore soprattutto grazie a <strong>Lerici</strong> — piccolo paesino di mare al confine tra Toscana e Liguria, dove ho abitato. Tranquilla, autentica, senza folle. Qui torno sempre.</p>',
        'sections': {
            'Florencie': ('Florence', 'Firenze', 'Cradle of the Renaissance. Brunelleschi\'s Duomo dome, Ponte Vecchio, Uffizi, Palazzo Vecchio. A city where Michelangelo or Dante peer from every corner.', 'Culla del Rinascimento. La cupola del Brunelleschi, il Ponte Vecchio, gli Uffizi, Palazzo Vecchio. Una città da cui Michelangelo o Dante sbucano da ogni angolo.'),
            'Val d': ('Val d\'Orcia', 'Val d\'Orcia', 'Classic Tuscan landscape, the one from postcards. Hills with cypress-lined roads, stone towns Pienza and Montalcino, rolling fields. UNESCO heritage — rightfully so.', 'Paesaggio toscano classico, quello da cartolina. Colline con viali di cipressi, cittadine in pietra Pienza e Montalcino, campi ondulati. Patrimonio UNESCO — meritatamente.'),
            'Pisa': ('Pisa', 'Pisa', 'Piazza dei Miracoli — Leaning Tower, Cathedral, Baptistery. The classic. Beyond the tower, a calm university city worth half a day.', 'Piazza dei Miracoli — Torre Pendente, Duomo, Battistero. Il classico. Oltre la torre, una tranquilla città universitaria che vale mezza giornata.'),
            'Siena': ('Siena', 'Siena', 'Medieval town in southern Tuscany. Piazza del Campo, the cathedral, Palio horse race. Less famous than Florence, but no less interesting.', 'Cittadina medievale nel sud della Toscana. Piazza del Campo, il duomo, il Palio. Meno famosa di Firenze, ma non meno interessante.'),
            'Montepulciano': ('Montepulciano', 'Montepulciano', 'A village on a hill above the vineyards of Vino Nobile. Renaissance palaces, wine cellars under the streets, the view of Val d\'Orcia.', 'Borgo su collina sopra i vigneti del Vino Nobile. Palazzi rinascimentali, cantine sotto le strade, la vista sulla Val d\'Orcia.'),
            'Cascate del Mulino': ('Cascate del Mulino (Saturnia)', 'Cascate del Mulino (Saturnia)', 'Free hot springs in the Tuscan forest. Travertine cascades, sulfur water at ~37°C. Open to the public 24/7.', 'Terme libere nel bosco toscano. Cascate di travertino, acqua sulfurea a ~37°C. Aperte al pubblico 24/7.'),
            'Bagni San Filippo': ('Bagni San Filippo', 'Bagni San Filippo', 'Smaller, calmer hot springs than Saturnia. White travertine "whale" formation in the forest. Less touristy.', 'Terme più piccole e tranquille di Saturnia. Formazione di travertino bianco "balena" nel bosco. Meno turistico.'),
            'Spiagge Bianche': ('Spiagge Bianche (Vada)', 'Spiagge Bianche (Vada)', 'White-sand beaches near Vada. The color comes from old soda-ash industry sediments, but today the beaches are clean. A Tuscan Caribbean.', 'Spiagge di sabbia bianca vicino a Vada. Il colore viene dai sedimenti industriali, ma oggi le spiagge sono pulite. Un Caraibi toscano.'),
            'Lerici': ('Lerici', 'Lerici', 'Where I lived. A small seaside town on the border with Liguria. Castle on a cliff, harbor, calm. Away from the Cinque Terre crowds.', 'Dove ho abitato. Piccolo paesino di mare al confine con la Liguria. Castello su una scogliera, porto, tranquillità. Lontano dalla folla delle Cinque Terre.'),
        },
    },
    'benatky': {
        'slug': 'benatky',
        'depth_extra': '../',
        'hero': {
            'accent_en': '🇮🇹 Italy · Venice', 'accent_it': '🇮🇹 Italia · Venezia',
            'h1_en': 'Venice', 'h1_it': 'Venezia',
            'sub_en': 'Three visits (2016, 2019, 2023). St. Mark\'s Square, gondolas, Burano with colored houses, Murano with glass blowers. A city that deserves more than one day.',
            'sub_it': 'Tre visite (2016, 2019, 2023). Piazza San Marco, gondole, Burano con le case colorate, Murano con i soffiatori di vetro. Una città che merita più di un giorno.',
        },
        'intro_en': '<p>Venice is one of those cities you should see at least once in your life. The first impression — labyrinth of canals, ornate palaces, gondolas — never gets old.</p><p>Recommendation from experience: stay overnight in the city, don\'t just come on a day trip. The evening, when day-trippers leave, is when the real Venice begins.</p>',
        'intro_it': '<p>Venezia è una di quelle città che bisogna vedere almeno una volta nella vita. La prima impressione — labirinto di canali, palazzi decorati, gondole — non invecchia mai.</p><p>Consiglio dall\'esperienza: dormi in città, non venire solo per la giornata. La sera, quando i visitatori giornalieri se ne vanno, inizia la vera Venezia.</p>',
        'sections': {},  # use generic translation: any h2 keeps original
    },
    'roma': {
        'slug': 'roma',
        'depth_extra': '../',
        'hero': {
            'accent_en': '🇮🇹 Italy · Rome', 'accent_it': '🇮🇹 Italia · Roma',
            'h1_en': 'The Eternal City', 'h1_it': 'La Città Eterna',
            'sub_en': 'October 2019. Colosseum, Vatican, Pantheon, Trevi. The eternal city — three thousand years of history at every street.',
            'sub_it': 'Ottobre 2019. Colosseo, Vaticano, Pantheon, Trevi. La città eterna — tremila anni di storia ad ogni strada.',
        },
        'intro_en': '<p>Rome is a city that swallows you. From the Colosseum to St. Peter\'s, from ancient ruins to baroque churches — every street has layers of history. Three days are the minimum to scratch the surface.</p><p>I\'d recommend: start with the basics (Colosseum, Vatican), then wander aimlessly. The best places are found by accident.</p>',
        'intro_it': '<p>Roma è una città che ti assorbe. Dal Colosseo a San Pietro, dalle rovine antiche alle chiese barocche — ogni strada ha strati di storia. Tre giorni sono il minimo per grattare la superficie.</p><p>Consiglio: parti dai classici (Colosseo, Vaticano), poi vaga senza meta. I posti migliori si trovano per caso.</p>',
        'sections': {},
    },
    'sever': {
        'slug': 'sever',
        'depth_extra': '../',
        'hero': {
            'accent_en': '🇮🇹 Italy · North', 'accent_it': '🇮🇹 Italia · Nord',
            'h1_en': 'Lombardy &amp; Lakes', 'h1_it': 'Lombardia &amp; Laghi',
            'sub_en': 'Milan, Lake Garda, northern Italy. The region closest to Central Europe — different from southern Italy in climate, cuisine, even mentality.',
            'sub_it': 'Milano, Lago di Garda, Italia settentrionale. La regione più vicina all\'Europa centrale — diversa dal sud per clima, cucina, anche mentalità.',
        },
        'intro_en': '<p>Northern Italy is a different world from Naples or Sicily. Closer to the German-speaking Alps, with foggy plains, lakes that look like Swiss postcards and cuisine based on butter, rice and polenta rather than olive oil and tomatoes.</p><p>For a first Italy trip from Central Europe, the north is the gentle entry — less culture shock, easier driving.</p>',
        'intro_it': '<p>L\'Italia del nord è un mondo diverso da Napoli o dalla Sicilia. Più vicina alle Alpi di lingua tedesca, con pianure nebbiose, laghi che sembrano cartoline svizzere e cucina basata su burro, riso e polenta più che olio d\'oliva e pomodori.</p><p>Per un primo viaggio in Italia dall\'Europa centrale, il nord è l\'ingresso morbido — meno shock culturale, guida più facile.</p>',
        'sections': {},
    },
    'jih': {
        'slug': 'jih',
        'depth_extra': '../',
        'hero': {
            'accent_en': '🇮🇹 Italy · South', 'accent_it': '🇮🇹 Italia · Sud',
            'h1_en': 'Naples &amp; Amalfi Coast', 'h1_it': 'Napoli &amp; Costiera Amalfitana',
            'sub_en': 'September 2023 — 82 photos in 6 sections. Naples, Pompeii, Vesuvius, the Amalfi coast, Positano. Loud, chaotic, authentic. The Italy you don\'t see from a tour bus window.',
            'sub_it': 'Settembre 2023 — 82 foto in 6 sezioni. Napoli, Pompei, Vesuvio, Costiera Amalfitana, Positano. Rumorosa, caotica, autentica. L\'Italia che non vedi dal finestrino del pullman.',
        },
        'intro_en': '<p>Southern Italy is loud, chaotic, beautiful. Naples has Spaccanapoli — narrow streets where life happens on the street, not behind closed doors. Pompeii makes 79 AD feel like yesterday. The Amalfi Coast bends along cliffs so steep that driving feels like flying.</p><p>Difference from the north: traffic is wild, but the welcome is real. Order a "caffè" at any bar and you\'ll feel at home in 30 seconds.</p>',
        'intro_it': '<p>L\'Italia del sud è rumorosa, caotica, bellissima. Napoli ha Spaccanapoli — strade strette dove la vita succede in strada, non dietro porte chiuse. Pompei fa sembrare il 79 d.C. come ieri. La Costiera Amalfitana si curva lungo scogliere così ripide che guidare sembra volare.</p><p>Differenza dal nord: il traffico è selvaggio, ma l\'accoglienza è vera. Ordina un "caffè" in qualunque bar e ti sentirai a casa in 30 secondi.</p>',
        'sections': {},
    },
}

def translate_alt(text, lang):
    """Translate CS alt text: 'Florencie — červenec 2023' → 'Firenze — luglio 2023'"""
    for cs, (en, it) in MONTHS.items():
        text = text.replace(cs, en if lang == 'en' else it)
    return text

def build_html(slug, cfg, lang):
    """Build full HTML for a region in target language."""
    src = pathlib.Path(f'cestovani/italie/{slug}/index.html').read_text(encoding='utf-8')

    hero = cfg['hero']
    intro = cfg[f'intro_{lang}']

    # Common UI strings
    if lang == 'en':
        nav_items = ['Home', 'Finance', 'Travel', 'Italy', 'Fishing', 'Smart Home', 'AI']
        first_words_intro = '<h2>A few words</h2>'
        lang_native = 'English'
        lang_label_native = 'Lingua'
        copyright_text = '© Luděk · Personal website'
    else:  # it
        nav_items = ['Home', 'Finanza', 'Viaggi', 'Italia', 'Pesca', 'Smart Home', 'AI']
        first_words_intro = '<h2>Qualche parola</h2>'
        lang_native = 'Italiano'
        lang_label_native = 'Lingua'
        copyright_text = '© Luděk · Sito personale'

    # Build hero section
    hero_html = f'''<section class="hero">
    <span class="hero-accent">{hero[f'accent_{lang}']}</span>
    <h1>{hero[f'h1_{lang}']}</h1>
    <p class="hero-sub">{hero[f'sub_{lang}']}</p>
  </section>

  <section class="prose">
    {first_words_intro}
    {intro}
  </section>'''

    # Process all region sections (h2 + description + photo galleries)
    # Find all <section> blocks with h2 (skipping "Pár slov" intro which we replaced)
    section_pattern = re.compile(r'<section>\s*<h2>([^<]+)</h2>\s*<p style="opacity:0\.85; margin-bottom:1rem;">([^<]+)(<span[^<]*</span>)?</p>(\s*<div class="cards-grid">[\s\S]*?</div>)\s*</section>', re.MULTILINE)
    sections_html = []
    for m in section_pattern.finditer(src):
        cs_title, cs_desc, count_span, gallery = m.group(1), m.group(2), m.group(3) or '', m.group(4)
        # Translate gallery alt texts (months)
        gallery = re.sub(r'alt="([^"]*?)"', lambda am: f'alt="{translate_alt(am.group(1), lang)}"', gallery)
        # Fix image src paths (originals are relative to /cestovani/italie/REGION/, our output is at /LANG/cestovani/italie/REGION/, but using same /cestovani/.../photos)
        gallery = gallery.replace('src="photos/', f'src="../../../../cestovani/italie/{slug}/photos/')
        # Try to find translation for h2 title in cfg
        translated_title = cs_title
        translated_desc = cs_desc
        for key, (en_title, it_title, en_desc, it_desc) in cfg.get('sections', {}).items():
            if key in cs_title:
                translated_title = en_title if lang == 'en' else it_title
                translated_desc = en_desc if lang == 'en' else it_desc
                break
        sections_html.append(f'''<section>
    <h2>{translated_title}</h2>
    <p style="opacity:0.85; margin-bottom:1rem;">{translated_desc} <span style="opacity:0.6;">{count_span}</span></p>
    {gallery}
  </section>''')

    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{hero[f'h1_{lang}'].replace('&amp;', '&')} — Italy — Luděk</title>
  <link rel="stylesheet" href="../../../../assets/css/style.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🇮🇹%3C/text%3E%3C/svg%3E">
  <link rel="canonical" href="https://cestovatel69.cz/{lang}/cestovani/italie/{slug}/">
  <link rel="alternate" hreflang="cs" href="https://cestovatel69.cz/cestovani/italie/{slug}/">
  <link rel="alternate" hreflang="en" href="https://cestovatel69.cz/en/cestovani/italie/{slug}/">
  <link rel="alternate" hreflang="it" href="https://cestovatel69.cz/it/cestovani/italie/{slug}/">
  <link rel="alternate" hreflang="x-default" href="https://cestovatel69.cz/cestovani/italie/{slug}/">
</head>
<body class="theme-italy">

<header class="site-header">
  <div class="site-header__inner">
    <a href="../../../../" class="brand"><span class="brand-dot"></span>Luděk</a>
    <div class="lang-switcher" aria-label="{lang_label_native}">
      <a href="../../../../cestovani/italie/{slug}/" hreflang="cs">CS</a>
      <a href="{'./' if lang == 'en' else '../../../../en/cestovani/italie/' + slug + '/'}" hreflang="en"{' aria-current="page"' if lang == 'en' else ''}>EN</a>
      <a href="{'./' if lang == 'it' else '../../../../it/cestovani/italie/' + slug + '/'}" hreflang="it"{' aria-current="page"' if lang == 'it' else ''}>IT</a>
    </div>
    <button class="nav-toggle" aria-label="{'Open menu' if lang == 'en' else 'Apri menu'}" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="{'Main navigation' if lang == 'en' else 'Navigazione principale'}">
    <a href="../../../">{nav_items[0]}</a>
    <a href="../../../finance/">{nav_items[1]}</a>
    <a href="../../">{nav_items[2]}</a>
    <a href="../" aria-current="page">{nav_items[3]}</a>
    <a href="../../../zaliby/rybareni/">{nav_items[4]}</a>
    <a href="../../../smart-home/">{nav_items[5]}</a>
    <a href="../../../ai.html">{nav_items[6]}</a>
    </nav>
  </div>
</header>

<main id="main">
  {hero_html}

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

<script src="../../../../assets/js/main.js?v=2026-05-20"></script>
</body>
</html>
'''

# Generate all 10 files
total = 0
for slug, cfg in REGIONS.items():
    for lang in ('en', 'it'):
        out_path = pathlib.Path(f'{lang}/cestovani/italie/{slug}/index.html')
        out_path.parent.mkdir(parents=True, exist_ok=True)
        html = build_html(slug, cfg, lang)
        out_path.write_text(html, encoding='utf-8', newline='')
        total += 1
        print(f'  + {out_path}  ({len(html)} B)')

print(f'\nTotal regions translated: {total}/10')
