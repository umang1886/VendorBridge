// ─── VENDORS ────────────────────────────────────────────────────────────────
export const vendors = [
  { id: "v1", company_name: "TechParts India Pvt Ltd", contact_person: "Rajesh Kumar", email: "rajesh@techparts.in", phone: "+91-9876543210", city: "Mumbai", state: "Maharashtra", category: "Electronics", gst_number: "27AAPCT1234F1Z5", status: "active", rating: 4.5, rating_count: 23, pan_number: "AAPCT1234F", created_at: "2024-01-15" },
  { id: "v2", company_name: "Shri Ram Suppliers", contact_person: "Amit Sharma", email: "amit@srsuppliers.com", phone: "+91-9812345678", city: "Delhi", state: "Delhi", category: "Office Supplies", gst_number: "07AAFCS5678G1Z3", status: "active", rating: 3.8, rating_count: 15, pan_number: "AAFCS5678G", created_at: "2024-02-10" },
  { id: "v3", company_name: "Bharat Metals & Alloys", contact_person: "Suresh Patel", email: "suresh@bharatmetals.com", phone: "+91-9654321098", city: "Surat", state: "Gujarat", category: "Raw Materials", gst_number: "24AABCB9012H1Z7", status: "active", rating: 4.2, rating_count: 31, pan_number: "AABCB9012H", created_at: "2024-01-28" },
  { id: "v4", company_name: "Horizon IT Solutions", contact_person: "Priya Nair", email: "priya@horizonit.co", phone: "+91-9745612380", city: "Bangalore", state: "Karnataka", category: "IT Services", gst_number: "29AACHI3456I1Z2", status: "active", rating: 4.8, rating_count: 12, pan_number: "AACHI3456I", created_at: "2024-03-05" },
  { id: "v5", company_name: "Indo Packaging Co.", contact_person: "Vikram Singh", email: "vikram@indopack.in", phone: "+91-9123456789", city: "Pune", state: "Maharashtra", category: "Packaging", gst_number: "27AADCI7890J1Z1", status: "inactive", rating: 2.9, rating_count: 8, pan_number: "AADCI7890J", created_at: "2023-11-20" },
  { id: "v6", company_name: "CleanTech Services", contact_person: "Meera Reddy", email: "meera@cleantech.in", phone: "+91-9988776655", city: "Hyderabad", state: "Telangana", category: "Facility Management", gst_number: "36AABCC2345K1Z4", status: "active", rating: 4.0, rating_count: 19, pan_number: "AABCC2345K", created_at: "2024-02-25" },
  { id: "v7", company_name: "QuickLogistics Ltd", contact_person: "Arun Joshi", email: "arun@quicklog.com", phone: "+91-9876012345", city: "Chennai", state: "Tamil Nadu", category: "Logistics", gst_number: "33AAFCQ6789L1Z6", status: "blacklisted", rating: 1.5, rating_count: 5, pan_number: "AAFCQ6789L", created_at: "2023-09-10" },
]

// ─── RFQs ────────────────────────────────────────────────────────────────────
export const rfqs = [
  { id: "r1", rfq_number: "RFQ-2025-0001", title: "Office Printer Cartridges Q1", description: "Procurement of inkjet and laser printer cartridges for all office floors", status: "open", deadline: "2025-07-15", created_by: "u1", vendor_count: 3, quotation_count: 2, created_at: "2025-06-01" },
  { id: "r2", rfq_number: "RFQ-2025-0002", title: "Server Room UPS Systems", description: "5 KVA UPS systems with 2hr backup for server rooms. Include AMC for 3 years.", status: "closed", deadline: "2025-06-20", created_by: "u1", vendor_count: 4, quotation_count: 4, created_at: "2025-05-20" },
  { id: "r3", rfq_number: "RFQ-2025-0003", title: "Annual Cleaning Contract", description: "Housekeeping and facility maintenance contract for 2 office premises", status: "awarded", deadline: "2025-06-10", created_by: "u2", vendor_count: 3, quotation_count: 3, created_at: "2025-05-10" },
  { id: "r4", rfq_number: "RFQ-2025-0004", title: "Steel Rods — 500 MT", description: "Fe500 grade TMT steel rods for construction project phase 2", status: "draft", deadline: "2025-07-30", created_by: "u1", vendor_count: 0, quotation_count: 0, created_at: "2025-06-05" },
  { id: "r5", rfq_number: "RFQ-2025-0005", title: "IT Infrastructure Audit", description: "End-to-end IT infrastructure security audit and compliance report", status: "open", deadline: "2025-07-10", created_by: "u2", vendor_count: 2, quotation_count: 1, created_at: "2025-06-03" },
  { id: "r6", rfq_number: "RFQ-2025-0006", title: "Packaging Material — Annual", description: "Corrugated boxes, bubble wrap, tape — annual contract for warehouse ops", status: "cancelled", deadline: "2025-05-31", created_by: "u1", vendor_count: 2, quotation_count: 1, created_at: "2025-05-01" },
]

