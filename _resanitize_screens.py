"""Sanitize screenshots for public web — remove identifying location/data.

Actions:
1. Re-capture Energy PC dashboard in SAMPLE mode (proxy pointed at
   192.0.2.1 — TEST-NET, guaranteed black hole — forces sample fallback,
   no real consumption / HDO / LAN IP).
2. Crop the SEMILY location badge from the RPi kiosk topbar by
   overlaying a black rectangle in the top-left ~12% × ~8% region.
3. Remove rpi_home.png (camera feed of driveway + location).

Run from osobni root:
    python _resanitize_screens.py
"""
from __future__ import annotations
import io
import socket
import subprocess
import sys
import time
from pathlib import Path

try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

from PIL import Image, ImageDraw, ImageFilter
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
DASH = ROOT / "assets" / "img" / "aplikace" / "dashboardy"
ENERGY_SCRIPT = Path("C:/.Projekt/.Energy/launchers/energy_server.py")


def free_port(start=5500):
    for p in range(start, start + 40):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    raise RuntimeError("no free port")


# ─── 1) Energy in sample mode ─────────────────────────────────
def capture_energy_sample():
    """Run energy_server with a black-hole RPi URL — proxy will fall back
    to bundled sample, so the dashboard shows sample data only."""
    port = free_port(5500)
    print(f"[energy_sample] launching proxy on :{port} with TEST-NET upstream")
    # 192.0.2.1 is documented TEST-NET-1, will never respond
    proc = subprocess.Popen(
        [sys.executable, str(ENERGY_SCRIPT),
         "--port", str(port), "--bind", "127.0.0.1",
         "--rpi-url", "http://192.0.2.1:8123/never/responds.json"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(2.5)
        # Need to also temporarily move the local cache so the proxy
        # returns 503 (which the JS treats as sample fallback).
        cache = Path("C:/.Projekt/.Energy/dashboard/energy-dashboard.json")
        bak = cache.with_suffix(".json.sanitize-bak")
        moved = False
        if cache.exists():
            cache.rename(bak)
            moved = True
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                ctx = browser.new_context(viewport={"width": 1600, "height": 1000})
                page = ctx.new_page()
                url = f"http://127.0.0.1:{port}/energy_dashboard.html"
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=15000)
                except Exception as e:
                    print(f"  ! goto: {e}")
                # Wait for the JS to attempt fetch & flip data-mode chip to sample
                page.wait_for_timeout(6000)
                dst = DASH / "energy_pc.png"
                page.screenshot(path=str(dst), full_page=False)
                print(f"  -> {dst.name}  ({dst.stat().st_size} B)")
                browser.close()
        finally:
            if moved:
                bak.rename(cache)
    finally:
        try:
            proc.terminate()
        except Exception:
            pass


# ─── 2) Sanitize RPi screens — block SEMILY topbar ────────────
def sanitize_rpi_screens():
    """Overlay a black rectangle over the top-left ~14% × ~9% region
    of each RPi screen to remove the SEMILY location badge. Crop top
    a bit and re-save."""
    screens = ["rpi_audio.png", "rpi_energy.png", "rpi_scenes.png", "rpi_settings.png"]
    for fname in screens:
        p = DASH / fname
        if not p.exists():
            continue
        img = Image.open(p).convert("RGBA")
        w, h = img.size
        # Cover top-left bar containing "SEMILY · VT" / mode pills
        d = ImageDraw.Draw(img)
        # Top-left location badge ~ 0-220 px × 0-50 px on a 1920-wide screen,
        # i.e. ~11.5% wide x ~3% tall. Use 14% × 6% to be safe.
        d.rectangle((0, 0, int(w * 0.14), int(h * 0.06)), fill=(10, 14, 20, 255))
        # Light "Smart Home" text overlay so it doesn't look like a glitch
        try:
            d.text((10, 8), "Smart Home", fill=(124, 214, 255, 255))
        except Exception:
            pass
        img.save(p, "PNG", optimize=True)
        print(f"  ~ {p.name} sanitized ({w}x{h})")


# ─── 3) Remove camera-feed RPi home screen ────────────────────
def remove_camera_screen():
    target = DASH / "rpi_home.png"
    if target.exists():
        target.unlink()
        print(f"  - deleted {target.name} (showed driveway camera)")
    # Also remove cached references later (we'll re-run page builder)


def main():
    DASH.mkdir(parents=True, exist_ok=True)
    print("== 1) Re-capture Energy with sample-only data ==")
    capture_energy_sample()
    print("\n== 2) Sanitize RPi kiosk topbar (mask SEMILY) ==")
    sanitize_rpi_screens()
    print("\n== 3) Remove camera-feed home screen ==")
    remove_camera_screen()
    print("\nDONE")


if __name__ == "__main__":
    main()
