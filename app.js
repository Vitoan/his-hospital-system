const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');

// Importar modelos (Al importarlos, Sequelize sabe que existen)
const Usuario = require('./models/Usuario');
const authRoutes = require('./routes/authRoutes')
// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static('public')); 

// Rutas
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('¡Servidor HIS conectado y funcionando!');
});

// Autenticar la conexión a la base de datos y sincronizar modelos
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL (XAMPP) exitosa.');
        
        // sync({ alter: true }) revisa si hay cambios en los modelos y actualiza las tablas
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log('✅ Modelos sincronizados con la base de datos.');
        // Iniciar el servidor SOLO si la base de datos conectó bien
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar o sincronizar la base de datos:', err);
    });