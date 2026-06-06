"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { procurementTrendData, spendingByCategoryData, vendorPerformanceData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#fbbf24" : "#e2e8f0" }}>★</span>
      ))}
    </span>
  );
}

export default function ReportsPage() {
  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Reports & Analytics</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Insights into procurement spend and vendor performance</p>
        </div>
        <button className="btn btn-outline"><Download size={14} /> Export CSV</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><div style={{ fontWeight: 700 }}>Spend & Volume Trend (Last 6 Months)</div></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procurementTrendData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any, name: any) => [name === "value" ? formatCurrency(v as number) : v, name === "value" ? "Spend" : "RFQs"]} />
                <Legend />
                <Bar yAxisId="left" name="Total Spend" dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" name="RFQ Volume" dataKey="rfqs" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div style={{ fontWeight: 700 }}>Spend Distribution by Category</div></div>
          <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={spendingByCategoryData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {spendingByCategoryData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-header"><div style={{ fontWeight: 700 }}>Vendor Performance Scorecard</div></div>
        <table className="data-table">
          <thead><tr>
            <th>Vendor Name</th><th>Rating</th><th>On-Time Delivery Rate</th><th>Quotation Win Rate</th><th>Total RFQs Participated</th>
          </tr></thead>
          <tbody>
            {vendorPerformanceData.map((v) => (
              <tr key={v.vendor}>
                <td style={{ fontWeight: 600 }}>{v.vendor}</td>
                <td><StarRating rating={v.rating} /> <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>{v.rating}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 100, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                      <div style={{ width: `${v.on_time}%`, height: "100%", background: v.on_time > 80 ? "#16a34a" : "#d97706", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{v.on_time}%</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{v.win_rate}%</td>
                <td>{v.rfqs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
