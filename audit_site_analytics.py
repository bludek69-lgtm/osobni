"""Audit Analytics coverage of all tracked public HTML, including non-sitemap pages.

Run: python audit_site_analytics.py [--json path]
Missing measurement on content pages or unconditional Google tags fail the audit.
Reference sheets, redirects, noindex pages and demos have explicit exclusions.
"""
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from collections import Counter
import argparse
import json
import re
import subprocess
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
ORIGIN = 'https://cestovatel69.cz/'
LOADERS = {'/assets/js/main.js', '/smart-home/script.js', '/assets/js/analytics-consent.js'}


def audit():
    names = subprocess.check_output(['git', 'ls-files', '-z', '*.html'], cwd=ROOT).decode('utf-8').split('\0')
    pages = []
    direct_google = []
    for name in names:
        if not name or any(part.startswith(('_', '.')) for part in Path(name).parts):
            continue
        soup = BeautifulSoup((ROOT / name).read_text(encoding='utf-8'), 'html.parser')
        page_url = ORIGIN + name
        scripts = {urlsplit(urljoin(page_url, tag['src'])).path for tag in soup.select('script[src]')}
        for tag in soup.select('script[src]'):
            if urlsplit(urljoin(page_url, tag['src'])).hostname in {'www.googletagmanager.com', 'www.google-analytics.com'}:
                direct_google.append(name)
        refresh = soup.find('meta', attrs={'http-equiv': re.compile('^refresh$', re.I)})
        robots = soup.find('meta', attrs={'name': re.compile('^robots$', re.I)})
        if '/demo/' in '/' + name:
            status = 'demo'
        elif refresh:
            status = 'redirect'
        elif robots and 'noindex' in robots.get('content', '').lower():
            status = 'noindex'
        elif scripts & LOADERS:
            status = 'covered'
        elif name.startswith('zdroje/'):
            status = 'reference'
        else:
            status = 'missing'
        pages.append({'file': name, 'status': status, 'loaders': sorted(scripts & LOADERS)})
    return {'counts': dict(Counter(page['status'] for page in pages)), 'unconditional_google_scripts': direct_google, 'pages': pages}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    report = audit()
    print(json.dumps(report['counts'], ensure_ascii=False))
    missing = [page['file'] for page in report['pages'] if page['status'] == 'missing']
    for name in missing:
        print('MISSING:', name)
    for name in report['unconditional_google_scripts']:
        print('UNCONDITIONAL GOOGLE TAG:', name)
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if missing or report['unconditional_google_scripts']:
        raise SystemExit(1)
    print('PASS: every public content page has consent-controlled Analytics; no unconditional Google tag in HTML.')


if __name__ == '__main__':
    main()
