"use client";
import { useState } from "react";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, Package } from "lucide-react";

const mockNotifications = [
  { id: "n-1", type: "po_issued", title: "Purchase Order Issued", message: "PO-2024-0001 has been issued for Office Supplies Procurement worth ₹45,000.", is_read: false, created_at: "2024-01-25T10:30:00Z" },
  { id: "n-2", type: "rfq_assigned", title: "New RFQ Assigned", message: "You have been invited to submit a quotation for IT Equipment Purchase (RFQ-2024-0015). Deadline: Feb 28, 2024.", is_read: false, created_at: "2024-01-22T09:00:00Z" },
  { id: "n-3", type: "invoice_due", title: "Invoice Payment Due Soon", message: "Invoice INV-2024-0002 for ₹2,85,000 is due on March 1, 2024. Please ensure timely payment processing.", is_read: true, created_at: "2024-01-20T14:15:00Z" },
  { id: "n-4", type: "quotation_accepted", title: "Quotation Accepted", message: "Your quotation for Maintenance Services RFQ-2024-0012 has been accepted. A PO will be generated shortly.", is_read: true, created_at: "2024-01-18T11:00:00Z" },
  { id: "n-5", type: "rfq_assigned", title: "New RFQ: Maintenance Services", message: "You have been invited to bid on Maintenance Services contract. Deadline: Jan 30, 2024.", is_read: true, created_at: "2024-01-10T08:30:00Z" },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  po_issued: { icon: Package, color: "#16a34a", bg: "#dcfce7" },
  rfq_assigned: { icon: Info, color: "#2563eb", bg: "#dbeafe" },
  invoice_due: { icon: AlertTriangle, color: "#d97706", bg: "#fef3c7" },
  quotation_accepted: { icon: CheckCircle2, color: "#7c3aed", bg: "#ede9fe" },
};

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unread = notifications.filter(n => !n.is_read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Notifications</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {unread > 0 ? <><span style={{ color: "#2563eb", fontWeight: 700 }}>{unread} unread</span> notifications</> : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((notif) => {
          const cfg = typeConfig[notif.type] || typeConfig.rfq_assigned;
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                display: "flex", gap: 16, padding: "16px 20px",
                background: notif.is_read ? "white" : "#f0f9ff",
                borderRadius: 12, border: `1px solid ${notif.is_read ? "#e2e8f0" : "#bae6fd"}`,
                cursor: "pointer", transition: "all 0.15s ease",
                boxShadow: notif.is_read ? "none" : "0 2px 8px rgba(37,99,235,0.08)",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} color={cfg.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{notif.title}</span>
                  {!notif.is_read && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                  {new Date(notif.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Bell size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: 16 }}>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
