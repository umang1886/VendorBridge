from flask import request, jsonify
from app.blueprints.vendors import vendors_bp
from app.models import Vendor
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

@vendors_bp.route('/', methods=['GET'])
@jwt_required()
def get_vendors():
    vendors = Vendor.query.all()
    return jsonify([{
        "id": str(v.id),
        "company_name": v.company_name,
        "contact_person": v.contact_person,
        "email": v.email,
        "status": v.status,
        "rating": float(v.rating)
    } for v in vendors]), 200

@vendors_bp.route('/', methods=['POST'])
@jwt_required()
def create_vendor():
    # Only admin/procurement can create vendors
    current_user = get_jwt_identity()
    if current_user['role'] not in ['admin', 'procurement_officer']:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    new_vendor = Vendor(
        company_name=data.get('company_name'),
        contact_person=data.get('contact_person'),
        email=data.get('email'),
        phone=data.get('phone'),
        gst_number=data.get('gst_number'),
        category=data.get('category'),
        status='active'
    )
    db.session.add(new_vendor)
    db.session.commit()
    
    return jsonify({"message": "Vendor created", "id": str(new_vendor.id)}), 201
