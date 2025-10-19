const Agenda = require('../models/Agenda');

exports.getAll = async (req, res) => {
  try {
    const { fecha, profesionalId } = req.query;
    
    let agendas;
    if (fecha) {
      agendas = await Agenda.findByFecha(fecha);
    } else if (profesionalId) {
      agendas = await Agenda.findByProfesional(profesionalId);
    } else {
      agendas = await Agenda.findAll();
    }
    
    res.json(agendas);
  } catch (error) {
    console.error('Error al obtener agendas:', error);
    res.status(500).json({ error: 'Error al obtener agendas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    
    if (!agenda) {
      return res.status(404).json({ error: 'Agenda no encontrada' });
    }
    
    res.json(agenda);
  } catch (error) {
    console.error('Error al obtener agenda:', error);
    res.status(500).json({ error: 'Error al obtener agenda' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min } = req.body;
    
    const agenda = await Agenda.create({
      id_profesional,
      id_consultorio,
      fecha,
      hora_inicio,
      hora_fin,
      duracion_turno_min
    });
    
    res.status(201).json(agenda);
  } catch (error) {
    console.error('Error al crear agenda:', error);
    res.status(500).json({ error: 'Error al crear agenda' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min } = req.body;
    
    const agenda = await Agenda.update(req.params.id, {
      id_profesional,
      id_consultorio,
      fecha,
      hora_inicio,
      hora_fin,
      duracion_turno_min
    });
    
    res.json(agenda);
  } catch (error) {
    console.error('Error al actualizar agenda:', error);
    res.status(500).json({ error: 'Error al actualizar agenda' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Agenda.delete(req.params.id);
    res.json({ message: 'Agenda eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar agenda:', error);
    res.status(500).json({ error: 'Error al eliminar agenda' });
  }
};
