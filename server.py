#!/usr/bin/env python3
"""Bonsen Plays Guitar - tiny local server.

Serves the app from ./web and stores all progress in ./data/progress.json.
No third-party dependencies. Run:  python3 server.py
"""
import json
import os
import shutil
import sys
import threading
import webbrowser
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(ROOT, "web")
DATA_DIR = os.path.join(ROOT, "data")
BACKUP_DIR = os.path.join(DATA_DIR, "backups")
DATA_FILE = os.path.join(DATA_DIR, "progress.json")
PORT = int(os.environ.get("PORT", "8765"))

lock = threading.Lock()


def read_data():
    if not os.path.exists(DATA_FILE):
        return None
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_data(payload):
    os.makedirs(BACKUP_DIR, exist_ok=True)
    # One backup per day, taken before the first write of that day.
    backup = os.path.join(BACKUP_DIR, f"progress-{date.today().isoformat()}.json")
    if os.path.exists(DATA_FILE) and not os.path.exists(backup):
        shutil.copy2(DATA_FILE, backup)
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    os.replace(tmp, DATA_FILE)  # atomic, so a crash never corrupts your data


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def log_message(self, fmt, *args):
        pass  # keep the terminal quiet

    def _json(self, status, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path == "/api/data":
            with lock:
                self._json(200, {"data": read_data()})
            return
        super().do_GET()

    def do_PUT(self):
        if self.path != "/api/data":
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length) or b"null")
        except json.JSONDecodeError:
            self._json(400, {"error": "invalid json"})
            return
        if not isinstance(payload, dict):
            self._json(400, {"error": "expected an object"})
            return
        with lock:
            write_data(payload)
        self._json(200, {"ok": True})


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    try:
        server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except OSError:
        url = f"http://127.0.0.1:{PORT}"
        print(f"Port {PORT} is busy - the app is probably already running at {url}")
        webbrowser.open(url)
        sys.exit(0)
    url = f"http://127.0.0.1:{PORT}"
    print(f"🎸 Bonsen Plays Guitar is running at {url}")
    print(f"   Your progress is saved in {DATA_FILE}")
    print("   Press Ctrl+C to stop.")
    if "--no-browser" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nRock on. 🤘")


if __name__ == "__main__":
    main()
