"use client";
import { invoices } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Eye, Download, CheckCircle, Receipt, Mail } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function InvoicesPage() {
  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Invoices</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage supplier invoices and payments</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Invoices", value: invoices.length, color: "#2563eb" },
          { label: "Pending Payment", value: invoices.filter(i => i.status === "sent" || i.status === "generated").length, color: "#d97706" },
          { label: "Paid", value: invoices.filter(i => i.status === "paid").length, color: "#16a34a" },
          { label: "Overdue", value: invoices.filter(i => i.status === "overdue").length, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="kpi-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr>
            <th>Invoice Number</th><th>PO Ref</th><th>Vendor</th><th>Due Date</th><th>Total Amount</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <Link href={`/invoices/${inv.id}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#2563eb", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                    <Receipt size={14} /> {inv.invoice_number}
                  </Link>
                </td>
                <td><Link href={`/purchase-orders/${inv.po_id}`} style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{inv.po_number}</Link></td>
                <td style={{ fontSize: 13, fontWeight: 600 }}>{inv.vendor_name}</td>
                <td style={{ fontSize: 13, color: "#64748b" }}>{formatDate(inv.due_date)}</td>
                <td style={{ fontWeight: 800, fontSize: 14 }}>{formatCurrency(inv.total_amount)}</td>
                <td><StatusBadge status={inv.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link href={`/invoices/${inv.id}`} className="btn btn-outline btn-sm"><Eye size={13} /> View</Link>
                    {inv.status === "generated" && <button className="btn btn-primary btn-sm"><Mail size={13} /> Send</button>}
                    {inv.status === "sent" && <button className="btn btn-success btn-sm"><CheckCircle size={13} /> Pay</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
