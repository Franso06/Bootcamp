const { authJwt } = require("../middleware");
const controller = require("../controllers/bootcamp.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/bootcamp", controller.createBootcamp);
    app.post("/api/bootcamp/adduser", [authJwt.verifyToken], controller.addUser);
    app.get("/api/bootcamp/:id", controller.findById); // Esta ruta es pública
    app.get("/api/bootcamp", controller.findAll); // Esta ruta es pública
};