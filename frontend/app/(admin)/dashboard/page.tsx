"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, FileText, CheckSquare, ShoppingCart, Receipt, Plus, ArrowRight, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getDashboardStats, getRFQs, getInvoices } from "@/lib/supabase";

function KPICard({ label, value, icon: Icon, color, trend, sub }: { label: string; value: string | number; icon: any; color: string; trend?: string; sub?: string }) {
  return (
    <div className="kpi-card fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{sub}</div>}
          {trend && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
              <TrendingUp size={13} />{trend}
            </div>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.replace("_", " ")}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRFQs(),
      getInvoices()
    ]).then(([statsData, rfqsData, invoicesData]) => {
      setStats(statsData);
      setRfqs(rfqsData || []);
      setInvoices(invoicesData || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page-content fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Loader2 className="animate-spin" size={32} color="#64748b" />
      </div>
    );
  }

  // Generate some mock chart data based on real stats for demonstration
  const procurementTrendData = [
    { month: "Jan", value: 1200000, rfqs: 12 },
    { month: "Feb", value: 1800000, rfqs: 15 },
    { month: "Mar", value: 1400000, rfqs: 10 },
    { month: "Apr", value: 2100000, rfqs: 22 },
    { month: "May", value: 1600000, rfqs: 18 },
    { month: "Jun", value: stats.total_spend || 2500000, rfqs: stats.total_rfqs || 28 },
  ];

  const spendingByCategoryData = [
    { name: "IT Equipment", value: (stats.total_spend || 0) * 0.45, fill: "#2563eb" },
    { name: "Office Supplies", value: (stats.total_spend || 0) * 0.25, fill: "#7c3aed" },
    { name: "Maintenance", value: (stats.total_spend || 0) * 0.15, fill: "#16a34a" },
    { name: "Logistics", value: (stats.total_spend || 0) * 0.10, fill: "#d97706" },
    { name: "Other", value: (stats.total_spend || 0) * 0.05, fill: "#94a3b8" },
  ];

  return (
    <div className="page-content fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Welcome back, Admin. Here&apos;s your procurement overview.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/vendors" className="btn btn-outline"><Building2 size={15} /> Add Vendor</Link>
          <Link href="/rfqs/create" className="btn btn-primary"><Plus size={15} /> New RFQ</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <KPICard label="Total RFQs" value={stats.total_rfqs} icon={FileText} color="#2563eb" sub={`${stats.open_rfqs} currently open`} />
        <KPICard label="Active Vendors" value={stats.active_vendors} icon={CheckSquare} color="#16a34a" sub="Registered & Approved" />
        <KPICard label="Total POs" value={stats.total_pos} icon={ShoppingCart} color="#7c3aed" sub={`Spend: ${formatCurrency(stats.total_spend)}`} />
        <KPICard label="Pending Invoices" value={stats.pending_invoices} icon={Receipt} color="#d97706" sub={`Amount: ${formatCurrency(stats.pending_amount)}`} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 24 }}>
        {/* Procurement Trend */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Procurement Trend</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>RFQ volume & spend — last 6 months</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={procurementTrendData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(v: any, name: any) => [name === "value" ? formatCurrency(v as number) : v, name === "value" ? "Spend" : "RFQs"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar dataKey="rfqs" fill="#7c3aed" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontWeight: 700, fontSize: 15 }}>Spend by Category</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>YTD distribution</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={spendingByCategoryData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {spendingByCategoryData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v as number)} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Recent RFQs */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent RFQs</div>
            <Link href="/rfqs" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead><tr>
                <th>RFQ #</th><th>Title</th><th>Status</th><th>Deadline</th>
              </tr></thead>
              <tbody>
                {rfqs.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td><Link href={`/rfqs/${r.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>{r.rfq_number}</Link></td>
                    <td style={{ maxWidth: 160 }}><div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{r.title}</div></td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{formatDate(r.deadline)}</td>
                  </tr>
                ))}
                {rfqs.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: 20 }}>No RFQs found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Invoices</div>
            <Link href="/invoices" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead><tr>
                <th>Invoice #</th><th>Vendor</th><th>Amount</th><th>Status</th>
              </tr></thead>
              <tbody>
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id}>
                    <td><Link href={`/invoices/${inv.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>{inv.invoice_number}</Link></td>
                    <td style={{ fontSize: 13 }}>{inv.vendors?.company_name}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(inv.total_amount)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
                {invoices.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: 20 }}>No Invoices found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
