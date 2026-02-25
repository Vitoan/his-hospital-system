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

module.exports = { obtenerMapaCamas, inicializarInfraestructura };