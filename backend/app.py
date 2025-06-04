from flask import Flask
from flask_cors import CORS
from models import db
from routes import auth, finances
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///payvue.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(auth.bp)
app.register_blueprint(finances.bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
