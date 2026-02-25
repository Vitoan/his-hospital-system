const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Solo Admin y Recepcionista pueden registrar pacientes
router.post('/', protegerRuta, verificarRol('Admin', 'Recepcionista'), pacienteController.crearPaciente);

// Admin, Recepcionista, Enfermero y Médico pueden buscar/ver pacientes
router.get('/', protegerRuta, verificarRol('Admin', 'Recepcionista', 'Enfermero', 'Medico'), pacienteController.obtenerPacientes);

module.exports = router;