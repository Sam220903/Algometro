from flask import Flask, jsonify, render_template
import random
import time

app = Flask(__name__)

# Página principal que carga el dashboard
@app.route('/')
def index():
    return render_template('index.html')

# API que devuelve valores aleatorios para todos los algómetros
@app.route('/get_data')
def get_data():
    data = {
        "ph": random.randint(0, 14),
        "humidityAir": random.randint(0, 100),      # Porcentaje de humedad del aire
        "humiditySoil": random.randint(0, 100),     # Porcentaje de humedad del suelo
        "temperature": random.randint(0, 50),       # Temperatura en °C
        "light": random.randint(0, 100)             # Luz solar en porcentaje
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
