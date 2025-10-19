const Usuario = require('../models/Usuario');
const Profesional = require('../models/Profesional');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    
    // Para cada usuario profesional, obtener su especialidad
    const usuariosConEspecialidad = await Promise.all(
      usuarios.map(async (usuario) => {
        if (usuario.rol === 'profesional') {
          const profesional = await Profesional.findByUsuarioId(usuario.id_usuario);
          return { ...usuario, especialidad: profesional?.especialidad };
        }
        return usuario;
      })
    );
    
    res.json(usuariosConEspecialidad);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, email, rol, especialidad } = req.body;
    
    const usuario = await Usuario.update(req.params.id, { nombre, email, rol });
    
    // Si es profesional, actualizar especialidad
    if (rol === 'profesional' && especialidad) {
      const profesional = await Profesional.findByUsuarioId(req.params.id);
      if (profesional) {
        await Profesional.update(profesional.id_profesional, { especialidad });
      } else {
        await Profesional.create({ id_usuario: req.params.id, especialidad });
      }
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    await Usuario.updatePassword(req.params.id, newPassword);
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Usuario.delete(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};