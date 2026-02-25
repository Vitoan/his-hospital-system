const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        // En el formulario (HTML) usamos name="email" y name="password"
        const { email, password } = req.body;

        // 1. Buscamos al usuario en la BD usando la columna 'Username'
        const usuario = await Usuario.findOne({ where: { Username: email } });

        // 2. Verificamos contraseña usando la columna 'PasswordHash'
        // NOTA: Como aún no estamos encriptando, comparamos directo con el texto
        if (!usuario || usuario.PasswordHash !== password) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos. Intente nuevamente.' });
        }

        // 3. Generamos el Token VIP
        const token = jwt.sign(
            { 
                id: usuario.IdUsuario, 
                rol: usuario.Rol,
                nombre: usuario.Username // Como no tienes columna Nombre, usamos el Username
            },
            'secreto_hospital_123',
            { expiresIn: '8h' }
        );

        // 4. Guardamos la cookie
        res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 8 * 60 * 60 * 1000
        });

        // 5. ¡Adentro!
        res.redirect('/dashboard');

    } catch (error) {
        console.error("Error en el login:", error);
        res.render('login', { error: 'Error interno del servidor al intentar ingresar.' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

module.exports = { login, logout };