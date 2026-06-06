-- ============================================================
-- VendorBridge - Complete Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- Project → SQL Editor → New Query → Paste & Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- 1. VENDORS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    gst_number TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
    rating NUMERIC(3,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 2. USERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'procurement_officer', 'manager', 'vendor')),
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. RFQs
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'awarded', 'cancelled')),
    deadline TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4. RFQ LINE ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rfq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    description TEXT,
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT DEFAULT 'units',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 5. RFQ ↔ VENDOR ASSIGNMENTS (many-to-many)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rfq_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rfq_id, vendor_id)
);

-- ─────────────────────────────────────────────────────────────
-- 6. QUOTATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'awarded', 'rejected')),
    total_amount NUMERIC(15,2) DEFAULT 0,
    delivery_days INTEGER,
    payment_terms TEXT,
    notes TEXT,
    attachment_name TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rfq_id, vendor_id)
);

-- ─────────────────────────────────────────────────────────────
-- 7. QUOTATION LINE ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    rfq_item_id UUID REFERENCES rfq_items(id),
    item_name TEXT NOT NULL,
    quantity NUMERIC(12,2),
    unit TEXT,
    unit_price NUMERIC(12,2) NOT NULL,
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    gst_amount NUMERIC(12,2),
    total_price NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 8. AI ANALYSIS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    ranked_quotations JSONB,
    ai_summary TEXT,
    recommended_vendor_id UUID REFERENCES vendors(id),
    confidence_score NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 9. APPROVALS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES quotations(id),
    requested_by UUID REFERENCES users(id),
    approver_id UUID REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    remarks TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 10. PURCHASE ORDERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number TEXT UNIQUE NOT NULL,
    rfq_id UUID REFERENCES rfqs(id),
    quotation_id UUID REFERENCES quotations(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'shipped', 'delivered', 'cancelled', 'fulfilled')),
    total_amount NUMERIC(15,2) NOT NULL,
    delivery_date TIMESTAMPTZ,
    pdf_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 11. PURCHASE ORDER ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS po_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity NUMERIC(12,2),
    unit TEXT,
    unit_price NUMERIC(12,2),
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    gst_amount NUMERIC(12,2),
    total_price NUMERIC(12,2)
);

-- ─────────────────────────────────────────────────────────────
-- 12. INVOICES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    po_id UUID NOT NULL REFERENCES purchase_orders(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    amount NUMERIC(15,2) NOT NULL,
    gst_amount NUMERIC(15,2) DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'sent', 'pending', 'paid', 'overdue')),
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    pdf_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 13. INVOICE ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity NUMERIC(12,2),
    unit TEXT,
    unit_price NUMERIC(12,2),
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    gst_amount NUMERIC(12,2),
    total_price NUMERIC(12,2)
);

-- ─────────────────────────────────────────────────────────────
-- 14. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    entity_type TEXT,
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 15. ACTIVITY LOGS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    entity_type TEXT,
    entity_id UUID,
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfqs_deadline ON rfqs(deadline);
CREATE INDEX IF NOT EXISTS idx_rfq_vendors_rfq ON rfq_vendors(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_vendors_vendor ON rfq_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_quotations_rfq ON quotations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotations_vendor ON quotations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_approvals_rfq ON approvals(rfq_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON approvals(approver_id, status);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_invoice_po ON invoices(po_id);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- SEED DATA — Demo admin user + sample vendors
-- Password for all demo users: "password123"
-- (bcrypt hash of 'password123' with cost 12)
-- ─────────────────────────────────────────────────────────────
INSERT INTO vendors (id, company_name, contact_person, email, phone, category, status, rating) VALUES
('a1b2c3d4-0001-0000-0000-000000000001', 'ABC Supplies Pvt Ltd', 'Rahul Mehta', 'rahul@abcsupplies.com', '+91-9876543210', 'Office Supplies', 'active', 4.5),
('a1b2c3d4-0002-0000-0000-000000000002', 'Tech Solutions Ltd', 'Priya Sharma', 'priya@horizonit.co', '+91-9876543211', 'IT Equipment', 'active', 4.2),
('a1b2c3d4-0003-0000-0000-000000000003', 'ServicePro India', 'Amit Kumar', 'amit@servicepro.in', '+91-9876543212', 'Maintenance', 'active', 3.8),
('a1b2c3d4-0004-0000-0000-000000000004', 'GlobalTech Supplies', 'Sneha Patel', 'sneha@globaltech.com', '+91-9876543213', 'Electronics', 'active', 4.7),
('a1b2c3d4-0005-0000-0000-000000000005', 'FastDeliver Co', 'Vikram Singh', 'vikram@fastdeliver.com', '+91-9876543214', 'Logistics', 'active', 3.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, is_active, vendor_id) VALUES
('b1b2c3d4-0001-0000-0000-000000000001', 'Admin User', 'admin@vendorbridge.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLgxMmTvqMhilym', 'admin', true, NULL),
('b1b2c3d4-0002-0000-0000-000000000002', 'Procurement Officer', 'proc@vendorbridge.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLgxMmTvqMhilym', 'procurement_officer', true, NULL),
('b1b2c3d4-0003-0000-0000-000000000003', 'Priya Sharma', 'priya@horizonit.co', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLgxMmTvqMhilym', 'vendor', true, 'a1b2c3d4-0002-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Sample RFQ
INSERT INTO rfqs (id, rfq_number, title, description, status, deadline, created_by) VALUES
('c1b2c3d4-0001-0000-0000-000000000001', 'RFQ-2024-0001', 'Office Supplies Q2 2024', 'Procurement of office stationery and supplies for Q2 2024', 'open', NOW() + INTERVAL '14 days', 'b1b2c3d4-0001-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rfq_items (rfq_id, item_name, quantity, unit) VALUES
('c1b2c3d4-0001-0000-0000-000000000001', 'A4 Paper (500 sheets/ream)', 100, 'reams'),
('c1b2c3d4-0001-0000-0000-000000000001', 'Black Ballpoint Pens', 200, 'units')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- UPDATED_AT triggers
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
