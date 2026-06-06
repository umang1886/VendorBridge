"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FileText, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getVendorRFQs } from "@/lib/supabase";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function VendorRFQsPage() {
  const [search, setSearch] = useState("");
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // DEMO: hardcoded vendor ID (Priya Sharma from Tech Solutions Ltd)
  const VENDOR_ID = "a1b2c3d4-0002-0000-0000-000000000002";

  useEffect(() => {
    getVendorRFQs(VENDOR_ID).then(data => {
      setRfqs(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = rfqs.filter((r) => 
    r.title.toLowerCase().includes(search.toLowerCase()) || r.rfq_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>RFQ Assignments</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Submit quotations for procurement requests</p>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input className="input" style={{ paddingLeft: 36 }} placeholder="Search RFQs…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
           <div style={{ padding: "40px", textAlign: "center" }}>
            <Loader2 className="animate-spin" style={{ margin: "0 auto", color: "#64748b" }} size={32} />
          </div>
        ) : (
          <table className="data-table">
            <thead><tr>
              <th>RFQ Number</th><th>Title</th><th>Status</th><th>Deadline</th><th>Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/vendor/rfqs/${r.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>{r.rfq_number}</Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Issued by VendorBridge Corp.</div>
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <span style={{ color: r.status === "open" ? "#dc2626" : "#64748b", fontWeight: r.status === "open" ? 600 : 400, fontSize: 13 }}>
                      {formatDate(r.deadline)}
                    </span>
                  </td>
                  <td>
                    {r.status === "open" ? (
                      <Link href={`/vendor/rfqs/${r.id}`} className="btn btn-primary btn-sm"><Send size={13} /> Submit Quotation</Link>
                    ) : (
                      <Link href={`/vendor/rfqs/${r.id}`} className="btn btn-outline btn-sm"><FileText size={13} /> View Details</Link>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No RFQs assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
