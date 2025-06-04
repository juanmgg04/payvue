import unittest
from flask import Flask
from models import db
from routes.auth import bp as auth_bp


class AuthApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.register_blueprint(auth_bp)
        db.init_app(self.app)
        with self.app.app_context():
            db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register(self):
        response = self.client.post('/auth/register', json={
            "email": "test@example.com",
            "password": "password"
        })
        self.assertEqual(response.status_code, 201)

    def test_register_existing_user(self):
        # Primero registramos un usuario
        self.client.post('/auth/register', json={
            "email": "test@example.com",
            "password": "password"
        })
        response = self.client.post('/auth/register', json={
            "email": "test@example.com",
            "password": "password"
        })
        self.assertEqual(response.status_code, 400)
    def test_login(self):
        # Primero registramos un usuario
        self.client.post('/auth/register', json={
            "email": "test@example.com",
            "password": "password"
        })
        response = self.client.post('/auth/login', json={
            "email": "test@example.com",
            "password": "password"
        })
        self.assertEqual(response.status_code, 200)
    def test_login_invalid_credentials(self):
        response = self.client.post('/auth/login', json={
            "email": "test@example.com",
            "password": "wrongpassword"
        })
        self.assertEqual(response.status_code, 401)
    def test_logout(self):
        # Primero registramos un usuario
        self.client.post('/auth/register', json={
            "email": "test@example.com",
            "password": "password"
        })
        response = self.client.post('/auth/logout')
        self.assertEqual(response.status_code, 200)
    def test_logout_without_login(self):
        response = self.client.post('/auth/logout')
        self.assertEqual(response.status_code, 200)
        
if __name__ == '__main__':
    unittest.main()