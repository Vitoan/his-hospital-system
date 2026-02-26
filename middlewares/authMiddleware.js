const jwt = require('jsonwebtoken');

// 1. Guardia que verifica si el usuario está logueado
const protegerRuta = (req, res, next) => {
    // Buscar la cookie llamada 'jwt'
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Por favor, inicie sesión.' });
    }

    try {
        // Verificar si el token es válido y no ha sido alterado
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardamos los datos del usuario (id, rol) en la request para usarlos más adelante
        req.usuario = decodificado;
        
        // Todo está bien, le decimos a Express que continúe con la ruta
        next(); 
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

// 2. Guardia que verifica si el usuario tiene el ROL correcto
// Usamos el operador rest (...) para poder pasarle varios roles, ej: verificarRol('Admin', 'Recepcionista')
const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Primero nos aseguramos de que el usuario exista (que haya pasado por protegerRuta)
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'Autenticación requerida.' });
        }

        // Verificamos si su rol está dentro de la lista de permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                mensaje: `Acceso denegado. Esta acción requiere permisos de: ${rolesPermitidos.join(' o ')}.` 
            });
        }

        // El rol es correcto, pasa
        next();
    };
};

module.exports = { protegerRuta, verificarRol };