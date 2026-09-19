"""Static leak test: scans published HTML/JS for internal-infrastructure text
(local Windows paths, internal tool/workflow names, private IPs, token-shaped
strings) that shouldn't be on a public showcase site.

Precise patterns + a small allowlist. The allowlist does NOT waive a whole
pattern for a whole file -- it names the exact matched strings that are
legitimately public there (e.g. a bundled library's upstream attribution URL).
Any other hit of the same pattern in the same file still fails, so an entry
cannot quietly cover a future leak. New entries must be justified with a
comment.

Usage: python test_internal_leak.py
Exit 0 = PASS (no unallowlisted leaks), 1 = FAIL.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCAN_GLOBS = ["**/*.html"]
SKIP_DIRS = {".git", "node_modules", "_data"}

# (pattern, description) -- deliberately precise, not bare word matches.
PATTERNS = [
    (re.compile(r"[A-Za-z]:\\FINANCE\\", re.I), "local Finance data root path"),
    (re.compile(r"[A-Za-z]:\\worapp\\", re.I), "worapp workstation root path"),
    (re.compile(r"[A-Za-z]:/worapp/", re.I), "worapp workstation root path"),
    (re.compile(r"\bOPrava_\d", re.I), "internal OPrava_NN_NN handoff folder name"),
    (re.compile(r"\bMCP\b"), "internal MCP workflow reference"),
    (re.compile(r"\bGmail watcher\b", re.I), "internal Gmail watcher automation name"),
    (re.compile(r"\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b"),
     "internal/private IP address"),
    (re.compile(r"\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['\"][A-Za-z0-9_\-]{8,}['\"]", re.I),
     "possible embedded credential/token"),
    # The site must not link to the author's GitHub account or to the old
    # GitHub Pages copy of the smart-home site. Deliberately does NOT match
    # raw.githubusercontent.com -- that URL is the silent-update manifest the
    # version badges read, and it stays. The owner/repo part is captured as
    # well, so the allowlist can name one concrete URL instead of the whole file.
    (re.compile(r"github\.com/(?:[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)?)?"
                r"|[A-Za-z0-9-]+\.github\.io(?:/[A-Za-z0-9._-]+)?", re.I),
     "public GitHub account/repo URL"),
]

# file -> pattern description -> exact matched strings that are known-OK there
# (compared case-insensitively, and they must equal what the pattern captures).
ALLOWLIST = {
    # Bundled third-party chart library keeps its upstream attribution comment
    # (https://github.com/kurkle/color#readme) -- it points at the library's
    # author, not at this site's own account. If the bundle is ever rebuilt and
    # that URL changes, this test fails on purpose: re-check it, then update.
    "finance/demo/Ucetni_kniha_v4.html": {
        "public GitHub account/repo URL": {"github.com/kurkle/color"},
    },
    # smart-home/blog.html used to be allowlisted for a workstation path from a
    # devlog entry. The text no longer contains it (re-checked 2026-09-12, zero
    # occurrences anywhere in the repo), so the entry was dropped rather than
    # left standing as a blanket waiver.
}


def iter_files():
    for pattern in SCAN_GLOBS:
        for p in ROOT.glob(pattern):
            if any(part in SKIP_DIRS for part in p.parts):
                continue
            yield p


def main():
    findings = []
    for path in iter_files():
        rel = path.relative_to(ROOT).as_posix()
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            findings.append((rel, "ERROR", f"could not read: {e}"))
            continue
        allowed = ALLOWLIST.get(rel, {})
        for regex, desc in PATTERNS:
            ok = {v.lower() for v in allowed.get(desc, ())}
            # Report every distinct value, not just the first hit -- two
            # different leaks of the same class in one file are two findings.
            reported = set()
            for m in regex.finditer(text):
                value = m.group(0)
                key = value.lower()
                if key in ok or key in reported:
                    continue
                reported.add(key)
                line_no = text.count("\n", 0, m.start()) + 1
                findings.append((rel, f"L{line_no}", f"{desc}: {value!r}"))

    if findings:
        print(f"RESULT: FAIL ({len(findings)} leak(s))")
        for rel, loc, msg in findings:
            print(f"  [{loc}] {rel}: {msg}")
        return 1

    print("RESULT: PASS (no leaks found outside allowlist)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
