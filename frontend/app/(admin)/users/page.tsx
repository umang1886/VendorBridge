"use client";
import { users } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { UserPlus, ShieldAlert } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="page-content fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>User Management</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage platform access and role assignments (Admin only)</p>
        </div>
        <button className="btn btn-primary"><UserPlus size={14} /> Add User</button>
      </div>

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: 16, borderRadius: 10, display: "flex", gap: 12, marginBottom: 24 }}>
        <ShieldAlert size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: 14, marginBottom: 4 }}>Access Control Information</div>
          <div style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.5 }}>
            Users are restricted by their roles: <strong>Admin</strong> has full access. <strong>Manager</strong> can only approve/reject requests. <strong>Procurement Officer</strong> can manage RFQs and POs but cannot approve them. <strong>Vendors</strong> only see their own portal.
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</td>
                <td style={{ fontSize: 13 }}>{user.email}</td>
                <td><span className={`badge badge-${user.role}`}>{user.role.replace("_", " ")}</span></td>
                <td><span className={`badge badge-${user.is_active ? "active" : "inactive"}`}>{user.is_active ? "Active" : "Disabled"}</span></td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{formatDateTime(user.last_login)}</td>
                <td>
                  <button className="btn btn-outline btn-sm">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
