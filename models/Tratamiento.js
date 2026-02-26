const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tratamiento = sequelize.define('Tratamiento', {
    IdTratamiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Tipo: {
        type: DataTypes.ENUM('Medicamento', 'TerapiaFisica', 'Cirugia', 'Otro'),
        allowNull: false
    },
    Descripcion: {
        type: DataTypes.TEXT,
        allowNull: false // Ej: "Ibuprofeno 400mg cada 8hs"
    },
    Estado: {
        type: DataTypes.ENUM('Activo', 'Realizado', 'Cancelado'),
        defaultValue: 'Activo',
        allowNull: false
    }
}, {
    tableName: 'Tratamiento',
    timestamps: true,
    updatedAt: false // Si el médico se equivoca, cancela el tratamiento y crea uno nuevo (auditoría)
});

module.exports = Tratamiento;