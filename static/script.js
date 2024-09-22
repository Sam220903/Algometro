const needle = document.querySelector(".needle");
const label = document.querySelector(".label span");

// Función para cambiar el nivel de la aguja
function changeLevel(value) {
    // Ajuste de la rotación para cubrir el rango de 0 a 14, empezando en -90° y terminando en 90°
    let rotationDeg = -90 + (value * (180 / 14)); // Rotación entre -90 y 90 grados
    let levelText = `ph Level = ${value}`;

    needle.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg)`;
    label.textContent = levelText;
}

// Función para obtener el nivel desde el servidor
async function fetchLevel() {
    const response = await fetch('/get_level');
    const data = await response.json();
    changeLevel(data.level);
}

// Actualiza el nivel cada 2 segundos con un valor simulado
setInterval(fetchLevel, 2000);
