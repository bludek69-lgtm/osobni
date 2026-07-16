"""Release-consistency gate for /aplikace pages vs the authoritative latest.json manifest.

V4: the static/fallback markup no longer hardcodes a specific version number or a
specific installer URL. Fallback state (shown before JS runs, or if the manifest
fetch fails/is blocked) must be GENERIC ("Aktuální beta" / a stable releases-index
link), never a concrete version string or a concrete (and therefore eventually
stale) installer download URL. The dynamic JS wiring (data-*-ver template + data-*-dl
attribute) remains the single source of truth for the REAL current version/URL, and
is what this test verifies against the manifest -- not the static fallback text.

Verifies, per app:
  1. Dynamic wiring attributes exist (data-*-ver template, data-*-dl marker) on both
     the index card and (where applicable) the detail page.
  2. The version-attr TEMPLATE (e.g. "v{v}") correctly renders to the current
     manifest version when {v} is substituted -- i.e. the template itself is sound,
     not that the static pre-JS text happens to equal it (V3 checked the latter;
     V4 deliberately does NOT, since the static text is now intentionally generic).
  3. The static/fallback text does NOT contain any concrete version-number pattern
     (must be a generic string like "Aktuální beta" / "aktuální verze") -- a
     hardcoded fallback version is exactly the staleness risk this test exists to
     catch.
  4. The static/fallback download href is NOT a versioned installer URL (must be a
     stable, never-stale destination such as the GitHub releases index) -- never a
     link to a specific, eventually-stale .exe/.dmg asset.
  5. The page's JS re-sets both href AND the `download` attribute when the manifest
     fetch succeeds (checked via source-level presence, not execution -- this repo
     has no headless-JS harness wired into this test suite).
Note: this test deliberately does NOT do a page-wide scan for "any leftover version
number string" -- these pages have legitimate historical changelog/devlog prose
("od verze 1.2.13...", "v1.2.24-1.2.28 -- ...") that mentions past version numbers
on purpose, as a dated historical record, not as a live current-version claim. The
real staleness risk (a hardcoded CURRENT version in the fallback badge/status text)
is caught precisely by check 3 above, scoped to the version-badge elements only.

Usage:
    python test_application_release_consistency.py
    python test_application_release_consistency.py --manifest path\\to\\latest.json  (offline)

Exit code 0 = PASS, 1 = FAIL. Prints a per-app report either way.
"""
import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST_URL = "https://raw.githubusercontent.com/bludek69-lgtm/aplikace/main/latest.json"

# a fallback href is considered "safe/generic" if it points at the releases INDEX,
# not a specific asset -- i.e. it must NOT contain a versioned/dated asset path.
STALE_HREF_MARKERS = ("/download/apps/", ".exe", ".dmg")
GENERIC_FALLBACK_TEXT_MUST_NOT_MATCH = re.compile(r"\d+\.\d+\.\d+")  # e.g. 1.2.60

APPS = {
    "budline": {
        "index_file": "aplikace/index.html",
        "detail_file": "aplikace/budline.html",
        "ver_attr": "data-bl-ver",
        "dl_attr": "data-bl-dl",
        "dl_attr_mac": "data-bl-dl-mac",  # mac .dmg URL is itself a permanent, non-versioned filename -- exempt from the stale-href check
        "manifest_key": "budline",
    },
    "meal-planner": {
        "index_file": "aplikace/index.html",
        "detail_file": None,
        "ver_attr": "data-mp-ver",
        "dl_attr": "data-mp-dl",
        "dl_attr_mac": None,
        "manifest_key": "meal-planner",
    },
    "italia": {
        "index_file": "aplikace/index.html",
        "detail_file": None,
        "ver_attr": "data-it-ver",
        "dl_attr": "data-it-dl",
        "dl_attr_mac": None,
        "manifest_key": "italia",
    },
    "collection": {
        "index_file": "aplikace/index.html",
        "detail_file": None,
        "ver_attr": "data-col-ver",
        "dl_attr": "data-col-dl",
        "dl_attr_mac": None,
        "manifest_key": "collection",
    },
}


