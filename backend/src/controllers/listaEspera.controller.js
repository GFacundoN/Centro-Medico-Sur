const ListaEspera = require('../models/ListaEspera');

exports.getAll = async (req, res) => {
  try {
    const lista = await ListaEspera.findAll();
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener lista de espera:', error);
    res.status(500).json({ error: 'Error al obtener lista de espera' });
  }
};

exports.getActivas = async (req, res) => {
  try {
    const lista = await ListaEspera.findActivas();
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener lista de espera activa:', error);
    res.status(500).json({ error: 'Error al obtener lista de espera activa' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ListaEspera.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_paciente } = req.body;
    
    const item = await ListaEspera.create({ id_paciente });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error al agregar a lista de espera:', error);
    res.status(500).json({ error: 'Error al agregar a lista de espera' });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    
    const item = await ListaEspera.updateEstado(req.params.id, estado);
    res.json(item);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

exports.delete = async (req, res) => {
  try {
    await ListaEspera.delete(req.params.id);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};
