// Función para cargar todas las citas
async function cargarCitas() {
    try {
        const response = await fetch('/api/citas');
        const citas = await response.json();
        const citasContainer = document.getElementById('citas-lista');

        citasContainer.innerHTML = '';

        citas.forEach((cita) => {
            const citaDiv = document.createElement('div');
            citaDiv.classList.add('col-md-6');

            citaDiv.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div>
                            <h5>${cita.nombre}</h5>
                            <p>
                                <strong>Email:</strong> ${cita.email}<br>
                                <strong>Teléfono:</strong> ${cita.telefono}<br>
                                <strong>Fecha:</strong> ${cita.fecha}<br>
                                <strong>Hora:</strong> ${cita.hora}<br>
                                <strong>Servicio:</strong> ${cita.servicio}
                            </p>
                        </div>
                        <div>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCita('${cita.id}')">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;

            citasContainer.appendChild(citaDiv);
        });
    } catch (error) {
        console.error('Error al cargar las citas:', error);
    }
}

// Función para agregar una nueva cita
document.getElementById('form-citas').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevaCita = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,  // Capturamos la hora seleccionada del select
        servicio: document.getElementById('servicio').value,
    };

    try {
        const response = await fetch('/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaCita),
        });

        if (response.ok) {
            alert('Cita agendada correctamente');
            document.getElementById('form-citas').reset();
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCita'));
            modal.hide();
            cargarCitas();
        } else {
            alert('Error al agendar la cita');
        }
    } catch (error) {
        console.error('Error al enviar la cita:', error);
    }
});


// Función para eliminar una cita
async function eliminarCita(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        return;
    }

    try {
        const response = await fetch(`/api/citas/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Cita eliminada correctamente');
            cargarCitas();
        } else {
            alert('Error al eliminar la cita');
        }
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
    }
}

// Cargar citas al iniciar la página
document.addEventListener('DOMContentLoaded', cargarCitas);

// Google Maps
function initMap() {
    const ubicacion = { lat: -12.046374, lng: -77.042793 }; // Cambia a la ubicación de tu barbería
    const mapa = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 15,
        center: ubicacion,
    });
    new google.maps.Marker({
        position: ubicacion,
        map: mapa,
        title: "Barbería Javier",
    });
}

// Cargar mapa dinámicamente
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=TU_CLAVE_API&callback=initMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);
