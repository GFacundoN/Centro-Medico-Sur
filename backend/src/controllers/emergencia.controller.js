const Emergencia = require('../models/Emergencia');

exports.getAll = async (req, res) => {
  try {
    const emergencias = await Emergencia.findAll();
    res.json(emergencias);
  } catch (error) {
    console.error('Error al obtener emergencias:', error);
    res.status(500).json({ error: 'Error al obtener emergencias' });
  }
};

exports.getActivas = async (req, res) => {
  try {
    const emergencias = await Emergencia.findActivas();
    res.json(emergencias);
  } catch (error) {
    console.error('Error al obtener emergencias activas:', error);
    res.status(500).json({ error: 'Error al obtener emergencias activas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const emergencia = await Emergencia.findById(req.params.id);
    
    if (!emergencia) {
      return res.status(404).json({ error: 'Emergencia no encontrada' });
    }
    
    res.json(emergencia);
  } catch (error) {
    console.error('Error al obtener emergencia:', error);
    res.status(500).json({ error: 'Error al obtener emergencia' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_paciente, id_profesional, id_consultorio, motivo, estado } = req.body;
    
    const emergencia = await Emergencia.create({
      id_paciente,
      id_profesional,
      id_consultorio,
      motivo,
      estado
    });
    
    res.status(201).json(emergencia);
  } catch (error) {
    console.error('Error al crear emergencia:', error);
    res.status(500).json({ error: 'Error al crear emergencia' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id_profesional, id_consultorio, motivo, estado } = req.body;
    
    const emergencia = await Emergencia.update(req.params.id, {
      id_profesional,
      id_consultorio,
      motivo,
      estado
    });
    
    res.json(emergencia);
  } catch (error) {
    console.error('Error al actualizar emergencia:', error);
    res.status(500).json({ error: 'Error al actualizar emergencia' });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    
    const emergencia = await Emergencia.updateEstado(req.params.id, estado);
    res.json(emergencia);
  } catch (error) {
    console.error('Error al actualizar estado de emergencia:', error);
    res.status(500).json({ error: 'Error al actualizar estado de emergencia' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Emergencia.delete(req.params.id);
    res.json({ message: 'Emergencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar emergencia:', error);
    res.status(500).json({ error: 'Error al eliminar emergencia' });
  }
};
