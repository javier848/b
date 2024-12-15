// scripts.js

document.getElementById('form-citas').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nuevaCita = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        servicio: document.getElementById('servicio').value
    };

    try {
        const response = await fetch('/.netlify/functions/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaCita)
        });

        const data = await response.json();
        alert(data.mensaje); // Muestra un mensaje de éxito
    } catch (error) {
        alert('Error al agendar la cita');
        console.error(error);
    }
});
