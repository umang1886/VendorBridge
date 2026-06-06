from flask import request, jsonify
from app.blueprints.quotations import quotations_bp
from app.models import Quotation, RFQ
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

@quotations_bp.route('/', methods=['POST'])
@jwt_required()
def submit_quotation():
    current_user = get_jwt_identity()
    if current_user['role'] != 'vendor':
        return jsonify({"error": "Only vendors can submit quotations"}), 403

    data = request.get_json()
    rfq_id = data.get('rfq_id')
    
    # Verify RFQ exists and is open
    rfq = RFQ.query.get(rfq_id)
    if not rfq or rfq.status != 'open':
        return jsonify({"error": "RFQ is not open for submissions"}), 400

    # Prevent duplicate submissions
    existing = Quotation.query.filter_by(rfq_id=rfq_id, vendor_id=current_user['vendor_id']).first()
    if existing:
        return jsonify({"error": "Quotation already submitted for this RFQ"}), 400

    new_quotation = Quotation(
        rfq_id=rfq_id,
        vendor_id=current_user['vendor_id'],
        total_amount=data.get('total_amount'),
        delivery_days=data.get('delivery_days'),
        status='submitted'
    )
    
    db.session.add(new_quotation)
    db.session.commit()
    
    return jsonify({"message": "Quotation submitted", "id": str(new_quotation.id)}), 201

@quotations_bp.route('/rfq/<rfq_id>', methods=['GET'])
@jwt_required()
def get_rfq_quotations(rfq_id):
    current_user = get_jwt_identity()
    if current_user['role'] not in ['admin', 'procurement_officer']:
        return jsonify({"error": "Unauthorized"}), 403

    quotations = Quotation.query.filter_by(rfq_id=rfq_id).all()
    
    return jsonify([{
        "id": str(q.id),
        "vendor_id": str(q.vendor_id),
        "total_amount": float(q.total_amount),
        "delivery_days": q.delivery_days,
        "status": q.status,
        "submitted_at": q.submitted_at.isoformat()
    } for q in quotations]), 200
