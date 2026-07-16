"""Rewrite sitemap.xml <lastmod> values to each page's REAL last-modified date,
derived from git history (`git log -1 --format=%aI -- <file>`), instead of a
single hardcoded date copied across all entries.

Standalone script -- intentionally NOT wired into any of the deprecated
_build_pages.py / _build_aplikace_pages.py builders (those are known to
regress branding/lang-switcher and must not be run). Run directly:

    python _regen_sitemap_lastmod.py [--dry-run]

For each <url><loc> in sitemap.xml:
  1. Map the public URL to a file on disk:
       - trailing-slash URL  ->  <path>/index.html
       - otherwise           ->  <path> as-is (already has an extension)
  2. Ask git for that file's last commit date (`git log -1 --format=%aI`).
     If the file has no git history yet (e.g. new/untracked), fall back to
     the file's on-disk mtime; if the file is missing entirely, leave the
     existing <lastmod> untouched and report it.
  3. Write back only the date portion (YYYY-MM-DD) of the git timestamp,
     matching the existing sitemap convention.

Exit 0 on success (with a summary of how many entries changed / were left
unresolved), 1 if sitemap.xml could not be parsed at all.
"""
from __future__ import annotations

import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITEMAP = ROOT / "sitemap.xml"
SITE_ORIGIN = "https://cestovatel69.cz"


def url_to_relpath(loc: str) -> str:
    """Map a sitemap <loc> URL to a repo-relative file path."""
    assert loc.startswith(SITE_ORIGIN), f"unexpected origin in {loc!r}"
    path = loc[len(SITE_ORIGIN):]
    if not path.startswith("/"):
        path = "/" + path
    path = path.lstrip("/")
    if path == "" or path.endswith("/"):
        path = path + "index.html"
    return path


def git_lastmod_date(relpath: str) -> str | None:
    """Return YYYY-MM-DD of the file's last commit, or None if no history."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%aI", "--", relpath],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip()
    except subprocess.CalledProcessError:
        return None
    if not out:
        return None
    # %aI is strict ISO 8601, e.g. 2026-06-12T11:28:08+02:00
    return out[:10]


def mtime_fallback_date(relpath: str) -> str | None:
    p = ROOT / relpath
    if not p.exists():
        return None
    dt = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc)
    return dt.strftime("%Y-%m-%d")


def main():
    dry_run = "--dry-run" in sys.argv

    if not SITEMAP.exists():
        print(f"FAIL: {SITEMAP} not found")
        return 1

    xml = SITEMAP.read_text(encoding="utf-8")

    url_block_re = re.compile(
        r"(<url>\s*<loc>([^<]+)</loc>\s*<lastmod>)([^<]*)(</lastmod>)",
        re.DOTALL,
    )

    changed = 0
    unresolved = []
    total = 0

    def repl(m):
        nonlocal changed
        total_local = None
        prefix, loc, old_date, suffix = m.group(1), m.group(2), m.group(3), m.group(4)
        relpath = url_to_relpath(loc.strip())
        new_date = git_lastmod_date(relpath)
        source = "git"
        if new_date is None:
            new_date = mtime_fallback_date(relpath)
            source = "mtime"
        if new_date is None:
            unresolved.append((loc, relpath))
            return m.group(0)  # leave untouched
        if new_date != old_date:
            changed += 1
        return f"{prefix}{new_date}{suffix}"

    total = len(url_block_re.findall(xml))
    new_xml = url_block_re.sub(repl, xml)

    print(f"sitemap.xml: {total} <url> entries scanned")
    print(f"  lastmod values changed: {changed}")
    if unresolved:
        print(f"  unresolved (no git history AND no file on disk) -- left untouched: {len(unresolved)}")
        for loc, relpath in unresolved:
            print(f"    {loc}  ->  {relpath}")

    distinct_dates = set(re.findall(r"<lastmod>([^<]*)</lastmod>", new_xml))
    print(f"  distinct lastmod values after regen: {len(distinct_dates)}")

    if dry_run:
        print("DRY RUN -- sitemap.xml not written")
        return 0

    SITEMAP.write_text(new_xml, encoding="utf-8", newline="\n")
    print(f"WROTE {SITEMAP}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
