"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Calendar, Users, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getRFQs } from "@/lib/supabase";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

const statusColors: Record<string, string> = {
  draft: "#64748b", open: "#2563eb", closed: "#d97706", awarded: "#16a34a", cancelled: "#dc2626",
};

export default function RFQsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRFQs().then(data => {
      setRfqs(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = rfqs.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.rfq_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: rfqs.length,
    open: rfqs.filter(r => r.status === "open").length,
    draft: rfqs.filter(r => r.status === "draft").length,
    closed: rfqs.filter(r => r.status === "closed").length,
    awarded: rfqs.filter(r => r.status === "awarded").length,
  };

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>RFQ Management</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage your Request for Quotations lifecycle</p>
        </div>
        <Link href="/rfqs/create" className="btn btn-primary"><Plus size={15} /> Create RFQ</Link>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.entries(counts).map(([s, c]) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: "1px solid", cursor: "pointer",
              borderColor: statusFilter === s ? statusColors[s] || "#2563eb" : "#e2e8f0",
              background: statusFilter === s ? `${statusColors[s] || "#2563eb"}15` : "white",
              color: statusFilter === s ? statusColors[s] || "#2563eb" : "#64748b",
            }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({c})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input className="input" style={{ paddingLeft: 36 }} placeholder="Search RFQs…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Loader2 className="animate-spin" style={{ margin: "0 auto", color: "#64748b" }} size={32} />
            <p style={{ marginTop: 16, color: "#64748b" }}>Loading RFQs...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr>
              <th>RFQ Number</th><th>Title</th><th>Status</th><th>Deadline</th><th>Vendors</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/rfqs/${r.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>{r.rfq_number}</Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Created {formatDate(r.created_at)}</div>
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                      <Calendar size={13} color="#94a3b8" />
                      <span>{formatDate(r.deadline)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                      <Users size={13} color="#94a3b8" />
                      <span style={{ fontWeight: 600 }}>{r.rfq_vendors?.length || 0}</span>
                    </div>
                  </td>
                  <td>
                    <Link href={`/rfqs/${r.id}`} className="btn btn-outline btn-sm"><Eye size={13} /> View</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No RFQs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
