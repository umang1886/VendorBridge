"use client";
import { invoices, purchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Download, Mail, CheckCircle, Receipt, Building2 } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const inv = invoices.find(i => i.id === params.id) || invoices[0];
  const po = purchaseOrders.find(p => p.id === inv.po_id) || purchaseOrders[0];

  return (
    <div className="page-content fade-in">
      <Link href="/invoices" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Invoices
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{inv.invoice_number}</h1>
            <StatusBadge status={inv.status} />
          </div>
          <p style={{ color: "#64748b", fontSize: 14 }}>Due on {formatDate(inv.due_date)}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline"><Download size={14} /> Download PDF</button>
          {inv.status === "generated" && <button className="btn btn-primary"><Mail size={14} /> Email to Vendor</button>}
          {inv.status !== "paid" && <button className="btn btn-success"><CheckCircle size={14} /> Mark as Paid</button>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Invoice Document Preview (similar to PO but from vendor) */}
        <div className="card" style={{ padding: 40, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: 20, marginBottom: 30 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                  <Receipt size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{inv.vendor_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Vendor ID: {inv.vendor_id}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "0.05em", marginBottom: 12 }}>INVOICE</div>
              <table style={{ fontSize: 13, marginLeft: "auto", color: "#475569" }}>
                <tbody>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>Invoice #:</td><td>{inv.invoice_number}</td></tr>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>Date:</td><td>{formatDate(inv.invoice_date)}</td></tr>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>Due Date:</td><td>{formatDate(inv.due_date)}</td></tr>
                  <tr><td style={{ paddingRight: 16, fontWeight: 600 }}>PO Ref:</td><td>{inv.po_number}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Bill To</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>VendorBridge Corp.</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
              123 Business Park, Tech Block<br />
              Mumbai, Maharashtra 400001
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                <th style={{ padding: "12px 10px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#475569" }}>Description</th>
                <th style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#475569" }}>Qty</th>
                <th style={{ padding: "12px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>Price</th>
                <th style={{ padding: "12px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "14px 10px", fontSize: 13, fontWeight: 500 }}>{item.item_name}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 10px", fontSize: 13, textAlign: "right" }}>{formatCurrency(item.unit_price)}</td>
                  <td style={{ padding: "14px 10px", fontSize: 14, textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(inv.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>GST (18%)</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(inv.gst_amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 10px", marginTop: 8, background: "#f8fafc", borderTop: "2px solid #cbd5e1", borderRadius: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Amount Due</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#2563eb" }}>{formatCurrency(inv.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-header"><div style={{ fontWeight: 700 }}>Payment Info</div></div>
            <div className="card-body">
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Status</div>
              <div style={{ marginBottom: 16 }}><StatusBadge status={inv.status} /></div>
              
              {inv.paid_at && (
                <>
                  <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Paid On</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(inv.paid_at)}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
