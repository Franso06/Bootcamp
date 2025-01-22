const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config(); // Carga las variables de entorno desde .env si existe

const app = express();

const db = require("./app/models");

const PORT = process.env.PORT || 8080; // Define el puerto

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes/user.routes')(app);
require('./app/routes/bootcamp.routes')(app);

db.sequelize.sync({ force: false }) // force: false... Evita que se borren las tablas existentes cada vez que se reinicia el servidor.
  .then(() => {
    console.log('Base de datos sincronizada.');
  })
  .catch((err) => {
    console.log("No se pudo sincronizar la base de datos: " + err.message);
  })

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});
