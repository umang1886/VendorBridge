# PRD.md — VendorBridge: Procurement & Vendor Management ERP
**Team:** Antigravity  
**Version:** 1.0.0  
**Date:** 2025  
**Status:** Production-Ready Hackathon Submission

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Vision & Goals](#vision--goals)
4. [User Personas & Roles](#user-personas--roles)
5. [Core Functional Requirements](#core-functional-requirements)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [System Architecture Overview](#system-architecture-overview)
8. [Feature Specifications](#feature-specifications)
9. [User Stories](#user-stories)
10. [Database Schema](#database-schema)
11. [API Contract](#api-contract)
12. [UI/UX Requirements](#uiux-requirements)
13. [Email Automation](#email-automation)
14. [AI Engine Requirements](#ai-engine-requirements)
15. [n8n Workflow Specifications](#n8n-workflow-specifications)
16. [Acceptance Criteria](#acceptance-criteria)
17. [Out of Scope](#out-of-scope)

---

## 1. Executive Summary

VendorBridge is a full-stack, cloud-native Procurement & Vendor Management ERP that digitizes and streamlines end-to-end procurement operations for organizations. It replaces fragmented email-based procurement with a structured, role-driven platform supporting vendor onboarding, RFQ lifecycle management, AI-powered quotation comparison, multi-level approval workflows, automated purchase order generation, and invoice management.

Built for the hackathon track, VendorBridge demonstrates enterprise-grade architecture using React, Flask, Supabase PostgreSQL, n8n automation, and an embedded AI comparison engine — all deployable on Vercel + Railway + Supabase.

---

## 2. Problem Statement

Organizations managing procurement manually face:

- **Vendor chaos**: Vendor contacts, GST details, and ratings scattered across spreadsheets and emails
- **RFQ inefficiency**: Manual email-based RFQ distribution with no tracking or audit trail
- **Quotation confusion**: No structured way to compare vendor quotations side-by-side
- **Approval bottlenecks**: Procurement approvals rely on verbal sign-offs with no formal records
- **PO/Invoice delays**: Purchase orders and invoices are manually typed, prone to errors, and difficult to track
- **Zero analytics**: No visibility into procurement trends, vendor performance, or spending patterns

VendorBridge solves all of the above in a single unified platform.

---

## 3. Vision & Goals

### Vision
"The single source of truth for every procurement decision your organization makes."

### Primary Goals
| Goal | Metric |
|------|--------|
| Reduce RFQ cycle time | From days to hours |
| Eliminate manual PO/Invoice creation | 100% automated generation |
| Provide AI-driven vendor selection | Recommendation engine on every RFQ |
| Full audit trail | Every action logged with user, timestamp, context |
| Role-based access | Zero unauthorized procurement actions |

---

## 4. User Personas & Roles

### Role 1: Admin
- **Who**: IT or Operations head
- **Goals**: Manage users, oversee all procurement, configure system
- **Permissions**: Full access to all modules including user management and analytics

### Role 2: Procurement Officer
- **Who**: Sourcing/buying team member
- **Goals**: Create RFQs, evaluate quotations, generate POs and invoices
- **Permissions**: Vendor management, RFQ creation, quotation comparison, PO/invoice generation

### Role 3: Manager / Approver
- **Who**: Department head or finance controller
- **Goals**: Approve or reject procurement requests above threshold
- **Permissions**: View and action approval requests; read-only on other modules

### Role 4: Vendor
- **Who**: External supplier/service provider
- **Goals**: Submit competitive quotations, track PO status, receive invoices
- **Permissions**: Vendor portal only — assigned RFQs, own quotations, own POs, own invoices

---

## 5. Core Functional Requirements

### FR-01: Authentication & Authorization
- Email + password login for all roles
- JWT-based session management (access + refresh tokens)
- Role-based route guards on both frontend and backend
- Vendor self-registration with admin approval
- Forgot password / reset via email

### FR-02: Vendor Management
- Full CRUD for vendor profiles
- Vendor fields: company name, contact person, email, phone, address, GST number, category, status, rating
- Vendor categories with multi-category support
- Vendor status: Active / Inactive / Blacklisted
- Vendor search, filter by category/status/rating
- Vendor rating system (1–5 stars, updated after each procurement cycle)

### FR-03: RFQ Management
- Create RFQ with title, description, product/service details, quantity, unit, attachments, deadline
- Assign one or multiple vendors to an RFQ
- RFQ statuses: Draft → Open → Closed → Awarded
- View all RFQs with status badges, filter, and search
- Attachments stored in Supabase Storage
- Auto-trigger email notification on RFQ publish

### FR-04: Quotation Management (Vendor Portal)
- Vendors see only their assigned RFQs
- Submit quotation with per-item pricing, delivery timeline, notes, optional PDF upload
- Edit quotation before RFQ deadline
- View submission status

### FR-05: Quotation Comparison (Admin Panel)
- Side-by-side comparison table for all quotations on an RFQ
- Columns: Vendor name, unit price, total price, delivery days, vendor rating, GST amount, risk score
- Lowest price highlighted
- AI-generated ranking and recommendation visible inline
- One-click select winner

### FR-06: AI Quotation Comparison Engine
- Triggered when all quotations received OR deadline expires
- Factors: total price (40%), delivery timeline (25%), vendor rating (20%), risk score (15%)
- Output: ranked vendor list, best vendor recommendation, natural language AI summary
- Results stored in `ai_analysis` table
- Results visible in comparison screen with confidence percentage

### FR-07: Approval Workflow
- Multi-level approval support (configurable up to 3 levels)
- Approvers notified via in-app notification + email
- Actions: Approve / Reject with mandatory remarks
- Full approval audit trail with timestamps, user, role, and remarks
- Status transitions: Pending → Approved / Rejected

### FR-08: Purchase Orders
- Auto-generate PO number (format: PO-YYYY-XXXX)
- PO created from approved quotation: auto-populate vendor, items, quantities, pricing, GST, totals
- PO statuses: Draft → Sent → Acknowledged → Fulfilled
- PDF export of PO

### FR-09: Invoice Management
- Auto-generate invoice from PO on approval
- Invoice number format: INV-YYYY-XXXX
- Invoice fields: invoice date, due date, line items, subtotal, GST breakdown, total
- PDF generation via ReportLab
- Email invoice to vendor via Resend API
- Print invoice from browser
- Invoice statuses: Generated → Sent → Paid

### FR-10: Dashboard & Analytics
- Admin/Procurement Officer dashboard: Active RFQs, Pending Approvals, Recent Quotations, POs issued, Invoices sent
- Analytics: procurement trend charts, vendor performance charts, spending by category, monthly summaries
- Vendor dashboard: assigned RFQs, submitted quotations, PO status, notifications

### FR-11: Activity Logs
- Every significant action logged: user, role, action type, entity affected, timestamp
- Searchable and filterable log table
- Exportable as CSV

### FR-12: Notifications
- In-app notifications for all roles
- Types: RFQ assigned, quotation received, approval requested, PO generated, invoice sent
- Mark as read / mark all as read
- Notification badge on navbar

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Dashboard loads in < 2s; API responses < 500ms p95 |
| Security | JWT auth, bcrypt password hashing, HTTPS only, input sanitization |
| Scalability | Supabase PostgreSQL handles 10,000+ vendors, 100,000+ RFQ records |
| Reliability | 99.9% uptime on Vercel + Railway + Supabase |
| Accessibility | WCAG 2.1 AA compliant UI |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Mobile | Responsive layout for tablet and mobile |
| File Storage | Supabase Storage with signed URLs for attachments and generated PDFs |
| Audit | Immutable activity log; no records can be deleted by any role |

---

## 7. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│   ┌──────────────────────────┐  ┌──────────────────────────┐   │
│   │    Admin / Procurement   │  │      Vendor Portal       │   │
│   │    Panel (React + TW)    │  │    (React + Tailwind)    │   │
│   └──────────────┬───────────┘  └────────────┬─────────────┘   │
└──────────────────┼──────────────────────────┼──────────────────┘
                   │ HTTPS / REST API          │
┌──────────────────▼──────────────────────────▼──────────────────┐
│                        API LAYER (Flask)                        │
│                                                                 │
│   Auth │ Vendors │ RFQs │ Quotations │ Approvals │ PO │ Invoice │
│   Dashboard │ Analytics │ Notifications │ Activity Logs        │
└──────────────────┬──────────────────────────┬──────────────────┘
                   │                          │
       ┌───────────▼──────────┐   ┌───────────▼──────────────┐
       │  Supabase PostgreSQL │   │    Supabase Storage      │
       │  (Primary Database)  │   │  (Files, PDFs, Images)   │
       └───────────┬──────────┘   └──────────────────────────┘
                   │
       ┌───────────▼──────────────────────────────────────────┐
       │                 n8n Automation Layer                  │
       │  Workflow 1: RFQ Email   │  Workflow 2: AI Comparison │
       │  Workflow 3: Invoice     │                            │
       └───────────┬──────────────────────────────────────────┘
                   │
       ┌───────────▼──────────┐   ┌───────────────────────────┐
       │    Resend API        │   │   Claude / OpenAI API     │
       │  (Transactional      │   │   (AI Quotation Engine)   │
       │   Email)             │   │                           │
       └──────────────────────┘   └───────────────────────────┘
```

---

## 8. Feature Specifications

### 8.1 Admin Panel — Screens

#### Screen 1: Login / Signup
- Fields: Email, Password
- Signup: Name, Email, Password, Role (Admin creates others; vendors self-register)
- Forgot Password: sends reset link via Resend
- Redirects to role-specific dashboard on success

#### Screen 2: Dashboard
- KPI cards: Active RFQs | Pending Approvals | POs This Month | Invoices Sent
- Chart: Procurement Trend (last 6 months, bar chart)
- Chart: Vendor Performance (radar or bar)
- Table: Recent RFQs (title, status, deadline, vendor count)
- Table: Recent Invoices (invoice no, vendor, amount, status)
- Quick actions: + New RFQ | + Add Vendor

#### Screen 3: Vendor Management
- Table with columns: Vendor Name, Category, GST, Rating, Status, Actions
- Add Vendor modal/form
- Edit Vendor slide-over
- Delete with confirmation
- Filter: Category, Status, Rating range
- Search: name or GST number

#### Screen 4: RFQ Management
- List view: RFQ No, Title, Deadline, Vendors assigned, Status, Quotations received
- Create RFQ form: Title, Description, Items (name, qty, unit), Attachments, Deadline, Vendor multi-select
- RFQ detail page: shows all quotations, comparison table, AI analysis
- Status badges with color coding

#### Screen 5: Quotation Comparison
- Table: Vendor | Unit Price | Total | Delivery Days | Rating | GST | Risk Score | Recommend
- Lowest price cell highlighted in green
- AI Summary panel below table
- "Select Winner" button per row
- Download comparison as PDF

#### Screen 6: Approval Workflow
- Pending approvals list for logged-in approver
- Detail view: RFQ summary, selected vendor, quotation breakdown
- Actions: Approve (with remarks) | Reject (with remarks required)
- Approval history timeline

#### Screen 7: Purchase Orders
- PO list with PO No, Vendor, Amount, Status, Date
- PO detail: all line items, GST breakdown, totals, vendor details
- Download PO as PDF
- Change status (Sent / Acknowledged / Fulfilled)

#### Screen 8: Invoice Management
- Invoice list with Invoice No, PO No, Vendor, Amount, Status
- Invoice detail with full line items
- Download PDF | Print | Email Invoice buttons
- Status update

#### Screen 9: Reports & Analytics
- Procurement Trends: line chart (monthly volume and value)
- Vendor Performance: table with rating, on-time %, win rate
- Spending by Category: pie/donut chart
- Export: CSV download for all report tables

#### Screen 10: Activity Logs
- Timeline view of all system actions
- Columns: Timestamp, User, Role, Action, Entity, Details
- Filter by date range, user, action type
- Export CSV

#### Screen 11: User Management (Admin only)
- User table: Name, Email, Role, Status, Last Login
- Create User | Edit Role | Deactivate User
- Role assignment: Admin, Procurement Officer, Manager

---

### 8.2 Vendor Portal — Screens

#### Screen 1: Register / Login
- Self-registration form: Company Name, Contact Name, Email, Password, Phone, GST
- Login with email + password
- Forgot password

#### Screen 2: Vendor Dashboard
- Summary cards: Assigned RFQs | Submitted Quotations | Active POs | Unread Notifications
- Recent RFQs list
- Recent quotation submissions

#### Screen 3: RFQ List & Detail
- List of RFQs assigned to this vendor
- Status: Open (can submit) | Closed (deadline passed) | Awarded (winner selected)
- RFQ detail: title, description, items, deadline, attachments (downloadable)

#### Screen 4: Quotation Submission
- Form per RFQ: per-item unit price, delivery days, notes
- Upload optional PDF quotation (Supabase Storage)
- Edit available until deadline
- Submission confirmation with timestamp

#### Screen 5: Purchase Orders
- List of POs awarded to this vendor
- PO detail view (read-only)

#### Screen 6: Invoices
- List of invoices sent to this vendor
- Download PDF

#### Screen 7: Notifications
- In-app notification center
- Types: New RFQ assigned, Quotation deadline reminder, PO generated, Invoice sent

---

## 9. User Stories

### Procurement Officer
- As a Procurement Officer, I want to create an RFQ and assign it to multiple vendors so that I can receive competitive quotations.
- As a Procurement Officer, I want to see an AI-powered comparison of all quotations so that I can make the best vendor selection decision quickly.
- As a Procurement Officer, I want to generate a Purchase Order with one click after approval so that I don't have to manually type PO details.
- As a Procurement Officer, I want to email the invoice directly from the platform so that I don't need to switch to a separate email client.

### Manager / Approver
- As a Manager, I want to receive a notification when a procurement requires my approval so that I can act promptly.
- As a Manager, I want to reject a procurement request with remarks so that the Procurement Officer knows what to fix.
- As a Manager, I want to view the full approval history so that I have a record for compliance audits.

### Vendor
- As a Vendor, I want to see all RFQs assigned to me so that I don't miss any procurement opportunity.
- As a Vendor, I want to edit my quotation before the deadline so that I can correct errors.
- As a Vendor, I want to receive a notification when I am awarded a PO so that I can begin fulfillment.

### Admin
- As an Admin, I want to create user accounts and assign roles so that team members have appropriate access.
- As an Admin, I want to view procurement analytics so that I can identify spending trends and optimize the vendor pool.
- As an Admin, I want to view the complete activity log so that I can investigate any procurement discrepancy.

---

## 10. Database Schema

### Table: users
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('admin','procurement_officer','manager','vendor')),
  vendor_id     UUID REFERENCES vendors(id) ON DELETE SET NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: vendors
```sql
CREATE TABLE vendors (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name   VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email          VARCHAR(255) UNIQUE NOT NULL,
  phone          VARCHAR(50),
  address        TEXT,
  city           VARCHAR(100),
  state          VARCHAR(100),
  country        VARCHAR(100) DEFAULT 'India',
  pincode        VARCHAR(20),
  gst_number     VARCHAR(50),
  pan_number     VARCHAR(50),
  category       VARCHAR(100),
  status         VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active','inactive','blacklisted')),
  rating         DECIMAL(3,2) DEFAULT 0.00,
  rating_count   INTEGER DEFAULT 0,
  bank_name      VARCHAR(255),
  bank_account   VARCHAR(100),
  bank_ifsc      VARCHAR(50),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: rfqs
```sql
CREATE TABLE rfqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number     VARCHAR(50) UNIQUE NOT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  status         VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','open','closed','awarded','cancelled')),
  deadline       TIMESTAMPTZ NOT NULL,
  created_by     UUID REFERENCES users(id),
  approved_by    UUID REFERENCES users(id),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: rfq_items
```sql
CREATE TABLE rfq_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id      UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  item_name   VARCHAR(255) NOT NULL,
  description TEXT,
  quantity    DECIMAL(12,2) NOT NULL,
  unit        VARCHAR(50),
  sort_order  INTEGER DEFAULT 0
);
```

### Table: rfq_vendors
```sql
CREATE TABLE rfq_vendors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id     UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id  UUID REFERENCES vendors(id) ON DELETE CASCADE,
  status     VARCHAR(50) DEFAULT 'invited' CHECK (status IN ('invited','viewed','submitted','declined')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rfq_id, vendor_id)
);
```

### Table: rfq_attachments
```sql
CREATE TABLE rfq_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id      UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  file_name   VARCHAR(255),
  file_url    TEXT NOT NULL,
  file_size   INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: quotations
```sql
CREATE TABLE quotations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id           UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id        UUID REFERENCES vendors(id),
  status           VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft','submitted','shortlisted','rejected','awarded')),
  delivery_days    INTEGER,
  payment_terms    VARCHAR(255),
  validity_days    INTEGER DEFAULT 30,
  notes            TEXT,
  pdf_url          TEXT,
  subtotal         DECIMAL(15,2) DEFAULT 0,
  gst_amount       DECIMAL(15,2) DEFAULT 0,
  total_amount     DECIMAL(15,2) DEFAULT 0,
  submitted_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: quotation_items
```sql
CREATE TABLE quotation_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id    UUID REFERENCES quotations(id) ON DELETE CASCADE,
  rfq_item_id     UUID REFERENCES rfq_items(id),
  item_name       VARCHAR(255) NOT NULL,
  quantity        DECIMAL(12,2),
  unit_price      DECIMAL(15,2) NOT NULL,
  gst_rate        DECIMAL(5,2) DEFAULT 18.00,
  gst_amount      DECIMAL(15,2),
  total_price     DECIMAL(15,2)
);
```

### Table: approvals
```sql
CREATE TABLE approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id        UUID REFERENCES rfqs(id),
  quotation_id  UUID REFERENCES quotations(id),
  level         INTEGER DEFAULT 1,
  approver_id   UUID REFERENCES users(id),
  status        VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','escalated')),
  remarks       TEXT,
  actioned_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: purchase_orders
```sql
CREATE TABLE purchase_orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number      VARCHAR(50) UNIQUE NOT NULL,
  rfq_id         UUID REFERENCES rfqs(id),
  quotation_id   UUID REFERENCES quotations(id),
  vendor_id      UUID REFERENCES vendors(id),
  status         VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','sent','acknowledged','fulfilled','cancelled')),
  delivery_date  DATE,
  payment_terms  VARCHAR(255),
  shipping_addr  TEXT,
  subtotal       DECIMAL(15,2),
  gst_amount     DECIMAL(15,2),
  total_amount   DECIMAL(15,2),
  notes          TEXT,
  created_by     UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: po_items
```sql
CREATE TABLE po_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id        UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_name    VARCHAR(255) NOT NULL,
  quantity     DECIMAL(12,2),
  unit         VARCHAR(50),
  unit_price   DECIMAL(15,2),
  gst_rate     DECIMAL(5,2),
  gst_amount   DECIMAL(15,2),
  total_price  DECIMAL(15,2)
);
```

### Table: invoices
```sql
CREATE TABLE invoices (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  po_id          UUID REFERENCES purchase_orders(id),
  vendor_id      UUID REFERENCES vendors(id),
  status         VARCHAR(50) DEFAULT 'generated' CHECK (status IN ('generated','sent','paid','overdue','cancelled')),
  invoice_date   DATE DEFAULT CURRENT_DATE,
  due_date       DATE,
  subtotal       DECIMAL(15,2),
  gst_amount     DECIMAL(15,2),
  total_amount   DECIMAL(15,2),
  pdf_url        TEXT,
  sent_at        TIMESTAMPTZ,
  paid_at        TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: invoice_items
```sql
CREATE TABLE invoice_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   UUID REFERENCES invoices(id) ON DELETE CASCADE,
  item_name    VARCHAR(255) NOT NULL,
  quantity     DECIMAL(12,2),
  unit         VARCHAR(50),
  unit_price   DECIMAL(15,2),
  gst_rate     DECIMAL(5,2),
  gst_amount   DECIMAL(15,2),
  total_price  DECIMAL(15,2)
);
```

### Table: notifications
```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(100) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     TEXT,
  entity_type VARCHAR(50),
  entity_id   UUID,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: activity_logs
```sql
CREATE TABLE activity_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  user_role    VARCHAR(50),
  action       VARCHAR(100) NOT NULL,
  entity_type  VARCHAR(50),
  entity_id    UUID,
  description  TEXT,
  ip_address   INET,
  metadata     JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: vendor_ratings
```sql
CREATE TABLE vendor_ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id    UUID REFERENCES vendors(id),
  rated_by     UUID REFERENCES users(id),
  po_id        UUID REFERENCES purchase_orders(id),
  score        INTEGER CHECK (score BETWEEN 1 AND 5),
  delivery     INTEGER CHECK (delivery BETWEEN 1 AND 5),
  quality      INTEGER CHECK (quality BETWEEN 1 AND 5),
  communication INTEGER CHECK (communication BETWEEN 1 AND 5),
  remarks      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: ai_analysis
```sql
CREATE TABLE ai_analysis (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id            UUID REFERENCES rfqs(id),
  status            VARCHAR(50) DEFAULT 'pending',
  analysis_data     JSONB,
  recommended_vendor UUID REFERENCES vendors(id),
  confidence_score  DECIMAL(5,2),
  ai_summary        TEXT,
  ranking_table     JSONB,
  triggered_by      VARCHAR(50),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 11. API Contract

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Vendor self-registration |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |

### Vendor APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendors` | List vendors (filterable) |
| POST | `/api/vendors` | Create vendor |
| GET | `/api/vendors/:id` | Get vendor detail |
| PUT | `/api/vendors/:id` | Update vendor |
| DELETE | `/api/vendors/:id` | Soft delete vendor |
| GET | `/api/vendors/:id/rfqs` | Vendor's RFQ history |
| GET | `/api/vendors/:id/ratings` | Vendor ratings |
| POST | `/api/vendors/:id/rate` | Submit rating |

### RFQ APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rfqs` | List RFQs (role-filtered) |
| POST | `/api/rfqs` | Create RFQ |
| GET | `/api/rfqs/:id` | RFQ detail |
| PUT | `/api/rfqs/:id` | Update RFQ |
| DELETE | `/api/rfqs/:id` | Cancel RFQ |
| POST | `/api/rfqs/:id/publish` | Publish and notify vendors |
| GET | `/api/rfqs/:id/quotations` | All quotations for RFQ |
| GET | `/api/rfqs/:id/comparison` | Comparison + AI analysis |
| POST | `/api/rfqs/:id/attachments` | Upload attachment |

### Quotation APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotations` | List quotations |
| POST | `/api/quotations` | Submit quotation (vendor) |
| GET | `/api/quotations/:id` | Quotation detail |
| PUT | `/api/quotations/:id` | Update quotation (before deadline) |
| POST | `/api/quotations/:id/select` | Select winning quotation |
| GET | `/api/quotations/:id/download` | Download PDF |

### Approval APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvals` | Pending approvals for user |
| GET | `/api/approvals/:id` | Approval detail |
| POST | `/api/approvals/:id/approve` | Approve with remarks |
| POST | `/api/approvals/:id/reject` | Reject with remarks |
| GET | `/api/approvals/history` | Full approval history |

### Purchase Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase-orders` | List POs |
| POST | `/api/purchase-orders` | Generate PO from approved quotation |
| GET | `/api/purchase-orders/:id` | PO detail |
| PUT | `/api/purchase-orders/:id/status` | Update PO status |
| GET | `/api/purchase-orders/:id/pdf` | Download PO as PDF |

### Invoice APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List invoices |
| POST | `/api/invoices` | Generate invoice from PO |
| GET | `/api/invoices/:id` | Invoice detail |
| GET | `/api/invoices/:id/pdf` | Download PDF |
| POST | `/api/invoices/:id/email` | Email invoice to vendor |
| PUT | `/api/invoices/:id/status` | Mark paid / overdue |

### Dashboard & Analytics APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | KPI cards data |
| GET | `/api/analytics/procurement-trends` | Monthly trend data |
| GET | `/api/analytics/vendor-performance` | Vendor scorecards |
| GET | `/api/analytics/spending` | Spending breakdown |
| GET | `/api/analytics/export` | Export report as CSV |

### Notification APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | User's notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| GET | `/api/notifications/unread-count` | Badge count |

### Activity Log APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity-logs` | All logs (admin) |
| GET | `/api/activity-logs/export` | Export as CSV |

---

## 12. UI/UX Requirements

- **Design System**: Shadcn UI components with Tailwind CSS utility classes
- **Color Palette**: Primary blue (#2563EB), Success green (#16A34A), Warning amber (#D97706), Danger red (#DC2626), Neutral gray scale
- **Typography**: Inter font family, consistent heading hierarchy
- **Layout**: Fixed sidebar navigation (admin panel), responsive vendor portal
- **Status Badges**: Color-coded consistently across all tables
- **Loading States**: Skeleton loaders for all data tables and cards
- **Empty States**: Meaningful empty state illustrations with CTA buttons
- **Forms**: Inline validation, error messages below each field
- **Tables**: Sortable columns, pagination (20 per page), row hover states
- **Modals**: Confirm dialogs for all destructive actions
- **Toasts**: React Hot Toast for success/error feedback
- **Icons**: Lucide React icon set

---

## 13. Email Automation

### Email 1: RFQ Invitation (to Vendor)
**Trigger**: RFQ published  
**Subject**: `[VendorBridge] New RFQ: {rfq_title} — Deadline {deadline}`  
**Content**: Company name, RFQ title, item summary, deadline, portal login link, "Submit Quotation" CTA button

### Email 2: Approval Request (to Manager)
**Trigger**: Procurement Officer selects winner  
**Subject**: `[VendorBridge] Approval Required: {rfq_title}`  
**Content**: RFQ summary, selected vendor, quotation value, approve/reject links

### Email 3: Invoice Email (to Vendor)
**Trigger**: Invoice generated  
**Subject**: `[VendorBridge] Invoice {invoice_number} from {company_name}`  
**Content**: Invoice summary, PDF attachment, payment due date

### Email 4: PO Award (to Vendor)
**Trigger**: PO generated after approval  
**Subject**: `[VendorBridge] Purchase Order {po_number} — You've been awarded!`  
**Content**: PO summary, delivery instructions, vendor portal link

---

## 14. AI Engine Requirements

### Input Data
```json
{
  "rfq_id": "uuid",
  "rfq_title": "string",
  "rfq_items": [...],
  "quotations": [
    {
      "vendor_id": "uuid",
      "vendor_name": "string",
      "vendor_rating": 4.2,
      "total_amount": 125000,
      "gst_amount": 19067,
      "delivery_days": 7,
      "payment_terms": "30 days",
      "items": [...]
    }
  ]
}
```

### Scoring Model
| Factor | Weight | Calculation |
|--------|--------|-------------|
| Total Price | 40% | Normalized: lowest = 100%, others proportional |
| Delivery Timeline | 25% | Normalized: fastest = 100% |
| Vendor Rating | 20% | Direct: rating/5 × 100 |
| Risk Score | 15% | Inverse of calculated risk (on-time history, blacklist flags) |

### Output Format
```json
{
  "recommended_vendor_id": "uuid",
  "confidence_score": 87.5,
  "ai_summary": "string (natural language explanation)",
  "ranking": [
    {
      "rank": 1,
      "vendor_id": "uuid",
      "vendor_name": "string",
      "composite_score": 87.5,
      "price_score": 92,
      "delivery_score": 85,
      "rating_score": 84,
      "risk_score": 90,
      "total_amount": 125000,
      "delivery_days": 7
    }
  ]
}
```

---

## 15. n8n Workflow Specifications

### Workflow 1: RFQ Email Automation
**Trigger**: Webhook POST from Flask on `/api/rfqs/:id/publish`  
**Steps**:
1. Receive webhook payload (rfq_id, vendor_ids, rfq_title, deadline)
2. For each vendor: fetch vendor email from Supabase
3. Generate personalized email body with RFQ details
4. Send email via Resend API
5. Create notification record in Supabase for each vendor
6. Insert activity log entry
7. Return success/failure counts to Flask

### Workflow 2: AI Quotation Comparison
**Trigger**: Webhook POST when all quotations submitted OR deadline cron  
**Steps**:
1. Receive rfq_id
2. Fetch all quotations + quotation_items from Supabase
3. Fetch vendor details (rating, history)
4. Build aggregated payload
5. Send to Claude/OpenAI API with scoring prompt
6. Parse AI response
7. Save to ai_analysis table in Supabase
8. Create notification for Procurement Officer
9. Insert activity log

### Workflow 3: Invoice Automation
**Trigger**: Webhook POST on PO approval  
**Steps**:
1. Receive po_id
2. Fetch PO + line items + vendor details
3. Call Flask `/api/invoices` to generate invoice record
4. Generate PDF via ReportLab (Flask endpoint)
5. Upload PDF to Supabase Storage
6. Update invoice record with pdf_url
7. Send invoice email to vendor via Resend
8. Update invoice status to 'sent'
9. Insert activity log

---

## 16. Acceptance Criteria

### AC-01: Vendor Creation
- GIVEN a Procurement Officer is logged in  
- WHEN they fill in all required vendor fields and submit  
- THEN a vendor record is created, appears in vendor list, and an activity log entry is recorded

### AC-02: RFQ Publish & Email
- GIVEN an RFQ is created with 3 vendors assigned  
- WHEN Procurement Officer clicks "Publish RFQ"  
- THEN all 3 vendors receive an email within 60 seconds and RFQ status changes to "Open"

### AC-03: Quotation Submission
- GIVEN a vendor is logged in and sees an open RFQ  
- WHEN they submit a quotation with all required fields  
- THEN quotation is saved, Procurement Officer receives in-app notification, and vendor sees "Submitted" status

### AC-04: AI Comparison
- GIVEN 2+ quotations exist on an RFQ  
- WHEN AI analysis is triggered  
- THEN a ranked comparison table, AI summary, and best vendor recommendation appear on the comparison screen within 30 seconds

### AC-05: Approval Workflow
- GIVEN a winning quotation is selected  
- WHEN Procurement Officer submits for approval  
- THEN Manager receives a notification, views the request, and Approve/Reject actions update all related records with audit trail

### AC-06: PO Generation
- GIVEN an approval is approved  
- WHEN PO is generated  
- THEN PO has auto-incremented PO number, all line items from quotation, correct GST calculation, and is downloadable as PDF

### AC-07: Invoice Email
- GIVEN a PO is generated  
- WHEN Procurement Officer clicks "Email Invoice"  
- THEN vendor receives email with PDF invoice attachment within 60 seconds

---

## 17. Out of Scope

- Multi-currency support (INR only for hackathon)
- Inventory management
- Supplier ERP integration (SAP/Oracle connectors)
- Mobile native apps
- SSO / SAML authentication
- E-tendering / reverse auction
- Contract management
- Payment gateway integration

---

*Document prepared by Team Antigravity for VendorBridge Hackathon Submission*  
*Version 1.0.0 | Production-Ready*