"""Add lang switcher + hreflang link tags to all original CS pages.

For each CS HTML file:
1. After <link rel="canonical">, inject 3 <link rel="alternate" hreflang="..."> tags
2. After <a href="..." class="brand">...</a>, inject <div class="lang-switcher">

Compute correct relative paths based on depth.
"""
import re, pathlib, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Find all CS HTML files (skip already-translated /en/ /it/ and _archive/)
CS_FILES = []
for f in pathlib.Path('.').rglob('*.html'):
    s = str(f).replace('\\', '/')
    if s.startswith('en/') or s.startswith('it/') or '_archive/' in s or 'finance/demo/' in s:
        continue
    CS_FILES.append(f)

print(f'Found {len(CS_FILES)} CS files to patch')

LANG_SWITCHER_PATTERN = re.compile(r'<div class="lang-switcher"')
patched = 0
skipped = 0
for f in CS_FILES:
    text = f.read_text(encoding='utf-8')
    if LANG_SWITCHER_PATTERN.search(text):
        skipped += 1
        continue
    # Compute depth from root → relative path prefix to en/ and it/
    rel = str(f).replace('\\', '/')
    # path after root, e.g. "cestovani/italie/index.html" → segments
    segments = rel.split('/')
    depth = len(segments) - 1  # subdir count
    up = '../' * depth if depth > 0 else './'
    # Determine canonical path (path under domain root)
    canonical_path = '/' if rel == 'index.html' else '/' + '/'.join(segments[:-1]) + '/' if segments[-1] == 'index.html' else '/' + rel

    # 1) Add hreflang link tags after canonical (or after icon if no canonical)
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"\s*>', text)
    if canonical_match:
        canon_url = canonical_match.group(1)
        # Build relative path from canonical /cestovani/italie/ to /en/cestovani/italie/ etc.
        # Use absolute https URL (preferred for hreflang)
        # canonical CS = https://cestovatel69.cz/PATH/
        # EN: https://cestovatel69.cz/en/PATH/
        # IT: https://cestovatel69.cz/it/PATH/
        cs_url = canon_url
        # extract path
        url_path = cs_url.replace('https://cestovatel69.cz', '')
        en_url = 'https://cestovatel69.cz/en' + url_path
        it_url = 'https://cestovatel69.cz/it' + url_path
        hreflang_block = f'''<link rel="canonical" href="{canon_url}">
  <link rel="alternate" hreflang="cs" href="{cs_url}">
  <link rel="alternate" hreflang="en" href="{en_url}">
  <link rel="alternate" hreflang="it" href="{it_url}">
  <link rel="alternate" hreflang="x-default" href="{cs_url}">'''
        text = text.replace(canonical_match.group(0), hreflang_block)

    # 2) Add lang switcher after brand link
    brand_match = re.search(r'(<a[^>]*class="brand"[^>]*>[\s\S]*?</a>)\s*(<button)', text)
    if brand_match:
        en_rel = f'{up}en{url_path}' if canonical_match else f'{up}en/'
        it_rel = f'{up}it{url_path}' if canonical_match else f'{up}it/'
        cs_rel = './'
        switcher = f'''{brand_match.group(1)}
    <div class="lang-switcher" aria-label="Jazyk">
      <a href="{cs_rel}" hreflang="cs" aria-current="page" title="Česky">CS</a>
      <a href="{en_rel}" hreflang="en" title="English">EN</a>
      <a href="{it_rel}" hreflang="it" title="Italiano">IT</a>
    </div>
    {brand_match.group(2)}'''
        text = text.replace(brand_match.group(0), switcher)

    f.write_text(text, encoding='utf-8', newline='')
    patched += 1
    print(f'  + {f}')

print(f'\nPatched: {patched}  Skipped (already had switcher): {skipped}')
