import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Vendors ────────────────────────────────────────────────
export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createVendor(vendor: {
  company_name: string; contact_person?: string; email: string;
  phone?: string; category?: string; gst_number?: string; address?: string;
}) {
  const { data, error } = await supabase.from('vendors').insert(vendor).select().single();
  if (error) throw error;
  return data;
}

export async function updateVendor(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase.from('vendors').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ─── RFQs ───────────────────────────────────────────────────
export async function getRFQs() {
  const { data, error } = await supabase
    .from('rfqs')
    .select(`*, rfq_items(*), rfq_vendors(vendor_id, vendors(company_name))`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRFQById(id: string) {
  const { data, error } = await supabase
    .from('rfqs')
    .select(`*, rfq_items(*), rfq_vendors(vendor_id, vendors(company_name, email, rating)), quotations(*, vendors(company_name, rating))`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Lighter version for the Vendor portal — avoids heavy joins that can fail
export async function getRFQForVendor(rfqId: string) {
  const { data: rfqData, error: rfqError } = await supabase
    .from('rfqs')
    .select(`*, rfq_items(*)`)
    .eq('id', rfqId)
    .maybeSingle();
  if (rfqError) throw rfqError;
  if (!rfqData) return null;

  // Separately fetch quotations for this RFQ to avoid join errors on empty tables
  const { data: quotations } = await supabase
    .from('quotations')
    .select('vendor_id, status')
    .eq('rfq_id', rfqId);

  return { ...rfqData, quotations: quotations || [] };
}

export async function createRFQ(rfq: {
  title: string; description?: string; deadline: string;
  items: { item_name: string; quantity: number; unit: string }[];
  vendor_ids: string[];
}) {
  // Generate RFQ number
  const { count } = await supabase.from('rfqs').select('*', { count: 'exact', head: true });
  const year = new Date().getFullYear();
  const rfq_number = `RFQ-${year}-${String((count || 0) + 1).padStart(4, '0')}`;

  // Insert RFQ
  const { data: newRFQ, error: rfqError } = await supabase
    .from('rfqs')
    .insert({ title: rfq.title, description: rfq.description, deadline: rfq.deadline, rfq_number, status: 'draft' })
    .select()
    .single();
  if (rfqError) throw rfqError;

  // Insert items
  if (rfq.items.length > 0) {
    const { error: itemsError } = await supabase.from('rfq_items').insert(
      rfq.items.map(item => ({ ...item, rfq_id: newRFQ.id }))
    );
    if (itemsError) throw itemsError;
  }

  // Assign vendors
  if (rfq.vendor_ids.length > 0) {
    const { error: vendorError } = await supabase.from('rfq_vendors').insert(
      rfq.vendor_ids.map(vendor_id => ({ rfq_id: newRFQ.id, vendor_id }))
    );
    if (vendorError) throw vendorError;
  }

  return newRFQ;
}

export async function updateRFQStatus(id: string, status: string) {
  const { data, error } = await supabase.from('rfqs').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ─── Quotations ─────────────────────────────────────────────
export async function getAllQuotations() {
  const { data, error } = await supabase
    .from('quotations')
    .select(`*, vendors(company_name, rating, email), rfqs(rfq_number, title)`)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getQuotationsByRFQ(rfqId: string) {
  const { data, error } = await supabase
    .from('quotations')
    .select(`*, vendors(company_name, rating, email), quotation_items(*)`)
    .eq('rfq_id', rfqId)
    .order('total_amount', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getVendorRFQs(vendorId: string) {
  const { data, error } = await supabase
    .from('rfq_vendors')
    .select(`rfq_id, rfqs(*)`)
    .eq('vendor_id', vendorId)
    .order('invited_at', { ascending: false });
  if (error) throw error;
  // Filter out any null rfqs (deleted or missing)
  return (data || []).map(d => d.rfqs).filter(Boolean);
}

export async function submitQuotation(quotation: {
  rfq_id: string; vendor_id: string; total_amount: number; delivery_days: number; 
  payment_terms?: string; notes?: string; items?: any[];
}) {
  // Check if quotation already exists
  const { data: existing } = await supabase.from('quotations').select('id').eq('rfq_id', quotation.rfq_id).eq('vendor_id', quotation.vendor_id).maybeSingle();
  if (existing) throw new Error("Quotation already submitted for this RFQ.");

  const { data: newQuote, error } = await supabase.from('quotations').insert({
    rfq_id: quotation.rfq_id,
    vendor_id: quotation.vendor_id,
    total_amount: quotation.total_amount,
    delivery_days: quotation.delivery_days,
    payment_terms: quotation.payment_terms,
    notes: quotation.notes,
    status: 'submitted'
  }).select().single();
  if (error) throw error;

  if (quotation.items && quotation.items.length > 0) {
    const { error: itemsError } = await supabase.from('quotation_items').insert(
      quotation.items.map(item => ({ ...item, quotation_id: newQuote.id }))
    );
    if (itemsError) throw itemsError;
  }
  return newQuote;
}

export async function getAIAnalysisByRFQ(rfqId: string) {
  const { data, error } = await supabase
    .from('ai_analysis')
    .select(`*, vendors(company_name)`)
    .eq('rfq_id', rfqId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Purchase Orders ─────────────────────────────────────────
export async function createPurchaseOrder(po: {
  rfq_id: string; vendor_id: string; total_amount: number;
}) {
  const { count } = await supabase.from('purchase_orders').select('*', { count: 'exact', head: true });
  const year = new Date().getFullYear();
  const po_number = `PO-${year}-${String((count || 0) + 1).padStart(4, '0')}`;

  const { data, error } = await supabase.from('purchase_orders').insert({
    rfq_id: po.rfq_id,
    vendor_id: po.vendor_id,
    po_number,
    total_amount: po.total_amount,
    status: 'approved'
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`*, vendors(company_name, email), rfqs(rfq_number, title)`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Invoices ────────────────────────────────────────────────
export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select(`*, vendors(company_name, email), purchase_orders(po_number)`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Approvals ───────────────────────────────────────────────
export async function getApprovals() {
  const { data, error } = await supabase
    .from('approvals')
    .select(`*, rfqs(rfq_number, title), quotations(total_amount, vendors(company_name))`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Dashboard Stats ─────────────────────────────────────────
export async function getDashboardStats() {
  const [rfqsRes, vendorsRes, posRes, invoicesRes] = await Promise.all([
    supabase.from('rfqs').select('status'),
    supabase.from('vendors').select('status'),
    supabase.from('purchase_orders').select('total_amount, status'),
    supabase.from('invoices').select('total_amount, status'),
  ]);

  const rfqs = rfqsRes.data || [];
  const vendors = vendorsRes.data || [];
  const pos = posRes.data || [];
  const invoices = invoicesRes.data || [];

  return {
    total_rfqs: rfqs.length,
    open_rfqs: rfqs.filter(r => r.status === 'open').length,
    active_vendors: vendors.filter(v => v.status === 'active').length,
    total_pos: pos.length,
    total_spend: pos.reduce((s, p) => s + Number(p.total_amount || 0), 0),
    pending_invoices: invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length,
    pending_amount: invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + Number(i.total_amount || 0), 0),
  };
}

// ─── Activity Logs ───────────────────────────────────────────
export async function getActivityLogs() {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data;
}

export async function logActivity(entry: {
  entity_type: string; entity_id?: string; action: string; description: string; metadata?: Record<string, unknown>;
}) {
  await supabase.from('activity_logs').insert(entry);
}
