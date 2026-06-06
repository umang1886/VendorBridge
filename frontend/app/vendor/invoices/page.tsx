"use client";
import { useState } from "react";
import { Receipt, Eye, Download, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

const mockInvoices = [
  { id: "inv-1", invoice_number: "INV-2024-0001", po_number: "PO-2024-0001", rfq_title: "Office Supplies Procurement", amount: 45000, status: "paid", due_date: "2024-02-15", created_at: "2024-01-25" },
  { id: "inv-2", invoice_number: "INV-2024-0002", po_number: "PO-2024-0002", rfq_title: "IT Equipment Purchase", amount: 285000, status: "pending", due_date: "2024-03-01", created_at: "2024-02-05" },
  { id: "inv-3", invoice_number: "INV-2024-0003", po_number: "PO-2024-0003", rfq_title: "Maintenance Services", amount: 72000, status: "overdue", due_date: "2024-02-10", created_at: "2024-01-28" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  paid: { label: "Paid", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle2 },
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7", icon: Clock },
  overdue: { label: "Overdue", color: "#dc2626", bg: "#fee2e2", icon: AlertCircle },
  sent: { label: "Sent", color: "#2563eb", bg: "#dbeafe", icon: CheckCircle2 },
  draft: { label: "Draft", color: "#64748b", bg: "#f1f5f9", icon: XCircle },
};

export default function VendorInvoicesPage() {
  const [search, setSearch] = useState("");
  const totalOutstanding = mockInvoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const filtered = mockInvoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    inv.rfq_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Invoices</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Track your invoice payment statuses</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#fff7ed", borderRadius: 8, border: "1px solid #fed7aa" }}>
          <Receipt size={14} color="#ea580c" />
          <span style={{ fontSize: 13, color: "#ea580c", fontWeight: 600 }}>Outstanding: ₹{totalOutstanding.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Invoices", value: mockInvoices.length, color: "#2563eb" },
          { label: "Paid", value: mockInvoices.filter(i => i.status === "paid").length, color: "#16a34a" },
          { label: "Overdue", value: mockInvoices.filter(i => i.status === "overdue").length, color: "#dc2626" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <input className="input" style={{ paddingLeft: 16 }} placeholder="Search invoices…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr>
            <th>Invoice #</th><th>PO Number</th><th>Description</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((inv) => {
              const cfg = statusConfig[inv.status] || statusConfig.draft;
              const Icon = cfg.icon;
              return (
                <tr key={inv.id}>
                  <td><span style={{ fontWeight: 700, fontSize: 13, color: "#2563eb" }}>{inv.invoice_number}</span></td>
                  <td><span style={{ fontSize: 13, color: "#64748b" }}>{inv.po_number}</span></td>
                  <td><span style={{ fontWeight: 600, fontSize: 13 }}>{inv.rfq_title}</span></td>
                  <td><span style={{ fontWeight: 700, fontSize: 13 }}>₹{inv.amount.toLocaleString("en-IN")}</span></td>
                  <td>
                    <span style={{ color: inv.status === "overdue" ? "#dc2626" : "#64748b", fontWeight: inv.status === "overdue" ? 600 : 400, fontSize: 13 }}>
                      {inv.due_date}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm"><Eye size={13} /> View</button>
                      <button className="btn btn-outline btn-sm"><Download size={13} /> PDF</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
