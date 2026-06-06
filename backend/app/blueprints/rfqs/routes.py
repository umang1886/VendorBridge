from flask import request, jsonify
from app.blueprints.rfqs import rfqs_bp
from app.models import RFQ, RFQItem
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

@rfqs_bp.route('/', methods=['GET'])
@jwt_required()
def get_rfqs():
    rfqs = RFQ.query.all()
    return jsonify([{
        "id": str(r.id),
        "rfq_number": r.rfq_number,
        "title": r.title,
        "status": r.status,
        "deadline": r.deadline.isoformat(),
        "created_at": r.created_at.isoformat()
    } for r in rfqs]), 200

@rfqs_bp.route('/', methods=['POST'])
@jwt_required()
def create_rfq():
    current_user = get_jwt_identity()
    if current_user['role'] not in ['admin', 'procurement_officer']:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    
    # Generate RFQ number
    year = datetime.now().year
    count = RFQ.query.count() + 1
    rfq_number = f"RFQ-{year}-{str(count).zfill(4)}"
    
    new_rfq = RFQ(
        rfq_number=rfq_number,
        title=data.get('title'),
        description=data.get('description'),
        deadline=datetime.fromisoformat(data.get('deadline').replace('Z', '+00:00')),
        created_by=current_user['id']
    )
    db.session.add(new_rfq)
    db.session.flush() # Get the ID for items
    
    items_data = data.get('items', [])
    for item in items_data:
        rfq_item = RFQItem(
            rfq_id=new_rfq.id,
            item_name=item.get('name'),
            quantity=item.get('quantity'),
            unit=item.get('unit')
        )
        db.session.add(rfq_item)
        
    db.session.commit()
    
    return jsonify({"message": "RFQ created", "id": str(new_rfq.id)}), 201
