#!/usr/bin/env python3
"""Detekce duplicit pred importem novych fotek do osobni repa.

Pouziti:
    py -3.14 _check_dupes.py <slozka_s_novymi_fotkami>

Co dela:
    1. Spocita MD5 hash kazde *.jpg v zadane slozce
    2. Spocita MD5 vsech *.jpg uz publikovanych v cestovani/, finance/,
       zaliby/, photos/
    3. Vypise duplicity (stejny hash NEBO stejny nazev) — abys vedel,
       co uz mas, nez to nahrajes podruhe.

Hash detekuje skutecne duplicity (i kdyz nazev se lisi).
Match na nazev detekuje "stejny soubor v jine vetvi" (byt obsah byl prepsan).
"""
import sys, hashlib, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

REPO = Path(__file__).resolve().parent
SCAN_ROOTS = [REPO / 'cestovani', REPO / 'finance', REPO / 'zaliby', REPO / 'photos']


def md5(path):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()


def index_repo():
    by_hash = {}   # hash -> [path, ...]
    by_name = {}   # name -> [path, ...]
    for root in SCAN_ROOTS:
        if not root.exists():
            continue
        for p in root.rglob('*.jpg'):
            h = md5(p)
            by_hash.setdefault(h, []).append(p)
            by_name.setdefault(p.name, []).append(p)
    return by_hash, by_name


def main():
    if len(sys.argv) != 2:
        print('Pouziti: py -3.14 _check_dupes.py <slozka>')
        sys.exit(1)
    src = Path(sys.argv[1]).resolve()
    if not src.is_dir():
        print(f'Slozka neexistuje: {src}')
        sys.exit(1)

    print(f'Skenuji repozitar...')
    by_hash, by_name = index_repo()
    print(f'  {sum(len(v) for v in by_hash.values())} fotek, {len(by_hash)} unikatnich hashu')

    print(f'\nKontroluji {src}:')
    new_files = sorted(src.rglob('*.jpg'))
    if not new_files:
        print('  zadne *.jpg')
        return
    print(f'  {len(new_files)} fotek')

    dupes_hash = []   # already in repo (same content)
    dupes_name = []   # name match but different content
    fresh = []
    for p in new_files:
        h = md5(p)
        if h in by_hash:
            dupes_hash.append((p, by_hash[h]))
        elif p.name in by_name:
            dupes_name.append((p, by_name[p.name]))
        else:
            fresh.append(p)

    print(f'\n=== VYSLEDEK ===')
    print(f'  fresh (k importu):     {len(fresh)}')
    print(f'  duplicity podle obsahu: {len(dupes_hash)}')
    print(f'  shoda nazvu (pozor):    {len(dupes_name)}')

    if dupes_hash:
        print('\n--- DUPLICITY (hash, == identicky soubor) ---')
        for p, existing in dupes_hash:
            print(f'  {p.name}')
            for e in existing:
                print(f'      uz je: {e.relative_to(REPO)}')

    if dupes_name:
        print('\n--- SHODA NAZVU (jiny obsah, pozor na prepis) ---')
        for p, existing in dupes_name:
            print(f'  {p.name}')
            for e in existing:
                print(f'      jiny soubor v: {e.relative_to(REPO)}')

    if fresh:
        print(f'\n--- FRESH ({len(fresh)} k importu) ---')
        for p in fresh[:20]:
            print(f'  {p.name}')
        if len(fresh) > 20:
            print(f'  ... a dalsich {len(fresh) - 20}')


if __name__ == '__main__':
    main()
