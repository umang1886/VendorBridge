"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, ClipboardList, CheckSquare,
  ShoppingCart, Receipt, BarChart2, Activity, UserCog,
  Bell, ChevronDown, LogOut, Settings, Building2, X, Menu
} from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { useState } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Procurement",
    items: [
      { href: "/vendors", icon: Building2, label: "Vendors" },
      { href: "/rfqs", icon: FileText, label: "RFQ Management" },
      { href: "/quotations", icon: ClipboardList, label: "Quotations" },
      { href: "/approvals", icon: CheckSquare, label: "Approvals" },
    ],
  },
  {
    label: "Orders & Finance",
    items: [
      { href: "/purchase-orders", icon: ShoppingCart, label: "Purchase Orders" },
      { href: "/invoices", icon: Receipt, label: "Invoices" },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/reports", icon: BarChart2, label: "Reports & Analytics" },
      { href: "/activity-logs", icon: Activity, label: "Activity Logs" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/users", icon: UserCog, label: "User Management" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: sidebarOpen ? 240 : 0,
          minWidth: sidebarOpen ? 240 : 0,
          display: "flex", flexDirection: "column",
          transition: "width 0.2s ease, min-width 0.2s ease",
          overflow: "hidden", flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Building2 size={18} color="white" />
            </div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>VendorBridge</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>ERP Platform</div>
            </div>
          </div>
        </div>

        {/* Switch to Vendor Portal */}
        <div style={{ padding: "10px 12px 0" }}>
          <Link href="/vendor/dashboard"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
              background: "rgba(124,58,237,0.1)", borderRadius: 8, textDecoration: "none",
              border: "1px solid rgba(124,58,237,0.3)", marginBottom: 4,
            }}>
            <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>⇄ Switch to Vendor Portal</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px 6px" }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} className={`sidebar-nav-item ${active ? "active" : ""}`}>
                    <item.icon size={16} />
                    {item.label}
                    {item.href === "/approvals" && (
                      <span style={{ marginLeft: "auto", background: "#ef4444", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>2</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>Admin User</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-outline btn-icon" style={{ marginRight: 12 }}>
            <Menu size={16} />
          </button>

          <div style={{ flex: 1 }} />

          {/* Notifications */}
          <div style={{ position: "relative", marginRight: 8 }}>
            <button
              className="btn btn-outline btn-icon"
              onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
              style={{ position: "relative" }}
            >
              <Bell size={16} />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2, width: 16, height: 16,
                  background: "#ef4444", borderRadius: "50%", fontSize: 10,
                  color: "white", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unread}</span>
              )}
            </button>
            {showNotif && (
              <div style={{
                position: "absolute", right: 0, top: 44, width: 360, background: "white",
                border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", zIndex: 100,
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                  <span style={{ fontSize: 12, color: "#2563eb", cursor: "pointer" }}>Mark all read</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: "12px 16px", borderBottom: "1px solid #f8fafc",
                    background: n.is_read ? "white" : "#f0f9ff", cursor: "pointer",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{new Date(n.created_at).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8 }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>A</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Admin User</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Administrator</div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </button>
            {showUser && (
              <div style={{
                position: "absolute", right: 0, top: 48, width: 180, background: "white",
                border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden",
              }}>
                <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} className="btn-outline">
                  <Settings size={14} /><span style={{ fontSize: 13 }}>Settings</span>
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9" }} />
                <Link href="/login" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#dc2626", textDecoration: "none", fontSize: 13 }}>
                  <LogOut size={14} />Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
