"""Import Cesko + Rybareni photos from C:\\PROJEK_WEB\\DATA\\cestovaní roztřídené\\Cesko."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import os, shutil, zipfile, re
from pathlib import Path

SRC = Path(r"C:\PROJEK_WEB\DATA\cestovaní roztřídené\Cesko")
WEB = Path(r"C:\Users\lbudi\code\osobni")
CESKO = WEB / "cestovani" / "cesko"
RYBA = WEB / "zaliby" / "rybareni"

# 1) Make dirs
for sub in ("krkonose", "lipno", "krumlov", "praha", "jih", "bonus"):
    (CESKO / "photos" / sub).mkdir(parents=True, exist_ok=True)
(RYBA / "photos").mkdir(parents=True, exist_ok=True)

# 2) Krkonose — straight copy
src_krk = SRC / "Krkonoše"
for f in sorted(src_krk.iterdir()):
    if f.is_file():
        shutil.copy2(f, CESKO / "photos" / "krkonose" / f.name)
print(f'Krkonoše → {len(list(src_krk.iterdir()))} files')

# 3) Lipno — unzip + Lipno*.jpg from Bonus
with zipfile.ZipFile(SRC / "Lipno.zip") as z:
    z.extractall(CESKO / "photos" / "lipno")
lipno_zip_count = len(list((CESKO / "photos" / "lipno").iterdir()))

src_bonus = SRC / "Bonus"
lipno_bonus = 0
for f in src_bonus.iterdir():
    if f.is_file() and f.name.lower().startswith('lipno'):
        # rename "Lipno (2).jpg" → "lipno_02.jpg"
        m = re.match(r'^Lipno\s*\((\d+)\)\.jpg$', f.name, re.IGNORECASE)
        if m:
            new_name = f'lipno_bonus_{int(m.group(1)):02d}.jpg'
        else:
            new_name = 'lipno_bonus_01.jpg'
        shutil.copy2(f, CESKO / "photos" / "lipno" / new_name)
        lipno_bonus += 1
print(f'Lipno → {lipno_zip_count} zip + {lipno_bonus} bonus')

# 4) Krumlov
krumlov_count = 0
for f in src_bonus.iterdir():
    if f.is_file() and 'krumlov' in f.name.lower():
        # "Český Krumlov (2).jpg" → "krumlov_02.jpg"
        m = re.search(r'\((\d+)\)', f.name)
        new_name = f'krumlov_{int(m.group(1)):02d}.jpg' if m else 'krumlov_01.jpg'
        shutil.copy2(f, CESKO / "photos" / "krumlov" / new_name)
        krumlov_count += 1
print(f'Krumlov → {krumlov_count}')

# 5) Praha — U Fleku + Velvyslanectví Itálie
praha_count = 0
for f in src_bonus.iterdir():
    if f.is_file():
        lower = f.name.lower()
        if 'fleku' in lower or 'velvyslan' in lower:
            # safe rename without diacritics
            safe = lower.replace(' ', '_').replace('(', '').replace(')', '').replace('_praha', '').replace('itálie_', 'italie_').replace('í', 'i')
            shutil.copy2(f, CESKO / "photos" / "praha" / safe)
            praha_count += 1
print(f'Praha → {praha_count}')

# 6) Jih — písek, temelin
jih_count = 0
for f in src_bonus.iterdir():
    if f.is_file():
        lower = f.name.lower()
        if 'pisek' in lower or 'písek' in lower or 'temelin' in lower:
            safe = lower.replace('í', 'i').replace(' ', '_')
            shutil.copy2(f, CESKO / "photos" / "jih" / safe)
            jih_count += 1
print(f'Jih → {jih_count}')

# 7) Bonus zbytek (20181127_*, IMG_20160925_, IMG_20180511_)
bonus_count = 0
already_handled = {'lipno', 'krumlov', 'fleku', 'velvyslan', 'pisek', 'písek', 'temelin'}
for f in src_bonus.iterdir():
    if f.is_file():
        lower = f.name.lower()
        if any(k in lower for k in already_handled):
            continue
        shutil.copy2(f, CESKO / "photos" / "bonus" / f.name)
        bonus_count += 1
print(f'Bonus → {bonus_count}')

# 8) Rybaření — unzip do RYBA/photos
with zipfile.ZipFile(SRC / "rybaření.zip") as z:
    z.extractall(RYBA / "photos")
ryba_count = 7  # known from zip listing
print(f'Rybaření → {ryba_count} new fotek do {RYBA / "photos"}')

print('\nALL DONE')
