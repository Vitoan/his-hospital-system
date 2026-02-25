const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
    IdPaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdUsuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        
    },
    DNI: {
        type: DataTypes.STRING(15),
        allowNull: true,
         
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Apellido: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FechaNacimiento: {
        type: DataTypes.DATEONLY, // Solo fecha, sin hora
        allowNull: true
    },
    Sexo: {
        type: DataTypes.ENUM('M', 'F', 'X'),
        allowNull: true
    },
    Telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    ContactoEmergencia: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    EsNN: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'Paciente',
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    validate: {
        // Esta es nuestra validación personalizada (Restricción 3FN)
        validarIdentidadNN() {
            if (this.EsNN === false && (!this.DNI || !this.Nombre)) {
                throw new Error('Si el paciente NO es de emergencia (NN), el DNI y el Nombre son obligatorios.');
            }
        }
    }
});

module.exports = Paciente;