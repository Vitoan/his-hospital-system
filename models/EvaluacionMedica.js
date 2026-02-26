const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EvaluacionMedica = sequelize.define('EvaluacionMedica', {
    IdEvaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // IdEpisodio e IdPersonal_Medico serán generados por Sequelize en app.js
    DiagnosticoCIE10: {
        type: DataTypes.STRING(10), // Código internacional de enfermedades (Ej: J22)
        allowNull: true
    },
    EvolucionDetallada: {
        type: DataTypes.TEXT,
        allowNull: false // El médico siempre debe escribir qué vio o hizo
    }
}, {
    tableName: 'EvaluacionMedica',
    timestamps: true, // Automáticamente guarda la fecha y hora de la evolución
    updatedAt: false // Las notas médicas por motivos legales no se editan, si hay error se hace una nueva nota aclaratoria
});

module.exports = EvaluacionMedica;