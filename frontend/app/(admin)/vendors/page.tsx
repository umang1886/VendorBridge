"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Star, Edit2, Trash2, Building2, Loader2, CheckCircle } from "lucide-react";
import { getVendors, createVendor } from "@/lib/supabase";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#fbbf24" : "#e2e8f0", fontSize: 14 }}>★</span>
      ))}
      <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>{rating}</span>
    </div>
  );
}

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Vendor Form State
  const [formData, setFormData] = useState({
    company_name: "", contact_person: "", email: "", phone: "",
    address: "", gst_number: "", category: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchVendors = () => {
    setLoading(true);
    getVendors().then(data => {
      setVendors(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSaveVendor = async () => {
    if (!formData.company_name || !formData.email) {
      setError("Company Name and Email are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createVendor({ ...formData, status: "active" } as any);
      setShowForm(false);
      fetchVendors(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to add vendor");
    } finally {
      setSaving(false);
    }
  };

  const filtered = vendors.filter((v) => {
    const matchSearch = v.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (v.gst_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.category || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Vendor Management</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>{vendors.length} vendors registered · {vendors.filter(v => v.status === "active").length} active</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={15} /> Add Vendor</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by name, GST, or category…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Active Vendors", value: vendors.filter(v => v.status === "active").length, color: "#16a34a" },
          { label: "Inactive", value: vendors.filter(v => v.status === "inactive").length, color: "#d97706" },
          { label: "Blacklisted", value: vendors.filter(v => v.status === "blacklisted").length, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: 13, color: "#64748b" }}>{s.label}</span>
            <span style={{ fontWeight: 700, fontSize: 18, marginLeft: "auto", color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Loader2 className="animate-spin" style={{ margin: "0 auto", color: "#64748b" }} size={32} />
            <p style={{ marginTop: 16, color: "#64748b" }}>Loading vendors...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr>
              <th>Vendor</th><th>Category</th><th>GST Number</th><th>Rating</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#2563eb18,#7c3aed18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Building2 size={16} color="#2563eb" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v.company_name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{v.contact_person} · {v.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, background: "#f1f5f9", borderRadius: 6, padding: "3px 8px", fontWeight: 500 }}>{v.category || "General"}</span></td>
                  <td style={{ fontSize: 12, fontFamily: "monospace", color: "#475569" }}>{v.gst_number || "N/A"}</td>
                  <td><StarRating rating={v.rating} /></td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm btn-icon"><Edit2 size={13} /></button>
                      <button className="btn btn-danger btn-sm btn-icon"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div className="card fade-in" style={{ width: 600, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Add New Vendor</div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="card-body">
              {error && (
                <div style={{ padding: "10px", background: "#fee2e2", color: "#dc2626", borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Company Name *</label>
                  <input className="input" placeholder="e.g. Acme Corp" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Email *</label>
                  <input className="input" placeholder="vendor@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Contact Person</label>
                  <input className="input" placeholder="John Doe" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Phone</label>
                  <input className="input" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Category</label>
                  <input className="input" placeholder="e.g. IT Equipment" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Address</label>
                  <input className="input" placeholder="Full address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>GST Number</label>
                  <input className="input" placeholder="22AAAAA0000A1Z5" value={formData.gst_number} onChange={e => setFormData({ ...formData, gst_number: e.target.value })} />
                </div>
                <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <button disabled={saving} className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button disabled={saving} className="btn btn-primary" onClick={handleSaveVendor}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save Vendor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </