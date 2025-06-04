from models import db
from models.debt import Debt
from datetime import datetime


class DebtService:
    """
    Servicio para la gestión de deudas.
    """
    @staticmethod
    def create_debt(data):
        """
        Crea una nueva deuda y la guarda en la base de datos.
        Args:
            data (dict): Datos de la deuda, debe contener 'name', 'total_amount',
                         'remaining_amount', 'due_date', 'interest_rate',
                         'num_installments', 'installment_amount', 'payment_day'.
        Returns:
            Debt: Objeto de deuda creado.
        """
        debt = Debt(
            name=data['name'],
            total_amount=data['total_amount'],
            remaining_amount=data['remaining_amount'],
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
            interest_rate=data['interest_rate'],
            num_installments=data['num_installments'],
            installment_amount=data['installment_amount'],
            payment_day=data['payment_day'],
        )
        db.session.add(debt)
        db.session.commit()
        return debt

    @staticmethod
    def get_all_debts():
        """
        Obtiene todas las deudas registradas en la base de datos.
        Returns:
            list: Lista de objetos Debt.
        """
        return Debt.query.all()

    @staticmethod
    def update_debt(id, data):
        """
        Actualiza una deuda existente.
        Args:
            id (int): ID de la deuda a actualizar.
            data (dict): Datos actualizados de la deuda.
        Returns:
            Debt: Objeto de deuda actualizado.
        """
        debt = Debt.query.get_or_404(id)
        debt.name = data['name']
        debt.total_amount = data['total_amount']
        debt.remaining_amount = data['remaining_amount']
        debt.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
        debt.interest_rate = data['interest_rate']
        debt.num_installments = data['num_installments']
        debt.installment_amount = data['installment_amount']
        debt.payment_day = data['payment_day']
        debt.paid = data.get('paid', debt.paid)
        db.session.commit()
        return debt

    @staticmethod
    def delete_debt(id):
        """
        Elimina una deuda existente.
        Args:
            id (int): ID de la deuda a eliminar.
        """
        debt = Debt.query.get_or_404(id)
        db.session.delete(debt)
        db.session.commit()
