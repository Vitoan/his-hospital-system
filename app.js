const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');


// 1. Cargar variables de entorno (Siempre debe ir al principio)
dotenv.config();

// 2. Importar Modelos (Esto asegura que Sequelize sepa que existen antes de sincronizar)
const Usuario = require('./models/Usuario');
const Paciente = require('./models/Paciente');

// 3. Importar Rutas y Middlewares
const authRoutes = require('./routes/authRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const Ala = require('./models/Ala');               
const Habitacion = require('./models/Habitacion'); 
const Cama = require('./models/Cama');
const infraestructuraRoutes = require('./routes/infraestructuraRoutes');

const { protegerRuta, verificarRol } = require('./middlewares/authMiddleware');

// 4. Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// 5. Middlewares Globales
app.use(express.json()); // Permite recibir JSON en el body (ej. desde Postman)
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios
app.use(cookieParser()); // Permite a Express leer y crear cookies de forma sencilla
app.use(express.static('public')); // Carpeta para archivos estáticos (CSS, JS, imágenes)
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/infraestructura', infraestructuraRoutes);


// 6. Registrar las Rutas Base
app.use('/api/auth', authRoutes); // Todas las rutas de autenticación irán aquí

// =========================================================
// 7. RUTAS DE PRUEBA Y DEMOSTRACIÓN DEL GUARDIA (MIDDLEWARE)
// =========================================================

// Ruta pública (Cualquiera puede entrar)
app.get('/', (req, res) => {
    res.send('🏥 ¡Bienvenido a la API del Sistema de Información Hospitalaria (HIS)!');
});

// Ruta Protegida: Solo para usuarios que hayan iniciado sesión (Cualquier Rol)
app.get('/api/perfil', protegerRuta, (req, res) => {
    res.json({ 
        mensaje: '¡Bienvenido a tu perfil!', 
        tusDatos: req.usuario // Esto viene del token decodificado por el middleware
    });
});

// Ruta Protegida por Rol: SOLO para Administradores
app.get('/api/admin/dashboard', protegerRuta, verificarRol('Admin'), (req, res) => {
    res.json({ mensaje: '😎 Bienvenido al panel de control exclusivo para Administradores.' });
});

// Ruta Protegida Compartida: Recepcionistas, Enfermeros y Médicos
app.get('/api/camas', protegerRuta, verificarRol('Recepcionista', 'Enfermero', 'Medico'), (req, res) => {
    res.json({ mensaje: '🛏️ Mostrando el mapa interactivo de camas del hospital...' });
});
// =========================================================
// DEFINICIÓN DE RELACIONES (ASOCIACIONES SEQUELIZE)
// =========================================================

// 1 Ala tiene muchas Habitaciones
Ala.hasMany(Habitacion, { foreignKey: 'IdAla' });
Habitacion.belongsTo(Ala, { foreignKey: 'IdAla' });

// 1 Habitación tiene muchas Camas
Habitacion.hasMany(Cama, { foreignKey: 'IdHabitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'IdHabitacion' });
// =========================================================
// 8. CONEXIÓN A LA BASE DE DATOS Y ARRANQUE DEL SERVIDOR
// =========================================================

sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL (XAMPP) exitosa.');
        
        // Sincroniza los modelos. { alter: true } actualiza las tablas si agregas columnas nuevas en el futuro
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log('✅ Base de datos sincronizada y lista.');
        
        // Iniciamos el servidor solo si la BD conectó bien
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error fatal al conectar o sincronizar la base de datos:', err);
    });