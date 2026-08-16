"""
Telegram Relay Proxy Server for Pakistan & Restricted Networks
==============================================================
This server runs locally on your PC (or cloud server) and acts as a bridge
between your web application frontend and the official Telegram Bot API.

Because direct browser-to-Telegram requests are blocked/censored by Pakistani ISPs,
the frontend website sends message payloads to this Python server (http://localhost:5000/api/send).
This server then forwards the message directly to https://api.telegram.org/bot<TOKEN>/sendMessage.

Zero external dependencies required (uses built-in Python standard library).
"""

import http.server
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from socketserver import ThreadingMixIn

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ----------------------------------------------------------------------
# 1. Configuration & .env Loader
# ----------------------------------------------------------------------
def load_env_file(filepath=".env"):
    """Simple parser for .env file without requiring third-party libraries."""
    if not os.path.exists(filepath):
        return
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip("'").strip('"')
                if key not in os.environ:
                    os.environ[key] = val
    except Exception as e:
        print(f"[Warning] Could not read .env: {e}")

# Load .env if present in current or parent directory
load_env_file(".env")
load_env_file(os.path.join(os.path.dirname(__file__), ".env"))

# Telegram Credentials
DEFAULT_BOT_TOKEN = "8997973471:AAGA3F4dK3CoAIu2TGYISlpXpEkMnVDiseA"
DEFAULT_CHAT_ID = "6124348003"

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN") or os.environ.get("VITE_TELEGRAM_BOT_TOKEN") or DEFAULT_BOT_TOKEN
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID") or os.environ.get("VITE_TELEGRAM_CHAT_ID") or DEFAULT_CHAT_ID
PROXY_HOST = os.environ.get("PROXY_HOST", "0.0.0.0")
PROXY_PORT = int(os.environ.get("PROXY_PORT", 5000))
UPSTREAM_PROXY = os.environ.get("UPSTREAM_PROXY") or os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or ""

# Stats
START_TIME = time.time()
STATS = {
    "total_received": 0,
    "total_success": 0,
    "total_failed": 0,
    "last_packet_time": None,
    "last_status": "Ready",
}

# ----------------------------------------------------------------------
# 2. Telegram Forwarder Logic
# ----------------------------------------------------------------------
def forward_to_telegram(text: str, parse_mode: str = "HTML", token: str = None, chat_id: str = None) -> tuple[bool, dict]:
    """
    Sends message packet to Telegram Bot API with optional upstream proxy support.
    """
    active_token = token or BOT_TOKEN
    active_chat_id = chat_id or CHAT_ID

    if not active_token or "YOUR_TELEGRAM_BOT_TOKEN" in active_token:
        return False, {"error": "TELEGRAM_BOT_TOKEN is not configured."}
    if not active_chat_id or "YOUR_TELEGRAM_CHAT_ID" in active_chat_id:
        return False, {"error": "TELEGRAM_CHAT_ID is not configured."}

    telegram_url = f"https://api.telegram.org/bot{active_token}/sendMessage"
    payload = {
        "chat_id": active_chat_id,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": True,
    }
    data_bytes = json.dumps(payload).encode("utf-8")

    # Configure handlers (Proxy or Direct)
    handlers = []
    if UPSTREAM_PROXY:
        proxy_handler = urllib.request.ProxyHandler({
            "http": UPSTREAM_PROXY,
            "https": UPSTREAM_PROXY,
        })
        handlers.append(proxy_handler)

    # SSL Context
    ssl_context = ssl.create_default_context()
    https_handler = urllib.request.HTTPSHandler(context=ssl_context)
    handlers.append(https_handler)

    opener = urllib.request.build_opener(*handlers)
    req = urllib.request.Request(
        telegram_url,
        data=data_bytes,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "PakistanLoanPortal-ProxyServer/1.0",
        },
        method="POST"
    )

    try:
        with opener.open(req, timeout=15) as response:
            resp_body = response.read().decode("utf-8")
            result = json.loads(resp_body)
            return True, result
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = {"error_code": e.code, "description": err_body or str(e)}
        return False, err_json
    except urllib.error.URLError as e:
        return False, {
            "error": "Network Connection Failure",
            "details": str(e.reason),
            "hint": "In Pakistan, Telegram API is blocked by PTA/ISPs. Ensure your PC has an active VPN (like Cloudflare WARP, Psiphon, v2ray) or specify UPSTREAM_PROXY in .env."
        }
    except Exception as e:
        return False, {"error": "Unexpected Error", "details": str(e)}


