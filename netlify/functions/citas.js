const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const serverless = require('serverless-http'); // Importar serverless-http

const app = express();

// Middleware para servir archivos estáticos, parsear JSON y habilitar CORS
app.use(cors());
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

// Ruta para agregar una nueva cita
app.post('/api/citas', (req, res) => {
    const { nombre, email, telefono, fecha, hora, servicio } = req.body;

    if (!nombre || !email || !telefono || !fecha || !hora || !servicio) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaCita = { id: uuidv4(), nombre, email, telefono, fecha, hora, servicio };

    fs.readFile('./citas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer las citas' });
        }

        const citas = JSON.parse(data);
        citas.push(nuevaCita);

        fs.writeFile('./citas.json', JSON.stringify(citas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la cita' });
            }
            res.json({ mensaje: 'Cita guardada correctamente' });
        });
    });
});

// Ruta para eliminar una cita
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

        fs.writeFile('./citas.json', JSON.stringify(citasActualizadas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar las citas actualizadas' });
            }
            res.json({ mensaje: 'Cita eliminada correctamente' });
        });
    });
});

// Verificar y crear el archivo citas.json al iniciar la función
const checkCitasFile = () => {
    const filePath = './citas.json';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2)); // Crear archivo vacío si no existe
    }
};
checkCitasFile();

// Exportar el servidor Express como una función de Netlify
module.exports.handler = serverless(app);