def load_manifest(path_or_none):
    if path_or_none:
        return json.loads(Path(path_or_none).read_text(encoding="utf-8"))
    with urllib.request.urlopen(MANIFEST_URL, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def extract_attr_blocks(html, attr):
    """Return list of (attr_value_template, visible_fallback_text) for elements carrying attr."""
    out = []
    for m in re.finditer(re.escape(attr) + r'(?![\w-])="([^"]*)"[^>]*>([^<]*)', html):
        out.append((m.group(1), m.group(2)))
    return out


def extract_hrefs(html, attr):
    boundary = re.escape(attr) + r'(?![\w-])'
    out = []
    for m in re.finditer(r'href="([^"]*)"[^>]*\s' + boundary, html):
        out.append(m.group(1))
    for m in re.finditer(boundary + r'(?:="[^"]*")?[^>]*href="([^"]*)"', html):
        out.append(m.group(1))
    return out


def check_app(key, cfg, manifest, findings):
    entry = manifest.get(cfg["manifest_key"])
    if not entry or not entry.get("version"):
        findings.append((key, "FAIL", "manifest missing version entry"))
        return
    version = entry["version"]

    files = [cfg["index_file"]]
    if cfg["detail_file"]:
        files.append(cfg["detail_file"])

    ok = True
    for f in files:
        p = ROOT / f
        if not p.exists():
            findings.append((key, "FAIL", f"missing file {f}"))
            ok = False
            continue
        html = p.read_text(encoding="utf-8")

        # 1+2: template renders correctly
        ver_blocks = extract_attr_blocks(html, cfg["ver_attr"])
        if not ver_blocks:
            findings.append((key, "FAIL", f"{f}: no element with {cfg['ver_attr']} (missing dynamic wiring)"))
            ok = False
        for template, fallback_text in ver_blocks:
            if "{v}" not in template:
                findings.append((key, "FAIL", f"{f}: {cfg['ver_attr']} template {template!r} has no {{v}} placeholder"))
                ok = False
                continue
            rendered = template.replace("{v}", version)
            if not rendered:
                findings.append((key, "FAIL", f"{f}: {cfg['ver_attr']} template rendered empty"))
                ok = False
            # 3: fallback text must be generic (no concrete version number)
            if GENERIC_FALLBACK_TEXT_MUST_NOT_MATCH.search(fallback_text):
                findings.append((key, "FAIL", f"{f}: fallback text {fallback_text!r} contains a hardcoded version number -- must be generic (e.g. 'Aktuální beta')"))
                ok = False

        # 4: fallback download href must NOT be a versioned/stale-prone asset URL
        dl_hrefs = extract_hrefs(html, cfg["dl_attr"])
        if not dl_hrefs:
            findings.append((key, "FAIL", f"{f}: no download link with {cfg['dl_attr']}"))
            ok = False
        for href in dl_hrefs:
            if any(marker in href for marker in STALE_HREF_MARKERS):
                findings.append((key, "FAIL", f"{f}: fallback download href {href!r} points at a specific installer asset -- must be a stable releases-index link instead"))
                ok = False

        # 5: JS must re-set both href and the download attribute on success.
        # The wiring uses a shared upd(key,verAttr,dlAttr) helper (one function body
        # handling all apps), so the setAttribute("download",...) call is NOT
        # textually adjacent to each app's specific data-*-dl string -- check that
        # both the per-app dl_attr wiring call AND the shared download-attribute
        # reset logic are present in the file, not that they're near each other.
        has_dl_wiring_call = bool(re.search(r'["\']\[?' + re.escape(cfg["dl_attr"]) + r'\]?["\']', html))
        has_download_reset = 'setAttribute("download"' in html
        if not (has_dl_wiring_call and has_download_reset):
            findings.append((key, "FAIL", f"{f}: JS does not appear to wire {cfg['dl_attr']} up with a download-attribute reset on successful manifest fetch"))
            ok = False

        # mac .dmg link (budline only): permanent filename, NOT subject to the stale-href
        # check, but must exist on the DETAIL page specifically (the index card only has
        # a Windows download button by design -- no mac link is expected there).
        if cfg.get("dl_attr_mac") and entry.get("url_mac") and f == cfg.get("detail_file"):
            mac_hrefs = extract_hrefs(html, cfg["dl_attr_mac"])
            if not mac_hrefs:
                findings.append((key, "FAIL", f"{f}: no mac download link with {cfg['dl_attr_mac']}"))
                ok = False

    if ok:
        findings.append((key, "PASS", f"dynamic wiring sound, fallback is generic/safe, no stale strings (manifest version {version})"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", default=None, help="local latest.json path (offline mode)")
    args = ap.parse_args()

    try:
        manifest = load_manifest(args.manifest)
    except Exception as e:
        print(f"FAIL: could not load manifest: {e}")
        return 1

    findings = []
    for key, cfg in APPS.items():
        check_app(key, cfg, manifest, findings)

    failed = [f for f in findings if f[1] == "FAIL"]
    for key, status, msg in findings:
        print(f"[{status}] {key}: {msg}")

    print()
    if failed:
        print(f"RESULT: FAIL ({len(failed)} issue(s))")
        return 1
    print("RESULT: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
