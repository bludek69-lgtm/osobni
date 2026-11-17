"""Refresh only consent-related script URLs without reformatting page content."""
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import re
import subprocess

ROOT = Path(__file__).resolve().parent
VERSION = '20261117-adsense'
ASSETS = {'/assets/js/analytics-consent.js', '/assets/js/main.js', '/smart-home/script.js'}
SCRIPT = re.compile(r'''(?P<prefix><script\b[^>]*?\bsrc\s*=\s*)(?P<quote>["'])(?P<src>[^"']+)(?P=quote)''', re.I)

def refresh(name, text):
    def replace(match):
        src = match['src']
        target = urlsplit(urljoin('https://cestovatel69.cz/' + name, src))
        if target.hostname != 'cestovatel69.cz' or target.path not in ASSETS:
            return match[0]
        return match['prefix'] + match['quote'] + src.split('?')[0] + '?v=' + VERSION + match['quote']
    return SCRIPT.sub(replace, text)

if __name__ == '__main__':
    names = subprocess.check_output(['git', 'ls-files', '-z', '*.html'], cwd=ROOT).decode('utf-8').split('\0')
    changed = 0
    for name in names:
        if not name or any(part.startswith(('_', '.')) for part in Path(name).parts) or '/demo/' in '/' + name:
            continue
        path = ROOT / name
        raw = path.read_bytes()
        updated = refresh(name, raw.decode('utf-8')).encode('utf-8')
        if updated != raw:
            path.write_bytes(updated)
            changed += 1
    print(f'Refreshed consent script URLs on {changed} pages.')
