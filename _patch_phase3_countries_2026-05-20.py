"""Phase 3 — add page-intro + sticky TOC + h2 IDs to 5 long country pages.

Targets:
  uk      (378 ř., 4 h2)
  cesko   (235 ř., 7 h2)
  nemecko (376 ř., 7 h2)
  norsko  (407 ř., 8 h2)
  rakousko(260 ř., 7 h2)

Marker: WX_COUNTRY_TOC_2026-05-20
"""
import re, hashlib, pathlib, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# country -> (intro_text_html, list of (h2_text_substring, anchor_id, toc_label))
# h2 sections WITHOUT entry here are SKIPPED in TOC (e.g. "Pár slov" intro).
CONFIGS = {
    'uk': {
        'intro': (
            'Pro koho je tato stránka: kdo má rád Británii bez stereotypů. Tři odlišné světy, ve kterých jsem byl pracovně i osobně — divoké Skotsko, světový Londýn a průmyslový střed.',
            'Co tady nenajdeš: turistický itinerář (Buckingham, London Eye…). Místo toho jsou tu vlastní snímky a pár vět ke každému místu.'
        ),
        'sections': [
            ('Tři odlišné světy', 'uvod', 'Úvod'),
            ('🏔 Skotsko', 'skotsko', '🏔 Skotsko'),
            ('🇬🇧 Londýn', 'londyn', '🇬🇧 Londýn'),
            ('🏭 Birmingham', 'birmingham', '🏭 Birmingham + střed'),
        ],
    },
    'cesko': {
        'intro': (
            'Pro koho je tato stránka: kdo se chce podívat, jak vypadá Česko očima řidiče, který tu žije a zároveň ukazuje kus země klientele autobusu.',
            'Co tady najdeš: Krkonoše na podzim, Lipno v létě, Český Krumlov, Praha a jižní Čechy. Roky 2016–2020.'
        ),
        'sections': [
            ('🏔 Krkonoše', 'krkonose', '🏔 Krkonoše'),
            ('🌊 Lipno', 'lipno', '🌊 Lipno'),
            ('🏰 Český Krumlov', 'cesky-krumlov', '🏰 Č. Krumlov'),
            ('🏛 Praha', 'praha', '🏛 Praha'),
            ('🏛 Jižní Čechy', 'jizni-cechy', '🏛 Jižní Čechy'),
            ('📸 Další záběry', 'dalsi', '📸 Další'),
        ],
    },
    'nemecko': {
        'intro': (
            'Pro koho je tato stránka: kdo má rád Německo bez klišé "Berlín = pivo, Mnichov = Oktoberfest". Šest měst a míst, kde jsem byl s autobusem i osobně.',
            'Co tady najdeš: Berlín, Drážďany, Wolfsburg (auta), Baden-Baden (lázně), Dachau (památník) a soukromé místo Raketenstation Hombroich.'
        ),
        'sections': [
            ('🏛 Berlín', 'berlin', '🏛 Berlín'),
            ('⛪ Drážďany', 'drazdany', '⛪ Drážďany'),
            ('🚗 Wolfsburg', 'wolfsburg', '🚗 Wolfsburg'),
            ('♨ Baden-Baden', 'baden-baden', '♨ Baden-Baden'),
            ('🕯 Dachau', 'dachau', '🕯 Dachau'),
            ('🚀 Raketenstation', 'raketenstation', '🚀 Raketenstation'),
        ],
    },
    'norsko': {
        'intro': (
            'Pro koho je tato stránka: kdo se chystá do Norska nebo si chce projít fotky a pochopit, proč tam stojí za to jet i přes drahotu. Sedm sekcí, většinou z mé cesty 2017 s autobusem.',
            'Co tady najdeš: olympijský Lillehammer, Lofoty, Vesterålen, pobřežní silnici Helgeland, divoký Sever a Oslo.'
        ),
        'sections': [
            ('🎿 Lillehammer', 'lillehammer', '🎿 Lillehammer'),
            ('🏔  Lofoty', 'lofoty', '🏔 Lofoty'),
            ('🦌 Vesterålen', 'vesteralen', '🦌 Vesterålen'),
            ('🌊 Helgelandská', 'helgeland', '🌊 Helgeland'),
            ('☀  Sever', 'sever', '☀ Sever'),
            ('🇳🇴 Oslo', 'oslo', '🇳🇴 Oslo'),
            ('📷 Z cesty', 'foto', '📷 Z cesty'),
        ],
    },
    'rakousko': {
        'intro': (
            'Pro koho je tato stránka: kdo do Rakouska jezdí pracovně i na hory. Vídeň, Pinzgau v Alpách a Söll na lyže — z více než jedné sezóny.',
            'Co tady najdeš: dvě návštěvy Vídně, Pinzgau, Söll a vybrané záběry z cest.'
        ),
        'sections': [
            ('🏛 Vídeň duben', 'viden-duben', '🏛 Vídeň 4/2019'),
            ('🏛 Vídeň květen', 'viden-kveten', '🏛 Vídeň 5/2019'),
            ('🏔 Pinzgau', 'pinzgau', '🏔 Pinzgau'),
            ('⛷ Söll 2018', 'soll-2018', '⛷ Söll 2018'),
            ('⛷ Söll 2019', 'soll-2019', '⛷ Söll 2019'),
            ('📸 Z cesty', 'foto', '📸 Z cesty'),
        ],
    },
}

