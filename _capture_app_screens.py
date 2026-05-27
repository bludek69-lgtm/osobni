"""Capture screenshots of running/serveable web apps for aplikace pages.

Strategy:
- Energy PC dashboard: already running on http://127.0.0.1:5176 (proxy)
- Italia Travel Planner: file:// to dist/index.html (static dist)
- Meal Planner: file:// dist
- Finance UK + FA: serve dist via temporary Python http.server, then capture

Each app: 1-2 screens at 1600x1000, full-page=False (above-the-fold).
"""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "assets" / "img" / "aplikace"
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORT = {"width": 1600, "height": 1000}


def free_port(start=5400):
    for p in range(start, start + 50):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    raise RuntimeError("no free port")


def serve_dir(directory: str, port: int):
    return subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=directory,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def shoot(page, url: str, dst: Path, wait_ms: int = 2500):
    try:
        page.goto(url, wait_until="networkidle", timeout=15000)
    except Exception as e:
        print(f"  ! networkidle timeout {url}: {e}; fallback to domcontentloaded")
        page.goto(url, wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(wait_ms)
    page.screenshot(path=str(dst), full_page=False)
    print(f"  -> {dst.relative_to(Path.cwd()) if dst.is_relative_to(Path.cwd()) else dst}")


def main():
    targets = []

    # 1) Energy PC dashboard (already running via launcher)
    targets.append(("energy_pc", "http://127.0.0.1:5176/energy_dashboard.html", OUT / "dashboardy" / "energy_pc.png", None))

    # 2) Italia Travel Planner (serve dist)
    itp_root = Path("C:/.Projekt/ItaliaTravelPlanner")
    if (itp_root / "index.html").exists():
        port = free_port(5410)
        proc = serve_dir(str(itp_root), port)
        targets.append(("italia_home", f"http://127.0.0.1:{port}/", OUT / "italia-travel" / "home.png", proc))

    # 3) Meal Planner (Krabičková dieta) — dist at apps/meal-planner-web
    mp_root = Path("C:/.Projekt/.MealPlanner/apps/meal-planner-web")
    if (mp_root / "index.html").exists():
        port = free_port(5420)
        proc = serve_dir(str(mp_root), port)
        targets.append(("mp_home", f"http://127.0.0.1:{port}/", OUT / "krabickova-dieta" / "home.png", proc))

    # 4) Finance Účetní Kniha (Windows app dist)
    uk_root = Path("C:/.Projekt/.FinanceUcetniKniha/apps/finance-ucetni-kniha-windows/dist")
    if not (uk_root / "index.html").exists():
        # fallback to non-dist
        uk_alt = Path("C:/.Projekt/.FinanceUcetniKniha/apps/finance-ucetni-kniha-windows")
        if (uk_alt / "index.html").exists():
            uk_root = uk_alt
    if (uk_root / "index.html").exists():
        port = free_port(5430)
        proc = serve_dir(str(uk_root), port)
        targets.append(("uk_home", f"http://127.0.0.1:{port}/", OUT / "ucetni-kniha" / "home.png", proc))

    # 5) Finance Analytik (Windows app dist)
    fa_root = Path("C:/.Projekt/.Finance/apps/finance-analytik-windows/dist")
    if not (fa_root / "index.html").exists():
        fa_alt = Path("C:/.Projekt/.Finance/apps/finance-analytik-windows")
        if (fa_alt / "index.html").exists():
            fa_root = fa_alt
    if (fa_root / "index.html").exists():
        port = free_port(5440)
        proc = serve_dir(str(fa_root), port)
        targets.append(("fa_home", f"http://127.0.0.1:{port}/", OUT / "finance-analytik" / "home.png", proc))

    # 6) Config Center — also live screenshot at 1600 (we have 1920 archived ones,
    #    but a fresh capture is nice as hero)
    cc_root = Path("C:/.Projekt/.ConfigCenter")
    if (cc_root / "config_center.html").exists():
        port = free_port(5450)
        proc = serve_dir(str(cc_root), port)
        targets.append(("cc_live", f"http://127.0.0.1:{port}/config_center.html", OUT / "config-center" / "live_overview.png", proc))

    # Give servers a moment to bind
    time.sleep(1.5)

    procs = [t[3] for t in targets if t[3] is not None]
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            ctx = browser.new_context(viewport=VIEWPORT, device_scale_factor=1)
            for name, url, dst, _ in targets:
                dst.parent.mkdir(parents=True, exist_ok=True)
                print(f"[{name}] -> {url}")
                page = ctx.new_page()
                try:
                    shoot(page, url, dst)
                except Exception as e:
                    print(f"  ! FAIL: {e}")
                finally:
                    page.close()
            browser.close()
    finally:
        for p in procs:
            try:
                p.terminate()
            except Exception:
                pass

    print("\nDONE")


if __name__ == "__main__":
    sys.exit(main() or 0)
