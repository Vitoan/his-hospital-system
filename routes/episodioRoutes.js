const express = require('express');
const router = express.Router();
const episodioController = require('../controllers/episodioController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');

// Solo Recepcionistas y Administradores pueden internar pacientes
router.post('/internar', protegerRuta, verificarRol('Admin', 'Recepcionista'), episodioController.internarPaciente);

module.exports = router;