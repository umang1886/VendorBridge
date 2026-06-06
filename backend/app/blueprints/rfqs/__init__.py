from flask import Blueprint

rfqs_bp = Blueprint('rfqs', __name__)

from . import routes
