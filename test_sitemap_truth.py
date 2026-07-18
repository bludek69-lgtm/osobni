"""Sitemap-truth test: verifies sitemap.xml actually reflects reality.

Checks:
  1. Every <loc> URL maps to a real file on disk (fails otherwise).
  2. <lastmod> values are not all identical across the whole file -- a single
     hardcoded date for 195+ entries is a strong signal it wasn't derived
     from real per-page history. We require at least a small minimum of
     distinct values (see MIN_DISTINCT_LASTMOD).
  3. No malformed/traversal URLs (must start with SITE_ORIGIN, no "..", no
     backslashes, no whitespace).
  4. Orphans -- real HTML files on disk that are NOT listed in sitemap.xml
     -- are reported as WARNINGS, not failures (some are legitimately
     excluded, e.g. 404.html, drafts).

Usage: python test_sitemap_truth.py
Exit 0 = PASS, 1 = FAIL.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITEMAP = ROOT / "sitemap.xml"
SITE_ORIGIN = "https://cestovatel69.cz"

# Files that are legitimately never listed in sitemap.xml (error pages,
# drafts, etc.) -- excluded from the orphan warning list.
ORPHAN_ALLOWLIST = {
    "404.html",  # error page, must never be indexed
}

SKIP_DIRS = {".git", "node_modules", "_data", "_docs", ".claude"}

MIN_DISTINCT_LASTMOD = 2  # bare minimum proof it's not one hardcoded date


def url_to_relpath(loc: str) -> str | None:
    if not loc.startswith(SITE_ORIGIN):
        return None
    path = loc[len(SITE_ORIGIN):]
    if not path.startswith("/"):
        return None
    path = path.lstrip("/")
    if path == "" or path.endswith("/"):
        path = path + "index.html"
    return path


def is_malformed(loc: str) -> str | None:
    if not loc.startswith(SITE_ORIGIN):
        return "does not start with site origin"
    if ".." in loc:
        return "contains path traversal '..'"
    if "\\" in loc:
        return "contains backslash"
    if re.search(r"\s", loc):
        return "contains whitespace"
    return None


def main():
    failures = []
    warnings = []

    if not SITEMAP.exists():
        print("RESULT: FAIL (sitemap.xml not found)")
        return 1

    xml = SITEMAP.read_text(encoding="utf-8")
    url_blocks = re.findall(r"<url>\s*<loc>([^<]+)</loc>\s*<lastmod>([^<]*)</lastmod>", xml, re.DOTALL)

    if not url_blocks:
        print("RESULT: FAIL (no <url> entries parsed from sitemap.xml)")
        return 1

    print(f"[INFO] {len(url_blocks)} <url> entries found in sitemap.xml")

    # --- Check 1: malformed / traversal URLs ---
    malformed = []
    for loc, _ in url_blocks:
        reason = is_malformed(loc)
        if reason:
            malformed.append((loc, reason))
    if malformed:
        failures.append(f"{len(malformed)} malformed URL(s)")
        for loc, reason in malformed:
            print(f"  [FAIL] malformed URL: {loc}  ({reason})")
    else:
        print("[PASS] no malformed/traversal URLs")

    # --- Check 2: every URL maps to a real file on disk ---
    missing_files = []
    for loc, _ in url_blocks:
        relpath = url_to_relpath(loc)
        if relpath is None:
            continue  # already reported as malformed above
        if not (ROOT / relpath).exists():
            missing_files.append((loc, relpath))
    if missing_files:
        failures.append(f"{len(missing_files)} sitemap URL(s) with no matching file on disk")
        for loc, relpath in missing_files:
            print(f"  [FAIL] {loc}  ->  {relpath} (file not found)")
    else:
        print("[PASS] every sitemap URL corresponds to a real file on disk")

    # --- Check 3: lastmod values show real variance, not one hardcoded date ---
    distinct_dates = sorted(set(d for _, d in url_blocks))
    if len(distinct_dates) < MIN_DISTINCT_LASTMOD:
        failures.append(
            f"lastmod values show no real variance ({len(distinct_dates)} distinct value(s): {distinct_dates}) "
            f"-- looks hardcoded rather than derived from real per-page history"
        )
        print(f"  [FAIL] only {len(distinct_dates)} distinct lastmod value(s): {distinct_dates}")
    else:
        print(f"[PASS] lastmod values show real variance ({len(distinct_dates)} distinct values: {distinct_dates})")

    # --- Check 4: orphans (files on disk not in sitemap) -- warning only ---
    sitemap_files = set()
    for loc, _ in url_blocks:
        relpath = url_to_relpath(loc)
        if relpath:
            sitemap_files.add(relpath)

    all_html = set()
    for p in ROOT.glob("**/*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        all_html.add(p.relative_to(ROOT).as_posix())

    orphans = sorted(f for f in (all_html - sitemap_files) if f not in ORPHAN_ALLOWLIST)
    if orphans:
        warnings.append(f"{len(orphans)} orphan file(s) on disk not listed in sitemap.xml")
        for o in orphans:
            print(f"  [WARN] orphan (not in sitemap): {o}")
    else:
        print("[PASS] no unexplained orphan files (beyond allowlist)")

    print()
    if failures:
        print(f"RESULT: FAIL ({len(failures)} check(s) failed)")
        for f in failures:
            print(f"  - {f}")
        return 1

    if warnings:
        print(f"RESULT: PASS (with {len(warnings)} warning(s) -- see [WARN] lines above)")
    else:
        print("RESULT: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
