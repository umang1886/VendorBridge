"use client";
import { useState } from "react";
import { approvals } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function ApprovalsPage() {
  const [actionModal, setActionModal] = useState<{ approval: typeof approvals[0]; type: "approve" | "reject" } | null>(null);
  const [remarks, setRemarks] = useState("");
  const pending = approvals.filter(a => a.status === "pending");
  const history = approvals.filter(a => a.status !== "pending");

  return (
    <div className="page-content fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Approval Workflow</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Review and action pending procurement approvals</p>

      {/* Pending */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Pending Approvals</div>
          <span style={{ background: "#ef4444", color: "white", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{pending.length}</span>
        </div>

        {pending.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <CheckCircle size={36} color="#16a34a" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontWeight: 600, color: "#0f172a" }}>All clear!</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>No pending approvals at this time.</div>
          </div>
        )}

        {pending.map((a) => (
          <div key={a.id} className="card" style={{ marginBottom: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Clock size={15} color="#d97706" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{a.rfq_title}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Selected Vendor</div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.vendor_name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Amount</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{formatCurrency(a.amount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Submitted</div>
                    <div style={{ fontSize: 13 }}>{formatDateTime(a.created_at)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Link href={`/rfqs/${a.rfq_id}`} style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    View RFQ <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginLeft: 20 }}>
                <button
                  className="btn btn-danger"
                  onClick={() => { setActionModal({ approval: a, type: "reject" }); setRemarks(""); }}
                >
                  <XCircle size={14} /> Reject
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => { setActionModal({ approval: a, type: "approve" }); setRemarks(""); }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Approval History</div>
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead><tr>
              <th>RFQ</th><th>Vendor</th><th>Amount</th><th>Status</th><th>Remarks</th><th>Actioned</th>
            </tr></thead>
            <tbody>
              {history.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{a.rfq_title}</td>
                  <td style={{ fontSize: 13 }}>{a.vendor_name}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(a.amount)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ fontSize: 12, color: "#64748b", maxWidth: 200 }}>{a.remarks || "—"}</td>
                  <td style={{ fontSize: 12, color: "#94a3b8" }}>{a.actioned_at ? formatDateTime(a.actioned_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card fade-in" style={{ width: 460, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              {actionModal.type === "approve"
                ? <CheckCircle size={22} color="#16a34a" />
                : <XCircle size={22} color="#dc2626" />}
              <span style={{ fontWeight: 800, fontSize: 18 }}>
                {actionModal.type === "approve" ? "Approve Procurement" : "Reject Procurement"}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
              <strong>{actionModal.approval.rfq_title}</strong> — {actionModal.approval.vendor_name} — {formatCurrency(actionModal.approval.amount)}
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                Remarks {actionModal.type === "reject" ? "(required)" : "(optional)"}
              </label>
              <textarea className="input" rows={3} placeholder="Add your remarks…" value={remarks} onChange={(e) => setRemarks(e.target.value)} style={{ resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
              <button
                className={`btn ${actionModal.type === "approve" ? "btn-success" : "btn-danger"}`}
                onClick={() => setActionModal(null)}
                style={{ background: actionModal.type === "approve" ? "#16a34a" : "#dc2626", color: "white" }}
              >
                Confirm {actionModal.type === "approve" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
