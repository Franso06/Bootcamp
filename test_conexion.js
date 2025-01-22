const db = require("./app/models");

db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Sincronización completada (test_sync.js).");
    })
    .catch((err) => {
        console.error("Error en la sincronización (test_sync.js):", err);
    });