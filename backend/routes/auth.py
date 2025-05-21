from flask import Blueprint, request, jsonify

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    # Lógica de autenticación
    return jsonify({"message": "Inicio de sesión exitoso"})