const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "El nombre es requerido" } }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "El apellido es requerido" } }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Correo ya registrado' },
      validate: {
        notEmpty: { msg: "El correo es requerido" },
        isEmail: { msg: 'Formato de correo inválido' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: { args: [8], msg: "La contraseña debe tener al menos 8 caracteres" } }
    }
  }, {
    hooks: { beforeCreate: (user) => { user.password = bcrypt.hashSync(user.password, 10); } },
    instanceMethods: { validPassword: function (password) { return bcrypt.compareSync(password, this.password); } }, // Para Sequelize v5
    methods: { validPassword: function (password) { return bcrypt.compareSync(password, this.password); } } // Para Sequelize v6+
  });
  return User;
};