"""Static regression guard for the 7-page smart-home mobile-overflow fix (T4, V5).

No headless-browser automation library is installed in this environment (see
MOBILE_OVERFLOW_EVIDENCE.md for the real interactive verification performed
via the Claude Browser MCP tool at 320/375/390/430px on all 7 pages). This
script guards the two CSS rules the fix depends on so a future edit can't
silently remove them without a test failing:

  1. the base `code {}` rule in smart-home/style.css sets `overflow-wrap`
     (root cause of the original bug: a long unbroken inline `<code>`
     string -- a filename/path/hash -- forcing the whole page wider)
  2. `.post-content table {}` gives tables their own safe horizontal
     scroll container instead of forcing the page wider

Usage: python test_mobile_overflow_guard.py
Exit 0 = PASS, 1 = FAIL.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STYLE_CSS = ROOT / "smart-home" / "style.css"

AFFECTED_PAGES = [
    "smart-home/blog.html",
    "smart-home/posts/bathroom-misroute.html",
    "smart-home/posts/dashboard-config-center.html",
    "smart-home/posts/r2-memory-pressure-six-live-patches.html",
    "smart-home/posts/sandbox-24-7-kiosk-phase-e.html",
    "smart-home/posts/sheets-cleanup-v21.html",
    "smart-home/posts/yr-single-source.html",
]


def main():
    findings = []

    if not STYLE_CSS.exists():
        print("FAIL: smart-home/style.css not found")
        return 1
    css = STYLE_CSS.read_text(encoding="utf-8")

    code_block = re.search(r"(?<![.\w-])code\s*\{[^}]*\}", css)
    if not code_block:
        findings.append("no base `code {}` rule found in smart-home/style.css")
    elif "overflow-wrap" not in code_block.group(0):
        findings.append("base `code {}` rule no longer sets overflow-wrap -- inline code can overflow again")

    table_block = re.search(r"\.post-content\s+table\s*\{[^}]*\}", css)
    if not table_block:
        findings.append("no `.post-content table {}` rule found -- responsive table wrapper was removed")
    else:
        body = table_block.group(0)
        if "overflow-x" not in body:
            findings.append("`.post-content table {}` no longer sets overflow-x -- tables can force page width again")
        if "max-width" not in body:
            findings.append("`.post-content table {}` no longer caps max-width")

    missing_pages = [p for p in AFFECTED_PAGES if not (ROOT / p).exists()]
    if missing_pages:
        findings.append(f"expected page(s) missing from repo: {', '.join(missing_pages)}")

    print(f"Checked smart-home/style.css wrap/table rules + presence of all {len(AFFECTED_PAGES)} previously-affected pages.")
    if findings:
        print(f"RESULT: FAIL ({len(findings)} issue(s))")
        for f in findings:
            print(f"  - {f}")
        return 1
    print("RESULT: PASS (overflow-guarding CSS rules intact)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
