const Paciente = require('../models/Paciente');

// Crear un nuevo paciente (O un paciente NN)
const crearPaciente = async (req, res) => {
    try {
        const { DNI, Nombre, Apellido, FechaNacimiento, Sexo, Telefono, ContactoEmergencia, EsNN } = req.body;

        const nuevoPaciente = await Paciente.create({
            DNI, Nombre, Apellido, FechaNacimiento, Sexo, Telefono, ContactoEmergencia, EsNN
        });

        res.status(201).json({
            mensaje: 'Paciente registrado exitosamente',
            paciente: nuevoPaciente
        });
    } catch (error) {
        // Si falla la validación (ej. falta el DNI y no es NN), Sequelize lanza el error aquí
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los pacientes (O buscar por DNI si se envía por query)
const obtenerPacientes = async (req, res) => {
    try {
        const { dni } = req.query; // Ej: /api/pacientes?dni=12345678
        
        // Si mandan un DNI por la URL, filtramos. Si no, traemos todos.
        const condicion = dni ? { where: { DNI: dni } } : {};
        
        const pacientes = await Paciente.findAll(condicion);
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pacientes' });
    }
};

module.exports = { crearPaciente, obtenerPacientes };