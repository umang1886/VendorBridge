"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Award, Zap, CheckCircle, TrendingUp, Clock, Star, ShieldCheck, Loader2 } from "lucide-react";
import { getRFQById, getQuotationsByRFQ, getAIAnalysisByRFQ, createPurchaseOrder } from "@/lib/supabase";

function ScoreBar({ score, max = 100, color = "#2563eb" }: { score: number; max?: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${(score / max) * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 32 }}>{score}</span>
    </div>
  );
}

export default function ComparisonPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const [selectedWinner, setSelectedWinner] = useState<any | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rfq, setRfq] = useState<any>(null);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [poCreated, setPoCreated] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfq_id: rfqId }),
      });
      const result = await res.json();
      if (res.ok) {
        const aiData = await getAIAnalysisByRFQ(rfqId);
        setAiAnalysis(aiData);
      } else {
        alert('Analysis failed: ' + (result.error || result.message || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Analysis failed: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    Promise.all([
      getRFQById(rfqId),
      getQuotationsByRFQ(rfqId),
      getAIAnalysisByRFQ(rfqId)
    ]).then(([rfqData, quotesData, aiData]) => {
      setRfq(rfqData);
      setQuotations(quotesData || []);
      setAiAnalysis(aiData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [rfqId]);

  if (loading) {
    return <div className="page-content fade-in" style={{ padding: "40px", textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto" }} size={32} /></div>;
  }

  if (!rfq) {
    return <div className="page-content fade-in">RFQ not found.</div>;
  }

  const lowestPrice = quotations.length > 0 ? Math.min(...quotations.map(q => Number(q.total_amount))) : 0;
  const aiRanking = aiAnalysis?.ranked_quotations || [];

  return (
    <div className="page-content fade-in">
      <Link href={`/rfqs/${rfq.id}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to {rfq.rfq_number}
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Quotation Comparison</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>{rfq.title} · {quotations.length} quotations</p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing || quotations.length === 0}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          {analyzing ? 'Analyzing…' : 'Run Analysis'}
        </button>
      </div>

      {/* No Analysis Banner */}
      {!aiAnalysis && quotations.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap size={20} color="#d97706" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: 14 }}>No analysis yet</div>
            <div style={{ color: '#b45309', fontSize: 13 }}>Click <strong>Run Analysis</strong> above to automatically score and rank all quotations.</div>
          </div>
        </div>
      )}

      {/* AI Recommendation Banner */}
      {aiAnalysis && (
        <div className="ai-panel" style={{ padding: 20, marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#dbeafe,#ede9fe)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={22} color="#2563eb" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>AI Recommendation</span>
              <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
                {aiAnalysis.confidence_score || 95}% Confidence
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 10 }}>{aiAnalysis.ai_summary}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Award size={15} color="#d97706" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Best Vendor: {aiAnalysis.vendors?.company_name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="card" style={{ overflow: "auto", marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ fontWeight: 700, fontSize: 15 }}>Side-by-Side Comparison</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Lowest price highlighted in green</div>
        </div>
        <table className="data-table">
          <thead><tr>
            <th>Vendor</th>
            <th>Total Amount</th>
            <th>Delivery Days</th>
            <th>Vendor Rating</th>
            <th>AI Rank</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            {quotations.map((q, idx) => {
              const isLowest = Number(q.total_amount) === lowestPrice;
              const isRecommended = aiAnalysis?.recommended_vendor_id === q.vendor_id;
              const rank = aiRanking.findIndex((r: any) => r.vendor_id === q.vendor_id) + 1 || "-";
              
              return (
                <tr key={q.id} style={{ background: isRecommended ? "#f0f9ff" : "white" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isRecommended && <Award size={15} color="#d97706" />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{q.vendors?.company_name}</div>
                        {isRecommended && <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>AI Recommended</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 800, fontSize: 14,
                      color: isLowest ? "#15803d" : "#0f172a",
                      background: isLowest ? "#dcfce7" : "transparent",
                      padding: isLowest ? "3px 8px" : "0", borderRadius: 6,
                    }}>
                      {formatCurrency(q.total_amount)}
                    </span>
                    {isLowest && <div style={{ fontSize: 10, color: "#15803d", fontWeight: 600, marginTop: 2 }}>✓ Lowest Price</div>}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600 }}>
                      <Clock size={13} color="#d97706" />{q.delivery_days} days
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 1 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(q.vendors?.rating || 3) ? "#fbbf24" : "#e2e8f0", fontSize: 15 }}>★</span>)}
                      <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>{q.vendors?.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: 18, color: rank === 1 ? "#d97706" : "#94a3b8" }}>#{rank}</span>
                  </td>
                  <td>
                    {q.status === "awarded" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#15803d", fontWeight: 700, fontSize: 13 }}><CheckCircle size={14} /> Winner</span>
                    ) : (
                      <button
                        onClick={() => { setSelectedWinner(q); setShowApprovalModal(true); }}
                        className="btn btn-primary btn-sm"
                      >
                        Select Winner
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {quotations.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No quotations received yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Scoring Breakdown */}
      {aiRanking.length > 0 && (
        <div className="card">
          <div className="card-header"><div style={{ fontWeight: 700, fontSize: 15 }}>Scoring Breakdown</div></div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 16 }}>
              {[{ label: "Price", weight: "40%", color: "#2563eb", icon: TrendingUp }, { label: "Delivery", weight: "25%", color: "#16a34a", icon: Clock }, { label: "Rating", weight: "35%", color: "#d97706", icon: Star }].map((f) => (
                <div key={f.label} style={{ padding: "14px", background: `${f.color}08`, borderRadius: 10, border: `1px solid ${f.color}20` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <f.icon size={14} color={f.color} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{f.weight}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>of composite score</div>
                </div>
              ))}
            </div>
            {aiRanking.map((r: any, idx: number) => (
              <div key={r.vendor_name} style={{ padding: "16px", background: "#f8fafc", borderRadius: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>#{idx + 1} {r.vendor_name}</div>
                  <span style={{ fontWeight: 800, color: "#2563eb", fontSize: 16 }}>Score: {r.composite_score}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Price</div><ScoreBar score={r.price_score} color="#2563eb" /></div>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Delivery</div><ScoreBar score={r.delivery_score} color="#16a34a" /></div>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Rating</div><ScoreBar score={r.rating_score} color="#d97706" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner selection modal */}
      {showApprovalModal && selectedWinner && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card fade-in" style={{ width: 480, padding: 28 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Confirm Winner Selection</div>
            {poCreated ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto 16px" }} />
                <div style={{ fontSize: 18, fontWeight: 700 }}>PO Generated & Approved!</div>
                <p style={{ color: "#64748b", marginTop: 8, fontSize: 13 }}>The vendor has been notified via email.</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowApprovalModal(false)}>Close</button>
              </div>
            ) : (
              <>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
                  You are selecting <strong>{selectedWinner.vendors?.company_name}</strong> as the winning vendor for <strong>{formatCurrency(selectedWinner.total_amount)}</strong>.
                </p>
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 12, marginBottom: 20, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#166534" }}>Auto-Approve & Notify</div>
                  <div style={{ fontSize: 12, color: "#14532d", marginTop: 4 }}>This will automatically generate a Purchase Order and trigger the notification webhook.</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Remarks (optional)</label>
                  <textarea className="input" rows={3} placeholder="Add any notes for the PO…" style={{ resize: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button disabled={approving} className="btn btn-outline" onClick={() => setShowApprovalModal(false)}>Cancel</button>
                  <button 
                    disabled={approving} 
                    className="btn btn-primary" 
                    onClick={async () => {
                      setApproving(true);
                      try {
                        const po = await createPurchaseOrder({
                          rfq_id: rfq.id,
                          vendor_id: selectedWinner.vendor_id,
                          total_amount: selectedWinner.total_amount
                        });
                        
                        // Trigger Webhook 3
                        try {
                          await fetch('https://krish240724.app.n8n.cloud/webhook/po-approved', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ po_id: po.id })
                          });
                        } catch (e) {
                          console.warn("n8n webhook 3 failed", e);
                        }
                        
                        setPoCreated(true);
                      } catch (err) {
                        console.error(err);
                        alert("Failed to create PO");
                      } finally {
                        setApproving(false);
                      }
                    }}
                  >
                    {approving ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                    Approve & Award
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
