const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Solo los Enfermeros (y el Admin para pruebas) pueden registrar estas evaluaciones
router.post('/evaluacion', protegerRuta, verificarRol('Enfermero', 'Admin'), enfermeriaController.registrarEvaluacion);

module.exports = router;