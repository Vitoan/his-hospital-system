const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Importamos bcrypt

const Usuario = sequelize.define('Usuario', {
    IdUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Rol: {
        type: DataTypes.ENUM('Admin', 'Recepcionista', 'Medico', 'Enfermero', 'Paciente', 'Tecnico'),
        allowNull: false
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'Usuario',
    timestamps: true,
    createdAt: 'FechaCreacion',
    updatedAt: false,
    // AQUÍ AGREGAMOS LOS HOOKS DE ENCRIPTACIÓN
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.PasswordHash) {
                // Generamos la "sal" y encriptamos la contraseña
                const salt = await bcrypt.genSalt(10);
                usuario.PasswordHash = await bcrypt.hash(usuario.PasswordHash, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('PasswordHash')) {
                const salt = await bcrypt.genSalt(10);
                usuario.PasswordHash = await bcrypt.hash(usuario.PasswordHash, salt);
            }
        }
    }
});

module.exports = Usuario;