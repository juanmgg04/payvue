from models import db


class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    remaining_amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    num_installments = db.Column(db.Integer, nullable=False)
    installment_amount = db.Column(db.Float, nullable=False)
    payment_day = db.Column(db.Integer, nullable=False)
    paid = db.Column(db.Boolean, default=False)
    payments = db.relationship(
        'Payment',
        backref='debt',
        cascade='all, delete-orphan'
    )
