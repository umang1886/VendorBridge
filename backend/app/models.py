from app.extensions import db
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID, JSONB

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    vendor_id = db.Column(db.String(36), db.ForeignKey('vendors.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Vendor(db.Model):
    __tablename__ = 'vendors'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    gst_number = db.Column(db.String(50))
    category = db.Column(db.String(100))
    status = db.Column(db.String(50), default='active')
    rating = db.Column(db.Numeric(3, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class RFQ(db.Model):
    __tablename__ = 'rfqs'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    rfq_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='draft')
    deadline = db.Column(db.DateTime, nullable=False)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RFQItem(db.Model):
    __tablename__ = 'rfq_items'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    rfq_id = db.Column(db.String(36), db.ForeignKey('rfqs.id'))
    item_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Numeric(12, 2), nullable=False)
    unit = db.Column(db.String(50))

class Quotation(db.Model):
    __tablename__ = 'quotations'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    rfq_id = db.Column(db.String(36), db.ForeignKey('rfqs.id'))
    vendor_id = db.Column(db.String(36), db.ForeignKey('vendors.id'))
    status = db.Column(db.String(50), default='submitted')
    total_amount = db.Column(db.Numeric(15, 2), default=0)
    delivery_days = db.Column(db.Integer)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    po_number = db.Column(db.String(50), unique=True, nullable=False)
    rfq_id = db.Column(db.String(36), db.ForeignKey('rfqs.id'))
    vendor_id = db.Column(db.String(36), db.ForeignKey('vendors.id'))
    status = db.Column(db.String(50), default='draft')
    total_amount = db.Column(db.Numeric(15, 2), nullable=False)
    pdf_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Invoice(db.Model):
    __tablename__ = 'invoices'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    po_id = db.Column(db.String(36), db.ForeignKey('purchase_orders.id'))
    vendor_id = db.Column(db.String(36), db.ForeignKey('vendors.id'))
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(50), default='pending')
    pdf_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
