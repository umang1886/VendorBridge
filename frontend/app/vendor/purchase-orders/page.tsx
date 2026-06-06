"use client";
import { useState } from "react";
import { ShoppingCart, Eye, Download, CheckCircle2, Clock, Truck } from "lucide-react";

const mockPOs = [
  { id: "po-1", po_number: "PO-2024-0001", rfq_title: "Office Supplies Procurement", vendor_name: "ABC Supplies", total_amount: 45000, status: "delivered", created_at: "2024-01-15" },
  { id: "po-2", po_number: "PO-2024-0002", rfq_title: "IT Equipment Purchase", vendor_name: "Tech Solutions Ltd", total_amount: 285000, status: "shipped", created_at: "2024-01-20" },
  { id: "po-3", po_number: "PO-2024-0003", rfq_title: "Maintenance Services", vendor_name: "ServicePro India", total_amount: 72000, status: "approved", created_at: "2024-02-01" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  approved: { label: "Approved", color: "#d97706", bg: "#fef3c7", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "#2563eb", bg: "#dbeafe", icon: Truck },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle2 },
  pending: { label: "Pending", color: "#64748b", bg: "#f1f5f9", icon: Clock },
};

export default function VendorPurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockPOs.filter(po =>
    po.po_number.toLowerCase().includes(search.toLowerCase()) ||
    po.rfq_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Purchase Orders</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Track your awarded purchase orders</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
          <ShoppingCart size={14} color="#0284c7" />
          <span style={{ fontSize: 13, color: "#0284c7", fontWeight: 600 }}>{mockPOs.length} Active POs</span>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <input className="input" style={{ paddingLeft: 16 }} placeholder="Search purchase orders…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr>
            <th>PO Number</th><th>RFQ Title</th><th>Amount</th><th>Status</th><th>Issued</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((po) => {
              const cfg = statusConfig[po.status] || statusConfig.pending;
              const Icon = cfg.icon;
              return (
                <tr key={po.id}>
                  <td><span style={{ fontWeight: 700, fontSize: 13, color: "#2563eb" }}>{po.po_number}</span></td>
                  <td><span style={{ fontWeight: 600, fontSize: 13 }}>{po.rfq_title}</span></td>
                  <td><span style={{ fontWeight: 700, fontSize: 13 }}>₹{po.total_amount.toLocaleString("en-IN")}</span></td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{po.created_at}</td>
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
