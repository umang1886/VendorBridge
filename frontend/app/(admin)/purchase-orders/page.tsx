"use client";
import { purchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Eye, Download, Plus } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function PurchaseOrdersPage() {
  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Purchase Orders</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage and track all issued purchase orders</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total POs", value: purchaseOrders.length, color: "#2563eb" },
          { label: "Sent", value: purchaseOrders.filter(p => p.status === "sent").length, color: "#d97706" },
          { label: "Acknowledged", value: purchaseOrders.filter(p => p.status === "acknowledged").length, color: "#7c3aed" },
          { label: "Fulfilled", value: purchaseOrders.filter(p => p.status === "fulfilled").length, color: "#16a34a" },
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
            <th>PO Number</th><th>Vendor</th><th>Delivery Date</th><th>Total Amount</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td>
                  <Link href={`/purchase-orders/${po.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>{po.po_number}</Link>
                </td>
                <td style={{ fontSize: 13, fontWeight: 600 }}>{po.vendor_name}</td>
                <td style={{ fontSize: 13, color: "#64748b" }}>{formatDate(po.delivery_date)}</td>
                <td style={{ fontWeight: 800, fontSize: 14 }}>{formatCurrency(po.total_amount)}</td>
                <td><StatusBadge status={po.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link href={`/purchase-orders/${po.id}`} className="btn btn-outline btn-sm"><Eye size={13} /> View</Link>
                    <button className="btn btn-outline btn-sm"><Download size={13} /> PDF</button>
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
