const EvaluacionMedica = require('../models/EvaluacionMedica');
const Tratamiento = require('../models/Tratamiento');
const SolicitudEstudio = require('../models/SolicitudEstudio');
const Episodio = require('../models/Episodio');

// 1. Registrar la evolución diaria y diagnóstico
const registrarEvolucion = async (req, res) => {
    try {
        const { IdEpisodio, DiagnosticoCIE10, EvolucionDetallada } = req.body;

        const episodio = await Episodio.findByPk(IdEpisodio);
        if (!episodio) {
            return res.status(404).json({ error: 'El episodio clínico no existe.' });
        }
        if (episodio.Estado === 'Cerrado_Alta' || episodio.Estado === 'Cancelado') {
            return res.status(400).json({ error: 'No se pueden agregar evoluciones a un episodio cerrado.' });
        }

        const nuevaEvolucion = await EvaluacionMedica.create({
            IdEpisodio,
            IdPersonal_Medico: req.usuario.id,
            DiagnosticoCIE10,
            EvolucionDetallada
        });

        if (episodio.Estado === 'Abierto_Enfermeria') {
            await episodio.update({ Estado: 'Internado' });
        }

        res.status(201).json({ mensaje: 'Evolución registrada exitosamente', evaluacion: nuevaEvolucion });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la evaluación: ' + error.message });
    }
};

// 2. Prescribir Tratamiento (Medicamentos, Terapias)
const prescribirTratamiento = async (req, res) => {
    try {
        const { IdEpisodio, Tipo, Descripcion } = req.body;

        const nuevoTratamiento = await Tratamiento.create({
            IdEpisodio,
            IdPersonal_Medico: req.usuario.id,
            Tipo,
            Descripcion
        });

        res.status(201).json({ mensaje: 'Tratamiento prescrito con éxito', tratamiento: nuevoTratamiento });
    } catch (error) {
        res.status(500).json({ error: 'Error al prescribir tratamiento: ' + error.message });
    }
};

// 3. Solicitar un Estudio (Laboratorio, Rayos)
const solicitarEstudio = async (req, res) => {
    try {
        const { IdEpisodio, Categoria, Prioridad, EstudioSolicitado } = req.body;

        const nuevaSolicitud = await SolicitudEstudio.create({
            IdEpisodio,
            IdPersonal_Medico: req.usuario.id,
            Categoria,
            Prioridad,
            EstudioSolicitado
        });

        res.status(201).json({ mensaje: 'Estudio solicitado con éxito', solicitud: nuevaSolicitud });
    } catch (error) {
        res.status(500).json({ error: 'Error al solicitar estudio: ' + error.message });
    }
};

// Se exportan TODAS las funciones juntas al final del archivo
module.exports = { 
    registrarEvolucion, 
    prescribirTratamiento, 
    solicitarEstudio 
};