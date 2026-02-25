const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cama = sequelize.define('Cama', {
    IdCama: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NumeroCama: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Estado: {
        type: DataTypes.ENUM('Libre', 'Ocupada', 'EnLimpieza'),
        defaultValue: 'Libre',
        allowNull: false
    }
}, {
    tableName: 'Cama',
    timestamps: false
});

module.exports = Cama;