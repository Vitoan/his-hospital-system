const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

// 1. Cargar variables de entorno
dotenv.config();

// 2. Importar Modelos (El orden no importa mucho aquí, pero es bueno tenerlos juntos)
const Usuario = require('./models/Usuario');
const Paciente = require('./models/Paciente');
const Ala = require('./models/Ala');
const Habitacion = require('./models/Habitacion');
const Cama = require('./models/Cama');
const Episodio = require('./models/Episodio');
const EvaluacionEnfermeria = require('./models/EvaluacionEnfermeria');
const EvaluacionMedica = require('./models/EvaluacionMedica');
const Tratamiento = require('./models/Tratamiento');

// 3. Importar Rutas
const authRoutes = require('./routes/authRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const infraestructuraRoutes = require('./routes/infraestructuraRoutes');
const episodioRoutes = require('./routes/episodioRoutes');
const enfermeriaRoutes = require('./routes/enfermeriaRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const SolicitudEstudio = require('./models/SolicitudEstudio');
// Importar rutas visuales
const viewRoutes = require('./routes/viewRoutes');



// Importar Middlewares de Seguridad
const { protegerRuta, verificarRol } = require('./middlewares/authMiddleware');

// 4. Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// 5. Middlewares Globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');


// =========================================================
// 6. DEFINICIÓN DE RELACIONES (ASOCIACIONES SEQUELIZE)
// =========================================================

// Un Episodio tiene muchos Tratamientos y Solicitudes
Episodio.hasMany(Tratamiento, { foreignKey: 'IdEpisodio' });
Tratamiento.belongsTo(Episodio, { foreignKey: 'IdEpisodio' });

Episodio.hasMany(SolicitudEstudio, { foreignKey: 'IdEpisodio' });
SolicitudEstudio.belongsTo(Episodio, { foreignKey: 'IdEpisodio' });

// Un Médico prescribe muchos Tratamientos y Estudios
Usuario.hasMany(Tratamiento, { foreignKey: 'IdPersonal_Medico' });
Tratamiento.belongsTo(Usuario, { foreignKey: 'IdPersonal_Medico' });

Usuario.hasMany(SolicitudEstudio, { foreignKey: 'IdPersonal_Medico' });
SolicitudEstudio.belongsTo(Usuario, { foreignKey: 'IdPersonal_Medico' });
// Un Episodio tiene muchas Evaluaciones Médicas (Evolución diaria)
Episodio.hasMany(EvaluacionMedica, { foreignKey: 'IdEpisodio' });
EvaluacionMedica.belongsTo(Episodio, { foreignKey: 'IdEpisodio' });

// Un Usuario (Médico) firma muchas Evaluaciones
Usuario.hasMany(EvaluacionMedica, { foreignKey: 'IdPersonal_Medico' });
EvaluacionMedica.belongsTo(Usuario, { foreignKey: 'IdPersonal_Medico' });

// Infraestructura: Un Ala tiene muchas Habitaciones
Ala.hasMany(Habitacion, { foreignKey: 'IdAla' });
Habitacion.belongsTo(Ala, { foreignKey: 'IdAla' });

// Infraestructura: Una Habitación tiene muchas Camas
Habitacion.hasMany(Cama, { foreignKey: 'IdHabitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'IdHabitacion' });

// Clínica: Un Paciente tiene muchos Episodios (Internaciones a lo largo de su vida)
Paciente.hasMany(Episodio, { foreignKey: 'IdPaciente' });
Episodio.belongsTo(Paciente, { foreignKey: 'IdPaciente' });

// Clínica: Una Cama alberga muchos Episodios (A lo largo del tiempo)
Cama.hasMany(Episodio, { foreignKey: 'IdCama' });
Episodio.belongsTo(Cama, { foreignKey: 'IdCama' });

// Un Episodio tiene muchas Evaluaciones de Enfermería
Episodio.hasMany(EvaluacionEnfermeria, { foreignKey: 'IdEpisodio' });
EvaluacionEnfermeria.belongsTo(Episodio, { foreignKey: 'IdEpisodio' });

// Un Usuario (Enfermero) realiza muchas Evaluaciones
Usuario.hasMany(EvaluacionEnfermeria, { foreignKey: 'IdPersonal_Enfermero' });
EvaluacionEnfermeria.belongsTo(Usuario, { foreignKey: 'IdPersonal_Enfermero' });

// =========================================================
// 7. REGISTRO DE RUTAS
// =========================================================

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/infraestructura', infraestructuraRoutes);
app.use('/api/episodios', episodioRoutes);
app.use('/api/enfermeria', enfermeriaRoutes);
app.use('/api/medico', medicoRoutes);
// Rutas visuales
app.use('/', viewRoutes);
// Ruta pública de bienvenida
app.get('/', (req, res) => {
    res.send('🏥 ¡Bienvenido a la API del Sistema de Información Hospitalaria (HIS)!');
});

// Rutas de prueba para verificar el middleware (opcionales)
app.get('/api/perfil', protegerRuta, (req, res) => {
    res.json({ mensaje: '¡Bienvenido a tu perfil!', tusDatos: req.usuario });
});
app.get('/api/admin/dashboard', protegerRuta, verificarRol('Admin'), (req, res) => {
    res.json({ mensaje: '😎 Bienvenido al panel de control exclusivo para Administradores.' });
});

// =========================================================
// 8. CONEXIÓN A LA BASE DE DATOS Y ARRANQUE DEL SERVIDOR
// =========================================================

sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL (XAMPP) exitosa.');
        
        // { alter: true } aplica los cambios (nuevas columnas, foreign keys) sin borrar los datos existentes
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log('✅ Base de datos sincronizada y lista con todas las relaciones relacionales.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error fatal al conectar o sincronizar la base de datos:', err);
    });