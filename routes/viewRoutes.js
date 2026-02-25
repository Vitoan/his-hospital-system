const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// Importamos todos los modelos
const Ala = require('../models/Ala');
const Habitacion = require('../models/Habitacion');
const Cama = require('../models/Cama');
const Episodio = require('../models/Episodio');
const Paciente = require('../models/Paciente');

// 1. Pantalla de Login
router.get('/login', (req, res) => {
    res.render('login');
});

// 2. Pantalla del Dashboard (Mapa de Camas)
router.get('/dashboard', protegerRuta, async (req, res) => {
    try {
        let mapaCamas = [];
        if (req.usuario.rol !== 'Paciente') {
            mapaCamas = await Ala.findAll({
                include: [{
                    model: Habitacion,
                    include: [{ 
                        model: Cama,
                        include: [{
                            model: Episodio,
                            where: { Estado: { [Op.in]: ['Abierto_Enfermeria', 'Internado'] } },
                            required: false, 
                            include: [{ model: Paciente }]
                        }]
                    }]
                }],
                order: [
                    ['Nombre', 'ASC'],
                    [Habitacion, 'Numero', 'ASC'],
                    [Habitacion, Cama, 'NumeroCama', 'ASC']
                ]
            });
        }
        res.render('dashboard', { usuario: req.usuario, mapas: mapaCamas }); 
    } catch (error) {
        console.error("Error cargando el dashboard:", error);
        res.status(500).send("Error al cargar el Tablero Operativo");
    }
});

// 3. Pantalla de Historia Clínica (Buscador)
router.get('/historia-clinica', protegerRuta, async (req, res) => {
    try {
        const { dni } = req.query;
        if (!dni) {
            return res.render('historia-clinica', { usuario: req.usuario, paciente: null });
        }
        const paciente = await Paciente.findOne({
            where: { Dni: dni },
            include: [{
                model: Episodio,
                required: false,
                order: [['createdAt', 'DESC']]
            }]
        });
        res.render('historia-clinica', { usuario: req.usuario, paciente: paciente, busqueda: dni });
    } catch (error) {
        console.error("Error buscando historia:", error);
        res.status(500).send("Error al cargar la historia clínica");
    }
});

// 4. NUEVA PANTALLA: Directorio de Pacientes
router.get('/pacientes', protegerRuta, async (req, res) => {
    try {
        if (req.usuario.rol === 'Paciente') {
            return res.redirect('/dashboard');
        }
        const pacientes = await Paciente.findAll({
            order: [['Apellido', 'ASC']]
        });
        res.render('pacientes', { usuario: req.usuario, pacientes: pacientes });
    } catch (error) {
        console.error("Error al cargar el directorio:", error);
        res.status(500).send("Error al cargar el directorio de pacientes");
    }
});

// ESTA LÍNEA SIEMPRE DEBE IR AL FINAL
module.exports = router;