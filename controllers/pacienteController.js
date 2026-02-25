const Paciente = require('../models/Paciente');

const crearPaciente = async (req, res) => {
    try {
        // 1. Imprimimos en la terminal negra lo que llega desde la web para revisar
        console.log("Datos recibidos del frontend:", req.body);

        let { Dni, Nombre, Apellido, Telefono, ObraSocial } = req.body;
        
        // 2. Validación de seguridad extra: Si DNI o Nombre están vacíos, cortamos acá
        if (!Dni || !Nombre) {
            return res.status(400).json({ error: 'Por favor, completa el DNI y el Nombre.' });
        }

        // 3. Verificamos si ya existe alguien con ese DNI
        const existePaciente = await Paciente.findOne({ where: { Dni } });
        if (existePaciente) {
            return res.status(400).json({ error: 'Ya existe un paciente registrado con este DNI.' });
        }

        // 4. Lo creamos en la base de datos (Forzando EsNN a false)
        const nuevoPaciente = await Paciente.create({ 
            Dni: Dni, 
            Nombre: Nombre, 
            Apellido: Apellido, 
            Telefono: Telefono, 
            ObraSocial: ObraSocial,
            EsNN: false // <- ESTO EVITA EL ERROR QUE ESTÁS VIENDO
        });
        
        res.status(201).json(nuevoPaciente);
    } catch (error) {
        console.error("Error al crear paciente:", error);
        
        // Si Sequelize se queja por alguna validación, se lo mandamos al frontend
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        
        res.status(500).json({ error: 'Error interno al guardar en la base de datos.' });
    }
};

const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { Dni, Nombre, Apellido, Telefono, ObraSocial } = req.body;
        
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        await paciente.update({ Dni, Nombre, Apellido, Telefono, ObraSocial });
        res.status(200).json({ mensaje: 'Paciente actualizado con éxito.' });
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        res.status(500).json({ error: 'Error interno al actualizar.' });
    }
};

module.exports = { crearPaciente, actualizarPaciente };