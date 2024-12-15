const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Generar IDs únicos para las citas
const cors = require('cors'); // Importar CORS

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos, parsear JSON y habilitar CORS
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Ruta para obtener todas las citas
app.get('/api/citas', (req, res) => {
    fs.readFile('./citas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer las citas' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar una nueva cita con validaciones
app.post('/api/citas', (req, res) => {
    const { nombre, email, telefono, fecha, hora, servicio } = req.body;

    // Validar los campos requeridos
    if (!nombre || !email || !telefono || !fecha || !hora || !servicio) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    // Validar formato de fecha
    const fechaValida = !isNaN(Date.parse(fecha));
    if (!fechaValida) {
        return res.status(400).json({ error: 'Fecha no válida' });
    }

    const nuevaCita = { id: uuidv4(), nombre, email, telefono, fecha, hora, servicio };

    // Leer las citas existentes
    fs.readFile('./citas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer las citas' });
        }

        const citas = JSON.parse(data);
        citas.push(nuevaCita);

        // Guardar las citas actualizadas
        fs.writeFile('./citas.json', JSON.stringify(citas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la cita' });
            }
            res.json({ mensaje: 'Cita guardada correctamente' });
        });
    });
});

// Ruta para eliminar una cita por ID
app.delete('/api/citas/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('./citas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer las citas' });
        }

        let citas = JSON.parse(data);
        const citasActualizadas = citas.filter((cita) => cita.id !== id);

        if (citas.length === citasActualizadas.length) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Guardar las citas actualizadas
        fs.writeFile('./citas.json', JSON.stringify(citasActualizadas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar las citas actualizadas' });
            }
            res.json({ mensaje: 'Cita eliminada correctamente' });
        });
    });
});

// Ruta para obtener una cita específica por ID
app.get('/api/citas/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('./citas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer las citas' });
        }

        const citas = JSON.parse(data);
        const cita = citas.find((cita) => cita.id === id);

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(cita);
    });
});

// Asegúrate de que el archivo citas.json existe, si no lo crea
const checkCitasFile = () => {
    const filePath = './citas.json';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2)); // Crear archivo vacío si no existe
    }
};

// Verificar y crear el archivo citas.json al iniciar el servidor
checkCitasFile();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