// ─── QUOTATIONS ──────────────────────────────────────────────────────────────
export const quotations = [
  { id: "q1", rfq_id: "r2", vendor_id: "v1", vendor_name: "TechParts India Pvt Ltd", status: "submitted", delivery_days: 14, subtotal: 285000, gst_amount: 51300, total_amount: 336300, vendor_rating: 4.5, risk_score: 88, ai_score: 87.5, submitted_at: "2025-06-18", notes: "Includes 1yr onsite warranty" },
  { id: "q2", rfq_id: "r2", vendor_id: "v4", vendor_name: "Horizon IT Solutions", status: "awarded", delivery_days: 10, subtotal: 310000, gst_amount: 55800, total_amount: 365800, vendor_rating: 4.8, risk_score: 95, ai_score: 91.2, submitted_at: "2025-06-19", notes: "3yr AMC included, 24x7 support" },
  { id: "q3", rfq_id: "r2", vendor_id: "v2", vendor_name: "Shri Ram Suppliers", status: "rejected", delivery_days: 21, subtotal: 265000, gst_amount: 47700, total_amount: 312700, vendor_rating: 3.8, risk_score: 60, ai_score: 68.4, submitted_at: "2025-06-17", notes: "" },
  { id: "q4", rfq_id: "r2", vendor_id: "v6", vendor_name: "CleanTech Services", status: "submitted", delivery_days: 18, subtotal: 295000, gst_amount: 53100, total_amount: 348100, vendor_rating: 4.0, risk_score: 72, ai_score: 75.1, submitted_at: "2025-06-19", notes: "Regional support only" },
]

// ─── AI ANALYSIS ─────────────────────────────────────────────────────────────
export const aiAnalysis = {
  rfq_id: "r2",
  confidence_score: 91.2,
  recommended_vendor: "v4",
  ai_summary: "Based on composite scoring across price, delivery, rating, and risk factors, Horizon IT Solutions emerges as the optimal vendor for this procurement. While their quoted price is 8.7% higher than the lowest bid, the 3-year AMC inclusion, fastest delivery at 10 days, and industry-leading vendor rating of 4.8 provide exceptional total cost of ownership. TechParts India presents a strong second option if budget is the primary constraint.",
  ranking: [
    { rank: 1, vendor_name: "Horizon IT Solutions", composite_score: 91.2, price_score: 82, delivery_score: 100, rating_score: 96, risk_score: 95, total_amount: 365800, delivery_days: 10 },
    { rank: 2, vendor_name: "TechParts India Pvt Ltd", composite_score: 87.5, price_score: 93, delivery_score: 71, rating_score: 90, risk_score: 88, total_amount: 336300, delivery_days: 14 },
    { rank: 3, vendor_name: "CleanTech Services", composite_score: 75.1, price_score: 90, delivery_score: 78, rating_score: 80, risk_score: 72, total_amount: 348100, delivery_days: 18 },
    { rank: 4, vendor_name: "Shri Ram Suppliers", composite_score: 68.4, price_score: 100, delivery_score: 48, rating_score: 76, risk_score: 60, total_amount: 312700, delivery_days: 21 },
  ]
}

// ─── APPROVALS ───────────────────────────────────────────────────────────────
export const approvals = [
  { id: "a1", rfq_id: "r3", rfq_title: "Annual Cleaning Contract", quotation_id: "q2", vendor_name: "CleanTech Services", amount: 520000, level: 1, approver: "Sanjeev Mehta", status: "approved", remarks: "Competitive price with good track record. Approved.", actioned_at: "2025-06-12T14:30:00", created_at: "2025-06-11T10:00:00" },
  { id: "a2", rfq_id: "r2", rfq_title: "Server Room UPS Systems", quotation_id: "q2", vendor_name: "Horizon IT Solutions", amount: 365800, level: 1, approver: "Sanjeev Mehta", status: "pending", remarks: null, actioned_at: null, created_at: "2025-06-20T09:00:00" },
  { id: "a3", rfq_id: "r1", rfq_title: "Office Printer Cartridges Q1", quotation_id: "q1", vendor_name: "TechParts India Pvt Ltd", amount: 45600, level: 1, approver: "Sanjeev Mehta", status: "pending", remarks: null, actioned_at: null, created_at: "2025-06-19T16:00:00" },
]

// ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────
export const purchaseOrders = [
  { id: "po1", po_number: "PO-2025-0001", rfq_id: "r3", vendor_id: "v6", vendor_name: "CleanTech Services", status: "acknowledged", delivery_date: "2025-07-01", subtotal: 440678, gst_amount: 79322, total_amount: 520000, created_at: "2025-06-13", items: [ { item_name: "Daily housekeeping - 2 premises", quantity: 12, unit: "months", unit_price: 25000, gst_rate: 18, gst_amount: 54000, total_price: 354000 }, { item_name: "Deep cleaning - quarterly", quantity: 4, unit: "sessions", unit_price: 18000, gst_rate: 18, gst_amount: 12960, total_price: 84960 }, { item_name: "Consumables supply", quantity: 12, unit: "months", unit_price: 5000, gst_rate: 18, gst_amount: 10800, total_price: 70800 }, ] },
  { id: "po2", po_number: "PO-2025-0002", rfq_id: "r2", vendor_id: "v4", vendor_name: "Horizon IT Solutions", status: "sent", delivery_date: "2025-07-10", subtotal: 310000, gst_amount: 55800, total_amount: 365800, created_at: "2025-06-21", items: [ { item_name: "5 KVA Online UPS", quantity: 3, unit: "units", unit_price: 85000, gst_rate: 18, gst_amount: 45900, total_price: 300900 }, { item_name: "Battery Bank Extension", quantity: 3, unit: "sets", unit_price: 8333, gst_rate: 18, gst_amount: 4500, total_price: 29499 }, ] },
]

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoices = [
  { id: "inv1", invoice_number: "INV-2025-0001", po_id: "po1", po_number: "PO-2025-0001", vendor_id: "v6", vendor_name: "CleanTech Services", status: "paid", invoice_date: "2025-06-13", due_date: "2025-07-13", subtotal: 440678, gst_amount: 79322, total_amount: 520000, sent_at: "2025-06-13T15:00:00", paid_at: "2025-07-05T11:00:00" },
  { id: "inv2", invoice_number: "INV-2025-0002", po_id: "po2", po_number: "PO-2025-0002", vendor_id: "v4", vendor_name: "Horizon IT Solutions", status: "sent", invoice_date: "2025-06-21", due_date: "2025-07-21", subtotal: 310000, gst_amount: 55800, total_amount: 365800, sent_at: "2025-06-21T16:30:00", paid_at: null },
  { id: "inv3", invoice_number: "INV-2025-0003", po_id: "po1", po_number: "PO-2024-0012", vendor_id: "v1", vendor_name: "TechParts India Pvt Ltd", status: "overdue", invoice_date: "2025-05-01", due_date: "2025-05-31", subtotal: 85000, gst_amount: 15300, total_amount: 100300, sent_at: "2025-05-01T10:00:00", paid_at: null },
]

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const notifications = [
  { id: "n1", type: "approval_requested", title: "Approval Required", message: "RFQ-2025-0002 (UPS Systems) requires your approval. Vendor: Horizon IT Solutions, Amount: ₹3,65,800", is_read: false, created_at: "2025-06-20T09:05:00" },
  { id: "n2", type: "quotation_received", title: "New Quotation Received", message: "Horizon IT Solutions submitted a quotation for RFQ-2025-0002 (Server Room UPS Systems)", is_read: false, created_at: "2025-06-19T14:30:00" },
  { id: "n3", type: "rfq_published", title: "RFQ Published", message: "RFQ-2025-0005 (IT Infrastructure Audit) has been published and vendors notified", is_read: true, created_at: "2025-06-03T11:00:00" },
  { id: "n4", type: "po_generated", title: "Purchase Order Generated", message: "PO-2025-0002 has been generated for Horizon IT Solutions", is_read: true, created_at: "2025-06-21T16:00:00" },
  { id: "n5", type: "invoice_sent", title: "Invoice Sent", message: "Invoice INV-2025-0002 has been emailed to Horizon IT Solutions", is_read: true, created_at: "2025-06-21T16:30:00" },
]

