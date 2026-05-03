#!/usr/bin/env python3
"""Re-fetch using thumbnail.source directly (Wikipedia default, ~30-50 KB)."""
import io, sys, json, urllib.request, ssl, time
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
DEST = Path(r'C:\Users\lbudi\code\osobni\cestovani\italie\photos\pasta-types')
DEST.mkdir(parents=True, exist_ok=True)

ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = 'Mozilla/5.0 (compatible; OsobniWeb/1.0)'

# Backup originals first
import shutil
backup = DEST / '_backup_orig'
backup.mkdir(exist_ok=True)
for p in DEST.glob('*.jpg'):
    if not (backup / p.name).exists():
        shutil.copy2(p, backup / p.name)

PASTA = {
    'spaghetti':'Spaghetti', 'vermicelli':'Vermicelli', 'capellini':'Capellini',
    'bucatini':'Bucatini', 'pici':'Pici', 'linguine':'Linguine',
    'fettuccine':'Fettuccine', 'tagliatelle':'Tagliatelle', 'pappardelle':'Pappardelle',
    'penne':'Penne', 'rigatoni':'Rigatoni', 'mezzi-rigatoni':'Rigatoni',
    'ziti':'Ziti', 'paccheri':'Paccheri', 'maccheroni':'Maccheroni',
    'fusilli':'Fusilli', 'trofie':'Trofie', 'casarecce':'Casarecce', 'busiate':'Busiate',
    'farfalle':'Farfalle', 'conchiglie':'Conchiglie', 'cavatelli':'Cavatelli',
    'orecchiette':'Orecchiette', 'tortellini':'Tortellini', 'ravioli':'Ravioli',
    'lasagne':'Lasagne', 'gnocchi':'Gnocchi',
}

def fetch_thumb_url(slug):
    url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{slug}'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
        d = json.loads(r.read().decode('utf-8'))
    return (d.get('thumbnail') or {}).get('source')

def download(url, target):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        data = r.read()
    with open(target, 'wb') as f: f.write(data)
    return len(data)

print('=== Re-fetch as default thumbnail (small) ===')
ok = 0; failed = []
for pid, slug in PASTA.items():
    target = DEST / f'{pid}.jpg'
    try:
        url = fetch_thumb_url(slug)
        if not url:
            failed.append(pid); print(f'  {pid:18s} no thumb')
            continue
        size = download(url, target)
        print(f'  {pid:18s} {size//1024} KB · {url[-50:]}')
        ok += 1
    except Exception as e:
        failed.append(pid); print(f'  {pid:18s} ERR: {e}')
    time.sleep(0.6)  # gentle rate limit respect

print(f'\nResult: {ok}/{len(PASTA)}; failed: {failed}')

# Final size check
total = sum(p.stat().st_size for p in DEST.glob('*.jpg'))
print(f'Total: {total//1024} KB')
