from models import db


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    receipt_filename = db.Column(db.String(255))
    debt_id = db.Column(db.Integer, db.ForeignKey('debt.id'), nullable=False)
