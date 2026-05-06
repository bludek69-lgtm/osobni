#!/usr/bin/env python3
"""
Demo server pro Ucetni_kniha_v4 dashboard.
Pouze static file serving - bez refresh endpointu (demo nema real data).
"""
import sys
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

import http.server
import socketserver
from pathlib import Path

ROOT = Path(__file__).parent.parent.resolve()
PORT = 8080


class DemoHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        if '404' in str(args) or '500' in str(args):
            sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()


def main():
    print(f"[demo server] Ucetni kniha v4 - DEMO showcase")
    print(f"   Root:  {ROOT}")
    print(f"   Port:  {PORT}")
    print()
    print(f"   Otevri:  http://localhost:{PORT}/Ucetni_kniha_v4.html")
    print()
    print(f"   Vypnuti: Ctrl+C")
    print()

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(('localhost', PORT), DemoHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n[stop] Demo server zastaven.")


if __name__ == '__main__':
    main()
