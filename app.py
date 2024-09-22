from flask import Flask, jsonify, render_template
import random
import time

app = Flask(__name__)

# Página principal que carga el algómetro
@app.route('/')
def index():
    return render_template('index.html')

# API que devuelve un valor aleatorio entre 0 y 14
@app.route('/get_level')
def get_level():
    simulated_value = random.randint(0, 14)
    return jsonify(level=simulated_value)

if __name__ == '__main__':
    app.run(debug=True)