# Regex to find first hero closing </section>
HERO_RE = re.compile(r'(<section class="hero">[\s\S]*?</section>)', re.MULTILINE)

def build_intro_html(intro_lines):
    paras = '\n      '.join(f'<p><strong>{txt.split(":", 1)[0]}:</strong>{txt.split(":", 1)[1] if ":" in txt else ""}</p>' for txt in intro_lines)
    return f'''
  <!-- Phase 3 intro (WX_COUNTRY_TOC_2026-05-20) -->
  <section>
    <div class="page-intro">
      {paras}
    </div>
  </section>
'''

def build_toc_html(sections):
    items = '\n      '.join(f'<li><a href="#{sid}">{label}</a></li>' for (_, sid, label) in sections)
    return f'''  <!-- Phase 3 sticky TOC (WX_COUNTRY_TOC_2026-05-20) -->
  <nav class="page-toc-sticky" aria-label="Skok na sekci">
    <span class="toc-label">Skok na:</span>
    <ul>
      {items}
    </ul>
  </nav>
'''

def add_ids(text, sections):
    """Add id="..." attribute to h2 tags whose text contains one of the substrings."""
    applied = 0
    for h2_sub, sid, _ in sections:
        # Match <h2[attrs not containing id]>...h2_sub...</h2> and inject id
        # Use simple two-step: find tag with text containing h2_sub
        pat = re.compile(r'(<h2)(?![^>]*\bid=)([^>]*)>(\s*[^<]*' + re.escape(h2_sub) + r'[^<]*</h2>)')
        new_text, n = pat.subn(rf'\1 id="{sid}"\2>\3', text, count=1)
        if n:
            text = new_text
            applied += 1
            print(f'    + id={sid:18s}  -> matched "{h2_sub}"')
        else:
            print(f'    ! NOT MATCHED: "{h2_sub}"')
    return text, applied

for country, cfg in CONFIGS.items():
    path = pathlib.Path(f'cestovani/{country}/index.html')
    text = path.read_text(encoding='utf-8')
    orig_sha = hashlib.sha256(text.encode()).hexdigest()[:16]
    orig_len = len(text)
    print(f'=== {country} ({orig_len} B, sha {orig_sha}) ===')

    # 1) Add IDs to target h2s
    text, ids_added = add_ids(text, cfg['sections'])

    # 2) Insert intro + TOC after first hero section closing
    match = HERO_RE.search(text)
    if not match:
        print(f'  FAIL: no hero section found in {country}')
        continue
    hero_end = match.end()
    intro_html = build_intro_html(cfg['intro'])
    toc_html = build_toc_html(cfg['sections'])
    text = text[:hero_end] + intro_html + toc_html + text[hero_end:]

    new_sha = hashlib.sha256(text.encode()).hexdigest()[:16]
    new_len = len(text)
    path.write_text(text, encoding='utf-8', newline='')
    print(f'  WRITTEN  sha {orig_sha} -> {new_sha}  len {orig_len} -> {new_len} (+{new_len - orig_len} B)  IDs={ids_added}/{len(cfg["sections"])}')
    print()
