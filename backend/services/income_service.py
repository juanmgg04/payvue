from  models import db
from  models.income import Income
from datetime import datetime

class IncomeService:
    @staticmethod
    def create_income(data):
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
        return Income.query.all()

    @staticmethod
    def update_income(id, data):
        income = Income.query.get_or_404(id)
        income.name = data['name']
        income.amount = data['amount']
        income.date = datetime.strptime(data['date'], '%Y-%m-%d')
        db.session.commit()
        return income

    @staticmethod
    def delete_income(id):
        income = Income.query.get_or_404(id)
        db.session.delete(income)
        db.session.commit()