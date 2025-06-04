from flask import Blueprint, request, jsonify
from models import db
from models.user import User

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    """
    Registra un nuevo usuario.
    Requiere un JSON con los campos 'email' y 'password'.
    Retorna un mensaje de éxito o error.
    """
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El correo ya está registrado"}), 400

    user = User(email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@bp.route('/login', methods=['POST'])
def login():
    """
    Inicia sesión de un usuario.
    Requiere un JSON con los campos 'email' y 'password'.
    Retorna un mensaje de éxito o error.
    """
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return jsonify({"message": "Inicio de sesión exitoso"}), 200
    return jsonify({"error": "Credenciales inválidas"}), 401

@bp.route('/logout', methods=['POST'])
def logout():
    """
    Cierra la sesión de un usuario.
    """
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200