# Solution.md — VendorBridge: Procurement & Vendor Management ERP
**Team:** Antigravity  
**Version:** 1.0.0  
**Track:** ERP / Enterprise SaaS / Procurement Automation

---

## Table of Contents

1. [Solution Overview](#solution-overview)
2. [Technology Stack Decisions](#technology-stack-decisions)
3. [System Architecture](#system-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Design](#database-design)
7. [Authentication & Security](#authentication--security)
8. [AI Quotation Engine](#ai-quotation-engine)
9. [Automation Layer (n8n)](#automation-layer-n8n)
10. [Email System (Resend)](#email-system-resend)
11. [PDF Generation (ReportLab)](#pdf-generation-reportlab)
12. [File Storage (Supabase)](#file-storage-supabase)
13. [n8n Workflow JSON](#n8n-workflow-json)
14. [Deployment Architecture](#deployment-architecture)
15. [Key Technical Decisions](#key-technical-decisions)
16. [Performance Strategy](#performance-strategy)
17. [Security Architecture](#security-architecture)

---

## 1. Solution Overview

VendorBridge solves procurement fragmentation through a two-panel ERP system:

1. **Admin/Procurement Panel** — For internal users (Admin, Procurement Officer, Manager) to manage vendors, create RFQs, compare quotations with AI assistance, run approval workflows, and generate POs and invoices.

2. **Vendor Portal** — For external vendors to view assigned RFQs, submit quotations, track their PO status, and receive invoices.

The two panels share a single Flask REST API backend with role-based authorization, a single Supabase PostgreSQL database, and a Supabase Storage bucket for all file assets. Automation is handled entirely by n8n workflows triggered via webhooks.

### What makes VendorBridge different

| Feature | Typical ERP | VendorBridge |
|---------|-------------|--------------|
| Vendor communication | Manual email | Automated n8n + Resend |
| Quotation comparison | Spreadsheet | AI-powered scoring engine |
| PO generation | Manual entry | One-click from approved quotation |
| Invoice delivery | Print/manual email | Auto PDF + one-click email |
| Audit trail | None | Immutable activity log on every action |
| Setup time | Months | Hours (Vercel + Railway + Supabase) |

---

## 2. Technology Stack Decisions

### Frontend: React + Tailwind CSS + Shadcn UI

**Why React**: Component reusability across admin panel and vendor portal, React Query for intelligent server state caching, React Router for SPA navigation with role-based guards.

**Why Tailwind + Shadcn**: Shadcn provides unstyled, accessible components (dialogs, tables, sheets, dropdowns) that we style with Tailwind — resulting in a consistent, professional design system with zero design debt. Shadcn components are copy-paste, so no npm dependency risk.

**Why React Query**: Automatic caching, background refetching, loading/error states, and optimistic updates — critical for a real-time procurement dashboard.

### Backend: Flask Python

**Why Flask**: Lightweight, highly composable, and excellent for REST API construction. Flask Blueprints provide clean module separation (auth, vendors, rfqs, etc.). Flask-JWT-Extended for token management. SQLAlchemy ORM for database abstraction over Supabase PostgreSQL.

### Database: Supabase PostgreSQL

**Why Supabase**: Managed PostgreSQL with instant REST API, real-time subscriptions (future), row-level security (RLS) policies, and integrated storage. Single platform for DB + storage simplifies deployment significantly. Free tier is sufficient for hackathon, scales to production.

### Automation: n8n

**Why n8n**: Self-hostable workflow automation with visual editor. Supports webhook triggers, HTTP requests, conditional logic, and Resend/Supabase integrations natively. Three pre-built workflows handle: RFQ email distribution, AI comparison trigger, and invoice automation.

### Email: Resend API

**Why Resend**: Developer-first transactional email with React Email template support. 100 emails/day free tier. Simple REST API. Reliable delivery with SPF/DKIM handled automatically.

### PDF: ReportLab

**Why ReportLab**: Industry-standard Python PDF library. Generates professional invoices and POs with custom headers, tables, GST breakdowns, and company branding. Output stored in Supabase Storage and served via signed URLs.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel CDN)                        │
│                                                                     │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │     Admin / Procurement      │  │      Vendor Portal       │    │
│  │  /dashboard                  │  │  /vendor/dashboard       │    │
│  │  /vendors                    │  │  /vendor/rfqs            │    │
│  │  /rfqs                       │  │  /vendor/quotations      │    │
│  │  /quotations                 │  │  /vendor/purchase-orders │    │
│  │  /approvals                  │  │  /vendor/invoices        │    │
│  │  /purchase-orders            │  │  /vendor/notifications   │    │
│  │  /invoices                   │  └──────────────────────────┘    │
│  │  /reports                    │                                   │
│  │  /activity-logs              │                                   │
│  │  /users (admin only)         │                                   │
│  └──────────────────────────────┘                                   │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ JWT Bearer Token + HTTPS
┌──────────────────────▼──────────────────────────────────────────────┐
│                     BACKEND API (Railway)                           │
│                       Flask + Gunicorn                              │
│                                                                     │
│  Blueprints:                                                        │
│  /api/auth          /api/vendors        /api/rfqs                   │
│  /api/quotations    /api/approvals      /api/purchase-orders        │
│  /api/invoices      /api/dashboard      /api/analytics              │
│  /api/notifications /api/activity-logs  /api/users                  │
│  /api/webhooks (n8n triggers)                                       │
└──────────┬──────────────────────────┬────────────────────────────── ┘
           │                          │
┌──────────▼────────────┐  ┌──────────▼──────────────────────────────┐
│  Supabase PostgreSQL  │  │           Supabase Storage              │
│                       │  │                                         │
│  15 core tables       │  │  Buckets:                               │
│  RLS policies         │  │  - rfq-attachments/                     │
│  Indexes on FKs       │  │  - quotation-pdfs/                      │
│                       │  │  - invoice-pdfs/                        │
│                       │  │  - po-pdfs/                             │
└──────────┬────────────┘  └──────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                     n8n Automation (Railway)                        │
│                                                                     │
│  Workflow 1: RFQ Email Automation                                   │
│  ├── Webhook: POST /webhook/rfq-published                           │
│  ├── Supabase: Fetch vendor emails                                  │
│  ├── Resend: Send emails to all vendors                             │
│  ├── Supabase: Create notifications                                 │
│  └── Supabase: Insert activity log                                  │
│                                                                     │
│  Workflow 2: AI Quotation Comparison                                │
│  ├── Webhook: POST /webhook/trigger-ai-analysis                     │
│  ├── Supabase: Fetch all quotations                                 │
│  ├── HTTP: Send to Claude/OpenAI API                                │
│  ├── Supabase: Save ai_analysis record                              │
│  └── Supabase: Create procurement officer notification              │
│                                                                     │
│  Workflow 3: Invoice Automation                                     │
│  ├── Webhook: POST /webhook/po-approved                             │
│  ├── HTTP: Flask /api/invoices (generate record + PDF)              │
│  ├── Supabase Storage: Upload PDF                                   │
│  ├── Resend: Email invoice to vendor                                │
│  └── Supabase: Update invoice status + log                          │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│               External Services                                     │
│   Resend API (email)  │  Claude API (AI)  │  OpenAI API (fallback)  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture

### Project Structure
```
frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── api/                      # React Query hooks + Axios instances
│   │   ├── auth.js
│   │   ├── vendors.js
│   │   ├── rfqs.js
│   │   ├── quotations.js
│   │   ├── approvals.js
│   │   ├── purchaseOrders.js
│   │   ├── invoices.js
│   │   ├── dashboard.js
│   │   ├── analytics.js
│   │   └── notifications.js
│   ├── components/
│   │   ├── ui/                   # Shadcn components (button, table, modal, etc.)
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx   # Sidebar + topbar for admin panel
│   │   │   ├── VendorLayout.jsx  # Sidebar for vendor portal
│   │   │   └── AuthLayout.jsx    # Centered card for login/signup
│   │   ├── shared/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── KPICard.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── vendors/
│   │   │   ├── VendorTable.jsx
│   │   │   ├── VendorForm.jsx
│   │   │   └── VendorRating.jsx
│   │   ├── rfqs/
│   │   │   ├── RFQForm.jsx
│   │   │   ├── RFQTable.jsx
│   │   │   └── RFQStatusFlow.jsx
│   │   ├── quotations/
│   │   │   ├── ComparisonTable.jsx
│   │   │   ├── AIAnalysisCard.jsx
│   │   │   └── QuotationForm.jsx
│   │   ├── approvals/
│   │   │   ├── ApprovalCard.jsx
│   │   │   └── ApprovalTimeline.jsx
│   │   ├── purchase-orders/
│   │   │   └── PODetail.jsx
│   │   ├── invoices/
│   │   │   └── InvoiceDetail.jsx
│   │   └── charts/
│   │       ├── ProcurementTrendChart.jsx
│   │       ├── VendorPerformanceChart.jsx
│   │       └── SpendingDonutChart.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Vendors.jsx
│   │   │   ├── VendorDetail.jsx
│   │   │   ├── RFQs.jsx
│   │   │   ├── RFQCreate.jsx
│   │   │   ├── RFQDetail.jsx
│   │   │   ├── QuotationComparison.jsx
│   │   │   ├── Approvals.jsx
│   │   │   ├── PurchaseOrders.jsx
│   │   │   ├── PODetail.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── InvoiceDetail.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── ActivityLogs.jsx
│   │   │   └── UserManagement.jsx
│   │   └── vendor/
│   │       ├── VendorDashboard.jsx
│   │       ├── VendorRFQs.jsx
│   │       ├── VendorRFQDetail.jsx
│   │       ├── VendorQuotationSubmit.jsx
│   │       ├── VendorPurchaseOrders.jsx
│   │       ├── VendorInvoices.jsx
│   │       └── VendorNotifications.jsx
│   ├── store/
│   │   └── authStore.js           # Zustand for auth state
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useNotifications.js
│   │   └── usePermissions.js
│   ├── utils/
│   │   ├── axiosInstance.js       # Axios with JWT interceptors
│   │   ├── formatters.js          # Currency, date, number formatters
│   │   └── constants.js
│   ├── routes/
│   │   ├── AdminRoutes.jsx        # Protected admin routes
│   │   └── VendorRoutes.jsx       # Protected vendor routes
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### Key Frontend Patterns

#### JWT Axios Interceptor
```javascript
// utils/axiosInstance.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      // Attempt refresh, then redirect to login
      const refreshed = await refreshToken();
      if (!refreshed) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

#### Role-Based Route Guard
```javascript
// routes/AdminRoutes.jsx
const AdminRoutes = ({ allowedRoles }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return <Outlet />;
};
```

#### React Query Usage
```javascript
// api/rfqs.js
export const useRFQs = (filters) => useQuery({
  queryKey: ['rfqs', filters],
  queryFn: () => api.get('/rfqs', { params: filters }).then(r => r.data),
  staleTime: 30000,
});

export const useCreateRFQ = () => useMutation({
  mutationFn: (data) => api.post('/rfqs', data),
  onSuccess: () => queryClient.invalidateQueries(['rfqs']),
});
```

---

## 5. Backend Architecture

### Project Structure
```
backend/
├── app/
│   ├── __init__.py               # Flask app factory
│   ├── config.py                 # Environment config
│   ├── extensions.py             # SQLAlchemy, JWT, CORS, etc.
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vendor.py
│   │   ├── rfq.py
│   │   ├── quotation.py
│   │   ├── approval.py
│   │   ├── purchase_order.py
│   │   ├── invoice.py
│   │   ├── notification.py
│   │   ├── activity_log.py
│   │   └── ai_analysis.py
│   ├── blueprints/
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── vendors/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── rfqs/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── quotations/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── approvals/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── purchase_orders/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── invoices/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── dashboard/
│   │   │   └── routes.py
│   │   ├── analytics/
│   │   │   └── routes.py
│   │   ├── notifications/
│   │   │   └── routes.py
│   │   ├── activity_logs/
│   │   │   └── routes.py
│   │   ├── users/
│   │   │   └── routes.py
│   │   └── webhooks/
│   │       └── routes.py
│   ├── services/
│   │   ├── email_service.py      # Resend API wrapper
│   │   ├── pdf_service.py        # ReportLab PDF generator
│   │   ├── storage_service.py    # Supabase Storage upload
│   │   ├── n8n_service.py        # n8n webhook triggers
│   │   ├── ai_service.py         # AI API calls
│   │   └── notification_service.py
│   ├── utils/
│   │   ├── auth_utils.py         # role_required decorator
│   │   ├── validators.py
│   │   ├── sequence.py           # PO/Invoice number generation
│   │   └── activity_logger.py   # Log utility
│   └── schemas/
│       ├── vendor_schema.py      # Marshmallow schemas
│       ├── rfq_schema.py
│       └── ...
├── migrations/
│   └── versions/
├── tests/
│   ├── test_auth.py
│   ├── test_vendors.py
│   ├── test_rfqs.py
│   └── ...
├── requirements.txt
├── run.py
└── Procfile
```

### Flask App Factory
```python
# app/__init__.py
from flask import Flask
from app.extensions import db, jwt, cors, migrate
from app.blueprints.auth import auth_bp
from app.blueprints.vendors import vendors_bp
# ... other blueprint imports

def create_app(config_name='production'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vendors_bp, url_prefix='/api/vendors')
    app.register_blueprint(rfqs_bp, url_prefix='/api/rfqs')
    app.register_blueprint(quotations_bp, url_prefix='/api/quotations')
    app.register_blueprint(approvals_bp, url_prefix='/api/approvals')
    app.register_blueprint(pos_bp, url_prefix='/api/purchase-orders')
    app.register_blueprint(invoices_bp, url_prefix='/api/invoices')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(activity_logs_bp, url_prefix='/api/activity-logs')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(webhooks_bp, url_prefix='/api/webhooks')
    
    return app
```

### Role Decorator
```python
# utils/auth_utils.py
from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify

def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if identity['role'] not in roles:
                return jsonify({'error': 'Unauthorized'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Usage:
# @role_required('admin', 'procurement_officer')
# def create_rfq(): ...
```

### Auto PO/Invoice Number
```python
# utils/sequence.py
from datetime import datetime
from app.models import PurchaseOrder, Invoice

def generate_po_number():
    year = datetime.now().year
    last = PurchaseOrder.query.filter(
        PurchaseOrder.po_number.like(f'PO-{year}-%')
    ).order_by(PurchaseOrder.created_at.desc()).first()
    seq = int(last.po_number.split('-')[-1]) + 1 if last else 1
    return f"PO-{year}-{str(seq).zfill(4)}"

def generate_invoice_number():
    year = datetime.now().year
    last = Invoice.query.filter(
        Invoice.invoice_number.like(f'INV-{year}-%')
    ).order_by(Invoice.created_at.desc()).first()
    seq = int(last.invoice_number.split('-')[-1]) + 1 if last else 1
    return f"INV-{year}-{str(seq).zfill(4)}"
```

---

## 6. Database Design

### Entity Relationship Summary

```
users ──────────────────── vendors (1 user can be linked to 1 vendor)
  │
  ├── rfqs (created_by FK)
  │     ├── rfq_items (cascade)
  │     ├── rfq_attachments (cascade)
  │     ├── rfq_vendors ──── vendors
  │     ├── quotations ────── vendors
  │     │     └── quotation_items
  │     ├── approvals ──────── users (approver_id)
  │     └── ai_analysis
  │
  └── purchase_orders ──── quotations, vendors
        ├── po_items
        └── invoices ──── vendors
              └── invoice_items

notifications ──────────── users
activity_logs ──────────── users
vendor_ratings ─────────── vendors, users, purchase_orders
```

### Critical Indexes
```sql
-- Performance indexes
CREATE INDEX idx_rfq_status ON rfqs(status);
CREATE INDEX idx_rfq_deadline ON rfqs(deadline);
CREATE INDEX idx_rfq_vendors_rfq ON rfq_vendors(rfq_id);
CREATE INDEX idx_rfq_vendors_vendor ON rfq_vendors(vendor_id);
CREATE INDEX idx_quotations_rfq ON quotations(rfq_id);
CREATE INDEX idx_quotations_vendor ON quotations(vendor_id);
CREATE INDEX idx_approvals_rfq ON approvals(rfq_id);
CREATE INDEX idx_approvals_approver ON approvals(approver_id, status);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_invoice_po ON invoices(po_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
```

---

## 7. Authentication & Security

### JWT Flow
```
1. POST /api/auth/login { email, password }
2. Server validates, returns { access_token (15min), refresh_token (7d) }
3. Client stores access_token in memory, refresh_token in httpOnly cookie
4. Every API request: Authorization: Bearer <access_token>
5. On 401: POST /api/auth/refresh → new access_token
6. On refresh fail: redirect to /login
```

### Password Security
- bcrypt with cost factor 12
- Minimum 8 characters enforced at API level
- Password reset tokens: UUID v4, expire in 1 hour, single-use

### API Security
- CORS restricted to known frontend origins
- All inputs validated with Marshmallow schemas
- SQL injection prevention via SQLAlchemy ORM (parameterized queries)
- File upload validation: type whitelist (PDF, PNG, JPG, DOCX), size limit 10MB
- Rate limiting: 100 req/min on auth endpoints (Flask-Limiter)

### Supabase Row Level Security
```sql
-- Vendors can only see their own data
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY vendor_quotations ON quotations
  FOR ALL TO authenticated
  USING (vendor_id = (SELECT vendor_id FROM users WHERE id = auth.uid()));
```

---

## 8. AI Quotation Engine

### Architecture
The AI engine runs as a service within Flask, callable from the quotation comparison endpoint or triggered by n8n when the RFQ deadline expires.

### Scoring Algorithm
```python
# services/ai_service.py

def calculate_composite_score(quotation, all_quotations):
    """
    Weights: Price 40%, Delivery 25%, Rating 20%, Risk 15%
    Each factor normalized to 0-100 scale
    """
    prices = [q['total_amount'] for q in all_quotations]
    deliveries = [q['delivery_days'] for q in all_quotations]
    
    # Price score: lower is better
    min_price = min(prices)
    price_score = (min_price / quotation['total_amount']) * 100
    
    # Delivery score: faster is better
    min_delivery = min(deliveries)
    delivery_score = (min_delivery / quotation['delivery_days']) * 100
    
    # Rating score: direct
    rating_score = (quotation['vendor_rating'] / 5) * 100
    
    # Risk score: based on vendor history
    risk_score = calculate_risk_score(quotation['vendor_id'])
    
    composite = (
        price_score * 0.40 +
        delivery_score * 0.25 +
        rating_score * 0.20 +
        risk_score * 0.15
    )
    return round(composite, 2)

def generate_ai_summary(rfq, ranked_quotations):
    """Send to Claude API for natural language recommendation"""
    prompt = f"""
    You are a procurement analyst. Analyze these vendor quotations for RFQ: {rfq['title']}
    
    Quotations (ranked by composite score):
    {json.dumps(ranked_quotations, indent=2)}
    
    Generate a concise procurement recommendation (2-3 sentences) explaining:
    1. Who the best vendor is and why
    2. Key trade-offs between top 2 vendors
    3. Any risk factors to consider
    
    Be direct, professional, and data-driven.
    """
    
    response = anthropic.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

### Risk Score Calculation
```python
def calculate_risk_score(vendor_id):
    """
    Risk factors (higher score = lower risk):
    - Past on-time delivery rate (50%)
    - Average vendor rating (30%)
    - Blacklist flags (20%)
    """
    vendor = Vendor.query.get(vendor_id)
    fulfilled_pos = PurchaseOrder.query.filter_by(
        vendor_id=vendor_id, status='fulfilled'
    ).count()
    total_pos = PurchaseOrder.query.filter_by(vendor_id=vendor_id).count()
    
    on_time_rate = (fulfilled_pos / total_pos * 100) if total_pos > 0 else 50
    rating_score = (vendor.rating / 5) * 100
    blacklist_penalty = 0 if vendor.status != 'blacklisted' else -100
    
    risk_score = (on_time_rate * 0.50 + rating_score * 0.30 + 20 + blacklist_penalty)
    return max(0, min(100, risk_score))
```

---

## 9. Automation Layer (n8n)

n8n runs as a separate service on Railway. Flask triggers n8n via webhook HTTP calls. n8n has direct Supabase access via HTTP node + Supabase credentials.

### Webhook Endpoints (Flask → n8n)
```
POST https://n8n.railway.app/webhook/rfq-published
POST https://n8n.railway.app/webhook/trigger-ai-analysis  
POST https://n8n.railway.app/webhook/po-approved
```

### Payload Schemas
```json
// Workflow 1 trigger
{ "rfq_id": "uuid", "rfq_title": "string", "deadline": "ISO8601", "vendor_ids": ["uuid"] }

// Workflow 2 trigger
{ "rfq_id": "uuid", "trigger_reason": "all_submitted | deadline_expired" }

// Workflow 3 trigger
{ "po_id": "uuid", "vendor_email": "string", "po_number": "string" }
```

---

## 10. Email System (Resend)

```python
# services/email_service.py
import resend
from app.config import Config

resend.api_key = Config.RESEND_API_KEY

def send_rfq_invitation(vendor_email, vendor_name, rfq_title, deadline, login_url):
    return resend.Emails.send({
        "from": "VendorBridge <procurement@yourdomain.com>",
        "to": vendor_email,
        "subject": f"[VendorBridge] New RFQ: {rfq_title}",
        "html": rfq_email_template(vendor_name, rfq_title, deadline, login_url)
    })

def send_invoice_email(vendor_email, invoice_number, pdf_url, due_date):
    return resend.Emails.send({
        "from": "VendorBridge <invoices@yourdomain.com>",
        "to": vendor_email,
        "subject": f"Invoice {invoice_number} from VendorBridge",
        "html": invoice_email_template(invoice_number, due_date),
        "attachments": [{"filename": f"{invoice_number}.pdf", "path": pdf_url}]
    })
```

---

## 11. PDF Generation (ReportLab)

```python
# services/pdf_service.py
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import io

def generate_invoice_pdf(invoice):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Header
    elements.append(Paragraph("INVOICE", styles['Title']))
    elements.append(Paragraph(f"Invoice #: {invoice['invoice_number']}", styles['Normal']))
    elements.append(Paragraph(f"Date: {invoice['invoice_date']}", styles['Normal']))
    elements.append(Paragraph(f"Due: {invoice['due_date']}", styles['Normal']))
    
    # Vendor details
    elements.append(Paragraph(f"Vendor: {invoice['vendor_name']}", styles['Normal']))
    
    # Line items table
    data = [['Item', 'Qty', 'Unit', 'Unit Price', 'GST%', 'GST Amt', 'Total']]
    for item in invoice['items']:
        data.append([
            item['item_name'], item['quantity'], item['unit'],
            f"₹{item['unit_price']:,.2f}", f"{item['gst_rate']}%",
            f"₹{item['gst_amount']:,.2f}", f"₹{item['total_price']:,.2f}"
        ])
    
    # Totals row
    data.append(['', '', '', '', 'Subtotal', '', f"₹{invoice['subtotal']:,.2f}"])
    data.append(['', '', '', '', 'GST Total', '', f"₹{invoice['gst_amount']:,.2f}"])
    data.append(['', '', '', '', 'TOTAL', '', f"₹{invoice['total_amount']:,.2f}"])
    
    table = Table(data, colWidths=[150, 40, 40, 70, 40, 70, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563EB')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -4), [colors.white, colors.HexColor('#F8FAFC')]),
        ('FONTNAME', (0, -3), (-1, -1), 'Helvetica-Bold'),
    ]))
    elements.append(table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
```

---

## 12. File Storage (Supabase)

```python
# services/storage_service.py
from supabase import create_client
from app.config import Config

supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)

def upload_file(bucket: str, path: str, file_bytes: bytes, content_type: str) -> str:
    """Upload file and return public/signed URL"""
    supabase.storage.from_(bucket).upload(path, file_bytes, {
        "content-type": content_type
    })
    return supabase.storage.from_(bucket).create_signed_url(path, 86400 * 365)['signedURL']

def upload_invoice_pdf(invoice_number: str, pdf_bytes: bytes) -> str:
    path = f"invoices/{invoice_number}.pdf"
    return upload_file('invoice-pdfs', path, pdf_bytes, 'application/pdf')

def upload_rfq_attachment(rfq_id: str, filename: str, file_bytes: bytes) -> str:
    path = f"{rfq_id}/{filename}"
    return upload_file('rfq-attachments', path, file_bytes, 'application/octet-stream')
```

---

## 13. n8n Workflow JSON

### Prompt to generate in n8n:

> **n8n Workflow 1: RFQ Email Automation**
>
> Create an importable n8n workflow JSON with these exact nodes:
> 1. **Webhook** node: POST `/webhook/rfq-published`, receives `{rfq_id, rfq_title, deadline, vendor_ids[]}`
> 2. **Supabase (HTTP Request)** node: GET vendors by IDs — `SELECT id, email, company_name FROM vendors WHERE id = ANY({{ $json.vendor_ids }})`
> 3. **Split In Batches** node: iterate over each vendor
> 4. **Resend (HTTP Request)** node: POST `https://api.resend.com/emails` with Authorization Bearer, body: from, to (vendor email), subject `[VendorBridge] New RFQ: {{ rfq_title }}`, html template with vendor name, RFQ title, deadline, login link
> 5. **Supabase Insert (HTTP Request)** node: INSERT into notifications table for each vendor
> 6. **Supabase Insert (HTTP Request)** node: INSERT into activity_logs table
> 7. **Respond to Webhook** node: return `{success: true, sent_count: N}`

---

> **n8n Workflow 2: AI Quotation Comparison**
>
> Create an importable n8n workflow JSON with these exact nodes:
> 1. **Webhook** node: POST `/webhook/trigger-ai-analysis`, receives `{rfq_id, trigger_reason}`
> 2. **Supabase HTTP Request** node: fetch all quotations + items for rfq_id with vendor details JOIN
> 3. **Supabase HTTP Request** node: fetch RFQ title and items
> 4. **Code** node: aggregate quotations into scoring payload, calculate price/delivery/rating scores
> 5. **HTTP Request** node: POST to Anthropic Claude API (`https://api.anthropic.com/v1/messages`), model `claude-3-haiku-20240307`, prompt includes aggregated quotation data, returns AI summary + ranking JSON
> 6. **Code** node: parse AI response, build ai_analysis record
> 7. **Supabase HTTP Request** node: INSERT into ai_analysis table
> 8. **Supabase HTTP Request** node: INSERT notification for procurement officer
> 9. **Supabase HTTP Request** node: INSERT activity_log
> 10. **Respond to Webhook** node: return `{success: true, analysis_id: uuid}`

---

> **n8n Workflow 3: Invoice Automation**
>
> Create an importable n8n workflow JSON with these exact nodes:
> 1. **Webhook** node: POST `/webhook/po-approved`, receives `{po_id}`
> 2. **HTTP Request** node: POST to Flask `/api/invoices` with `{po_id}` to generate invoice record and PDF
> 3. Parse response to get `invoice_id`, `invoice_number`, `pdf_url`, `vendor_email`, `total_amount`, `due_date`
> 4. **Resend HTTP Request** node: send invoice email to vendor with subject `Invoice {{ invoice_number }} from VendorBridge`, include pdf_url as attachment link
> 5. **Supabase HTTP Request** node: UPDATE invoices SET status='sent', sent_at=NOW() WHERE id=invoice_id
> 6. **Supabase HTTP Request** node: INSERT activity_log for invoice sent action
> 7. **Supabase HTTP Request** node: INSERT notification for vendor user linked to vendor_id
> 8. **Respond to Webhook** node: return `{success: true, invoice_number}`

---

## 14. Deployment Architecture

### Environment Variables

**Frontend (.env)**
```
VITE_API_URL=https://vendorbridge-api.railway.app
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
```

**Backend (.env)**
```
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx
JWT_SECRET_KEY=your-256-bit-secret
RESEND_API_KEY=re_xxxx
ANTHROPIC_API_KEY=sk-ant-xxxx
N8N_WEBHOOK_BASE_URL=https://n8n.railway.app
FLASK_ENV=production
```

### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Railway Configuration (Procfile)
```
web: gunicorn "app:create_app()" --workers 2 --bind 0.0.0.0:$PORT --timeout 120
```

### Deployment Steps
```
1. Push frontend to GitHub → connect to Vercel → auto-deploy
2. Push backend to GitHub → connect to Railway → auto-deploy
3. Deploy n8n on Railway (n8n Docker image) → configure credentials
4. Supabase project → run schema migrations → enable RLS
5. Configure Resend domain → add DNS records
6. Set all environment variables in each platform
7. Import n8n workflow JSONs → activate workflows
8. Smoke test all endpoints
```

---

## 15. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Zustand + React Query | Zustand for auth/UI state, React Query for server state — no Redux boilerplate |
| ORM | SQLAlchemy | Best-in-class Python ORM, works with Supabase PG |
| PDF | ReportLab | Pure Python, no external dependencies, professional output |
| AI model | Claude Haiku | Fast, cheap, sufficient for procurement analysis |
| Sequence numbers | Application-level | Avoids DB sequences, works across migrations |
| File URLs | Supabase signed URLs | Secure, expiry-based access, no public bucket exposure |
| n8n hosting | Railway | Same infrastructure as backend, simplifies networking |

---

## 16. Performance Strategy

- **React Query caching**: 30s stale time on list queries, instant cache invalidation on mutations
- **Pagination**: All list endpoints paginated (20 per page default)
- **Database indexes**: All foreign keys indexed, status columns indexed
- **Lazy loading**: Routes lazy-loaded with React.lazy() + Suspense
- **Image optimization**: Supabase Storage CDN for file delivery
- **Connection pooling**: PgBouncer via Supabase (built-in)
- **Gunicorn workers**: 2 workers on Railway (adjustable by memory tier)

---

## 17. Security Architecture

```
Internet → Vercel (HTTPS, CDN, DDoS protection)
        → Railway (HTTPS, private networking)
        → Supabase (SSL connections, RLS policies)

Data at rest: Supabase encryption at rest (AES-256)
Data in transit: TLS 1.3 everywhere
Secrets: Railway env vars (encrypted at rest)
Files: Supabase signed URLs (time-limited, not public)
Auth: JWT HS256, short expiry (15 min access token)
Passwords: bcrypt cost 12
CORS: Allowlist of known frontend origins only
```

---

*Solution Architecture by Team Antigravity — VendorBridge v1.0.0*