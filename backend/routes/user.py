from flask import Blueprint, request, jsonify
from services.user_service import update_email

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/<int:user_id>/email', methods=['PUT'])
def update_user_email(user_id):
    """
    Actualiza el correo electrónico de un usuario.
    Requiere un JSON con el campo 'email'.
    Retorna un mensaje de éxito o error.
    """
    
    data = request.get_json()
    new_email = data.get('email')
    if not new_email:
        return jsonify({'error': 'Email requerido'}), 400
    user = update_email(user_id, new_email)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify({'message': 'Correo actualizado correctamente'})