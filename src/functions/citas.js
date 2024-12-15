// src/functions/citas.js

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Ruta para almacenar las citas
const citasFilePath = path.resolve(__dirname, '../../citas.json');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        // Leer todas las citas del archivo JSON
        const citas = JSON.parse(fs.readFileSync(citasFilePath, 'utf8'));
        return {
            statusCode: 200,
            body: JSON.stringify(citas),
        };
    }

    if (event.httpMethod === 'POST') {
        // Parsear el cuerpo de la solicitud
        const { nombre, email, telefono, fecha, hora, servicio } = JSON.parse(event.body);

        // Validar los campos requeridos
        if (!nombre || !email || !telefono || !fecha || !hora || !servicio) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Todos los campos son obligatorios' }),
            };
        }

        // Crear una nueva cita
        const nuevaCita = {
            id: uuidv4(),
            nombre,
            email,
            telefono,
            fecha,
            hora,
            servicio,
        };

        // Leer las citas existentes y agregar la nueva cita
        const citas = JSON.parse(fs.readFileSync(citasFilePath, 'utf8'));
        citas.push(nuevaCita);

        // Guardar las citas actualizadas en el archivo JSON
        fs.writeFileSync(citasFilePath, JSON.stringify(citas, null, 2));

        return {
            statusCode: 201,
            body: JSON.stringify({ mensaje: 'Cita agendada correctamente' }),
        };
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
    };
};
