from flask import Flask
from routes import auth, finances

app = Flask(__name__)

# Configuración de la aplicación
app.config['SECRET_KEY'] = 'tu_clave_secreta'

# Registro de rutas
app.register_blueprint(auth.bp)
app.register_blueprint(finances.bp)

if __name__ == '__main__':
    app.run(debug=True)