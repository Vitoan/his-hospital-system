const Ala = require('../models/Ala');
const Habitacion = require('../models/Habitacion');
const Cama = require('../models/Cama');

// 1. Obtener el Mapa Completo (Ala -> Habitacion -> Cama)
const obtenerMapaCamas = async (req, res) => {
    try {
        const mapa = await Ala.findAll({
            include: [
                {
                    model: Habitacion,
                    include: [
                        {
                            model: Cama
                            // Más adelante, aquí también incluiremos al Paciente internado
                        }
                    ]
                }
            ],
            order: [
                ['Nombre', 'ASC'], // Ordenar alas alfabéticamente
                [Habitacion, 'Numero', 'ASC'], // Ordenar habitaciones por número
                [Habitacion, Cama, 'NumeroCama', 'ASC'] // Ordenar camas por número
            ]
        });

        res.status(200).json(mapa);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el mapa de camas: ' + error.message });
    }
};

// 2. Crear infraestructura inicial (Solo para pruebas/Admin)
const inicializarInfraestructura = async (req, res) => {
    try {
        // Creamos un Ala
        const alaNueva = await Ala.create({ Nombre: 'Medicina Interna' });

        // Le creamos una Habitación doble
        const habNueva = await Habitacion.create({ 
            IdAla: alaNueva.IdAla, 
            Numero: '101', 
            Capacidad: 2 
        });

        // Le asignamos dos Camas a esa habitación
        await Cama.bulkCreate([
            { IdHabitacion: habNueva.IdHabitacion, NumeroCama: 'A' },
            { IdHabitacion: habNueva.IdHabitacion, NumeroCama: 'B' }
        ]);

        res.status(201).json({ mensaje: '¡Infraestructura inicial creada con éxito!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para limpiar la cama
const habilitarCama = async (req, res) => {
    try {
        const { id } = req.params;

        // IMPORTANTE: Asegúrate de tener Cama importado arriba en este archivo (const Cama = require('../models/Cama');)
        const cama = await Cama.findByPk(id);
        
        if (!cama) {
            return res.status(404).json({ error: 'Cama no encontrada.' });
        }
        if (cama.Estado !== 'EnLimpieza') {
            return res.status(400).json({ error: 'Esta cama no está marcada para limpieza.' });
        }

        await cama.update({ Estado: 'Libre' });
        res.status(200).json({ mensaje: 'Cama limpiada exitosamente.' });

    } catch (error) {
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
};

module.exports = { obtenerMapaCamas, inicializarInfraestructura, habilitarCama };