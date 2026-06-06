"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "vendor">("admin");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/vendor/dashboard");
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
      {/* Left panel - Decorative */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 40px", color: "white" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={24} color="white" />
            </div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>VendorBridge</div>
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 500 }}>
            Procurement Lifecycle,<br /><span style={{ color: "#60a5fa" }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 450, lineHeight: 1.6 }}>
            The enterprise ERP for managing vendors, sourcing automation, AI-driven quotation comparisons, and seamless invoice tracking.
          </p>
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>© 2026 VendorBridge Corp.</div>
      </div>

      {/* Right panel - Login form */}
      <div style={{ width: 520, background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxShadow: "-10px 0 30px rgba(0,0,0,0.03)" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>Enter your credentials to access your account.</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Role selector demo purely for UI */}
            <div style={{ display: "flex", background: "#f1f5f9", padding: 4, borderRadius: 10, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setRole("admin")}
                style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s ease", background: role === "admin" ? "white" : "transparent", color: role === "admin" ? "#0f172a" : "#64748b", boxShadow: role === "admin" ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}
              >
                Internal User
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s ease", background: role === "vendor" ? "white" : "transparent", color: role === "vendor" ? "#0f172a" : "#64748b", boxShadow: role === "vendor" ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}
              >
                Vendor Portal
              </button>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Email Address</label>
              <input className="input" type="email" placeholder={role === "admin" ? "admin@vendorbridge.com" : "vendor@domain.com"} required style={{ padding: "12px 14px", fontSize: 15 }} defaultValue={role === "admin" ? "admin@vendorbridge.com" : "vendor@domain.com"} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
              </div>
              <input className="input" type="password" placeholder="••••••••" required style={{ padding: "12px 14px", fontSize: 15 }} defaultValue="password" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "12px", justifyContent: "center", fontSize: 15, marginTop: 8 }} disabled={loading}>
              {loading ? "Signing in..." : <span style={{ display: "flex", alignItems: "center", gap: 8 }}>Sign In <ArrowRight size={16} /></span>}
            </button>
          </form>

          <div style={{ marginTop: 32, padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px dashed #cbd5e1" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Demo Instructions</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              Use the toggle above to switch between the <strong>Internal User</strong> (Admin Dashboard) and <strong>Vendor Portal</strong> views. Passwords are pre-filled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
