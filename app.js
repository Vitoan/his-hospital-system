const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(express.json()); // Para entender datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Para entender datos de formularios HTML
app.use(express.static('public')); // Carpeta de archivos estáticos

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor HIS (Hospital Information System) funcionando correctamente!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});