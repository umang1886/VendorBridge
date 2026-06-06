"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Send, Loader2, CheckCircle } from "lucide-react";
import { getVendors, createRFQ, logActivity } from "@/lib/supabase";

export default function CreateRFQPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [items, setItems] = useState([{ item_name: "", quantity: 1, unit: "units" }]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getVendors()
      .then(data => setVendors((data || []).filter((v: any) => v.status === "active")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addItem = () => setItems([...items, { item_name: "", quantity: 1, unit: "units" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: string | number) =>
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const toggleVendor = (id: string) =>
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);

  async function handleSubmit(status: "draft" | "open") {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!deadline) { setError("Deadline is required"); return; }
    if (items.some(i => !i.item_name.trim())) { setError("All line items need a name"); return; }
    if (status === "open" && selectedVendors.length === 0) { setError("Select at least one vendor to publish"); return; }
    setError("");
    setSaving(true);
    try {
      const rfq = await createRFQ({ title, description, deadline, items, vendor_ids: selectedVendors });
      await logActivity({ entity_type: "rfq", entity_id: rfq.id, action: `rfq_${status}`, description: `RFQ "${title}" ${status === "draft" ? "saved as draft" : "published to vendors"}` });
      
      // Trigger n8n webhook for email notification if published
      if (status === "open") {
        try {
          const webhookUrl = 'https://krish240724.app.n8n.cloud/webhook/rfq-published';
          console.log("Sending RFQ webhook to:", webhookUrl);
          const whRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rfq_id: rfq.id, title, deadline })
          });
          if (!whRes.ok) {
            console.error("n8n webhook 1 failed with status:", whRes.status, await whRes.text());
          } else {
            console.log("n8n webhook 1 succeeded!");
          }
        } catch (webhookErr) {
          console.warn("n8n webhook failed, but RFQ saved:", webhookErr);
        }
      }

      setSuccess(true);
      setTimeout(() => router.push("/rfqs"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create RFQ");
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="page-content fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={56} color="#16a34a" style={{ margin: "0 auto 16px" }} />
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>RFQ Created Successfully!</div>
          <p style={{ color: "#64748b", marginTop: 8 }}>Redirecting to RFQ list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content fade-in">
      <Link href="/rfqs" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to RFQs
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create New RFQ</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Fill in the details and select vendors to receive quotation requests</p>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", borderRadius: 8, border: "1px solid #fca5a5", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-header"><div style={{ fontWeight: 700 }}>Basic Information</div></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>RFQ Title *</label>
                <input className="input" placeholder="e.g. Office Stationery Q2 2025" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Description</label>
                <textarea className="input" rows={3} placeholder="Detailed description of the procurement requirement…" style={{ resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Submission Deadline *</label>
                <input className="input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Line Items</div>
              <button className="btn btn-outline btn-sm" onClick={addItem}><Plus size={13} /> Add Item</button>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item, i) => (
                <div key={i} style={{ padding: 14, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 36px", gap: 10, alignItems: "end" }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Item Name *</label>
                      <input className="input" placeholder="e.g. A4 Paper Reams" value={item.item_name} onChange={e => updateItem(i, "item_name", e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Quantity *</label>
                      <input className="input" type="number" min="1" value={item.quantity} onChange={e => updateItem(i, "quantity", Number(e.target.value))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Unit</label>
                      <select className="select" style={{ width: "100%" }} value={item.unit} onChange={e => updateItem(i, "unit", e.target.value)}>
                        <option>units</option><option>kg</option><option>MT</option><option>liters</option><option>boxes</option><option>reams</option><option>pairs</option>
                      </select>
                    </div>
                    {items.length > 1 && (
                      <button className="btn btn-danger btn-icon" onClick={() => removeItem(i)} style={{ height: 36, width: 36 }}><Trash2 size={13} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 700 }}>Assign Vendors</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {loading ? "Loading…" : `${selectedVendors.length} of ${vendors.length} selected`}
              </div>
            </div>
            <div className="card-body" style={{ padding: 0, maxHeight: 320, overflowY: "auto" }}>
              {loading ? (
                <div style={{ padding: 20, textAlign: "center" }}><Loader2 size={20} color="#94a3b8" /></div>
              ) : vendors.map((v) => (
                <div key={v.id} onClick={() => toggleVendor(v.id)}
                  style={{
                    padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f1f5f9",
                    background: selectedVendors.includes(v.id) ? "#eff6ff" : "white",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, border: "2px solid",
                    borderColor: selectedVendors.includes(v.id) ? "#2563eb" : "#cbd5e1",
                    background: selectedVendors.includes(v.id) ? "#2563eb" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {selectedVendors.includes(v.id) && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.company_name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{v.category} · ★{v.rating}</div>
                  </div>
                </div>
              ))}
              {!loading && vendors.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  No active vendors found. <Link href="/vendors" style={{ color: "#2563eb" }}>Add vendors first</Link>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <button disabled={saving} className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => handleSubmit("draft")}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save as Draft
            </button>
            <button disabled={saving} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => handleSubmit("open")}>
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
              Publish & Notify Vendors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
