const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Ruta para CREAR un nuevo paciente (POST)
router.post('/', protegerRuta, verificarRol('Admin', 'Recepcionista', 'Medico'), pacienteController.crearPaciente);

// Ruta para EDITAR un paciente existente (PUT)
router.put('/:id', protegerRuta, verificarRol('Admin', 'Recepcionista', 'Medico'), pacienteController.actualizarPaciente);

module.exports = router;