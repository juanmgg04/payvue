import unittest
from flask import Flask
from models import db
from routes.finances import bp as finances_bp
from models.debt import Debt
from models.income import Income
from models.payment import Payment
from datetime import datetime

class FinancesApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.register_blueprint(finances_bp)
        db.init_app(self.app)
        with self.app.app_context():
            db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_income_crud(self):
        # Crear ingreso
        response = self.client.post('/finances/income', json={
            "amount": 1000,
            "date": "2025-01-01"
        })
        self.assertEqual(response.status_code, 201)
        # Obtener ingresos
        response = self.client.get('/finances/income')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(any(i['amount'] == 1000 for i in data))

    def test_debt_crud(self):
        # Crear deuda
        response = self.client.post('/finances/debt', json={
            "name": "Banco",
            "total_amount": 500,
            "remaining_amount": 500,
            "due_date": "2025-01-01",
            "interest_rate": 5,
            "num_installments": 5,
            "installment_amount": 100,
            "payment_day": 10
        })
        self.assertEqual(response.status_code, 201)
        # Obtener deudas
        response = self.client.get('/finances/debt')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(any(d['name'] == "Banco" for d in data))

    def test_payment_get(self):
        # Crea deuda y pago manualmente (sin archivo)
        with self.app.app_context():
            debt = Debt(
                name="Banco",
                total_amount=500,
                remaining_amount=500,
                due_date=datetime.strptime("2025-01-01", "%Y-%m-%d").date(),
                interest_rate=5,
                num_installments=5,
                installment_amount=100,
                payment_day=10
            )
            db.session.add(debt)
            db.session.commit()
            payment = Payment(
                amount=100,
                date=datetime.strptime("2025-01-01", "%Y-%m-%d").date(),
                receipt_filename="test.pdf",
                debt_id=debt.id
            )
            db.session.add(payment)
            db.session.commit()
        # Obtener pagos
        response = self.client.get('/finances/payment')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(any(p['amount'] == 100 for p in data))
    
if __name__ == '__main__':
    unittest.main()