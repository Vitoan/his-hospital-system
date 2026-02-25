const EvaluacionEnfermeria = require('../models/EvaluacionEnfermeria');
const Episodio = require('../models/Episodio');

const registrarEvaluacion = async (req, res) => {
    try {
        const { 
            IdEpisodio, MotivoInternacion, SintomasPrincipales, MedicacionActual, 
            PresionArterial, FrecuenciaCardiaca, FrecuenciaRespiratoria, 
            Temperatura, AspectoGeneral, PlanCuidadosInicial 
        } = req.body;

        // 1. Verificar que el episodio exista y esté activo
        const episodio = await Episodio.findByPk(IdEpisodio);
        if (!episodio) {
            return res.status(404).json({ error: 'El episodio (internación) no existe.' });
        }
        if (episodio.Estado === 'Cerrado_Alta' || episodio.Estado === 'Cancelado') {
            return res.status(400).json({ error: 'No se pueden agregar controles a un episodio cerrado.' });
        }

        // 2. Crear el registro. 
        // ¡MÁGIA DE SEGURIDAD!: Sacamos el ID del enfermero directamente de su token (req.usuario.id)
        const nuevaEvaluacion = await EvaluacionEnfermeria.create({
            IdEpisodio,
            IdPersonal_Enfermero: req.usuario.id, // Viene del JWT
            MotivoInternacion,
            SintomasPrincipales,
            MedicacionActual,
            PresionArterial,
            FrecuenciaCardiaca,
            FrecuenciaRespiratoria,
            Temperatura,
            AspectoGeneral,
            PlanCuidadosInicial
        });

        res.status(201).json({ 
            mensaje: 'Evaluación y signos vitales registrados con éxito', 
            evaluacion: nuevaEvaluacion 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la evaluación: ' + error.message });
    }
};

module.exports = { registrarEvaluacion };