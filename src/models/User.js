const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MEDICO', 'ENFERMERIA'),
    defaultValue: 'ENFERMERIA'
  }
});

module.exports = User;