"""Retry capture for Config Center (CC) and Finance Účetní Kniha (UK).
Both apps try to fetch API on startup -> use `load` event (not networkidle)
+ extra wait, plus inject a fake `fetch` that immediately returns empty
data for both to avoid endless promises.
"""
from __future__ import annotations
import io, sys, socket, subprocess, time
from pathlib import Path

try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent / "assets" / "img" / "aplikace"

def free_port(start=5600):
    for p in range(start, start + 40):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    raise RuntimeError("no free port")

def serve_dir(d, port):
    return subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=str(d), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

# Stub: makes window.fetch return empty 200 for any external host so the
# apps can render their shell without waiting for live Homey data.
FETCH_STUB = r"""
(() => {
  const orig = window.fetch;
  window.fetch = (input, init) => {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (url.startsWith('http://192.') || url.startsWith('https://') || url.includes('/api/')) {
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }));
      }
    } catch (e) {}
    return orig.apply(this, arguments);
  };
})();
"""

def shoot(page, url, dst, scroll_to=None):
    page.add_init_script(FETCH_STUB)
    try:
        page.goto(url, wait_until="load", timeout=15000)
    except Exception as e:
        print(f"  ! goto err: {e}")
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=8000)
        except Exception as e2:
            print(f"  ! still failing: {e2}")
            return False
    page.wait_for_timeout(3500)
    if scroll_to:
        page.evaluate(f"window.scrollTo(0, {scroll_to})")
        page.wait_for_timeout(400)
    page.screenshot(path=str(dst), full_page=False)
    print(f"  -> {dst.name} ({dst.stat().st_size} B)")
    return True

def main():
    # CC
    cc_root = Path("C:/.Projekt/.ConfigCenter")
    p_cc = free_port(5610)
    proc_cc = serve_dir(cc_root, p_cc)
    # UK
    uk_root = Path("C:/.Projekt/.FinanceUcetniKniha/apps/finance-ucetni-kniha-windows/dist")
    if not (uk_root / "index.html").exists():
        uk_root = Path("C:/.Projekt/.FinanceUcetniKniha/apps/finance-ucetni-kniha-windows")
    p_uk = free_port(5620)
    proc_uk = serve_dir(uk_root, p_uk)
    time.sleep(2.0)

    try:
        with sync_playwright() as p:
            br = p.chromium.launch(headless=True)
            ctx = br.new_context(viewport={"width": 1600, "height": 1000})

            # CC live shot
            page = ctx.new_page()
            print("[cc] live overview")
            shoot(page, f"http://127.0.0.1:{p_cc}/config_center.html", OUT / "config-center" / "live_overview.png")
            page.close()

            # UK home shot
            page = ctx.new_page()
            print("[uk] home")
            shoot(page, f"http://127.0.0.1:{p_uk}/", OUT / "ucetni-kniha" / "home.png")
            page.close()

            br.close()
    finally:
        for pp in (proc_cc, proc_uk):
            try: pp.terminate()
            except Exception: pass

    print("\nDONE")

if __name__ == "__main__":
    main()
