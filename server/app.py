#!/usr/bin/env python3

import json
import socket
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "sample_data.json"
UDP_PAYLOAD_SIZE = 200


def load_data():
    with DATA_FILE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def json_bytes(payload):
    return json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")


def build_udp_payload(message, client="messages_client"):
    payload_text = f"{client}{message}END"
    payload = payload_text.encode("utf-8")
    if len(payload) > UDP_PAYLOAD_SIZE:
        raise ValueError(f"payload exceeds {UDP_PAYLOAD_SIZE} bytes")
    return payload.ljust(UDP_PAYLOAD_SIZE, b" ")


def send_temperature_udp(target_host, target_port, message, client="messages_client"):
    payload = build_udp_payload(message, client=client)
    print(f"Sending UDP payload to {target_host}:{target_port}")
    print(payload.decode("utf-8", errors="replace"))
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(payload, (target_host, target_port))
    return payload


class AppHandler(BaseHTTPRequestHandler):
    server_version = "ETOHTTP/0.1"

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        data = load_data()

        if parsed.path == "/udp/temperature":
            query = parse_qs(parsed.query)
            try:
                target_host = query["targetHost"][0]
                target_port = int(query["targetPort"][0])
                message = query["message"][0]
                client = query.get("client", ["messages_client"])[0]
                payload = send_temperature_udp(target_host, target_port, message, client=client)
            except (KeyError, TypeError, ValueError, IndexError) as exc:
                self.respond_json(400, {"error": str(exc)})
                return

            self.respond_json(200, {"status": "sent", "payloadLength": len(payload), "payload": payload.decode("utf-8", errors="replace").rstrip()})
            return

        if parsed.path == "/health":
            self.respond_json(200, {"status": "ok"})
            return

        if parsed.path == "/stats/overview":
            payload = {
                "overview": data["overview"],
                "trend": data["trend"],
                "topRules": data["topRules"]
            }
            self.respond_json(200, payload)
            return

        if parsed.path == "/rules":
            self.respond_json(200, {"items": data["rules"]})
            return

        if parsed.path.startswith("/rules/"):
            rule_id = parsed.path.rsplit("/", 1)[-1]
            item = next((rule for rule in data["rules"] if rule["id"] == rule_id), None)
            if item:
                self.respond_json(200, item)
            else:
                self.respond_json(404, {"error": "rule not found"})
            return

        if parsed.path == "/events":
            items = data["events"]
            query = parse_qs(parsed.query)

            action = query.get("action", [None])[0]
            rule = query.get("rule", [None])[0]

            if action:
                items = [item for item in items if item["action"] == action]
            if rule:
                items = [item for item in items if item["rule"] == rule]

            self.respond_json(200, {"items": items})
            return

        if parsed.path.startswith("/events/"):
            event_id = parsed.path.rsplit("/", 1)[-1]
            item = next((event for event in data["events"] if event["id"] == event_id), None)
            if item:
                self.respond_json(200, item)
            else:
                self.respond_json(404, {"error": "event not found"})
            return

        if parsed.path == "/audit-logs":
            self.respond_json(200, {"items": data["audit"]})
            return

        if parsed.path == "/demo-data":
            self.respond_json(200, data)
            return

        self.respond_json(404, {"error": "not found"})

    def log_message(self, format, *args):
        return

    def respond_json(self, status, payload):
        body = json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 8080), AppHandler)
    print("eBPF Trigger Observatory API listening on http://127.0.0.1:8080")
    server.serve_forever()


if __name__ == "__main__":
    main()
