"use client";
import { use } from "react";
import { rfqs, quotations, aiAnalysis } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Zap, Award, TrendingUp, Download } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(rating) ? "#fbbf24" : "#e2e8f0" }}>★</span>)}
      <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

export default function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const rfq = rfqs.find(r => r.id === id) || rfqs[1];
  const rfqQuotations = quotations.filter(q => q.rfq_id === rfq.id);

  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: 20 }}>
        <Link href="/rfqs" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to RFQs
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>{rfq.rfq_number}</h1>
              <StatusBadge status={rfq.status} />
            </div>
            <h2 style={{ fontSize: 16, color: "#475569", fontWeight: 500 }}>{rfq.title}</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline"><Download size={14} /> Export PDF</button>
            {rfq.status === "open" && <Link href={`/quotations/${rfq.id}/comparison`} className="btn btn-primary"><Zap size={14} /> View Comparison</Link>}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Deadline</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15 }}><Calendar size={15} color="#d97706" />{formatDate(rfq.deadline)}</div>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Vendors Invited</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15 }}><Users size={15} color="#2563eb" />{rfq.vendor_count} vendors</div>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Quotations Received</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15 }}><TrendingUp size={15} color="#16a34a" />{rfq.quotation_count} of {rfq.vendor_count}</div>
        </div>
      </div>

      {/* Quotations Table */}
      {rfqQuotations.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Quotations Received</div>
            <Link href={`/quotations/${rfq.id}/comparison`} className="btn btn-primary btn-sm"><Zap size={13} /> AI Comparison</Link>
          </div>
          <div style={{ overflow: "auto" }}>
            <table className="data-table">
              <thead><tr>
                <th>Vendor</th><th>Total Amount</th><th>Delivery Days</th><th>Rating</th><th>AI Score</th><th>Status</th>
              </tr></thead>
              <tbody>
                {rfqQuotations.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{q.vendor_name}</td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>{formatCurrency(q.total_amount)}</td>
                    <td>{q.delivery_days} days</td>
                    <td><StarRating rating={q.vendor_rating} /></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                          <div style={{ width: `${q.ai_score}%`, height: "100%", background: "#2563eb", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{q.ai_score}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Analysis Preview */}
      {rfqQuotations.length > 0 && (
        <div className="ai-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>AI Recommendation</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Confidence: {aiAnalysis.confidence_score}%</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                <Award size={11} style={{ display: "inline", marginRight: 4 }} />
                Best: {aiAnalysis.ranking[0]?.vendor_name}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{aiAnalysis.ai_summary}</p>
          <div style={{ marginTop: 14 }}>
            <Link href={`/quotations/${rfq.id}/comparison`} className="btn btn-primary btn-sm">View Full Comparison →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
