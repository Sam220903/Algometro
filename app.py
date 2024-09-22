from flask import Flask, jsonify, render_template
import random
import time
import pyodbc

app = Flask(__name__)

def get_sensor_data():
    try:
        connection = pyodbc.connect("DRIVER={SQL server};SERVER=server-sensors.database.windows.net;DATABASE=db-sensors;UID=sas_admin_db;PWD=uEC'J:y@72@)TBB")
        cursor = connection.cursor()
        cursor.execute("""
        SELECT TOP 1
            CONVERT(DATE, d.date) AS date, -- Extraemos solo la fecha
            MAX(CASE WHEN s.type = 'Soil Moisture' THEN d.soil_moisture END) AS soil_moisture,
            MAX(CASE WHEN s.type = 'Temperature' THEN d.temperature END) AS temperature,
            MAX(CASE WHEN s.type = 'Air Humidity' THEN d.humidity END) AS humidity,
            MAX(CASE WHEN s.type = 'Sunlight' THEN d.sunlight END) AS sunlight,
            MAX(CASE WHEN s.type = 'PH Sensor' THEN d.soil_ph END) AS soil_ph
        FROM
            sa_datas d
        JOIN
            sa_sensors s ON d.idsa_sensor = s.idsda_sensor
        GROUP BY
            CONVERT(DATE, d.date)
        ORDER BY
            date DESC;
        """)
        row = cursor.fetchone()
        if not row:
            return {"error": "No data found"}
        # Convertir los resultados en un diccionario
        result = {
            "humiditySoil": row[1],
            "temperature": row[2],
            "humidityAir": row[3],
            "light": row[4],
            "ph": row[5],
        }
        return result
    except Exception as e:
        return {"error": str(e)}

# Endpoint de Flask para obtener los datos
@app.route('/sensor_data', methods=['GET'])
def sensor_data():
    data = get_sensor_data()
    return jsonify(data)
# Página principal que carga el dashboard
@app.route('/')
def index():
    return render_template('index.html')

# API que devuelve valores aleatorios para todos los algómetros
@app.route('/get_data')
def get_data():
    data = {
        "humiditySoil": random.randint(0, 100),     # Porcentaje de humedad del suelo
        "temperature": random.randint(0, 50),       # Temperatura en °C
        "humidityAir": random.randint(0, 100),      # Porcentaje de humedad del aire
        "light": random.randint(0, 100),            # Luz solar en porcentaje
        "ph": random.randint(0, 14)
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
