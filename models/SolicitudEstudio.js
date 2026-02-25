const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudEstudio = sequelize.define('SolicitudEstudio', {
    IdSolicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Categoria: {
        type: DataTypes.ENUM('Laboratorio', 'DiagnosticoPorImagen'),
        allowNull: false
    },
    Prioridad: {
        type: DataTypes.ENUM('Normal', 'Alta', 'Urgente'),
        defaultValue: 'Normal',
        allowNull: false
    },
    EstudioSolicitado: {
        type: DataTypes.STRING(255),
        allowNull: false // Ej: "Hemograma completo" o "Radiografía de Tórax"
    },
    Estado: {
        type: DataTypes.ENUM('Pendiente', 'Completado', 'Cancelado'),
        defaultValue: 'Pendiente',
        allowNull: false
    }
}, {
    tableName: 'SolicitudEstudio',
    timestamps: true,
    updatedAt: false
});

module.exports = SolicitudEstudio;