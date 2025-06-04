from models import db
from models.income import Income
from datetime import datetime


class IncomeService:
    """
    Servicio para la gestión de ingresos.
    Proporciona métodos para crear, obtener, actualizar y eliminar ingresos.
    """
    @staticmethod
    def create_income(data):
        """
        Crea un nuevo ingreso y lo guarda en la base de datos.
        Args:
            data (dict): Datos del ingreso, debe contener 'amount' y 'date'.
        Returns:
            Income: Objeto de ingreso creado.
        """
        income = Income(
            source='Ingreso Total',
            amount=data['amount'],
            date=datetime.strptime(data['date'], '%Y-%m-%d')
        )
        db.session.add(income)
        db.session.commit()
        return income

    @staticmethod
    def get_all_incomes():
        """
        Obtiene todos los ingresos registrados en la base de datos.
        Returns:
            list: Lista de objetos Income.
        """
        return Income.query.all()

    @staticmethod
    def update_income(id, data):
        """
        Actualiza un ingreso existente.
        Args:
            id (int): ID del ingreso a actualizar.
            data (dict): Datos actualizados del ingreso.
        Returns:
            Income: Objeto de ingreso actualizado.
        """
        income = Income.query.get_or_404(id)
        income.name = data['name']
        income.amount = data['amount']
        income.date = datetime.strptime(data['date'], '%Y-%m-%d')
        db.session.commit()
        return income

    @staticmethod
    def delete_income(id):
        """
        Elimina un ingreso existente.
        Args:
            id (int): ID del ingreso a eliminar.
        """
        income = Income.query.get_or_404(id)
        db.session.delete(income)
        db.session.commit()
