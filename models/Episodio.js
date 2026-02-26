const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Episodio = sequelize.define('Episodio', {
    IdEpisodio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Las claves foráneas (IdPaciente e IdCama) las creará Sequelize automáticamente en app.js
    Origen: {
        type: DataTypes.ENUM('TurnoProgramado', 'DerivacionGuardia', 'EmergenciaNN'),
        allowNull: false
    },
    Estado: {
        type: DataTypes.ENUM('Abierto_Enfermeria', 'Internado', 'Cerrado_Alta', 'Cancelado'),
        defaultValue: 'Abierto_Enfermeria',
        allowNull: false
    },
    FechaIngreso: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    FechaAlta: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Episodio',
    timestamps: false // Ya estamos manejando las fechas manualmente arriba
});

module.exports = Episodio;