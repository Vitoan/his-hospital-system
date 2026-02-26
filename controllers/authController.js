const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarAdminTemporal = async (req, res) => {
    try {
        // Creamos un admin por defecto
        const nuevoUsuario = await Usuario.create({
            Username: 'admin_general',
            PasswordHash: 'hospital123', // Sequelize lo encriptará automáticamente gracias a nuestro Hook
            Rol: 'Admin'
        });
        res.status(201).json({ mensaje: 'Admin creado con éxito', usuario: nuevoUsuario.Username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Buscar al usuario en la base de datos
        const usuario = await Usuario.findOne({ where: { Username: username, Activo: true } });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña enviada con la encriptada en la BD
        const passwordValida = await bcrypt.compare(password, usuario.PasswordHash);
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 3. Generar el JSON Web Token (JWT)
        // Guardamos el ID y el Rol adentro del token, ¡es muy útil para las vistas después!
        const token = jwt.sign(
            { id: usuario.IdUsuario, rol: usuario.Rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // El turno del hospital dura 8 horas
        );

        // 4. Enviar el token en una Cookie segura
        res.cookie('jwt', token, {
            httpOnly: true, // El navegador no puede acceder a ella con JavaScript (Evita hackeos XSS)
            secure: process.env.NODE_ENV === 'production', // En producción solo viaja por HTTPS
            maxAge: 8 * 60 * 60 * 1000 // 8 horas en milisegundos
        });

        res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso',
            rol: usuario.Rol // Le mandamos el rol al Frontend para que sepa qué dashboard cargar
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt'); // Borramos la cookie para cerrar sesión
    res.status(200).json({ mensaje: 'Sesión cerrada' });
};

const register = async (req, res) => {
    try {
        const { username, password, rol } = req.body;
        
        const nuevoUsuario = await Usuario.create({
            Username: username,
            PasswordHash: password, // Sequelize lo encriptará mágicamente
            Rol: rol || 'Admin' // Si no le mandas rol, por defecto será Admin
        });
        
        res.status(201).json({ 
            mensaje: 'Usuario creado con éxito', 
            usuario: nuevoUsuario.Username 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    login, 
    logout, 
    registrarAdminTemporal, 
    register 
};