const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middlewares/authMiddleware');
const { Op } = require('sequelize'); // Importamos los operadores (para usar "OR", "IN", etc.)

// Importamos todos los modelos necesarios para armar el mapa
const Ala = require('../models/Ala');
const Habitacion = require('../models/Habitacion');
const Cama = require('../models/Cama');
const Episodio = require('../models/Episodio');
const Paciente = require('../models/Paciente');

// Pantalla de Login (Pública)
router.get('/login', (req, res) => {
    res.render('login');
});

// Pantalla del Dashboard (¡Protegida!)
// Agregamos "async" porque ahora haremos consultas a la base de datos
router.get('/dashboard', protegerRuta, async (req, res) => {
    try {
        let mapaCamas = []; // Creamos un array vacío por defecto

        // Si el usuario es personal del hospital (No es Paciente), buscamos el mapa completo
        if (req.usuario.rol !== 'Paciente') {
            mapaCamas = await Ala.findAll({
                include: [
                    {
                        model: Habitacion,
                        include: [
                            { 
                                model: Cama,
                                include: [
                                    {
                                        model: Episodio,
                                        // Solo traemos el episodio si el paciente sigue internado
                                        where: { 
                                            Estado: { [Op.in]: ['Abierto_Enfermeria', 'Internado'] } 
                                        },
                                        // required: false es VITAL. Hace un LEFT JOIN. 
                                        // Significa: "Trae la cama de todas formas, aunque no tenga un paciente internado"
                                        required: false, 
                                        include: [
                                            { model: Paciente } // Traemos los datos personales del paciente
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                // Ordenamos todo prolijamente
                order: [
                    ['Nombre', 'ASC'],
                    [Habitacion, 'Numero', 'ASC'],
                    [Habitacion, Cama, 'NumeroCama', 'ASC']
                ]
            });
        }

        // Finalmente, renderizamos la vista enviando TANTO el usuario COMO el mapa de camas
        res.render('dashboard', { 
            usuario: req.usuario,
            mapas: mapaCamas 
        }); 

    } catch (error) {
        console.error("Error cargando el dashboard:", error);
        res.status(500).send("Error al cargar el Tablero Operativo");
    }
});

module.exports = router;