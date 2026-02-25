const express = require('express');
const router = express.Router();
const infraestructuraController = require('../controllers/infraestructuraController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Ruta para que el Admin genere las primeras camas de prueba
router.post('/instalar', protegerRuta, verificarRol('Admin'), infraestructuraController.inicializarInfraestructura);

// Ruta para ver el mapa de camas (Accesible para Admin, Recepcionista, Enfermero y Médico)
router.get('/mapa', protegerRuta, verificarRol('Admin', 'Recepcionista', 'Enfermero', 'Medico'), infraestructuraController.obtenerMapaCamas);
// Ruta para marcar una cama como limpia (Accesible para Admin y Recepcionista)
router.post('/cama/:id/limpia', protegerRuta, verificarRol('Admin', 'Recepcionista'), infraestructuraController.habilitarCama);

module.exports = router;