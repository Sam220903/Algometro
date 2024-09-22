const algometers = {
    ph: document.querySelector(".algometer:nth-of-type(1) .needle"),
    humidityAir: document.querySelector(".algometer:nth-of-type(2) .drop-fill"),
    humiditySoil: document.querySelector(".algometer:nth-of-type(3) .needle"),
    temperature: document.querySelector(".algometer:nth-of-type(4) .mercury"),
    light: document.querySelector(".algometer:nth-of-type(5) .battery-fill")
};

const labels = {
    ph: document.querySelector(".algometer:nth-of-type(1) .label span"),
    humidityAir: document.querySelector(".algometer:nth-of-type(2) .label span"),
    humiditySoil: document.querySelector(".algometer:nth-of-type(3) .label span"),
    temperature: document.querySelector(".algometer:nth-of-type(4) .label span"),
    light: document.querySelector(".algometer:nth-of-type(5) .label span")
};

// Función para actualizar la visualización del pH
function updatePh(value) {
    let rotationDeg = -90 + (value * (180 / 14)); // Rotación entre -90° y 90°
    algometers.ph.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg)`;
    labels.ph.textContent = `pH Level ${value}`;
}

// Función para actualizar la humedad del suelo
function updateHumiditySoil(value) {
    let max = 1024;
    let percentage = value;
    let rotationDeg = -90 + (value * (180 / 100)); // Para porcentajes (0-100)
    if (value > 100) {
        percentage = (1 - (value/max)) * 100;
        percentage = Math.round(percentage);

        rotationDeg = -90 + (percentage * (180 / 100));
    }
    algometers.humiditySoil.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg)`;
    labels.humiditySoil.textContent = `Humedad Suelo ${percentage}%`;
}

// Función para actualizar la humedad del aire
function updateHumidityAir(value) {
    let height = (value / 100) * 100; // Humedad del aire en porcentaje
    height = Math.min(height, 100);   // Limitar a 100%
    algometers.humidityAir.style.height = `${height}%`;
    labels.humidityAir.textContent = `Humedad Aire ${value}%`;
}

// Función para actualizar el termómetro
function updateTemperature(value) {
    let height = (value / 50) * 100; // Temperatura máxima 50°C
    height = Math.min(height, 100); // Limitar a 100%
    algometers.temperature.style.height = `${height}%`;
    labels.temperature.textContent = `Temperatura ${value}°C`;
}

// Función para actualizar la batería (luz solar)
function updateLight(value) {
    let max = 1023;
    let percentage = value;
    let height = (value / 100) * 100; // Luz solar en porcentaje
    height = Math.min(height, 100);   // Limitar a 100%
    if (value > 100) {
        percentage = (1 - (value / max)) * 100;
        percentage = Math.round(percentage);
        height = (percentage / 100) * 100;
    }
    algometers.light.style.height = `${height}%`;
    labels.light.textContent = `Luz Solar ${percentage}%`;
}

// Función para obtener los datos desde el servidor
async function fetchData() {
    try {
        const dataSource = document.getElementById('data-source').value;
        const endpoint = dataSource === 'real' ? '/sensor_data' : '/get_data';
        const response = await fetch(endpoint);
        const data = await response.json();

        // Actualizar cada algómetro con los datos recibidos
        updatePh(data.ph);
        updateHumidityAir(data.humidityAir);
        updateHumiditySoil(data.humiditySoil);
        updateTemperature(data.temperature);
        updateLight(data.light);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Actualiza los datos cada 2 segundos
setInterval(fetchData, 2000);

// Llamada inicial para mostrar datos al cargar la página
fetchData();

// Event listener para cambiar la fuente de datos
document.getElementById('data-source').addEventListener('change', fetchData);