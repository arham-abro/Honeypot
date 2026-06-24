from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

LOG_FILE = "/home/ubuntu/attacks.json"

def read_attacks():
    attacks = []
    try:
        with open(LOG_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    attacks.append(json.loads(line))
                except:
                    continue
    except FileNotFoundError:
        return []
    return list(reversed(attacks[-5000:]))

def get_stats(attacks):
    ips = {}
    ports = {}
    events = {}
    for a in attacks:
        ip = a.get("src_ip", "unknown")
        ips[ip] = ips.get(ip, 0) + 1
        port = str(a.get("src_port", ""))
        ports[port] = ports.get(port, 0) + 1
        e = a.get("eventid", "")
        events[e] = events.get(e, 0) + 1
    return {
        "total_attacks": len(attacks),
        "unique_ips": len(ips),
        "top_ips": sorted(ips.items(), key=lambda x: x[1], reverse=True)[:5],
        "top_ports": sorted(ports.items(), key=lambda x: x[1], reverse=True)[:5],
        "event_breakdown": events
    }

@app.route("/attacks")
def get_attacks():
    return jsonify(read_attacks())

@app.route("/stats")
def get_stats_route():
    return jsonify(get_stats(read_attacks()))

@app.route("/health")
def health():
    return jsonify({"status": "running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
