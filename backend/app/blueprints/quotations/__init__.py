from flask import Blueprint

quotations_bp = Blueprint('quotations', __name__)

from . import routes
