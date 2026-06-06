"use client";
import { vendorDashboardStats, rfqs, purchaseOrders, invoices } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, ClipboardList, ShoppingCart, ArrowRight } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function VendorDashboardPage() {
  const newRFQs = rfqs.filter(r => r.status === "open").slice(0, 3);
  const recentPOs = purchaseOrders.filter(p => p.vendor_name === "Horizon IT Solutions").slice(0, 3);

  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Vendor Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Welcome back to your procurement portal.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>New RFQ Assignments</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{vendorDashboardStats.assigned_rfqs}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2563eb18", display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={20} color="#2563eb" /></div>
          </div>
        </div>
        <div className="kpi-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>Active Quotations</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{vendorDashboardStats.submitted_quotations}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#d9770618", display: "flex", alignItems: "center", justifyContent: "center" }}><ClipboardList size={20} color="#d97706" /></div>
          </div>
        </div>
        <div className="kpi-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>Pending POs</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{vendorDashboardStats.active_pos}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#16a34a18", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingCart size={20} color="#16a34a" /></div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* New RFQs */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>New RFQ Assignments</div>
            <Link href="/vendor/rfqs" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead><tr>
                <th>RFQ Number</th><th>Title</th><th>Deadline</th>
              </tr></thead>
              <tbody>
                {newRFQs.map((r) => (
                  <tr key={r.id}>
                    <td><Link href={`/vendor/rfqs/${r.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>{r.rfq_number}</Link></td>
                    <td style={{ maxWidth: 160 }}><div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{r.title}</div></td>
                    <td style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{formatDate(r.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent POs */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Purchase Orders</div>
            <Link href="/vendor/purchase-orders" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead><tr>
                <th>PO Number</th><th>Amount</th><th>Status</th>
              </tr></thead>
              <tbody>
                {recentPOs.map((po) => (
                  <tr key={po.id}>
                    <td><Link href={`/vendor/purchase-orders/${po.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>{po.po_number}</Link></td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(po.total_amount)}</td>
                    <td><StatusBadge status={po.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
