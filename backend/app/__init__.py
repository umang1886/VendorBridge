from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, migrate, jwt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints here
    from app.blueprints.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from app.blueprints.rfqs import rfqs_bp
    app.register_blueprint(rfqs_bp, url_prefix='/api/rfqs')
    
    from app.blueprints.vendors import vendors_bp
    app.register_blueprint(vendors_bp, url_prefix='/api/vendors')

    from app.blueprints.quotations import quotations_bp
    app.register_blueprint(quotations_bp, url_prefix='/api/quotations')

    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app
