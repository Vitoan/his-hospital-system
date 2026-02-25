const Episodio = require('../models/Episodio');
const Cama = require('../models/Cama');
const Paciente = require('../models/Paciente');
const EvaluacionMedica = require('../models/EvaluacionMedica');

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

const darDeAlta = async (req, res) => {
    try {
        const { id } = req.params; // El ID del episodio vendrá en la URL (ej: /api/episodios/1/alta)
        const { indicacionesFinales } = req.body; // El médico escribe las indicaciones para la casa

        // 1. Buscamos el episodio
        const episodio = await Episodio.findByPk(id);
        if (!episodio) {
            return res.status(404).json({ error: 'Episodio clínico no encontrado.' });
        }
        if (episodio.Estado === 'Cerrado_Alta') {
            return res.status(400).json({ error: 'Este paciente ya fue dado de alta.' });
        }

        // Guardamos el ID de la cama antes de desvincularla
        const idCamaAfectada = episodio.IdCama;

        // 2. Cerramos el Episodio
        await episodio.update({
            Estado: 'Cerrado_Alta',
            FechaAlta: new Date(), // Sella la fecha y hora exacta actual
            IdCama: null // El paciente ya no ocupa una cama física
        });

        // 3. Cambiamos el estado de la cama a "EnLimpieza"
        if (idCamaAfectada) {
            const cama = await Cama.findByPk(idCamaAfectada);
            if (cama) {
                await cama.update({ Estado: 'EnLimpieza' });
            }
        }

        // 4. Dejamos el registro médico legal del Alta
        if (indicacionesFinales) {
            await EvaluacionMedica.create({
                IdEpisodio: id,
                IdPersonal_Medico: req.usuario.id,
                EvolucionDetallada: 'ALTA HOSPITALARIA. Indicaciones al paciente: ' + indicacionesFinales
            });
        }

        res.status(200).json({ 
            mensaje: 'Paciente dado de alta exitosamente. La cama fue enviada a limpieza.' 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el alta: ' + error.message });
    }
};

module.exports = { internarPaciente, darDeAlta };