# VendorBridge — n8n Workflow Setup Guide (Gmail + OpenAI)

## Prerequisites

Before importing, make sure you have:

- **n8n** running locally → `http://localhost:5678`
- **Gmail** account (for sending emails)
- **OpenAI API Key** → [Get one here](https://platform.openai.com/api-keys)
- **Supabase** project with the schema applied

---

## Step 1: Set n8n Environment Variables

Go to **n8n → Settings → Variables** and add these 4 variables:

| Variable Name | Value |
|---|---|
| `SUPABASE_URL` | `https://nviauqpjeqhccaxbxxdb.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key |
| `OPENAI_API_KEY` | Your OpenAI API key |

---

## Step 2: Connect Gmail in n8n

1. Go to **n8n → Credentials → Add Credential**
2. Search for **Gmail** (OAuth2)
3. Follow the Google OAuth flow to connect your Gmail account
4. Name it **"Gmail account"**

> **Note:** You need to set up an OAuth2 app in Google Cloud Console. n8n has a guide for this:
> `Settings → Credentials → Gmail → Click "How to set up"` link inside n8n.

---

## Step 3: Import the 3 Workflows

### Workflow 1: RFQ Email Notification
**File:** `docs/n8n_workflow_1_rfq_email.json`

**What it does:**
```
Webhook → Fetch assigned vendors → Send Gmail to each vendor
```

**Steps:**
1. Go to **n8n → Workflows → Import from File**
2. Select `n8n_workflow_1_rfq_email.json`
3. Open the **Gmail** node → Select your Gmail credential
4. Click **Save** → Click **Activate** (toggle ON)

**Webhook URL:** `http://localhost:5678/webhook/rfq-published`

---

### Workflow 2: AI Quotation Comparison (OpenAI)
**File:** `docs/n8n_workflow_2_ai_analysis.json`

**What it does:**
```
Webhook → Fetch quotations → Calculate scores → Ask OpenAI → Save to Supabase
```

**Steps:**
1. Go to **n8n → Workflows → Import from File**
2. Select `n8n_workflow_2_ai_analysis.json`
3. Click **Save** → Click **Activate** (toggle ON)

> This workflow uses the OpenAI REST API directly via HTTP Request — no extra credential needed.
> The `OPENAI_API_KEY` environment variable is used in the request header.

**Webhook URL:** `http://localhost:5678/webhook/trigger-ai-analysis`

---

### Workflow 3: PO Approved Email
**File:** `docs/n8n_workflow_3_invoice_automation.json`

**What it does:**
```
Webhook → Fetch PO details → Send Gmail notification to vendor
```

**Steps:**
1. Go to **n8n → Workflows → Import from File**
2. Select `n8n_workflow_3_invoice_automation.json`
3. Open the **Gmail** node → Select your Gmail credential
4. Click **Save** → Click **Activate** (toggle ON)

**Webhook URL:** `http://localhost:5678/webhook/po-approved`

---

## Step 4: Test the Flow

### Test Workflow 1 (RFQ Email):
1. Go to the Admin panel → **RFQs → Create RFQ**
2. Add items, select vendors, click **Publish**
3. Check your n8n execution log to see the email sent ✅

### Test Workflow 2 (AI Analysis):
1. Go to the Vendor portal → **RFQ Assignments**
2. Click an RFQ → Enter prices → Click **Submit Quotation**
3. The frontend automatically calls the n8n webhook
4. Check n8n execution log → OpenAI runs → Results saved to Supabase
5. Go back to Admin → **Quotations → Compare** to see the AI recommendation ✅

### Test Workflow 3 (PO Email):
You can test manually with curl:
```bash
curl -X POST http://localhost:5678/webhook/po-approved \
  -H "Content-Type: application/json" \
  -d '{"po_id": "YOUR_PO_ID_FROM_SUPABASE"}'
```

---

## Summary of Webhook URLs

| Webhook | URL | Triggered By |
|---|---|---|
| RFQ Published | `POST http://localhost:5678/webhook/rfq-published` | Admin creates RFQ |
| AI Analysis | `POST http://localhost:5678/webhook/trigger-ai-analysis` | Vendor submits quotation |
| PO Approved | `POST http://localhost:5678/webhook/po-approved` | Admin approves PO |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Gmail won't connect | Make sure OAuth2 app is set up in Google Cloud Console |
| OpenAI returns error | Check `OPENAI_API_KEY` is set correctly in n8n Variables |
| "No quotations found" | Make sure at least one vendor has submitted a quotation for that RFQ |
| Webhook returns 404 | Make sure the workflow is **Activated** (toggle ON) |
