const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ala = sequelize.define('Ala', {
    IdAla: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Ala',
    timestamps: false // No necesitamos fecha de creación para un pabellón del edificio
});

module.exports = Ala;