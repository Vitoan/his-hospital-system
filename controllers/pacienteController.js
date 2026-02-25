const Paciente = require('../models/Paciente');

const crearPaciente = async (req, res) => {
    try {
        const { Dni, Nombre, Apellido, Telefono, ObraSocial } = req.body;
        
        // 1. Verificamos si ya existe alguien con ese DNI
        const existePaciente = await Paciente.findOne({ where: { Dni } });
        if (existePaciente) {
            return res.status(400).json({ error: 'Ya existe un paciente registrado con este DNI.' });
        }

        // 2. Lo creamos en la base de datos
        const nuevoPaciente = await Paciente.create({ 
            Dni, Nombre, Apellido, Telefono, ObraSocial 
        });
        
        res.status(201).json(nuevoPaciente);
    } catch (error) {
        console.error("Error al crear paciente:", error);
        res.status(500).json({ error: 'Error interno al crear el paciente.' });
    }
};

const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { Dni, Nombre, Apellido, Telefono, ObraSocial } = req.body;
        
        // 1. Buscamos al paciente
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        // 2. Lo actualizamos
        await paciente.update({ Dni, Nombre, Apellido, Telefono, ObraSocial });
        res.status(200).json({ mensaje: 'Paciente actualizado con éxito.' });
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        res.status(500).json({ error: 'Error interno al actualizar los datos.' });
    }
};

module.exports = { crearPaciente, actualizarPaciente };