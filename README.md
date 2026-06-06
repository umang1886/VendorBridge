uu<div align="center">

# 🚀 VendorBridge

### Procurement & Vendor Management ERP

*Streamlining Procurement Through Automation, Transparency & Intelligence*

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![n8n](https://img.shields.io/badge/Automation-n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Odoo](https://img.shields.io/badge/Odoo-Hackathon-purple?style=for-the-badge)
![ERP](https://img.shields.io/badge/ERP-Procurement-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

</div>

---

## 📖 Overview

VendorBridge is a modern Procurement & Vendor Management ERP designed to digitize and automate the complete procurement lifecycle.

Organizations often rely on emails, spreadsheets, and manual approvals for procurement activities, leading to inefficiencies, delays, and lack of visibility.

VendorBridge centralizes vendor management, RFQs, quotations, approvals, purchase orders, invoices, notifications, and analytics into a single intelligent platform.

---

## 🎯 Problem Statement

Organizations need a centralized platform to:

- Manage Vendors
- Create RFQs
- Receive Vendor Quotations
- Compare Quotations
- Process Approvals
- Generate Purchase Orders
- Generate Invoices
- Track Procurement Activities

VendorBridge solves this challenge by providing an end-to-end procurement workflow.

---

# ✨ Core Features

## 🔐 Authentication & Access Control

- Secure Login & Signup
- Forgot Password
- Session Management
- Role-Based Authentication
- Access Control

---

## 📊 Dashboard

Get a complete overview of procurement activities.

### Dashboard Widgets

- Pending Approvals
- Active RFQs
- Purchase Orders
- Recent Invoices
- Analytics Cards
- Quick Actions

---

## 🏢 Vendor Management

Efficiently manage all vendor information.

### Features

- Vendor Registration
- GST Details
- Vendor Categories
- Contact Information
- Vendor Status Tracking
- Search & Filters

---

## 📝 RFQ Management

Create and distribute procurement requests.

### Features

- RFQ Creation
- Product / Service Details
- Quantity Management
- Vendor Assignment
- File Attachments
- Deadline Management

---

## 💰 Vendor Quotations

Allow vendors to submit quotations digitally.

### Features

- Price Submission
- Delivery Timeline
- Vendor Notes
- Edit Quotations
- Submission Tracking

---

## ⚖️ Smart Quotation Comparison

Compare quotations side-by-side.

### Features

- Price Comparison
- Delivery Comparison
- Vendor Ratings
- Sorting & Filtering
- Lowest Price Highlighting

---

## ✅ Approval Workflow

Structured procurement approval process.

### Features

- Approve / Reject
- Approval Remarks
- Workflow States
- Status Tracking
- Approval Timeline

---

## 📦 Purchase Order Management

Automatically generate purchase orders from approved quotations.

### Features

- Auto PO Number Generation
- Vendor Mapping
- Order Tracking
- Status Updates

---

## 🧾 Invoice Management

Generate professional invoices instantly.

### Features

- Invoice Generation
- Tax Calculation
- PDF Download
- Print Invoice
- Email Invoice
- Invoice Tracking

---

## 🔔 Notifications & Audit Logs

Keep stakeholders informed.

### Features

- RFQ Notifications
- Approval Alerts
- Invoice Updates
- Activity Timeline
- Audit Logs

---

## 📈 Reports & Analytics

Powerful procurement insights.

### Features

- Vendor Performance
- Procurement Trends
- Spending Analysis
- Monthly Reports
- Exportable Reports

---

# 👥 User Roles

## 👑 Admin

- Manage Users
- Manage Vendors
- Monitor Activities
- View Analytics

---

## 🛒 Procurement Officer

- Create RFQs
- Compare Quotations
- Generate Purchase Orders
- Generate Invoices

---

## 🧑‍💼 Manager / Approver

- Approve Requests
- Reject Requests
- Add Remarks
- Track Workflows

---

## 🏭 Vendor

- View RFQs
- Submit Quotations
- Track RFQ Status
- View Purchase Orders
- Access Invoices

---

# 🔄 Procurement Workflow

```text
Create RFQ
     │
     ▼
Assign Vendors
     │
     ▼
Vendor Receives RFQ
     │
     ▼
Submit Quotation
     │
     ▼
Compare Quotations
     │
     ▼
Approval Workflow
     │
     ▼
Generate Purchase Order
     │
     ▼
Generate Invoice
     │
     ▼
Download / Print / Email
     │
     ▼
Analytics & Tracking
```

---

# 🏗️ System Architecture

## 🖥️ Company Portal

```text
Dashboard
├── Vendor Management
├── RFQ Management
├── Quotations
├── Approval Workflow
├── Purchase Orders
├── Invoices
├── Notifications
└── Analytics
```

## 🌐 Vendor Portal

```text
Vendor Dashboard
├── Assigned RFQs
├── Quotations
├── Purchase Orders
└── Invoices
```

---

# 📂 Project Structure

```text
vendorbridge/
│
├── Authentication
├── Dashboard
├── Vendor Management
├── RFQ Module
├── Quotation Module
├── Approval Workflow
├── Purchase Orders
├── Invoice Management
├── Notifications
├── Reports & Analytics
└── Audit Logs
```

---

# 💡 Future Enhancements

### 🤖 AI Vendor Recommendation

Recommend the best vendor based on:

- Previous Pricing
- Delivery History
- Vendor Ratings

### 🤖 AI Quotation Summary

Automatically summarize vendor quotations.

### 🤖 Smart Procurement Insights

- Cost Predictions
- Risk Analysis
- Vendor Performance Scoring

### 🤖 Procurement Assistant

AI-powered procurement support chatbot.

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Tailwind CSS
- ShadCN UI

## Backend

- Flask (Python)

## Database

- PostgreSQL

## Authentication

- JWT / Odoo Authentication

## Services

- Email Integration
- PDF Generation
- Notifications

---

# 🎯 Objectives

✅ Reduce Manual Procurement Work

✅ Improve Procurement Visibility

✅ Faster Vendor Communication

✅ Automated Approvals

✅ Better Vendor Management

✅ Real-Time Analytics

✅ Secure ERP Workflows

---

# 📸 Screenshots

> Add screenshots of Dashboard, RFQ Management, Vendor Portal, Quotation Comparison, and Analytics here.

```md
![Dashboard](screenshots/dashboard.png)

![RFQ](screenshots/rfq.png)

![Analytics](screenshots/analytics.png)
```

---

# 🚀 Installation

```bash
git clone https://github.com/your-username/vendorbridge.git

cd vendorbridge

pip install -r requirements.txt

python manage.py runserver
```

---

# 👨‍💻 Team

### VendorBridge Team

Built with ❤️ for the **Odoo Hackathon 2026**

---

<div align="center">

### 🌟 Transforming Procurement Through Automation 🌟

**VendorBridge – Procurement Made Smarter**

</div>
