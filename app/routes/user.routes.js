const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

router.get("/withBootcamps", controller.findAllWithBootcamps); // Ruta para obtener usuarios con bootcamps
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.get("/:id", [authJwt.verifyToken], controller.findUserById);
router.get("/", [authJwt.verifyToken], controller.findAll);
router.put("/:id", [authJwt.verifyToken], controller.updateUserById);
router.delete("/:id", [authJwt.verifyToken], controller.deleteUserById);

module.exports = app => {
    app.use('/api/users', router); // Monta el enrutador
};
