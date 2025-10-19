const Turno = require('../models/Turno');
const Atencion = require('../models/Atencion');

exports.getAll = async (req, res) => {
  try {
    const { fecha } = req.query;
    
    let turnos;
    if (fecha) {
      turnos = await Turno.findByFecha(fecha);
    } else {
      turnos = await Turno.findAll();
    }
    
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const turno = await Turno.findById(req.params.id);
    
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json(turno);
  } catch (error) {
    console.error('Error al obtener turno:', error);
    res.status(500).json({ error: 'Error al obtener turno' });
  }
};

exports.getByPaciente = async (req, res) => {
  try {
    const turnos = await Turno.findByPaciente(req.params.pacienteId);
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos del paciente:', error);
    res.status(500).json({ error: 'Error al obtener turnos del paciente' });
  }
};

exports.getByProfesional = async (req, res) => {
  try {
    const { fecha } = req.query;
    const turnos = await Turno.findByProfesional(req.params.profesionalId, fecha);
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos del profesional:', error);
    res.status(500).json({ error: 'Error al obtener turnos del profesional' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_agenda, id_paciente, descripcion, fecha_hora, duracion_min, estado } = req.body;
    
    const turno = await Turno.create({
      id_agenda,
      id_paciente,
      descripcion,
      fecha_hora,
      duracion_min,
      estado
    });
    
    res.status(201).json(turno);
  } catch (error) {
    console.error('Error al crear turno:', error);
    res.status(500).json({ error: 'Error al crear turno' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id_paciente, descripcion, fecha_hora, estado } = req.body;
    
    const turno = await Turno.update(req.params.id, {
      id_paciente,
      descripcion,
      fecha_hora,
      estado
    });
    
    res.json(turno);
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    res.status(500).json({ error: 'Error al actualizar turno' });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    const { estado, diagnostico, tratamiento, notas } = req.body;
    
    // Actualizar estado del turno
    const turno = await Turno.updateEstado(req.params.id, estado);
    
    // Si se marca como atendido y se proporcionan datos médicos, crear registro de atención
    if (estado === 'atendido' && (diagnostico || tratamiento || notas)) {
      await Atencion.create({
        id_turno: req.params.id,
        id_emergencia: null,
        diagnostico,
        tratamiento,
        notas,
        usuario_registro: req.usuario.id_usuario
      });
    }
    
    res.json(turno);
  } catch (error) {
    console.error('Error al actualizar estado del turno:', error);
    res.status(500).json({ error: 'Error al actualizar estado del turno' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Turno.delete(req.params.id);
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    res.status(500).json({ error: 'Error al eliminar turno' });
  }
};

exports.getTurnosDisponibles = async (req, res) => {
  try {
    const { agendaId } = req.params;
    
    const disponibles = await Turno.getTurnosDisponibles(agendaId);
    res.json(disponibles);
  } catch (error) {
    console.error('Error al obtener turnos disponibles:', error);
    res.status(500).json({ error: 'Error al obtener turnos disponibles' });
  }
};
