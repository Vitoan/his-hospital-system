require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error(err));