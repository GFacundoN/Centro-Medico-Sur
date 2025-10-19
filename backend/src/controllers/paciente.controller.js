const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

exports.getById = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda' });
    }
    
    const pacientes = await Paciente.search(q);
    res.json(pacientes);
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    res.status(500).json({ error: 'Error al buscar pacientes' });
  }
};

exports.create = async (req, res) => {
  try {
    const { dni, nombre, apellido, fecha_nacimiento, telefono, email } = req.body;
    
    // Verificar si ya existe un paciente con ese DNI
    const existingPaciente = await Paciente.findByDni(dni);
    if (existingPaciente) {
      return res.status(400).json({ error: 'Ya existe un paciente con ese DNI' });
    }
    
    const paciente = await Paciente.create({
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email
    });
    
    res.status(201).json(paciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ error: 'Error al crear paciente' });
  }
};

exports.update = async (req, res) => {
  try {
    const { dni, nombre, apellido, fecha_nacimiento, telefono, email } = req.body;
    
    const paciente = await Paciente.update(req.params.id, {
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email
    });
    
    res.json(paciente);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Paciente.delete(req.params.id);
    res.json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
};

exports.getHistorial = async (req, res) => {
  try {
    const historial = await Paciente.getHistorial(req.params.id);
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};
