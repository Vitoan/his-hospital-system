const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para procesar el formulario de Login
router.post('/login', authController.login);

// Ruta para procesar el botón rojo de Cerrar Sesión del menú lateral
router.post('/logout', authController.logout);

module.exports = router;