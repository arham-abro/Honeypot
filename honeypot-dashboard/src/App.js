import { useState, useEffect } from "react";

const API = "http://3.84.187.182:5000";

const EVENT_LABELS = {
  "cowrie.session.connect": { label: "Connected", color: "#eab308" },
  "cowrie.login.failed": { label: "Login Failed", color: "#ef4444" },
  "cowrie.login.success": { label: "Login SUCCESS", color: "#f97316" },
  "http.request": { label: "HTTP Request", color: "#8b5cf6" },
};

export default function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const [a, s] = await Promise.all([
        fetch(`${API}/attacks`),
        fetch(`${API}/stats`),
      ]);
      setAttacks(await a.json());
      setStats(await s.json());
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("API error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "monospace", padding: "24px" }}>
      <div style={{ borderBottom: "1px solid #222", paddingBottom: "16px", marginBottom: "24px" }}>
        <h1 style={{ color: "#ef4444", fontSize: "24px", margin: 0 }}>🍯 Cloud Honeypot — Live Attack Monitor</h1>
        <p style={{ color: "#555", margin: "4px 0 0 0", fontSize: "13px" }}>
          {lastUpdated ? `Last updated: ${lastUpdated} · Auto-refreshes every 10s` : "Connecting to API..."}
        </p>
      </div>

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Events", value: stats.total_attacks, color: "#ef4444" },
            { label: "Unique Attackers", value: stats.unique_ips, color: "#f97316" },
            { label: "Connections", value: stats.event_breakdown["cowrie.session.connect"] || 0, color: "#eab308" },
            { label: "Login Attempts", value: stats.event_breakdown["cowrie.login.failed"] || 0, color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "16px" }}>
              <div style={{ color: s.color, fontSize: "28px", fontWeight: "bold" }}>{s.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "16px" }}>
          <h2 style={{ color: "#aaa", fontSize: "14px", marginTop: 0, marginBottom: "12px" }}>⚡ LIVE ATTACK FEED</h2>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {attacks.length === 0 ? (
              <p style={{ color: "#444" }}>Waiting for attacks... (they will appear here automatically)</p>
            ) : (
              attacks.map((a, i) => {
                const ev = EVENT_LABELS[a.eventid] || { label: a.eventid, color: "#888" };
                return (
                  <div key={i} style={{ borderBottom: "1px solid #1a1a1a", padding: "8px 0", fontSize: "12px" }}>
                    <span style={{ color: "#444", marginRight: "12px" }}>
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </span>
                    <span style={{ background: ev.color + "22", color: ev.color, padding: "2px 6px", borderRadius: "4px", marginRight: "10px" }}>
                      {ev.label}
                    </span>
                    <span style={{ color: "#60a5fa", marginRight: "10px" }}>{a.src_ip}</span>
                    {a.data && <span style={{ color: "#888" }}>{a.data.slice(0, 60)}</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {stats && (
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "16px" }}>
              <h2 style={{ color: "#aaa", fontSize: "14px", marginTop: 0, marginBottom: "12px" }}>🌍 TOP ATTACKERS</h2>
              {stats.top_ips.length === 0 ? <p style={{ color: "#444", fontSize: "12px" }}>None yet</p> : stats.top_ips.map(([ip, count]) => (
                <div key={ip} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#60a5fa" }}>{ip}</span>
                  <span style={{ color: "#ef4444" }}>{count} hits</span>
                </div>
              ))}
            </div>
          )}

          {stats && (
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "16px" }}>
              <h2 style={{ color: "#aaa", fontSize: "14px", marginTop: 0, marginBottom: "12px" }}>🔌 TOP PORTS HIT</h2>
              {stats.top_ports.map(([port, count]) => (
                <div key={port} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#fbbf24" }}>:{port}</span>
                  <span style={{ color: "#888" }}>{count}x</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "16px" }}>
            <h2 style={{ color: "#aaa", fontSize: "14px", marginTop: 0, marginBottom: "12px" }}>📡 HONEYPOT STATUS</h2>
            {[
              { port: "2222", service: "Fake SSH", color: "#22c55e" },
              { port: "8080", service: "Fake HTTP", color: "#22c55e" },
              { port: "2323", service: "Fake Telnet", color: "#22c55e" },
              { port: "5000", service: "API Server", color: "#22c55e" },
            ].map((s) => (
              <div key={s.port} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ color: "#aaa" }}>{s.service} (:{s.port})</span>
                <span style={{ color: s.color }}>● LIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
