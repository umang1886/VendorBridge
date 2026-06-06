"use client";
import { useState } from "react";
import { ClipboardList, Send, Eye, CheckCircle2, Clock, XCircle } from "lucide-react";

const mockQuotations = [
  {
    id: "q-1", rfq_number: "RFQ-2024-0012", rfq_title: "Maintenance Services",
    total_amount: 72000, delivery_days: 7, status: "accepted",
    submitted_at: "2024-01-16T10:00:00Z", deadline: "2024-01-20",
  },
  {
    id: "q-2", rfq_number: "RFQ-2024-0015", rfq_title: "IT Equipment Purchase",
    total_amount: 290000, delivery_days: 14, status: "submitted",
    submitted_at: "2024-02-10T14:30:00Z", deadline: "2024-02-28",
  },
  {
    id: "q-3", rfq_number: "RFQ-2024-0009", rfq_title: "Cleaning Supplies",
    total_amount: 18500, delivery_days: 3, status: "rejected",
    submitted_at: "2024-01-08T09:15:00Z", deadline: "2024-01-12",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  submitted: { label: "Under Review", color: "#d97706", bg: "#fef3c7", icon: Clock },
  accepted: { label: "Accepted", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2", icon: XCircle },
  draft: { label: "Draft", color: "#64748b", bg: "#f1f5f9", icon: Clock },
};

export default function VendorQuotationsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockQuotations.filter(q =>
    q.rfq_number.toLowerCase().includes(search.toLowerCase()) ||
    q.rfq_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>My Quotations</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Track the status of your submitted quotations</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Submitted", count: mockQuotations.filter(q => q.status === "submitted").length, color: "#d97706", bg: "#fef3c7" },
            { label: "Accepted", count: mockQuotations.filter(q => q.status === "accepted").length, color: "#16a34a", bg: "#dcfce7" },
          ].map(s => (
            <div key={s.label} style={{ padding: "6px 14px", background: s.bg, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <input className="input" style={{ paddingLeft: 16 }} placeholder="Search quotations…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((q) => {
          const cfg = statusConfig[q.status] || statusConfig.draft;
          const Icon = cfg.icon;
          return (
            <div key={q.id} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>{q.rfq_number}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>{q.rfq_title}</h3>
                  <div style={{ display: "flex", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>YOUR QUOTE</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>₹{q.total_amount.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>DELIVERY</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>{q.delivery_days} days</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>SUBMITTED</div>
                      <div style={{ fontSize: 13, color: "#475569" }}>{new Date(q.submitted_at).toLocaleDateString("en-IN")}</div>
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                  <Eye size={13} /> View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <ClipboardList size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: 16 }}>No quotations submitted yet</p>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Submit quotations from the RFQ Assignments page</p>
        </div>
      )}
    </div>
  );
}
