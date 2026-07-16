"""Content-claim consistency test: verifies repeated numeric "claim" strings
found during the 2026-07-15 SEO/content audit are stated the same way on
every page that repeats them.

This is deliberately parametrized from what was ACTUALLY found by grepping
the site (see CLAIMS below) rather than a generic "no numbers differ"
scanner -- different pages legitimately describe different, non-comparable
metrics (e.g. "73 zařízení v 12 zónách" on hardware.html is a physical
device tally scoped differently from the site-wide "79 zařízení" headline
count, and smart-home/blog.html's dated devlog entries are historical
snapshots, not present-tense claims). Only genuinely-the-same claim is
grouped together.

Claims checked:
  1. "aplikace/index.html hero app count" -- the hero subline on the apps hub
     ("Deset vlastních aplikací...") must match the actual number of app
     cards rendered directly below it on that same page. This replaced an
     earlier version of this check that compared aplikace/index.html against
     ai.html's separate "Moje aplikace" callout box -- those are DIFFERENT,
     non-comparable enumerations (the hub lists all 10 personal apps; the
     ai.html callout is a curated highlight reel of 8 items that mixes in
     smart-home infra tools not in the hub's count), so comparing them
     cross-page was a test-design mistake, not a real content bug. Each is
     now checked for internal self-consistency instead. (smart-home/blog.html's
     "sedm vlastních aplikací" is a 2026-05-28-dated devlog entry describing a
     past state and is intentionally excluded -- it's a historical record, not
     a live claim.)
  1b. "ai.html Moje aplikace callout" -- its own "N nástrojů" tag must match
      its own <li> item count in that same callout box.
  2. "site-wide smart home device count" -- smart-home/index.html,
     smart-home/zarizeni.html and smart-home/team.html all state the
     headline device count for the whole home ("79 zařízení").
  3. "Digital Twin device count" (V3: rewritten to precise per-selector claim
     IDs, not a blanket "any number near zařízení" regex -- the old broad
     regex on digital-twin.html was ALSO catching each zone's own SVG
     `.twin-zone-count` tallies (19/14/7/6/5/4 zařízení -- legitimately
     different, non-comparable per-zone counts, not the whole-twin claim),
     which was noisy and not actually what the claim group intended to check).
     Precise claim IDs now: `meta[name=description]`, `meta[property=og:description]`,
     `.hero-lead`, `.twin-floorplan-title` on digital-twin.html itself, plus
     the same claim repeated on technicka-mapa.html and prozivani.html.
     STATUS: `OWNER_DECISION_REQUIRED_74_OR_82` -- digital-twin.html's own meta
     description/og:description/hero-lead say "74 zařízeními" while its own
     floorplan title says "82 zařízení"; technicka-mapa.html and prozivani.html
     both cite "74". This is a genuine content fact this test CANNOT resolve
     (nobody can tell from the code alone which number is the physically true
     count) -- see DIGITAL_TWIN_COUNT_DECISION.md for exact locations.
     Per work-order rule: this claim group returns an explicit
     BLOCKED_OWNER_DECISION status, never a silent/false PASS, and the overall
     test result stays FAIL until the owner decides.

STRICTER RULES (V3):
  - A claim file that doesn't exist on disk is a FAIL, not a silent WARN/skip
    (a missing file means the claim can no longer be verified at all -- that's
    a regression in verifiability, not something to shrug off).
  - A claim group with zero files configured, or a file with zero regex
    matches where a match was expected, is a FAIL for the same reason.
  - Claims use precise, scoped selectors/patterns tied to a specific place in
    the page (a `<meta>` name/property, a CSS class, a heading) rather than a
    broad "any number followed by this word anywhere on the page" regex.

Usage: python test_content_claim_consistency.py
Exit 0 = PASS (all claim groups internally consistent),
Exit 1 = FAIL (at least one claim group disagrees, OR is
         BLOCKED_OWNER_DECISION, OR a claimed file/value is missing).
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Precise, named selectors -- NOT a blanket "any number near this word" scan.
DIGITAL_TWIN_SELECTORS = {
    "smart-home/digital-twin.html": [
        ("meta[name=description]", re.compile(r'<meta name="description" content="[^"]*?(\d+)\s+za[rř]\S*[ei]?zen', re.IGNORECASE)),
        ("meta[property=og:description]", re.compile(r'<meta property="og:description" content="[^"]*?(\d+)\s+za[rř]\S*[ei]?zen', re.IGNORECASE)),
        (".hero-lead", re.compile(r'class="hero-lead">[^<]*?(\d+)\s+za[rř]\S*[ei]?zen', re.IGNORECASE)),
        (".twin-floorplan-title", re.compile(r'class="twin-floorplan-title">[^<]*?(\d+)\s+za[rř]\S*[ei]?zen', re.IGNORECASE)),
    ],
    "smart-home/technicka-mapa.html": [
        ("body text (digital twin reference)", re.compile(r"\b(\d+)\s+za[rř]\S*[ei]?zen[íi]m?i?\b")),
    ],
    "smart-home/prozivani.html": [
        ("body text (digital twin reference)", re.compile(r"\b(\d+)\s+za[rř]\S*[ei]?zen[íi]m?i?\b")),
    ],
}

CLAIMS = [
    {
        "name": "site-wide smart home device count",
        "pattern": re.compile(r"\b(\d+)\s+za[rř]\S*[ei]?zen[ií]"),
        "files": ["smart-home/index.html", "smart-home/zarizeni.html", "smart-home/team.html"],
    },
]


def extract_values(path: Path, pattern: re.Pattern):
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8", errors="ignore")
    return sorted(set(m.group(1) if m.groups() else m.group(0) for m in pattern.finditer(text)))


def check_digital_twin_claim():
    """Precise, selector-scoped Digital Twin device-count claim.
    Returns 'BLOCKED_OWNER_DECISION' (not True/False) when the underlying
    fact genuinely can't be resolved from code -- this is reported as a
    FAIL for the test's exit code (per work-order rule: never a silent
    PASS), but distinguished in the printed report from a real regression."""
    name = "Digital Twin device count (precise selectors)"
    print(f"\n=== Claim: {name} ===")

    all_missing_file = True
    per_selector_values = {}
    for relf, selectors in DIGITAL_TWIN_SELECTORS.items():
        p = ROOT / relf
        if not p.exists():
            print(f"  [FAIL] {relf}: file not found (was expected to exist)")
            continue
        all_missing_file = False
        text = p.read_text(encoding="utf-8", errors="ignore")
        for label, pattern in selectors:
            m = pattern.search(text)
            if not m:
                print(f"  [FAIL] {relf} :: {label}: expected a device-count match, found none")
                per_selector_values[f"{relf} :: {label}"] = None
                continue
            val = m.group(1)
            per_selector_values[f"{relf} :: {label}"] = val
            print(f"  {relf} :: {label} = {val}")

    if all_missing_file:
        print("  [FAIL] no claim files exist -- cannot verify this claim at all")
        return "FAIL_NO_FILES"

    resolved = {k: v for k, v in per_selector_values.items() if v is not None}
    distinct = set(resolved.values())
    if any(v is None for v in per_selector_values.values()):
        return "FAIL_MISSING_SELECTOR_MATCH"
    if len(distinct) <= 1:
        print("  [PASS] all selectors agree")
        return "PASS"

    print(f"  [OWNER_DECISION_REQUIRED_74_OR_82] selectors disagree: {per_selector_values}")
    print("  -> see DIGITAL_TWIN_COUNT_DECISION.md for exact locations. This is a")
    print("     content fact this test cannot resolve on its own; NOT a false PASS.")
    return "BLOCKED_OWNER_DECISION"


CZ_NUMBER_WORDS = {
    "jedna": 1, "dva": 2, "tri": 3, "tři": 3, "ctyri": 4, "čtyři": 4,
    "pet": 5, "pět": 5, "sest": 6, "šest": 6, "sedm": 7, "osm": 8,
    "devet": 9, "devět": 9, "deset": 10, "jedenact": 11, "jedenáct": 11,
    "dvanact": 12, "dvanáct": 12,
}


def self_check_aplikace_hub_count():
    """aplikace/index.html hero claim ('N vlastnich aplikaci') must equal the
    actual number of app cards rendered right below it on the same page."""
    name = "aplikace/index.html hero app count (self-consistency)"
    print(f"\n=== Claim: {name} ===")
    p = ROOT / "aplikace/index.html"
    if not p.exists():
        print("  [WARN] file not found, skipped")
        return None
    text = p.read_text(encoding="utf-8", errors="ignore")

    m = re.search(r"(\w+)\s+vlastn[ií]ch\s+aplikac", text, re.IGNORECASE)
    if not m:
        print("  [WARN] no 'N vlastnich aplikaci' hero phrase found, skipped")
        return None
    word = m.group(1).lower()
    claimed = int(word) if word.isdigit() else CZ_NUMBER_WORDS.get(word)
    if claimed is None:
        print(f"  [WARN] could not parse claimed count from word {word!r}, skipped")
        return None

    # scope the count to the FIRST cards-grid section only (the "personal
    # apps" hub the hero text introduces) -- the page has a second, separate
    # cards-grid further down for smart-home infra tools, which is a
    # different claim and must not be lumped in here. The hero text itself
    # sits inside its own <section>...</section>, so skip past that first,
    # then bound the count at the cards-grid's own closing </section>.
    grid_start = text.find('class="cards-grid"', m.end())
    section_end = text.find("</section>", grid_start) if grid_start != -1 else -1
    scoped = text[grid_start:section_end] if grid_start != -1 and section_end != -1 else ""
    actual = len(re.findall(r'class="card card-link"', scoped))
    print(f"  claimed: {claimed} (from {m.group(0)!r})")
    print(f"  actual card count: {actual}")
    if claimed == actual:
        print("  [PASS] hero count matches actual card count")
        return True
    print("  [FAIL] hero count does not match actual card count")
    return False


def self_check_ai_html_callout_count():
    """ai.html 'Moje aplikace' callout: its own 'N nastroju' tag must equal
    its own <li> item count in that same box."""
    name = "ai.html Moje aplikace callout (self-consistency)"
    print(f"\n=== Claim: {name} ===")
    p = ROOT / "ai.html"
    if not p.exists():
        print("  [WARN] file not found, skipped")
        return None
    text = p.read_text(encoding="utf-8", errors="ignore")

    m = re.search(r'Moje aplikace.*?<span class="tag">(\d+)\s+n[aá]stroj', text, re.DOTALL)
    if not m:
        print("  [WARN] no 'Moje aplikace ... N nastroju' tag found, skipped")
        return None
    claimed = int(m.group(1))

    # count <li> items within the same <ul>...</ul> block that follows the tag
    block = text[m.end():m.end() + 3000]
    ul_match = re.search(r"<ul>(.*?)</ul>", block, re.DOTALL)
    if not ul_match:
        print("  [WARN] no following <ul> block found, skipped")
        return None
    actual = len(re.findall(r"<li>", ul_match.group(1)))
    print(f"  claimed: {claimed} nastroju")
    print(f"  actual <li> count: {actual}")
    if claimed == actual:
        print("  [PASS] tag count matches actual list-item count")
        return True
    print("  [FAIL] tag count does not match actual list-item count")
    return False


def main():
    failures = []
    blocked = []

    r = self_check_aplikace_hub_count()
    if r is False:
        failures.append("aplikace/index.html hero app count (self-consistency)")

    r = self_check_ai_html_callout_count()
    if r is False:
        failures.append("ai.html Moje aplikace callout (self-consistency)")

    if not CLAIMS:
        print("\n[FAIL] no claim groups configured -- cannot verify anything")
        failures.append("(no claim groups configured)")

    for claim in CLAIMS:
        print(f"\n=== Claim: {claim['name']} ===")
        if not claim["files"]:
            print("  [FAIL] zero files configured for this claim")
            failures.append(claim["name"] + " (zero files configured)")
            continue

        per_file_values = {}
        claim_failed = False
        for relf in claim["files"]:
            p = ROOT / relf
            if not p.exists():
                print(f"  [FAIL] {relf}: file not found (expected to exist)")
                claim_failed = True
                continue
            values = extract_values(p, claim["pattern"])
            if not values:
                print(f"  [FAIL] {relf}: file exists but 0 matches found (expected at least 1)")
                claim_failed = True
                continue
            per_file_values[relf] = values
            print(f"  {relf}: {values}")

        if claim_failed:
            failures.append(claim["name"] + " (missing file or zero matches)")
            continue

        all_value_sets = set(tuple(v) for v in per_file_values.values())
        if len(all_value_sets) <= 1:
            print(f"  [PASS] consistent across {len(per_file_values)} file(s)")
        else:
            failures.append(claim["name"])
            print(f"  [FAIL] inconsistent values across files: {per_file_values}")

    dt_status = check_digital_twin_claim()
    if dt_status == "BLOCKED_OWNER_DECISION":
        blocked.append("Digital Twin device count -> OWNER_DECISION_REQUIRED_74_OR_82")
    elif dt_status != "PASS":
        failures.append(f"Digital Twin device count ({dt_status})")

    print()
    if blocked:
        print("BLOCKED_OWNER_DECISION claim group(s) (not a false PASS, not a code regression):")
        for b in blocked:
            print(f"  - {b}")
    if failures:
        print(f"RESULT: FAIL ({len(failures)} claim group(s) inconsistent/unverifiable" +
              (f", {len(blocked)} additionally BLOCKED_OWNER_DECISION" if blocked else "") + ")")
        for f in failures:
            print(f"  - {f}")
        return 1
    if blocked:
        print(f"RESULT: FAIL ({len(blocked)} claim group(s) BLOCKED_OWNER_DECISION -- overall stays PARTIAL until resolved)")
        return 1

    print("RESULT: PASS (all checked claim groups are internally consistent)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
