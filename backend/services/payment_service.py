from  models import db
from  models.payment import Payment
from  models.debt import Debt
from datetime import datetime

class PaymentService:
    @staticmethod
    def create_payment(amount, debt_id, filename, date=None):
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
        return Payment.query.all()