# ----------------------------------------------------------------------
# 3. HTTP Request Handler with CORS
# ----------------------------------------------------------------------
class TelegramProxyHTTPRequestHandler(http.server.BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        """Custom clean logging to terminal."""
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sys.stdout.write(f"[{ts}] {self.client_address[0]} - {format % args}\n")
        sys.stdout.flush()

    def send_cors_headers(self):
        """Allow browser requests from any port/origin."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Access-Control-Max-Age", "86400")

    def do_OPTIONS(self):
        """Handle CORS pre-flight requests."""
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def send_json_response(self, status_code: int, data: dict):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        """Status & Diagnostic Endpoints."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ["/", "/health", "/api/status"]:
            uptime_sec = int(time.time() - START_TIME)
            masked_token = (
                BOT_TOKEN[:8] + "..." + BOT_TOKEN[-5:]
                if BOT_TOKEN and len(BOT_TOKEN) > 15
                else "NOT_SET"
            )

            status_data = {
                "status": "online",
                "service": "Pakistan Telegram Proxy Server",
                "uptime_seconds": uptime_sec,
                "uptime_human": f"{uptime_sec // 60}m {uptime_sec % 60}s",
                "telegram": {
                    "bot_token": masked_token,
                    "chat_id": CHAT_ID or "NOT_SET",
                    "upstream_proxy": UPSTREAM_PROXY or "Direct / System Network",
                },
                "stats": STATS,
                "endpoints": {
                    "send_message": "POST /api/send",
                    "test_telegram": "GET /api/test",
                    "status_check": "GET /api/status",
                }
            }
            self.send_json_response(200, status_data)
            return

        elif path == "/api/test":
            """Endpoint to verify bot connection from browser or curl."""
            test_msg = (
                f"[TEST] Proxy Server Online & Active!\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"Proxy Host: {PROXY_HOST}:{PROXY_PORT}\n"
                f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
                f"Status: Messages from the website will route through this PC server."
            )
            success, result = forward_to_telegram(test_msg, parse_mode="HTML")
            if success:
                self.send_json_response(200, {
                    "ok": True,
                    "message": "Test notification successfully sent to Telegram!",
                    "telegram_response": result
                })
            else:
                self.send_json_response(502, {
                    "ok": False,
                    "message": "Failed to send message to Telegram.",
                    "error": result
                })
            return

        else:
            self.send_json_response(404, {"error": "Not Found", "available_endpoints": ["/api/send", "/api/test", "/api/status"]})

    def do_POST(self):
        """Handle incoming messages from the frontend website."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path not in ["/api/send", "/api/telegram", "/sendMessage"]:
            self.send_json_response(404, {"error": f"Endpoint '{path}' not found. Use '/api/send'"})
            return

        # Read JSON body
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            self.send_json_response(400, {"ok": False, "error": "Empty request body"})
            return

        try:
            body_raw = self.rfile.read(content_len).decode("utf-8")
            data = json.loads(body_raw)
        except Exception as e:
            self.send_json_response(400, {"ok": False, "error": "Invalid JSON", "details": str(e)})
            return

        text = data.get("text") or data.get("message")
        if not text:
            self.send_json_response(400, {"ok": False, "error": "Missing 'text' field in request body"})
            return

        parse_mode = data.get("parse_mode", "HTML")
        custom_token = data.get("bot_token") or data.get("token")
        custom_chat_id = data.get("chat_id")

        STATS["total_received"] += 1
        ts_str = datetime.now().strftime("%H:%M:%S")

        # Extract title/header for pretty terminal display
        first_line = text.split("\n")[0].replace("<b>", "").replace("</b>", "").strip()
        print(f"\n[RECEIVED] [{ts_str}] Packet #{STATS['total_received']}: {first_line}")

        success, result = forward_to_telegram(
            text=text,
            parse_mode=parse_mode,
            token=custom_token,
            chat_id=custom_chat_id
        )

        STATS["last_packet_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if success:
            STATS["total_success"] += 1
            STATS["last_status"] = "OK"
            print(f"[SUCCESS] [{ts_str}] Successfully delivered packet to Telegram! (Chat ID: {custom_chat_id or CHAT_ID})")
            self.send_json_response(200, {
                "ok": True,
                "message": "Delivered to Telegram",
                "result": result
            })
        else:
            STATS["total_failed"] += 1
            STATS["last_status"] = f"Failed: {result.get('error', 'Unknown')}"
            print(f"[ERROR] [{ts_str}] Telegram delivery failed: {result}")
            self.send_json_response(502, {
                "ok": False,
                "message": "Proxy failed to deliver message to Telegram Bot API",
                "details": result
            })


# ----------------------------------------------------------------------
# 4. Multi-Threaded HTTP Server
# ----------------------------------------------------------------------
class ThreadedHTTPServer(ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


def print_banner():
    banner = f"""
======================================================================
  PAKISTAN TELEGRAM RELAY PROXY SERVER (ONLINE)
======================================================================
  * Local Proxy URL  : http://localhost:{PROXY_PORT}/api/send
  * Network Address  : http://{PROXY_HOST}:{PROXY_PORT}/api/send
  * Status Check     : http://localhost:{PROXY_PORT}/api/status
  * Test Bot Message : http://localhost:{PROXY_PORT}/api/test
----------------------------------------------------------------------
  * Bot Token (env)  : {BOT_TOKEN[:10]}...{BOT_TOKEN[-6:] if len(BOT_TOKEN)>16 else ''}
  * Chat ID (env)    : {CHAT_ID}
  * Upstream Proxy   : {UPSTREAM_PROXY or 'Direct Network (Ensure VPN/WARP is ON if in PK)'}
======================================================================
  Listening for form submissions from the loan portal website...
  (Press Ctrl+C to stop the server)
"""
    print(banner)


def run_server():
    server_address = (PROXY_HOST, PROXY_PORT)
    try:
        httpd = ThreadedHTTPServer(server_address, TelegramProxyHTTPRequestHandler)
    except OSError as e:
        print(f"\n[ERROR] Port {PROXY_PORT} is already in use by another program.")
        print(f"   Change PROXY_PORT in your .env or close the conflicting application.\n")
        sys.exit(1)

    print_banner()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n[STOPPED] Proxy server stopped by user.")
        httpd.server_close()
        sys.exit(0)


if __name__ == "__main__":
    run_server()
