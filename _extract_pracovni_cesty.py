#!/usr/bin/env python3
"""Extract Photos-3-001 zip → cestovani/pracovni-cesty/photos/<staging>/
Read EXIF GPS for bulk classification."""
import io, sys, shutil, zipfile, json
from pathlib import Path
import piexif

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SRC = Path(r'C:\Users\lbudi\Downloads\Photos-3-001 (1).zip')
STAGING = Path(r'C:\Users\lbudi\code\osobni\cestovani\pracovni-cesty\photos\_staging')
STAGING.mkdir(parents=True, exist_ok=True)

# Extract everything
extracted = []
with zipfile.ZipFile(SRC) as z:
    for m in z.namelist():
        if not m.lower().endswith(('.jpg','.jpeg','.heic','.png','.mp4','.3gp')): continue
        fname = Path(m).name
        t = STAGING / fname
        if not t.exists():
            with z.open(m) as src, open(t,'wb') as dst: shutil.copyfileobj(src, dst)
        extracted.append(t)

print(f'Extracted {len(extracted)} files to {STAGING}')

# EXIF GPS extraction
def get_gps(p):
    try:
        ex = piexif.load(str(p))
        gps = ex.get('GPS', {})
        if not gps or piexif.GPSIFD.GPSLatitude not in gps: return None
        def to_dec(t, ref):
            d, m, s = t
            v = d[0]/d[1] + (m[0]/m[1])/60 + (s[0]/s[1])/3600
            return -v if ref in ('S','W') else v
        return (to_dec(gps[piexif.GPSIFD.GPSLatitude], gps[piexif.GPSIFD.GPSLatitudeRef].decode()),
                to_dec(gps[piexif.GPSIFD.GPSLongitude], gps[piexif.GPSIFD.GPSLongitudeRef].decode()))
    except Exception: return None

# Country bbox (basic)
COUNTRIES = [
    ('Italie',     35.5, 47.1,   6.6, 18.6),
    ('Cesko',      48.5, 51.1,  12.0, 18.9),
    ('Slovensko',  47.7, 49.6,  16.8, 22.6),
    ('Nemecko',    47.3, 55.0,   5.9, 15.0),
    ('Rakousko',   46.4, 49.0,   9.5, 17.2),
    ('Svycarsko',  45.8, 47.8,   5.9, 10.5),
    ('Francie',    41.3, 51.1,  -5.0,  9.6),
    ('Holansko',   50.7, 53.6,   3.4,  7.2),
    ('Belgie',     49.5, 51.5,   2.5,  6.4),
    ('Polsko',     49.0, 54.9,  14.1, 24.2),
    ('Madarsko',   45.7, 48.6,  16.1, 22.9),
    ('Chorvatsko', 42.4, 46.6,  13.5, 19.5),
    ('Slovinsko',  45.4, 46.9,  13.4, 16.6),
]
def country_of(lat, lon):
    for n, la1,la2,lo1,lo2 in COUNTRIES:
        if la1<=lat<=la2 and lo1<=lon<=lo2: return n
    return 'Neznama'

results = []
for p in sorted(extracted):
    gps = get_gps(p) if p.suffix.lower() in ('.jpg','.jpeg') else None
    entry = {
        'file': p.name,
        'has_gps': gps is not None,
        'lat': round(gps[0], 5) if gps else None,
        'lon': round(gps[1], 5) if gps else None,
        'country': country_of(*gps) if gps else None,
        'size_kb': p.stat().st_size // 1024,
    }
    results.append(entry)

# Stats
print()
print('=== EXIF GPS analysis ===')
with_gps = sum(1 for r in results if r['has_gps'])
print(f'  s GPS: {with_gps}/{len(results)}')
from collections import Counter
country_counts = Counter(r['country'] for r in results if r['country'])
for c, n in country_counts.most_common():
    print(f'    {c}: {n}')

# Save inventory
inv_path = STAGING.parent / '_inventory.json'
with open(inv_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f'\nInventory → {inv_path}')

# Print all entries sorted by country/date
print()
print('=== Per file ===')
for r in sorted(results, key=lambda x: (x['country'] or 'zzz', x['file'])):
    gps_str = f"{r['lat']},{r['lon']}" if r['has_gps'] else 'NO_GPS'
    print(f"  {r['country'] or '?':12s} {r['file']:35s} {gps_str}")
