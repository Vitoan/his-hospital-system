const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

// Importar Modelos (Asegúrate de que esto esté solo UNA vez)
const Usuario = require('./models/Usuario');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Para leer las cookies
app.use(express.static('public'));

// Usar Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor HIS conectado y funcionando con Seguridad y Cookies!');
});

// Autenticar la conexión a la base de datos y sincronizar modelos
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL (XAMPP) exitosa.');
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log('✅ Modelos sincronizados con la base de datos.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar o sincronizar la base de datos:', err);
    });