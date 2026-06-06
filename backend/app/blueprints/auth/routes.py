from flask import request, jsonify
from app.blueprints.auth import auth_bp
from app.models import User, Vendor
from app.extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password(password, user.password_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"error": "User account is disabled"}), 403

    access_token = create_access_token(identity={
        "id": str(user.id),
        "email": user.email,
        "role": user.role,
        "name": user.name
    })

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    company_name = data.get('company_name')
    contact_name = data.get('contact_name')
    email = data.get('email')
    password = data.get('password')

    if not all([company_name, contact_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    # Create Vendor
    vendor = Vendor(
        company_name=company_name,
        contact_person=contact_name,
        email=email,
        status='active'
    )
    db.session.add(vendor)
    db.session.flush()

    # Create User
    user = User(
        name=contact_name,
        email=email,
        password_hash=hash_password(password),
        role='vendor',
        vendor_id=vendor.id
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200
