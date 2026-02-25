const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Habitacion = sequelize.define('Habitacion', {
    IdHabitacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Numero: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [[1, 2]] // Restricción: Solo puede tener 1 o 2 camas
        }
    },
    GeneroOcupacionActual: {
        type: DataTypes.ENUM('M', 'F', 'X', 'N'),
        defaultValue: 'N', // 'N' significa Ninguno (Vacia)
        allowNull: false
    }
}, {
    tableName: 'Habitacion',
    timestamps: false
});

module.exports = Habitacion;