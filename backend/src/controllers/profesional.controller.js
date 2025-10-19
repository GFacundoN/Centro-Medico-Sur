const Profesional = require('../models/Profesional');

exports.getAll = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll();
    res.json(profesionales);
  } catch (error) {
    console.error('Error al obtener profesionales:', error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
};

exports.getById = async (req, res) => {
  try {
    const profesional = await Profesional.findById(req.params.id);
    
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    
    res.json(profesional);
  } catch (error) {
    console.error('Error al obtener profesional:', error);
    res.status(500).json({ error: 'Error al obtener profesional' });
  }
};

exports.update = async (req, res) => {
  try {
    const { especialidad } = req.body;
    
    const profesional = await Profesional.update(req.params.id, { especialidad });
    res.json(profesional);
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    res.status(500).json({ error: 'Error al actualizar profesional' });
  }
};
