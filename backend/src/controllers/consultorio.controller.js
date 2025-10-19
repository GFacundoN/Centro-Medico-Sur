const Consultorio = require('../models/Consultorio');
const Sector = require('../models/Sector');

exports.getAll = async (req, res) => {
  try {
    const consultorios = await Consultorio.findAll();
    res.json(consultorios);
  } catch (error) {
    console.error('Error al obtener consultorios:', error);
    res.status(500).json({ error: 'Error al obtener consultorios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const consultorio = await Consultorio.findById(req.params.id);
    
    if (!consultorio) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }
    
    res.json(consultorio);
  } catch (error) {
    console.error('Error al obtener consultorio:', error);
    res.status(500).json({ error: 'Error al obtener consultorio' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, id_sector } = req.body;
    
    const consultorio = await Consultorio.create({ nombre, id_sector });
    res.status(201).json(consultorio);
  } catch (error) {
    console.error('Error al crear consultorio:', error);
    res.status(500).json({ error: 'Error al crear consultorio' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, id_sector } = req.body;
    
    const consultorio = await Consultorio.update(req.params.id, { nombre, id_sector });
    res.json(consultorio);
  } catch (error) {
    console.error('Error al actualizar consultorio:', error);
    res.status(500).json({ error: 'Error al actualizar consultorio' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Consultorio.delete(req.params.id);
    res.json({ message: 'Consultorio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar consultorio:', error);
    res.status(500).json({ error: 'Error al eliminar consultorio' });
  }
};

exports.getAllSectores = async (req, res) => {
  try {
    const sectores = await Sector.findAll();
    res.json(sectores);
  } catch (error) {
    console.error('Error al obtener sectores:', error);
    res.status(500).json({ error: 'Error al obtener sectores' });
  }
};
