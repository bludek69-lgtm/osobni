#!/usr/bin/env python3
"""Resize pasta photos to web-friendly size + retry fusilli."""
import io, sys, json, os, urllib.request, ssl
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DEST = Path(r'C:\Users\lbudi\code\osobni\cestovani\italie\photos\pasta-types')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
UA = 'Mozilla/5.0 (compatible; OsobniWeb/1.0)'

def fetch_thumb(slug, width=480):
    """Fetch via REST API, get thumbnail.source then upgrade width."""
    url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{slug}'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
        data = json.loads(r.read().decode('utf-8'))
    thumb = (data.get('thumbnail') or {}).get('source')
    if not thumb:
        return None
    # Upgrade Wikipedia thumb to wider — replace e.g. /320px- with /<width>px-
    import re
    upgraded = re.sub(r'/\d+px-', f'/{width}px-', thumb)
    return upgraded

def download(url, target):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        data = r.read()
    with open(target, 'wb') as f:
        f.write(data)
    return len(data)

# Retry fusilli with alternate Wikipedia article
print('=== Fusilli retry ===')
for slug in ['Fusilli', 'Fusilli_pasta', 'Pasta']:  # last resort
    try:
        url = fetch_thumb(slug, 480)
        if url:
            size = download(url, DEST / 'fusilli.jpg')
            print(f'  {slug}: OK {size//1024} KB')
            break
    except Exception as e:
        print(f'  {slug}: {e}')

# Resize all >= 500 KB to <= 480px wide thumbnails
print()
print('=== Resize big files ===')
import re
PASTA_WIKI = {
    'spaghetti':'Spaghetti', 'vermicelli':'Vermicelli', 'capellini':'Capellini',
    'bucatini':'Bucatini', 'pici':'Pici', 'linguine':'Linguine',
    'fettuccine':'Fettuccine', 'tagliatelle':'Tagliatelle', 'pappardelle':'Pappardelle',
    'penne':'Penne', 'rigatoni':'Rigatoni', 'mezzi-rigatoni':'Rigatoni',
    'ziti':'Ziti', 'paccheri':'Paccheri', 'maccheroni':'Maccheroni',
    'trofie':'Trofie', 'casarecce':'Casarecce', 'busiate':'Busiate',
    'farfalle':'Farfalle', 'conchiglie':'Conchiglie', 'cavatelli':'Cavatelli',
    'orecchiette':'Orecchiette', 'tortellini':'Tortellini', 'ravioli':'Ravioli',
    'lasagne':'Lasagne', 'gnocchi':'Gnocchi',
}

for pid, slug in PASTA_WIKI.items():
    target = DEST / f'{pid}.jpg'
    if not target.exists(): continue
    sz = target.stat().st_size
    if sz < 500 * 1024:
        continue  # already small
    try:
        url = fetch_thumb(slug, 480)
        if not url:
            print(f'  {pid}: no thumb to resize')
            continue
        new_size = download(url, target)
        print(f'  {pid}: {sz//1024} → {new_size//1024} KB')
    except Exception as e:
        print(f'  {pid}: {e}')

print()
print('=== Final sizes ===')
total = 0
for p in sorted(DEST.glob('*.jpg')):
    s = p.stat().st_size
    total += s
    print(f'  {p.name:20s} {s//1024} KB')
print(f'\nTotal: {total//1024} KB ({total//1024//1024:.1f} MB)')
