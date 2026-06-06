"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Loader2, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAllQuotations } from "@/lib/supabase";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

const statusColors: Record<string, string> = {
  draft: "#64748b", submitted: "#2563eb", under_review: "#d97706", awarded: "#16a34a", rejected: "#dc2626",
};

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllQuotations().then(data => {
      setQuotations(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = quotations.filter((q) => {
    const matchSearch = 
      q.vendors?.company_name.toLowerCase().includes(search.toLowerCase()) || 
      q.rfqs?.rfq_number.toLowerCase().includes(search.toLowerCase()) ||
      q.rfqs?.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: quotations.length,
    submitted: quotations.filter(q => q.status === "submitted").length,
    under_review: quotations.filter(q => q.status === "under_review").length,
    awarded: quotations.filter(q => q.status === "awarded").length,
  };

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Quotations</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Review and compare vendor quotations</p>
        </div>
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
            {s === "all" ? "All" : s.replace("_", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} ({c})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by vendor or RFQ…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Loader2 className="animate-spin" style={{ margin: "0 auto", color: "#64748b" }} size={32} />
            <p style={{ marginTop: 16, color: "#64748b" }}>Loading Quotations...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr>
              <th>Vendor</th><th>RFQ</th><th>Amount</th><th>Status</th><th>Submitted</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{q.vendors?.company_name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{q.vendors?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#2563eb" }}>{q.rfqs?.rfq_number}</div>
                    <div style={{ fontSize: 11, color: "#64748b", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.rfqs?.title}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{formatCurrency(q.total_amount)}</div>
                  </td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{formatDate(q.submitted_at || q.created_at)}</div>
                  </td>
                  <td>
                    <Link href={`/quotations/${q.rfq_id}/comparison`} className="btn btn-outline btn-sm">
                      Compare <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No quotations found.
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
