"""Meta-description uniqueness test: verifies no two distinct, real pages
share a byte-identical <meta name="description"> value.

A small allowlist exists for known redirect stubs / near-duplicate mirror
pairs that are intentionally excluded from the uniqueness requirement (none
known at the time this test was written -- kept here as the documented
extension point, same convention as test_internal_leak.py's ALLOWLIST).

Usage: python test_meta_uniqueness.py
Exit 0 = PASS, 1 = FAIL.
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SKIP_DIRS = {".git", "node_modules", "_data", "_docs", ".claude"}

# relpath -> reason it's exempt from uniqueness (e.g. a genuine redirect
# stub that intentionally mirrors another page's metadata). Empty by design;
# new entries must be justified with a comment, same convention as
# test_internal_leak.py.
ALLOWLIST_FILES = set()

DESC_RE = re.compile(r'<meta\s+name="description"\s+content="([^"]*)"', re.IGNORECASE)


def iter_html_files():
    for p in ROOT.glob("**/*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        yield p


def main():
    descs = defaultdict(list)
    unreadable = []

    for p in iter_html_files():
        rel = p.relative_to(ROOT).as_posix()
        try:
            text = p.read_text(encoding="utf-8")
        except Exception as e:
            unreadable.append((rel, str(e)))
            continue
        m = DESC_RE.search(text)
        if not m:
            continue  # pages without a meta description are out of scope here
        descs[m.group(1)].append(rel)

    total_pages = sum(len(v) for v in descs.values())
    print(f"[INFO] {total_pages} page(s) with a <meta name=\"description\"> tag")
    print(f"[INFO] {len(descs)} distinct description string(s)")

    dupes = {}
    for desc, files in descs.items():
        real_files = [f for f in files if f not in ALLOWLIST_FILES]
        if len(real_files) > 1:
            dupes[desc] = real_files

    if unreadable:
        print(f"[WARN] {len(unreadable)} file(s) could not be read:")
        for rel, err in unreadable:
            print(f"  {rel}: {err}")

    if dupes:
        print(f"\nRESULT: FAIL ({len(dupes)} duplicate description group(s))")
        for desc, files in dupes.items():
            print(f"\n  [{len(files)}x] {desc!r}")
            for f in files:
                print(f"     {f}")
        return 1

    print("\nRESULT: PASS (every real page has a distinct meta description)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
