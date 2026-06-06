"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Shield, Users, Zap, FileCheck, ChevronRight, Mail, Lock } from "lucide-react";

const features = [
  { icon: Zap, label: "AI-Powered Analysis", desc: "Smart quotation ranking" },
  { icon: Users, label: "Vendor Management", desc: "Centralized vendor hub" },
  { icon: FileCheck, label: "Smart RFQs", desc: "Automated workflows" },
];

const stats = [
  { value: "2x", label: "Faster Procurement" },
  { value: "40%", label: "Cost Savings" },
  { value: "100%", label: "Audit Ready" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "vendor">("admin");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(role === "admin" ? "/dashboard" : "/vendor/dashboard");
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', system-ui, sans-serif", background: "#060b18" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .login-hero-left {
          position: relative;
          flex: 1;
          background: linear-gradient(135deg, #060b18 0%, #0d1535 40%, #110a2e 100%);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          color: white;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 18px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          animation: fadeUp 0.6s ease both;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(139,92,246,0.3);
          transform: translateX(4px);
        }

        .stat-item {
          text-align: center;
          animation: fadeUp 0.8s ease both;
        }

        .role-btn {
          flex: 1;
          padding: 10px 0;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          z-index: 1;
        }

        .login-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14.5px;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
        }
        .login-input::placeholder {
          color: #94a3b8;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          font-family: inherit;
        }
        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .login-btn:hover::after { transform: translateX(100%); }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(124,58,237,0.4); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      `}</style>

      {/* LEFT HERO PANEL */}
      <div className="login-hero-left">
        <div className="grid-overlay" />

        {/* Decorative orbs */}
        <div className="orb" style={{ width: 400, height: 400, top: -100, left: -100, background: "radial-gradient(circle, rgba(79,70,229,0.25), transparent 70%)" }} />
        <div className="orb" style={{ width: 350, height: 350, bottom: -80, right: -60, background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)", animationDelay: "1.5s" }} />
        <div className="orb" style={{ width: 200, height: 200, top: "40%", right: "20%", background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)", animationDelay: "3s" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 56 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)"
            }}>
              <Building2 size={24} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>VendorBridge</span>
          </div>

          {/* Headline */}
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 480 }}>
              Procurement
              <br />Lifecycle,
              <br />
              <span style={{
                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Simplified.</span>
            </h1>
            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, maxWidth: 380, marginBottom: 44 }}>
              The enterprise platform for managing vendors, automating sourcing, and driving smarter procurement decisions.
            </p>
          </div>

          {/* Feature cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(139,92,246,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <f.icon size={17} color="#a78bfa" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{f.label}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{f.desc}</div>
                </div>
                <ChevronRight size={14} color="#475569" style={{ marginLeft: "auto" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", gap: 0,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden", marginBottom: 28
          }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-item" style={{
                flex: 1, padding: "18px 12px",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                animationDelay: `${0.4 + i * 0.1}s`
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: 11.5, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#334155" }}>© 2026 VendorBridge Corp. All rights reserved.</div>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div style={{
        width: 500, background: "white", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40, boxShadow: "-20px 0 60px rgba(0,0,0,0.25)"
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Header */}
          <div style={{ marginBottom: 36, opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
              border: "1px solid #c4b5fd",
              borderRadius: 20, padding: "5px 14px", marginBottom: 20
            }}>
              <Shield size={12} color="#7c3aed" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>Secure Login</span>
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.5 }}>Sign in to access your VendorBridge account.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Role Toggle */}
            <div style={{ background: "#f1f5f9", padding: 5, borderRadius: 14, display: "flex", position: "relative" }}>
              {/* Sliding pill */}
              <div style={{
                position: "absolute",
                top: 5, bottom: 5,
                left: role === "admin" ? 5 : "calc(50% + 0px)",
                width: "calc(50% - 5px)",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                borderRadius: 10,
                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.35)"
              }} />
              {[{ key: "admin", label: "Internal User" }, { key: "vendor", label: "Vendor Portal" }].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key as "admin" | "vendor")}
                  className="role-btn"
                  style={{
                    color: role === r.key ? "white" : "#64748b",
                    background: "transparent",
                    position: "relative", zIndex: 1,
                    transition: "color 0.2s ease"
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Email Field */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  className="login-input"
                  type="email"
                  key={role + "-email"}
                  defaultValue={role === "admin" ? "admin@vendorbridge.com" : "vendor@domain.com"}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input className="login-input" type="password" defaultValue="password" required />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin-slow 0.8s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div style={{
            marginTop: 28,
            background: "linear-gradient(135deg, #f5f3ff, #eff6ff)",
            border: "1px solid #e0e7ff",
            borderRadius: 12, padding: "14px 16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Zap size={12} color="#7c3aed" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#5b21b6" }}>Demo Mode</span>
            </div>
            <div style={{ fontSize: 12, color: "#6d28d9", lineHeight: 1.6 }}>
              Toggle between <strong>Internal User</strong> (Admin Dashboard) and <strong>Vendor Portal</strong>. Credentials are pre-filled — just click Sign In!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
