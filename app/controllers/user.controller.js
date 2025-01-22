const User = require('../models').users;
const Bootcamp = require('../models').bootcamps;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

exports.findUserById = async (req, res) => {
  const id = req.params.id; // Obtiene el ID de los parámetros de la URL

  try {
    const user = await User.findByPk(id, {
      include: [{ // Incluir bootcamps (opcional)
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title", "cue", "description"],
        through: { attributes: [] }
      }]
    });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: `No se encontró el usuario con ID=${id}.` });
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).send({ message: "Error al obtener el usuario." });
  }
};

exports.findAllWithBootcamps = async (req, res) => { // Definición CORRECTA
  try {
    const users = await User.findAll({
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title", "cue", "description"],
        through: { attributes: [] }
      }]
    });

    res.status(200).send(users);
  } catch (error) {
    console.error("Error al buscar usuarios con bootcamps:", error);
    res.status(500).send({ message: "Error al obtener la lista de usuarios con bootcamps." });
  }
};

exports.signup = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Todos los campos son requeridos." });
    }

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };
    const newUser = await User.create(user);
    res.status(201).send({ message: "Usuario registrado correctamente!" });
  } catch (error) {
    console.error("Error completo al registrar usuario:", error); // Imprime el error COMPLETO en la consola
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).send({ messages: messages });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({ message: "El correo electrónico ya está registrado." });
    } else {
      return res.status(500).send({ message: "Error al registrar el usuario: " + error.message }); //Incluimos el mensaje de error
    }
  }
};;

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña invalida!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 horas
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).send({ message: "Error al iniciar sesión." });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: { attributes: [] }
      }]
    });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error al buscar usuario por ID:", error);
    res.status(500).send({ message: "Error al buscar el usuario." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll(); // Consulta a la base de datos
    res.send(users); // Enviar la respuesta
  } catch (error) {
    console.error("Error al buscar todos los usuarios:", error); // Imprime el error en la consola
    res.status(500).send({ message: "Error al obtener la lista de usuarios." });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      return res.status(200).send(updatedUser);
    }
    return res.status(404).send({ message: 'Usuario no encontrado' });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).send({ message: "Error al actualizar el usuario." });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (deleted) {
      return res.status(204).send(); // 204 No Content para eliminación exitosa
    }
    return res.status(404).send({ message: 'Usuario no encontrado' });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send({ message: "Error al eliminar el usuario." });
  }
};