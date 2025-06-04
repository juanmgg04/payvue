from models import db


class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)
