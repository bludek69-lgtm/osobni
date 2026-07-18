"""Static regression guard for the smart-home skip-link fix (T3, V5).

No headless-browser automation library (Playwright/Puppeteer/Selenium) is
installed in this environment, so this is NOT a substitute for the real
interactive verification performed once via the Claude Browser MCP tool
(see SKIP_LINK_INTERACTION_EVIDENCE.md for that transcript: real Tab-target
focus, click-activation, location.hash === '#main', document.activeElement
=== the <main id="main"> element, checked on desktop + a 390x844 mobile
viewport, on two different smart-home pages).

What this script guards against instead: someone editing/removing the JS
wiring in smart-home/script.js later without noticing it silently breaks
the fix again (the exact way the bug was introduced originally — a static
skip-link with no focus-management script ever wired to it).

Checks, per every smart-home/*.html page carrying a static `.skip-link`:
  1. the page has exactly one `<a href="#main" class="skip-link">`
  2. the page has an element with id="main"
  3. the page loads smart-home/script.js (the shared script that wires
     the click handler for all of these pages)
  4. smart-home/script.js itself contains the specific wiring: a
     `.skip-link` query, a `tabindex` assignment on the `#main` lookup, and
     a `.focus()` call inside a click handler -- not just any focus() call
     anywhere in the file.

Usage: python test_skiplink_wiring.py
Exit 0 = PASS, 1 = FAIL.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT_JS = ROOT / "smart-home" / "script.js"


def main():
    findings = []

    if not SCRIPT_JS.exists():
        print("FAIL: smart-home/script.js not found")
        return 1
    js = SCRIPT_JS.read_text(encoding="utf-8")

    has_selector = "querySelector('.skip-link')" in js or 'querySelector(".skip-link")' in js
    has_main_lookup = "getElementById('main')" in js or 'getElementById("main")' in js
    has_tabindex_set = bool(re.search(r"setAttribute\(\s*['\"]tabindex['\"]", js))
    # focus() call must appear after a click-handler registration in the same block,
    # not just anywhere in the file -- crude but sufficient ordering check.
    click_block_match = re.search(
        r"skipLink\.addEventListener\(\s*['\"]click['\"][\s\S]{0,200}?\.focus\(\)", js
    )

    if not has_selector:
        findings.append("script.js no longer selects '.skip-link'")
    if not has_main_lookup:
        findings.append("script.js no longer looks up #main")
    if not has_tabindex_set:
        findings.append("script.js no longer sets a tabindex attribute (target would not be focusable)")
    if not click_block_match:
        findings.append("script.js no longer wires a click handler on the skip-link that calls .focus()")

    pages_checked = 0
    pages_missing_main_js_link = []
    for html_path in sorted(ROOT.glob("smart-home/*.html")):
        text = html_path.read_text(encoding="utf-8", errors="ignore")
        if 'class="skip-link"' not in text:
            continue
        pages_checked += 1
        rel = html_path.relative_to(ROOT).as_posix()

        skip_count = text.count('class="skip-link"')
        if skip_count != 1:
            findings.append(f"{rel}: expected exactly 1 skip-link, found {skip_count}")

        if 'id="main"' not in text:
            findings.append(f"{rel}: has a skip-link but no id=\"main\" target")

        if 'src="script.js"' not in text:
            pages_missing_main_js_link.append(rel)

    if pages_missing_main_js_link:
        findings.append(
            f"{len(pages_missing_main_js_link)} page(s) with a skip-link don't load "
            f"smart-home/script.js (fix wiring wouldn't apply there): "
            + ", ".join(pages_missing_main_js_link[:5])
            + (" ..." if len(pages_missing_main_js_link) > 5 else "")
        )

    print(f"Checked smart-home/script.js wiring + {pages_checked} smart-home page(s) with a skip-link.")
    if findings:
        print(f"RESULT: FAIL ({len(findings)} issue(s))")
        for f in findings:
            print(f"  - {f}")
        return 1
    print("RESULT: PASS (skip-link wiring present and consistently applied)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
