const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/instalar-admin', authController.registrarAdminTemporal);
router.post('/register', authController.register); 

module.exports = router;