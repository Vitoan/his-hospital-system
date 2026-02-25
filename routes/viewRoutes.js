const express = require('express');
const router = express.Router();

// Renderizar la pantalla de Login
router.get('/login', (req, res) => {
    res.render('login'); // Esto busca el archivo views/login.pug
});

module.exports = router;