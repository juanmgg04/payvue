from models import db
from models.payment import Payment
from models.debt import Debt
from datetime import datetime

class PaymentService:
    """Servicio para la gestión de pagos."""

    @staticmethod
    def create_payment(amount, debt_id, filename, date=None):
        """
        Crea un nuevo pago y actualiza la deuda asociada.

        Args:
            amount (float): Monto del pago.
            debt_id (int): ID de la deuda asociada.
            filename (str): Nombre del archivo del recibo.
            date (str, optional): Fecha del pago en formato 'YYYY-MM-DD'.

        Returns:
            Payment: Objeto de pago creado.
        """
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        payment = Payment(
            amount=float(amount),
            date=datetime.strptime(date, '%Y-%m-%d'),
            receipt_filename=filename,
            debt_id=int(debt_id)
        )
        db.session.add(payment)
        # Actualiza la deuda
        debt = Debt.query.get(int(debt_id))
        if debt:
            debt.remaining_amount = max(0, debt.remaining_amount - float(amount))
            if debt.remaining_amount == 0:
                debt.paid = True
        db.session.commit()
        return payment

    @staticmethod
    def get_all_payments():
        """
        Obtiene todos los pagos registrados.

        Returns:
            list: Lista de objetos Payment.
        """
        return Payment.query.all()