const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Solo los Médicos (y Admin) pueden escribir evoluciones
router.post('/evolucion', protegerRuta, verificarRol('Medico', 'Admin'), medicoController.registrarEvolucion);
router.post('/tratamiento', protegerRuta, verificarRol('Medico', 'Admin'), medicoController.prescribirTratamiento);
router.post('/estudio', protegerRuta, verificarRol('Medico', 'Admin'), medicoController.solicitarEstudio);

module.exports = router;