#!/usr/bin/env python3
"""Fetch pasta type photos from Wikipedia REST API summary endpoint.
Wikipedia thumbnails are CC-licensed and safe to use with attribution."""
import io, sys, json, os, urllib.request, ssl
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Mapping: pasta id → Wikipedia article slug (en)
PASTA_WIKI = {
    'spaghetti':       'Spaghetti',
    'vermicelli':      'Vermicelli',
    'capellini':       'Capellini',
    'bucatini':        'Bucatini',
    'pici':            'Pici',
    'linguine':        'Linguine',
    'fettuccine':      'Fettuccine',
    'tagliatelle':     'Tagliatelle',
    'pappardelle':     'Pappardelle',
    'penne':           'Penne',
    'rigatoni':        'Rigatoni',
    'mezzi-rigatoni':  'Rigatoni',  # share image with rigatoni (smaller variant)
    'ziti':            'Ziti',
    'paccheri':        'Paccheri',
    'maccheroni':      'Maccheroni',
    'fusilli':         'Fusilli',
    'trofie':          'Trofie',
    'casarecce':       'Casarecce',
    'busiate':         'Busiate',
    'farfalle':        'Farfalle',
    'conchiglie':      'Conchiglie',
    'cavatelli':       'Cavatelli',
    'orecchiette':     'Orecchiette',
    'tortellini':      'Tortellini',
    'ravioli':         'Ravioli',
    'lasagne':         'Lasagne',
    'gnocchi':         'Gnocchi',
}

DEST = Path(r'C:\Users\lbudi\code\osobni\cestovani\italie\photos\pasta-types')
DEST.mkdir(parents=True, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

UA = 'Mozilla/5.0 (compatible; OsobniWeb/1.0; +https://bludek69-lgtm.github.io/osobni/)'

def fetch_summary(slug):
    url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{slug}'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {'error': str(e)}

def download(url, target):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        data = r.read()
    with open(target, 'wb') as f:
        f.write(data)
    return len(data)

results = []
for pid, slug in PASTA_WIKI.items():
    target = DEST / f'{pid}.jpg'
    if target.exists():
        results.append({'id': pid, 'status': 'skip-exists', 'size': target.stat().st_size})
        print(f'  {pid:18s} SKIP (exists)')
        continue
    summary = fetch_summary(slug)
    if 'error' in summary:
        results.append({'id': pid, 'status': 'fetch-error', 'msg': summary['error']})
        print(f'  {pid:18s} ERROR fetch: {summary["error"]}')
        continue
    thumb = (summary.get('originalimage') or summary.get('thumbnail') or {}).get('source')
    if not thumb:
        results.append({'id': pid, 'status': 'no-thumbnail'})
        print(f'  {pid:18s} no thumbnail')
        continue
    # Get a larger version — replace 'XXXpx' or use originalimage
    # Use originalimage if available; else thumbnail upgrade
    if (summary.get('originalimage') or {}).get('source'):
        url = summary['originalimage']['source']
    else:
        url = thumb
    try:
        size = download(url, target)
        results.append({'id': pid, 'status': 'OK', 'url': url, 'size': size, 'src': summary.get('description','')})
        print(f'  {pid:18s} OK ({size//1024} KB)')
    except Exception as e:
        results.append({'id': pid, 'status': 'download-error', 'msg': str(e)})
        print(f'  {pid:18s} download err: {e}')

# Save manifest
with open(DEST / '_manifest.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print()
ok = sum(1 for r in results if r['status']=='OK')
print(f'Result: {ok}/{len(results)} OK')
