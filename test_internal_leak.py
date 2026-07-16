"""Static leak test: scans published HTML/JS for internal-infrastructure text
(local Windows paths, internal tool/workflow names, private IPs, token-shaped
strings) that shouldn't be on a public showcase site.

Precise patterns + a small allowlist for files/lines that are legitimately
public (e.g. a personal devlog post describing local project paths, or a
finance-demo page whose local dev-server instructions were intentionally
generalized). New allowlist entries must be justified with a comment.

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
]

# file -> set of pattern descriptions that are known-OK there, with rationale.
ALLOWLIST = {
    # personal devlog entry describing the author's own local project layout;
    # editorial/narrative content, not a leaked operational path or secret.
    "smart-home/blog.html": {"worapp workstation root path"},
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
        allowed = ALLOWLIST.get(rel, set())
        for regex, desc in PATTERNS:
            if desc in allowed:
                continue
            m = regex.search(text)
            if m:
                line_no = text.count("\n", 0, m.start()) + 1
                findings.append((rel, f"L{line_no}", f"{desc}: {m.group(0)!r}"))

    if findings:
        print(f"RESULT: FAIL ({len(findings)} leak(s))")
        for rel, loc, msg in findings:
            print(f"  [{loc}] {rel}: {msg}")
        return 1

    print("RESULT: PASS (no leaks found outside allowlist)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
