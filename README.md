<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=EF4444&center=true&vCenter=true&width=600&lines=🍯+Cloud+Honeypot;Real-Time+Attack+Visualization;Built+on+AWS+EC2" alt="Typing SVG" />

<br/>

![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)
![Status](https://img.shields.io/badge/Status-LIVE-22c55e?style=for-the-badge)
![Course](https://img.shields.io/badge/Course-Cloud%20Security-1F3864?style=for-the-badge)

<br/>

> **A cloud-deployed deception system that attracts real-world attackers and visualizes their activity in real time.**  
> Deployed on AWS EC2 — received first attack within **5 minutes** of going live.

<br/>

[![View Live Dashboard](https://img.shields.io/badge/🔴%20LIVE%20DASHBOARD-View%20Now-ef4444?style=for-the-badge)](http://3.84.187.182:3000/)
[![API Endpoint](https://img.shields.io/badge/API-/attacks-1F3864?style=for-the-badge)](http://3.84.187.182:5000/attacks)
[![Stats](https://img.shields.io/badge/API-/stats-1F3864?style=for-the-badge)](http://3.84.187.182:5000/stats)

</div>

---

## 📸 Screenshots

> Add your dashboard screenshots in a `screenshots/` folder and they will appear here.

---

## ⚡ What It Does

Within minutes of deployment, real bots and attackers from around the world began hitting the honeypot. Here's what was captured in the first 24 hours:

| Metric | Result |
|--------|--------|
| 🌐 First attack received | Within 5 minutes of deployment |
| 📊 Total events captured | 200+ events |
| 🌍 Unique attacker IPs | 31 unique IPs |
| 🔑 Most common username tried | `root` |
| 🔍 HTTP paths probed | `/login`, `/admin`, `/.env`, `/wp-login.php` |
| 🛡️ Attack types | SSH brute force, HTTP scanning, Telnet probing, Proxy abuse |

---

## 🏗️ Architecture
Internet (Attackers & Bots)

│

▼

[AWS Internet Gateway]

│

▼

[EC2 t3.micro - Ubuntu 26.04]

┌──────────────────────────────────┐

│                                  │

│  🎣 Honeypot Services (Python)  │

│  ├── Fake SSH    → Port 2222    │

│  ├── Fake HTTP   → Port 8080    │

│  └── Fake Telnet → Port 2323    │

│                                  │

│  📝 attacks.json (log file)     │

│                                  │

│  🐍 Flask API   → Port 5000     │

│  ⚛️  React Dashboard → Port 3000 │

└──────────────────────────────────┘

│

▼

[Your Browser — Live Dashboard]

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ☁️ Cloud | AWS EC2 (t3.micro, us-east-1) |
| 🎣 Honeypot | Python 3 — socket, threading |
| 🐍 API | Flask + Flask-CORS |
| ⚛️ Dashboard | React 18 |
| 📝 Logging | JSON file logging |
| 🔒 Network | AWS Security Groups, VPC |

---

## 🎣 Honeypot Services

### 🔐 Fake SSH (Port 2222)
Emulates an OpenSSH server. Returns a realistic SSH banner and logs every connection attempt and credential tried.

### 🌐 Fake HTTP (Port 8080)
Emulates a web server. Logs every HTTP request path — attackers scan for `/admin`, `/.env`, `/wp-login.php`, and more.

### 📟 Fake Telnet (Port 2323)
Emulates a Telnet login prompt. Captures username and password brute force attempts.

---

## 📁 Project Structure
Honeypot/

├── honeypot.py          # Core honeypot — fake SSH, HTTP, Telnet services

├── api.py               # Flask REST API serving attack data

├── start.sh             # One-command startup script

└── honeypot-dashboard/

└── src/

└── App.js       # React dashboard UI

---

## 🚀 Setup & Deployment

### 1. Clone the repo
```bash
git clone https://github.com/arham-abro/Honeypot.git
cd Honeypot
```

### 2. Install dependencies
```bash
pip3 install flask flask-cors --break-system-packages
```

### 3. Start everything
```bash
bash start.sh
```

### 4. Open the dashboard
http://3.84.187.182:3000/

> ⚠️ **Security Note:** This honeypot intentionally opens all ports to attract attackers. Never deploy on a machine with real data or production systems.

---

## 🔍 Real Attack Examples Captured

```json
{"timestamp": "2026-05-20T02:04:10", "eventid": "cowrie.login.failed", 
 "src_ip": "103.26.82.153", "data": "username=root"}

{"timestamp": "2026-05-20T08:48:29", "eventid": "http.request",
 "src_ip": "185.91.127.85", "data": "CONNECT www.google.com:443 HTTP/1.1"}

{"timestamp": "2026-05-20T10:18:44", "eventid": "http.request",
 "src_ip": "54.81.39.83", "data": "GET /.env HTTP/1.1"}
```

---

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Check if API is running |
| `GET /attacks` | Last 5000 attack events |
| `GET /stats` | Aggregated statistics |

---

## 🎓 Project Info

| Field | Details |
|-------|---------|
| 👤 Student | Arham Abro |
| 🎫 Roll No. | 72532 |
| 📚 Course | Cloud Security |
| 👨‍🏫 Instructor | Muhammad Ahsan Naeem |
| 🏛️ Department | Cyber Security — Iqra University |
| 📅 Date | May 2026 |

---

<div align="center">

**Made with ☁️ on AWS · Built for Cloud Security Course**

⭐ Star this repo if you found it useful!

</div>
