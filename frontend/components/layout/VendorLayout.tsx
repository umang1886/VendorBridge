"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, ClipboardList, ShoppingCart, Receipt, Bell, LogOut, Building2, Menu } from "lucide-react";
import { vendorDashboardStats } from "@/lib/mock-data";
import { useState } from "react";

const navItems = [
  { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vendor/rfqs", icon: FileText, label: "RFQ Assignments" },
  { href: "/vendor/quotations", icon: ClipboardList, label: "My Quotations" },
  { href: "/vendor/purchase-orders", icon: ShoppingCart, label: "Purchase Orders" },
  { href: "/vendor/invoices", icon: Receipt, label: "Invoices" },
  { href: "/vendor/notifications", icon: Bell, label: "Notifications", badge: vendorDashboardStats.unread_notifications },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 0, minWidth: sidebarOpen ? 240 : 0,
          background: "#0f172a", borderRight: "1px solid #1e293b",
          display: "flex", flexDirection: "column",
          transition: "width 0.2s ease, min-width 0.2s ease",
          overflow: "hidden", flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Building2 size={18} color="white" />
            </div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>VendorBridge</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>Vendor Portal</div>
            </div>
          </div>
        </div>

        {/* Vendor info */}
        <div style={{ padding: "12px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ background: "rgba(124,58,237,0.1)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>LOGGED IN AS</div>
            <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 700, marginTop: 2 }}>Horizon IT Solutions</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 1 }}>priya@horizonit.co</div>
          </div>
        </div>

        {/* Switch to Admin Panel */}
        <div style={{ padding: "10px 12px 0" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "rgba(37,99,235,0.1)", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(37,99,235,0.3)" }}>
            <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>⇄ Switch to Admin Panel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px 8px" }}>Navigation</div>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/vendor/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`sidebar-nav-item ${active ? "active" : ""}`}>
                <item.icon size={16} />
                {item.label}
                {item.badge ? (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{item.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b" }}>
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444", textDecoration: "none", fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-outline btn-icon" style={{ marginRight: 12 }}>
            <Menu size={16} />
          </button>
          <div style={{ flex: 1, fontSize: 14, color: "#64748b" }}>Vendor Portal</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>{children}</main>
      </div>
    </div>
  );
}
