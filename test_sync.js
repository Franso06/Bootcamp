const db = require("./app/models");

db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Sincronización completada (test_sync.js).");
    })
    .catch((err) => {
        console.error("Error en la sincronización (test_sync.js):", err);
        console.error("Error detallado:", err.message); // Imprime el mensaje de error
        console.error("Error stack:", err.stack); // Imprime el stack trace
    });