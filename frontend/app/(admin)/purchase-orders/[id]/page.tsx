"use client";
import { purchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Mail, Building2, CheckCircle, ArrowRight } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function PODetailPage({ params }: { params: { id: string } }) {
  const po = purchaseOrders.find(p => p.id === params.id) || purchaseOrders[0];

  return (
    <div className="page-content fade-in">
      <Link href="/purchase-orders" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Purchase Orders
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{po.po_number}</h1>
            <StatusBadge status={po.status} />
          </div>
          <p style={{ color: "#64748b", fontSize: 14 }}>Issued on {formatDate(po.created_at)}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline"><Printer size={14} /> Print</button>
          <button className="btn btn-outline"><Download size={14} /> Download PDF</button>
          {po.status === "draft" && <button className="btn btn-primary"><Mail size={14} /> Send to Vendor</button>}
          {po.status === "sent" && <button className="btn btn-success"><CheckCircle size={14} /> Mark Acknowledged</button>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* PO Document Preview */}
        <div className="card" style={{ padding: 40, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: 20, marginBottom: 30 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>VendorBridge Corp.</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Procurement Division</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                123 Business Park, Tech Block<br />
                Mumbai, Maharashtra 400001<br />
                GSTIN: 27AABCU9603R1ZM
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "0.05em", marginBottom: 12 }}>PURCHASE ORDER</div>
              <table style={{ fontSize: 13, marginLeft: "auto", color: "#475569" }}>
                <tbody>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>PO Number:</td><td>{po.po_number}</td></tr>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>Date:</td><td>{formatDate(po.created_at)}</td></tr>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>Delivery By:</td><td>{formatDate(po.delivery_date)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: 60, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Vendor Details</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{po.vendor_name}</div>
              <div style={{ fontSize: 13, color: "#475569" }}>Vendor ID: {po.vendor_id}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Shipping Address</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                VendorBridge Central Warehouse<br />
                Gate 4, Logistics Park<br />
                Navi Mumbai 400708
              </div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                <th style={{ padding: "12px 10px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#475569" }}>Item Description</th>
                <th style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#475569" }}>Qty</th>
                <th style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#475569" }}>Unit</th>
                <th style={{ padding: "12px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>Unit Price</th>
                <th style={{ padding: "12px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>GST %</th>
                <th style={{ padding: "12px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "14px 10px", fontSize: 13, fontWeight: 500 }}>{item.item_name}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "center", color: "#64748b" }}>{item.unit}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "right" }}>{formatCurrency(item.unit_price)}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "right", color: "#64748b" }}>{item.gst_rate}%</td>
                  <td style={{ padding: "14px 10px", fontSize: 14, textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(po.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>GST Total</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(po.gst_amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 10px", marginTop: 8, background: "#f8fafc", borderTop: "2px solid #cbd5e1", borderRadius: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Grand Total</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#2563eb" }}>{formatCurrency(po.total_amount)}</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 60, paddingTop: 20, borderTop: "1px solid #e2e8f0", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
            This is a computer-generated document. No signature is required.
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-header"><div style={{ fontWeight: 700 }}>PO Lifecycle</div></div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Created", date: po.created_at, active: true },
                  { label: "Sent to Vendor", date: po.status !== "draft" ? po.created_at : null, active: po.status !== "draft" },
                  { label: "Acknowledged", date: po.status === "acknowledged" || po.status === "fulfilled" ? po.created_at : null, active: po.status === "acknowledged" || po.status === "fulfilled" },
                  { label: "Fulfilled", date: po.status === "fulfilled" ? po.created_at : null, active: po.status === "fulfilled" }
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: step.active ? "#16a34a" : "#e2e8f0", border: `2px solid ${step.active ? "#16a34a" : "#cbd5e1"}`, zIndex: 2 }} />
                      {i < 3 && <div style={{ width: 2, height: 30, background: step.active ? "#16a34a" : "#e2e8f0", marginTop: -2, marginBottom: -2 }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: step.active ? 600 : 400, color: step.active ? "#0f172a" : "#94a3b8", marginTop: -2 }}>{step.label}</div>
                      {step.date && <div style={{ fontSize: 11, color: "#64748b" }}>{formatDate(step.date)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header"><div style={{ fontWeight: 700 }}>Linked Documents</div></div>
            <div className="card-body">
              <Link href={`/rfqs/${po.rfq_id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: 8, textDecoration: "none", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Original RFQ</span>
                <ArrowRight size={14} color="#64748b" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