// ─── ACTIVITY LOGS ───────────────────────────────────────────────────────────
export const activityLogs = [
  { id: "al1", user: "Deepak Verma", role: "procurement_officer", action: "rfq_published", entity_type: "RFQ", entity_id: "r2", description: "Published RFQ-2025-0002 (Server Room UPS Systems) and notified 4 vendors", created_at: "2025-05-20T11:00:00" },
  { id: "al2", user: "Horizon IT Solutions", role: "vendor", action: "quotation_submitted", entity_type: "Quotation", entity_id: "q2", description: "Submitted quotation for RFQ-2025-0002. Total: ₹3,65,800", created_at: "2025-06-19T14:30:00" },
  { id: "al3", user: "Deepak Verma", role: "procurement_officer", action: "winner_selected", entity_type: "Quotation", entity_id: "q2", description: "Selected Horizon IT Solutions as winner for RFQ-2025-0002", created_at: "2025-06-20T08:45:00" },
  { id: "al4", user: "Sanjeev Mehta", role: "manager", action: "approval_approved", entity_type: "Approval", entity_id: "a1", description: "Approved procurement for Annual Cleaning Contract. Remarks: Competitive price.", created_at: "2025-06-12T14:30:00" },
  { id: "al5", user: "Deepak Verma", role: "procurement_officer", action: "po_generated", entity_type: "PO", entity_id: "po2", description: "Generated PO-2025-0002 for Horizon IT Solutions. Amount: ₹3,65,800", created_at: "2025-06-21T16:00:00" },
  { id: "al6", user: "Deepak Verma", role: "procurement_officer", action: "invoice_emailed", entity_type: "Invoice", entity_id: "inv2", description: "Emailed INV-2025-0002 to priya@horizonit.co", created_at: "2025-06-21T16:30:00" },
  { id: "al7", user: "Meera Reddy", role: "vendor", action: "po_acknowledged", entity_type: "PO", entity_id: "po1", description: "Vendor acknowledged PO-2025-0001", created_at: "2025-06-14T09:00:00" },
  { id: "al8", user: "Admin User", role: "admin", action: "vendor_created", entity_type: "Vendor", entity_id: "v4", description: "Created vendor profile for Horizon IT Solutions", created_at: "2025-03-05T10:00:00" },
]

// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = [
  { id: "u1", name: "Admin User", email: "admin@vendorbridge.in", role: "admin", is_active: true, last_login: "2025-06-21T09:00:00", created_at: "2024-01-01" },
  { id: "u2", name: "Deepak Verma", email: "deepak@vendorbridge.in", role: "procurement_officer", is_active: true, last_login: "2025-06-21T08:30:00", created_at: "2024-01-15" },
  { id: "u3", name: "Sanjeev Mehta", email: "sanjeev@vendorbridge.in", role: "manager", is_active: true, last_login: "2025-06-20T17:00:00", created_at: "2024-01-15" },
  { id: "u4", name: "Priya Nair", email: "priya@horizonit.co", role: "vendor", is_active: true, last_login: "2025-06-19T14:00:00", created_at: "2024-03-05" },
]

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export const dashboardStats = {
  active_rfqs: 2,
  pending_approvals: 2,
  pos_this_month: 2,
  invoices_sent: 3,
  total_spend_ytd: 986100,
  vendors_active: 5,
}

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const procurementTrendData = [
  { month: "Jan", rfqs: 3, value: 420000 },
  { month: "Feb", rfqs: 5, value: 680000 },
  { month: "Mar", rfqs: 4, value: 510000 },
  { month: "Apr", rfqs: 7, value: 1240000 },
  { month: "May", rfqs: 6, value: 890000 },
  { month: "Jun", rfqs: 6, value: 986100 },
]

export const spendingByCategoryData = [
  { name: "IT Services", value: 365800, fill: "#2563EB" },
  { name: "Facility Mgmt", value: 520000, fill: "#16A34A" },
  { name: "Electronics", value: 100300, fill: "#D97706" },
  { name: "Office Supplies", value: 45600, fill: "#7C3AED" },
  { name: "Raw Materials", value: 0, fill: "#0891B2" },
]

export const vendorPerformanceData = [
  { vendor: "Horizon IT", rating: 4.8, on_time: 100, win_rate: 67, rfqs: 3 },
  { vendor: "TechParts", rating: 4.5, on_time: 88, win_rate: 40, rfqs: 10 },
  { vendor: "Bharat Metals", rating: 4.2, on_time: 85, win_rate: 55, rfqs: 7 },
  { vendor: "CleanTech", rating: 4.0, on_time: 78, win_rate: 50, rfqs: 6 },
  { vendor: "SRS", rating: 3.8, on_time: 70, win_rate: 30, rfqs: 5 },
]

// ─── VENDOR PORTAL ───────────────────────────────────────────────────────────
export const vendorDashboardStats = {
  assigned_rfqs: 2,
  submitted_quotations: 1,
  active_pos: 1,
  unread_notifications: 2,
}
