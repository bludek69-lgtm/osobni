#!/usr/bin/env python3
"""Surgical nav-only patcher — adds AI item to every HTML page's <nav> block
WITHOUT touching SEO meta, head, body, or footer.

Reason: _build_pages.py regen strips per-page SEO (title, description, canonical,
OG, twitter, JSON-LD). For nav-only updates this is too destructive.

Strategy:
  - Glob all *.html files (depth-aware paths)
  - Locate <nav class="nav" aria-label="Hlavní navigace">...</nav> block
  - Replace inner content with new NAV (including AI)
  - Preserve href depth prefixes (../ vs ../../ vs ./)
  - Preserve `aria-current="page"` on whatever item was active before

Run: py -3.14 _patch_nav_only.py

Idempotent: if AI is already in nav, file is left untouched.
"""
import io, sys, re
try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
except Exception:
    pass
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# New NAV items (label, href_rel_root) — matches _build_pages.py NAV
NAV_ITEMS = [
    ('Domů',       ''),                       # → './' on root, '../' on depth=1, etc.
    ('Finance',    'finance/'),
    ('Cestování',  'cestovani/'),
    ('Itálie',     'cestovani/italie/'),
    ('Rybaření',   'zaliby/rybareni/'),
    ('Smart Home', 'smart-home/'),
    ('AI',         'ai.html'),                # ← NEW
]

# Capture: opening tag, newline, then content + trailing whitespace before </nav>
NAV_BLOCK_RE = re.compile(
    r'(<nav class="nav" aria-label="Hlavní navigace">\n)(.*?)(    </nav>)',
    re.DOTALL,
)


def detect_depth(file_path: Path) -> int:
    """Compute depth from repo root for path-prefix calculation."""
    rel = file_path.relative_to(ROOT)
    return len(rel.parts) - 1   # 'index.html' = 0, 'finance/index.html' = 1, etc.


def detect_active(existing_nav_inner: str) -> str | None:
    """Find which href was marked aria-current in old nav."""
    m = re.search(r'href="([^"]+)"\s+aria-current="page"', existing_nav_inner)
    return m.group(1) if m else None


def build_nav_inner(depth: int, active_href: str | None) -> str:
    """Render the inner <nav> children for given depth + active href."""
    pfx = '../' * depth
    lines = []
    for label, rel in NAV_ITEMS:
        if rel == '':
            full = pfx or './'
        else:
            full = pfx + rel
        cur_attr = ''
        if active_href and full == active_href:
            cur_attr = ' aria-current="page"'
        lines.append(f'    <a href="{full}"{cur_attr}>{label}</a>')
    return '\n'.join(lines)


def patch_file(file_path: Path) -> str:
    """Returns 'OK', 'SKIP_ALREADY_HAS_AI', 'SKIP_NO_NAV', or 'ERR'."""
    try:
        text = file_path.read_text(encoding='utf-8')
    except Exception as e:
        return f'ERR_READ: {e}'

    m = NAV_BLOCK_RE.search(text)
    if not m:
        return 'SKIP_NO_NAV'

    pre, inner_old, post = m.group(1), m.group(2), m.group(3)

    # Idempotency: if AI item already present, skip
    if 'ai.html' in inner_old and re.search(r'>AI<', inner_old):
        return 'SKIP_ALREADY_HAS_AI'

    depth = detect_depth(file_path)
    active = detect_active(inner_old)
    new_inner = build_nav_inner(depth, active) + '\n'

    # pre = "<nav ...>\n", post = "    </nav>"
    new_text = text[:m.start()] + pre + new_inner + post + text[m.end():]
    # Preserve trailing newline if file had one
    if not new_text.endswith('\n') and text.endswith('\n'):
        new_text += '\n'

    file_path.write_text(new_text, encoding='utf-8')
    return 'OK'


def main():
    # Find all HTML files except _archive, _audit_patches, node_modules
    exclude_dirs = {'_archive', '_audit_patches', 'node_modules', '.git'}
    html_files = []
    for p in ROOT.rglob('*.html'):
        rel = p.relative_to(ROOT)
        if any(part in exclude_dirs for part in rel.parts):
            continue
        html_files.append(p)
    html_files.sort()

    print(f'Scanning {len(html_files)} HTML files...')
    print()
    counts = {'OK': 0, 'SKIP_ALREADY_HAS_AI': 0, 'SKIP_NO_NAV': 0, 'ERR': 0}
    for f in html_files:
        result = patch_file(f)
        rel = f.relative_to(ROOT)
        if result == 'OK':
            print(f'  ✓ {rel}')
            counts['OK'] += 1
        elif result == 'SKIP_ALREADY_HAS_AI':
            print(f'  · {rel} (already has AI)')
            counts['SKIP_ALREADY_HAS_AI'] += 1
        elif result == 'SKIP_NO_NAV':
            print(f'  ? {rel} (no nav block found)')
            counts['SKIP_NO_NAV'] += 1
        else:
            print(f'  ✗ {rel} ({result})')
            counts['ERR'] += 1
    print()
    print(f'PATCHED: {counts["OK"]}')
    print(f'SKIPPED (already has AI): {counts["SKIP_ALREADY_HAS_AI"]}')
    print(f'SKIPPED (no nav): {counts["SKIP_NO_NAV"]}')
    print(f'ERRORS: {counts["ERR"]}')


if __name__ == '__main__':
    main()
