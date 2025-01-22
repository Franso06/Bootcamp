const {
  users,
  bootcamps
} = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res) => {
  // Validar la solicitud (¡MUY IMPORTANTE!)
  if (!req.body.title || !req.body.cue || !req.body.description) {
    return res.status(400).send({ message: "Los campos title, cue y description son requeridos." });
  }

  if (typeof req.body.cue !== 'number') {
    return res.status(400).send({ message: "El campo cue debe ser un número." });
  }

  const bootcamp = {
    title: req.body.title,
    cue: req.body.cue,
    description: req.body.description
  };

  try {
    const data = await Bootcamp.create(bootcamp); // Ahora Bootcamp está definido
    res.send(data);
  } catch (error) {
    console.error("Error al crear el bootcamp:", error);
    res.status(500).send({ message: "Error al crear el bootcamp." });
  }
};

// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res) => {
  try {
    const bootcampId = parseInt(req.body.bootcampId, 10); // Convertir a número (base 10)
    const userId = parseInt(req.body.userId, 10); // Convertir a número (base 10)

    if (isNaN(bootcampId) || isNaN(userId)) {
      return res.status(400).send({ message: "Los IDs de bootcamp y usuario deben ser números válidos." });
    }

    const bootcamp = await Bootcamp.findByPk(bootcampId);
    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    await bootcamp.addUser(user);
    console.log(`Usuario id=${user.id} agregado al bootcamp id=${bootcamp.id}`);
    res.status(200).send({ message: `Usuario ${user.firstName} ${user.lastName} agregado al bootcamp ${bootcamp.title}` });
  } catch (error) {
    console.error("Error al agregar usuario al bootcamp:", error);
    res.status(500).send({ message: "Error al agregar usuario al bootcamp." });
  }
};


// obtener los bootcamp por id 
exports.findById = (Id) => {
  return Bootcamp.findByPk(Id, {
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    },],
  })
    .then(bootcamp => {
      return bootcamp
    })
    .catch(err => {
      console.log(`>> Error mientras se encontraba el bootcamp: ${err}`)
    })
}

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = () => {
  return Bootcamp.findAll({
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    },],
  }).then(bootcamps => {
    return bootcamps
  }).catch((err) => {
    console.log(">> Error Buscando los Bootcamps: ", err);
  });
}