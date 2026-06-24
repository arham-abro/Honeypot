import socket
import threading
import json
import os
from datetime import datetime, timezone

LOG_FILE = "/home/ubuntu/attacks.json"

def log_event(event_type, src_ip, src_port, data=""):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventid": event_type,
        "src_ip": src_ip,
        "src_port": src_port,
        "data": data[:200]
    }
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"[{entry['timestamp']}] {event_type} from {src_ip}:{src_port} | {data[:50]}")

def handle_ssh(client, addr):
    src_ip, src_port = addr
    log_event("cowrie.session.connect", src_ip, src_port)
    try:
        client.send(b"SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6\r\n")
        data = client.recv(1024).decode(errors="ignore").strip()
        if data:
            log_event("cowrie.login.failed", src_ip, src_port, data)
        client.send(b"Permission denied (publickey,password).\r\n")
    except:
        pass
    finally:
        client.close()

def handle_http(client, addr):
    src_ip, src_port = addr
    log_event("cowrie.session.connect", src_ip, src_port)
    try:
        data = client.recv(1024).decode(errors="ignore").strip()
        if data:
            first_line = data.split("\n")[0]
            log_event("http.request", src_ip, src_port, first_line)
        response = b"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<html><body>Welcome</body></html>"
        client.send(response)
    except:
        pass
    finally:
        client.close()

def handle_telnet(client, addr):
    src_ip, src_port = addr
    log_event("cowrie.session.connect", src_ip, src_port)
    try:
        client.send(b"\r\nUbuntu 22.04 LTS\r\nlogin: ")
        data = client.recv(1024).decode(errors="ignore").strip()
        if data:
            log_event("cowrie.login.failed", src_ip, src_port, f"username={data}")
        client.send(b"\r\nPassword: ")
        pwd = client.recv(1024).decode(errors="ignore").strip()
        if pwd:
            log_event("cowrie.login.failed", src_ip, src_port, f"username={data} password={pwd}")
        client.send(b"\r\nLogin incorrect\r\n")
    except:
        pass
    finally:
        client.close()

def start_listener(port, handler, name):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(("0.0.0.0", port))
        s.listen(100)
        print(f"[*] {name} honeypot listening on port {port}")
        while True:
            try:
                client, addr = s.accept()
                t = threading.Thread(target=handler, args=(client, addr))
                t.daemon = True
                t.start()
            except Exception as e:
                print(f"Error: {e}")
    except Exception as e:
        print(f"Could not start {name} on port {port}: {e}")

if __name__ == "__main__":
    # Make sure log file exists
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, "w").close()
    
    print("=== Honeypot Starting ===")
    
    listeners = [
        (2222, handle_ssh, "SSH"),
        (8080, handle_http, "HTTP"),
        (2323, handle_telnet, "Telnet"),
    ]
    
    threads = []
    for port, handler, name in listeners:
        t = threading.Thread(target=start_listener, args=(port, handler, name))
        t.daemon = True
        t.start()
        threads.append(t)
    
    print("=== All honeypots running. Press Ctrl+C to stop ===")
    try:
        for t in threads:
            t.join()
    except KeyboardInterrupt:
        print("\nStopping honeypot.")
