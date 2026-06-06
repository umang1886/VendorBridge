"use client";
import { useState } from "react";
import { activityLogs } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { Download, Search } from "lucide-react";

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");

  const filtered = activityLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Activity Logs</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Complete audit trail of all system actions</p>
        </div>
        <button className="btn btn-outline"><Download size={14} /> Export CSV</button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input className="input" style={{ paddingLeft: 36 }} placeholder="Search logs by user, action, or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr>
            <th>Timestamp</th><th>User</th><th>Role</th><th>Action Type</th><th>Entity Ref</th><th>Description</th>
          </tr></thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{formatDateTime(log.created_at)}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{log.user}</td>
                <td><span className={`badge badge-${log.role}`}>{log.role.replace("_", " ")}</span></td>
                <td><span style={{ fontSize: 12, fontFamily: "monospace", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{log.action}</span></td>
                <td style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>{log.entity_type} {log.entity_id}</td>
                <td style={{ fontSize: 13, color: "#475569", maxWidth: 300 }}>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
