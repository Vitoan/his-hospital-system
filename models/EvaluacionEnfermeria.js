const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EvaluacionEnfermeria = sequelize.define('EvaluacionEnfermeria', {
    IdEvaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // IdEpisodio y IdPersonal_Enfermero serán Claves Foráneas creadas en app.js
    MotivoInternacion: {
        type: DataTypes.STRING(255),
        allowNull: true // Puede venir de la admisión
    },
    SintomasPrincipales: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    MedicacionActual: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    PresionArterial: {
        type: DataTypes.STRING(20), // Ej: "120/80"
        allowNull: false
    },
    FrecuenciaCardiaca: {
        type: DataTypes.INTEGER, // Latidos por minuto
        allowNull: false
    },
    FrecuenciaRespiratoria: {
        type: DataTypes.INTEGER, // Respiraciones por minuto
        allowNull: false
    },
    Temperatura: {
        type: DataTypes.DECIMAL(4, 2), // Ej: 37.50
        allowNull: false
    },
    AspectoGeneral: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    PlanCuidadosInicial: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'EvaluacionEnfermeria',
    timestamps: true, // Esto es clave: guardará la fecha y hora exacta del control (createdAt)
    updatedAt: false
});

module.exports = EvaluacionEnfermeria;