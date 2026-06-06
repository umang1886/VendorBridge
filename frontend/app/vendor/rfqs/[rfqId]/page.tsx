"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, Loader2 } from "lucide-react";
import { getRFQForVendor, submitQuotation } from "@/lib/supabase";

import { use } from "react";

export default function VendorRFQDetailPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const router = useRouter();
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [prices, setPrices] = useState<Record<string, string>>({});
  const [deliveryDays, setDeliveryDays] = useState("7");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1] || "";
        setFileBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // DEMO: hardcoded vendor ID (Priya Sharma from Tech Solutions Ltd)
  const VENDOR_ID = "a1b2c3d4-0002-0000-0000-000000000002";

  useEffect(() => {
    getRFQForVendor(rfqId).then(data => {
      setRfq(data);
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

  const handlePriceChange = (itemId: string, value: string) => {
    setPrices(prev => ({ ...prev, [itemId]: value }));
  };

  const calculateTotal = () => {
    return rfq.rfq_items.reduce((total: number, item: any) => {
      const price = parseFloat(prices[item.id] || "0");
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSubmit = async () => {
    const isFileUpload = !!uploadedFile;
    const computedTotalAmount = calculateTotal();

    if (!isFileUpload && computedTotalAmount <= 0) {
      setError("Please enter unit prices for all items.");
      return;
    }
    
    setSaving(true);
    setError("");

    try {
      const totalAmount = isFileUpload ? 0 : rfq.rfq_items.reduce((sum: number, item: any) => sum + (Number(prices[item.id]) * item.quantity || 0), 0);

      const items = isFileUpload ? [] : rfq.rfq_items.map((item: any) => {
        const unit_price = parseFloat(prices[item.id] || "0");
        return {
          rfq_item_id: item.id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: unit_price,
          total_price: unit_price * item.quantity
        };
      });

      await submitQuotation({
        rfq_id: rfq.id,
        vendor_id: VENDOR_ID,
        total_amount: totalAmount,
        delivery_days: parseInt(deliveryDays),
        payment_terms: paymentTerms,
        notes: isFileUpload ? `[FILE_UPLOADED: ${uploadedFile.name}]` : "",
        items
      });

      // TRIGGER n8n WEBHOOK FOR AI ANALYSIS
      try {
        const webhookUrl = 'https://krish240724.app.n8n.cloud/webhook/trigger-ai-analysis';
        console.log("Sending AI webhook to:", webhookUrl);
        const whRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            rfq_id: rfq.id,
            has_file: isFileUpload,
            file_name: uploadedFile?.name,
            file_data: fileBase64,
            mime_type: uploadedFile?.type
          })
        });
        if (!whRes.ok) {
          console.error("n8n webhook failed with status:", whRes.status, await whRes.text());
        } else {
          console.log("n8n webhook succeeded!");
        }
      } catch (webhookErr) {
        console.warn("n8n webhook failed, but quotation saved:", webhookErr);
      }

      setSuccess(true);
      setTimeout(() => router.push("/vendor/quotations"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit quotation.");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="page-content fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={56} color="#16a34a" style={{ margin: "0 auto 16px" }} />
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Quotation Submitted!</div>
          <p style={{ color: "#64748b", marginTop: 8 }}>Your quotation has been sent to the buyer. AI analysis is now running.</p>
        </div>
      </div>
    );
  }

  // Check if vendor already submitted
  const alreadySubmitted = rfq.quotations?.some((q: any) => q.vendor_id === VENDOR_ID);

  return (
    <div className="page-content fade-in">
      <Link href="/vendor/rfqs" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to RFQs
      </Link>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{rfq.title}</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>RFQ Number: {rfq.rfq_number} · Deadline: {new Date(rfq.deadline).toLocaleDateString()}</p>
        </div>
        {alreadySubmitted ? (
          <span className="badge badge-awarded" style={{ padding: "8px 12px", fontSize: 14 }}>✓ Quotation Submitted</span>
        ) : (
          <span className="badge badge-open" style={{ padding: "8px 12px", fontSize: 14 }}>Awaiting Your Quotation</span>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", borderRadius: 8, border: "1px solid #fca5a5", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Option 1: Upload Quotation File</h3>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Upload your formal quotation PDF or Image. Our AI will automatically analyze it and extract pricing.</p>
            
            <div style={{ border: "2px dashed #cbd5e1", borderRadius: 8, padding: 32, textAlign: "center", background: "#f8fafc" }}>
              {uploadedFile ? (
                <div>
                  <CheckCircle size={32} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => { setUploadedFile(null); setFileBase64(""); }}>Remove File</button>
                </div>
              ) : (
                <div>
                  <label style={{ cursor: "pointer", display: "inline-block" }}>
                    <span className="btn btn-primary">Choose File</span>
                    <input type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                  </label>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>Supported formats: PDF, PNG, JPG (Max 5MB)</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>OR</div>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          <div className="card" style={{ overflow: "hidden", marginBottom: 24, opacity: uploadedFile ? 0.5 : 1, pointerEvents: uploadedFile ? "none" : "auto" }}>
            <div className="card-header"><div style={{ fontWeight: 700, fontSize: 15 }}>Option 2: Enter Line Item Pricing</div></div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th>Item</th>
                    <th style={{ width: 100 }}>Quantity</th>
                    <th style={{ width: 140 }}>Unit Price (₹)</th>
                    <th style={{ width: 140 }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {rfq.rfq_items?.map((item: any) => {
                    const price = parseFloat(prices[item.id] || "0");
                    const total = price * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td><div style={{ fontWeight: 600, fontSize: 13 }}>{item.item_name}</div></td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>
                          {alreadySubmitted ? (
                            <span>-</span>
                          ) : (
                            <input 
                              type="number" 
                              className="input" 
                              style={{ padding: "6px 10px", fontSize: 13 }} 
                              placeholder="0.00"
                              value={prices[item.id] || ""}
                              onChange={e => handlePriceChange(item.id, e.target.value)}
                            />
                          )}
                        </td>
                        <td style={{ fontWeight: 700, color: "#0f172a" }}>
                          {total > 0 ? `₹${total.toLocaleString()}` : "₹0"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f8fafc" }}>
                    <td colSpan={3} style={{ textAlign: "right", fontWeight: 700 }}>Grand Total:</td>
                    <td style={{ fontWeight: 800, fontSize: 16, color: "#16a34a" }}>
                      ₹{calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-header"><div style={{ fontWeight: 700 }}>Terms & Conditions</div></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Delivery Days *</label>
                <input 
                  type="number" 
                  className="input" 
                  value={deliveryDays} 
                  onChange={e => setDeliveryDays(e.target.value)} 
                  disabled={alreadySubmitted}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Payment Terms</label>
                <select className="select" style={{ width: "100%" }} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} disabled={alreadySubmitted}>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                  <option value="Immediate">Immediate / Advance</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Notes / Remarks</label>
                <textarea className="input" rows={3} placeholder="Any specific conditions..." disabled={alreadySubmitted}></textarea>
              </div>
            </div>
          </div>

          {!alreadySubmitted && rfq.status === "open" && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || (!uploadedFile && rfq.rfq_items.some((i: any) => !prices[i.id]))}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {saving ? "Submitting..." : "Submit Formal Quotation"}
                </button>
              </div>
              <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 12 }}>
                By submitting, you agree to the VendorBridge terms and conditions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
