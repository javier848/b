const faunadb = require('faunadb');
const q = faunadb.query;

// Configura el cliente usando la clave desde las variables de entorno
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY });

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        const { nombre, email, telefono, fecha, hora, servicio } = JSON.parse(event.body);

        if (!nombre || !email || !telefono || !fecha || !hora || !servicio) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Todos los campos son obligatorios' }),
            };
        }

        try {
            // Crear un nuevo documento en la colección "citas"
            const result = await client.query(
                q.Create(q.Collection('citas'), {
                    data: { nombre, email, telefono, fecha, hora, servicio },
                })
            );

            return {
                statusCode: 201,
                body: JSON.stringify({ mensaje: 'Cita agendada correctamente', cita: result }),
            };
        } catch (error) {
            console.error('Error al guardar la cita:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error al agendar la cita' }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
    };
};
