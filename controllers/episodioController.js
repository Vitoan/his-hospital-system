const Episodio = require('../models/Episodio');
const Cama = require('../models/Cama');
const Paciente = require('../models/Paciente');

const internarPaciente = async (req, res) => {
    try {
        const { IdPaciente, IdCama, Origen } = req.body;

        // 1. Verificamos que la cama exista y esté libre
        const cama = await Cama.findByPk(IdCama);
        if (!cama) {
            return res.status(404).json({ error: 'La cama indicada no existe en el sistema.' });
        }
        if (cama.Estado !== 'Libre') {
            return res.status(400).json({ error: 'Error: La cama seleccionada ya está ocupada o en limpieza.' });
        }

        // 2. Verificamos que el paciente exista
        const paciente = await Paciente.findByPk(IdPaciente);
        if (!paciente) {
            return res.status(404).json({ error: 'El paciente indicado no existe.' });
        }

        // 3. Creamos el Episodio (La internación)
        const nuevoEpisodio = await Episodio.create({
            IdPaciente: IdPaciente,
            IdCama: IdCama,
            Origen: Origen,
            Estado: 'Abierto_Enfermeria'
        });

        // 4. MÁGIA: Cambiamos el estado de la cama a "Ocupada"
        await cama.update({ Estado: 'Ocupada' });

        res.status(201).json({ 
            mensaje: 'Paciente internado con éxito. Cama actualizada a Ocupada.', 
            episodio: nuevoEpisodio 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
};

module.exports = { internarPaciente };