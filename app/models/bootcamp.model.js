const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Bootcamp = sequelize.define('bootcamp', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "El título es requerido" } }
    },
    cue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El CUE es requerido" },
        isInt: { msg: "El CUE debe ser un número entero" },
        min: { args: 5, msg: "El CUE mínimo es 5" },
        max: { args: 20, msg: "El CUE máximo es 20" }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "La descripción es requerida" } }
    }
  });
  return Bootcamp;
};