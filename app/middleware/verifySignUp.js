const db = require("../models");
const User = db.users;

const verifySignUp = {
    checkDuplicateEmail: async (req, res, next) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email } });
            if (user) {
                return res.status(400).send({ message: "El correo electrónico ya está en uso!" });
            }
            next();
        } catch (error) {
            return res.status(500).send({ message: "Error al verificar el correo electrónico." });
        }
    }
};

module.exports = verifySignUp;