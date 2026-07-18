"""Static image-integrity gate for the whole site.

Scans every raster image file referenced from published HTML (png/jpg/jpeg/
gif/webp) and every .svg icon, and verifies each one is a REAL, decodable
image with non-zero dimensions -- not an HTML page (e.g. a Google
consent-wall redirect response) saved under an image extension.

This is the regression test for the nest-mini.png / viomi-v7-vacuum.png
content-integrity bug (V4-P2-02): both files were confirmed by byte
inspection to be HTML documents saved with a .png extension. They have
since been replaced with original SVG icon illustrations
(smart-home/assets/hardware/icons/nest-mini.svg,
smart-home/assets/hardware/icons/viomi-v7-vacuum.svg); this test exists so
that class of failure can never silently reappear on this or any other page.

Usage: python test_image_integrity.py
Exit 0 = PASS, 1 = FAIL. Prints a per-file report either way.
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("FAIL: Pillow not installed (pip install pillow)")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
SKIP_DIRS = {".git", "node_modules", "_data", "handoff"}
RASTER_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}

HTML_SIGNATURE = re.compile(rb"^\s*(<!doctype html|<html\b)", re.I)


def iter_referenced_images():
    """All raster/svg image files physically present under the site root
    (not just ones referenced by src=, so an orphaned bad file can't hide)."""
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        if p.suffix.lower() in RASTER_EXTS or p.suffix.lower() == ".svg":
            yield p


def check_raster(path, findings):
    head = path.read_bytes()[:512]
    if HTML_SIGNATURE.match(head):
        findings.append((path, "FAIL", "file content is HTML (consent-wall/redirect artifact), not an image"))
        return
    try:
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            w, h = im.size
            if w <= 0 or h <= 0:
                findings.append((path, "FAIL", f"decoded but zero/invalid dimensions ({w}x{h})"))
                return
            fmt = im.format
    except Exception as e:
        findings.append((path, "FAIL", f"could not decode as an image: {e}"))
        return
    findings.append((path, "PASS", f"{fmt} {w}x{h}"))


def check_svg(path, findings):
    data = path.read_bytes()
    if HTML_SIGNATURE.match(data[:512]):
        findings.append((path, "FAIL", "file content is HTML, not SVG"))
        return
    try:
        root = ET.fromstring(data)
    except ET.ParseError as e:
        findings.append((path, "FAIL", f"not well-formed XML/SVG: {e}"))
        return
    tag = root.tag.split("}")[-1]
    if tag != "svg":
        findings.append((path, "FAIL", f"root element is <{tag}>, not <svg>"))
        return
    w = root.get("width")
    h = root.get("height")
    vb = root.get("viewBox")
    if not vb and not (w and h):
        findings.append((path, "FAIL", "no viewBox and no width/height -- zero-size risk"))
        return
    findings.append((path, "PASS", f"valid svg (viewBox={vb!r} width={w!r} height={h!r})"))


def main():
    findings = []
    count = 0
    for path in iter_referenced_images():
        count += 1
        if path.suffix.lower() == ".svg":
            check_svg(path, findings)
        else:
            check_raster(path, findings)

    failed = [f for f in findings if f[1] == "FAIL"]
    for path, status, msg in findings:
        if status == "FAIL":
            print(f"[{status}] {path.relative_to(ROOT).as_posix()}: {msg}")

    print()
    print(f"Scanned {count} image file(s).")
    if failed:
        print(f"RESULT: FAIL ({len(failed)} broken image(s))")
        return 1
    print("RESULT: PASS (all images are real, decodable, non-zero-size)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
